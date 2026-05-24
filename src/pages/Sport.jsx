import { useState } from 'react'
import { Trophy, Star, Clock, ChevronRight, Tv } from 'lucide-react'

const WC_START = new Date('2026-06-11')
const TODAY = new Date()
const DAYS_UNTIL_WC = Math.ceil((WC_START - TODAY) / (1000 * 60 * 60 * 24))

const MY_TEAMS = [
  { id: 'tottenham', name: 'Tottenham', badge: '⚪', league: 'Premier League', color: '#132257' },
  { id: 'england', name: 'England', badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'FIFA World Cup 2026', color: '#ffffff' },
  { id: 'liverpool', name: 'Liverpool', badge: '🔴', league: 'Premier League', color: '#c8102e' },
  { id: 'mancity', name: 'Man City', badge: '🔵', league: 'Premier League', color: '#6cabdd' },
  { id: 'inter', name: 'Inter Milan', badge: '⚫🔵', league: 'Serie A', color: '#010e80' },
]

const RECENT_RESULTS = [
  { home: 'England', homeGoals: 3, away: 'Bosnia', awayGoals: 0, comp: 'WC Warm-up', date: 'May 21' },
  { home: 'Tottenham', homeGoals: 2, away: 'Chelsea', awayGoals: 1, comp: 'Premier League', date: 'May 19' },
  { home: 'Arsenal', homeGoals: 1, away: 'Liverpool', awayGoals: 2, comp: 'Premier League', date: 'May 19' },
  { home: 'Inter', homeGoals: 2, away: 'Juventus', awayGoals: 0, comp: 'Serie A', date: 'May 18' },
  { home: 'Man City', homeGoals: 4, away: 'Wolves', awayGoals: 1, comp: 'Premier League', date: 'May 18' },
]

const UPCOMING = [
  { home: 'England', away: 'France', date: 'Jún 11', time: '22:00', comp: 'WC - Hópur A' },
  { home: 'England', away: 'Brazil', date: 'Jún 15', time: '19:00', comp: 'WC - Hópur A' },
  { home: 'England', away: 'Mexico', date: 'Jún 19', time: '22:00', comp: 'WC - Hópur A' },
  { home: 'Inter', away: 'PSG', date: 'Jún 1', time: '21:00', comp: 'UCL Úrslitaleikur' },
]

const WC_GROUPS = {
  'A (England)': ['🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', '🇫🇷 France', '🇧🇷 Brazil', '🇲🇽 Mexico'],
  'B (Iceland)': ['🇮🇸 Iceland', '🇦🇷 Argentina', '🇳🇬 Nigeria', '🇨🇿 Czech Rep.'],
}

function isMyTeam(name) {
  return MY_TEAMS.some(t => name.toLowerCase().includes(t.name.toLowerCase()) ||
    name.toLowerCase().includes(t.id))
}

export default function Sport() {
  const [tab, setTab] = useState('wc')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Football · World Cup 2026</p>
      </div>

      {/* World Cup Countdown */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(139,92,246,0.12) 100%)',
        border: '1px solid rgba(0,212,170,0.25)',
      }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl">🏆</div>
          <div className="flex-1">
            <div className="font-bold text-base">FIFA World Cup 2026</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Bandaríkin · Kanada · Mexíkó</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{DAYS_UNTIL_WC}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar eftir</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {['Liðin dagar', 'Byrjar', 'Úrslitaleikur'].map((l, i) => (
            <div key={l} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xs font-semibold">{['11 Jún', '11 Jún 2026', '19 Júl 2026'][i]}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['wc', '🏆 WC 2026'], ['results', '📊 Niðurstöður'], ['upcoming', '📅 Fram undan'], ['teams', '⭐ Lið mín']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* World Cup Groups */}
      {tab === 'wc' && (
        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm">Hópar þínir</h3>
            </div>
            {Object.entries(WC_GROUPS).map(([group, teams]) => (
              <div key={group} className="mb-4 last:mb-0">
                <div className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Hópur {group}</div>
                <div className="flex flex-col gap-1">
                  {teams.map((team, i) => (
                    <div key={team} className="flex items-center gap-3 py-1.5 px-3 rounded-xl"
                         style={{ background: i === 0 ? 'rgba(0,212,170,0.08)' : 'var(--surface2)' }}>
                      <span className="text-sm">{team}</span>
                      {i === 0 && <span className="ml-auto badge" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)', fontSize: 9 }}>FYLGIST MEÐ</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} style={{ color: '#f97316' }} />
              <h3 className="font-semibold text-sm">WC 2026 · Leikir Englands</h3>
            </div>
            {UPCOMING.filter(u => u.comp.includes('WC')).map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1.5 last:mb-0"
                   style={{ background: 'var(--surface2)' }}>
                <div className="text-xs font-medium w-12 shrink-0" style={{ color: 'var(--muted)' }}>{m.date}</div>
                <div className="flex-1 text-sm font-medium">{m.home} <span style={{ color: 'var(--muted)' }}>vs</span> {m.away}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {tab === 'results' && (
        <div className="flex flex-col gap-2">
          {RECENT_RESULTS.map((m, i) => {
            const myHome = isMyTeam(m.home)
            const myAway = isMyTeam(m.away)
            return (
              <div key={i} className="card py-3"
                   style={{ borderColor: (myHome || myAway) ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>
                <div className="text-xs mb-2 flex items-center justify-between" style={{ color: 'var(--muted)' }}>
                  <span>{m.comp}</span>
                  <span>{m.date}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 text-right">
                    <span className={`text-sm font-semibold ${myHome ? 'text-[var(--accent)]' : ''}`}>{m.home}</span>
                  </div>
                  <div className="mx-4 flex items-center gap-2">
                    <span className="text-xl font-bold tabular-nums">{m.homeGoals}</span>
                    <span style={{ color: 'var(--muted)' }}>–</span>
                    <span className="text-xl font-bold tabular-nums">{m.awayGoals}</span>
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold ${myAway ? 'text-[var(--accent)]' : ''}`}>{m.away}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming Fixtures */}
      {tab === 'upcoming' && (
        <div className="flex flex-col gap-2">
          {UPCOMING.map((m, i) => (
            <div key={i} className="card py-3"
                 style={{ borderColor: (isMyTeam(m.home) || isMyTeam(m.away)) ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>
              <div className="text-xs mb-2 flex items-center justify-between" style={{ color: 'var(--muted)' }}>
                <span>{m.comp}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {m.date} · {m.time}</span>
              </div>
              <div className="flex items-center">
                <div className="flex-1 text-right">
                  <span className={`text-sm font-semibold ${isMyTeam(m.home) ? 'text-[var(--accent)]' : ''}`}>{m.home}</span>
                </div>
                <div className="mx-4">
                  <span className="text-sm font-bold" style={{ color: 'var(--muted)' }}>vs</span>
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-semibold ${isMyTeam(m.away) ? 'text-[var(--accent)]' : ''}`}>{m.away}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Teams */}
      {tab === 'teams' && (
        <div className="flex flex-col gap-3">
          {MY_TEAMS.map(team => (
            <div key={team.id} className="card flex items-center gap-4">
              <div className="text-3xl">{team.badge}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{team.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{team.league}</div>
              </div>
              <a href={`https://www.bbc.com/sport/football`} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
                <Tv size={12} /> Fréttir
              </a>
            </div>
          ))}
          <div className="card p-3" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              💡 <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>The Athletic</a> — þú ert áskrifandi! Opnaðu fyrir nákvæmar greiningar.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
