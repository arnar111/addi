import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { useGolf } from '../hooks/useGolf'
import { RefreshCw, Plus, Trash2, X } from 'lucide-react'

function MatchCard({ event, isLast }) {
  if (!event) return null
  const date = new Date(event.dateEvent + 'T' + (event.strTime || '00:00:00'))
  const dateStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = event.strTime ? event.strTime.slice(0, 5) : ''
  const finished = event.intHomeScore !== null && event.intHomeScore !== '' && event.strStatus !== 'NS'
  const isLiverpool = (t) => t?.toLowerCase().includes('liverpool')
  const homeWin = finished && Number(event.intHomeScore) > Number(event.intAwayScore)
  const awayWin = finished && Number(event.intAwayScore) > Number(event.intHomeScore)
  const livHome = isLiverpool(event.strHomeTeam)

  return (
    <div className="card-sm" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs px-2 py-0.5 rounded-full"
             style={{ background: isLast ? 'rgba(100,116,139,0.15)' : 'rgba(0,212,170,0.12)',
                      color: isLast ? 'var(--muted)' : 'var(--accent)' }}>
          {isLast ? 'Síðasta leikur' : 'Næsti leikur'}
        </div>
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
          {dateStr}{!finished && timeStr ? ` · ${timeStr}` : ''}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: livHome ? 'var(--text)' : 'var(--muted)' }}>
            {event.strHomeTeam}
          </div>
        </div>
        {finished ? (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-lg font-bold tabular-nums" style={{ color: livHome && homeWin ? 'var(--success)' : livHome && awayWin ? 'var(--danger)' : 'var(--text)' }}>
              {event.intHomeScore}
            </span>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-lg font-bold tabular-nums" style={{ color: !livHome && awayWin ? 'var(--success)' : !livHome && homeWin ? 'var(--danger)' : 'var(--text)' }}>
              {event.intAwayScore}
            </span>
          </div>
        ) : (
          <div className="px-3 py-1 rounded-lg text-xs font-medium shrink-0"
               style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>vs</div>
        )}
        <div className="flex-1 min-w-0 text-right">
          <div className="text-sm font-semibold truncate" style={{ color: !livHome ? 'var(--text)' : 'var(--muted)' }}>
            {event.strAwayTeam}
          </div>
        </div>
      </div>
      {event.strLeague && (
        <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
          {event.strLeague}{event.strVenue ? ` · ${event.strVenue}` : ''}
        </div>
      )}
    </div>
  )
}

const WC_START = new Date('2026-06-12T00:00:00')

function WCSection() {
  const now = new Date()
  const diffMs = WC_START - now
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  const started = diffMs <= 0

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,40,104,0.12), rgba(180,0,0,0.08))' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">FIFA World Cup 2026 🏆</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>USA · Canada · México · 12. júní 2026</div>
        </div>
        {!started && (
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{diffDays}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar eftir</div>
          </div>
        )}
        {started && (
          <div className="text-xs px-2 py-1 rounded-full font-semibold"
               style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>Í gangi!</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-3 rounded-xl"
             style={{ background: 'rgba(0,40,104,0.2)' }}>
          <span className="text-2xl">🇺🇸</span>
          <div>
            <div className="text-sm font-semibold">USMNT</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Heimaland</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl"
             style={{ background: 'rgba(0,0,128,0.15)' }}>
          <span className="text-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          <div>
            <div className="text-sm font-semibold">England</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Thomas Tuchel</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GolfSection() {
  const { rounds, addRound, removeRound, handicap, avgScore } = useGolf()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ course: '', score: '', par: '72', slope: '113' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.score) return
    addRound(form)
    setForm({ course: '', score: '', par: '72', slope: '113' })
    setShowForm(false)
  }

  const hcp = handicap()
  const avg = avgScore()

  return (
    <div className="flex flex-col gap-3">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,212,170,0.05))' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
               style={{ background: 'rgba(34,197,94,0.15)' }}>⛳</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">GOLF+ VR</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Steam PCVR Beta · Skráð ✓</div>
          </div>
          <div className="text-xs px-2 py-1 rounded-full font-semibold"
               style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Beta</div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {hcp !== null ? (hcp > 0 ? `+${hcp}` : hcp) : '–'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Handicap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{avg ?? '–'}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Meðalskor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{rounds.length}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Ferðir</div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full justify-center">
        <Plus size={16} /> Skrá golfferð
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný golfferð</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Völlur" value={form.course}
            onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Skor</label>
              <input className="input" type="number" placeholder="72" value={form.score}
                onChange={e => setForm(f => ({ ...f, score: e.target.value }))} autoFocus />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Par</label>
              <input className="input" type="number" value={form.par}
                onChange={e => setForm(f => ({ ...f, par: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Slope</label>
              <input className="input" type="number" value={form.slope}
                onChange={e => setForm(f => ({ ...f, slope: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Vista ferð</button>
        </form>
      )}

      {rounds.length > 0 && (
        <div className="flex flex-col gap-2">
          {rounds.slice(0, 8).map(r => {
            const diff = r.score - r.par
            return (
              <div key={r.id} className="card-sm flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm"
                     style={{ background: 'rgba(34,197,94,0.12)' }}>⛳</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.course}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} · Skor: {r.score}
                  </div>
                </div>
                <div className="font-bold text-sm shrink-0"
                     style={{ color: diff <= 0 ? 'var(--success)' : diff <= 5 ? 'var(--muted)' : 'var(--danger)' }}>
                  {diff > 0 ? `+${diff}` : diff}
                </div>
                <button onClick={() => removeRound(r.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {rounds.length === 0 && (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">⛳</div>
          <div className="text-sm">Skráðu fyrstu golfferðina</div>
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const { data, loading, refresh, lastFetch } = useSports()
  const [tab, setTab] = useState('football')

  const tabs = [
    { id: 'football', label: '⚽ Knattspyrna' },
    { id: 'golf', label: '⛳ Golf' },
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Sport</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {tab === 'football' ? 'Liverpool · USMNT · England' : 'Golf+ VR · Stig & Handicap'}
          </p>
        </div>
        {tab === 'football' && (
          <button onClick={refresh}
            className="btn btn-ghost"
            style={{ padding: '8px 10px' }}
            title={lastFetch ? `Uppfært: ${new Date(lastFetch).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}` : ''}>
            <RefreshCw size={15} style={{ color: 'var(--muted)' }} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {tab === 'football' && (
        <div className="flex flex-col gap-4">
          {/* Liverpool */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-0.5">
              <span className="text-lg">🔴</span>
              <span className="font-semibold text-sm">Liverpool FC</span>
            </div>
            {loading ? (
              <>
                <div className="card animate-pulse-soft" style={{ height: 88 }} />
                <div className="card animate-pulse-soft" style={{ height: 88 }} />
              </>
            ) : data?.liverpool ? (
              <>
                {data.liverpool.last && <MatchCard event={data.liverpool.last} isLast />}
                {data.liverpool.next && <MatchCard event={data.liverpool.next} isLast={false} />}
                {!data.liverpool.last && !data.liverpool.next && (
                  <div className="card-sm text-center py-5 text-sm" style={{ color: 'var(--muted)' }}>
                    Engar leikjanir fundust — reyndu að uppfæra
                  </div>
                )}
              </>
            ) : (
              <div className="card-sm flex items-center gap-3 py-4">
                <span className="text-2xl">🔴</span>
                <div>
                  <div className="text-sm font-medium">Ekki hægt að ná í leikjanir</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Athugaðu netsamband og reyndu aftur</div>
                </div>
              </div>
            )}
          </div>

          {/* World Cup section */}
          <WCSection />
        </div>
      )}

      {tab === 'golf' && <GolfSection />}
    </div>
  )
}
