import { ValuesFirstPage } from "./values/ValuesFirstPage"
import { ValuesThirdPage } from "./values/ValuesThirdPage"

export const Values = ({values, page, simulationValues}) => {
    return (
        <>
            {(page === 1 || page === 2) && (
                <ValuesFirstPage values={values} />
            )}
            {page === 3 && (
                <ValuesThirdPage simulationValues={simulationValues} />
            )}
        </>
    )
}