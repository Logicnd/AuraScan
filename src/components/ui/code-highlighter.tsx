'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CodeHighlighterProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
  fileName?: string
  copyable?: boolean
}

// Simple syntax highlighting without external dependencies
const tokenize = (code: string, language: string) => {
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'typeof', 'true', 'false', 'null', 'undefined'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'typeof', 'true', 'false', 'null', 'undefined', 'interface', 'type', 'extends', 'implements', 'public', 'private', 'readonly'],
    python: ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'raise', 'with', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'],
    rust: ['fn', 'let', 'mut', 'const', 'if', 'else', 'for', 'while', 'loop', 'match', 'impl', 'struct', 'enum', 'pub', 'use', 'mod', 'return', 'true', 'false', 'self', 'Self', 'async', 'await'],
    css: ['@import', '@media', '@keyframes', '@font-face', '!important'],
  }

  const lang = language.toLowerCase()
  const langKeywords = keywords[lang] || keywords.javascript

  return code.split('\n').map(line => {
    let result = line

    // Highlight strings
    result = result.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="token-string">$&</span>')
    
    // Highlight comments
    result = result.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm, '<span class="token-comment">$&</span>')
    
    // Highlight numbers
    result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')
    
    // Highlight keywords
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
      result = result.replace(regex, '<span class="token-keyword">$1</span>')
    })

    // Highlight function calls
    result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="token-function">$1</span>(')

    return result
  })
}

export function CodeHighlighter({
  code,
  language = 'typescript',
  showLineNumbers = true,
  highlightLines = [],
  className,
  fileName,
  copyable = true
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false)
  const lines = tokenize(code, language)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('group relative font-mono text-sm', className)}>
      {/* Header */}
      {(fileName || copyable) && (
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-cyan-500/20 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {fileName && (
              <span className="text-zinc-500 text-xs ml-2">{fileName}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 uppercase">{language}</span>
            {copyable && (
              <button
                onClick={handleCopy}
                className="px-2 py-1 text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Block */}
      <div className="relative overflow-x-auto bg-black/80 border border-cyan-500/20 rounded-b-lg">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] z-10" />
        
        <pre className="p-4 overflow-x-auto">
          <code className="block">
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'flex',
                  highlightLines.includes(i + 1) && 'bg-cyan-500/10 -mx-4 px-4 border-l-2 border-cyan-500'
                )}
              >
                {showLineNumbers && (
                  <span className="w-8 text-right pr-4 text-zinc-600 select-none flex-shrink-0">
                    {i + 1}
                  </span>
                )}
                <span
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              </div>
            ))}
          </code>
        </pre>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-cyan-500/5 via-transparent to-magenta-500/5" />
      </div>

      {/* Token styles */}
      <style jsx global>{`
        .token-keyword {
          color: #ff79c6;
        }
        .token-string {
          color: #f1fa8c;
        }
        .token-comment {
          color: #6272a4;
          font-style: italic;
        }
        .token-number {
          color: #bd93f9;
        }
        .token-function {
          color: #50fa7b;
        }
      `}</style>
    </div>
  )
}

interface TerminalCodeProps {
  lines: Array<{
    type: 'command' | 'output' | 'comment' | 'success' | 'error'
    content: string
    prompt?: string
  }>
  className?: string
  title?: string
}

export function TerminalCode({ lines, className, title = 'Terminal' }: TerminalCodeProps) {
  return (
    <div className={cn('font-mono text-sm', className)}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/90 border-b border-cyan-500/20 rounded-t-lg">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-zinc-500 text-xs">{title}</span>
      </div>

      {/* Terminal Body */}
      <div className="bg-black/90 border border-t-0 border-cyan-500/20 rounded-b-lg p-4 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start">
            {line.type === 'command' && (
              <>
                <span className="text-cyan-400 mr-2">{line.prompt || '$'}</span>
                <span className="text-white">{line.content}</span>
              </>
            )}
            {line.type === 'output' && (
              <span className="text-zinc-400">{line.content}</span>
            )}
            {line.type === 'comment' && (
              <span className="text-zinc-600"># {line.content}</span>
            )}
            {line.type === 'success' && (
              <span className="text-green-400">✓ {line.content}</span>
            )}
            {line.type === 'error' && (
              <span className="text-red-400">✗ {line.content}</span>
            )}
          </div>
        ))}
        <div className="flex items-center mt-1">
          <span className="text-cyan-400 mr-2">$</span>
          <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
