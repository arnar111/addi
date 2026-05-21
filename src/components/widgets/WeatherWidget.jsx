import { useWeather } from '../../hooks/useWeather'
import { Wind, Droplets } from 'lucide-react'

export default function WeatherWidget() {
  const { data, loading } = useWeather()

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3">
      <div className="w-12 h-12 rounded-full" style={{ background: 'var(--surface2)' }} />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-16 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (!data) return null

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Reykjavík</div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-light">{data.temp}°</span>
            <span className="text-2xl mb-1">{data.icon}</span>
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{data.label} · líður eins og {data.feelsLike}°</div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs items-end" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1"><Wind size={12} /> {data.wind} km/h</span>
          <span className="flex items-center gap-1"><Droplets size={12} /> {data.humidity}%</span>
        </div>
      </div>

      {data.daily && (
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {data.daily.map((d, i) => (
            <div key={d.date} className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl shrink-0"
                 style={{ background: i === 0 ? 'rgba(0,212,170,0.1)' : 'var(--surface2)', minWidth: 48 }}>
              <span className="text-xs font-medium" style={{ color: i === 0 ? 'var(--accent)' : 'var(--muted)' }}>
                {i === 0 ? 'Í dag' : new Date(d.date).toLocaleDateString('is-IS', { weekday: 'short' })}
              </span>
              <span className="text-base">{d.icon}</span>
              <span className="text-xs font-semibold">{d.max}°</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{d.min}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
