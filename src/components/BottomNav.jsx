import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, Trophy, Flame, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MAIN_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/football', icon: Trophy, label: 'Spurs' },
  { to: '/thraukarinn', icon: Flame, label: 'Þraukarinn' },
]

const MORE_NAV = [
  { to: '/tasks', label: '✅ Verkefni' },
  { to: '/notes', label: '📝 Minnisblöð' },
  { to: '/timer', label: '⏱ Tímari' },
  { to: '/settings', label: '⚙️ Stillingar' },
]

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isMoreActive = MORE_NAV.some(n => n.to === location.pathname)

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-20 right-4 card flex flex-col gap-1 min-w-40 animate-slide-up"
               style={{ border: '1px solid var(--border)' }}
               onClick={e => e.stopPropagation()}>
            {MORE_NAV.map(n => (
              <button key={n.to} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-[var(--surface2)] w-full"
                      style={{ color: location.pathname === n.to ? 'var(--accent)' : 'var(--text)' }}
                      onClick={() => { navigate(n.to); setShowMore(false) }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom"
           style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {MAIN_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                }`
              }>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span style={{ fontSize: 10 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <button
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${isMoreActive || showMore ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
            onClick={() => setShowMore(v => !v)}>
            <div className={`p-1.5 rounded-xl transition-all ${showMore ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
              <MoreHorizontal size={20} strokeWidth={showMore ? 2.5 : 1.8} />
            </div>
            <span style={{ fontSize: 10 }}>Meira</span>
          </button>
        </div>
      </nav>
    </>
  )
}
