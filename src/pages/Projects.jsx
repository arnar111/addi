import { useState } from 'react'
import { ExternalLink, GitBranch, Globe, ChevronDown, ChevronUp } from 'lucide-react'

const PROJECTS = [
  {
    id: 'takkarena',
    name: 'Takkarena',
    emoji: '🎟️',
    desc: 'Miðasala og sölukerfi — ticketing & sales management',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'active',
    tags: ['SaaS', 'Sales'],
    github: 'https://github.com/arnar111/takkarena-mvp',
    live: 'https://takkmvp.netlify.app',
  },
  {
    id: 'eign',
    name: 'Eign',
    emoji: '🏗️',
    desc: 'Fasteignastjórnun — property management app',
    lang: 'JavaScript',
    langColor: '#F7DF1E',
    status: 'building',
    tags: ['PropTech', 'Management'],
    github: 'https://github.com/arnar111/Eign',
  },
  {
    id: 'lendo',
    name: 'Lendo',
    emoji: '🔑',
    desc: 'Leigumarkaðstorg — peer-to-peer rental marketplace',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'building',
    tags: ['Marketplace', 'Rental'],
    github: 'https://github.com/arnar111/lendo',
  },
  {
    id: 'trading-bot',
    name: 'Trading Bot',
    emoji: '🤖',
    desc: 'Solana handelsrabot — Jupiter DEX automated trading',
    lang: 'JavaScript',
    langColor: '#F7DF1E',
    status: 'active',
    tags: ['Crypto', 'DeFi', 'Solana'],
    github: 'https://github.com/arnar111/trading-bot',
  },
  {
    id: 'snjallari',
    name: 'Snjallari Lausnir',
    emoji: '🏢',
    desc: 'Fyrirtækjavefur — company website',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'active',
    tags: ['Company'],
    github: 'https://github.com/arnar111/Snjallari-Lausnir',
  },
  {
    id: 'wagetrack2',
    name: 'WageTrack 2',
    emoji: '💰',
    desc: 'Launarakning — wage & bonus tracker with threshold system',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'done',
    tags: ['Finance', 'HR'],
    github: 'https://github.com/arnar111/wagetrack2',
  },
  {
    id: 'kosningar',
    name: 'Kosningar',
    emoji: '🗳️',
    desc: 'Íslenski stjórnmálaappurinn — explore party policies',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'done',
    tags: ['Civic', 'Iceland'],
    github: 'https://github.com/arnar111/kosningar',
  },
  {
    id: 'gledi',
    name: 'Gleði',
    emoji: '☀️',
    desc: 'Hamingja og vellíðan — happiness & wellbeing tracker',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'done',
    tags: ['Health', 'Wellbeing'],
    github: 'https://github.com/arnar111/gledi',
  },
  {
    id: 'spira',
    name: 'Spira',
    emoji: '🌱',
    desc: 'Plöntuverður innandyra — indoor plant tracker',
    lang: 'TypeScript',
    langColor: '#3178C6',
    status: 'done',
    tags: ['Lifestyle'],
    github: 'https://github.com/arnar111/spira',
  },
  {
    id: 'arnarflow',
    name: 'ArnarFlow',
    emoji: '🔄',
    desc: 'Verkflæðisstyring — workflow automation app',
    lang: 'JavaScript',
    langColor: '#F7DF1E',
    status: 'done',
    tags: ['Productivity'],
    github: 'https://github.com/arnar111/arnarflow',
  },
]

const STATUS_META = {
  active: { label: 'Virkt', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  building: { label: 'Í smíðum', color: 'var(--accent)', bg: 'rgba(0,212,170,0.12)' },
  done: { label: 'Lokið', color: 'var(--muted)', bg: 'var(--surface2)' },
}

function ProjectCard({ p }) {
  const status = STATUS_META[p.status] || STATUS_META.done

  return (
    <div className="card flex flex-col gap-3 transition-all hover:border-[var(--border)]"
         style={{ borderColor: p.status === 'active' ? 'rgba(34,197,94,0.2)' : p.status === 'building' ? 'rgba(0,212,170,0.15)' : 'var(--border)' }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: 'var(--surface2)' }}>
          {p.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{p.name}</span>
            <span className="badge text-xs" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{p.desc}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: p.langColor }} />
            <span style={{ color: 'var(--muted)' }}>{p.lang}</span>
          </span>
          {p.tags.map(t => (
            <span key={t} className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer"
               className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
               style={{ background: 'var(--surface2)' }}>
              <GitBranch size={14} style={{ color: 'var(--muted)' }} />
            </a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noopener noreferrer"
               className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
               style={{ background: 'rgba(0,212,170,0.12)' }}>
              <Globe size={14} style={{ color: 'var(--accent)' }} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === filter)
  const visible = showAll ? filtered : filtered.slice(0, 6)

  const counts = {
    all: PROJECTS.length,
    active: PROJECTS.filter(p => p.status === 'active').length,
    building: PROJECTS.filter(p => p.status === 'building').length,
    done: PROJECTS.filter(p => p.status === 'done').length,
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Verkefni</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {counts.active} virkt · {counts.building} í smíðum · {counts.done} lokið
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Virkt', value: counts.active, color: '#22c55e' },
          { label: 'Í smíðum', value: counts.building, color: 'var(--accent)' },
          { label: 'Lokið', value: counts.done, color: 'var(--muted)' },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['all', `Öll (${counts.all})`], ['active', '✅ Virkt'], ['building', '🔨 Í smíðum'], ['done', '✓ Lokið']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="flex flex-col gap-3">
        {visible.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>

      {filtered.length > 6 && (
        <button onClick={() => setShowAll(!showAll)}
          className="btn btn-ghost w-full justify-center text-sm">
          {showAll ? <><ChevronUp size={16} /> Sjá færra</> : <><ChevronDown size={16} /> Sjá öll ({filtered.length})</>}
        </button>
      )}
    </div>
  )
}
