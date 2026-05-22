import { ExternalLink } from 'lucide-react'
import WorldCupWidget from '../components/widgets/WorldCupWidget'

const WC_STATS = [
  { val: '48', desc: 'Þátttökulið' },
  { val: '3', desc: 'Gestgjafar' },
  { val: '16', desc: 'Leikvangar' },
  { val: '104', desc: 'Leikir' },
]

const GOLF_LINKS = [
  { name: 'Golf+', icon: '🥽', desc: 'VR Golf app', url: 'https://golfplus.com', color: '#22c55e' },
  { name: 'PGA Tour', icon: '🏌️', desc: 'Stöðutafla & fréttir', url: 'https://pgatour.com', color: '#f97316' },
  { name: 'DP World Tour', icon: '🌍', desc: 'European Tour', url: 'https://europeantour.com', color: '#3b82f6' },
  { name: 'OWGR', icon: '📊', desc: 'Heimsröðun', url: 'https://owgr.com', color: '#8b5cf6' },
]

const SPORTS_QUICK = [
  { name: 'The Athletic', icon: '📰', desc: 'Íþróttafréttir', url: 'https://theathletic.com' },
  { name: 'ESPN', icon: '📺', desc: 'Niðurstöður', url: 'https://espn.com' },
  { name: 'SeatGeek', icon: '🎫', desc: 'Miðar á leiki', url: 'https://seatgeek.com' },
  { name: 'FIFA 2026', icon: '🏆', desc: 'Leikdagatal', url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026' },
  { name: 'NFL', icon: '🏈', desc: 'American Football', url: 'https://nfl.com' },
  { name: 'NASCAR', icon: '🏎️', desc: 'Racing updates', url: 'https://nascar.com' },
]

export default function Sports() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>World Cup · Golf · Fréttir</p>
      </div>

      {/* World Cup Countdown */}
      <WorldCupWidget />

      {/* WC 2026 info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🌎</span>
          <h3 className="font-semibold text-sm">World Cup 2026 · Upplýsingar</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {WC_STATS.map(s => (
            <div key={s.val} className="flex flex-col items-center gap-1 p-2 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{s.val}</span>
              <span style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.2 }}>{s.desc}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl text-xs leading-loose" style={{ background: 'var(--surface2)' }}>
          <div className="grid grid-cols-2 gap-y-1">
            <span style={{ color: 'var(--muted)' }}>Upphafsmáttur</span>
            <span>11. júní 2026</span>
            <span style={{ color: 'var(--muted)' }}>Úrslit</span>
            <span>19. júlí 2026</span>
            <span style={{ color: 'var(--muted)' }}>Úrslitastaður</span>
            <span>MetLife Stadium, NJ</span>
            <span style={{ color: 'var(--muted)' }}>Gestgjafar</span>
            <span>🇺🇸 🇨🇦 🇲🇽</span>
          </div>
        </div>
        <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
           target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost w-full justify-center mt-3 text-xs">
          <ExternalLink size={12} /> Skoða leikdagatal á FIFA.com
        </a>
      </div>

      {/* Golf */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⛳</span>
          <h3 className="font-semibold text-sm">Golf</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {GOLF_LINKS.map(g => (
            <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col gap-2 p-3 rounded-xl"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <div className="flex items-center justify-between">
                <span className="text-xl">{g.icon}</span>
                <ExternalLink size={10} style={{ color: 'var(--muted)' }} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{g.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{g.desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Sports links */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Fljótar tengingar</h3>
        <div className="grid grid-cols-2 gap-2">
          {SPORTS_QUICK.map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2.5 p-3 rounded-xl"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl shrink-0">{l.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{l.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{l.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
