'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Tabs Context
interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

// Tabs Root
interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
  onChange?: (value: string) => void
}

export function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onChange?.(value)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// Tabs List
interface TabsListProps {
  children: ReactNode
  variant?: 'default' | 'cyber' | 'underline' | 'pills'
  className?: string
}

export function TabsList({ children, variant = 'cyber', className }: TabsListProps) {
  const variants = {
    default: 'flex gap-1 p-1 bg-zinc-900 rounded-lg',
    cyber: 'flex gap-1 p-1 bg-black/80 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)]',
    underline: 'flex gap-4 border-b border-zinc-800',
    pills: 'flex gap-2'
  }

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  )
}

// Tab Trigger
interface TabsTriggerProps {
  value: string
  children: ReactNode
  variant?: 'default' | 'cyber' | 'underline' | 'pills'
  disabled?: boolean
  className?: string
}

export function TabsTrigger({
  value,
  children,
  variant = 'cyber',
  disabled = false,
  className
}: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  const variants = {
    default: cn(
      'px-4 py-2 text-sm font-medium rounded-md transition-all',
      isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    cyber: cn(
      'px-4 py-2 text-sm font-mono transition-all duration-300 rounded',
      isActive 
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]' 
        : 'text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    underline: cn(
      'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all',
      isActive 
        ? 'border-cyan-500 text-cyan-400' 
        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    pills: cn(
      'px-4 py-2 text-sm font-mono rounded-full transition-all',
      isActive 
        ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200',
      disabled && 'opacity-50 cursor-not-allowed'
    )
  }

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(variants[variant], className)}
    >
      {children}
    </button>
  )
}

// Tab Content
interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { activeTab } = context

  if (activeTab !== value) return null

  return (
    <div 
      className={cn('animate-tab-content', className)}
    >
      {children}
      
      <style jsx>{`
        @keyframes tab-content {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-tab-content {
          animation: tab-content 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

// Vertical Tabs
interface VerticalTabsProps {
  tabs: { value: string; label: string; icon?: ReactNode }[]
  defaultValue: string
  children: (activeTab: string) => ReactNode
  className?: string
}

export function VerticalTabs({ tabs, defaultValue, children, className }: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0">
        <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-2 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm font-mono rounded transition-all',
                activeTab === tab.value
                  ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-500'
                  : 'text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 border-l-2 border-transparent'
              )}
            >
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {children(activeTab)}
      </div>
    </div>
  )
}
