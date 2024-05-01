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
