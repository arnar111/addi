import { useState } from 'react'
import { Trophy, Star, Clock, ChevronRight, Zap } from 'lucide-react'
import { usePremierLeague, useSpursFixtures, useWorldCupCountdown } from '../hooks/useSports'

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

function Separator() {
  return <div className="text-2xl font-bold self-start mt-1" style={{ color: 'var(--accent)', opacity: 0.5 }}>:</div>
}

function MatchCard({ match, isLast }) {
  if (!match) return null
  const isSpurs = (t) => t?.toLowerCase().includes('tottenham')
  const homeIsSpurs = isSpurs(match.home)
  const awayIsSpurs = isSpurs(match.away)

  let result = null
  if (isLast && match.homeScore !== null && match.homeScore !== undefined) {
    const hs = Number(match.homeScore), as_ = Number(match.awayScore)
    if (homeIsSpurs) result = hs > as_ ? 'W' : hs === as_ ? 'D' : 'L'
    if (awayIsSpurs) result = as_ > hs ? 'W' : as_ === hs ? 'D' : 'L'
  }

  const resultColor = result === 'W' ? 'var(--success)' : result === 'D' ? '#f97316' : result === 'L' ? 'var(--danger)' : 'var(--accent)'

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.04))' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          {match.competition}
        </span>
        {result && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${resultColor}22`, color: resultColor }}>
            {result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}
          </span>
        )}
        {!isLast && (
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Clock size={11} /> {match.date} {match.time}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {match.homeBadge && <img src={match.homeBadge} alt="" className="w-6 h-6 object-contain" />}
          <span className={`text-sm font-semibold ${homeIsSpurs ? '' : ''}`}
                style={{ color: homeIsSpurs ? 'var(--text)' : 'var(--muted)' }}>
            {match.home}
          </span>
        </div>
        {isLast && match.homeScore !== null ? (
          <div className="text-xl font-bold mx-3 tabular-nums">
            {match.homeScore} – {match.awayScore}
          </div>
        ) : (
          <div className="text-sm font-medium mx-3" style={{ color: 'var(--muted)' }}>vs</div>
        )}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className={`text-sm font-semibold`}
                style={{ color: awayIsSpurs ? 'var(--text)' : 'var(--muted)' }}>
            {match.away}
          </span>
          {match.awayBadge && <img src={match.awayBadge} alt="" className="w-6 h-6 object-contain" />}
        </div>
      </div>
      {isLast && match.date && (
        <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{match.date} · {match.venue}</div>
      )}
    </div>
  )
}

function TableRow({ team, highlight }) {
  const zoneColor = team.pos <= 4 ? '#3b82f6' : team.pos <= 6 ? '#f97316' : team.pos >= 18 ? '#ef4444' : null
  return (
    <div className={`flex items-center gap-2 py-2 px-2 rounded-xl text-sm transition-all ${highlight ? 'ring-1' : ''}`}
         style={{
           background: highlight ? 'rgba(139,92,246,0.12)' : 'transparent',
           ringColor: highlight ? 'rgba(139,92,246,0.4)' : undefined,
           border: highlight ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
         }}>
      <div className="w-5 text-xs text-center font-bold" style={{ color: zoneColor || 'var(--muted)' }}>{team.pos}</div>
      {team.badge
        ? <img src={team.badge} alt="" className="w-5 h-5 object-contain shrink-0" />
        : <div className="w-5 h-5 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
      }
      <div className="flex-1 min-w-0 font-medium truncate" style={{ color: highlight ? 'var(--text)' : 'var(--text)', fontSize: 13 }}>
        {team.name}
      </div>
      <div className="flex gap-3 text-xs shrink-0" style={{ color: 'var(--muted)' }}>
        <span className="w-6 text-center">{team.played}</span>
        <span className="w-6 text-center">{team.gd > 0 ? `+${team.gd}` : team.gd}</span>
        <span className="w-7 text-center font-bold" style={{ color: highlight ? 'var(--accent2)' : 'var(--text)' }}>{team.pts}</span>
      </div>
    </div>
  )
}

const ATP_TOP10 = [
  { pos: 1, name: 'Jannik Sinner', country: '🇮🇹', pts: 11330, flag: true },
  { pos: 2, name: 'Carlos Alcaraz', country: '🇪🇸', pts: 9320, flag: false },
  { pos: 3, name: 'Novak Djokovic', country: '🇷🇸', pts: 7650, flag: false },
  { pos: 4, name: 'Alexander Zverev', country: '🇩🇪', pts: 6890, flag: false },
  { pos: 5, name: 'Daniil Medvedev', country: '🇷🇺', pts: 5840, flag: false },
  { pos: 6, name: 'Andrey Rublev', country: '🇷🇺', pts: 4560, flag: false },
  { pos: 7, name: 'Casper Ruud', country: '🇳🇴', pts: 4200, flag: false },
  { pos: 8, name: 'Holger Rune', country: '🇩🇰', pts: 3910, flag: false },
]

export default function Sports() {
  const { table, loading: tableLoading } = usePremierLeague()
  const { last, next, loading: fixturesLoading } = useSpursFixtures()
  const wc = useWorldCupCountdown()
  const [tab, setTab] = useState('spurs')

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Trophy size={20} style={{ color: 'var(--accent)' }} /> Íþróttir
        </h1>
      </div>

      {/* World Cup Countdown */}
      <div className="card relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(139,92,246,0.1))', border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="absolute top-0 right-0 text-6xl opacity-10 select-none">⚽</div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏆</span>
          <div>
            <div className="font-bold text-sm">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico</div>
          </div>
          {!wc.started && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
              Upcoming
            </span>
          )}
          {wc.started && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse-soft"
                  style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
              LIVE
            </span>
          )}
        </div>
        {!wc.started ? (
          <div className="flex items-center justify-around py-2">
            <CountdownUnit value={wc.days} label="Dagar" />
            <Separator />
            <CountdownUnit value={wc.hours} label="Klst" />
            <Separator />
            <CountdownUnit value={wc.minutes} label="Mín" />
            <Separator />
            <CountdownUnit value={wc.seconds} label="Sek" />
          </div>
        ) : (
          <div className="text-center py-2 font-bold text-lg" style={{ color: 'var(--success)' }}>
            Heimsmeistaramótið er í gangi! ⚽🎉
          </div>
        )}
        <div className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
          Byrjar 11. júní 2026 · 48 lið · 104 leikir
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['spurs', '⚪ Spurs'], ['table', '📊 Tafla'], ['tennis', '🎾 Tennis']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-sm"
            style={{
              background: tab === t ? 'rgba(139,92,246,0.15)' : 'var(--surface)',
              color: tab === t ? 'var(--accent2)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(139,92,246,0.35)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'spurs' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Star size={15} style={{ color: '#8b5cf6' }} fill="currentColor" />
            <span className="text-sm font-semibold">Tottenham Hotspur</span>
          </div>

          {fixturesLoading ? (
            <div className="card animate-pulse-soft h-24" style={{ background: 'var(--surface)' }} />
          ) : (
            <>
              {last && (
                <div>
                  <div className="text-xs px-1 mb-2 font-medium" style={{ color: 'var(--muted)' }}>Síðasti leikur</div>
                  <MatchCard match={last} isLast />
                </div>
              )}
              {next && (
                <div>
                  <div className="text-xs px-1 mb-2 font-medium" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
                  <MatchCard match={next} isLast={false} />
                </div>
              )}
              {!last && !next && (
                <div className="card text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>
                  Engar niðurstöður fundust
                </div>
              )}
            </>
          )}

          <div className="card flex items-center gap-3 py-3"
               style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="text-2xl">⚪</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Come On You Spurs!</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Stofnað 1882 · White Hart Lane ➜ Tottenham Hotspur Stadium</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'table' && (
        <div className="card flex flex-col gap-0.5">
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="font-semibold text-sm flex-1">Premier League 25/26</div>
            <div className="flex gap-3 text-xs shrink-0" style={{ color: 'var(--muted)' }}>
              <span className="w-6 text-center">P</span>
              <span className="w-6 text-center">GD</span>
              <span className="w-7 text-center">Pts</span>
            </div>
          </div>

          {/* Zone legend */}
          <div className="flex gap-3 px-2 mb-2 flex-wrap">
            {[['#3b82f6','Champions League'], ['#f97316','Europa League'], ['#ef4444','Relegation']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{l}</span>
              </div>
            ))}
          </div>

          {tableLoading && (
            <div className="flex flex-col gap-2 py-2">
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="h-8 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
              ))}
            </div>
          )}

          {!tableLoading && table && table.map(team => (
            <TableRow
              key={team.pos}
              team={team}
              highlight={team.name.toLowerCase().includes('tottenham')}
            />
          ))}

          {!tableLoading && !table && (
            <div className="text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>
              Gat ekki sótt stöðutöfluna
            </div>
          )}
        </div>
      )}

      {tab === 'tennis' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(0,212,170,0.04))' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎾</span>
              <div>
                <div className="font-semibold text-sm">Roland Garros 2026</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>25. maí – 8. júní · París</div>
              </div>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse-soft"
                    style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                LIVE
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Sinner vs Alcaraz expected final showdown 👀
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm">ATP Top 10</div>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Live rankings</span>
            </div>
            <div className="flex flex-col gap-0">
              {ATP_TOP10.map(p => (
                <div key={p.pos} className="flex items-center gap-3 py-2"
                     style={{ borderBottom: p.pos < ATP_TOP10.length ? '1px solid var(--border)' : 'none',
                              background: p.pos === 1 ? 'rgba(0,212,170,0.04)' : 'transparent',
                              borderRadius: 8 }}>
                  <div className="w-5 text-xs font-bold text-center" style={{ color: p.pos === 1 ? 'var(--accent)' : 'var(--muted)' }}>
                    {p.pos}
                  </div>
                  <div className="text-base">{p.country}</div>
                  <div className="flex-1 text-sm font-medium" style={{ color: p.pos === 1 ? 'var(--text)' : 'var(--text)' }}>
                    {p.name}
                    {p.pos === 1 && <span className="ml-1 text-xs" style={{ color: 'var(--accent)' }}>★ #1</span>}
                  </div>
                  <div className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                    {p.pts.toLocaleString()} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
