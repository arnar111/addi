import { useState, useEffect } from 'react'
import { ExternalLink, Plus, Trash2, Trophy, Clock } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WC_START = new Date('2026-06-11T00:00:00')
const WC_FINAL = new Date('2026-07-19T00:00:00')

function Countdown() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const started = now >= WC_START
  const ended = now >= WC_FINAL
  const target = started ? WC_FINAL : WC_START

  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  const pad = n => String(n).padStart(2, '0')

  if (ended) return (
    <div className="card flex flex-col items-center gap-2 py-6"
         style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(239,68,68,0.08))', border: '1px solid rgba(251,191,36,0.3)' }}>
      <span className="text-4xl">🏆</span>
      <div className="text-lg font-bold">HM 2026 lokið!</div>
    </div>
  )

  return (
    <div className="card flex flex-col gap-3"
         style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(239,68,68,0.06))', border: '1px solid rgba(251,191,36,0.25)' }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🏆</span>
        <div>
          <div className="font-semibold text-sm" style={{ color: '#fbbf24' }}>
            {started ? 'HM 2026 í gangi!' : 'FIFA World Cup 2026'}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {started ? `Úrslitaleikur ${WC_FINAL.toLocaleDateString('is-IS', { month: 'long', day: 'numeric' })}` : 'Hefst 11. júní · Bandaríkin, Kanada, Mexíkó'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {[
          [days, 'Dagar'],
          [hours, 'Klukkur'],
          [mins, 'Mínútur'],
          [secs, 'Sekúndur'],
        ].map(([val, label]) => (
          <div key={label} className="flex-1 flex flex-col items-center py-2 rounded-xl"
               style={{ background: 'rgba(251,191,36,0.1)' }}>
            <div className="text-xl font-bold tabular-nums" style={{ color: '#fbbf24' }}>{pad(val)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>{label}</div>
          </div>
        ))}
      </div>
      {!started && days <= 30 && (
        <div className="text-xs text-center font-medium" style={{ color: '#fbbf24' }}>
          {days === 0 ? '🔥 Kynningarleikir í dag!' : `${days} dagar eftir!`}
        </div>
      )}
    </div>
  )
}

const LINKS = [
  { name: 'The Athletic', url: 'https://theathletic.com', icon: '📰', color: '#1a1a2e' },
  { name: 'BBC Sport', url: 'https://www.bbc.com/sport/football', icon: '⚽', color: '#1a4d8c' },
  { name: 'OneFootball', url: 'https://onefootball.com', icon: '🌐', color: '#00aa44' },
  { name: 'ESPN FC', url: 'https://www.espn.com/soccer', icon: '📺', color: '#d00b0b' },
  { name: 'Transfermarkt', url: 'https://www.transfermarkt.com', icon: '💰', color: '#1e7a35' },
  { name: 'Sofascore', url: 'https://www.sofascore.com', icon: '🔴', color: '#3d4591' },
  { name: 'r/soccer', url: 'https://reddit.com/r/soccer', icon: '💬', color: '#ff6314' },
  { name: 'WC 2026', url: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026', icon: '🏆', color: '#c41e3a' },
]

const ENGLAND_SQUAD = [
  'Pickford', 'Ramsdale', 'Flekken',
  'Alexander-Arnold', 'Trippier', 'Walker',
  'Guehi', 'Colwill', 'Konsa', 'Mykolenko',
  'Rice', 'Wharton', 'Mainoo', 'Gallagher',
  'Saka', 'Bellingham', 'Palmer', 'Gordon', 'Foden',
  'Kane', 'Toney', 'Watkins',
]

const GROUPS = [
  { group: 'A', teams: ['🇺🇸 USA', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', '🇷🇸 Serbia', '🇨🇲 Cameroon'] },
  { group: 'B', teams: ['🇧🇷 Brazil', '🇩🇪 Germany', '🇨🇴 Colombia', '🇯🇵 Japan'] },
  { group: 'C', teams: ['🇫🇷 France', '🇦🇷 Argentina', '🇸🇦 Saudi Arabia', '🇩🇰 Denmark'] },
  { group: 'D', teams: ['🇵🇹 Portugal', '🇳🇱 Netherlands', '🇲🇽 Mexico', '🇭🇷 Croatia'] },
]

function MatchTracker() {
  const [matches, setMatches] = useLocalStorage('addi_matches', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ home: '', away: '', competition: 'Premier League', date: '' })

  const add = (e) => {
    e.preventDefault()
    if (!form.home || !form.away) return
    setMatches(prev => [{ ...form, id: Date.now(), homeScore: null, awayScore: null }, ...prev])
    setForm({ home: '', away: '', competition: 'Premier League', date: '' })
    setShowForm(false)
  }

  const updateScore = (id, field, val) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, [field]: val === '' ? null : Number(val) } : m))
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Clock size={14} style={{ color: 'var(--accent)' }} /> Leikir til að fylgjast með
        </h3>
        <button onClick={() => setShowForm(o => !o)} className="btn btn-ghost text-xs py-1.5 px-2">
          <Plus size={12} /> Bæta við
        </button>
      </div>

      {showForm && (
        <form onSubmit={add} className="flex flex-col gap-2 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <input className="input text-xs py-2" placeholder="Heimalið" value={form.home}
              onChange={e => setForm(f => ({ ...f, home: e.target.value }))} autoFocus />
            <input className="input text-xs py-2" placeholder="Gestir" value={form.away}
              onChange={e => setForm(f => ({ ...f, away: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <input className="input text-xs py-2 flex-1" placeholder="Keppni" value={form.competition}
              onChange={e => setForm(f => ({ ...f, competition: e.target.value }))} />
            <input className="input text-xs py-2" type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              style={{ width: 130 }} />
          </div>
          <button type="submit" className="btn btn-primary text-xs py-1.5 justify-center">Bæta við</button>
        </form>
      )}

      {matches.length === 0 ? (
        <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>
          Engir leikir skráðir · Bættu við leikjum til að fylgjast með
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.slice(0, 10).map(m => (
            <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{m.home} vs {m.away}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {m.competition}{m.date ? ` · ${new Date(m.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input className="input text-xs py-1 text-center font-bold" style={{ width: 32, padding: '4px 2px' }}
                  type="number" min={0} max={99} placeholder="-"
                  value={m.homeScore ?? ''} onChange={e => updateScore(m.id, 'homeScore', e.target.value)} />
                <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>:</span>
                <input className="input text-xs py-1 text-center font-bold" style={{ width: 32, padding: '4px 2px' }}
                  type="number" min={0} max={99} placeholder="-"
                  value={m.awayScore ?? ''} onChange={e => updateScore(m.id, 'awayScore', e.target.value)} />
              </div>
              <button onClick={() => setMatches(prev => prev.filter(x => x.id !== m.id))}
                      style={{ color: 'var(--muted)', padding: 4 }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Football() {
  const [squadOpen, setSquadOpen] = useState(false)
  const [groupsOpen, setGroupsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">⚽ Fótbolti</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>HM 2026 · Premier League · Liverpool</p>
      </div>

      {/* WC Countdown */}
      <Countdown />

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Hlekkir</h3>
        <div className="grid grid-cols-4 gap-2">
          {LINKS.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all hover:scale-105 active:scale-95"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs leading-tight" style={{ color: 'var(--muted)', fontSize: 9 }}>{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Liverpool */}
      <div className="card flex flex-col gap-3"
           style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.08), rgba(200,16,46,0.03))', border: '1px solid rgba(200,16,46,0.2)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔴</span>
          <div>
            <div className="font-semibold text-sm">Liverpool FC</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Premier League · Anfield</div>
          </div>
          <a href="https://www.bbc.com/sport/football/teams/liverpool" target="_blank" rel="noopener noreferrer"
             className="ml-auto" style={{ color: 'var(--muted)' }}>
            <ExternalLink size={14} />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            [' Árleg leikjanúmer', '2025/26'],
            ['Leikmenn til HM', 'Salah, Díaz, Jota'],
            ['Næsti leikur', 'bbc.com/sport'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'rgba(200,16,46,0.08)' }}>
              <div className="text-xs font-medium leading-tight">{v}</div>
              <div style={{ color: 'var(--muted)', fontSize: 9 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Match tracker */}
      <MatchTracker />

      {/* England squad */}
      <div className="card flex flex-col gap-3">
        <button className="flex items-center justify-between w-full" onClick={() => setSquadOpen(o => !o)}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            <span className="font-semibold text-sm">Enska landsliðið · HM 2026</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{squadOpen ? '▲' : '▼'}</span>
        </button>
        {squadOpen && (
          <div className="animate-slide-up">
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Thomas Tuchel · 26 manna hópur</div>
            <div className="flex flex-wrap gap-1.5">
              {ENGLAND_SQUAD.map(p => (
                <span key={p} className="text-xs px-2 py-1 rounded-lg font-medium"
                      style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WC Groups */}
      <div className="card flex flex-col gap-3">
        <button className="flex items-center justify-between w-full" onClick={() => setGroupsOpen(o => !o)}>
          <div className="flex items-center gap-2">
            <Trophy size={16} style={{ color: '#fbbf24' }} />
            <span className="font-semibold text-sm">HM 2026 · Úrvalshópar</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{groupsOpen ? '▲' : '▼'}</span>
        </button>
        {groupsOpen && (
          <div className="grid grid-cols-2 gap-2 animate-slide-up">
            {GROUPS.map(g => (
              <div key={g.group} className="p-2.5 rounded-xl flex flex-col gap-1.5" style={{ background: 'var(--surface2)' }}>
                <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Hópur {g.group}</div>
                {g.teams.map(t => (
                  <div key={t} className="text-xs" style={{ color: 'var(--text)' }}>{t}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
