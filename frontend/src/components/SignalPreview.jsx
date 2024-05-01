import { download } from "../functions/Download";
import { Chart } from "./Chart";
import { FaDownload } from 'react-icons/fa6';

export const SignalPreview = ({signal, index}) => {
    return (
        <div className="card">
            <div className="card-img-top text-center">
                <h5>{index + 1}. {signal?.type}</h5>
            </div>
            <div className="card-body">
                <Chart noise={signal?.data} time={signal?.time} />
            </div>
            <div className="card-footer">
                <FaDownload 
                    onClick={() => {
                        const data = {signal};
                        download(data);
                    }}
                />
            </div>
        </div>
    )
}