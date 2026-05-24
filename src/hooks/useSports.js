import { useLocalStorage } from './useLocalStorage'

const DEFAULT_MATCHES = [
  { id: 1, date: '2026-06-11', home: '🇲🇽', homeTeam: 'Mexico', away: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam: 'England', homeScore: null, awayScore: null, group: 'B', note: 'Opening match' },
  { id: 2, date: '2026-06-12', home: '🇺🇸', homeTeam: 'USA', away: '🇳🇿', awayTeam: 'New Zealand', homeScore: null, awayScore: null, group: 'A', note: 'USMNT – Fyrsti leikur!' },
  { id: 3, date: '2026-06-16', home: '🇺🇸', homeTeam: 'USA', away: '🇵🇦', awayTeam: 'Panama', homeScore: null, awayScore: null, group: 'A', note: 'USMNT' },
  { id: 4, date: '2026-06-20', home: '🇺🇾', homeTeam: 'Uruguay', away: '🇺🇸', awayTeam: 'USA', homeScore: null, awayScore: null, group: 'A', note: 'USMNT – Hópurinn lokast' },
  { id: 5, date: '2026-06-18', home: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', homeTeam: 'England', away: '🇸🇿', awayTeam: 'Slovakia', homeScore: null, awayScore: null, group: 'B', note: '' },
  { id: 6, date: '2026-07-19', home: '🏆', homeTeam: 'Úrslit', away: '🏆', awayTeam: '', homeScore: null, awayScore: null, group: 'Úrslit', note: 'MetLife Stadium, New Jersey' },
]

const DEFAULT_PL = [
  { pos: 1, name: 'Liverpool', pts: 82, gd: '+49', badge: '🔴', spurs: false },
  { pos: 2, name: 'Arsenal', pts: 78, gd: '+40', badge: '🔴', spurs: false },
  { pos: 3, name: 'Man City', pts: 73, gd: '+37', badge: '🔵', spurs: false },
  { pos: 4, name: 'Chelsea', pts: 67, gd: '+22', badge: '🔵', spurs: false },
  { pos: 5, name: 'Tottenham', pts: 64, gd: '+18', badge: '⚪', spurs: true },
  { pos: 6, name: 'Aston Villa', pts: 58, gd: '+12', badge: '🟣', spurs: false },
  { pos: 7, name: 'Newcastle', pts: 56, gd: '+10', badge: '⚫', spurs: false },
]

export function useSports() {
  const [matches, setMatches] = useLocalStorage('wc_matches', DEFAULT_MATCHES)
  const [plTable, setPLTable] = useLocalStorage('pl_table', DEFAULT_PL)
  const [myPredictions, setMyPredictions] = useLocalStorage('wc_predictions', {})

  function updateScore(id, field, val) {
    setMatches(m => m.map(x => x.id === id ? { ...x, [field]: val === '' ? null : Number(val) } : x))
  }

  function setPrediction(matchId, team) {
    setMyPredictions(p => ({ ...p, [matchId]: team }))
  }

  function updatePLRow(pos, field, val) {
    setPLTable(t => t.map(r => r.pos === pos ? { ...r, [field]: val } : r))
  }

  const wcStart = new Date('2026-06-11')
  const wcEnd = new Date('2026-07-19')
  const now = new Date()
  const daysToWC = Math.max(0, Math.ceil((wcStart - now) / 86400000))
  const wcActive = now >= wcStart && now <= wcEnd
  const wcOver = now > wcEnd

  return {
    matches,
    plTable,
    myPredictions,
    updateScore,
    setPrediction,
    updatePLRow,
    daysToWC,
    wcActive,
    wcOver,
    wcStart,
    wcEnd,
  }
}
