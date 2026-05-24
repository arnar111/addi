import { useSports } from '../hooks/useSports'

function MatchCard({ m, onScore }) {
  const played = m.homeScore !== null && m.awayScore !== null
  const isUSMNT = m.homeTeam === 'USA' || m.awayTeam === 'USA'

  return (
    <div className="card" style={{ border: isUSMNT ? '1px solid rgba(34,197,94,0.25)' : '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="badge text-xs"
              style={{
                background: m.group === 'Úrslit' ? 'rgba(139,92,246,0.15)' : 'rgba(34,197,94,0.1)',
                color: m.group === 'Úrslit' ? 'var(--accent2)' : 'var(--success)',
              }}>
          {m.group === 'Úrslit' ? '🏆 Úrslit' : `Hópur ${m.group}`}
        </span>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(m.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xl shrink-0">{m.home}</span>
          <span className="text-sm font-medium truncate">{m.homeTeam}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <input type="number" min="0" max="20"
                 className="w-10 text-center rounded-lg py-1 text-sm font-bold outline-none"
                 style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                 value={m.homeScore ?? ''}
                 placeholder="—"
                 onChange={e => onScore(m.id, 'homeScore', e.target.value)} />
          <span className="font-bold" style={{ color: 'var(--muted)' }}>:</span>
          <input type="number" min="0" max="20"
                 className="w-10 text-center rounded-lg py-1 text-sm font-bold outline-none"
                 style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                 value={m.awayScore ?? ''}
                 placeholder="—"
                 onChange={e => onScore(m.id, 'awayScore', e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium truncate">{m.awayTeam}</span>
          <span className="text-xl shrink-0">{m.away}</span>
        </div>
      </div>

      {m.note && (
        <div className="mt-2 text-xs" style={{ color: isUSMNT ? 'var(--success)' : 'var(--muted)' }}>
          {isUSMNT ? '🇺🇸 ' : ''}{m.note}
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const { matches, plTable, updateScore, daysToWC, wcActive, wcOver } = useSports()
  const usmntMatches = matches.filter(m => m.homeTeam === 'USA' || m.awayTeam === 'USA')
  const otherMatches = matches.filter(m => m.homeTeam !== 'USA' && m.awayTeam !== 'USA')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">

      {/* Header */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>World Cup 2026 · Premier League</p>
      </div>

      {/* WC Hero */}
      <div className="card py-5 text-center relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.06))',
             border: '1px solid rgba(34,197,94,0.25)',
           }}>
        <div className="text-4xl mb-1">🏆</div>
        <h2 className="font-bold text-base">FIFA World Cup 2026</h2>
        <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico · 48 lið</p>

        {!wcActive && !wcOver && (
          <div className="flex justify-center gap-3 mb-3">
            <div className="flex flex-col items-center px-5 py-2 rounded-2xl"
                 style={{ background: 'rgba(34,197,94,0.12)' }}>
              <span className="text-4xl font-black leading-tight" style={{ color: 'var(--success)' }}>
                {daysToWC}
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>dagar eftir</span>
            </div>
          </div>
        )}

        {wcActive && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse-soft" style={{ background: 'var(--success)' }} />
            <span className="font-bold" style={{ color: 'var(--success)' }}>LIVE – Meistarakeppni heimsins!</span>
          </div>
        )}

        {wcOver && (
          <div className="text-sm mb-3" style={{ color: 'var(--muted)' }}>Meistarakeppnin er lokið 🏁</div>
        )}

        <div className="flex items-center justify-center gap-2 text-sm">
          <span>🇺🇸</span>
          <span className="font-semibold">USMNT</span>
          <span className="badge" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}>
            Hópur A
          </span>
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          11. júní – 19. júlí 2026
        </div>
      </div>

      {/* USMNT matches */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-base">🇺🇸</span>
          <h3 className="font-semibold text-sm">USMNT leikir</h3>
        </div>
        <div className="flex flex-col gap-2">
          {usmntMatches.map(m => (
            <MatchCard key={m.id} m={m} onScore={updateScore} />
          ))}
        </div>
      </div>

      {/* Other matches */}
      {otherMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-base">⚽</span>
            <h3 className="font-semibold text-sm">Aðrir leikir</h3>
          </div>
          <div className="flex flex-col gap-2">
            {otherMatches.map(m => (
              <MatchCard key={m.id} m={m} onScore={updateScore} />
            ))}
          </div>
        </div>
      )}

      {/* Premier League */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          <h3 className="font-semibold text-sm">Premier League</h3>
        </div>
        <div className="flex flex-col">
          {plTable.map((t, i) => (
            <div key={t.pos} className="flex items-center gap-3 py-2"
                 style={{ borderBottom: i < plTable.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-xs w-4 text-right font-bold"
                    style={{ color: t.pos <= 4 ? 'var(--success)' : t.pos >= 18 ? 'var(--danger)' : 'var(--muted)' }}>
                {t.pos}
              </span>
              <span className="text-base leading-none">{t.badge}</span>
              <span className="flex-1 text-sm"
                    style={{ fontWeight: t.spurs ? 700 : 400, color: t.spurs ? 'var(--text)' : 'var(--muted)' }}>
                {t.name}{t.spurs ? ' ⭐' : ''}
              </span>
              <span className="text-xs w-10 text-right" style={{ color: 'var(--muted)' }}>{t.gd}</span>
              <span className="text-sm font-bold w-6 text-right">{t.pts}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--muted)' }}>
          Stig eru uppfærð handvirkt — leikir eru að klárast
        </p>
      </div>

    </div>
  )
}
