import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, X, ExternalLink, Trophy, Trash2, Check } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰', desc: 'Premium íþróttafréttir' },
  { label: 'BBC Sport', url: 'https://bbc.com/sport', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', desc: 'Enska fótbolti' },
  { label: 'ISL – Pepsi Max deildin', url: 'https://www.ksi.is/mot/farboltamot/karlar/besta-deild-karla/', icon: '🇮🇸', desc: 'Íslenska besta deild' },
  { label: 'Transfermarkt – Ísland', url: 'https://www.transfermarkt.com/wettbewerbe/national/wettbewerb/IS1', icon: '📊', desc: 'Íslenskar töflur & markaðsverð' },
  { label: 'FlashScore', url: 'https://www.flashscore.com', icon: '⚡', desc: 'Lífandi niðurstöður' },
  { label: 'WTA / ATP', url: 'https://www.atptour.com', icon: '🎾', desc: 'Tennis rankings & leikir' },
  { label: 'Sofascore', url: 'https://www.sofascore.com', icon: '📱', desc: 'Lífandi stig & tölfræði' },
]

const DEFAULT_MATCHES = [
  { id: '1', home: 'West Ham United', away: 'Brentford', competition: 'Premier League', date: '2026-05-31', time: '15:00', homeScore: null, awayScore: null, done: false },
]

const COMPETITIONS = ['Premier League', 'Besta deild karla', 'Landsleikur', 'Champions League', 'Önnur', 'Bolti', 'Tennis', 'Körfubolti']

export default function Sports() {
  const [matches, setMatches] = useLocalStorage('addi_matches_v2', DEFAULT_MATCHES)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [tab, setTab] = useState('upcoming')

  const [form, setForm] = useState({
    home: '', away: '', competition: 'Premier League',
    date: '', time: '', homeScore: '', awayScore: '',
  })

  const upcoming = matches
    .filter(m => !m.done)
    .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')))

  const results = matches
    .filter(m => m.done)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const resetForm = () => setForm({ home: '', away: '', competition: 'Premier League', date: '', time: '', homeScore: '', awayScore: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.home.trim() || !form.away.trim() || !form.date) return
    if (editId) {
      setMatches(prev => prev.map(m => m.id === editId ? {
        ...m, home: form.home, away: form.away, competition: form.competition,
        date: form.date, time: form.time,
      } : m))
      setEditId(null)
    } else {
      setMatches(prev => [{
        id: Date.now().toString(),
        home: form.home, away: form.away, competition: form.competition,
        date: form.date, time: form.time,
        homeScore: null, awayScore: null, done: false,
      }, ...prev])
    }
    resetForm()
    setShowForm(false)
  }

  const markResult = (id, homeScore, awayScore) => {
    setMatches(prev => prev.map(m =>
      m.id === id ? { ...m, homeScore: Number(homeScore), awayScore: Number(awayScore), done: true } : m
    ))
  }

  const remove = (id) => setMatches(prev => prev.filter(m => m.id !== id))
  const reopen = (id) => setMatches(prev => prev.map(m => m.id === id ? { ...m, done: false, homeScore: null, awayScore: null } : m))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {upcoming.length} komandi · {results.length} niðurstöður
          </p>
        </div>
        <button onClick={() => { resetForm(); setEditId(null); setShowForm(!showForm) }} className="btn btn-primary">
          <Plus size={16} /> Leikur
        </button>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold px-1 mb-1" style={{ color: 'var(--muted)' }}>SKJÓTAR TENGLAR</div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
               className="card flex items-center gap-2.5 py-2.5 px-3 hover:border-[var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
              <span className="text-lg shrink-0">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{link.label}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{link.desc}</div>
              </div>
              <ExternalLink size={11} style={{ color: 'var(--muted)' }} className="shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Add match form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{editId ? 'Breyta leik' : 'Bæta við leik'}</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" placeholder="Heimalið" value={form.home} onChange={e => setForm(f => ({ ...f, home: e.target.value }))} autoFocus />
            <input className="input text-sm" placeholder="Gestir" value={form.away} onChange={e => setForm(f => ({ ...f, away: e.target.value }))} />
          </div>
          <select className="input text-sm" value={form.competition} onChange={e => setForm(f => ({ ...f, competition: e.target.value }))}>
            {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="input text-sm" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            <input type="time" className="input text-sm" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary justify-center">{editId ? 'Vista' : 'Bæta við'}</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', '📅 Komandi'], ['results', '🏆 Niðurstöður']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'upcoming' && (
        <div className="flex flex-col gap-2">
          {upcoming.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engir leikir skráðir 🏟️
            </div>
          ) : upcoming.map(m => (
            <MatchCard key={m.id} match={m} onMark={markResult} onRemove={remove} upcoming />
          ))}
        </div>
      )}

      {tab === 'results' && (
        <div className="flex flex-col gap-2">
          {results.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar niðurstöður enn
            </div>
          ) : results.map(m => (
            <MatchCard key={m.id} match={m} onRemove={remove} onReopen={reopen} />
          ))}
        </div>
      )}
    </div>
  )
}

function MatchCard({ match: m, onMark, onRemove, onReopen, upcoming }) {
  const [scoring, setScoring] = useState(false)
  const [hs, setHs] = useState('')
  const [as_, setAs] = useState('')

  const dateLabel = new Date(m.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
  const isToday = new Date(m.date).toDateString() === new Date().toDateString()

  const homeWin = m.done && m.homeScore > m.awayScore
  const awayWin = m.done && m.awayScore > m.homeScore
  const draw = m.done && m.homeScore === m.awayScore

  return (
    <div className="card flex flex-col gap-2" style={{ borderColor: isToday ? 'rgba(0,212,170,0.35)' : 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy size={12} style={{ color: 'var(--muted)' }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{m.competition}</span>
          {isToday && <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)', fontSize: 9, padding: '1px 6px' }}>Í DAG</span>}
        </div>
        <div className="flex items-center gap-1">
          {m.done && (
            <button onClick={() => onReopen(m.id)} className="text-xs" style={{ color: 'var(--muted)' }}>Endur</button>
          )}
          <button onClick={() => onRemove(m.id)} style={{ color: 'var(--muted)' }}><Trash2 size={13} /></button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <div className="text-sm font-semibold" style={{ color: homeWin ? 'var(--success)' : 'var(--text)' }}>{m.home}</div>
        </div>

        {m.done ? (
          <div className="text-xl font-bold tabular-nums px-2"
               style={{ color: draw ? 'var(--muted)' : 'var(--text)' }}>
            {m.homeScore} – {m.awayScore}
          </div>
        ) : (
          <div className="text-sm font-medium px-2" style={{ color: 'var(--muted)' }}>
            {m.time ? m.time : 'vs'}
          </div>
        )}

        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: awayWin ? 'var(--success)' : 'var(--text)' }}>{m.away}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateLabel}</span>
        {upcoming && !scoring && (
          <button onClick={() => setScoring(true)} className="btn text-xs py-1 px-2"
            style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <Check size={11} /> Setja niðurstöðu
          </button>
        )}
      </div>

      {scoring && (
        <div className="flex items-center gap-2 mt-1">
          <input type="number" min={0} max={20} className="input text-center text-sm" placeholder="0" value={hs}
            onChange={e => setHs(e.target.value)} style={{ width: 56 }} autoFocus />
          <span style={{ color: 'var(--muted)' }}>–</span>
          <input type="number" min={0} max={20} className="input text-center text-sm" placeholder="0" value={as_}
            onChange={e => setAs(e.target.value)} style={{ width: 56 }} />
          <button onClick={() => { if (hs !== '' && as_ !== '') { onMark(m.id, hs, as_); setScoring(false) } }}
            className="btn btn-primary text-xs py-1.5 flex-1">Vista</button>
          <button onClick={() => setScoring(false)} className="btn btn-ghost text-xs py-1.5"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}
