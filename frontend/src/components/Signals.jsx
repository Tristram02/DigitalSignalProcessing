import { useState } from "react";
import { Signal } from "../classes/Signal";

const Name = {
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

}

export const Signals = ({setSignal, signals, parameters, setValues, page}) => {

    const [operationSignal, setOperationSignal] = useState(null);

    function handleChangeOfSignal(event) {
        setOperationSignal(signals.find((signal) => {
            return signal.id == event.target.value;
        }));
    }

    function findKey(name) {
        for (let [key, value] of Object.entries(Name)) {
            if (value === name) {
                return key;
            }
        }
        return null;
    }

    async function handleSignal(option) {
        await fetch(`http://localhost:5000/signal/${option}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        })
          .then(response => response.text())
          .then(data => {
            data = JSON.parse(data)
            setValues(data.values);
            setSignal(new Signal(Date.now(), Name[option], data.noise, data.time, parameters, data.discrete))
          })
          .catch(err => console.error(err));
    }

    async function handleSampling(option) {
        const sample_rate = parameters.fp;

        const function_number = findKey(operationSignal?.name);
        if (operationSignal && function_number) {
            await fetch(`http://localhost:5000/sampling/${function_number}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal, 'sample_rate': sample_rate })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                setSignal(new Signal(Date.now(), Name[option], data.noise, data.time, parameters, data.discrete))
            })
            .catch(err => console.error(err));
        } else {
            console.error("Signal not picked!");
        }
    }

    async function handleQuantization(option) {
        const quantization_level = parameters.ql;

        if (operationSignal) {
            await fetch(`http://localhost:5000/quantization/${option}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal, 'quantization_level': quantization_level })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                setSignal(new Signal(Date.now(), Name[option], data.data, operationSignal.time, parameters, true))
            })
            .catch(err => console.error(err));
        } else {
            console.error("Signal not picked!");
        }
    }

    async function handleReconstruction(option) {
        const sinc = parameters.sinc;
        console.log(operationSignal);
        if (operationSignal) {
            await fetch(`http://localhost:5000/reconstruction/${option}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal, 'sinc': sinc })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setSignal(new Signal(Date.now(), Name[option], data.data, data.time, parameters, false))
            })
            .catch(err => console.error(err));
        } else {
            console.error("Signal not picked!");
        }
    }

    return (
        <div>
            {page === 1 && (
                <>
                    <div 
                    onClick={() => {
                        handleSignal(1);
                    }} 
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Szum o rozkładzie jednostajnym
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(2);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Szum Gaussowski
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(3);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Sygnał sinusoidalny
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(4);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Sygnał sinusoidalny wyprostowany jednopołówkowo
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(5);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Sygnał sinusoidalny wyprostowany dwupołówkowo
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(6);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Sygnał prostokątny
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(7);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Sygnał prostokątny symetryczny
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(8);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Sygnał trójkątny
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(9);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Skok jednostkowy
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(10);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Impuls jednostkowy
                    </div>
                    <div 
                    onClick={() => {
                        handleSignal(11);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Szum impulsywny
                    </div>
                </>
            )}
            {page === 2 && (
                <>
                    <select onChange={handleChangeOfSignal} name="First signal" id="">
                        <option>--Wybierz sygnał--</option>
                        {signals.map((signal, index) => (
                            <option key={'1'+signal.id} value={signal.id}>{index + 1}. {signal.name}</option>
                        ))}
                    </select>
                    <div 
                    onClick={() => {
                        handleSampling(12);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Próbkowanie
                    </div>
                    <div 
                    onClick={() => {
                        handleQuantization(13);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Kwantyzacja równomierna z obcięciem
                    </div>
                    <div 
                    onClick={() => {
                        handleQuantization(14);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Kwantyzacja równomierna z zaokrągleniem
                    </div>
                    <div 
                    onClick={() => {
                        handleReconstruction(15);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Ekstrapolacja zerowego rzędu
                    </div>
                    <div 
                    onClick={() => {
                        handleReconstruction(16);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Interpolacja pierwszego rzędu
                    </div>
                    <div 
                    onClick={() => {
                        handleReconstruction(17);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                    className='btn signal-btn'>
                    Rekonstrukcja w oparciu o funkcję sinc
                    </div>
                </>
            )}
        </div>
    )
}