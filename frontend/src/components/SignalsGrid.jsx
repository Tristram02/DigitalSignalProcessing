import { useEffect, useState } from "react";
import { SignalPreview } from "./SignalPreview";

export const SignalGrid = ({signal, signals, setSignals}) => {

    useEffect(() => {
        if (signal?.data.length) {
            setSignals(prevSignals => [...prevSignals, signal])
        }
    }, [signal])
    
    return (
        <div className="row">
            {signals?.map((signal, index) => (
                <div key={signal.id} className="col-6">
                    <SignalPreview signal={signal} index={index} />
                </div>
            ))}
        </div>
    );
}