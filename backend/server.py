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

@app.route('/signal/<option>', methods=['POST'])
def create_signal(option: int):
    params = request.get_json()

    for param in params:
        try:
            params[param] = float(params[param])
        except ValueError:
            print("Could not convert value to float")

    functions = {
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
    option = int(option)
    if option in functions:
        signal.SetParameters(params)
        n, t, b = functions[option]()
        if type(n) is list:
            return jsonify({'noise': n, 'time': t.tolist()}), 200
        else:
            return jsonify({'noise': n.tolist(), 'time': t.tolist()}), 200
    else:
        return jsonify({'error': 'option not found'}), 400

@app.route('/operation/<option>', methods=['POST'])
def do_operation(option: int):
    params = request.get_json()

    if len(params['firstSignal']['data']) != len(params['secondSignal']['data']) or len(params['firstSignal']['time']) != len(params['secondSignal']['time']):
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
        if type(n) is list:
            return jsonify({'noise': n, 'time': params['firstSignal']['time']}), 200
        else:
            return jsonify({'noise': n.tolist(), 'time': params['firstSignal']['time']}), 200
    else:
        return jsonify({'error': 'option not found'}), 400

if __name__ == '__main__':
    app.run(debug=True)