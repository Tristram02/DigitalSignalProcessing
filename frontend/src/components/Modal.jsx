import { Chart } from "./Chart";
import { Histogram } from "./Histogram";

export const Modal = ({signal, bins, time}) => {
    return (
        <div className="modal fade" tabIndex={-1} id='modal' aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{signal?.name}</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div id="carouselExampleControls" className="carousel slide" >
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <Chart id={"chart"} signal={signal} />
                                    {
                                        time && (
                                            <span style={{color: 'white'}}>Czas: {time}</span>
                                        )
                                    }
                                </div>
                                <div className="carousel-item">
                                    <Histogram data={signal?.data} bins={bins} />
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
    );
}