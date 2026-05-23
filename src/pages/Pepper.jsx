import { useState } from 'react'
import { usePepper, PEPPER_TYPES, LOG_TYPES } from '../hooks/usePepper'
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'

function WaterBadge({ days }) {
  if (days === null) return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>
      Aldrei vökvuð
    </span>
  )
  if (days === 0) return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}>
      Vökvuð í dag
    </span>
  )
  if (days === 1) return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}>
      {days}d síðan
    </span>
  )
  if (days <= 2) return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>
      {days}d síðan
    </span>
  )
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>
      {days}d síðan 💧
    </span>
  )
}

export default function Pepper() {
  const { plants, addPlant, removePlant, addLog, logsForPlant, daysSinceWater, ageInDays, plantsNeedingWater } = usePepper()
  const [showForm, setShowForm] = useState(false)
  const [showLogForm, setShowLogForm] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('reaper')
  const [plantedDate, setPlantedDate] = useState('')
  const [logNote, setLogNote] = useState('')
  const [logType, setLogType] = useState('water')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addPlant(name.trim(), type, plantedDate)
    setName('')
    setType('reaper')
    setPlantedDate('')
    setShowForm(false)
  }

  const handleLog = (e, plantId) => {
    e.preventDefault()
    addLog(plantId, logType, logNote)
    setLogNote('')
    setShowLogForm(null)
  }

  const quickLog = (plantId, type) => {
    addLog(plantId, type)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🌶️ Spira</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {plants.length} planta{plants.length !== 1 ? 'r' : ''}
            {plantsNeedingWater.length > 0 && (
              <span style={{ color: 'var(--danger)' }}> · {plantsNeedingWater.length} þurfa vökvun</span>
            )}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Planta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný planta</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input
            className="input"
            placeholder="Nafn á plöntu..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <div>
            <div className="text-xs mb-2 font-medium" style={{ color: 'var(--muted)' }}>Tegund pipers</div>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {PEPPER_TYPES.map(pt => (
                <button key={pt.id} type="button" onClick={() => setType(pt.id)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition-all"
                  style={{
                    background: type === pt.id ? `${pt.color}22` : 'var(--surface2)',
                    border: `1px solid ${type === pt.id ? pt.color + '55' : 'transparent'}`,
                  }}>
                  <span className="text-xl">{pt.icon}</span>
                  <span style={{ color: type === pt.id ? pt.color : 'var(--muted)', fontSize: 10, textAlign: 'center', lineHeight: 1.2 }}>
                    {pt.name.split(' ').slice(-1)[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 font-medium" style={{ color: 'var(--muted)' }}>Gróðursetningardagur</div>
            <input type="date" className="input text-sm" value={plantedDate} onChange={e => setPlantedDate(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Bæta við
          </button>
        </form>
      )}

      {plants.length === 0 && !showForm ? (
        <div className="card text-center py-12 flex flex-col items-center gap-4">
          <div className="text-5xl">🌱</div>
          <div>
            <p className="font-semibold">Byrjaðu að rækta</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Reaper, Ghost, Scorpion — allar þínar súper heitu</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={16} /> Bæta við fyrstu plöntu
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {plants.map(plant => {
            const pt = PEPPER_TYPES.find(p => p.id === plant.type) || PEPPER_TYPES[6]
            const daysW = daysSinceWater(plant.id)
            const age = ageInDays(plant.plantedDate)
            const logs = logsForPlant(plant.id)
            const isOpen = expanded === plant.id
            const needsWater = daysW === null || daysW > 2

            return (
              <div key={plant.id} className="card"
                   style={{ borderColor: needsWater ? 'rgba(239,68,68,0.25)' : 'var(--border)' }}>
                <div className="flex items-center gap-3 cursor-pointer"
                     onClick={() => setExpanded(isOpen ? null : plant.id)}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                       style={{ background: `${pt.color}18` }}>
                    {pt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{plant.name}</div>
                    <div className="text-xs mt-0.5 flex flex-wrap items-center gap-x-2" style={{ color: 'var(--muted)' }}>
                      <span>{pt.name}</span>
                      {age !== null && <span>· {age} dagar</span>}
                      <span>· {pt.shu}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <WaterBadge days={daysW} />
                    {isOpen ? <ChevronUp size={14} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--muted)' }} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>SKRÁ ATBURÐ</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {LOG_TYPES.filter(lt => lt.id !== 'note').map(lt => (
                        <button key={lt.id} onClick={() => quickLog(plant.id, lt.id)}
                          className="btn text-xs py-1.5 px-3"
                          style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                          {lt.icon} {lt.label}
                        </button>
                      ))}
                    </div>

                    <button onClick={() => setShowLogForm(showLogForm === plant.id ? null : plant.id)}
                      className="text-xs mb-3" style={{ color: 'var(--accent)' }}>
                      + Bæta við athugasemd
                    </button>

                    {showLogForm === plant.id && (
                      <form onSubmit={(e) => handleLog(e, plant.id)}
                            className="flex flex-col gap-2 mb-3 p-3 rounded-xl"
                            style={{ background: 'var(--surface2)' }}>
                        <div className="flex flex-wrap gap-1">
                          {LOG_TYPES.map(lt => (
                            <button key={lt.id} type="button" onClick={() => setLogType(lt.id)}
                              className="text-xs py-1 px-2 rounded-lg"
                              style={{
                                background: logType === lt.id ? 'rgba(0,212,170,0.15)' : 'transparent',
                                color: logType === lt.id ? 'var(--accent)' : 'var(--muted)',
                                border: `1px solid ${logType === lt.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                              }}>
                              {lt.icon} {lt.label}
                            </button>
                          ))}
                        </div>
                        <input className="input text-sm" placeholder="Athugasemd..."
                               value={logNote} onChange={e => setLogNote(e.target.value)} autoFocus />
                        <div className="flex gap-2">
                          <button type="submit" className="btn btn-primary text-xs flex-1 justify-center">Vista</button>
                          <button type="button" onClick={() => setShowLogForm(null)} className="btn btn-ghost text-xs">
                            <X size={14} />
                          </button>
                        </div>
                      </form>
                    )}

                    {logs.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>SAGA</div>
                        {logs.slice(0, 6).map(log => {
                          const lt = LOG_TYPES.find(l => l.id === log.logType)
                          return (
                            <div key={log.id} className="flex items-center gap-2 py-1.5 text-xs border-t"
                                 style={{ borderColor: 'var(--border)' }}>
                              <span>{lt?.icon || '📝'}</span>
                              <span style={{ color: 'var(--muted)' }}>{lt?.label}</span>
                              {log.note && <span className="flex-1 truncate" style={{ color: 'var(--text)' }}>{log.note}</span>}
                              <span style={{ color: 'var(--muted)' }}>
                                {new Date(log.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex justify-end mt-3">
                      <button onClick={() => removePlant(plant.id)}
                              className="btn text-xs py-1 px-2"
                              style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <Trash2 size={12} /> Eyða plöntu
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
