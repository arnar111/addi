import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, Link2, MoreHorizontal } from 'lucide-react'

function FootballIcon({ size = 20, strokeWidth }) {
  return <span style={{ fontSize: size - 2 }}>⚽</span>
}

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/football', iconEl: FootballIcon, label: 'Fótbolti' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/links', icon: Link2, label: 'Flýti' },
  { to: '/more', icon: MoreHorizontal, label: 'Meira' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom"
         style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-2 pt-1.5 pb-1">
        {NAV.map(({ to, icon: Icon, iconEl: IconEl, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                  {IconEl
                    ? <IconEl size={20} />
                    : <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  }
                </div>
                <span style={{ fontSize: 9 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
