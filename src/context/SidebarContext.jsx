import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Ctx.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useSidebar = () => useContext(Ctx)
