import { useWeather } from '../../hooks/useWeather'
import { Wind, Droplets } from 'lucide-react'

export default function WeatherWidget() {
  const { data, loading } = useWeather()

  if (loading) return (
    <div className="card flex items-center gap-4">
      <div className="skeleton w-14 h-14 rounded-2xl" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="skeleton h-8 w-20 rounded-lg" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
    </div>
  )

  if (!data) return null

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07) 0%, rgba(59,130,246,0.05) 100%)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>📍 Reykjavík</div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-light tracking-tight">{data.temp}°</span>
            <span className="text-3xl mb-1">{data.icon}</span>
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text2)' }}>
            {data.label} · líður eins og {data.feelsLike}°
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs items-end" style={{ color: 'var(--text2)' }}>
          <span className="flex items-center gap-1.5"><Wind size={12} /> {data.wind} km/h {data.windDir || ''}</span>
          <span className="flex items-center gap-1.5"><Droplets size={12} /> {data.humidity}%</span>
        </div>
      </div>

      {data.daily && (
        <div className="scroll-row">
          {data.daily.slice(0, 7).map((d, i) => (
            <div
              key={d.date}
              className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl shrink-0"
              style={{
                background: i === 0 ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                minWidth: 52,
                border: `1px solid ${i === 0 ? 'rgba(0,212,170,0.2)' : 'transparent'}`,
              }}
            >
              <span className="text-xs font-semibold" style={{ color: i === 0 ? 'var(--accent)' : 'var(--text2)' }}>
                {i === 0 ? 'Í dag' : new Date(d.date).toLocaleDateString('is-IS', { weekday: 'short' }).slice(0, 3)}
              </span>
              <span className="text-lg">{d.icon}</span>
              <span className="text-xs font-bold">{d.max}°</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{d.min}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
