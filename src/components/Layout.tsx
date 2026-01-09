import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Hand, Heart, Accessibility, Shield, Settings, Info, MousePointer, Menu, X } from 'lucide-react'
import { AppState } from '../App'

interface LayoutProps {
  children: ReactNode
  appState: AppState
}

const Layout = ({ children, appState }: LayoutProps) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/gesture-settings', icon: Hand, label: 'Gestures' },
    { path: '/comfort-mode', icon: Heart, label: 'Comfort' },
    { path: '/accessibility', icon: Accessibility, label: 'Accessibility' },
    { path: '/caregiver', icon: Shield, label: 'Emergency' },
    { path: '/device-settings', icon: Settings, label: 'Device' },
    { path: '/air-mouse', icon: MousePointer, label: 'Air Mouse H-System' },
    { path: '/about', icon: Info, label: 'About' }
  ]

  const isAirMouse = location.pathname === '/air-mouse'

  const SidebarContent = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent">
          Airis-SH
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">Control Center</p>
      </div>

      <div className="flex items-center gap-2 mb-5 p-2.5 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50">
        <div className={`status-dot ${
          appState.connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
          appState.connectionStatus === 'searching' ? 'bg-yellow-500 animate-pulse' :
          'bg-red-500'
        }`} />
        <span className="text-sm font-medium text-gray-700">
          {appState.connectionStatus === 'connected' ? 'Connected' :
           appState.connectionStatus === 'searching' ? 'Searching...' :
           'Not Connected'}
        </span>
      </div>

      <nav className="space-y-1.5 mb-5">
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-400 to-teal-400 text-white shadow-lg scale-105'
                  : 'hover:bg-white/50 text-gray-700 hover:scale-102'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-3 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100">
        <p className="text-xs text-gray-600 text-center">
          Designed for accessibility
        </p>
        <p className="text-xs text-gray-500 text-center mt-0.5">
          v1.0.0
        </p>
      </div>
    </>
  )

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-[60] p-3 glass-panel rounded-xl lg:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <aside className={`
        ${isMobile 
          ? `fixed inset-0 z-[55] transform transition-transform duration-300 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'fixed left-4 top-4 bottom-4 z-50'
        }
        w-72 p-5 glass-panel flex flex-col overflow-y-auto sidebar-scroll
      `}>
        {isMobile && (
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/50"
            >
              <X size={24} />
            </button>
          </div>
        )}
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[54] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Scrollable Main Content */}
      <main className={`
        flex-1 h-full 
        ${isAirMouse ? 'p-0 overflow-hidden' : 'p-4 md:p-6 overflow-y-auto'} 
        ${isMobile ? 'ml-0' : 'ml-[304px]'}
      `}>
        {children}
      </main>
    </div>
  )
}

export default Layout
