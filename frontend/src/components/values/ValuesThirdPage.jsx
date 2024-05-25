import { useEffect } from "react"

export const ValuesThirdPage = ({simulationValues}) => {

    useEffect(() => {

    }, [simulationValues])

    return (
        <div className='calculated-parameters'>
              <ul>
                <li>Czas: {simulationValues?.time}</li>
                <li>Rzeczywisty dystans: {simulationValues?.actual_distance}</li>
                <li>Obliczony dystans: {simulationValues?.estimated_distance}</li>
              </ul>
        </div>
    )
}