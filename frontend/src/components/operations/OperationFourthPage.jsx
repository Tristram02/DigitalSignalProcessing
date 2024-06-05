import { useEffect, useState } from 'react';
import { Signal } from '../../classes/Signal';
import { LuDivideCircle, LuMinusCircle, LuPlusCircle, LuXCircle } from 'react-icons/lu';

export const OperationsFourthPage = ({signals, setSignal, parameters, values, setValues, comparedValues, setComparedValues, page}) => {

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
                setSignal(new Signal(Date.now(), firstSignal.name, 
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
        <fieldset className='operations row'>
            <legend>Typ algorytmu</legend>
            <div className="col-8">
                <div className="d-flex w-100 justify-content-center flex-column">
                    <select onChange={handleChangeOfFirstSignal} name="First signal" id="">
                        <option>--Wybierz typ--</option>
                        {signals.map((signal, index) => (
                            <option key={'1'+signal.id} value={signal.id}>{index + 1}. {signal.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-4 mb-5">
                <div
                    data-bs-toggle="modal"
                    data-bs-target="#modal" 
                    onClick={handleOperation} className="btn ">
                        Wykonaj operacje
                    </div>
                </div>
        </fieldset>
    );
}