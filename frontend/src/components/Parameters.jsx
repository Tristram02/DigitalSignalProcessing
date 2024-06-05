import React from "react"
import { ParametersFirstPage } from "./parameters/ParametersFirstPage"
import { ParametersSecondPage } from "./parameters/ParametersSecondPage"
import { ParametersThirdPage } from "./parameters/ParametersThirdPage"
import { ParametersFourthPage } from "./parameters/ParametersFourthPage"
export const Parameters = ({parameters, parametersSetters, page}) => {

    return (
        <div className="w-100">
            {page === 1 && (
                <ParametersFirstPage parameters={parameters} parametersSetters={parametersSetters} />
            )}
            {page === 2 && (
                <ParametersSecondPage parameters={parameters} parametersSetters={parametersSetters} />
            )}
            {page === 3 && (
                <ParametersThirdPage parameters={parameters} parametersSetters={parametersSetters} />
            )}
            {page === 4 && (
                <ParametersFourthPage parameters={parameters} parametersSetters={parametersSetters} />
            )}
        </div>
    )
}