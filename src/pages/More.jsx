import { Link } from 'react-router-dom'
import { FileText, Timer, Settings, FolderKanban, ExternalLink } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Apps',
    items: [
      { to: '/notes', icon: '📝', label: 'Minnisblöð', desc: 'Glósur og minnismiðar', color: '#f97316' },
      { to: '/timer', icon: '⏱️', label: 'Tímari', desc: 'Pomodoro og tímamæling', color: '#8b5cf6' },
      { to: '/projects', icon: '🗂️', label: 'Verkefnin mín', desc: 'Lendó, Spira og fleiri', color: '#3b82f6' },
      { to: '/settings', icon: '⚙️', label: 'Stillingar', desc: 'Nafn, staður og fleira', color: '#64748b' },
    ],
  },
  {
    title: 'Tenglar',
    items: [
      { href: 'https://github.com/arnar111', icon: '🐙', label: 'GitHub', desc: 'Kóðageymslan mín', color: '#ffffff' },
      { href: 'https://theathletic.com', icon: '📰', label: 'The Athletic', desc: 'Íþróttafréttir', color: '#000000' },
      { href: 'https://app.netlify.com', icon: '🌐', label: 'Netlify', desc: 'Vefhýsing', color: '#00d4aa' },
      { href: 'https://takkmvp.netlify.app', icon: '🏪', label: 'Takkarena', desc: 'Sölurakningarappið', color: '#8b5cf6' },
    ],
  },
]

export default function More() {
  return (
    <div className="flex flex-col gap-6 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fleiri</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Öll verkfæri og tenglar</p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.title}>
          <div className="px-1 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            {section.title}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {section.items.map(item => {
              const inner = (
                <div
                  className="card flex flex-col gap-2"
                  style={{ border: '1px solid var(--border)', height: '100%', transition: 'border-color 0.2s' }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: item.color + '20' }}
                    >
                      {item.icon}
                    </div>
                    {item.href && <ExternalLink size={12} style={{ color: 'var(--muted)' }} />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.desc}</div>
                  </div>
                </div>
              )

              return item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  {inner}
                </a>
              ) : (
                <Link key={item.label} to={item.to} style={{ textDecoration: 'none' }}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
