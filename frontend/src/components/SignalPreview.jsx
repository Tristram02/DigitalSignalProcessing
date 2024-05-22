import { useEffect, useRef, useState } from "react";
import { download, saveImage } from "../functions/Download";
import { Chart } from "./Chart";
import { FaDownload, FaFileImage, FaMagnifyingGlass } from 'react-icons/fa6';

export const SignalPreview = ({signal, index, setSignal}) => {

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
                <FaFileImage
                    className="ms-2" 
                    onClick={() => {
                        setSignal(signal);
                        saveImage();
                    }}
                />
                <FaMagnifyingGlass 
                    className="ms-2"
                    onClick={() => {
                        setSignal(signal);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                />
            </div>
        </div>
    )
}