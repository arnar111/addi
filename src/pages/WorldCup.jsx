import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Trophy, Star, ChevronDown, ChevronUp } from 'lucide-react'

const OPENING = new Date('2026-06-12T19:00:00-04:00') // MetLife Stadium, NJ

const GROUPS = [
  {
    id: 'A', name: 'Hópur A',
    teams: ['Mexíkó 🇲🇽', 'Jamaíka 🇯🇲', 'Venesúela 🇻🇪', 'Ekvador 🇪🇨'],
  },
  {
    id: 'B', name: 'Hópur B',
    teams: ['Bandaríkin 🇺🇸', 'Panama 🇵🇦', 'Úrúgúay 🇺🇾', 'Bólívía 🇧🇴'],
  },
  {
    id: 'C', name: 'Hópur C',
    teams: ['Argentína 🇦🇷', 'Chíle 🇨🇱', 'Perú 🇵🇪', 'Kanada 🇨🇦'],
  },
  {
    id: 'D', name: 'Hópur D',
    teams: ['Brasilía 🇧🇷', 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Serbía 🇷🇸', 'Japan 🇯🇵'],
  },
  {
    id: 'E', name: 'Hópur E',
    teams: ['Frakkland 🇫🇷', 'Pólland 🇵🇱', 'Túnis 🇹🇳', 'Nýja Sjáland 🇳🇿'],
  },
  {
    id: 'F', name: 'Hópur F',
    teams: ['Spánn 🇪🇸', 'Kamerún 🇨🇲', 'Marokkó 🇲🇦', 'Belgía 🇧🇪'],
  },
  {
    id: 'G', name: 'Hópur G',
    teams: ['Þýskaland 🇩🇪', 'Portúgal 🇵🇹', 'Gana 🇬🇭', 'Paragúay 🇵🇾'],
  },
  {
    id: 'H', name: 'Hópur H',
    teams: ['Holland 🇳🇱', 'Belgía 🇧🇪', 'Sádi-Arabía 🇸🇦', 'Fílabeinsstrendin 🇨🇮'],
  },
]

const FAVORITES = ['Argentína 🇦🇷', 'Frakkland 🇫🇷', 'Brasilía 🇧🇷', 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Spánn 🇪🇸',
  'Þýskaland 🇩🇪', 'Portúgal 🇵🇹', 'Holland 🇳🇱', 'Argentína 🇦🇷']

export default function WorldCup() {
  const [myTeam, setMyTeam] = useLocalStorage('wc-my-team', 'Argentína 🇦🇷')
  const [prediction, setPrediction] = useLocalStorage('wc-winner', '')
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = OPENING - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)
  const started = diff < 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Trophy size={22} style={{ color: '#f59e0b' }} /> Heimsmeistaramót 2026
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          USA · Mexíkó · Kanada — {started ? 'Í gangi' : '12. júní — 19. júlí 2026'}
        </p>
      </div>

      {/* Countdown */}
      {!started && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))', border: '1px solid rgba(245,158,11,0.25)' }}>
          <div className="text-xs font-medium mb-3 text-center" style={{ color: '#f59e0b' }}>
            Opnunarmatch: MetLife Stadium, New Jersey
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: days, label: 'Dagar' },
              { val: hours, label: 'Klst' },
              { val: mins, label: 'Mín' },
              { val: secs, label: 'Sek' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center p-3 rounded-2xl"
                   style={{ background: 'rgba(245,158,11,0.08)' }}>
                <span className="text-3xl font-bold tabular-nums" style={{ color: '#f59e0b' }}>
                  {String(val).padStart(2, '0')}
                </span>
                <span className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
            Mexíkó 🇲🇽 vs Ekvador 🇪🇨
          </div>
        </div>
      )}

      {/* My team + prediction */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card flex flex-col gap-2">
          <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Lið mitt</div>
          <select className="input text-sm py-1.5" value={myTeam} onChange={e => setMyTeam(e.target.value)}
                  style={{ background: 'var(--surface2)', border: 'none', color: 'var(--text)' }}>
            {GROUPS.flatMap(g => g.teams).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="card flex flex-col gap-2">
          <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Vinningspar</div>
          <select className="input text-sm py-1.5" value={prediction} onChange={e => setPrediction(e.target.value)}
                  style={{ background: 'var(--surface2)', border: 'none', color: 'var(--text)' }}>
            <option value="">Veldu lið...</option>
            {GROUPS.flatMap(g => g.teams).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {prediction && (
        <div className="card flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Trophy size={20} style={{ color: '#f59e0b' }} />
          <div>
            <div className="text-sm font-semibold">Þú spáðir {prediction}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Við sjáum hvort þú hafir rétt 🏆</div>
          </div>
        </div>
      )}

      {/* Groups */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>HÓPAR</h2>
        {GROUPS.map(group => (
          <div key={group.id} className="card overflow-hidden p-0">
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>{group.id}</span>
                <span className="text-sm font-medium">{group.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {group.teams.slice(0, 2).map(t => (
                    <span key={t} className="text-base">{t.split(' ').pop()}</span>
                  ))}
                </div>
                {expandedGroup === group.id ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
              </div>
            </button>
            {expandedGroup === group.id && (
              <div className="border-t px-4 pb-3" style={{ borderColor: 'var(--border)' }}>
                {group.teams.map((team, i) => (
                  <div key={team} className="flex items-center gap-3 py-2">
                    <span className="w-5 text-xs font-bold" style={{ color: 'var(--muted)' }}>{i + 1}</span>
                    <span className="text-sm flex-1">{team}</span>
                    {team === myTeam && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
                        Mitt lið
                      </span>
                    )}
                    {team === prediction && (
                      <Trophy size={14} style={{ color: '#f59e0b' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fun fact */}
      <div className="card text-center py-4" style={{ background: 'var(--surface2)', border: 'none' }}>
        <div className="text-2xl mb-1">⚽</div>
        <div className="text-sm font-medium">48 þjóðlög · 16 vetvangar · 3 lönd</div>
        <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Stærsta HM í sögunni</div>
      </div>
    </div>
  )
}
