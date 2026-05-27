import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Trophy, Wallet, Heart, Timer, MoreHorizontal, X, FileText, CheckSquare, CreditCard, Settings } from 'lucide-react'

const MAIN_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/sports', icon: Trophy, label: 'Sports' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/health', icon: Heart, label: 'Heilsa' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
]

const MORE_NAV = [
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/subscriptions', icon: CreditCard, label: 'Áskriftir' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* More popup */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl p-2 min-w-48"
               style={{ background: 'rgba(17,24,39,0.97)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', boxShadow: '0 -4px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between px-2 py-1.5 mb-1">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>More</span>
              <button onClick={() => setShowMore(false)} style={{ color: 'var(--muted)' }}>
                <X size={13} />
              </button>
            </div>
            {MORE_NAV.map(({ to, icon: Icon, label }) => (
              <button
                key={to}
                onClick={() => { navigate(to); setShowMore(false) }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: 'var(--text)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon size={16} strokeWidth={1.8} style={{ color: 'var(--muted)' }} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
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

          {/* More button */}
          <button
            onClick={() => setShowMore(v => !v)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${showMore ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
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
