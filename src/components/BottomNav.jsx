import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, Flame, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/habits', icon: Flame, label: 'Vanur' },
]

const MORE = [
  { to: '/notes', label: '📝 Minnisblöð' },
  { to: '/shopping', label: '🛒 Innkaup' },
  { to: '/timer', label: '⏱️ Tímari' },
  { to: '/settings', label: '⚙️ Stillingar' },
]

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-20 right-3 rounded-2xl overflow-hidden shadow-xl"
               style={{ background: 'var(--surface)', border: '1px solid var(--border)', minWidth: 180 }}
               onClick={e => e.stopPropagation()}>
            {MORE.map(({ to, label }) => (
              <button key={to} onClick={() => { navigate(to); setShowMore(false) }}
                className="w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--surface2)]"
                style={{ color: 'var(--text)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
           style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {NAV.map(({ to, icon: Icon, label }) => (
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

          <button onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            style={{ color: showMore ? 'var(--accent)' : 'var(--muted)' }}>
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
