import { useLocalStorage } from './useLocalStorage'

export const ICELANDIC_COURSES = [
  { id: 'grafarholt', name: 'Grafarholt', location: 'Reykjavík', par: 72, holes: 18 },
  { id: 'keilir', name: 'Keilir', location: 'Hafnarfjörður', par: 72, holes: 18 },
  { id: 'korpa', name: 'Korpa', location: 'Reykjavík', par: 72, holes: 18 },
  { id: 'hlidarendi', name: 'Hlíðarendi', location: 'Reykjavík', par: 36, holes: 9 },
  { id: 'ness', name: 'Nes', location: 'Seltjarnarnes', par: 72, holes: 18 },
  { id: 'sudurnes', name: 'Suðurnes', location: 'Reykjanesbær', par: 72, holes: 18 },
]

// Standard par layout for 18 holes (generic Icelandic course)
export const PAR_18 = [4,3,5,4,4,3,5,4,4, 4,3,5,4,4,3,5,4,4]
export const PAR_9  = [4,3,5,4,4,3,5,4,4]

export function useGolf() {
  const [rounds, setRounds] = useLocalStorage('addi_golf_rounds', [])
  const [courses, setCourses] = useLocalStorage('addi_golf_courses', ICELANDIC_COURSES)

  const addRound = (courseId, date, scores, notes = '') => {
    const course = courses.find(c => c.id === courseId) || { name: courseId, par: 72, holes: 18 }
    const total = scores.reduce((a, b) => a + (b || 0), 0)
    setRounds(prev => [{
      id: Date.now().toString(),
      courseId,
      courseName: course.name,
      location: course.location,
      date,
      scores,
      total,
      differential: total - course.par,
      par: course.par,
      holes: course.holes,
      notes,
    }, ...prev])
  }

  const removeRound = (id) => setRounds(prev => prev.filter(r => r.id !== id))

  const addCourse = (name, location, par = 72, holes = 18) =>
    setCourses(prev => [...prev, { id: Date.now().toString(), name, location, par, holes }])

  const bestRound = rounds.length
    ? rounds.reduce((best, r) => r.differential < best.differential ? r : best, rounds[0])
    : null

  const avgDifferential = rounds.length
    ? Math.round(rounds.reduce((a, r) => a + r.differential, 0) / rounds.length * 10) / 10
    : null

  const calcHandicap = () => {
    if (rounds.length < 3) return null
    const recent = rounds.slice(0, Math.min(20, rounds.length))
    const sorted = [...recent].sort((a, b) => a.differential - b.differential)
    const count = Math.max(1, Math.ceil(recent.length * 0.4))
    const avg = sorted.slice(0, count).reduce((a, r) => a + r.differential, 0) / count
    return Math.round(avg * 0.96 * 10) / 10
  }

  return {
    rounds, courses,
    addRound, removeRound, addCourse,
    bestRound, avgDifferential,
    handicap: calcHandicap(),
  }
}
