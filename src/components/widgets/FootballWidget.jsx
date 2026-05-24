import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11')
const TODAY = new Date()
const DAYS_UNTIL_WC = Math.ceil((WC_START - TODAY) / (1000 * 60 * 60 * 24))

const NEXT_MATCH = { home: 'Inter', away: 'PSG', date: 'Jún 1', time: '21:00', comp: 'UCL Úrslitaleikur' }
const LAST_RESULT = { home: 'England', homeGoals: 3, away: 'Bosnia', awayGoals: 0, date: 'May 21', comp: 'WC Warm-up' }

export default function FootballWidget() {
  return (
    <div className="card"
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06) 0%, rgba(249,115,22,0.06) 100%)', border: '1px solid rgba(249,115,22,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">⚽ Íþróttir</h3>
        <Link to="/sport" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Meira <ChevronRight size={12} />
        </Link>
      </div>

      {/* WC Countdown */}
      <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
           style={{ background: 'linear-gradient(90deg, rgba(0,212,170,0.12), rgba(139,92,246,0.08))' }}>
        <span className="text-2xl">🏆</span>
        <div className="flex-1">
          <div className="text-xs font-semibold">FIFA World Cup 2026</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Bandaríkin · Kanada · Mexíkó</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{DAYS_UNTIL_WC}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>dagar eftir</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Last result */}
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 6 }}>SÍÐASTI LEIKUR</div>
          <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{LAST_RESULT.home}</div>
          <div className="text-xl font-bold my-0.5 tabular-nums">{LAST_RESULT.homeGoals}–{LAST_RESULT.awayGoals}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{LAST_RESULT.away}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>{LAST_RESULT.comp}</div>
        </div>

        {/* Next match */}
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 6 }}>NÆSTI LEIKUR</div>
          <div className="text-xs font-semibold" style={{ color: '#f97316' }}>{NEXT_MATCH.home}</div>
          <div className="text-sm font-bold my-0.5">vs {NEXT_MATCH.away}</div>
          <div className="text-xs" style={{ color: 'var(--accent)' }}>{NEXT_MATCH.date} · {NEXT_MATCH.time}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>{NEXT_MATCH.comp}</div>
        </div>
      </div>
    </div>
  )
}
