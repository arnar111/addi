import { useLocalStorage } from '../../hooks/useLocalStorage'

function getPaydayInfo(paydayDay) {
  const today = new Date()
  const d = today.getDate()
  const m = today.getMonth()
  const y = today.getFullYear()

  let next
  if (d < paydayDay) {
    next = new Date(y, m, paydayDay)
  } else if (d === paydayDay) {
    next = today
  } else {
    next = new Date(y, m + 1, paydayDay)
  }

  const diffMs = next - today
  const days = d === paydayDay ? 0 : Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return { days, date: next }
}

export default function PaydayWidget() {
  const [paydayDay] = useLocalStorage('addi_payday', 25)
  const { days, date } = getPaydayInfo(paydayDay)
  const isToday = days === 0
  const isSoon = days <= 3 && days > 0

  return (
    <div className="card flex flex-col justify-between"
         style={{
           minHeight: 100,
           border: `1px solid ${isToday ? 'rgba(0,212,170,0.5)' : isSoon ? 'rgba(0,212,170,0.2)' : 'var(--border)'}`,
           background: isToday ? 'rgba(0,212,170,0.05)' : undefined,
         }}>
      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>💰 Launadagur</div>

      <div className="flex flex-col gap-0.5">
        <div className="text-2xl font-bold tabular-nums leading-none"
             style={{ color: isToday ? 'var(--accent)' : isSoon ? 'var(--accent)' : 'var(--text)' }}>
          {isToday ? '🎉' : `${days}d`}
        </div>
        <div className="text-xs mt-1"
             style={{ color: isToday ? 'var(--accent)' : 'var(--muted)' }}>
          {isToday
            ? 'Launadagur!'
            : days === 1
            ? 'Á morgun!'
            : date.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
