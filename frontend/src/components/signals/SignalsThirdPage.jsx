import { useState } from "react";
import { Name } from "../Signals";
import { Signal } from "../../classes/Signal";

export const SignalsThirdPage = ({setSignal, signals, parameters}) => {

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
            
        </>
    )
}