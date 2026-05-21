import { useLocalStorage } from './useLocalStorage'

export function useLinks() {
  const [links, setLinks] = useLocalStorage('addi_links', [
    { id: '1', label: 'Íslandsbanki', url: 'https://www.islandsbanki.is', icon: '🏦' },
    { id: '2', label: 'mbl.is', url: 'https://www.mbl.is', icon: '📰' },
    { id: '3', label: 'RÚV', url: 'https://www.ruv.is', icon: '📺' },
    { id: '4', label: 'Vedur.is', url: 'https://www.vedur.is', icon: '🌦️' },
  ])

  const add = (label, url, icon = '🔗') => {
    if (!label.trim() || !url.trim()) return
    let fullUrl = url.trim()
    if (!fullUrl.startsWith('http')) fullUrl = 'https://' + fullUrl
    setLinks(prev => [...prev, { id: Date.now().toString(), label: label.trim(), url: fullUrl, icon }])
  }

  const remove = (id) => setLinks(prev => prev.filter(l => l.id !== id))

  return { links, add, remove }
}
