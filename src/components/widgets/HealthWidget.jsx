import { useHealth } from '../../hooks/useHealth'
import { Link } from 'react-router-dom'
import { ChevronRight, Check } from 'lucide-react'

export default function HealthWidget() {
  const { meds, takeMed, isTaken, todayMedsDone, totalMedsDose } = useHealth()
  const allDone = todayMedsDone === totalMedsDose && totalMedsDose > 0

  return (
    <div className="card" style={{ borderColor: allDone ? 'rgba(34,197,94,0.25)' : 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">💊</span>
          <h3 className="font-semibold text-sm">Lyf í dag</h3>
          <span className="badge text-xs"
                style={{ background: allDone ? 'rgba(34,197,94,0.12)' : 'var(--surface2)', color: allDone ? 'var(--success)' : 'var(--muted)' }}>
            {todayMedsDone}/{totalMedsDose}
          </span>
        </div>
        <Link to="/health" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {meds.map(med => (
          <div key={med.id} className="flex items-center gap-3">
            <span className="text-sm font-medium flex-1">{med.name}</span>
            <div className="flex gap-1.5">
              {med.times.map(time => {
                const taken = isTaken(med.id, time)
                return (
                  <button key={time} onClick={() => takeMed(med.id, time)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: taken ? 'rgba(34,197,94,0.15)' : 'var(--surface2)',
                      color: taken ? 'var(--success)' : 'var(--muted)',
                      border: `1px solid ${taken ? 'rgba(34,197,94,0.35)' : 'transparent'}`,
                    }}>
                    {taken && <Check size={10} />}
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
