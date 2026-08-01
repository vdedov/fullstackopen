import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Country = ({ country }) => {
  const languages = country.languages
    ? Object.values(country.languages)
    : []

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
      .get(country.capital, country.cca2.toLowerCase())
      .then(resp => {
        setWeather(resp)
      })
      .catch(error => {
        console.error(error);
      })
  }, [])

  if (!weather) return null

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital?.join(', ')}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>
      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
      />
      <h2>Weather in {country.capital}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}
      />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryList = ({ countries, onShowCountry }) => (
  <div>
    {countries.map(country =>
      <p key={country.cca3}>
        {country.name.common}
        <button onClick={() => onShowCountry(country.name.common)}>
          show
        </button>
      </p>
    )}
  </div>
)

const Countries = ({ countries, onShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return (
    <CountryList
      countries={countries}
      onShowCountry={onShowCountry}
    />
  )
}

export default Countries
