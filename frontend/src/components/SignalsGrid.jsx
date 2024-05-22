import { useEffect, useState } from "react";
import { SignalPreview } from "./SignalPreview";

export const SignalGrid = ({signal, signals, setSignals, setSignal}) => {

    useEffect(() => {
        if (signal?.data?.length) {
            setSignals(prevSignals => {
                const signalExists = prevSignals.some(prevSignal => prevSignal.id === signal.id);
                if (!signalExists) {
                  return [...prevSignals, signal];
                } else {
                  return prevSignals;
                }
              });              
        }
    }, [signal])
    
    return (
        <div className="row">
            {signals?.map((signal, index) => (
                <div key={signal.id} className="col-6">
                    <SignalPreview setSignal={setSignal} signal={signal} index={index} />
                </div>
            ))}
        </div>
    );
}