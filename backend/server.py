from flask import Flask, jsonify, request
from flask_cors import CORS
from Signals import Signals
from Operations import Operations
import numpy as np
import codecs, json

app = Flask(__name__)
CORS(app)
signal = Signals()
operation = Operations()

signal_functions = {
    1: lambda: signal.UniformDistributionNoise(),
    2: lambda: signal.GaussianNoise(),
    3: lambda: signal.SinusoidalSignal(),
    4: lambda: signal.HalfWaveSinusoidalSignal(),
    5: lambda: signal.FullWaveSinusoidalSignal(),
    6: lambda: signal.RectangularSignal(),
    7: lambda: signal.RectangularSymmetricalSignal(),
    8: lambda: signal.TriangularSignal(),
    9: lambda: signal.UnitJump(),
    10: lambda: signal.UnitImpulse(),
    11: lambda: signal.ImpulseNoise(),
}


def Calculate(signal, params, discrete):
    avg = operation.Average(signal, params['t1'], params['t1'] + params['d'], discrete)
    avgabs = operation.AverageAbsolute(signal, params['t1'], params['t1'] + params['d'], discrete)
    eff = operation.EffectiveVariance(signal, params['t1'], params['t1'] + params['d'], discrete)
    var = operation.Variance(signal, params['t1'], params['t1'] + params['d'], discrete)
    power = operation.AveragePower(signal, params['t1'], params['t1'] + params['d'], discrete)

    values = {'avg': avg, 'avgabs': avgabs, 'eff': eff, 'var': var, 'power': power}
    return values

def CalculateDiffrences(original, reconstructed):
    mse = operation.MeanSquareError(original, reconstructed)
    snr = operation.SignalToNoiseRatio(original, reconstructed)
    psnr = operation.PeakSignalToNoiseRatio(original, reconstructed)
    md = operation.MaximumDifference(original, reconstructed)
    enob = operation.EffectiveNumberOfBits(original, reconstructed)

    comparedValues = {'mse': mse, 'snr': snr, 'psnr': psnr, 'md': md, 'enob': enob}
    return comparedValues

@app.route('/signal/<option>', methods=['POST'])
def create_signal(option: int):
    params = request.get_json()

    for param in params:
        try:
            params[param] = float(params[param])
        except ValueError:
            print("Could not convert value to float")

    option = int(option)
    if option in signal_functions:
        signal.SetParameters(params)
        n, t, b = signal_functions[option]()
        values = Calculate(n, params, b)
        if type(n) is list:
            return jsonify({'noise': n, 'time': t.tolist(), 'values': values, 'discrete': b}), 200
        else:
            return jsonify({'noise': n.tolist(), 'time': t.tolist(), 'values': values, 'discrete': b}), 200
    else:
        return jsonify({'error': 'option not found'}), 400

@app.route('/operation/<option>', methods=['POST'])
def do_operation(option: int):
    params = request.get_json()

    if (len(params['firstSignal']['data']) != len(params['secondSignal']['data']) or
            len(params['firstSignal']['time']) != len(params['secondSignal']['time'])):
        return jsonify({'error': 'data mismatch'}), 400

    functions = {
        1: lambda signal1, signal2: operation.Sum(signal1, signal2),
        2: lambda signal1, signal2: operation.Subtract(signal1, signal2),
        3: lambda signal1, signal2: operation.Multiply(signal1, signal2),
        4: lambda signal1, signal2: operation.Divide(signal1, signal2),
    }
    option = int(option)
    if option in functions:
        n = functions[option](params['firstSignal']['data'], params['secondSignal']['data'])
        discrete = (params['firstSignal']['discrete'] or params['secondSignal']['discrete'])
        values = Calculate(n, params['firstSignal']['params'], discrete)
        if type(n) is list:
            return jsonify({'noise': n, 'time': params['firstSignal']['time'], 'values': values, 'discrete': (params['firstSignal']['discrete'] or params['secondSignal']['discrete'])}), 200
        else:
            return jsonify({'noise': n.tolist(), 'time': params['firstSignal']['time'], 'values': values, 'discrete': (params['firstSignal']['discrete'] or params['secondSignal']['discrete'])}), 200
    else:
        return jsonify({'error': 'option not found'}), 400

@app.route('/sampling/<function_number>', methods=['POST'])
def sampling(function_number: int):
    params = request.get_json()
    if bool(params['signal']['discrete']):
        return jsonify({"error": "Discrete signal cannot be sampled"}), 400

    for param in params['signal']['params']:
        try:
            params['signal']['params'][param] = float(params['signal']['params'][param])
        except ValueError:
            print("Could not convert value to float")

    signal.SetParameters(params['signal']['params'])
    signal.f = params['sample_rate']

    n, t, b = signal_functions[int(function_number)]()

    if type(n) is list:
        return jsonify({'noise': n, 'time': t.tolist(), 'discrete': True}), 200
    else:
        return jsonify({'noise': n.tolist(), 'time': t.tolist(), 'discrete': True}), 200

@app.route('/quantization/<option>', methods=['POST'])
def quantizate(option: int):
    params = request.get_json()

    if not bool(params['signal']['discrete']):
        return jsonify({"error": "Cannot quantizate not discrete signal"}), 400

    if int(option) % 2:
        n = signal.truncate_quantize(params['signal']['data'], params['quantization_level'])
    else:
        n = signal.round_quantize(params['signal']['data'], params['quantization_level'])

    if type(n) is list:
        return jsonify({'data': n}), 200
    else:
        return jsonify({'data': n.tolist()}), 200

@app.route('/reconstruction/<option>', methods=['POST'])
def reconstruction(option: int):
    params = request.get_json()

    if not bool(params['signal']['discrete']):
        return jsonify({"error": "Cannot reconstruct not discrete signal"}), 400

    originalTime = np.linspace(0, int(params['signal']['params']['d']), int(params['signal']['params']['f']) * int(params['signal']['params']['d']))
    if int(option) % 3 == 0:
        n, t = signal.zero_order_hold(params['signal']['data'], params['signal']['time'], originalTime)
    elif int(option) % 3 == 1:
        n, t = signal.first_order_hold(params['signal']['data'], params['signal']['time'], originalTime)
    else:
        n, t = signal.sinc_reconstruction(params['signal'], params['sinc'], originalTime)

    if type(n) is not list:
        n = n.tolist()
    if type(t) is not list:
        t = t.tolist()
    return jsonify({'data': n, 'time': t}), 200

@app.route('/compare', methods=['POST'])
def compare():
    params = request.get_json()
    values = CalculateDiffrences(params['original']['data'], params['reconstructed']['data'])
    if values is not None:
        return jsonify({'values': values}), 200
    else:
        return jsonify({'values': None}), 400

if __name__ == '__main__':
    app.run(debug=True)