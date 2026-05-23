import { useFootball } from '../../hooks/useFootball'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SportsWidget() {
  const { events, loading, daysLeft } = useFootball('FIFA.WORLD')
  const live = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'in')
  const recent = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'post').slice(0, 2)
  const upcoming = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'pre').slice(0, 2)
  const shown = live.length ? live.slice(0, 2) : recent.length ? recent.slice(0, 2) : upcoming.slice(0, 2)

  return (
    <div className="card" style={{ border: '1px solid rgba(230,57,70,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⚽</span>
          <h3 className="font-semibold text-sm">Knattspyrna</h3>
          {live.length > 0 && (
            <span className="badge animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', fontSize: 10 }}>
              LIVE
            </span>
          )}
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: '#e63946' }}>
          Allt <ChevronRight size={12} />
        </Link>
      </div>

      {daysLeft > 0 ? (
        <div className="flex items-center gap-3 p-3 rounded-xl"
             style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.1), rgba(255,140,0,0.08))' }}>
          <span className="text-3xl">🏆</span>
          <div>
            <div className="font-bold text-base">{daysLeft} dagar til HM 2026</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 England · 11. júní · USA/Kanada/Mexíkó
            </div>
          </div>
        </div>
      ) : shown.length > 0 ? (
        <div className="flex flex-col gap-2">
          {shown.map(e => {
            const comp = e.competitions?.[0]
            const home = comp?.competitors?.find(c => c.homeAway === 'home')
            const away = comp?.competitors?.find(c => c.homeAway === 'away')
            const isLive = comp?.status?.type?.state === 'in'
            const isFinal = comp?.status?.type?.state === 'post'
            return (
              <div key={e.id} className="flex items-center justify-between text-sm p-2 rounded-xl"
                   style={{ background: 'var(--surface2)' }}>
                <span className="flex-1 truncate">{home?.team?.shortDisplayName}</span>
                <span className="font-bold tabular-nums px-3" style={{ color: isLive ? 'var(--danger)' : 'var(--text)' }}>
                  {(isFinal || isLive) ? `${home?.score} – ${away?.score}` : 'vs'}
                </span>
                <span className="flex-1 text-right truncate">{away?.team?.shortDisplayName}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
          Engir leikir í dag
        </div>
      )}
    </div>
  )
}
