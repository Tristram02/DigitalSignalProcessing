export const ParametersFourthPage = ({parameters, parametersSetters}) => {
    return (
        <>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.fp === 0 ? '' : parameters.fp} onChange={e => parametersSetters.setFp(e.target.value)} 
                id='probkowanie' placeholder='0' type='number'></input>
                <label htmlFor='probkowanie'>Częstotliwość próbkowania [f<sub>p</sub>]</label>
            </div>
        </>
    )
}