import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw } from 'lucide-react'

const FEEDS = [
  { label: '🇮🇸 Innlent', url: 'https://www.mbl.is/feeds/innlent/', lang: 'is' },
  { label: '🌍 Alheim',   url: 'https://feeds.bbci.co.uk/news/world/rss.xml', lang: 'en' },
]

const PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function stripHtml(str) {
  return str ? str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim() : ''
}

export default function NewsWidget() {
  const [feed, setFeed] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshed, setRefreshed] = useState(Date.now())

  useEffect(() => {
    setLoading(true)
    const cacheKey = `news_${feed}`
    const cacheAt = sessionStorage.getItem(`${cacheKey}_at`)
    const cached = sessionStorage.getItem(cacheKey)
    if (cached && cacheAt && Date.now() - Number(cacheAt) < 5 * 60 * 1000) {
      setItems(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch(PROXY + encodeURIComponent(FEEDS[feed].url))
      .then(r => r.json())
      .then(d => {
        const news = (d.items || []).slice(0, 8).map(item => ({
          title: stripHtml(item.title),
          link: item.link,
          date: item.pubDate,
          source: d.feed?.title || FEEDS[feed].label,
        }))
        sessionStorage.setItem(cacheKey, JSON.stringify(news))
        sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
        setItems(news)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [feed, refreshed])

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {FEEDS.map((f, i) => (
            <button key={i} onClick={() => setFeed(i)}
              className="text-xs px-3 py-1 rounded-lg transition-all"
              style={{
                background: feed === i ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                color: feed === i ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${feed === i ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => { sessionStorage.removeItem(`news_${feed}`); setRefreshed(Date.now()) }}
          className="p-1 rounded-lg" style={{ color: 'var(--muted)' }}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse-soft h-4 rounded" style={{ background: 'var(--surface2)', width: `${60 + i * 10}%` }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Ekki tókst að sækja fréttir</div>
      ) : (
        <div className="flex flex-col gap-0">
          {items.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
               className="flex items-start justify-between gap-2 py-2.5 group"
               style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-sm leading-snug flex-1 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
                {item.title}
              </span>
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.date ? timeAgo(item.date) : ''}</span>
                <ExternalLink size={10} style={{ color: 'var(--muted)' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
