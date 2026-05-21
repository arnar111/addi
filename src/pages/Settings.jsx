import { useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Link } from 'react-router-dom'
import { User, MapPin, Trash2, Info, Timer, Download, Upload, ShoppingCart } from 'lucide-react'

const DATA_KEYS = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_shopping', 'addi_subs', 'addi_name', 'addi_city']

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const importRef = useRef()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    DATA_KEYS.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const exportData = () => {
    const data = {}
    DATA_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v) data[k] = v })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `addi-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        Object.entries(parsed).forEach(([k, v]) => localStorage.setItem(k, v))
        window.location.reload()
      } catch {
        alert('Ógildur backup skrá')
      }
    }
    reader.readAsText(file)
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

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <span className="font-semibold text-sm">Flýtileiðir</span>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/timer"
            className="flex items-center gap-2.5 p-3 rounded-xl transition-all"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            <Timer size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium">Tímari</span>
          </Link>
          <Link
            to="/shopping"
            className="flex items-center gap-2.5 p-3 rounded-xl transition-all"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            <ShoppingCart size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium">Innkaup</span>
          </Link>
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
            ['Útgáfa', '2.0.0'],
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
          Á iPhone: Safari → <strong style={{ color: 'var(--text)' }}>Deila</strong> → <strong style={{ color: 'var(--text)' }}>Bæta við heimaskjá</strong> til að nota Addi eins og native app með fulla skjástærð.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á Android: Chrome → þriggja punkta valmynd → <strong style={{ color: 'var(--text)' }}>Bæta við heimaskjá</strong>.
        </p>
      </div>

      {/* Data backup */}
      <div className="card flex flex-col gap-3">
        <span className="font-semibold text-sm">Gögn</span>
        <div className="flex gap-2">
          <button onClick={exportData} className="btn btn-ghost flex-1 justify-center text-sm">
            <Download size={14} /> Taka öryggisafrit
          </button>
          <button onClick={() => importRef.current?.click()} className="btn btn-ghost flex-1 justify-center text-sm">
            <Upload size={14} /> Endurheimt
          </button>
          <input ref={importRef} type="file" accept=".json" onChange={importData} className="hidden" />
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Gögn eru vistuð í vafra. Taktu öryggisafrit reglulega til að missa ekki gögn.
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Eyðir öllum gögnum. Ekki hægt að afturkalla.</p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
