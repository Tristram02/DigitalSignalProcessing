import { useEffect } from "react";
import { Chart } from "./Chart";

export const Simulation = ({probeSignal, feedbackSignal, correlationSignal, simulationValues}) => {

    useEffect(() => {
        // console.log(probeSignal)
    }, [probeSignal])

    return (
        <div className="modal fade" tabIndex={-1} id='simulation' aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Symulacja</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex simulation-container">
                            <Chart id={"chart-first"} signal={probeSignal} />
                            <Chart id={"chart-second"} signal={feedbackSignal} />
                            <Chart id={"chart-third"} signal={probeSignal} />
                        </div>
                        <div className='calculated-parameters-simulation'>
                            <ul>
                                <li>Czas: {simulationValues?.time}</li>
                                <li>Rzeczywisty dystans: {simulationValues?.actual_distance}</li>
                                <li>Obliczony dystans: {simulationValues?.estimated_distance}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}