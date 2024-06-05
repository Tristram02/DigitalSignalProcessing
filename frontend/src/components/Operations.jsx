import { useEffect, useState } from 'react';
import { Signal } from '../classes/Signal';
import { OperationsFirstPage } from './operations/OperationsFirstPage';
import { OperationsSecondPage } from './operations/OperationsSecondPage';
import { OperationsThirdPage } from './operations/OperationsThirdPage';
import { OperationsFourthPage } from './operations/OperationFourthPage';

export const Operations = ({signals, setSignal, parameters, values, setValues, comparedValues, setComparedValues, page}) => {

    const [active, setActive] = useState(-1);
    const [firstSignal, setFirstSignal] = useState(null);
    const [secondSignal, setSecondSignal] = useState(null);

    useEffect(() => {

    }, [comparedValues])

    return (
        <>
            {page === 1 && (
                <OperationsFirstPage signals={signals} setSignal={setSignal} parameters={parameters} values={values} 
                setValues={setValues} comparedValues={comparedValues} setComparedValues={setComparedValues} page={page}/>
            )}
            {page === 2 && (
                <OperationsSecondPage signals={signals} setSignal={setSignal} parameters={parameters} values={values} 
                setValues={setValues} comparedValues={comparedValues} setComparedValues={setComparedValues} page={page}/>
            )}
            {page === 3 && (
                <OperationsThirdPage signals={signals} setSignal={setSignal} parameters={parameters} values={values} 
                setValues={setValues} comparedValues={comparedValues} setComparedValues={setComparedValues} page={page}/>
            )}
            {/* {page === 4 && (
                <OperationsFourthPage signals={signals} setSignal={setSignal} parameters={parameters} values={values} 
                setValues={setValues} comparedValues={comparedValues} setComparedValues={setComparedValues} page={page}/>
            )} */}
        </>
    );
}