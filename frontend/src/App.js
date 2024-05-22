import React, { useEffect, useState } from 'react';
import './App.css';
import { MdSignalCellular1Bar, MdSignalCellular2Bar, MdSignalCellular3Bar, MdSignalCellular4Bar } from 'react-icons/md';
import { PiNumberOne, PiNumberTwo, PiNumberThree, PiNumberFour } from "react-icons/pi";
import background from './assets/background.jpg';
import { Chart, registerables } from 'chart.js';
import { Parameters } from './components/Parameters';
import { Signals } from './components/Signals';
import { Modal } from './components/Modal';
import { SignalGrid } from './components/SignalsGrid';
import { Operations } from './components/Operations';
import { FileUpload } from './functions/Upload';
import { Signal } from './classes/Signal';

Chart.register(...registerables);

function App() {

  const [page, setPage] = useState(1);

  const [signals, setSignals] = useState([]);
  const [signal, setSignal] = useState(null);

  const [A, setA] = useState(0.5);//amplituda
  const [T, setT] = useState(1);//okres
  const [f, setF] = useState(16);//czestotliowosc
  const [d, setD] = useState(4);//czas trwania
  const [t1, setT1] = useState(0);//czas poczatkowy
  const [kw, setKw] = useState(0.5);//wspolczynniik wypelnienia
  const [ts, setTs] = useState(2);//czas skoku
  const [P, setP] = useState(0.2);//czestotliowsc
  const [fp, setFp] = useState(10);//czestotliowsc probkowania
  const [ql, setQl] = useState(10);// poziom kwantyzacji
  const [sinc, setSinc] = useState(10);//parametr funkcji sinc
  const [M, setM] = useState(15);//rzad filtra
  const [fo, setFo] = useState(4);//czestotliwosc odciecia
  const [window, setWindow] = useState(1);//czestotliwosc odciecia

  const [bins, setBins] = useState(5);

  const [values, setValues] = useState({'avg': 0, 'avgabs': 0, 'eff': 0, 'var': 0, 'power': 0});
  const [comparedValues, setComparedValues] = useState({'mse': 0, 'snr': 0, 'psnr': 0, 'md': 0, 'enob': 0});

  const parameters = {A, T, f, d, t1, kw, ts, P, fp, ql, sinc, M, fo, window, bins};
  const parametersSetters = {setA, setT, setF, setD, setT1, setKw, setTs, setP, setFp, setQl, setSinc, setM, setFo, setWindow, setBins}

  useEffect(() => {

  }, [signal])

  return (
    <div className='app-container' style={{ backgroundImage: `url(${background})` }}>

      <div className='row'>
        <h1>Cyfrowe przetwarzanie sygnałów</h1>
      </div>
        <div className='row'>
          <div className='col-3 parameters ms-4 p-4'>
            
            <Parameters parameters={parameters} parametersSetters={parametersSetters} page={page}/>
          
          </div>

          <div className='col-2 d-flex align-items-center'>
            <Signals setSignal={setSignal} signals={signals} parameters={parameters} setValues={setValues} page={page}/> 
          </div>
          <div className='col-1'></div>
          <div className='col-5 signal-grid-wrapper'>
            <SignalGrid setSignal={setSignal} signal={signal} signals={signals} setSignals={setSignals}/>
          </div>
          <Modal signal={signal} bins={bins}/>
        </div>
        <div className='row mt-3 mb-5' >
          <div className='col-5' >
            <Operations signals={signals} setSignal={setSignal} parameters={parameters} values={values} 
              setValues={setValues} comparedValues={comparedValues} setComparedValues={setComparedValues} page={page}/>
          </div>
          <div className='col-2 navigation-wrapper'>
            <div className='navigation'>
              <span>Zadania</span>
              <div>
                <PiNumberOne onClick={() => setPage(1)}/>
                <PiNumberTwo onClick={() => setPage(2)}/>
                <PiNumberThree onClick={() => setPage(3)}/>
                <PiNumberFour />
              </div>
            </div>
          </div>
          <div className='col-3 h-100'>
            <div className='calculated-parameters'>
              <ul>
                <li>Wartość średnia: {values?.avg}</li>
                <li>Wartość średnia bezwzględna: {values?.avgabs}</li>
                <li>Moc średnia: {values?.power}</li>
                <li>Wariancja sygnału: {values?.var}</li>
                <li>Wartość skuteczna: {values?.eff}</li>
              </ul>
            </div>
          </div>
          <div className='col-2'>
            <div className='files d-flex justify-content-center'>
              <label className='btn' htmlFor='uploadFile'>Dodaj sygnał</label>
              <input id='uploadFile' type="file" onChange={async (event) => {
                const data = await FileUpload(event.target);
                
                setSignal(new Signal(Date.now(), data?.name, data?.data, data?.time, data?.params, data?.discrete))
              }} />
            </div>
          </div>
          
        </div>
    </div>
  );
}

export default App;
