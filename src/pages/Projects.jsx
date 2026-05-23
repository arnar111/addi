import { ExternalLink, Globe } from 'lucide-react'

const PROJECTS = [
  { name: 'Lendó', url: 'https://lendoapp.is', emoji: '🏠', desc: 'Leigumarkaðurinn þinn', highlight: true },
  { name: 'Addi', url: 'https://addi-app.netlify.app', emoji: '⚡', desc: 'Þetta app', highlight: false },
  { name: 'Spiran', url: 'https://spiran.netlify.app', emoji: '🌱', desc: 'Plöntumælir', highlight: false },
  { name: 'Draumakaup', url: 'https://draumakaup.netlify.app', emoji: '⚽', desc: 'Man Utd milliþingarapp', highlight: false },
  { name: 'Takk MVP', url: 'https://takkmvp.netlify.app', emoji: '🏆', desc: 'MVP tracker', highlight: false },
  { name: 'Lendó Logo', url: 'https://lendologo.netlify.app', emoji: '🎨', desc: 'Lendó identity', highlight: false },
  { name: 'Mamma Recipes', url: 'https://mamma-recipes-arnar.netlify.app', emoji: '👩‍🍳', desc: 'Uppskriftir frá mömmu', highlight: false },
  { name: 'OpenPad', url: 'https://openpad.netlify.app', emoji: '📝', desc: 'Opinn ritill', highlight: false },
  { name: 'Kosningar', url: 'https://kosningar.netlify.app', emoji: '🗳️', desc: 'Kosningaapp', highlight: false },
  { name: 'Gleði', url: 'https://gledi.netlify.app', emoji: '😊', desc: 'Gleðimælir', highlight: false },
  { name: 'Betri Þú', url: 'https://betrithu.netlify.app', emoji: '💪', desc: 'Sjálfsþróun', highlight: false },
  { name: 'Póstnúmer', url: 'https://postnumer.netlify.app', emoji: '📮', desc: 'Íslensk póstnúmer', highlight: false },
  { name: 'Launatakk', url: 'https://launatakk.netlify.app', emoji: '💰', desc: 'Launareiknir', highlight: false },
  { name: 'Laungotu', url: 'https://laungotu.netlify.app', emoji: '📊', desc: 'Launagreining', highlight: false },
  { name: 'Claude Námskeið', url: 'https://claudenamskeid.netlify.app', emoji: '🤖', desc: 'Claude AI námskeið', highlight: false },
]

export default function Projects() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <h1 className="text-xl font-semibold">Verkefni mín</h1>
        </div>
        <p className="text-sm mt-0.5 ml-9" style={{ color: 'var(--muted)' }}>{PROJECTS.length} app á Netlify</p>
      </div>

      {/* Featured / Lendó */}
      <a
        href={PROJECTS[0].url}
        target="_blank"
        rel="noopener noreferrer"
        className="card flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.10), rgba(139,92,246,0.06))', textDecoration: 'none' }}>
        <div className="text-4xl">{PROJECTS[0].emoji}</div>
        <div className="flex-1">
          <div className="font-bold text-base">{PROJECTS[0].name}</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>{PROJECTS[0].desc}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{PROJECTS[0].url.replace('https://', '')}</div>
        </div>
        <ExternalLink size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      </a>

      {/* Grid of rest */}
      <div className="grid grid-cols-2 gap-2">
        {PROJECTS.slice(1).map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col gap-1.5 transition-all hover:border-[var(--accent)]"
            style={{ textDecoration: 'none', minHeight: 90 }}>
            <div className="text-2xl">{p.emoji}</div>
            <div className="font-medium text-sm">{p.name}</div>
            <div className="text-xs flex-1" style={{ color: 'var(--muted)' }}>{p.desc}</div>
            <div className="flex items-center gap-1 mt-auto" style={{ color: 'var(--accent)' }}>
              <Globe size={10} />
              <span style={{ fontSize: 10 }}>{p.url.replace('https://', '').replace('.netlify.app', '')}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
