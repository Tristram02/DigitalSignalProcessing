export const ValuesFirstPage = ({values}) => {

    return (
        <div className='calculated-parameters'>
              <ul>
                <li>Wartość średnia: {values?.avg}</li>
                <li>Wartość średnia bezwzględna: {values?.avgabs}</li>
                <li>Moc średnia: {values?.power}</li>
                <li>Wariancja sygnału: {values?.var}</li>
                <li>Wartość skuteczna: {values?.eff}</li>
              </ul>
        </div>
    )
}