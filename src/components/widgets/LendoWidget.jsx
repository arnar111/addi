import { useState } from 'react'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, Package } from 'lucide-react'

export default function LendoWidget() {
  const { items, monthTotal, monthlyGoal, goalPct, streak, addBooking } = useLendo()
  const [showQuick, setShowQuick] = useState(false)
  const [selectedItem, setSelectedItem] = useState(items[0])
  const [days, setDays] = useState(1)

  function handleQuickBook() {
    if (!selectedItem) return
    const amount = selectedItem.pricePerDay * days
    addBooking({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      amount,
      days,
      date: new Date().toISOString().split('T')[0],
    })
    setShowQuick(false)
    setDays(1)
  }

  const activeItems = items.filter(i => i.active)

  return (
    <div className="card lendo-gradient">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package size={15} style={{ color: 'var(--accent3)' }} />
          <h3 className="font-semibold text-sm">Lendó tekjur</h3>
          {streak > 0 && (
            <span className="badge badge-orange text-[10px]">🔥 {streak} daga streak</span>
          )}
        </div>
        <Link to="/finance?tab=lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent3)' }}>
          Allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold">{formatShortISK(monthTotal)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} mánaðarmarkmiði
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: 'var(--accent3)' }}>{goalPct}%</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>af markmiði</div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar mb-3">
        <div
          className="progress-fill"
          style={{
            width: `${goalPct}%`,
            background: goalPct >= 100
              ? 'var(--success)'
              : `linear-gradient(90deg, var(--accent3), #ef4444)`,
          }}
        />
      </div>

      {/* Quick book */}
      {!showQuick ? (
        <button
          onClick={() => setShowQuick(true)}
          className="btn btn-sm w-full"
          style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--accent3)', border: '1px solid rgba(249,115,22,0.3)' }}
        >
          <Plus size={13} />
          Skrá bókun
        </button>
      ) : (
        <div className="space-y-2 animate-scale-in">
          <select
            className="select w-full text-sm"
            value={selectedItem?.id || ''}
            onChange={e => setSelectedItem(activeItems.find(i => i.id === e.target.value))}
          >
            {activeItems.map(i => (
              <option key={i.id} value={i.id}>
                {i.name} — {formatShortISK(i.pricePerDay)}/dag
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input
                type="number"
                className="input input-sm"
                min={1}
                max={30}
                value={days}
                onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð</label>
              <div className="input input-sm font-semibold" style={{ color: 'var(--accent3)' }}>
                {selectedItem ? formatShortISK(selectedItem.pricePerDay * days) : '0 kr'}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQuick(false)}
              className="btn btn-ghost btn-sm flex-1"
            >
              Hætta við
            </button>
            <button
              onClick={handleQuickBook}
              className="btn btn-sm flex-1"
              style={{ background: 'var(--accent3)', color: '#fff' }}
            >
              Skrá {selectedItem ? formatShortISK(selectedItem.pricePerDay * days) : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
