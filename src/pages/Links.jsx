const LINKS = [
  { name: 'The Athletic', url: 'https://theathletic.com', icon: '⚽', desc: 'Íþróttafréttir' },
  { name: 'heimildin.is', url: 'https://heimildin.is', icon: '📰', desc: 'Íslenskar fréttir' },
  { name: 'Washington Post', url: 'https://washingtonpost.com', icon: '🗞️', desc: 'Alþjóðafréttir' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼', desc: 'Starfstengsl' },
  { name: 'Steam Wishlist', url: 'https://store.steampowered.com/wishlist', icon: '🎮', desc: 'Leikjahugur minn' },
  { name: 'Duolingo', url: 'https://duolingo.com', icon: '🦜', desc: '13 ára streak!' },
  { name: 'Audible', url: 'https://audible.com', icon: '🎧', desc: 'Hljóðbækur' },
  { name: 'Spotify', url: 'https://open.spotify.com', icon: '🎵', desc: 'Tónlist' },
  { name: 'Xbox', url: 'https://xbox.com', icon: '🕹️', desc: 'Game Pass' },
  { name: 'Claude AI', url: 'https://claude.ai', icon: '🤖', desc: 'AI aðstoð' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', icon: '🗣️', desc: 'AI rödd' },
  { name: 'Huel', url: 'https://huel.com', icon: '🥤', desc: 'Prótein' },
  { name: 'SeatGeek', url: 'https://seatgeek.com', icon: '🎟️', desc: 'Viðburðir' },
  { name: 'Google Drive', url: 'https://drive.google.com', icon: '📁', desc: 'Skjöl' },
  { name: 'Gmail', url: 'https://mail.google.com', icon: '✉️', desc: 'Tölvupóstur' },
]

export default function Links() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Flýtilyklar</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Allt á einum stað</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LINKS.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col gap-2 transition-all active:scale-95"
            style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 28, lineHeight: 1.2 }}>{link.icon}</div>
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{link.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{link.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
