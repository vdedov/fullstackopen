import { useState, useEffect } from 'react'
import Countries from "./components/Countries"
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    countryService.getAll().then(countries => {
      setCountries(countries)
    })
  }, [])

  const handleChange = event => {
    setValue(event.target.value)
  }

  const showCountry = countryName => {
    setValue(countryName)
  }

  const search = value.toLowerCase()

  const filteredCountries = value === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(search)
      )

  return (
    <div>
      find countries <input value={value} onChange={handleChange} />

      <Countries
        countries={filteredCountries}
        onShowCountry={showCountry}
      />
    </div>
  )
}

export default App
