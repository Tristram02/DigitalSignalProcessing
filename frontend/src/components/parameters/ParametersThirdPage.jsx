export const ParametersThirdPage = ({parameters, parametersSetters}) => {

    function handleChange(event) {
        parametersSetters.setWindow(event.target.value);
    }

    return (
        <>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.fp === 0 ? '' : parameters.fp} onChange={e => parametersSetters.setFp(e.target.value)} 
                id='probkowanie' placeholder='0' type='number'></input>
                <label htmlFor='probkowanie'>Częstotliwość próbkowania [f<sub>p</sub>]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.M === 0 ? '' : parameters.M} onChange={e => parametersSetters.setM(e.target.value)} 
                id='kwantyzacja' placeholder='0' type='number'></input>
                <label htmlFor='kwantyzacja'>Rząd filtra [M]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.fo === 0 ? '' : parameters.fo} onChange={e => parametersSetters.setFo(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Częstotliwość odcięcia [f<sub>o</sub>]</label>
            </div>
            <select onChange={handleChange} name="First signal" id="">
                <option>-- Typ okna --</option>
                <option key={"prostokatny"} value={1}>{1}. Okno prostokatne</option>
                <option key={"hamminga"} value={2}>{2}. Okno Hamminga</option>
                <option key={"hanninga"} value={3}>{3}. Okno Hanninga</option>
                <option key={"Blackmana"} value={4}>{4}. Okno Blackmana</option>
            </select>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.timeStep === 0 ? '' : parameters.timeStep} onChange={e => parametersSetters.setTimeStep(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Czas trwania jednego powtórzenia</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.signalVelocity === 0 ? '' : parameters.signalVelocity} onChange={e => parametersSetters.setSignalVelocity(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Prędkość sygnału</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.itemVelocity === 0 ? '' : parameters.itemVelocity} onChange={e => parametersSetters.setItemVelocity(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Prędkość przedmiotu</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.startingDistance === 0 ? '' : parameters.startingDistance} onChange={e => parametersSetters.setStartingDistance(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Początkowy dystans</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.probeTerm === 0 ? '' : parameters.probeTerm} onChange={e => parametersSetters.setProbeTerm(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Okres sygnału sondującego</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.fp === 0 ? '' : parameters.fp} onChange={e => parametersSetters.setFp(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Częstotliwość próbkowania</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.buffor === 0 ? '' : parameters.buffor} onChange={e => parametersSetters.setBuffor(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Długość bufora</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.report === 0 ? '' : parameters.report} onChange={e => parametersSetters.setReport(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Okres raportowania</label>
            </div>
        </>
    )
}