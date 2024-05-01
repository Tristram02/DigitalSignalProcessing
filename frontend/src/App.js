import React, { useEffect, useState } from 'react';
import './App.css';
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

  const [signals, setSignals] = useState([]);
  const [signal, setSignal] = useState(null);

  const [A, setA] = useState(0.5);
  const [T, setT] = useState(0);
  const [f, setF] = useState(16);
  const [d, setD] = useState(4);
  const [t1, setT1] = useState(0);
  const [kw, setKw] = useState(0);
  const [ts, setTs] = useState(0);
  const [P, setP] = useState(0);
  const [bins, setBins] = useState(7);

  const parameters = {A, T, f, d, t1, kw, ts, P, bins};
  const parametersSetters = {setA, setT, setF, setD, setT1, setKw, setTs, setP, setBins}

  useEffect(() => {
    
  }, [signal])

  return (
    <div className='app-container' style={{ backgroundImage: `url(${background})` }}>
      <div className='row'>
        <h1>Cyfrowe przetwarzanie sygnałów</h1>
      </div>
      <div className='row'>
        <div className='col-3 parameters ms-4 p-4'>
          
          <Parameters parameters={parameters} parametersSetters={parametersSetters}/>
        
        </div>

        <div className='col-2'>
          <Signals setSignal={setSignal} parameters={parameters}/> 
        </div>
        <div className='col-1'></div>
        <div className='col-5 signal-grid-wrapper'>
          <SignalGrid signal={signal} signals={signals} setSignals={setSignals}/>
        </div>
        <Modal signal={signal} bins={bins}/>
      </div>
      <div className='row mt-3 h-100' >
        <div className='col-5' >
          <Operations signals={signals} setSignal={setSignal}/>
        </div>
        <div className='col-4'>

        </div>
        <div className='col-2'>
          <div className='files d-flex justify-content-center'>
            <label className='btn' htmlFor='uploadFile'>Dodaj sygnał</label>
            <input id='uploadFile' type="file" onChange={async (event) => {
              const data = await FileUpload(event.target);
              
              setSignal(new Signal(Date.now(), data?.type, data?.data, data?.time))
            }} />
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
