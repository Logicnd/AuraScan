'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href?: string
  icon?: React.ReactNode
  children?: NavItem[]
  badge?: string | number
}

interface NavMenuProps {
  items: NavItem[]
  variant?: 'default' | 'cyber' | 'minimal'
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function NavMenu({
  items,
  variant = 'cyber',
  orientation = 'horizontal',
  className
}: NavMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const variants = {
    default: {
      container: 'bg-zinc-900 border border-zinc-800 rounded-lg p-2',
      item: 'text-zinc-400 hover:text-white hover:bg-zinc-800',
      active: 'text-white bg-zinc-800'
    },
    cyber: {
      container: 'bg-black/80 border border-cyan-500/30 rounded-lg p-2 shadow-[0_0_15px_rgba(0,255,255,0.1)]',
      item: 'text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10',
      active: 'text-cyan-400 bg-cyan-500/20 border-l-2 border-cyan-500'
    },
    minimal: {
      container: '',
      item: 'text-zinc-500 hover:text-white',
      active: 'text-cyan-400'
    }
  }

  const style = variants[variant]

  return (
    <nav className={cn(
      style.container,
      orientation === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-1',
      className
    )}>
      {items.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.children && setOpenDropdown(item.label)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-mono rounded transition-all',
                style.item
              )}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.label}
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-400 rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          ) : (
            <button
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-mono rounded transition-all w-full text-left',
                style.item
              )}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.label}
              {item.children && <span className="ml-auto text-xs">▼</span>}
            </button>
          )}

          {/* Dropdown */}
          {item.children && openDropdown === item.label && (
            <div className={cn(
              'absolute z-50 min-w-[200px] py-2',
              orientation === 'horizontal' ? 'top-full left-0 mt-1' : 'left-full top-0 ml-1'
            )}>
              <div className={cn(
                'bg-black/95 border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.2)]',
                'animate-dropdown-enter'
              )}>
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href || '#'}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm font-mono transition-all',
                      'text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                    )}
                  >
                    {child.icon && <span>{child.icon}</span>}
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes dropdown-enter {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown-enter {
          animation: dropdown-enter 0.2s ease-out;
        }
      `}</style>
    </nav>
  )
}

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: string | React.ReactNode
  className?: string
}

export function Breadcrumbs({ items, separator = '/', className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm font-mono', className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-zinc-600">{separator}</span>
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-cyan-400">
              {item.icon}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-mono border border-cyan-500/30 rounded text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>

      {getPageNumbers().map((page, i) => (
        typeof page === 'number' ? (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-10 h-10 text-sm font-mono rounded transition-all',
              page === currentPage
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                : 'text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent'
            )}
          >
            {page}
          </button>
        ) : (
          <span key={i} className="px-2 text-zinc-600">...</span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-mono border border-cyan-500/30 rounded text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  )
}
