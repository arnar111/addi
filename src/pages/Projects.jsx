import { useState } from 'react'
import { ExternalLink, Code2, X, Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DEFAULT_PROJECTS = [
  {
    id: 'takkarena',
    name: 'Takkarena',
    description: 'Fantasy sports platform – pick 5 athletes per round',
    url: 'https://takkmvp.netlify.app',
    githubUrl: 'https://github.com/arnar111/takkarena-mvp',
    status: 'active',
    tags: ['React', 'Netlify'],
    color: '#00d4aa',
  },
  {
    id: 'lendo',
    name: 'Lendo',
    description: 'Rental marketplace – lendoapp.is',
    url: 'https://lendoapp.is',
    githubUrl: null,
    status: 'live',
    tags: ['Leigumarkaður', 'Live'],
    color: '#8b5cf6',
  },
  {
    id: 'eign',
    name: 'Eign',
    description: 'Fasteignaforrit – eignagreining og verðmat',
    url: null,
    githubUrl: 'https://github.com/arnar111/Eign',
    status: 'dev',
    tags: ['React', 'CI'],
    color: '#f97316',
  },
  {
    id: 'addi',
    name: 'Addi',
    description: 'Mitt daglega command center – þetta app',
    url: 'https://addiapp.netlify.app',
    githubUrl: 'https://github.com/arnar111/addi',
    status: 'active',
    tags: ['React', 'Netlify'],
    color: '#00d4aa',
  },
  {
    id: 'spiran',
    name: 'Spiran',
    description: 'Indoor plant tracker – vaxtarskrá og áminningar',
    url: 'https://spiran.netlify.app',
    githubUrl: null,
    status: 'active',
    tags: ['React'],
    color: '#22c55e',
  },
  {
    id: 'draumakaup',
    name: 'Draumakaup',
    description: 'Man United transfer wish-list app',
    url: 'https://draumakaup.netlify.app',
    githubUrl: null,
    status: 'active',
    tags: ['React', 'Íþróttir'],
    color: '#ef4444',
  },
]

const STATUS_CONFIG = {
  live:   { label: 'Í loftinu',  color: 'var(--success)', pulse: true },
  active: { label: 'Virkt',      color: 'var(--accent)',  pulse: true },
  dev:    { label: 'Þróun',      color: '#f97316',        pulse: false },
  paused: { label: 'Í bið',      color: 'var(--muted)',   pulse: false },
}

export default function Projects() {
  const [projects] = useLocalStorage('addi_projects', DEFAULT_PROJECTS)
  const [filter, setFilter] = useState('all')
  const [expandedNote, setExpandedNote] = useState(null)
  const [notes, setNotes] = useLocalStorage('addi_project_notes', {})
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')

  const filtered = filter === 'all' ? projects
    : projects.filter(p => p.status === filter)

  const activeCount = projects.filter(p => p.status !== 'paused').length

  const startEditNote = (id) => {
    setNoteText(notes[id] || '')
    setEditingNote(id)
  }

  const saveNote = (id) => {
    setNotes(prev => ({ ...prev, [id]: noteText }))
    setEditingNote(null)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Verkefni mín</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{activeCount} virk verkefni</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['all', 'Öll'], ['live', 'Í loftinu'], ['active', 'Virkt'], ['dev', 'Þróun']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === v ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: filter === v ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === v ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(p => {
          const s = STATUS_CONFIG[p.status] || STATUS_CONFIG.dev
          const hasNote = notes[p.id]
          return (
            <div key={p.id} className="card flex flex-col gap-3"
                 style={{ borderLeft: `3px solid ${p.color}40`, paddingLeft: 14 }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <span className="flex items-center gap-1 text-xs"
                          style={{ color: s.color }}>
                      {s.pulse && (
                        <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse-soft"
                              style={{ background: s.color }} />
                      )}
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {p.tags.map(t => (
                  <span key={t} className="badge text-xs"
                        style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)', fontSize: 10, padding: '2px 7px' }}>
                    {t}
                  </span>
                ))}
              </div>

              {editingNote === p.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="input resize-none text-xs"
                    rows={3}
                    placeholder="Athugasemdir, næstu skref..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveNote(p.id)} className="btn btn-primary text-xs py-1.5 px-3">
                      <Check size={12} /> Vista
                    </button>
                    <button onClick={() => setEditingNote(null)} className="btn btn-ghost text-xs py-1.5 px-3">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : hasNote ? (
                <div
                  className="text-xs p-2.5 rounded-xl cursor-pointer"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
                  onClick={() => startEditNote(p.id)}>
                  {notes[p.id]}
                </div>
              ) : null}

              <div className="flex gap-2">
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer"
                     className="btn btn-ghost text-xs py-1.5 flex-1 justify-center">
                    <ExternalLink size={12} /> Opna
                  </a>
                )}
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer"
                     className="btn btn-ghost text-xs py-1.5 justify-center"
                     style={{ minWidth: 36 }}>
                    <Code2 size={13} />
                  </a>
                )}
                <button
                  onClick={() => startEditNote(p.id)}
                  className="btn btn-ghost text-xs py-1.5"
                  style={{ color: 'var(--muted)' }}>
                  {hasNote ? '✏️' : '+ Athugasemd'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
