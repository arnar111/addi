import { Link } from 'react-router-dom'
import { CheckSquare, FileText, Timer, Settings, CreditCard, ExternalLink } from 'lucide-react'

const PAGES = [
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni', desc: 'Daglegur verkefnalisti', color: '#8b5cf6' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð', desc: 'Fljótlegar athugasemdir', color: '#3b82f6' },
  { to: '/timer', icon: Timer, label: 'Tímari', desc: 'Pomodoro og stöðvunartími', color: '#f97316' },
  { to: '/settings', icon: Settings, label: 'Stillingar', desc: 'Prófíll og appstillingar', color: '#64748b' },
]

const SHORTCUTS = [
  { label: 'The Athletic', url: 'https://www.nytimes.com/athletic/', icon: '📰' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com', icon: '💼' },
  { label: 'alfred.is', url: 'https://alfred.is', icon: '🇮🇸' },
  { label: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { label: 'r/ClaudeAI', url: 'https://reddit.com/r/ClaudeAI', icon: '🤖' },
  { label: 'GOLF+ VR', url: 'https://www.golfplusvr.com', icon: '⛳' },
  { label: 'Xbox', url: 'https://www.xbox.com', icon: '🎮' },
  { label: 'Trip.com', url: 'https://www.trip.com', icon: '✈️' },
]

export default function More() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Meira</h1>
      </div>

      {/* Netlify billing alert */}
      <a href="https://app.netlify.com/teams/arnar1992/billing" target="_blank" rel="noopener noreferrer"
         style={{ textDecoration: 'none' }}>
        <div className="card flex items-start gap-3" style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)'
        }}>
          <CreditCard size={18} style={{ color: 'var(--danger)', shrink: 0, marginTop: 2 }} />
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
              Netlify greiðslukort vantar
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              24 dagar eftir — verkefni verða stöðvuð ef ekki uppfært
            </div>
          </div>
          <ExternalLink size={14} style={{ color: 'var(--danger)' }} />
        </div>
      </a>

      {/* Pages grid */}
      <div className="grid grid-cols-2 gap-3">
        {PAGES.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="card flex flex-col gap-2 py-4 h-full" style={{ border: '1px solid var(--border)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: `${color}22` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="card flex flex-col">
        <h3 className="text-sm font-semibold mb-2">Eftirlæti</h3>
        <div className="grid grid-cols-2 gap-1">
          {SHORTCUTS.map(({ label, url, icon }) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2.5 py-2.5 px-1"
               style={{ borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
              <span className="text-base">{icon}</span>
              <span className="text-xs flex-1">{label}</span>
              <ExternalLink size={11} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
