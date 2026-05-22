import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useFootball } from '../hooks/useFootball'
import { User, MapPin, Trash2, Info, Key, Check, ExternalLink } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { apiKey, saveKey } = useFootball()
  const [keyInput, setKeyInput] = useState(apiKey || '')
  const [keySaved, setKeySaved] = useState(false)

  const handleSaveKey = () => {
    saveKey(keyInput.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'lendo_bookings', 'lendo_items', 'lendo_goal']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
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
        </div>
      </div>

      {/* Football API */}
      <div className="card flex flex-col gap-4" style={{ border: '1px solid rgba(0,212,170,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Key size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Knattspyrna API</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Sæktu ókeypis API-lykil á <strong style={{ color: 'var(--text)' }}>football-data.org</strong> til að fá rauntíma niðurstöður og töflur í stað sýnigagna.
        </p>
        <div className="flex gap-2">
          <input
            className="input text-sm flex-1"
            placeholder="Límdu API-lykil hér..."
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            type="password"
          />
          <button onClick={handleSaveKey} className="btn btn-primary shrink-0">
            {keySaved ? <Check size={15} /> : 'Vista'}
          </button>
        </div>
        {apiKey && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--success)' }}>
            <Check size={12} /> Lykill er virkur
          </div>
        )}
        <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          <strong className="block mb-1" style={{ color: 'var(--text)' }}>Hvernig:</strong>
          1. Farðu á football-data.org<br />
          2. Skráðu þig ókeypis (Basic plan)<br />
          3. Afritaðu API-lykilinn þinn<br />
          4. Límdu hann hér og vistaðu
        </div>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', '1.0.0'],
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

      {/* PWA hint */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone 16 Max: Veldu <strong style={{ color: 'var(--text)' }}>Deila</strong> → <strong style={{ color: 'var(--text)' }}>Bæta við heimaskjá</strong> til að nota Addi eins og native app.
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Þetta mun eyða öllum gögnum í appinu. Þetta er ekki hægt að afturkalla.</p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
