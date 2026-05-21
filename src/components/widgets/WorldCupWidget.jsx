import { useNavigate } from 'react-router-dom'
import { useWCCountdown } from '../../hooks/useSports'
import { ChevronRight } from 'lucide-react'

function CountBox({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

export default function WorldCupWidget() {
  const { timeLeft } = useWCCountdown()
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/sports')}
      className="card w-full text-left"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(0,212,170,0.2)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <div className="font-semibold text-sm">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {timeLeft.started ? 'Leikarnir eru hafnir!' : 'Hefst 11. júní · USA / CAN / MEX'}
            </div>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>

      {!timeLeft.started ? (
        <div className="flex gap-4 justify-center py-1">
          <CountBox value={timeLeft.days} label="dagar" />
          <div className="text-xl font-bold" style={{ color: 'var(--border)', paddingTop: 2 }}>:</div>
          <CountBox value={timeLeft.hours} label="klst" />
          <div className="text-xl font-bold" style={{ color: 'var(--border)', paddingTop: 2 }}>:</div>
          <CountBox value={timeLeft.minutes} label="mín" />
          <div className="text-xl font-bold" style={{ color: 'var(--border)', paddingTop: 2 }}>:</div>
          <CountBox value={timeLeft.seconds} label="sek" />
        </div>
      ) : (
        <div className="text-center text-sm" style={{ color: 'var(--accent)' }}>
          Heimsmeistaramót er í gangi! 🎉
        </div>
      )}

      <div className="flex justify-between mt-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Úrslitaleikur: 19. júlí</span>
        <span className="text-xs" style={{ color: 'var(--accent)' }}>Sjá meira →</span>
      </div>
    </button>
  )
}
