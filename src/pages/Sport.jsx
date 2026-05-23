import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, ExternalLink, Trophy, Star, X, Edit2, Check } from 'lucide-react'

const WC_START = new Date('2026-06-11T20:00:00Z')

function daysUntilWC() {
  const diff = WC_START - new Date()
  if (diff < 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const TEAMS = [
  { id: 'man-city', name: 'Manchester City', flag: '🔵', league: 'Premier League', color: '#6CABDD' },
  { id: 'liverpool', name: 'Liverpool', flag: '🔴', league: 'Premier League', color: '#C8102E' },
  { id: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'WC 2026', color: '#FFFFFF' },
  { id: 'usmnt', name: 'USMNT', flag: '🇺🇸', league: 'WC 2026', color: '#B22234' },
  { id: 'iceland', name: 'Ísland', flag: '🇮🇸', league: 'Þjóðarliðið', color: '#003897' },
]

const LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰', color: '#1a73e8' },
  { label: 'BBC Sport', url: 'https://bbc.co.uk/sport', icon: '⚽', color: '#BB1919' },
  { label: 'ESPN FC', url: 'https://espnfc.com', icon: '🎙️', color: '#CC0000' },
  { label: 'WC 2026', url: 'https://fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026', icon: '🏆', color: '#FFD700' },
  { label: 'Flashscore', url: 'https://flashscore.com', icon: '⚡', color: '#f97316' },
  { label: 'FBref', url: 'https://fbref.com', icon: '📊', color: '#00d4aa' },
]

const WC_GROUPS = [
  { group: 'A', teams: ['USA', 'Panama', 'Norður-Makedónía', 'Oman'] },
  { group: 'B', teams: ['Argentina', 'Perú', 'Nýja Sjáland', 'Gvínea'] },
]

function NoteEditor({ notes, setNotes, teamId }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(notes[teamId] || '')

  const save = () => {
    setNotes(n => ({ ...n, [teamId]: text }))
    setEditing(false)
  }

  if (!editing && !notes[teamId]) {
    return (
      <button onClick={() => setEditing(true)} className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
        <Plus size={11} /> Bæta við athugasemd
      </button>
    )
  }

  if (editing) {
    return (
      <div className="mt-2 flex flex-col gap-1">
        <input className="input text-xs py-1.5" placeholder="Athugasemd..." value={text}
          onChange={e => setText(e.target.value)} autoFocus />
        <div className="flex gap-1">
          <button onClick={save} className="btn btn-primary text-xs py-1 px-2"><Check size={11} /></button>
          <button onClick={() => { setText(notes[teamId] || ''); setEditing(false) }} className="btn btn-ghost text-xs py-1 px-2"><X size={11} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-1.5 flex items-start justify-between gap-2">
      <p className="text-xs flex-1" style={{ color: 'var(--muted)' }}>{notes[teamId]}</p>
      <button onClick={() => { setText(notes[teamId]); setEditing(true) }} style={{ color: 'var(--muted)', flexShrink: 0 }}>
        <Edit2 size={11} />
      </button>
    </div>
  )
}

export default function Sport() {
  const [notes, setNotes] = useLocalStorage('sport_notes', {})
  const [favorites, setFavorites] = useLocalStorage('sport_favorites', ['man-city', 'liverpool', 'england', 'usmnt', 'iceland'])

  const days = daysUntilWC()
  const wcStarted = days === 0

  const toggleFav = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Sport</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Fótbolti & Íþróttir</p>
        </div>
      </div>

      {/* World Cup Countdown — BIG */}
      <div className="card relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(0,212,170,0.08))', borderColor: 'rgba(255,215,0,0.2)' }}>
        <div className="absolute top-0 right-0 text-6xl opacity-10 -mt-2 -mr-2">⚽</div>
        <div className="text-xs font-semibold mb-1" style={{ color: '#FFD700' }}>FIFA HEIMSBIKARINN 2026</div>
        <div className="flex items-end gap-3">
          {wcStarted ? (
            <div className="text-3xl font-bold" style={{ color: '#FFD700' }}>Í GANGI!</div>
          ) : (
            <>
              <div className="text-5xl font-bold tracking-tight" style={{ color: '#FFD700' }}>{days}</div>
              <div className="text-sm pb-1.5" style={{ color: 'var(--muted)' }}>dagar til<br/>upphafsleiks</div>
            </>
          )}
        </div>
        <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
          11. júní 2026 · Bandaríkin, Kanada, Mexíkó
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          Úrslit: 19. júlí 2026
        </div>
        <a href="https://fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
           target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs mt-3 w-full justify-center py-2" style={{ borderColor: 'rgba(255,215,0,0.2)' }}>
          <ExternalLink size={12} /> Skoða dagskrá
        </a>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold mb-2 px-1">Hraðtenglar</h3>
        <div className="grid grid-cols-3 gap-2">
          {LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
               className="card flex flex-col items-center gap-1.5 py-3 no-underline transition-all hover:scale-105 active:scale-95">
              <span className="text-xl">{l.icon}</span>
              <span className="text-xs font-medium text-center" style={{ color: 'var(--muted)' }}>{l.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Favorite teams */}
      <div>
        <h3 className="text-sm font-semibold mb-2 px-1">Mín lið</h3>
        <div className="flex flex-col gap-3">
          {TEAMS.map(team => {
            const isFav = favorites.includes(team.id)
            return (
              <div key={team.id} className="card" style={{ borderColor: isFav ? `${team.color}33` : 'var(--border)', opacity: isFav ? 1 : 0.5 }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{team.flag}</span>
                    <div>
                      <div className="font-semibold text-sm">{team.name}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>{team.league}</div>
                    </div>
                  </div>
                  <button onClick={() => toggleFav(team.id)} style={{ color: isFav ? '#FFD700' : 'var(--muted)' }}>
                    <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
                {isFav && <NoteEditor notes={notes} setNotes={setNotes} teamId={team.id} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Þraukarinn link */}
      <div className="card flex items-center gap-3"
           style={{ background: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.2)' }}>
        <span className="text-2xl">🏝️</span>
        <div className="flex-1">
          <div className="font-semibold text-sm">Þraukarinn S50</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Fantasy Survivor keppni</div>
        </div>
        <a href="https://docs.google.com/spreadsheets/d/1BmIRZFKV6snv2CibGxAEehJgSIhbLfffibOMXypSFvo"
           target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs py-1.5">
          <ExternalLink size={12} /> Opna
        </a>
      </div>

      {/* Gaming shortcuts */}
      <div>
        <h3 className="text-sm font-semibold mb-2 px-1">Gaming</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Xbox', url: 'https://xbox.com', icon: '🎮', sub: 'Game Pass' },
            { label: 'GOLF+', url: 'https://golfplusvr.com', icon: '⛳', sub: 'VR Golf' },
          ].map(g => (
            <a key={g.label} href={g.url} target="_blank" rel="noopener noreferrer"
               className="card flex items-center gap-3 no-underline transition-all hover:scale-105 active:scale-95">
              <span className="text-2xl">{g.icon}</span>
              <div>
                <div className="font-semibold text-sm">{g.label}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{g.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
