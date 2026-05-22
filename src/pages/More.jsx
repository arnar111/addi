import { Link } from 'react-router-dom'
import { ExternalLink, FileText, Timer, Heart, Settings } from 'lucide-react'

const QUICK = [
  { to: '/notes', emoji: '📝', label: 'Minnisblöð', color: '#8b5cf6' },
  { to: '/timer', emoji: '⏱️', label: 'Tímari', color: '#f97316' },
  { to: '/health', emoji: '💊', label: 'Heilsa', color: '#22c55e' },
  { to: '/tasks', emoji: '✅', label: 'Verkefni', color: '#00d4aa' },
  { to: '/settings', emoji: '⚙️', label: 'Stillingar', color: '#64748b' },
]

const PROJECTS = [
  { name: 'Spira', desc: 'Pipar ræktun', url: 'https://spiran.netlify.app', icon: '🌶️', color: '#ef4444' },
  { name: 'Lendó', desc: 'Leigumarkaður', url: 'https://lendoapp.netlify.app', icon: '🏠', color: '#3b82f6' },
  { name: 'Draumakaup', desc: 'Man United millifærslur', url: 'https://draumakaup.netlify.app', icon: '⚽', color: '#8b5cf6' },
  { name: 'Takkarena', desc: 'Fótbolti MVP', url: 'https://takkmvp.netlify.app', icon: '🏆', color: '#f97316' },
  { name: 'Claude námskeið', desc: 'Þjálfun á íslensku', url: 'https://claudenamskeid.netlify.app', icon: '🤖', color: '#00d4aa' },
]

const QUICK_LINKS = [
  { name: 'The Athletic', desc: 'Sport fréttir', url: 'https://theathletic.com', icon: '📰' },
  { name: 'Vísir', desc: 'Íslenskar fréttir', url: 'https://visir.is', icon: '📱' },
  { name: 'Skatturinn', desc: 'Skattagögn', url: 'https://skatturinn.is', icon: '🧾' },
  { name: 'Þraukarinn S50', desc: 'Survivor fantasy', url: 'https://docs.google.com/spreadsheets/d/1BmIRZFKV6snv2CibGxAEehJgSIhbLfffibOMXypSFvo', icon: '🏝️' },
]

export default function More() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fleira</h1>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {QUICK.map(({ to, emoji, label, color }) => (
          <Link key={to} to={to}
            className="card flex items-center gap-3 py-3.5 transition-all active:scale-95"
            style={{ textDecoration: 'none', borderColor: 'var(--border)' }}>
            <span className="text-xl w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                  style={{ background: `${color}22` }}>
              {emoji}
            </span>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Verkefni mín 🚀</h3>
        <div className="flex flex-col gap-1.5">
          {PROJECTS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 p-2.5 rounded-xl transition-all active:opacity-80"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="w-8 h-8 flex items-center justify-center rounded-lg text-lg shrink-0"
                    style={{ background: `${p.color}22` }}>
                {p.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.desc}</div>
              </div>
              <ExternalLink size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Flýtileiðir 🔗</h3>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-2.5 rounded-xl transition-all active:opacity-80"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-lg">{l.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{l.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{l.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
