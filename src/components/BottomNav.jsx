import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, Trophy, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'

const PRIMARY_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/golf', label: 'Golf', emoji: '⛳' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
]

const MORE_NAV = [
  { to: '/habits', label: 'Vanur', emoji: '🔥' },
  { to: '/notes', label: 'Minnisblöð', emoji: '📝' },
  { to: '/timer', label: 'Tímari', emoji: '⏱️' },
  { to: '/settings', label: 'Stillingar', emoji: '⚙️' },
]

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false)
  const moreRef = useRef(null)

  useEffect(() => {
    if (!showMore) return
    const handle = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setShowMore(false) }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('touchstart', handle) }
  }, [showMore])

  return (
    <>
      {showMore && (
        <div ref={moreRef} className="fixed bottom-20 right-2 z-50 rounded-2xl shadow-xl overflow-hidden animate-slide-up"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)', minWidth: 160 }}>
          {MORE_NAV.map(({ to, label, emoji }) => (
            <NavLink key={to} to={to} onClick={() => setShowMore(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-all ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`
              }
              style={{ borderBottom: '1px solid var(--border)' }}>
              <span>{emoji}</span>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
           style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {PRIMARY_NAV.map(({ to, icon: Icon, label, emoji }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                }`
              }>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                    {emoji
                      ? <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
                      : <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                    }
                  </div>
                  <span style={{ fontSize: 10 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button onClick={() => setShowMore(m => !m)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${showMore ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
            <div className={`p-1.5 rounded-xl ${showMore ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
              <MoreHorizontal size={20} strokeWidth={showMore ? 2.5 : 1.8} />
            </div>
            <span style={{ fontSize: 10 }}>Meira</span>
          </button>
        </div>
      </nav>
    </>
  )
}
