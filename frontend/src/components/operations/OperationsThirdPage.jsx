import { useEffect, useState } from 'react';
import { Signal } from '../../classes/Signal';

export const OperationsThirdPage = ({signals, setSignal, parameters, values, setValues, comparedValues, setComparedValues, page}) => {

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

    async function handleSplot() {
        if (firstSignal && secondSignal &&
            firstSignal.discrete && secondSignal.discrete
        ) {
            await fetch(`http://localhost:5000/convolution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({h: firstSignal, x: secondSignal})
            })
              .then(response => response.text())
              .then(data => {
                data = JSON.parse(data);
                setSignal(new Signal(Date.now(), "Splot", 
                        data.data, data.time, parameters, data.discrete))
              })
              .catch(err => console.error(err));
        }
    }

    async function handleKorelacja() {
        if (firstSignal && secondSignal &&
            firstSignal.discrete && secondSignal.discrete
        ) {
            await fetch(`http://localhost:5000/correlation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({h: firstSignal, x: secondSignal})
            })
              .then(response => response.text())
              .then(data => {
                data = JSON.parse(data);
                setSignal(new Signal(Date.now(), "Korelacja", 
                        data.data, data.time, parameters, data.discrete))
              })
              .catch(err => console.error(err));
        }
    }

    return (
        <fieldset className='operations row'>
            <legend>Operacje</legend>
            <div className="col-4 d-flex flex-column">
                <div
                data-bs-toggle="modal"
                data-bs-target="#modal" 
                onClick={handleSplot} className="btn ">
                    Splot
                </div>
                <div
                data-bs-toggle="modal"
                data-bs-target="#modal" 
                onClick={handleKorelacja} className="btn ">
                    Korelacja
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
    );
}