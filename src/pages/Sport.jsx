import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useSport } from '../hooks/useSport'
import WorldCupWidget from '../components/widgets/WorldCupWidget'

const TABS = [
  { id: 'wc', label: '🏆 Heimsbikar' },
  { id: 'pl', label: '⚽ PL Tafla' },
]

const WC_TEAMS = [
  { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', info: 'Án Foden' },
  { flag: '🇺🇸', name: 'Bandaríkin', info: 'Heimaþjóð' },
  { flag: '🇦🇷', name: 'Argentína', info: 'Meistarar 2022' },
  { flag: '🇫🇷', name: 'Frakkland', info: 'Kappingi 2022' },
  { flag: '🇧🇷', name: 'Brasilía', info: 'Eftirlæti' },
  { flag: '🇩🇪', name: 'Þýskaland', info: 'Öflugir' },
  { flag: '🇪🇸', name: 'Spánn', info: 'Meistarar 2024' },
  { flag: '🇵🇹', name: 'Portúgal', info: 'Ronaldo síðast' },
]

const KEY_DATES = [
  { date: '11. júní', title: 'Opnunarleiður', sub: '🇲🇽 Mexíkó · SoFi Stadium, LA' },
  { date: '12. júní', title: 'England fyrsti leikur', sub: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England · MetLife, NJ' },
  { date: '2. júlí', title: 'Hópaleikir ljúka', sub: 'Úrslit hópa staðfest' },
  { date: '3.–7. júlí', title: 'Átján í úrslitum', sub: 'Aðilar horna við' },
  { date: '19. júlí', title: '🏆 Úrslitaleikur', sub: 'MetLife Stadium, East Rutherford' },
]

export default function Sport() {
  const [tab, setTab] = useState('wc')
  const { plTable, loading, error, refresh, lastUpdated } = useSport()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Heimsbikar 2026 · Premier League</p>
      </div>

      <div className="flex gap-2">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'wc' && (
        <>
          <WorldCupWidget />

          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Lykilmót 📅</h3>
            <div className="flex flex-col">
              {KEY_DATES.map(({ date, title, sub }, i) => (
                <div key={date}
                  className="flex items-start gap-3 py-3"
                  style={{ borderBottom: i < KEY_DATES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="text-xs font-semibold shrink-0 mt-0.5 w-16"
                       style={{ color: 'var(--accent)' }}>{date}</div>
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Lið til að fylgjast með 👀</h3>
            <div className="grid grid-cols-2 gap-2">
              {WC_TEAMS.map(t => (
                <div key={t.name}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl"
                  style={{ background: 'var(--surface2)' }}>
                  <span className="text-xl shrink-0">{t.flag}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{t.info}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.04)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📰</span>
              <span className="font-semibold text-sm">Nýjasta frétt</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Phil Foden er <span style={{ color: 'var(--danger)' }}>ekki</span> á Enska heimsbikarlið 2026.
              Pochettino hefur 26 manna lið — ein breyting frá upprunalegri spá.
            </p>
          </div>
        </>
      )}

      {tab === 'pl' && (
        <div className="card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Premier League</h3>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>2025/26 leiktímabil</p>
            </div>
            <button onClick={refresh}
                    className="flex items-center gap-1.5 btn btn-ghost text-xs py-1.5 px-3">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              {lastUpdated
                ? lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
                : 'Sækja'}
            </button>
          </div>

          {error && !plTable && (
            <div className="text-center py-6 flex flex-col gap-2">
              <div className="text-2xl">⚽</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Gat ekki sótt töfluna</div>
              <button onClick={refresh} className="btn btn-ghost text-xs mx-auto" style={{ color: 'var(--accent)' }}>
                Reyna aftur
              </button>
            </div>
          )}

          {loading && !plTable && (
            <div className="flex flex-col gap-2">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-9 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
              ))}
            </div>
          )}

          {plTable && (
            <>
              <div className="flex items-center text-xs pb-1 px-1"
                   style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <span className="w-6 shrink-0">#</span>
                <span className="flex-1">Lið</span>
                <span className="w-7 text-center">L</span>
                <span className="w-7 text-center">S</span>
                <span className="w-7 text-center">T</span>
                <span className="w-8 text-center">MD</span>
                <span className="w-8 text-right font-semibold">Stig</span>
              </div>

              {plTable.slice(0, 20).map((team, i) => {
                const pos = Number(team.intRank) || i + 1
                const isChampions = pos <= 4
                const isEuropa = pos === 5 || pos === 6
                const isConf = pos === 7
                const isRel = pos >= 18
                const rowBg = isChampions ? 'rgba(0,212,170,0.04)' : isRel ? 'rgba(239,68,68,0.04)' : 'transparent'
                const posColor = isChampions ? 'var(--accent)' : isRel ? 'var(--danger)' : isEuropa ? '#f97316' : isConf ? '#3b82f6' : 'var(--muted)'

                return (
                  <div key={team.strTeam || i}
                    className="flex items-center py-2 px-1 rounded-lg"
                    style={{ background: rowBg }}>
                    <span className="w-6 text-xs font-bold shrink-0" style={{ color: posColor }}>{pos}</span>
                    <span className="flex-1 text-sm font-medium truncate">{team.strTeam}</span>
                    <span className="w-7 text-center text-xs" style={{ color: 'var(--muted)' }}>{team.intPlayed}</span>
                    <span className="w-7 text-center text-xs" style={{ color: 'var(--muted)' }}>{team.intWin}</span>
                    <span className="w-7 text-center text-xs" style={{ color: 'var(--muted)' }}>{team.intLoss}</span>
                    <span className="w-8 text-center text-xs" style={{ color: Number(team.intGoalDifference) > 0 ? 'var(--success)' : Number(team.intGoalDifference) < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                      {Number(team.intGoalDifference) > 0 ? '+' : ''}{team.intGoalDifference}
                    </span>
                    <span className="w-8 text-right text-sm font-bold"
                          style={{ color: isChampions ? 'var(--accent)' : 'var(--text)' }}>{team.intPoints}</span>
                  </div>
                )
              })}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-2" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
                {[
                  ['var(--accent)', 'Champions League'],
                  ['#f97316', 'Europa League'],
                  ['#3b82f6', 'Conference League'],
                  ['var(--danger)', 'Niðurstig'],
                ].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                    {l}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
