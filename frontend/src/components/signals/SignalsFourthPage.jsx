import { useState } from "react";
import { Name } from "../Signals";
import { Signal } from "../../classes/Signal";
import { ComplexChart } from "../ComplexCharts";

export const SignalsFourthPage = ({setSignal, signals, parameters}) => {

    const [operationSignal, setOperationSignal] = useState(null);
    const [algorithm, setAlgorithm] = useState();
    const [realAmplitude, setRealAmplitude] = useState(null);
    const [imaginary, setImaginary] = useState(null);
    const [complexAbsolute, setComplexAbsolute] = useState(null);
    const [numberArgument, setNumberArgument] = useState(null);
    const [executionTime, setExecutionTime] = useState(0);
    const algorithmType = ['Definicja', "Szybka transformacja"];

    function handleChangeOfSignal(event) {
        setOperationSignal(signals.find((signal) => {
            return signal.id == event.target.value;
        }));
    }

    function handleChangeOfAlgorithm(event) {
        setAlgorithm(event.target.value);
    }

    async function handleFourier() {
        if (algorithm === 'Definicja' && operationSignal) {
            await fetch(`http://localhost:5000/dft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setRealAmplitude(new Signal(Date.now(), "Fourier", data.real_parts, data.time, parameters, data.discrete))
                setImaginary(new Signal(Date.now(), "Fourier", data.imag_parts, data.time, parameters, data.discrete))
                setComplexAbsolute(new Signal(Date.now(), "Fourier", data.magnitudes, data.time, parameters, data.discrete))
                setNumberArgument(new Signal(Date.now(), "Fourier", data.phases, data.time, parameters, data.discrete))
                setExecutionTime(data.execution_time);
            })
            .catch(err => console.error(err));
        } else if (algorithm === "Szybka transformacja" && operationSignal) {
            await fetch(`http://localhost:5000/fft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setRealAmplitude(new Signal(Date.now(), "Fourier", data.real_parts, data.time, parameters, data.discrete))
                setImaginary(new Signal(Date.now(), "Fourier", data.imag_parts, data.time, parameters, data.discrete))
                setComplexAbsolute(new Signal(Date.now(), "Fourier", data.magnitudes, data.time, parameters, data.discrete))
                setNumberArgument(new Signal(Date.now(), "Fourier", data.phases, data.time, parameters, data.discrete))
                setExecutionTime(data.execution_time);
            })
            .catch(err => console.error(err));
        }
    }

    async function handleKosinus() {
        if (algorithm === 'Definicja' && operationSignal) {
            await fetch(`http://localhost:5000/dct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setRealAmplitude(new Signal(Date.now(), "Kosinus", data.real_parts, data.time, parameters, data.discrete))
                setImaginary(new Signal(Date.now(), "Kosinus", data.imag_parts, data.time, parameters, data.discrete))
                setComplexAbsolute(new Signal(Date.now(), "Kosinus", data.magnitudes, data.time, parameters, data.discrete))
                setNumberArgument(new Signal(Date.now(), "Kosinus", data.phases, data.time, parameters, data.discrete))
                setExecutionTime(data.execution_time);
            })
            .catch(err => console.error(err));
        } else if (algorithm === "Szybka transformacja" && operationSignal) {
            await fetch(`http://localhost:5000/fct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setRealAmplitude(new Signal(Date.now(), "Kosinus", data.real_parts, data.time, parameters, data.discrete))
                setImaginary(new Signal(Date.now(), "Kosinus", data.imag_parts, data.time, parameters, data.discrete))
                setComplexAbsolute(new Signal(Date.now(), "Kosinus", data.magnitudes, data.time, parameters, data.discrete))
                setNumberArgument(new Signal(Date.now(), "Kosinus", data.phases, data.time, parameters, data.discrete))
                setExecutionTime(data.execution_time);
            })
            .catch(err => console.error(err));
        }
    }

    async function handleWalshHadamard() {
        if (algorithm === 'Definicja' && operationSignal) {
            await fetch(`http://localhost:5000/wht`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setRealAmplitude(new Signal(Date.now(), "Walsh-Hadamard", data.real_parts, data.time, parameters, data.discrete))
                setImaginary(new Signal(Date.now(), "Walsh-Hadamard", data.imag_parts, data.time, parameters, data.discrete))
                setComplexAbsolute(new Signal(Date.now(), "Walsh-Hadamard", data.magnitudes, data.time, parameters, data.discrete))
                setNumberArgument(new Signal(Date.now(), "Walsh-Hadamard", data.phases, data.time, parameters, data.discrete))
                setExecutionTime(data.execution_time);
            })
            .catch(err => console.error(err));
        } else if (algorithm === "Szybka transformacja" && operationSignal) {
            await fetch(`http://localhost:5000/fwht`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'signal': operationSignal })
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                setRealAmplitude(new Signal(Date.now(), "Walsh-Hadamard", data.real_parts, data.time, parameters, data.discrete))
                setImaginary(new Signal(Date.now(), "Walsh-Hadamard", data.imag_parts, data.time, parameters, data.discrete))
                setComplexAbsolute(new Signal(Date.now(), "Walsh-Hadamard", data.magnitudes, data.time, parameters, data.discrete))
                setNumberArgument(new Signal(Date.now(), "Walsh-Hadamard", data.phases, data.time, parameters, data.discrete))
                setExecutionTime(data.execution_time);
            })
            .catch(err => console.error(err));
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
            <div className="d-flex">
                <div 
                onClick={() => {
                    handleFourier();
                }}
                data-bs-toggle="modal"
                data-bs-target="#complexChart"
                className='btn signal-btn'>
                Dyskretna transformacja Fouriera
                </div>

                <select onChange={handleChangeOfAlgorithm} name="First signal" id="">
                    <option>--Typ--</option>
                    {algorithmType.map((type) => (
                        <option key={'1'+type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className="d-flex">
                <div 
                onClick={() => {
                    handleKosinus()
                }}
                data-bs-toggle="modal"
                data-bs-target="#complexChart"
                className='btn signal-btn'>
                Transformacja kosinusowa
                </div>
                <select onChange={handleChangeOfAlgorithm} name="First signal" id="">
                    <option>--Typ--</option>
                    {algorithmType.map((type) => (
                        <option key={'1'+type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className="d-flex">
                <div 
                onClick={() => {
                    handleWalshHadamard()
                }}
                data-bs-toggle="modal"
                data-bs-target="#complexChart"
                className='btn signal-btn'>
                Transformacja Walsha-Hadamarda
                </div>
                <select onChange={handleChangeOfAlgorithm} name="First signal" id="">
                    <option>--Typ--</option>
                    {algorithmType.map((type) => (
                        <option key={'1'+type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <ComplexChart realAmplitude={realAmplitude} imaginary={imaginary} complexAbsolute={complexAbsolute} numberArgument={numberArgument} executionTime={executionTime} />
        </>
    )
}