import { useEffect, useState } from 'react';
import { LuDivideCircle, LuMinusCircle, LuPlusCircle, LuXCircle } from 'react-icons/lu';
import { Signal } from '../classes/Signal';

export const Operations = ({signals, setSignal, parameters, values, setValues, comparedValues, setComparedValues, page}) => {

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
        <>
            {page === 1 && (
                <fieldset className='operations row'>
                    <legend>Operacje</legend>
                    <div className="col-4 d-flex flex-column">
                        <div className='icons'>
                            <LuPlusCircle 
                                className={active === 1 ? 'active' : ''}
                                onClick={() => {
                                    setActive(1)
                                }}
                            />
                            <LuMinusCircle 
                                className={active === 2 ? 'active' : ''}
                                onClick={() => {
                                    setActive(2)
                                }}
                            />
                            <LuXCircle 
                                className={active === 3 ? 'active' : ''}
                                onClick={() => {
                                    setActive(3)
                                }}
                            />
                            <LuDivideCircle 
                                className={active === 4 ? 'active' : ''}
                                onClick={() => {
                                    setActive(4)
                                }}
                            />
                        </div>
                        <div
                        data-bs-toggle="modal"
                        data-bs-target="#modal" 
                        onClick={handleOperation} className="btn ">
                            Wykonaj operacje
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="d-flex w-100 justify-content-center flex-column">
                            <select onChange={handleChangeOfFirstSignal} name="First signal" id="">
                                <option>--Wybierz sygnał--</option>
                                {signals.map((signal, index) => (
                                    <option key={'1'+signal.id} value={signal.id}>{index + 1}. {signal.name}</option>
                                ))}
                            </select>
                            <select onChange={handleChangeOfSecondSignal} name="Second signal" id="">
                                <option>--Wybierz sygnał--</option>
                                {signals.map((signal, index) => (
                                    <option key={'2'+signal.id} value={signal.id}>{index + 1}. {signal.name}</option>
                                ))}
                            </select>
                        </div>
        
                    </div>
                </fieldset>
            )}
            {page === 2 && (
                <div className='calculated-parameters ms-3'>
                    <div className='d-flex flex-row row w-100'>
                        <ul className='col-8 ps-5'>
                            <li>Błąd średniokwadratowy: {comparedValues.mse?.toFixed(5)}</li>
                            <li>Stosunek sygnał - szum: {comparedValues.snr?.toFixed(5)}</li>
                            <li>Sczytowy stosunek sygnał - szum: {comparedValues.psnr?.toFixed(5)}</li>
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
            )}
        </>
    );
}