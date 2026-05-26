import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Bell, X, BookOpen, CreditCard } from 'lucide-react'

const PRESET_ALERTS = [
  {
    id: 'audible_credits',
    icon: '🎧',
    title: 'Audible – 11 kreditur',
    body: '1 kredit rennur út fljótt! Nýttu þá á bók.',
    color: '#f97316',
    link: 'https://audible.com',
    linkLabel: 'Opna Audible',
  },
]

export default function AlertsWidget() {
  const [dismissed, setDismissed] = useLocalStorage('addi_dismissed_alerts', [])

  const visible = PRESET_ALERTS.filter(a => !dismissed.includes(a.id))

  const dismiss = (id) => setDismissed(prev => [...prev, id])

  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {visible.map(alert => (
        <div key={alert.id} className="card flex items-start gap-3"
             style={{ border: `1px solid ${alert.color}33`, background: `${alert.color}08` }}>
          <span className="text-xl shrink-0 mt-0.5">{alert.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{alert.title}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{alert.body}</div>
            {alert.link && (
              <a href={alert.link} target="_blank" rel="noopener noreferrer"
                 className="text-xs mt-1 inline-block" style={{ color: alert.color }}>{alert.linkLabel} →</a>
            )}
          </div>
          <button onClick={() => dismiss(alert.id)} style={{ color: 'var(--muted)' }} className="shrink-0 mt-0.5">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
