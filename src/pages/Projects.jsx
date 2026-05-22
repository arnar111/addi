import { useState } from 'react'
import { useProjects, STATUS } from '../hooks/useProjects'
import { ExternalLink, GitBranch, Edit2, Check, X } from 'lucide-react'

const STATUS_OPTIONS = ['active', 'building', 'ci-fail', 'paused', 'done']

function ProjectCard({ project, onStatus, onNotes }) {
  const [editNotes, setEditNotes] = useState(false)
  const [notes, setNotes] = useState(project.notes)
  const [showStatus, setShowStatus] = useState(false)
  const st = STATUS[project.status] || STATUS.paused

  const saveNotes = () => {
    onNotes(project.id, notes)
    setEditNotes(false)
  }

  return (
    <div className="card flex flex-col gap-3"
         style={{ borderLeft: `3px solid ${project.color}` }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0"
             style={{ background: project.color + '18' }}>
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{project.name}</span>
            <button onClick={() => setShowStatus(!showStatus)}
              className="badge text-xs cursor-pointer"
              style={{ background: st.color + '22', color: st.color }}>
              {st.label}
            </button>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {project.desc}
          </div>
        </div>
      </div>

      {showStatus && (
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map(s => {
            const info = STATUS[s]
            return (
              <button key={s} onClick={() => { onStatus(project.id, s); setShowStatus(false) }}
                className="badge text-xs cursor-pointer"
                style={{
                  background: project.status === s ? info.color + '33' : info.color + '11',
                  color: info.color,
                  border: `1px solid ${project.status === s ? info.color + '66' : 'transparent'}`,
                }}>
                {info.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs py-1.5 gap-1.5">
            <ExternalLink size={12} /> Live
          </a>
        )}
        {project.repo && (
          <a href={`https://github.com/${project.repo}`} target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs py-1.5 gap-1.5">
            <GitBranch size={12} /> {project.repo.split('/')[1]}
          </a>
        )}
        <button onClick={() => setEditNotes(!editNotes)}
          className="btn btn-ghost text-xs py-1.5 gap-1.5 ml-auto">
          <Edit2 size={12} /> Minnisblað
        </button>
      </div>

      {(editNotes || project.notes) && (
        <div className="flex flex-col gap-2">
          {editNotes ? (
            <>
              <textarea className="input resize-none text-xs" rows={2}
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Athugasemdir um verkefnið..." autoFocus />
              <div className="flex gap-2">
                <button onClick={saveNotes} className="btn btn-primary text-xs py-1.5">
                  <Check size={12} /> Vista
                </button>
                <button onClick={() => { setNotes(project.notes); setEditNotes(false) }}
                  className="btn btn-ghost text-xs py-1.5">
                  <X size={12} />
                </button>
              </div>
            </>
          ) : (
            project.notes && (
              <div className="text-xs p-2 rounded-lg leading-relaxed"
                   style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                {project.notes}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const { projects, setStatus, setNotes, STATUS: S } = useProjects()
  const active = projects.filter(p => p.status === 'active').length
  const building = projects.filter(p => p.status === 'building').length
  const failing = projects.filter(p => p.status === 'ci-fail').length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Verkefni</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {active} virk · {building} í smíðum{failing > 0 ? ` · ${failing} með CI villa` : ''}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          ['Virkt', active, '#22c55e'],
          ['Í smíðum', building, '#f97316'],
          ['CI villa', failing, '#ef4444'],
        ].map(([l, v, c]) => (
          <div key={l} className="card-sm text-center">
            <div className="text-2xl font-bold" style={{ color: c }}>{v}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} onStatus={setStatus} onNotes={setNotes} />
        ))}
      </div>
    </div>
  )
}
