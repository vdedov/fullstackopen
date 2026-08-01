import axios from 'axios'

const url = 'http://api.openweathermap.org/data/2.5/weather?'
const api_key = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY

const get = (city, countryCode) => {
  const req = axios.get(`${url}q=${city},${countryCode}&APPID=${api_key}&units=metric`)
  return req.then(resp => resp.data)
}

export default { get }