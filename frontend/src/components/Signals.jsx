import { useState } from "react";
import { Signal } from "../classes/Signal";
import { SignalsFirstPage } from "./signals/SignalsFirstPage";
import { SignalsSecondPage } from "./signals/SignalsSecondPage";
import { SignalsThirdPage } from "./signals/SignalsThirdPage";
import { SignalsFourthPage } from "./signals/SignalsFourthPage";

export const Name = {
    1: 'Rozkład jednostajny',
    2: 'Gauss',
    3: 'Sinus',
    4: 'Sinus jednopołówkowy',
    5: 'Sinus dwupołówkowy',
    6: 'Prostokątny',
    7: 'Prostokątny symetryczny',
    8: 'Trójkątny',
    9: 'Skok jednostkowy',
    10: 'Impuls jednostkowy',
    11: 'Szum impulsywny',
    12: "Próbkowanie",
    13: "Kwantyzacja równomierna z obcięciem",
    14: "Kwantyzacja równomierna z zaokrągleniem",
    15: "Ekstrapolacja zerowego rzędu",
    16: "Interpolacja pierwszego rzędu",
    17: "Rekonstrukcja w oparciu o funkcję sinc",
    18: "Filtr dolnoprzepustowy",
    19: "Filtr pasmowy",
    20: "Filtr górnoprzepustowy",
    21: "Symulacja"

}

export const Signals = ({setTime, setSignal, signals, parameters, setValues, simulationValues, setSimulationValues, page}) => {

    return (
        <div>
            {page === 1 && (
                <SignalsFirstPage setSignal={setSignal} parameters={parameters} setValues={setValues} />
            )}
            {page === 2 && (
                <SignalsSecondPage setSignal={setSignal} signals={signals} parameters={parameters} />
            )}
            {page === 3 && (
                <SignalsThirdPage setSignal={setSignal} signals={signals} parameters={parameters} simulationValues={simulationValues} setSimulationValues={setSimulationValues} />
            )}
            {page === 4 && (
                <SignalsFourthPage setTime={setTime} setSignal={setSignal} signals={signals} parameters={parameters} simulationValues={simulationValues} setSimulationValues={setSimulationValues} />
            )}
        </div>
    )
}