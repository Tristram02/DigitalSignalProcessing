import sys

import numpy as np
from typing import Callable


class Operations:

    def Sum(self, signal1: list[float], signal2: list[float]):
        finalSignal = []

        for i in range(len(signal1)):
            finalSignal.append((signal1[i] + signal2[i]))

        return finalSignal

    def Subtract(self, signal1: list[float], signal2: list[float]):
        finalSignal = []

        for i in range(len(signal1)):
            finalSignal.append(signal1[i] - signal2[i])

        return finalSignal

    def Multiply(self, signal1: list[float], signal2: list[float]):
        finalSignal = []

        for i in range(len(signal1)):
            finalSignal.append(signal1[i] * signal2[i])

        return finalSignal

    def Divide(self, signal1: list[float], signal2: list[float]):
        finalSignal = []

        for i in range(len(signal1)):
            if signal2[i] != 0:
                finalSignal.append(signal1[i] / signal2[i])
            else:
                finalSignal.append(0)

        return finalSignal

    ####################################################

    def Summation(self, samples: list[float], f: Callable[[float], float] = None):
        sum = 0
        for s in samples:
            if f is not None:
                sum += f(s)
            else:
                sum += s
        return sum

    def Integral(self, dx: float, samples: list[float], f: Callable[[float], float] = None):
        integral = 0
        for s in samples:
            if f is not None:
                integral += f(s)
            else:
                integral += s
        integral *= dx

        return integral

    ####################################################

    def Average(self, samples: list[float], t1: float = 0, t2: float = 0, discrete: bool = False):
        average = 0

        if discrete:
            average = 1 / len(samples) * self.Summation(samples)
        else:
            average = 1 / (t2 - t1) * self.Integral(np.abs((t2 - t1) / len(samples)), samples)

        return average

    def AverageAbsolute(self, samples: list[float], t1: float = 0, t2: float = 0, discrete: bool = False):
        a = 0

        if discrete:
            a = 1 / len(samples) * self.Summation(samples, np.abs)
        else:
            a = 1 / (t2 - t1) * self.Integral(np.abs((t2 - t1) / len(samples)), samples, np.abs)

        return a

    def AveragePower(self, samples: list[float], t1: float = 0, t2: float = 0, discrete: bool = False):
        power = 0

        if discrete:
            power = 1 / len(samples) * self.Summation(samples, lambda x: x * x)
        else:
            power = 1 / (t2 - t1) * self.Integral(np.abs((t2 - t1) / len(samples)), samples, lambda x: x * x)

        return power

    def Variance(self, samples: list[float], t1: float, t2: float, discrete: bool = False):
        variance = 0

        if discrete:
            variance = 1 / len(samples) * self.Summation(samples, lambda x: np.power(
                x - self.Average(samples=samples, discrete=True), 2))
        else:
            variance = 1 / (t2 - t1) * self.Integral(np.abs((t2 - t1) / len(samples)), samples, lambda x: np.power(
                x - self.Average(samples=samples, t1=t1, t2=t2, discrete=discrete), 2))

        return variance

    def EffectiveVariance(self, samples: list[float], t1: float, t2: float, discrete: bool = False):
        variance = 0

        if discrete:
            variance = np.sqrt(self.AveragePower(samples=samples, discrete=discrete))
        else:
            variance = np.sqrt(self.AveragePower(samples=samples, t1=t1, t2=t2, discrete=discrete))

        return variance

    ##################################################################

    def MeanSquareError(self, original, reconstructed):
        if len(original) != len(reconstructed):
            return None
        sum = 0.0
        for i in range(len(original)):
            sum += (reconstructed[i] - original[i]) ** 2

        return sum / len(original)

    def SignalToNoiseRatio(self, original, reconstructed):
        if len(original) != len(reconstructed):
            return None

        sum_1 = 0.0
        sum_2 = 0.0

        for i in range(len(original)):
            sum_1 += (reconstructed[i]) ** 2
            sum_2 += (original[i] - reconstructed[i]) ** 2

        return 10.0 * np.log10((sum_1 / sum_2 if sum_2 else np.nan))

    def PeakSignalToNoiseRatio(self, original, reconstructed):
        if len(original) != len(reconstructed):
            return None

        max = sys.float_info.min
        sum = 0.0

        for i in range(len(original)):
            if reconstructed[i] > max:
                max = reconstructed[i]
            sum += (reconstructed[i] - original[i]) ** 2

        return 10.0 * np.log10(max / (sum / len(reconstructed)) if sum else np.nan)

    def MaximumDifference(self, original, reconstructed):
        if len(original) != len(reconstructed):
            return None

        max_diff = sys.float_info.min
        for i in range(len(original)):
            diff = np.abs(original[i] - reconstructed[i])
            if diff > max_diff:
                max_diff = diff

        return max_diff

    def EffectiveNumberOfBits(self, original, reconstructed):
        print(len(reconstructed))
        print(len(original))
        try:
            return (self.SignalToNoiseRatio(reconstructed, original) - 1.76) / 6.02
        except:
            return None

    ##################################################################

    def Convolution(self, h, x):
        finalSignal = []

        M = len(h)
        N = len(x)

        # Convolve h and x
        for i in range(M + N - 1):
            sum = 0.0
            startK = max(0, i - N + 1)
            endK = min(M, i + 1)
            for k in range(startK, endK):
                sum += h[k] * x[i - k]
            finalSignal.append(sum)

        return finalSignal

    def Correlation(self, h, x):
        finalSignal = []
        M = len(h)  # number of samples in h
        N = len(x)  # number of samples in x

        # Compute correlation of h and x
        for i in range(0, M + N - 1):
            i_real = i - (N - 1)  # translate to real indexes
            sum = 0.0
            startK = max(0, i_real)
            endK = min(M, N + i_real)
            for k in range(startK, endK):
                sum += h[k] * x[k - i_real]
            finalSignal.append(sum)

        return finalSignal

    ############################################################

    def dft(self, signal):
        N = len(signal)
        Warg = 2.0 * np.pi / N
        W = np.exp(-1j * Warg)
        transformed_signal = []

        for m in range(N):
            sum_val = complex(0.0)
            for n in range(N):
                sum_val += signal[n] * (W ** (m * n))
            transformed_signal.append(sum_val / N)

        return transformed_signal

    def fft(self, signal):
        signal = self.mix_samples(signal)
        W = self.calculate_vector_of_w_params(len(signal))

        N = 2
        while N <= len(signal):
            for i in range(len(signal) // N):
                for m in range(N // 2):
                    offset = i * N
                    tmp = signal[offset + m + N // 2] * self.retrieve_w_from_vector(N, -m, W)
                    signal[offset + m + N // 2] = signal[offset + m] - tmp
                    signal[offset + m] = signal[offset + m] + tmp
            N *= 2

        return signal

    def retrieve_w_from_vector(self, N, k, vectorW):
        k = k % N
        if k < 0:
            k += N

        k = k * ((len(vectorW) * 2) // N)
        if k < len(vectorW):
            return vectorW[k]
        else:
            return vectorW[k - len(vectorW)] * -1

    def calculate_vector_of_w_params(self, N):
        Warg = 2.0 * np.pi / N
        W = np.exp(-1j * Warg)
        allW = [W ** i for i in range(N // 2)]
        return allW

    def mix_samples(self, samples):
        N = len(samples)
        numberOfBits = N.bit_length() - 1

        for i in range(N):
            newIndex = self.reverse_bits(i, numberOfBits)
            if newIndex > i:
                samples[i], samples[newIndex] = samples[newIndex], samples[i]
        return samples

    def reverse_bits(self, value, numberOfBits):
        reversed_value = 0
        for i in range(numberOfBits):
            if (value >> i) & 1:
                reversed_value |= 1 << (numberOfBits - 1 - i)
        return reversed_value

    # Discrete Cosine Transform
    def dct(self, signal):
        N = len(signal)
        transformed_signal = []

        for m in range(N):
            sum_val = 0.0
            for n in range(N):
                sum_val += signal[n] * np.cos(np.pi * (2.0 * n + 1) * m / (2.0 * N))
            transformed_signal.append(self.c(m, N) * sum_val)

        return transformed_signal

    def c(self, m, N):
        if m == 0:
            return np.sqrt(1.0 / N)
        else:
            return np.sqrt(2.0 / N)

    # Fast Cosine Transform
    def fct(self, signal):
        N = len(signal)
        y = np.zeros(N)

        for i in range(N // 2):
            y[i] = signal[2 * i]
            y[N - 1 - i] = signal[2 * i + 1]

        fft_result = self.fft(y)
        Warg = -np.pi / (2.0 * N)
        W = np.exp(1j * Warg)
        transformed_signal = np.zeros(N)

        for m in range(N):
            transformed_signal[m] = (W ** m).real * self.c(m, N) * fft_result[m].real

        return transformed_signal

    # Fast Walsh-Hadamard Transform
    def fwht(self, signal):
        def mix(x, begin, end):
            N = end - begin
            if N == 1:
                return
            for i in range(N // 2):
                tmp = x[int(begin + i)]
                x[int(begin + i)] = tmp + x[int(begin + N // 2 + i)]
                x[int(begin + N // 2 + i)] = tmp - x[int(begin + N // 2 + i)]
            mix(x, begin, int(begin + N // 2))
            mix(x, int(begin + N // 2), end)

        mix(signal, 0, len(signal))
        return signal

    # Walsh-Hadamard Transform
    def wht(self, signal):
        def generate_hadamard_matrix(m):
            size = 1
            factor = 1.0
            H = np.array([1.0])
            for i in range(1, m + 1):
                size *= 2
                previous = H
                H = np.zeros(size * size)
                paste_matrix_into_matrix(previous, size // 2, H, size, 0, 0, factor)
                paste_matrix_into_matrix(previous, size // 2, H, size, 0, size // 2, factor)
                paste_matrix_into_matrix(previous, size // 2, H, size, size // 2, 0, factor)
                paste_matrix_into_matrix(previous, size // 2, H, size, size // 2, size // 2, -factor)
            return H

        def paste_matrix_into_matrix(src, src_size, dst, dst_size, row, col, factor):
            for i in range(src_size):
                for j in range(src_size):
                    dst[(i + row) * dst_size + (j + col)] = src[i * src_size + j] * factor

        m = int(np.round(np.log2(len(signal))))
        H = generate_hadamard_matrix(m)
        X = np.zeros(len(signal))
        for i in range(len(signal)):
            sum_val = 0.0
            for j in range(len(signal)):
                sum_val += signal[j] * H[i * len(signal) + j]
            X[i] = sum_val
        return X