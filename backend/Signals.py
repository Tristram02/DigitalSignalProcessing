import numpy as np
import struct


class Signals:
    amplitude = 0.5
    T = 0
    f = 16
    d = 4
    t1 = 0
    kw = 0
    ts = 0
    P = 0

    def UniformDistributionNoise(self):
        noise = np.random.uniform(-self.amplitude, self.amplitude, int(self.f) * int(self.d))
        time = np.linspace(0, int(self.d), int(self.f) * int(self.d))
        return noise, time, False

    def GaussianNoise(self):
        noise = (np.random.normal(size=int(self.f) *int( self.d)) * 2 - 1) * self.amplitude
        time = np.linspace(0, self.d, int(self.f) * int(self.d))
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
            self.amplitude = params['A']
        if self.ValidParameter(params['T']):
            self.T = params['T']
        if self.ValidParameter(params['f']):
            self.f = params['f']
        if self.ValidParameter(params['d']):
            self.d = params['d']
        if self.ValidParameter(params['t1']):
            self.t1 = params['t1']
        if self.ValidParameter(params['kw']):
            self.kw = params['kw']
        if self.ValidParameter(params['ts']):
            self.ts = params['ts']
        if self.ValidParameter(params['P']):
            self.P = params['P']


    def SaveToFile(self, filename, signal):
        with open(filename + '.bin', 'wb') as f:
            f.write(struct.pack('d', self.t1))
            f.write(struct.pack('d', self.f))
            f.write(struct.pack('i', len(signal)))
            for sample in signal:
                f.write(struct.pack('d', sample))

    def LoadFromFile(self, filename):
        with open(filename + '.bin', 'rb') as f:
            self.t1 = struct.unpack('d', f.read(8))[0]
            self.f = struct.unpack('d', f.read(8))[0]
            signal_len = struct.unpack('i', f.read(4))[0]
            signal = [struct.unpack('d', f.read(8))[0] for _ in range(signal_len)]
            self.d = signal_len / self.f
            time = np.linspace(0, self.d, int(self.f) * int(self.d))
        return signal, time
