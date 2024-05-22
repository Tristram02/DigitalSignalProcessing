export const ParametersSecondPage = ({parameters, parametersSetters}) => {
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
                value={parameters.ql === 0 ? '' : parameters.ql} onChange={e => parametersSetters.setQl(e.target.value)} 
                id='kwantyzacja' placeholder='0' type='number'></input>
                <label htmlFor='kwantyzacja'>Poziom kwantyzacji [Q<sub>L</sub>]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.sinc === 0 ? '' : parameters.sinc} onChange={e => parametersSetters.setSinc(e.target.value)} 
                id='sinc' placeholder='0' type='number'></input>
                <label htmlFor='sinc'>Parametr funkcji sinc [N]</label>
            </div>
        </>
    )
}