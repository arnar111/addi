import { useState, useEffect } from 'react'

const FEEDS = [
  { url: 'https://heimildin.is/feed/', source: 'Heimildin', lang: 'is' },
  { url: 'https://www.visir.is/rss/', source: 'Vísir', lang: 'is' },
]

const CACHE_MS = 30 * 60 * 1000

export function useNews() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('news_v2')
    const cachedAt = sessionStorage.getItem('news_v2_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_MS) {
      setItems(JSON.parse(cached))
      setLoading(false)
      return
    }

    const go = async () => {
      try {
        const results = await Promise.allSettled(
          FEEDS.map(f =>
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(f.url)}&count=8`)
              .then(r => r.json())
              .then(d =>
                (d.items || []).map(i => ({
                  title: i.title?.trim(),
                  link: i.link,
                  pubDate: i.pubDate,
                  thumbnail: i.thumbnail || i.enclosure?.link || null,
                  source: f.source,
                  lang: f.lang,
                }))
              )
          )
        )

        const all = results
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value)
          .filter(i => i.title)
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
          .slice(0, 12)

        sessionStorage.setItem('news_v2', JSON.stringify(all))
        sessionStorage.setItem('news_v2_at', String(Date.now()))
        setItems(all)
      } catch {}
      setLoading(false)
    }
    go()
  }, [])

  return { items, loading }
}
