import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, Wallet, Flame,
  MoreHorizontal, ShoppingCart, FileText, Timer, Settings, X,
} from 'lucide-react'

const MAIN_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/habits', icon: Flame, label: 'Vanir' },
]

const MORE_NAV = [
  { to: '/shopping', icon: ShoppingCart, label: 'Innkaup' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false)
  const navigate = useNavigate()

  const goTo = (to) => {
    navigate(to)
    setShowMore(false)
  }

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMore(false)}
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
          <div
            className="absolute left-3 right-3 rounded-2xl p-4"
            style={{
              bottom: 80,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Meira</span>
              <button onClick={() => setShowMore(false)} style={{ color: 'var(--muted)', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MORE_NAV.map(({ to, icon: Icon, label }) => (
                <button key={to} onClick={() => goTo(to)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95"
                  style={{ background: 'var(--surface2)' }}>
                  <Icon size={22} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
           style={{
             background: 'rgba(10,14,26,0.97)',
             backdropFilter: 'blur(24px)',
             WebkitBackdropFilter: 'blur(24px)',
             borderTop: '1px solid var(--border)',
           }}>
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
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              showMore ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
            }`}>
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
