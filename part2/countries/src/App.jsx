import { useState, useEffect } from 'react'
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

  const filteredCountries = value === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      )
  return (
    <div>
      find countries <input value={value} onChange={handleChange} />

      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h1>{filteredCountries[0].name.common}</h1>
          <p>capital {filteredCountries[0].capital}</p>
          <p>area {filteredCountries[0].area}</p>
          <h2>Languages</h2>
          {filteredCountries.map(country =>
            <div key={country.cca3}>
              {Object.values(country.languages).map(language =>
                <p key={language}>{language}</p>
              )}
            </div>
            )}
          <img src={filteredCountries[0].flags.png}/>
        </div>
      ) : (
        filteredCountries.map(country =>
          <p key={country.cca3}>{country.name.common}</p>
        )
      )}
    </div>
  )
}

export default App
