import { useState } from 'react'
import { ExternalLink, Rocket, Globe, Code2, Briefcase, Star, ChevronDown, ChevronUp } from 'lucide-react'

const MY_APPS = [
  {
    name: 'Lendo',
    desc: 'Aðalviðskipti',
    url: 'https://lendoapp.is',
    emoji: '🏦',
    color: '#00d4aa',
    pinned: true,
  },
  {
    name: 'Takkarena MVP',
    desc: 'Miðasala app',
    url: 'https://takkmvp.netlify.app',
    emoji: '🎫',
    color: '#8b5cf6',
    pinned: true,
  },
  {
    name: 'Betri Þú',
    desc: 'Sjálfsþróun',
    url: 'https://betrithu.netlify.app',
    emoji: '🌱',
    color: '#22c55e',
  },
  {
    name: 'Launatakk',
    desc: 'Launareiknivél',
    url: 'https://launatakk.netlify.app',
    emoji: '💰',
    color: '#f59e0b',
  },
  {
    name: 'Spiran',
    desc: 'Plönturakningr',
    url: 'https://spiran.netlify.app',
    emoji: '🌿',
    color: '#22c55e',
  },
  {
    name: 'Draumakaup',
    desc: 'ManUtd flutningar',
    url: 'https://draumakaup.netlify.app',
    emoji: '🔴',
    color: '#ef4444',
  },
  {
    name: 'Mamma Recipes',
    desc: 'Uppskriftir',
    url: 'https://mamma-recipes-arnar.netlify.app',
    emoji: '👩‍🍳',
    color: '#f97316',
  },
  {
    name: 'Laungótu',
    desc: 'Launaborð',
    url: 'https://laungotu.netlify.app',
    emoji: '📊',
    color: '#3b82f6',
  },
]

const DAILY_TOOLS = [
  { name: 'GitHub', desc: 'arnar111', url: 'https://github.com/arnar111', emoji: '🐙', color: '#f0f6fc' },
  { name: 'Netlify', desc: 'Deploy & hýsing', url: 'https://app.netlify.com', emoji: '🟩', color: '#00ad9f' },
  { name: 'Claude', desc: 'AI aðstoð', url: 'https://claude.ai', emoji: '🤖', color: '#cc785c' },
  { name: 'LinkedIn', desc: 'Arnar Kjartansson', url: 'https://linkedin.com', emoji: '💼', color: '#0a66c2' },
  { name: 'The Athletic', desc: 'Íþróttafréttir', url: 'https://theathletic.com', emoji: '📰', color: '#ff4e00' },
  { name: 'Amazon', desc: 'Netverslun', url: 'https://amazon.com', emoji: '📦', color: '#ff9900' },
  { name: 'Binance', desc: 'Crypto', url: 'https://binance.com', emoji: '₿', color: '#f3ba2f' },
  { name: 'Gmail', desc: 'arnar1992', url: 'https://mail.google.com', emoji: '📧', color: '#ea4335' },
]

function AppCard({ app }) {
  return (
    <a href={app.url} target="_blank" rel="noopener noreferrer"
       className="card flex items-center gap-3 py-3 transition-all hover:scale-[1.01] active:scale-[0.98]"
       style={{ textDecoration: 'none', color: 'var(--text)',
                border: app.pinned ? `1px solid ${app.color}44` : '1px solid var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: `${app.color}22` }}>
        {app.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold flex items-center gap-1.5">
          {app.name}
          {app.pinned && <Star size={10} fill="currentColor" style={{ color: app.color }} />}
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{app.desc}</div>
      </div>
      <ExternalLink size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
    </a>
  )
}

function ToolGrid({ tools }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {tools.map(tool => (
        <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2.5 p-3 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
           style={{ background: 'var(--surface)', border: '1px solid var(--border)',
                    textDecoration: 'none', color: 'var(--text)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
               style={{ background: `${tool.color}22` }}>
            {tool.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{tool.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)', fontSize: 10 }}>{tool.desc}</div>
          </div>
        </a>
      ))}
    </div>
  )
}

export default function Links() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? MY_APPS : MY_APPS.slice(0, 5)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Tenglar</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>App & verkfæri</p>
      </div>

      {/* My apps */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Rocket size={14} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Mín app</span>
        </div>
        <div className="flex flex-col gap-2">
          {displayed.map(app => <AppCard key={app.name} app={app} />)}
        </div>
        {MY_APPS.length > 5 && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="w-full mt-2 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {showAll ? <><ChevronUp size={13} /> Sýna færra</> : <><ChevronDown size={13} /> Sýna {MY_APPS.length - 5} í viðbót</>}
          </button>
        )}
      </div>

      {/* Daily tools */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Globe size={14} style={{ color: 'var(--accent2)' }} />
          <span className="font-semibold text-sm">Daglegir tólar</span>
        </div>
        <ToolGrid tools={DAILY_TOOLS} />
      </div>

      {/* ISK quick calc */}
      <ISKCalc />
    </div>
  )
}

function ISKCalc() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('138')
  const [currency, setCurrency] = useState('USD')

  const isk = amount && rate ? Math.round(Number(amount) * Number(rate)) : null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🧮</span>
        <span className="font-semibold text-sm">Hraðreiknivél</span>
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð</label>
          <input
            className="input text-sm"
            type="number"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="w-24">
          <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Gjaldmiðill</label>
          <select className="input text-sm" value={currency} onChange={e => setCurrency(e.target.value)}
                  style={{ background: 'var(--surface2)' }}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Gengi (1 {currency} = ? ISK)</label>
          <input
            className="input text-sm"
            type="number"
            value={rate}
            onChange={e => setRate(e.target.value)}
          />
        </div>
      </div>
      {isk !== null && (
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{amount} {currency} =</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {isk.toLocaleString('is-IS')} kr
          </div>
        </div>
      )}
    </div>
  )
}
