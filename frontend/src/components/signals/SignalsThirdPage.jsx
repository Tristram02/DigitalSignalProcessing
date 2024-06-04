import { useEffect, useRef, useState } from "react";
import { Name } from "../Signals";
import { Signal } from "../../classes/Signal";
import { Simulation } from "../Simulation";
import { io } from 'socket.io-client';

export const SignalsThirdPage = ({setSignal, signals, parameters, simulationValues, setSimulationValues}) => {

    async function handleFilter(option) {
        const sample_rate = parameters.fp;
        await fetch(`http://localhost:5000/filter/${option%3}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'params': parameters, 'sample_rate': sample_rate })
        })
        .then(response => response.text())
        .then(data => {
            data = JSON.parse(data);
            setSignal(new Signal(Date.now(), Name[option], data.data, data.time, parameters, data.discrete))
        })
        .catch(err => console.error(err));
    }

    const [probeSignal, setProbeSignal] = useState()
    const [feedbackSignal, setFeedbackSignal] = useState()
    const [correlationSignal, setCorrelationSignal] = useState()

    const socket = io('http://localhost:5000');

    socket.on('simulation_data', function(data) {
        const simulationData = data;

        let timeData = [];
        let correlationTime = [];
        
        timeData.push(simulationData.all_times);
        correlationTime.push(simulationData.correlation_time);
        setSimulationValues(simulationData);
        
        setProbeSignal(new Signal(Date.now(), "Simulation", simulationData.probe_signal, timeData[timeData.length - 1], parameters, false));
        setFeedbackSignal(new Signal(Date.now(), "Simulation", simulationData.feedback_signal, timeData[timeData.length - 1], parameters, false));
        setCorrelationSignal(new Signal(Date.now(), "Simulation", simulationData.correlation_signal, correlationTime[correlationTime.length - 1], parameters, false));
    });

    return (
        <>
            <div 
            onClick={() => {
                handleFilter(18);
            }}
            data-bs-toggle="modal"
            data-bs-target="#modal"
            className='btn signal-btn'>
            Filtr dolnoprzepustowy
            </div>
            <div 
            onClick={() => {
                handleFilter(19);
            }}
            data-bs-toggle="modal"
            data-bs-target="#modal"
            className='btn signal-btn'>
            Filtr pasmowy
            </div>
            <div 
            onClick={() => {
                handleFilter(20);
            }}
            data-bs-toggle="modal"
            data-bs-target="#modal"
            className='btn signal-btn'>
            Filtr górnoprzepustowy
            </div>
            
            <div 
            onClick={() => {
                socket.emit('start_simulation', { 'params': parameters });
            }}
            data-bs-toggle="modal"
            data-bs-target="#simulation"
            className='btn signal-btn'>
            Symulacja
            </div>
            <Simulation simulationValues={simulationValues} correlationSignal={correlationSignal} feedbackSignal={feedbackSignal} probeSignal={probeSignal}/>
        </>
    )
}