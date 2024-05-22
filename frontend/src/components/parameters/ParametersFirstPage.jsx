export const ParametersFirstPage = ({parameters, parametersSetters}) => {

    return (
        <>
            <div className='form-floating'>
                <input className='form-control' 
                value={parameters.A === 0 ? '' : parameters.A} onChange={e => parametersSetters.setA(e.target.value)} 
                id='amplituda' placeholder='0' type='number'></input>
                <label htmlFor='amplituda'>Amplituda [A]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.T === 0 ? '' : parameters.T} onChange={e => parametersSetters.setT(e.target.value)} 
                id='okres' placeholder='0' type='number'></input>
                <label htmlFor='okres'>Okres [T]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.f === 0 ? '' : parameters.f} onChange={e => parametersSetters.setF(e.target.value)} 
                id='czestotliwosc' placeholder='0' type='number'></input>
                <label htmlFor='czestotliwosc'>Częstotliwość [f]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.d === 0 ? '' : parameters.d} onChange={e => parametersSetters.setD(e.target.value)} 
                id='czas' placeholder='0' type='number'></input>
                <label htmlFor='czas'>Czas trwania [d]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.t1 === 0 ? '' : parameters.t1} onChange={e => parametersSetters.setT1(e.target.value)} 
                id='start' placeholder='0' type='number'></input>
                <label htmlFor='start'>Czas początkowy [t<sub>1</sub>]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.kw === 0 ? '' : parameters.kw} onChange={e => parametersSetters.setKw(e.target.value)} 
                id='wspolczynnik' placeholder='0' type='number'></input>
                <label htmlFor='wspolczynnik'>Współczynnik wypełnienia [k<sub>w</sub>]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.ts === 0 ? '' : parameters.ts} onChange={e => parametersSetters.setTs(e.target.value)} 
                id='skok' placeholder='0' type='number'></input>
                <label htmlFor='skok'>Czas skoku [t<sub>s</sub>]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.P === 0 ? '' : parameters.P} onChange={e => parametersSetters.setP(e.target.value)} 
                id='prawdopodobienstwo' placeholder='0' type='number'></input>
                <label htmlFor='prawdopodobienstwo'>Prawdopodobieństwo [P]</label>
            </div>
            <div className='form-floating'>
                <input className='form-control'
                value={parameters.bins === 0 ? '' : parameters.bins} onChange={e => parametersSetters.setBins(e.target.value)} 
                id='bins' placeholder='0' type='range' min={5} max={20}></input>
                <label htmlFor='bins'>Liczba przedziałów histogramu: {parameters.bins}</label>
            </div>
        </>
    )
}