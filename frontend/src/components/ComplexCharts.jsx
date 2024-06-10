import { useEffect } from "react";
import { Chart } from "./Chart";
import { downloadComplex } from "../functions/Download";

export const ComplexChart = ({realAmplitude, imaginary, complexAbsolute, numberArgument, executionTime}) => {

    useEffect(() => {
        console.log(executionTime)
    }, [realAmplitude, imaginary, complexAbsolute, numberArgument, executionTime])

    return (
        <div className="modal fade" tabIndex={-1} id='complexChart' aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>W1 oraz W2</h2>
                        <div className="btn btn-primary ms-2"
                            onClick={() => {
                                downloadComplex({ realAmplitude: realAmplitude,
                                    imaginary: imaginary,
                                    complexAbsolute: complexAbsolute,
                                    numberArgument: numberArgument,
                                    executionTime: executionTime
                                 })
                            }}
                        >
                            Pobierz
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <div id="carouselExampleControls" className="carousel slide" >
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="w-50 complex-chart">
                                            <Chart id={"complexchart-first"} signal={realAmplitude} />
                                            <span style={{color: 'white'}}>Część rzeczywista amplitudy w funkcji częstotliwości</span>
                                            <Chart id={"complexchart-second"} signal={imaginary} />
                                            <span style={{color: 'white'}}>Część urojona</span>
                                    </div>
                                    <div style={{marginTop: '-20px'}} className='calculated-parameters-simulation'>
                                        <ul>
                                            <li>Czas: {executionTime}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="w-50 complex-chart">
                                        <Chart id={"complexchart-asd"} signal={complexAbsolute} />
                                        <span style={{color: 'white'}}>Moduł liczby zespolonej</span>
                                        <Chart id={"complexchart-asfd"} signal={numberArgument} />
                                        <span style={{color: 'white'}}>Argument liczby w funkcji częstotliwości</span>
                                    </div>
                                    <div style={{marginTop: '-20px'}} className='calculated-parameters-simulation'>
                                        <ul>
                                            <li>Czas: {executionTime}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}