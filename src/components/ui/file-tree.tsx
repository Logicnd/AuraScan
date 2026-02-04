'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  icon?: React.ReactNode
  badge?: string
  status?: 'modified' | 'added' | 'deleted' | 'renamed'
}

interface FileTreeProps {
  files: FileNode[]
  onSelect?: (path: string[]) => void
  className?: string
}

const fileIcons: Record<string, string> = {
  tsx: '⚛',
  ts: '📘',
  js: '📒',
  jsx: '⚛',
  json: '{}',
  css: '🎨',
  scss: '🎨',
  md: '📝',
  html: '🌐',
  py: '🐍',
  rs: '🦀',
  go: '🔵',
  rb: '💎',
  default: '📄',
  folder: '📁',
  folderOpen: '📂'
}

const statusColors: Record<string, string> = {
  modified: 'text-yellow-400',
  added: 'text-green-400',
  deleted: 'text-red-400',
  renamed: 'text-purple-400'
}

function FileTreeNode({
  node,
  path,
  level,
  onSelect
}: {
  node: FileNode
  path: string[]
  level: number
  onSelect?: (path: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(level < 2)
  const currentPath = [...path, node.name]

  const getIcon = () => {
    if (node.icon) return node.icon
    if (node.type === 'folder') {
      return isOpen ? fileIcons.folderOpen : fileIcons.folder
    }
    const ext = node.name.split('.').pop()?.toLowerCase() || ''
    return fileIcons[ext] || fileIcons.default
  }

  return (
    <div>
      <button
        onClick={() => {
          if (node.type === 'folder') {
            setIsOpen(!isOpen)
          }
          onSelect?.(currentPath)
        }}
        className={cn(
          'w-full flex items-center gap-2 py-1.5 px-2 text-sm font-mono rounded transition-all',
          'text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10',
          'group'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/Collapse for folders */}
        {node.type === 'folder' && (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="text-zinc-600 text-xs"
          >
            ▶
          </motion.span>
        )}

        {/* Icon */}
        <span className="text-base">{getIcon()}</span>

        {/* Name */}
        <span className={cn(
          'flex-1 text-left truncate',
          node.status && statusColors[node.status]
        )}>
          {node.name}
        </span>

        {/* Badge */}
        {node.badge && (
          <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-400 rounded">
            {node.badge}
          </span>
        )}

        {/* Status indicator */}
        {node.status && (
          <span className={cn('text-xs', statusColors[node.status])}>
            {node.status === 'modified' && 'M'}
            {node.status === 'added' && 'A'}
            {node.status === 'deleted' && 'D'}
            {node.status === 'renamed' && 'R'}
          </span>
        )}
      </button>

      {/* Children */}
      <AnimatePresence>
        {node.type === 'folder' && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Vertical line */}
            <div className="relative">
              <div
                className="absolute top-0 bottom-0 w-px bg-zinc-800"
                style={{ left: `${(level + 1) * 16 + 12}px` }}
              />
              {node.children.map((child, i) => (
                <FileTreeNode
                  key={child.name + i}
                  node={child}
                  path={currentPath}
                  level={level + 1}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FileTree({ files, onSelect, className }: FileTreeProps) {
  return (
    <div className={cn(
      'bg-black/80 border border-cyan-500/20 rounded-lg p-2',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-zinc-600 hover:text-cyan-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14" />
            </svg>
          </button>
          <button className="p-1 text-zinc-600 hover:text-cyan-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v16h16" />
              <path d="m4 20 7-7 4 4 5-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tree */}
      {files.map((file, i) => (
        <FileTreeNode
          key={file.name + i}
          node={file}
          path={[]}
          level={0}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// Demo data
export const demoFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.tsx', type: 'file', status: 'modified' },
          { name: 'Input.tsx', type: 'file' },
          { name: 'Modal.tsx', type: 'file', status: 'added' }
        ]
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'index.tsx', type: 'file' },
          { name: 'about.tsx', type: 'file' }
        ]
      },
      { name: 'styles.css', type: 'file' }
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file', badge: 'NEW' }
]
