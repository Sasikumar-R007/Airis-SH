import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Hand, Heart, Accessibility, Shield, Settings, Info } from 'lucide-react'
import { AppState } from '../App'

interface LayoutProps {
  children: ReactNode
  appState: AppState
}

const Layout = ({ children, appState }: LayoutProps) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/gesture-settings', icon: Hand, label: 'Gestures' },
    { path: '/comfort-mode', icon: Heart, label: 'Comfort' },
    { path: '/accessibility', icon: Accessibility, label: 'Accessibility' },
    { path: '/caregiver', icon: Shield, label: 'Emergency' },
    { path: '/device-settings', icon: Settings, label: 'Device' },
    { path: '/about', icon: Info, label: 'About' }
  ]

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 p-6 glass-panel m-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent">
            Airis-SH
          </h1>
          <p className="text-sm text-gray-600 mt-1">Control Center</p>
        </div>

        <div className="flex items-center gap-2 mb-6 p-3 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50">
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

        <nav className="flex-1 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
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

        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100">
          <p className="text-xs text-gray-600 text-center">
            Designed for accessibility
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            v1.0.0
          </p>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
