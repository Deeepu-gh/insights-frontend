import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, MessageSquare } from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AIChatbot from '../components/AIChatbot'
import { AnomalyProvider } from '../context/AnomalyContext'
import { pageTransition } from '../animations/variants'

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  return (
    <AnomalyProvider>
      <div className="min-h-screen mesh-bg" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <Sidebar 
          mobileOpen={mobileOpen} 
          onMobileClose={() => setMobileOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden w-9 h-9 flex items-center justify-center rounded-xl"
        style={{ background: 'rgba(15,23,42,0.06)', border: '1px solid rgba(15,23,42,0.08)' }}
      >
        <Menu size={16} className="text-white/60" />
      </button>

      {/* Main content */}
      <main 
        className="pt-16 transition-all duration-300 min-h-screen hidden md:block"
        style={{ marginLeft: sidebarCollapsed ? '72px' : '240px' }}
      >
        <motion.div
          key={location.pathname}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="p-6"
        >
          {children}
        </motion.div>
      </main>

      {/* Main content for mobile */}
      <main className="pt-16 transition-all duration-300 min-h-screen md:hidden">
        <motion.div
          key={location.pathname}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="p-6"
        >
          {children}
        </motion.div>
      </main>

      {/* Floating AI Chat button */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            boxShadow: '0 0 30px rgba(37,99,235,0.25), 0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <MessageSquare size={22} className="text-white" />
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: 'rgba(37,99,235,0.3)' }}
          />
        </motion.button>
      )}

      {/* AI Chatbot */}
      <AIChatbot open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </AnomalyProvider>
  )
}
