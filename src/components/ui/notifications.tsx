'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Types
interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'cyber'
  title: string
  message?: string
  duration?: number
  icon?: ReactNode
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

// Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Provider
interface NotificationProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxNotifications?: number
}

export function NotificationProvider({
  children,
  position = 'top-right',
  maxNotifications = 5
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification = { ...notification, id }

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications)
      return updated
    })

    // Auto remove
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }, [maxNotifications, removeNotification])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      
      {/* Notification Container */}
      <div className={cn('fixed z-[100] flex flex-col gap-2', positionClasses[position])}>
        {notifications.map((notification, index) => (
          <CyberNotification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            index={index}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

// Hook
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Notification Component
interface CyberNotificationProps {
  notification: Notification
  onClose: () => void
  index: number
}

function CyberNotification({ notification, onClose, index }: CyberNotificationProps) {
  const { type, title, message, icon } = notification

  const typeStyles = {
    info: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
      glow: 'shadow-[0_0_20px_rgba(0,255,255,0.2)]',
      icon: 'ℹ',
      iconColor: 'text-cyan-400'
    },
    success: {
      border: 'border-green-500/50',
      bg: 'bg-green-500/10',
      glow: 'shadow-[0_0_20px_rgba(57,255,20,0.2)]',
      icon: '✓',
      iconColor: 'text-green-400'
    },
    warning: {
      border: 'border-orange-500/50',
      bg: 'bg-orange-500/10',
      glow: 'shadow-[0_0_20px_rgba(255,165,0,0.2)]',
      icon: '⚠',
      iconColor: 'text-orange-400'
    },
    error: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
      glow: 'shadow-[0_0_20px_rgba(255,0,0,0.2)]',
      icon: '✕',
      iconColor: 'text-red-400'
    },
    cyber: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_20px_rgba(191,0,255,0.2)]',
      icon: '◈',
      iconColor: 'text-purple-400'
    }
  }

  const styles = typeStyles[type]

  return (
    <div
      className={cn(
        'w-80 p-4 rounded-lg border backdrop-blur-xl',
        'animate-[slideIn_0.3s_ease-out]',
        styles.border,
        styles.bg,
        styles.glow
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* HUD corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-current opacity-50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-current opacity-50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-current opacity-50" />

      <div className="flex items-start gap-3">
        <span className={cn('text-xl', styles.iconColor)}>
          {icon || styles.icon}
        </span>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-mono font-semibold text-sm text-white truncate">
            {title}
          </h4>
          {message && (
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
        <div
          className={cn('h-full', styles.iconColor.replace('text-', 'bg-'))}
          style={{
            animation: `shrink ${notification.duration || 5000}ms linear forwards`
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Quick notification functions
export function notify(_title: string, _options?: Partial<Omit<Notification, 'id' | 'title'>>) {
  void _title
  void _options
  // This would need to be called within a component that has access to the context
  // For a cleaner API, use the hook directly
}
