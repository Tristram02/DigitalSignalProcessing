import { useEffect, useState } from 'react';
import { Signal } from '../../classes/Signal';

export const OperationsSecondPage = ({signals, setSignal, parameters, values, setValues, comparedValues, setComparedValues, page}) => {

    const [active, setActive] = useState(-1);
    const [firstSignal, setFirstSignal] = useState(null);
    const [secondSignal, setSecondSignal] = useState(null);

    useEffect(() => {

    }, [comparedValues])

    function handleChangeOfFirstSignal(event) {
        setFirstSignal(signals.find((signal) => {
            return signal.id == event.target.value;
        }));
    }

    function handleChangeOfSecondSignal(event) {
        setSecondSignal(signals.find((signal) => {
            return signal.id == event.target.value;
        }));
    }

    async function handleOperation() {
        if (active != -1 && firstSignal && secondSignal) {
            await fetch(`http://localhost:5000/operation/${active}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({firstSignal: firstSignal, secondSignal: secondSignal})
            })
              .then(response => response.text())
              .then(data => {
                data = JSON.parse(data);
                setValues(data.values);
                setSignal(new Signal(Date.now(), firstSignal.name + " + " + secondSignal.name, 
                        data.noise, data.time, parameters, data.discrete))
              })
              .catch(err => console.error(err));
        }
    }

    async function handleCompare() {
        if (firstSignal && secondSignal) {
            await fetch(`http://localhost:5000/compare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({original: firstSignal, reconstructed: secondSignal})
            })
              .then(response => response.text())
              .then(data => {
                data = JSON.parse(data.replace(/\bNaN\b/g, "null"));
                console.log(data.values);
                if (data.values) {
                    setComparedValues(data.values);
                }
              })
              .catch(err => console.error(err));
        }
    }

    return (
        <div className='calculated-parameters ms-3'>
            <div className='d-flex flex-row row w-100'>
                <ul className='col-8 ps-5'>
                    <li>Błąd średniokwadratowy: {comparedValues.mse?.toFixed(5)}</li>
                    <li>Stosunek sygnał - szum: {comparedValues.snr?.toFixed(5)}</li>
                    <li>Szczytowy stosunek sygnał - szum: {comparedValues.psnr?.toFixed(5)}</li>
                    <li>Maksymalna różnica: {comparedValues.md?.toFixed(5)}</li>
                    <li>Efektywna liczba bitów: {comparedValues.enob?.toFixed(5)}</li>
                </ul>
                <div className='col-4'>
                    <div className="d-flex w-100 align-items-center flex-column">
                        <select className='' onChange={handleChangeOfFirstSignal} name="First signal" id="">
                            <option>--Wybierz sygnał--</option>
                            {signals.map((signal, index) => (
                                <option key={'1'+signal.id} value={signal.id}>{index + 1}. {signal.name}</option>
                            ))}
                        </select>
                        <select className='mb-4' onChange={handleChangeOfSecondSignal} name="Second signal" id="">
                            <option>--Wybierz sygnał--</option>
                            {signals.map((signal, index) => (
                                <option key={'2'+signal.id} value={signal.id}>{index + 1}. {signal.name}</option>
                            ))}
                        </select>
                        <div
                        onClick={handleCompare} className="btn compare-btn">
                            Porównaj
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}