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
