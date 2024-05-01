import matplotlib.pyplot as plt
import os
from Signals import Signals
from Operations import Operations


class Interface:
    signal = Signals();
    operation = Operations()

    def ShowMenu(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("########################################################\n")
        print("1. Wygeneruj sygnal")
        print("2. Wykonaj operacje")
        print("3. Wczytaj sygnal z pliku")
        print("4. Opusc program\n")
        print("########################################################")

    def ShowSignalMenu(self, clear: bool = True):
        if clear:
            os.system('cls' if os.name == 'nt' else 'clear')
        print("########################################################\n")
        print("1. szum o rozkładzie jednostajnym")
        print("2. szum gaussowski")
        print("3. sygnał sinusoidalny")
        print("4. sygnał sinusoidalny wyprostowany jednopołówkowo")
        print("5. sygnał sinusoidalny wyprostowany dwupołówkowo")
        print("6. sygnał prostokątny")
        print("7. sygnał prostokątny symetryczny")
        print("8. sygnał trójkątny")
        print("9. skok jednostkowy")
        print("10. impuls jednostkowy")
        print("11. szum impulsowy\n")
        print("########################################################")

    def ShowOperationMenu(self, clear: bool = True):
        if clear:
            os.system('cls' if os.name == 'nt' else 'clear')
        print("########################################################\n")
        print("1. Dodawanie")
        print("2. Odejmowanie")
        print("3. Mnozenie")
        print("4. Dzielenie\n")
        print("########################################################")

    def ValidMenuInput(self, option):
        try:
            option = int(option)
            if 1 <= option <= 4:
                return True
            else:
                return False
        except ValueError:
            return False

    def ValidSignalMenuInput(self, option):
        try:
            option = int(option)
            if 1 <= option <= 11:
                return True
            else:
                return False
        except ValueError:
            return False

    def ValidOperationMenuInput(self, option):
        try:
            option = int(option)
            if 1 <= option <= 4:
                return True
            else:
                return False
        except ValueError:
            return False

    def ValidParameter(self, value):
        try:
            value = int(value)
            return isinstance(value, (int, float))
        except ValueError:
            return False

    def GetMenuOption(self):
        option = input("Choose option: ")
        while not self.ValidMenuInput(option=option):
            print("Wrong value! Try again")
            option = input()
        return int(option)

    def GetSignalMenuOption(self):
        option = input("Choose option: ")
        while not self.ValidSignalMenuInput(option=option):
            print("Wrong value! Try again")
            option = input()
        return int(option)

    def GetOperationMenuOption(self):
        option = input("Choose option: ")
        while not self.ValidOperationMenuInput(option=option):
            print("Wrong value! Try again")
            option = input()
        return int(option)

    def SetParameters(self):
        value = float(input("Amplitude: "))
        if self.ValidParameter(value):
            self.signal.amplitude = value
        value = float(input("T: "))
        if self.ValidParameter(value):
            self.signal.T = value
        value = float(input("f: "))
        if self.ValidParameter(value):
            self.signal.f = value
        value = float(input("d: "))
        if self.ValidParameter(value):
            self.signal.d = value
        value = float(input("t_1: "))
        if self.ValidParameter(value):
            self.signal.t1 = value
        value = float(input("k_w: "))
        if self.ValidParameter(value):
            self.signal.kw = value
        value = float(input("t_s: "))
        if self.ValidParameter(value):
            self.signal.ts = value
        value = float(input("P: "))
        if self.ValidParameter(value):
            self.signal.P = value

    def HandleOption(self, option: int):
        functions = {
            1: lambda: self.ShowSignalMenu(),
            2: lambda: self.ShowOperationMenu(),
            3: lambda: print(),
        }
        if option in functions:
            return functions[option]()
        else:
            print("Invalid option")

    def HandleSignalOption(self, option: int):
        functions = {
            1: lambda: self.signal.UniformDistributionNoise(),
            2: lambda: self.signal.GaussianNoise(),
            3: lambda: self.signal.SinusoidalSignal(),
            4: lambda: self.signal.HalfWaveSinusoidalSignal(),
            5: lambda: self.signal.FullWaveSinusoidalSignal(),
            6: lambda: self.signal.RectangularSignal(),
            7: lambda: self.signal.RectangularSymmetricalSignal(),
            8: lambda: self.signal.TriangularSignal(),
            9: lambda: self.signal.UnitJump(),
            10: lambda: self.signal.UnitImpulse(),
            11: lambda: self.signal.ImpulseNoise(),
        }
        if option in functions:
            self.SetParameters()
            return functions[option]()
        else:
            print("Invalid option")

    def HandleOperationOption(self, option: int, signal1: list[float] = None, signal2: list[float] = None, time1=None,
                              time2=None):
        functions = {
            1: lambda signal1, signal2: self.operation.Sum(signal1, signal2),
            2: lambda signal1, signal2: self.operation.Subtract(signal1, signal2),
            3: lambda signal1, signal2: self.operation.Multiply(signal1, signal2),
            4: lambda signal1, signal2: self.operation.Divide(signal1, signal2),
        }
        if option in functions:
            while True:

                if signal1 == None and signal2 == None:

                    self.ShowSignalMenu(False)
                    opt1 = self.GetSignalMenuOption()
                    signal1, time1, is_discr1 = self.HandleSignalOption(opt1)
                    d1 = self.signal.d
                    f1 = self.signal.f

                    self.ShowSignalMenu(False)
                    opt2 = self.GetSignalMenuOption()
                    signal2, time2, is_discr2 = self.HandleSignalOption(opt2)
                    d2 = self.signal.d
                    f2 = self.signal.f

                    self.GeneratePlot(signal1, time1, is_discr1)
                    self.GeneratePlot(signal2, time2, is_discr2)

                    if d1 != d2 or f1 != f2:
                        print("Parametry wprowadzone dla sygnalow nie zgadzaja sie!")
                        print("Wygeneruj je jeszcze raz")
                    else:
                        break
                else:
                    break
            return functions[option](signal1, signal2), time1
        else:
            print("Invalid option")

    def Calculate(self, signal):
        avg = self.operation.Average(signal, self.signal.t1, self.signal.t1 + self.signal.d)
        avgabs = self.operation.AverageAbsolute(signal, self.signal.t1, self.signal.t1 + self.signal.d)
        eff = self.operation.EffectiveVariance(signal, self.signal.t1, self.signal.t1 + self.signal.d)
        var = self.operation.Variance(signal, self.signal.t1, self.signal.t1 + self.signal.d)
        power = self.operation.AveragePower(signal, self.signal.t1, self.signal.t1 + self.signal.d)

        print("Wartosc srednia: ", avg)
        print("Wartosc srednia bezwzgledna: ", avgabs)
        print("Wartosc skuteczna: ", eff)
        print("Wariancja: ", var)
        print("Moc srednia: ", power)

    def GeneratePlot(self, signal, time, is_discr=False):
        if is_discr:
            plt.plot(time, signal, 'o')
        else:
            plt.plot(time, signal)
        plt.show()

    def GenerateHistogram(self, signal, bins: int = 30):
        plt.hist(signal, bins=bins)
        plt.show()
