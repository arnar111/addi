import { useState } from 'react'
import { useJobs } from '../hooks/useJobs'
import { Plus, X, Trash2, ExternalLink } from 'lucide-react'

export default function Jobs() {
  const { applications, add, remove, updateStatus, byStatus, active, STATUSES } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('active')
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({
    company: '', role: '', url: '', location: '', salary: '', note: '', appliedDate: '',
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    add(form)
    setForm({ company: '', role: '', url: '', location: '', salary: '', note: '', appliedDate: '' })
    setShowForm(false)
    setTab('active')
  }

  const shown = tab === 'active' ? active
    : tab === 'rejected' ? [...byStatus('rejected'), ...byStatus('withdrawn')]
    : applications

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Störf</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} virkar umsóknir
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn btn-primary">
          <Plus size={16} /> Umsókn
        </button>
      </div>

      {/* Pipeline */}
      <div className="flex gap-2">
        {STATUSES.slice(0, 3).map(s => {
          const count = byStatus(s.id).length
          return (
            <div key={s.id} className="card flex-1 text-center py-3 px-1"
                 style={{ border: `1px solid ${s.color}33` }}>
              <div className="text-xl mb-0.5">{s.icon}</div>
              <div className="text-xl font-bold" style={{ color: s.color }}>{count}</div>
              <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný umsókn</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input text-sm" placeholder="Fyrirtæki *"
            value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} autoFocus />
          <input className="input text-sm" placeholder="Starfsheiti *"
            value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" placeholder="Staðsetning"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <input className="input text-sm" placeholder="Laun (valkvæmt)"
              value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          </div>
          <input type="date" className="input text-sm"
            value={form.appliedDate} onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} />
          <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir..."
            value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Bæta við
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['active', 'Virkar'], ['rejected', 'Hafnað'], ['all', 'Allar']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Applications */}
      <div className="flex flex-col gap-2">
        {shown.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-2">
            <span className="text-3xl">💼</span>
            <p style={{ color: 'var(--muted)' }}>
              {tab === 'active' ? 'Engar virkar umsóknir' : 'Engar umsóknir'}
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary mt-1">
              <Plus size={14} /> Bæta við umsókn
            </button>
          </div>
        ) : shown.map(app => {
          const s = STATUSES.find(st => st.id === app.status) || STATUSES[0]
          const isExpanded = expandedId === app.id
          return (
            <div key={app.id} className="card flex flex-col gap-2">
              <div className="flex items-start gap-3" onClick={() => setExpandedId(isExpanded ? null : app.id)}
                   style={{ cursor: 'pointer' }}>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{app.company}</div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>{app.role}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {app.location && (
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>📍 {app.location}</span>
                    )}
                    {app.salary && (
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>💰 {app.salary}</span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      📅 {new Date(app.appliedDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="badge shrink-0 text-xs px-2 py-1 rounded-full"
                      style={{ background: `${s.color}22`, color: s.color }}>
                  {s.icon} {s.label}
                </span>
              </div>

              {isExpanded && (
                <>
                  {app.note && (
                    <p className="text-xs px-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {app.note}
                    </p>
                  )}
                  <div className="flex gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    {STATUSES.slice(0, 3).map(st => (
                      <button key={st.id} onClick={() => updateStatus(app.id, st.id)}
                        className="flex-1 text-xs py-1.5 rounded-xl font-medium transition-all"
                        style={{
                          background: app.status === st.id ? `${st.color}22` : 'var(--surface2)',
                          color: app.status === st.id ? st.color : 'var(--muted)',
                          border: `1px solid ${app.status === st.id ? st.color + '44' : 'transparent'}`,
                        }}>{st.label}</button>
                    ))}
                    <button onClick={() => updateStatus(app.id, 'rejected')}
                      className="px-2.5 py-1.5 rounded-xl text-xs"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}
                      title="Hafna">
                      ❌
                    </button>
                    <button onClick={() => remove(app.id)}
                      className="px-2.5 py-1.5 rounded-xl"
                      style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
