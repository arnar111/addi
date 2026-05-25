import { useState } from 'react'
import { Plus, X, CheckSquare, Wallet, FileText, ShoppingCart } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useFinance } from '../hooks/useFinance'
import { useNotes } from '../hooks/useNotes'
import { useShoppingList } from '../hooks/useShoppingList'
import { EXPENSE_CATEGORIES } from '../utils/currency'

const TABS = [
  { id: 'task', label: 'Verkefni', icon: CheckSquare, color: '#00d4aa' },
  { id: 'expense', label: 'Gjald', icon: Wallet, color: '#f97316' },
  { id: 'note', label: 'Minnismiði', icon: FileText, color: '#8b5cf6' },
  { id: 'shopping', label: 'Versla', icon: ShoppingCart, color: '#3b82f6' },
]

export default function QuickCapture() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('task')
  const [val, setVal] = useState('')
  const [val2, setVal2] = useState('')
  const [category, setCategory] = useState('food')

  const { add: addTask } = useTasks()
  const { addExpense } = useFinance()
  const { add: addNote } = useNotes()
  const { add: addShopping } = useShoppingList()

  const activeTab = TABS.find(t => t.id === tab)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!val.trim()) return
    if (tab === 'task') addTask(val.trim(), 'medium', null)
    else if (tab === 'expense') {
      if (isNaN(Number(val))) return
      addExpense(Number(val), category, val2.trim())
    }
    else if (tab === 'note') addNote(val.trim())
    else if (tab === 'shopping') addShopping(val.trim(), val2.trim())
    setVal('')
    setVal2('')
    setOpen(false)
  }

  const switchTab = (id) => {
    setTab(id)
    setVal('')
    setVal2('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fab fixed z-50 transition-all active:scale-90"
        style={{
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,212,170,0.45)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            className="w-full max-w-lg animate-slide-up"
            style={{
              background: 'var(--surface)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 16px',
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              border: '1px solid var(--border)',
              borderBottom: 'none',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Skjót skráning</h3>
              <button onClick={() => setOpen(false)} style={{ color: 'var(--muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {TABS.map(t => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => switchTab(t.id)}
                    className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: tab === t.id ? `${t.color}20` : 'var(--surface2)',
                      color: tab === t.id ? t.color : 'var(--muted)',
                      border: `1px solid ${tab === t.id ? t.color + '44' : 'transparent'}`,
                    }}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {tab === 'task' && (
                <input
                  className="input"
                  placeholder="Lýsing verkefnis..."
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  autoFocus
                />
              )}

              {tab === 'expense' && (
                <>
                  <input
                    className="input"
                    type="number"
                    placeholder="Upphæð (ISK)"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="input text-sm"
                    placeholder="Skýring (valkvæmt)"
                    value={val2}
                    onChange={e => setVal2(e.target.value)}
                  />
                  <div className="grid grid-cols-4 gap-1.5">
                    {EXPENSE_CATEGORIES.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                        style={{
                          background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                          border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                        }}
                      >
                        <span>{c.icon}</span>
                        <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>
                          {c.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {tab === 'note' && (
                <textarea
                  className="input resize-none text-sm"
                  rows={3}
                  placeholder="Minnismiðinn þinn..."
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  autoFocus
                />
              )}

              {tab === 'shopping' && (
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Hlutur á lista..."
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="input text-sm"
                    style={{ width: 72 }}
                    placeholder="Magn"
                    value={val2}
                    onChange={e => setVal2(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn w-full justify-center font-semibold"
                style={{ background: activeTab?.color, color: '#000', padding: '12px' }}
              >
                Skrá
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
