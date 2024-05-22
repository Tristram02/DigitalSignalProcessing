import { useState } from "react";
import { Name } from "../Signals";
import { Signal } from "../../classes/Signal";

export const SignalsSecondPage = ({setSignal, signals, parameters}) => {

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
    )
}