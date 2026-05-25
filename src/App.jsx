import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Finance from './pages/Finance'
import Notes from './pages/Notes'
import Timer from './pages/Timer'
import Settings from './pages/Settings'
import Sports from './pages/Sports'
import Subscriptions from './pages/Subscriptions'

export default function App() {
  return (
    <div className="aurora-bg min-h-screen flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        <div className="flex-1 w-full max-w-2xl mx-auto px-4 safe-top">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Routes>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
