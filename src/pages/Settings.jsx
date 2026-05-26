import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAudible } from '../hooks/useAudible'
import { User, MapPin, Trash2, Info, Headphones, Bell } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Addi')
  const [city] = useLocalStorage('addi_city', 'Reykjavík')
  const { credits, updateCredits, nextBillingDate, updateBillingDate, daysUntilBilling } = useAudible()
  const [notifications, setNotifications] = useLocalStorage('addi_notifications', {
    subsDueSoon: true,
    lendoGoal: true,
    sports: true,
  })

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    Object.keys(localStorage)
      .filter(k => k.startsWith('addi'))
      .forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-bold">Stillingar</h1>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Prófíll</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), #00b08e)', color: '#000' }}>
            A
          </div>
          <div>
            <div className="font-bold text-lg">Arnar Kjartansson</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>arnar1992@gmail.com</div>
            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
              <MapPin size={10} /> Reykjavík, Ísland 🇮🇸
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Kveðja (nafnið í kveðju)</label>
          <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} />
        </div>
      </div>

      {/* Audible settings */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Headphones size={15} style={{ color: 'var(--accent2)' }} />
          <span className="font-semibold text-sm">Audible</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Credits</label>
            <input type="number" className="input" min={0} value={credits}
              onChange={e => updateCredits(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Næsta greiðsla</label>
            <input type="date" className="input" value={nextBillingDate}
              onChange={e => updateBillingDate(e.target.value)} />
          </div>
        </div>
        <div className="text-xs" style={{ color: daysUntilBilling <= 7 ? 'var(--warning)' : 'var(--muted)' }}>
          {daysUntilBilling <= 7 ? '⚠️' : 'ℹ️'} {daysUntilBilling} dagar til næstu greiðslu
        </div>
      </div>

      {/* Notifications */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={15} style={{ color: 'var(--accent3)' }} />
          <span className="font-semibold text-sm">Tilkynningar</span>
        </div>
        {[
          { key: 'subsDueSoon', label: '💳 Áskriftir á döfinni', desc: 'Láttu vita 7 dögum áður en áskrift er greidd' },
          { key: 'lendoGoal', label: '📦 Lendó markmið', desc: 'Tilkynning þegar þú nærð mánaðarmarkmiðinu' },
          { key: 'sports', label: '⚽ Sport alert', desc: 'Áminning um leiki á dagskrá' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</div>
            </div>
            <button
              onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
              className="shrink-0 mt-0.5"
            >
              <div className="w-10 h-5.5 rounded-full transition-all relative"
                style={{
                  background: notifications[key] ? 'var(--accent)' : 'var(--surface3)',
                  height: '22px',
                }}>
                <div className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow-sm"
                  style={{
                    width: '18px',
                    height: '18px',
                    left: notifications[key] ? 'calc(100% - 20px)' : '2px',
                  }} />
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', 'v1.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
            ['Gjaldmiðill', 'ISK 🇮🇸'],
            ['Tímabelti', 'Atlantic/Reykjavík'],
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
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á iPhone heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone 16 Pro Max: Veldu <strong>Deila ↑</strong> → <strong>"Bæta við heimaskjá"</strong> til að nota Addi eins og native iOS app — fullt skjár, ekkert Safari UI.
        </p>
      </div>

      {/* Links */}
      <div className="card flex flex-col gap-2">
        <h3 className="font-semibold text-sm mb-1">Hlekkir</h3>
        {[
          { label: '🎧 Audible', url: 'https://www.audible.com' },
          { label: '🦜 Duolingo', url: 'https://www.duolingo.com' },
          { label: '⚽ The Athletic', url: 'https://theathletic.com' },
          { label: '📦 Lendó', url: 'https://www.lendo.is' },
          { label: '🤖 Claude.ai', url: 'https://claude.ai' },
          { label: '💼 LinkedIn', url: 'https://linkedin.com/in/' },
        ].map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between py-2 px-3 rounded-xl text-sm hover:bg-[var(--surface2)] transition-colors">
            {label}
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>↗</span>
          </a>
        ))}
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
