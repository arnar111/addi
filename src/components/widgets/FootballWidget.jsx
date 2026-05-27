import { useNavigate } from 'react-router-dom'
import { useFootball } from '../../hooks/useFootball'
import { Loader2, ChevronRight } from 'lucide-react'

// Arsenal & Tottenham — teams Arnar follows
const FAVOURITES = ['Arsenal', 'Tottenham', 'Spurs', 'Tottenham Hotspur']

export default function FootballWidget() {
  const { table, results, loading, error } = useFootball()
  const navigate = useNavigate()

  // Top 5 from table
  const top5 = table.slice(0, 5)

  // Find Arsenal & Spurs position
  const favouriteRows = table.filter(r =>
    FAVOURITES.some(f => r.name?.toLowerCase().includes(f.toLowerCase()))
  )

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="flex items-center justify-between px-4 py-3"
           style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <div>
            <div className="text-sm font-semibold">Premier League</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>2025–26</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
          style={{ color: 'var(--accent)', background: 'rgba(0,212,170,0.1)' }}
        >
          Meira <ChevronRight size={12} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={18} className="animate-spin" style={{ color: 'var(--muted)' }} />
        </div>
      )}

      {error && (
        <div className="px-4 py-4 text-center text-xs" style={{ color: 'var(--muted)' }}>
          Engar niðurstöður núna
        </div>
      )}

      {!loading && !error && (
        <div>
          {/* Mini table */}
          {top5.length > 0 && (
            <div className="px-4 py-2">
              <div className="flex text-xs mb-1" style={{ color: 'var(--muted)' }}>
                <span className="w-5 text-center">#</span>
                <span className="flex-1 ml-2">Lið</span>
                <span className="w-6 text-center">L</span>
                <span className="w-6 text-center">M</span>
                <span className="w-6 text-center">T</span>
                <span className="w-8 text-center font-medium">Stig</span>
              </div>
              {top5.map((row, i) => {
                const isFav = FAVOURITES.some(f => row.name?.toLowerCase().includes(f.toLowerCase()))
                return (
                  <div key={row.name}
                    className="flex items-center text-xs py-1"
                    style={{
                      borderRadius: 6,
                      background: isFav ? 'rgba(0,212,170,0.07)' : 'transparent',
                      margin: '1px -4px',
                      padding: '4px 4px',
                    }}>
                    <span className="w-5 text-center" style={{ color: i < 4 ? 'var(--accent)' : 'var(--muted)' }}>
                      {i + 1}
                    </span>
                    {row.logo ? (
                      <img src={row.logo} alt={row.shortName} className="w-4 h-4 mx-1.5 object-contain" />
                    ) : (
                      <span className="w-4 mx-1.5" />
                    )}
                    <span className="flex-1 truncate font-medium" style={{ color: isFav ? 'var(--accent)' : 'var(--text)' }}>
                      {row.shortName}
                    </span>
                    <span className="w-6 text-center" style={{ color: 'var(--muted)' }}>{row.played}</span>
                    <span className="w-6 text-center" style={{ color: 'var(--muted)' }}>{row.won}</span>
                    <span className="w-6 text-center" style={{ color: 'var(--muted)' }}>{row.lost}</span>
                    <span className="w-8 text-center font-bold" style={{ color: 'var(--text)' }}>{row.points}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Favourite team(s) if outside top 5 */}
          {favouriteRows.filter(r => !top5.find(t => t.name === r.name)).map(row => {
            const pos = table.findIndex(t => t.name === row.name) + 1
            return (
              <div key={row.name} className="mx-4 mb-2 px-3 py-2 rounded-xl flex items-center gap-2 text-xs"
                   style={{ background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <span style={{ color: 'var(--muted)' }}>#{pos}</span>
                {row.logo && <img src={row.logo} alt="" className="w-4 h-4 object-contain" />}
                <span className="flex-1 font-medium" style={{ color: 'var(--accent)' }}>{row.shortName}</span>
                <span style={{ color: 'var(--muted)' }}>{row.played}L</span>
                <span className="font-bold">{row.points} stig</span>
              </div>
            )
          })}

          {/* Recent results */}
          {results.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)' }} className="px-4 py-3">
              <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Nýlegar leikniðurstöður</div>
              {results.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center gap-2 text-xs py-1">
                  {r.homeLogo && <img src={r.homeLogo} alt="" className="w-4 h-4 object-contain" />}
                  <span className="flex-1 truncate">{r.home}</span>
                  <span className="font-bold px-2 py-0.5 rounded"
                        style={{ background: 'var(--surface2)', fontVariantNumeric: 'tabular-nums' }}>
                    {r.homeScore} – {r.awayScore}
                  </span>
                  <span className="flex-1 truncate text-right">{r.away}</span>
                  {r.awayLogo && <img src={r.awayLogo} alt="" className="w-4 h-4 object-contain" />}
                </div>
              ))}
            </div>
          )}

          {/* No data yet */}
          {!loading && top5.length === 0 && results.length === 0 && (
            <div className="px-4 py-4 text-center text-xs" style={{ color: 'var(--muted)' }}>
              📺 Bíð eftir næstu leiktíð
            </div>
          )}
        </div>
      )}
    </div>
  )
}
