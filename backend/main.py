from Interface import Interface

a = 0
while a != 4:
    i = Interface()
    i.ShowMenu()
    a = int(i.GetMenuOption())
    if a != 4:
        i.HandleOption(a)
        if a == 1:
            b = int(i.GetSignalMenuOption())
            signal, time, is_discr = i.HandleSignalOption(b)
            bins = int(input("Wybierz liczbe przedzialow dla histogramu: "))
            i.GenerateHistogram(signal, bins)
            i.GeneratePlot(signal, time, is_discr)
            i.Calculate(signal)
            save = input("Czy chcesz zapisac sygnal do pliku? [y/n]")
            if save == 'y':
                filename = input("Podaj nazwe pliku: ")
                i.signal.SaveToFile(filename, signal)
        elif a == 2:
            b = int(i.GetOperationMenuOption())
            signal, time = i.HandleOperationOption(b)
            i.GeneratePlot(signal, time)
            i.Calculate(signal)
            save = input("Czy chcesz zapisac sygnal do pliku? [y/n]")
            if save == 'y':
                filename = input("Podaj nazwe pliku: ")
                i.signal.SaveToFile(filename, signal)
        elif a == 3:
            filename = input("Podaj nazwe pliku: ")
            signal1, time1 = i.signal.LoadFromFile(filename)
            d1 = i.signal.d
            f1 = i.signal.f

            while True:
                b = int(input("Co chcesz zrobić z wybranym sygnalem?\n"
                              "1. Wygenerowac wykres i histogram\n"
                              "2. Wykonac operacje\n"))
                if b == 1:
                    bins = int(input("Wybierz liczbe przedzialow dla histogramu: "))
                    i.Calculate(signal1)
                    i.GenerateHistogram(signal1, bins)
                    i.GeneratePlot(signal1, time1)
                    break
                elif b == 2:
                    while True:
                        c = int(input("Czy chcesz aby drugi sygnal zostal:\n"
                                      "1. Wygenerowany\n"
                                      "2. Pobrany z pliku\n"))
                        i.HandleOption(c)
                        if c == 1:
                            d = int(i.GetSignalMenuOption())
                            signal2, time2, is_discr2 = i.HandleSignalOption(d)

                            d2 = i.signal.d
                            f2 = i.signal.f

                            if d1 != d2 or f1 != f2:
                                print("Parametry wprowadzone dla sygnalow nie zgadzaja sie!")
                                print("Wygeneruj sygnal jeszcze raz")
                            else:
                                i.ShowOperationMenu(False)
                                e = int(i.GetOperationMenuOption())
                                signal, time = i.HandleOperationOption(e, signal1=signal1, signal2=signal2, time1=time1,
                                                                       time2=time2)

                                i.Calculate(signal1)
                                i.GeneratePlot(signal, time)
                                save = input("Czy chcesz zapisac sygnal do pliku? [y/n]")
                                if save == 'y':
                                    filename = input("Podaj nazwe pliku: ")
                                    i.signal.SaveToFile(filename, signal)
                                break
                        elif c == 2:
                            filename = input("Podaj nazwe pliku: ")
                            signal2, time2 = i.signal.LoadFromFile(filename)

                            d2 = i.signal.d
                            f2 = i.signal.f

                            if d1 != d2 or f1 != f2:
                                print("Parametry wprowadzone dla sygnalow nie zgadzaja sie!")
                                print("Wygeneruj je jeszcze raz")
                            else:
                                i.ShowOperationMenu(False)
                                e = int(i.GetOperationMenuOption())
                                signal, time = i.HandleOperationOption(e, signal1=signal1, signal2=signal2, time1=time1,
                                                                       time2=time2)
                                i.Calculate(signal1)
                                i.GeneratePlot(signal, time)
                                save = input("Czy chcesz zapisac sygnal do pliku? [y/n]")
                                if save == 'y':
                                    filename = input("Podaj nazwe pliku: ")
                                    i.signal.SaveToFile(filename, signal)
                                break
                        else:
                            print("Wybrales zla opcje!\n")
                    break
                else:
                    print("Wybrales zla opcje!\n")
