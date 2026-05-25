import { useState, useEffect } from 'react'

const WEATHER_CODES = {
  0: { label: 'Skýlaust', icon: '☀️' },
  1: { label: 'Mest skýlaust', icon: '🌤️' },
  2: { label: 'Hlutskýjað', icon: '⛅' },
  3: { label: 'Þungaskýjað', icon: '☁️' },
  45: { label: 'Þoka', icon: '🌫️' },
  48: { label: 'Þoka', icon: '🌫️' },
  51: { label: 'Súlur', icon: '🌦️' },
  53: { label: 'Súlur', icon: '🌦️' },
  55: { label: 'Þungar súlur', icon: '🌧️' },
  61: { label: 'Rigning', icon: '🌧️' },
  63: { label: 'Rigning', icon: '🌧️' },
  65: { label: 'Þung rigning', icon: '🌧️' },
  71: { label: 'Snjókoma', icon: '❄️' },
  73: { label: 'Snjókoma', icon: '❄️' },
  75: { label: 'Þung snjókoma', icon: '❄️' },
  77: { label: 'Snjóél', icon: '🌨️' },
  80: { label: 'Skúrir', icon: '🌦️' },
  81: { label: 'Skúrir', icon: '🌦️' },
  82: { label: 'Þungar skúrir', icon: '⛈️' },
  85: { label: 'Snjóskúrir', icon: '🌨️' },
  86: { label: 'Þungar snjóskúrir', icon: '🌨️' },
  95: { label: 'Él', icon: '⛈️' },
  96: { label: 'Él', icon: '⛈️' },
  99: { label: 'Þungt él', icon: '⛈️' },
}

export function useWeather(lat = 64.1355, lon = -21.8954) {
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
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
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
          ...(WEATHER_CODES[d.current.weathercode] || { label: 'Óþekkt', icon: '🌡️' }),
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
