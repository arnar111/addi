import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, Trophy, Briefcase, MoreHorizontal, FileText, Timer, Package, Settings, X } from 'lucide-react'

const NAV_MAIN = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/jobs', icon: Briefcase, label: 'Störf' },
]

const NAV_MORE = [
  { to: '/business', icon: Package, label: 'Lendó 🪑' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const navigate = useNavigate()

  const goTo = (to) => {
    navigate(to)
    setMoreOpen(false)
  }

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)}
             style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="absolute bottom-20 left-4 right-4 rounded-2xl p-4 flex flex-col gap-2"
               style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">Meira</span>
              <button onClick={() => setMoreOpen(false)}>
                <X size={16} style={{ color: 'var(--muted)' }} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {NAV_MORE.map(({ to, icon: Icon, label }) => (
                <button key={to} onClick={() => goTo(to)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
                  style={{ background: 'var(--surface2)' }}>
                  <Icon size={20} style={{ color: 'var(--text)' }} />
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
           style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {NAV_MAIN.map(({ to, icon: Icon, label }) => (
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

          <button onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl"
            style={{ color: moreOpen ? 'var(--accent)' : 'var(--muted)' }}>
            <div className={`p-1.5 rounded-xl transition-all ${moreOpen ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
              <MoreHorizontal size={20} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 10 }}>Meira</span>
          </button>
        </div>
      </nav>
    </>
  )
}
