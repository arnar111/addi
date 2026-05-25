const LINKS = [
  { label: 'Wolt', url: 'https://wolt.com/is/isl/reykjavik', emoji: '🍕', color: '#00B4D8', hint: 'Dagspassinn' },
  { label: 'The Athletic', url: 'https://theathletic.com', emoji: '⚽', color: '#00d4aa', hint: 'Fréttir' },
  { label: 'Lendó', url: 'https://lendo.is', emoji: '🏠', color: '#f97316', hint: 'Leiguinnkomin' },
  { label: 'GitHub', url: 'https://github.com/arnar111', emoji: '💻', color: '#8b5cf6', hint: 'Kóðinn þinn' },
  { label: 'Takkarena', url: 'https://takkmvp.netlify.app', emoji: '🎯', color: '#22c55e', hint: 'MVP' },
  { label: 'LinkedIn', url: 'https://linkedin.com', emoji: '💼', color: '#0A66C2', hint: 'Premium' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtitenglar</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95"
            style={{ background: `${link.color}12`, border: `1px solid ${link.color}22` }}
          >
            <span className="text-xl">{link.emoji}</span>
            <span className="text-xs font-medium text-center leading-tight">{link.label}</span>
            <span className="text-xs text-center" style={{ color: link.color, fontSize: 9 }}>{link.hint}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
