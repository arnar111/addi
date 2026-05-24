import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, TrendingUp, Trophy, FileText, Timer, Settings, X, MoreHorizontal } from 'lucide-react'

const MAIN_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/crypto', icon: TrendingUp, label: 'Crypto' },
]

const MORE_NAV = [
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

function MoreSheet({ onClose }) {
  const navigate = useNavigate()

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 sheet-slide-up"
           style={{
             background: 'var(--surface)',
             borderTop: '1px solid var(--border)',
             borderRadius: '20px 20px 0 0',
             paddingBottom: 'env(safe-area-inset-bottom, 16px)',
           }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="font-semibold text-sm">Fleiri síður</span>
          <button onClick={onClose} style={{ color: 'var(--muted)' }}>
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 px-4 pb-4">
          {MORE_NAV.map(({ to, icon: Icon, label }) => (
            <button key={to} onClick={() => go(to)}
              className="flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all"
              style={{ background: 'var(--surface2)' }}>
              <div className="p-2 rounded-xl" style={{ background: 'rgba(0,212,170,0.1)' }}>
                <Icon size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 safe-bottom md:hidden"
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
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            style={{ color: 'var(--muted)' }}>
            <div className="p-1.5 rounded-xl">
              <MoreHorizontal size={20} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 10 }}>Meira</span>
          </button>
        </div>
      </nav>
      {showMore && <MoreSheet onClose={() => setShowMore(false)} />}
    </>
  )
}
