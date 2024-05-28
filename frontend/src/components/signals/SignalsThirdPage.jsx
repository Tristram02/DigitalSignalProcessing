import { useEffect, useRef, useState } from "react";
import { Name } from "../Signals";
import { Signal } from "../../classes/Signal";
import { Simulation } from "../Simulation";

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

    const isSimulationRunning = useRef(false);
    let timeoutId = null;

    const [probeSignal, setProbeSignal] = useState()
    const [feedbackSignal, setFeedbackSignal] = useState()
    const [correlationSignal, setCorrelationSignal] = useState()

    async function handleSimulation() {
        isSimulationRunning.current = true;
        await fetch(`http://localhost:5000/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'params': parameters })
        })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                console.log(data);
                const simulationData = data;

                let probeData = [];
                let feedbackData = [];
                let correlationData = [];
                let timeData = [];

                let i = 0;
                probeData.push(simulationData[i].probe_signal);
                feedbackData.push(simulationData[i].feedback_signal);
                
                timeData.push(simulationData[i].all_times);
                
                function update() {
                    if (!isSimulationRunning.current) {
                        return;
                    }
                    setSimulationValues(simulationData[i]);
                    if (simulationData[i].correlation_signal != null) {
                        correlationData.push(simulationData[i].correlation_signal);
                    }
                    timeData.push(simulationData[i].all_times);
                    
                    i++;
                    if (i < simulationData.length) {
                        setProbeSignal(new Signal(Date.now(), "Simulation", probeData[0], timeData[timeData.length - 1], parameters, false));
                        setFeedbackSignal(new Signal(Date.now(), "Simulation", feedbackData[0], timeData[timeData.length - 1], parameters, false));
                        if (correlationData.length > 0) {
                            setCorrelationSignal(new Signal(Date.now(), "Simulation", correlationData[0], timeData[timeData.length - 1], parameters, false));
                        }
                        const delay = (simulationData[i].time - simulationData[i-1].time) * 1000;
                        timeoutId = setTimeout(update, delay);
                    }
                }
                update();
            })
    }

    async function handleStopSimulation() {
        isSimulationRunning.current = false;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }

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
                handleSimulation();
            }}
            data-bs-toggle="modal"
            data-bs-target="#simulation"
            className='btn signal-btn'>
            Symulacja
            </div>
            <div 
            onClick={() => {
                handleStopSimulation();
            }}
            className='btn signal-btn'>
            Zatrzymaj symulacje
            </div>
            <Simulation simulationValues={simulationValues} correlationSignal={correlationSignal} feedbackSignal={feedbackSignal} probeSignal={probeSignal}/>
        </>
    )
}