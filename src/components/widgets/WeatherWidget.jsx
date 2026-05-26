import { useWeather } from '../../hooks/useWeather'
import { Wind, Droplets, Thermometer } from 'lucide-react'

function WindLevel({ speed }) {
  if (speed < 8) return { label: 'Lognmolt', color: 'var(--success)' }
  if (speed < 16) return { label: 'Kaldi', color: 'var(--accent)' }
  if (speed < 28) return { label: 'Stormur', color: '#f97316' }
  return { label: 'Rok', color: 'var(--danger)' }
}

export default function WeatherWidget() {
  const { data, loading } = useWeather()

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3">
      <div className="w-16 h-16 rounded-full" style={{ background: 'var(--surface2)' }} />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-24 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-32 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-20 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (!data) return null

  const wind = WindLevel(data.wind)

  return (
    <div className="card"
      style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs mb-1 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
            📍 Reykjavík
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-light">{data.temp}°</span>
            <span className="text-3xl mb-1">{data.icon}</span>
          </div>
          <div className="text-sm mt-0.5 font-medium">{data.label}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Líður eins og {data.feelsLike}°
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs items-end">
          <span className="flex items-center gap-1.5">
            <Wind size={13} style={{ color: wind.color }} />
            <span style={{ color: wind.color, fontWeight: 600 }}>{data.wind} km/h</span>
            <span style={{ color: 'var(--muted)' }}>· {wind.label}</span>
          </span>
          <span className="flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
            <Droplets size={13} />
            {data.humidity}% raki
          </span>
        </div>
      </div>

      {data.daily && (
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {data.daily.map((d, i) => (
            <div key={d.date}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl shrink-0"
              style={{ background: i === 0 ? 'rgba(59,130,246,0.12)' : 'var(--surface2)', minWidth: 52 }}>
              <span className="text-xs font-medium"
                style={{ color: i === 0 ? '#60a5fa' : 'var(--muted)' }}>
                {i === 0 ? 'Í dag' : new Date(d.date + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'short' })}
              </span>
              <span className="text-lg">{d.icon}</span>
              <span className="text-xs font-semibold">{d.max}°</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{d.min}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
