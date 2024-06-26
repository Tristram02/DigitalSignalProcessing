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
import { Values } from './components/Values';

Chart.register(...registerables);

function App() {

  const [page, setPage] = useState(3);

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
  const [fp, setFp] = useState(16);//czestotliowsc probkowania
  const [ql, setQl] = useState(10);// poziom kwantyzacji
  const [sinc, setSinc] = useState(10);//parametr funkcji sinc
  const [M, setM] = useState(15);//rzad filtra
  const [fo, setFo] = useState(4);//czestotliwosc odciecia
  const [window, setWindow] = useState(1);//czestotliwosc odciecia
  const [timeStep, setTimeStep] = useState(0.1);//czas trwania jednego powtórzenia
  const [signalVelocity, setSignalVelocity] = useState(100);//Prędkość sygnału
  const [itemVelocity, setItemVelocity] = useState(0.5);//Prędkość przedmiotu
  const [startingDistance, setStartingDistance] = useState(25);//Dystans początkowy
  const [probeTerm, setProbeTerm] = useState(1);//Okres sygnału sondującego
  const [buffor, setBuffor] = useState(60);//długość bufora
  const [report, setReport] = useState(1);//Okres raportowania
  const [time, setTime] = useState(0);

  const [bins, setBins] = useState(5);

  const [values, setValues] = useState({ 'avg': 0, 'avgabs': 0, 'eff': 0, 'var': 0, 'power': 0 });
  const [comparedValues, setComparedValues] = useState({ 'mse': 0, 'snr': 0, 'psnr': 0, 'md': 0, 'enob': 0 });
  const [simulationValues, setSimulationValues] = useState({'time': 0, 'actual_distance': 0, 'estimated_distance': 0})

  const parameters = { A, T, f, d, t1, kw, ts, P, fp, ql, sinc, M, fo, window, bins, timeStep, signalVelocity, itemVelocity, startingDistance, probeTerm, buffor, report };
  const parametersSetters = { setA, setT, setF, setD, setT1, setKw, setTs, setP, setFp, setQl, setSinc, setM, setFo, setWindow, setBins, setTimeStep, setSignalVelocity, setItemVelocity, setStartingDistance, setProbeTerm, setBuffor, setReport };

  useEffect(() => {

  }, [signal])

  return (
    <div className='app-container' style={{ backgroundImage: `url(${background})` }}>

      <div className='row'>
        <h1>Cyfrowe przetwarzanie sygnałów</h1>
      </div>
      <div className='row'>
        <div className='col-3 parameters ms-4 p-4'>

          <Parameters parameters={parameters} parametersSetters={parametersSetters} page={page} />

        </div>

        <div className='col-2 d-flex align-items-center'>
          <Signals setTime={setTime} setSignal={setSignal} signals={signals} parameters={parameters} setValues={setValues} page={page} simulationValues={simulationValues} setSimulationValues={setSimulationValues} />
        </div>
        <div className='col-1'></div>
        <div className='col-5 signal-grid-wrapper'>
          <SignalGrid setSignal={setSignal} signal={signal} signals={signals} setSignals={setSignals} />
        </div>
        <Modal time={time} signal={signal} bins={bins} />
      </div>
      <div className='row mt-3 mb-5' >
        <div className='col-5' >
          <Operations signals={signals} setSignal={setSignal} parameters={parameters} values={values}
            setValues={setValues} comparedValues={comparedValues} setComparedValues={setComparedValues} page={page} />
        </div>
        <div className='col-2 navigation-wrapper'>
          <div className='navigation'>
            <span>Zadania</span>
            <div>
              <PiNumberOne onClick={() => setPage(1)} />
              <PiNumberTwo onClick={() => setPage(2)} />
              <PiNumberThree onClick={() => setPage(3)} />
              <PiNumberFour onClick={() => setPage(4)} />
            </div>
          </div>
        </div>
        <div className='col-3 h-100'>
          <Values page={page} values={values} simulationValues={simulationValues} />
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
