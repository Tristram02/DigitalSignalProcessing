from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from Signals import Signals
from Operations import Operations
import numpy as np
from time import time
from Simulation import Environment, DistanceSensor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)
signal = Signals()
operation = Operations()

state = {
    'pause': False,
}

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
    avg = operation.Average(signal, float(params['t1']), float(params['t1']) + float(params['d']), discrete)
    avgabs = operation.AverageAbsolute(signal, float(params['t1']), float(params['t1']) + float(params['d']), discrete)
    eff = operation.EffectiveVariance(signal, float(params['t1']), float(params['t1']) + float(params['d']), discrete)
    var = operation.Variance(signal, float(params['t1']), float(params['t1']) + float(params['d']), discrete)
    power = operation.AveragePower(signal, float(params['t1']), float(params['t1']) + float(params['d']), discrete)

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

    signal = params['signal']
    duration = float(params['signal']['params']['d'])
    sample_rate = int(params['sample_rate'])
    num_samples = int(sample_rate * duration)
    step_size = max(1, len(signal['data']) // num_samples)
    sampled_signal = [signal['data'][i] for i in range(0, len(signal['data']), step_size)]
    sampled_time = np.linspace(0, duration, len(sampled_signal))

    return jsonify({'noise': sampled_signal, 'time': sampled_time.tolist(), 'discrete': True}), 200

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


@app.route('/filter/<option>', methods=['POST'])
def filter(option: int):
    params = request.get_json()
    signal.SetParameters(params['params'])
    option = int(option)
    if option == 0:
        n, t, d = signal.low_pass_filter(float(params['params']['fp']), float(params['params']['M']), float(params['params']['fo']), float(params['params']['window']))
    elif option == 1:
        n, t, d = signal.band_pass_filter(float(params['params']['fp']), float(params['params']['M']), float(params['params']['fo']), float(params['params']['window']))
    else:
        n, t, d = signal.high_pass_filter(float(params['params']['fp']), float(params['params']['M']), float(params['params']['fo']), float(params['params']['window']))

    if type(n) is not list:
        n = n.tolist()
    if type(t) is not list:
        t = t.tolist()
    return jsonify({'data': n, 'time': t, 'discrete': d}), 200


@app.route('/convolution', methods=['POST'])
def convolution():
    params = request.get_json()
    n = operation.Convolution(params['h']['data'], params['x']['data'])
    t = np.linspace(0, len(n) / int(params['h']['params']['fp']), len(n))
    if type(n) is not list:
        n = n.tolist()
    if type(t) is not list:
        t = t.tolist()
    return jsonify({'data': n, 'time': t, 'discrete': True}), 200

@app.route('/correlation', methods=['POST'])
def correlation():
    params = request.get_json()
    n = operation.Correlation(params['h']['data'], params['x']['data'])
    t = np.linspace(0, len(n) / int(params['h']['params']['fp']), len(n))
    if type(n) is not list:
        n = n.tolist()
    if type(t) is not list:
        t = t.tolist()
    return jsonify({'data': n, 'time': t, 'discrete': True}), 200

@socketio.on('start_simulation')
def simulate(params):
    signal.SetParameters(params['params'])
    distance_sensor = DistanceSensor(
        probe_signal_term=float(params['params']['probeTerm']),
        buffer_length=float(params['params']['buffor']),
        sample_rate=float(params['params']['fp']),
        signal_velocity=float(params['params']['signalVelocity']),
        report_term=float(params['params']['report']),
        starting_distance=float(params['params']['startingDistance'])
    )
    environment = Environment(
        time_step=float(params['params']['timeStep']),
        sample_rate=float(params['params']['fp']),
        signal_velocity=float(params['params']['signalVelocity']),
        item_velocity=float(params['params']['itemVelocity']),
        distance_sensor=distance_sensor,
        start_item_distance=float(params['params']['startingDistance'])
    )

    for i in range(300):
        if not state['pause']:
            environment.step()
            if distance_sensor.correlation_signal is not None:
                correlation_signal = distance_sensor.correlation_signal
            else:
                correlation_signal = None
            result = {
                "time": environment.timestamp,
                "actual_distance": environment.item_distance,
                "estimated_distance": distance_sensor.distance,
                "probe_signal": distance_sensor.discrete_probe_signal,
                "feedback_signal": distance_sensor.discrete_feedback_signal.tolist(),
                "correlation_signal": correlation_signal,
                "all_times": np.linspace(environment.timestamp - 2, environment.timestamp + 2, len(distance_sensor.discrete_probe_signal)).tolist(),
                "correlation_time": np.linspace(environment.timestamp - 2, environment.timestamp + 2,
                                                len(distance_sensor.correlation_signal) if distance_sensor.correlation_signal is not None else 0).tolist(),
            }

            emit('simulation_data', result)
            socketio.sleep(0.1)

@socketio.on('pause_simulation')
def pause_simulation():
    state['pause'] = True

@socketio.on('resume_simulation')
def resume_simulation():
    state['pause'] = False

def prepare_output(transformed_signal):
    real_parts = [val.real for val in transformed_signal]
    imag_parts = [val.imag for val in transformed_signal]
    magnitudes = [abs(val) for val in transformed_signal]
    phases = [np.arctan2(val.imag, val.real) for val in transformed_signal]
    return real_parts, imag_parts, magnitudes, phases

@app.route('/dft', methods=['POST'])
def dft_endpoint():
    data = request.json
    signal = [complex(float(val), 0) for val in data['signal']['data']]
    start_time = time()
    transformed_signal = operation.dft(signal)
    end_time = time()
    execution_time = end_time - start_time
    real_parts, imag_parts, magnitudes, phases = prepare_output(transformed_signal)
    signal_time = np.linspace(0, float(data['signal']['params']['d']), len(real_parts)).tolist()
    return jsonify({'real_parts': real_parts, 'imag_parts': imag_parts, 'magnitudes': magnitudes, 'phases': phases,
                    'time': signal_time, 'execution_time': execution_time}), 200

@app.route('/fft', methods=['POST'])
def fft_endpoint():
    data = request.json
    signal = [complex(float(val), 0) for val in data['signal']['data']]
    start_time = time()
    transformed_signal = operation.fft(signal)
    end_time = time()
    execution_time = end_time - start_time
    real_parts, imag_parts, magnitudes, phases = prepare_output(transformed_signal)
    signal_time = np.linspace(0, float(data['signal']['params']['d']), len(real_parts)).tolist()
    return jsonify({'real_parts': real_parts, 'imag_parts': imag_parts, 'magnitudes': magnitudes, 'phases': phases,
                    'time': signal_time, 'execution_time': execution_time}), 200


@app.route('/dct', methods=['POST'])
def dct_endpoint():
    data = request.json
    signal = [float(val) for val in data['signal']['data']]

    start_time = time()
    transformed_signal = operation.dct(signal)
    end_time = time()

    execution_time = end_time - start_time
    signal_time = np.linspace(0, float(data['signal']['params']['d']), len(transformed_signal)).tolist()
    return jsonify({'real_parts': transformed_signal,
                    'time': signal_time, 'execution_time': execution_time}), 200


@app.route('/fct', methods=['POST'])
def fct_endpoint():
    data = request.json
    signal = [float(val) for val in data['signal']['data']]

    start_time = time()
    transformed_signal = operation.fct(signal)
    end_time = time()

    execution_time = end_time - start_time
    signal_time = np.linspace(0, float(data['signal']['params']['d']), len(transformed_signal)).tolist()
    return jsonify({'real_parts': transformed_signal.tolist(),
                    'time': signal_time, 'execution_time': execution_time}), 200


@app.route('/fwht', methods=['POST'])
def fwht_endpoint():
    data = request.json
    signal = [float(val) for val in data['signal']['data']]

    start_time = time()
    transformed_signal = operation.fwht(signal)
    end_time = time()

    execution_time = end_time - start_time
    signal_time = np.linspace(0, float(data['signal']['params']['d']), len(transformed_signal)).tolist()
    return jsonify({'real_parts': transformed_signal,
                    'time': signal_time, 'execution_time': execution_time}), 200


@app.route('/wht', methods=['POST'])
def wht_endpoint():
    data = request.json
    signal = [float(val) for val in data['signal']['data']]

    start_time = time()
    transformed_signal = operation.wht(signal)
    end_time = time()

    execution_time = end_time - start_time

    signal_time = np.linspace(0, float(data['signal']['params']['d']), len(transformed_signal)).tolist()
    return jsonify({'real_parts': transformed_signal.tolist(),
                    'time': signal_time, 'execution_time': execution_time}), 200


if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True)
    app.run(debug=True)