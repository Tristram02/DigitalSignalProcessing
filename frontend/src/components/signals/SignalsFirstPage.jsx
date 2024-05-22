import { Name } from "../Signals";
import { Signal } from "../../classes/Signal";

export const SignalsFirstPage = ({setSignal, parameters, setValues}) => {

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

    return (
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
    )
}