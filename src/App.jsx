import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Finance from './pages/Finance'
import Notes from './pages/Notes'
import Timer from './pages/Timer'
import Settings from './pages/Settings'
import Shopping from './pages/Shopping'
import Sports from './pages/Sports'
import Subscriptions from './pages/Subscriptions'

const pageAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.12 } },
}

export default function App() {
  const location = useLocation()
  return (
    <div className="aurora-bg min-h-screen flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        <Header />
        <div className="flex-1 w-full max-w-2xl mx-auto px-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={location.pathname} {...pageAnim}>
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/timer" element={<Timer />} />
                <Route path="/shopping" element={<Shopping />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
