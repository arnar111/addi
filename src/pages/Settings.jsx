import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Trash2, Info, Link as LinkIcon, Plus, X, Edit2 } from 'lucide-react'

const DEFAULT_LINKS = [
  { id: '1', label: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: '2', label: 'Reddit', url: 'https://reddit.com', icon: '🔴' },
  { id: '3', label: 'Athletic', url: 'https://theathletic.com', icon: '📰' },
  { id: '4', label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
  { id: '5', label: 'Wolt', url: 'https://wolt.com', icon: '🍔' },
  { id: '6', label: 'GitHub', url: 'https://github.com/arnar111', icon: '🐱' },
  { id: '7', label: 'PETRIA', url: 'https://petria.is', icon: '🛍️' },
  { id: '8', label: 'Huel', url: 'https://huel.com', icon: '🥤' },
  { id: '9', label: 'WHU', url: 'https://www.whufc.com', icon: '⚒️' },
]

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const [links, setLinks] = useLocalStorage('addi_quicklinks', DEFAULT_LINKS)
  const [showAddLink, setShowAddLink] = useState(false)
  const [newLink, setNewLink] = useState({ label: '', url: '', icon: '🔗' })

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = [
      'addi_tasks', 'addi_habits_v2', 'addi_expenses', 'addi_notes',
      'addi_budget', 'addi_packages', 'addi_crypto_portfolio', 'addi_quicklinks',
    ]
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const addLink = (e) => {
    e.preventDefault()
    if (!newLink.label.trim() || !newLink.url.trim()) return
    const url = newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`
    setLinks(prev => [...prev, { ...newLink, url, id: Date.now().toString() }])
    setNewLink({ label: '', url: '', icon: '🔗' })
    setShowAddLink(false)
  }

  const removeLink = (id) => {
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  const resetLinks = () => {
    setLinks(DEFAULT_LINKS)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Stillingar</h1>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Prófíll</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn</label>
          <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <MapPin size={11} /> Staður (veður)
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)} />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Veðurstaður: Reykjavík (64.1355°N, 21.8954°W)</p>
        </div>
      </div>

      {/* Quick Links editor */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <LinkIcon size={15} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm">Skjótir hlekkir</span>
          </div>
          <button onClick={resetLinks} className="text-xs" style={{ color: 'var(--muted)' }}>
            Endurstilla
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-lg">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{link.label}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{link.url}</div>
              </div>
              <button onClick={() => removeLink(link.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {showAddLink ? (
          <form onSubmit={addLink} className="flex flex-col gap-2 p-3 rounded-xl animate-slide-up"
                style={{ background: 'var(--surface2)' }}>
            <div className="flex gap-2">
              <input className="input text-sm" style={{ width: 56 }} placeholder="🔗" maxLength={2}
                value={newLink.icon} onChange={e => setNewLink(l => ({ ...l, icon: e.target.value }))} />
              <input className="input text-sm flex-1" placeholder="Nafn" value={newLink.label}
                onChange={e => setNewLink(l => ({ ...l, label: e.target.value }))} autoFocus />
            </div>
            <input className="input text-sm" placeholder="https://example.com" value={newLink.url}
              onChange={e => setNewLink(l => ({ ...l, url: e.target.value }))} />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1 text-xs justify-center">Bæta við</button>
              <button type="button" onClick={() => setShowAddLink(false)} className="btn btn-ghost px-3">
                <X size={14} />
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowAddLink(true)}
            className="flex items-center gap-2 text-xs py-2.5 rounded-xl justify-center transition-all"
            style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px dashed var(--border)' }}>
            <Plus size={13} /> Bæta við hlekk
          </button>
        )}
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', '1.1.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-medium text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PWA install */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone: Safari → Deila → "Bæta við heimaskjá" til að nota Addi eins og native app.
          Á Android: Chrome valmynd → "Bæta við heimaskjá".
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Þetta mun eyða öllum gögnum í appinu. Þetta er ekki hægt að afturkalla.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
