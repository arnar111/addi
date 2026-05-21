import { Link, useLocation } from 'react-router-dom'
import { Settings, Timer } from 'lucide-react'

const PAGE_TITLES = {
  '/tasks': 'Verkefni',
  '/finance': 'Fjármál',
  '/notes': 'Minnisblöð',
  '/timer': 'Tímari',
  '/shopping': 'Innkaup',
  '/settings': 'Stillingar',
}

export default function Header() {
  const { pathname } = useLocation()
  return (
    <div
      className="md:hidden flex items-center justify-between px-4 sticky top-0 z-40"
      style={{
        background: 'rgba(10,14,26,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        paddingTop: `calc(env(safe-area-inset-top, 0px) + 10px)`,
        paddingBottom: '10px',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--accent)', color: '#000' }}
        >A</div>
        <span className="font-semibold text-base">
          {PAGE_TITLES[pathname] || 'Addi'}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <Link to="/timer" className="p-2 rounded-xl transition-all" style={{ color: 'var(--muted)' }}>
          <Timer size={18} />
        </Link>
        <Link to="/settings" className="p-2 rounded-xl transition-all" style={{ color: 'var(--muted)' }}>
          <Settings size={18} />
        </Link>
      </div>
    </div>
  )
}
