const LINKS = [
  { label: 'Alfred.is', icon: '💼', url: 'https://alfred.is', color: '#3b82f6', desc: 'Störf' },
  { label: 'LinkedIn', icon: '🔗', url: 'https://www.linkedin.com', color: '#0077b5', desc: 'Net' },
  { label: 'Gmail', icon: '📧', url: 'https://mail.google.com', color: '#ea4335', desc: 'Póstur' },
  { label: 'Netlify', icon: '🚀', url: 'https://app.netlify.com', color: '#00d4aa', desc: 'Hýsing' },
  { label: 'NY Times', icon: '📰', url: 'https://www.nytimes.com', color: '#64748b', desc: 'Fréttir' },
  { label: 'Patreon', icon: '🎬', url: 'https://www.patreon.com', color: '#f96854', desc: 'Patreon' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtitenglar</h3>
      <div className="grid grid-cols-6 gap-2">
        {LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: `${link.color}12`, textDecoration: 'none' }}>
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)', fontSize: 9 }}>{link.desc}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
