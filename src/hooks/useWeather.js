import { useState, useEffect } from 'react'

const WEATHER_CODES = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mostly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Icy Fog', icon: '🌫️' },
  51: { label: 'Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Snow', icon: '❄️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  77: { label: 'Snowflakes', icon: '🌨️' },
  80: { label: 'Showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌦️' },
  82: { label: 'Heavy Showers', icon: '⛈️' },
  85: { label: 'Snow Showers', icon: '🌨️' },
  86: { label: 'Heavy Snow', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
}

export function useWeather(lat = 64.0832, lon = -21.9453) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('weather')
    const cachedAt = sessionStorage.getItem('weatherAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 10 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m` +
      `&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=Atlantic%2FReykjavik&forecast_days=5`
    )
      .then(r => r.json())
      .then(d => {
        const weather = {
          temp: Math.round(d.current.temperature_2m),
          feelsLike: Math.round(d.current.apparent_temperature),
          code: d.current.weathercode,
          wind: Math.round(d.current.windspeed_10m),
          humidity: d.current.relativehumidity_2m,
          ...WEATHER_CODES[d.current.weathercode] || { label: 'Unknown', icon: '🌡️' },
          daily: d.daily.time.slice(0, 5).map((t, i) => ({
            date: t,
            code: d.daily.weathercode[i],
            max: Math.round(d.daily.temperature_2m_max[i]),
            min: Math.round(d.daily.temperature_2m_min[i]),
            ...(WEATHER_CODES[d.daily.weathercode[i]] || { label: '?', icon: '🌡️' }),
          })),
        }
        sessionStorage.setItem('weather', JSON.stringify(weather))
        sessionStorage.setItem('weatherAt', String(Date.now()))
        setData(weather)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [lat, lon])

  return { data, loading, error }
}
