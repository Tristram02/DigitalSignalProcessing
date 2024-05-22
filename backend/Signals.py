import numpy as np
from Windows import functions

class Signals:
    amplitude = 0.5
    T = 0
    f = 16
    d = 4
    t1 = 0
    kw = 0
    ts = 0
    P = 0
    windows = functions

    def UniformDistributionNoise(self):
        time = np.linspace(0, int(self.d), int(self.f) * int(self.d))
        noise = np.random.uniform(-self.amplitude, self.amplitude, int(self.f) * int(self.d))
        return noise, time, False

    def GaussianNoise(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        noise = (np.random.normal(size=int(self.f) *int( self.d)) * 2 - 1) * self.amplitude
        return noise, time, False

    def SinusoidalSignal(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = self.amplitude * np.sin((2 * np.pi / self.T) * (time - self.t1))
        return signal, time, False

    def HalfWaveSinusoidalSignal(self):
        t = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = 0.5 * self.amplitude * (
                np.sin((2 * np.pi / self.T) * (t - self.t1)) + np.abs(np.sin((2 * np.pi / self.T) * (t - self.t1))))

        return signal, t, False

    def FullWaveSinusoidalSignal(self):
        t = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = self.amplitude * np.abs(np.sin((2 * np.pi / self.T) * (t - self.t1)))
        return signal, t, False

    def RectangularSignal(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = []
        for t in time:
            k = int((t / self.T) - (self.t1 / self.T))
            if t >= (k * self.T + self.t1) and t < (self.kw * self.T + k * self.T + self.t1):
                signal.append(self.amplitude)
            else:
                signal.append(0)
        return signal, time, False

    def RectangularSymmetricalSignal(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = []
        for t in time:
            k = int((t / self.T) - (self.t1 / self.T))
            if t >= (k * self.T + self.t1) and t < (self.kw * self.T + k * self.T + self.t1):
                signal.append(self.amplitude)
            else:
                signal.append(-self.amplitude)
        return signal, time, False

    def TriangularSignal(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = []
        for t in time:
            k = int((t / self.T) - (self.t1 / self.T))
            if t >= (k * self.T + self.t1) and t < (self.kw * self.T + k * self.T + self.t1):
                signal.append((self.amplitude / (self.kw * self.T)) * (t - k * self.T - self.t1))
            else:
                signal.append(-self.amplitude / (self.T * (1 - self.kw)) * (t - k * self.T - self.t1) + (
                        self.amplitude / (1 - self.kw)))
        return signal, time, False

    def UnitJump(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = []
        for t in time:
            if t > self.ts:
                signal.append(self.amplitude)
            elif (t == self.ts):
                signal.append(self.amplitude * 0.5)
            else:
                signal.append(0)
        return signal, time, False

    def UnitImpulse(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = []
        for t in time:
            if np.isclose(t, self.ts, atol=1e-2):
                signal.append(self.amplitude)
            else:
                signal.append(0)
        return signal, time, True

    def ImpulseNoise(self):
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
        signal = []
        for t in time:
            r = np.random.rand()
            if self.P > r:
                signal.append(self.amplitude)
            else:
                signal.append(0)
        return signal, time, True

    def ValidParameter(self, value):
        try:
            value = int(value)
            return isinstance(value, (int, float))
        except ValueError:
            return False

    def SetParameters(self, params):
        if self.ValidParameter(params['A']):
            self.amplitude = float(params['A'])
        if self.ValidParameter(params['T']):
            self.T = float(params['T'])
        if self.ValidParameter(params['f']):
            self.f = float(params['f'])
        if self.ValidParameter(params['d']):
            self.d = float(params['d'])
        if self.ValidParameter(params['t1']):
            self.t1 = float(params['t1'])
        if self.ValidParameter(params['kw']):
            self.kw = float(params['kw'])
        if self.ValidParameter(params['ts']):
            self.ts = float(params['ts'])
        if self.ValidParameter(params['P']):
            self.P = float(params['P'])

#############################################################################
    def round_quantize(self, signal: list[float], Ql):
        min_val = np.min(signal)
        max_val = np.max(signal)

        levels = np.linspace(min_val, max_val, int(Ql))

        quantized_signal = np.round((np.array(signal) - min_val) / (max_val - min_val) * (int(Ql) - 1))
        quantized_signal = levels[quantized_signal.astype(int)]

        return quantized_signal

    def truncate_quantize(self, signal: list[float], Ql):
        min_val = np.min(signal)
        max_val = np.max(signal)

        levels = np.linspace(min_val, max_val, int(Ql))

        quantized_signal = np.floor((np.array(signal) - min_val) / (max_val - min_val) * (int(Ql) - 1))
        quantized_signal = levels[quantized_signal.astype(int)]

        return quantized_signal

##########################################################################################

    def zero_order_hold(self, signal: list[float], time: list[float], original_time):
        reconstructed_signal = []
        for t in original_time:
            index = next((i for i, t_ in enumerate(time) if t_ > t), len(time) - 1)

            reconstructed_signal.append(signal[index - 1])

        return reconstructed_signal, original_time

    def first_order_hold(self, signal: list[float], time: list[float], original_time):
        reconstructed_signal = []
        for t in original_time:
            index = next((i for i, t_ in enumerate(time) if t_ > t), len(time) - 1)

            if index == 0:
                reconstructed_signal.append(signal[0])
            else:
                slope = (signal[index] - signal[index - 1]) / (time[index] - time[index - 1])
                interpolated_value = signal[index - 1] + slope * (t - time[index - 1])
                reconstructed_signal.append(interpolated_value)

        return reconstructed_signal, original_time

    def sinc(self, t):
        if t == 0.0:
            return 1.0
        else:
            return np.sin(np.pi * t) / (np.pi * t)

    def sinc_reconstructed_value(self, signal, t, N):
        index = int(np.floor((t - signal['time'][0]) / (signal['time'][-1] - signal['time'][0]) * len(signal['data'])))

        first_sample = max(0, index - int(N) // 2)
        last_sample = min(len(signal['data']), first_sample + int(N))

        step = (signal['time'][-1] - signal['time'][0]) / len(signal['data'])
        sum_val = 0.0
        for i in range(first_sample, last_sample):
            sum_val += signal['data'][i] * self.sinc(t / step - i)

        return sum_val

    def sinc_reconstruction(self, signal, N, original_time):
        reconstructed_signal = [self.sinc_reconstructed_value(signal, t, N) for t in original_time]
        return reconstructed_signal, original_time

##########################################################################################################################

    def low_pass_filter(self, sample_rate, M, fo, window):

        if M % 2 == 0:
            raise ValueError("M must be an odd value!")
        K = float(sample_rate / fo)
        time = np.linspace(0, float(M) * (1.0 / sample_rate), int(M))

        M = int(M)
        result = np.zeros(M)
        for n in range(M):
            c = (M - 1) // 2  # center sample
            if n == c:
                result[n] = 2.0 / K
            else:
                result[n] = np.sin(2.0 * np.pi * (n - c) / K) / (np.pi * (n - c))
            result[n] *= self.windows[window](M)

        return result, time, True

    def high_pass_filter(self, sample_rate, M, fo, window):
        if M % 2 == 0:
            raise ValueError("M must be an odd value!")
        K = sample_rate / fo
        time = np.linspace(0, float(M) * (1.0 / sample_rate), int(M))

        c = (M - 1) // 2  # center sample
        M = int(M)
        result = np.zeros(M)
        for n in range(M):
            if n == c:
                result[n] = 2 / K
            else:
                result[n] = np.sin(2 * np.pi * (n - c) / K) / (np.pi * (n - c))
            result[n] *= (-1) if n & 0x01 else 1
            result[n] *= self.windows[window](M)

        return result, time, True

    def band_pass_filter(self, sample_rate, M, fo, window):
        if M % 2 == 0:
            raise ValueError("M must be an odd value!")
        K = sample_rate / fo
        time = np.linspace(0, float(M) * (1.0 / sample_rate), int(M))

        c = (M - 1) // 2  # center sample
        M = int(M)
        result = np.zeros(M)
        for n in range(M):
            if n == c:
                result[n] = 2 / K
            else:
                result[n] = np.sin(2 * np.pi * (n - c) / K) / (np.pi * (n - c))
            result[n] *= 2 * np.sin(np.pi * n / 2)
        result *= self.windows[window](M)

        return result, time, True