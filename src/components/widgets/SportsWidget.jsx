import { NavLink } from 'react-router-dom'
import { useSports } from '../../hooks/useSports'
import { ChevronRight } from 'lucide-react'

const FORM_COLOR = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
const FORM_BG = { W: 'rgba(34,197,94,0.15)', D: 'rgba(249,115,22,0.15)', L: 'rgba(239,68,68,0.15)' }

export default function SportsWidget() {
  const { recentForm, arsenalStanding, results, fixtures } = useSports()

  const nextMatch = fixtures[0] || null
  const lastMatch = results[0] || null

  return (
    <NavLink to="/sports" className="card block" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(239,68,68,0.15)' }}>
            <span style={{ fontSize: 16 }}>⚽</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">Arsenal</span>
              {arsenalStanding && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: arsenalStanding.pos === 1 ? 'rgba(234,179,8,0.2)' : 'var(--surface2)', color: arsenalStanding.pos === 1 ? '#eab308' : 'var(--muted)' }}>
                  {arsenalStanding.pos === 1 ? '🏆' : `#${arsenalStanding.pos}`}
                </span>
              )}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {arsenalStanding ? `${arsenalStanding.pts} stig · ${arsenalStanding.played} leikir` : 'Premier League'}
            </div>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>

      {/* Form */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs mr-1" style={{ color: 'var(--muted)' }}>Form</span>
        {recentForm.map((r, i) => (
          <span key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: FORM_BG[r], color: FORM_COLOR[r] }}>{r}</span>
        ))}
        {recentForm.length === 0 && <span className="text-xs" style={{ color: 'var(--muted)' }}>Engar niðurstöður</span>}
      </div>

      <div className="flex gap-3">
        {lastMatch && (
          <div className="flex-1 rounded-xl p-2.5" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Síðasti leikur</div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                {lastMatch.homeAway === 'H' ? 'Arsenal' : lastMatch.opponent}
              </span>
              <span className="text-xs font-bold mx-1.5"
                    style={{ color: FORM_COLOR[lastMatch.result] }}>
                {lastMatch.goalsFor}–{lastMatch.goalsAgainst}
              </span>
              <span className="text-xs font-medium">
                {lastMatch.homeAway === 'H' ? lastMatch.opponent : 'Arsenal'}
              </span>
            </div>
          </div>
        )}
        {nextMatch && (
          <div className="flex-1 rounded-xl p-2.5" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="text-xs font-medium">
              {nextMatch.homeAway === 'H' ? `vs ${nextMatch.opponent}` : `@ ${nextMatch.opponent}`}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
              {new Date(nextMatch.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        )}
      </div>
    </NavLink>
  )
}
