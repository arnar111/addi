import { useState } from 'react'
import { Plus, X, CheckSquare, FileText } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useNotes } from '../hooks/useNotes'

export default function QuickCapture() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(null) // 'task' | 'note'
  const [text, setText] = useState('')
  const { add: addTask } = useTasks()
  const { add: addNote } = useNotes()

  const submit = () => {
    if (!text.trim()) return
    if (mode === 'task') addTask(text.trim(), 'medium', null)
    else if (mode === 'note') addNote(text.trim())
    setText('')
    setMode(null)
    setOpen(false)
  }

  const close = () => {
    setOpen(false)
    setMode(null)
    setText('')
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Bottom sheet */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          width: 'min(400px, calc(100vw - 32px))',
          zIndex: 50,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 16,
          boxShadow: '0 -4px 40px rgba(0,0,0,0.4)',
        }}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm">Fanga hugmynd</span>
            <button onClick={close}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          {/* Mode selector */}
          {!mode && (
            <div className="flex gap-3">
              <button
                onClick={() => setMode('task')}
                className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl transition-all"
                style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <CheckSquare size={22} style={{ color: 'var(--accent)' }} />
                <span className="text-sm font-medium">Verkefni</span>
              </button>
              <button
                onClick={() => setMode('note')}
                className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl transition-all"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <FileText size={22} style={{ color: 'var(--accent2)' }} />
                <span className="text-sm font-medium">Minnisblað</span>
              </button>
            </div>
          )}

          {/* Input */}
          {mode && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                {mode === 'task' ? <CheckSquare size={14} style={{ color: 'var(--accent)' }} /> : <FileText size={14} style={{ color: 'var(--accent2)' }} />}
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{mode === 'task' ? 'Nýtt verkefni' : 'Nýtt minnisblað'}</span>
                <button onClick={() => setMode(null)} className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>Breyta</button>
              </div>
              <textarea
                className="input"
                rows={3}
                placeholder={mode === 'task' ? 'Lýsing verkefnis...' : 'Skrifaðu hér...'}
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
                }}
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={submit} className="btn btn-primary w-full justify-center">
                Vista
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom, 16px) + 72px)',
          right: 20,
          zIndex: 45,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--accent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,212,170,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = open ? 'rotate(45deg) scale(1.05)' : 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)'}
      >
        <Plus size={24} color="#000" strokeWidth={2.5} />
      </button>
    </>
  )
}
