import { ExternalLink, Zap, Home, Leaf, ShoppingBag, Vote, Trophy, Music, Code, Star } from 'lucide-react'

const PROJECTS = [
  {
    name: 'Lendó',
    desc: 'Peer-to-peer leiga á Íslandi',
    url: 'https://lendoapp.is',
    icon: '🏠',
    color: '#00d4aa',
    primary: true,
    status: 'Virkt',
  },
  {
    name: 'Takk',
    desc: 'Launagreiðslu app',
    url: 'https://launatakk.netlify.app',
    icon: '💼',
    color: '#8b5cf6',
    status: 'Virkt',
  },
  {
    name: 'Spiran',
    desc: 'Plönturekur tracker',
    url: 'https://spiran.netlify.app',
    icon: '🌱',
    color: '#22c55e',
    status: 'Virkt',
  },
  {
    name: 'Draumakaup',
    desc: 'Man United færslur',
    url: 'https://draumakaup.netlify.app',
    icon: '⚽',
    color: '#ef4444',
    status: 'Virkt',
  },
  {
    name: 'Gléði',
    desc: 'Hamingja tracker',
    url: 'https://gledi.netlify.app',
    icon: '😊',
    color: '#f97316',
    status: 'Virkt',
  },
  {
    name: 'Addi',
    desc: 'Þetta app!',
    url: 'https://addi-app.netlify.app',
    icon: '⚡',
    color: '#00d4aa',
    status: 'Virkt',
  },
]

const QUICKLINKS = [
  { name: 'Netlify', url: 'https://app.netlify.com', icon: '🚀', desc: 'Deploy' },
  { name: 'GitHub', url: 'https://github.com/arnar111', icon: '🐙', desc: 'Kóði' },
  { name: 'mbl.is', url: 'https://mbl.is', icon: '📰', desc: 'Fréttir' },
  { name: 'Man United', url: 'https://www.manutd.com', icon: '🔴', desc: 'MUFC' },
  { name: 'Veður', url: 'https://vedur.is', icon: '🌦️', desc: 'Veður' },
  { name: 'Skógi', url: 'https://skagi.is', icon: '💬', desc: 'Samfélag' },
]

export default function Projects() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Verkefni</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>App og tenglar</p>
      </div>

      {/* Primary project */}
      {PROJECTS.filter(p => p.primary).map(p => (
        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
           className="card flex items-center gap-4 transition-all active:scale-95"
           style={{ background: `linear-gradient(135deg, ${p.color}18, ${p.color}08)`, border: `1px solid ${p.color}44`, textDecoration: 'none' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
               style={{ background: `${p.color}22` }}>
            {p.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{p.name}</span>
              <span className="badge text-xs" style={{ background: `${p.color}22`, color: p.color }}>{p.status}</span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{p.desc}</p>
            <p className="text-xs mt-1" style={{ color: p.color }}>lendoapp.is</p>
          </div>
          <ExternalLink size={16} style={{ color: p.color, flexShrink: 0 }} />
        </a>
      ))}

      {/* Other projects */}
      <div>
        <h2 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>Önnur verkefni</h2>
        <div className="grid grid-cols-2 gap-2">
          {PROJECTS.filter(p => !p.primary).map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
               className="card flex flex-col gap-2 transition-all active:scale-95"
               style={{ textDecoration: 'none' }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{p.icon}</span>
                <span className="badge text-xs" style={{ background: `${p.color}18`, color: p.color, fontSize: 9 }}>{p.status}</span>
              </div>
              <div>
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{p.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>Flýtitenglar</h2>
        <div className="grid grid-cols-3 gap-2">
          {QUICKLINKS.map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
               className="card flex flex-col items-center gap-1.5 py-3 transition-all active:scale-95 text-center"
               style={{ textDecoration: 'none' }}>
              <span className="text-2xl">{l.icon}</span>
              <span className="text-xs font-medium">{l.name}</span>
              <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{l.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
