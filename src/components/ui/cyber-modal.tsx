'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Modal Context
interface ModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

// Modal Root
interface CyberModalProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CyberModal({ children, open, onOpenChange }: CyberModalProps) {
  const [isOpen, setIsOpen] = useState(open ?? false)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const openModal = useCallback(() => {
    setIsOpen(true)
    onOpenChange?.(true)
  }, [onOpenChange])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

// Modal Trigger
interface ModalTriggerProps {
  children: ReactNode
  asChild?: boolean
}

export function ModalTrigger({ children, asChild }: ModalTriggerProps) {
  const context = useContext(ModalContext)
  if (!context) throw new Error('ModalTrigger must be used within CyberModal')

  if (asChild) {
    return <span onClick={context.openModal}>{children}</span>
  }

  return (
    <button onClick={context.openModal}>
      {children}
    </button>
  )
}

// Modal Content
interface ModalContentProps {
  children: ReactNode
  variant?: 'default' | 'cyber' | 'glass' | 'neon'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  className?: string
}

export function ModalContent({
  children,
  variant = 'cyber',
  size = 'md',
  showClose = true,
  className
}: ModalContentProps) {
  const context = useContext(ModalContext)
  if (!context) throw new Error('ModalContent must be used within CyberModal')

  const { isOpen, closeModal } = context

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeModal])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
  }

  const variants = {
    default: 'bg-zinc-900 border border-zinc-800',
    cyber: cn(
      'bg-black/95 border border-cyan-500/30',
      'shadow-[0_0_50px_rgba(0,255,255,0.2)]'
    ),
    glass: cn(
      'bg-white/10 backdrop-blur-xl border border-white/20',
      'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
    ),
    neon: cn(
      'bg-black border-2 border-cyan-500',
      'shadow-[0_0_30px_rgba(0,255,255,0.4),inset_0_0_30px_rgba(0,255,255,0.1)]'
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeModal}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Scanline effect on backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
          style={{ animation: 'scanDown 3s linear infinite' }}
        />
      </div>

      {/* Modal */}
      <div
        className={cn(
          'relative w-full rounded-xl overflow-hidden',
          sizes[size],
          variants[variant],
          className
        )}
        style={{ animation: 'modalEnter 0.3s ease-out' }}
      >
        {/* HUD corners for cyber variant */}
        {variant === 'cyber' && (
          <>
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-500" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-500" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-500" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-500" />
          </>
        )}

        {/* Close button */}
        {showClose && (
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            ✕
          </button>
        )}

        {children}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEnter {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes scanDown {
          from { top: 0; }
          to { top: 100%; }
        }
      `}</style>
    </div>
  )
}

// Modal Header
interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-cyan-500/20', className)}>
      {children}
    </div>
  )
}

// Modal Title
interface ModalTitleProps {
  children: ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <h2 className={cn('text-xl font-mono font-bold text-cyan-400', className)}>
      {children}
    </h2>
  )
}

// Modal Body
interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

// Modal Footer
interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-cyan-500/20 flex justify-end gap-3', className)}>
      {children}
    </div>
  )
}

// Confirm Modal Hook
interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts)
    setIsOpen(true)
    
    return new Promise((resolve) => {
      setResolver(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    resolver?.(true)
    setIsOpen(false)
  }, [resolver])

  const handleCancel = useCallback(() => {
    resolver?.(false)
    setIsOpen(false)
  }, [resolver])

  const ConfirmDialog = useCallback(() => {
    if (!options) return null

    const variantColors = {
      danger: 'border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.2)]',
      warning: 'border-orange-500/30 shadow-[0_0_30px_rgba(255,165,0,0.2)]',
      info: 'border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]'
    }

    return (
      <CyberModal open={isOpen} onOpenChange={setIsOpen}>
        <ModalContent
          variant="cyber"
          size="sm"
          className={variantColors[options.variant || 'info']}
        >
          <ModalHeader>
            <ModalTitle>{options.title}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-zinc-400">{options.message}</p>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-mono text-zinc-400 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors"
            >
              {options.cancelText || 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className={cn(
                'px-4 py-2 text-sm font-mono rounded transition-colors',
                options.variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
                options.variant === 'warning' && 'bg-orange-500 text-white hover:bg-orange-600',
                (!options.variant || options.variant === 'info') && 'bg-cyan-500 text-black hover:bg-cyan-400'
              )}
            >
              {options.confirmText || 'Confirm'}
            </button>
          </ModalFooter>
        </ModalContent>
      </CyberModal>
    )
  }, [isOpen, options, handleConfirm, handleCancel])

  return { confirm, ConfirmDialog }
}
