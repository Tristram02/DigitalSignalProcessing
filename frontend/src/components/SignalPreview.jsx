import { download } from "../functions/Download";
import { Chart } from "./Chart";
import { FaDownload } from 'react-icons/fa6';

export const SignalPreview = ({signal, index}) => {
    return (
        <div className="card">
            <div className="card-img-top text-center">
                <h5>{index + 1}. {signal?.name}</h5>
            </div>
            <div className="card-body">
                <Chart signal={signal} />
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