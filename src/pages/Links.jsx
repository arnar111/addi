import { ExternalLink, AlertTriangle } from 'lucide-react'

const LINKS = [
  {
    category: '🛵 Matur & Afhending',
    items: [
      { name: 'Wolt', icon: '🛵', url: 'https://wolt.com/is', desc: 'Matarafhending', color: '#00c2e0' },
      { name: 'Dominos', icon: '🍕', url: 'https://dominos.is', desc: 'Pantaðu núna 🤳', color: '#006491' },
      { name: 'KFC', icon: '🍗', url: 'https://wolt.com/is', desc: 'KFC Hafnarfirði', color: '#f40027' },
      { name: 'Huel', icon: '🥤', url: 'https://huel.com', desc: 'Blueberry Black Edition', color: '#1a1a2e', badge: '⚠️ Greiðsla' },
    ]
  },
  {
    category: '🪑 Lendó - Leigustarfsemi',
    items: [
      { name: 'Lendó App', icon: '🪑', url: 'https://lendoapp.netlify.app', desc: 'Leiguáætlun', color: '#00d4aa' },
      { name: 'Lendó GitHub', icon: '💻', url: 'https://github.com/arnar111/lendo', desc: 'Kóðaforráð', color: '#333' },
    ]
  },
  {
    category: '🎵 Tónlist & Hlustun',
    items: [
      { name: 'Spotify', icon: '🎵', url: 'https://open.spotify.com', desc: 'Tónlist', color: '#1db954' },
      { name: 'Audible', icon: '📚', url: 'https://audible.com', desc: '11 einingar · 1 rennur út!', color: '#f3a847', badge: '⚠️ Rennur út' },
    ]
  },
  {
    category: '⚽ Íþróttir',
    items: [
      { name: 'The Athletic', icon: '📰', url: 'https://theathletic.com', desc: 'Arsenal & Premier League', color: '#f97316' },
      { name: 'Arsenal FC', icon: '🔴', url: 'https://arsenal.com', desc: 'A* þetta tímabil!', color: '#ef0107' },
      { name: 'BBC Sport', icon: '🏅', url: 'https://bbc.co.uk/sport', desc: 'Íþróttafrétir', color: '#bb1919' },
      { name: 'Original Football', icon: '⚽', url: 'https://originalfootball.substack.com', desc: 'Substack greinar', color: '#ff6719' },
    ]
  },
  {
    category: '💼 Vinna & Netsamfélag',
    items: [
      { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', desc: '94 birtingar síðustu viku', color: '#0a66c2' },
      { name: 'F6S', icon: '🚀', url: 'https://f6s.com', desc: 'Startup samfélag · €2.3k tilboð', color: '#ff4500' },
      { name: 'GitHub', icon: '💻', url: 'https://github.com/arnar111', desc: 'Kóðaforráð', color: '#333' },
    ]
  },
  {
    category: '🧠 Þekking & Lærdómur',
    items: [
      { name: 'Duolingo', icon: '🦜', url: 'https://duolingo.com', desc: '🎉 13 ára röð!', color: '#58cc02' },
      { name: 'Washington Post', icon: '📰', url: 'https://washingtonpost.com', desc: 'The 7 dagleg samantekt', color: '#231f20' },
      { name: 'Heimildin', icon: '🗞️', url: 'https://heimildin.is', desc: 'Íslenskar morgunfréttir ☕', color: '#1a1a2e' },
      { name: 'Canva', icon: '🎨', url: 'https://canva.com', desc: 'Hönnun & kynningarefni', color: '#7d2ae8' },
    ]
  },
  {
    category: '🎮 Skemmtun',
    items: [
      { name: 'Steam', icon: '🎮', url: 'https://store.steampowered.com', desc: 'Blacksmith Master á óskalista!', color: '#1b2838' },
      { name: 'Xbox', icon: '🎮', url: 'https://xbox.com', desc: 'World Cup controller 🌍', color: '#107c10' },
      { name: 'Reddit', icon: '🤖', url: 'https://reddit.com/r/ClaudeCode', desc: 'r/ClaudeCode', color: '#ff4500' },
    ]
  },
  {
    category: '📦 Pakkar & Kaup',
    items: [
      { name: 'Dropp', icon: '📦', url: 'https://dropp.is', desc: '📍 Pakki á Olís Garðabæ!', color: '#f97316', badge: '📦 Sækja!' },
      { name: 'Amazon', icon: '📦', url: 'https://amazon.com', desc: 'Netverslun', color: '#ff9900' },
      { name: 'Kringlan', icon: '🛍️', url: 'https://kringlan.is', desc: 'Brúðkaupsblað útkomið', color: '#b91c1c' },
    ]
  },
  {
    category: '🌐 Hýsing & Tækni',
    items: [
      { name: 'Netlify', icon: '🌐', url: 'https://netlify.app', desc: 'Hýsing · 50% credits notað', color: '#00ad9f', badge: '⚠️ Greiðsla' },
      { name: 'Claude', icon: '🤖', url: 'https://claude.ai', desc: 'AI aðstoðarmaður', color: '#e8621a' },
      { name: 'ElevenLabs', icon: '🎙️', url: 'https://elevenlabs.io', desc: 'Raddmyndun', color: '#1a1a2e' },
      { name: 'Google Cloud', icon: '☁️', url: 'https://console.cloud.google.com', desc: 'TLS uppfærsla fyrir 15. júní', color: '#4285f4', badge: '⚠️ Aðgerð' },
    ]
  },
  {
    category: '🏦 Fjármál',
    items: [
      { name: 'Íslandsbanki', icon: '🏦', url: 'https://islandsbanki.is', desc: 'Netbanki', color: '#003087' },
      { name: 'Alfred', icon: '👔', url: 'https://alfred.is', desc: 'Störf á Íslandi', color: '#1a1a2e' },
    ]
  },
]

export default function Links() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">🔗 Flýtileiðir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Allt sem þú notar daglega</p>
      </div>

      {LINKS.map(group => (
        <div key={group.category} className="card flex flex-col gap-1">
          <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--muted)' }}>
            {group.category}
          </div>
          {group.items.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 py-2 px-2 rounded-xl transition-all active:scale-95"
               style={{ WebkitTapHighlightColor: 'transparent' }}
               onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: `${link.color}18` }}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium flex items-center gap-1.5">
                  {link.name}
                  {link.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--accent3)', fontSize: 10 }}>
                      {link.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{link.desc}</div>
              </div>
              <ExternalLink size={13} style={{ color: 'var(--muted)', shrink: 0 }} />
            </a>
          ))}
        </div>
      ))}
    </div>
  )
}
