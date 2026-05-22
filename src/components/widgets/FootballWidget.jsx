import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const STORIES = [
  {
    id: 1,
    tag: '🏆 Inter',
    headline: 'DOUBLE! Inter vinna Coppa Italia og Serie A — söguleg tíð',
    sub: 'Nerazzurri kláruðu tímabilið með tveimur bikarverðlaunum',
    color: '#1a6aff',
    time: 'í dag',
  },
  {
    id: 2,
    tag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 WC 2026',
    headline: 'Tuchel kynnir England leikmannalista — Foden og Palmer útundan',
    sub: 'Wharton, Toney og Kelly fá tækifæri á heimsmeistaramótinu',
    color: '#ef4444',
    time: 'í dag',
  },
  {
    id: 3,
    tag: '⚽ WC 2026',
    headline: 'Heimsmeistaramótið 2026 — dagurinn í dag: Hópadráttur',
    sub: 'Enginn hópur hefur enn verið staðfestur — fylgstu með',
    color: '#f97316',
    time: '22. maí',
  },
  {
    id: 4,
    tag: '🇸🇦 Saudi',
    headline: 'Ronaldo tvískorinn — Al Nassr vinnur Saudi Pro League titilinn',
    sub: 'CR7 skilur eftir sig mark á 5. tímabili sínu í Sádi-Arabíu',
    color: '#22c55e',
    time: '21. maí',
  },
  {
    id: 5,
    tag: '🇮🇸 Ísland',
    headline: 'Ísland í WC-forforleikjum — byrjar í júlí',
    sub: 'Strákarnir okkar keppa um sæti á heimsmeistaramótinu í Bandaríkjunum',
    color: '#3b82f6',
    time: '20. maí',
  },
  {
    id: 6,
    tag: '🏎️ F1',
    headline: 'Harmleikur í kappakstursheiminum — kappakstursbíll í bruna',
    sub: 'Allt auga beint að Monaco GP í komandi helgi',
    color: '#e11d48',
    time: '22. maí',
  },
]

export default function FootballWidget() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? STORIES : STORIES.slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold">Íþróttafréttir</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>The Athletic · WC 2026</span>
      </div>
      <div className="flex flex-col gap-2">
        {visible.map(story => (
          <div key={story.id} className="flex gap-3 py-2"
               style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="shrink-0 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${story.color}18`, color: story.color }}>
                {story.tag}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">{story.headline}</p>
              <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>{story.sub}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)', opacity: 0.6 }}>{story.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setExpanded(!expanded)}
        className="mt-2 w-full text-xs text-center py-1.5"
        style={{ color: 'var(--accent)' }}>
        {expanded ? 'Sýna minna' : `+ ${STORIES.length - 3} fleiri fréttir`}
      </button>
    </div>
  )
}
