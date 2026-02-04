'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scan, Upload, FileCode, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScannerInputProps {
  onScan: (content: string) => void
  isScanning: boolean
}

export function ScannerInput({ onScan, isScanning }: ScannerInputProps) {
  const [input, setInput] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file drop (mock implementation)
      setInput(`[FILE DETECTED: ${e.dataTransfer.files[0].name}]\nReading binary stream...\n\n`)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-green-500">
          <Terminal className="w-5 h-5" />
          <span className="font-mono text-sm tracking-wider uppercase">Input Stream</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <Upload className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <FileCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "relative group rounded-xl border-2 border-dashed transition-all duration-300",
          dragActive 
            ? "border-green-500 bg-green-500/5" 
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="// Paste code or vulnerability signature here for analysis..."
          className="w-full h-64 bg-transparent p-6 text-sm font-mono text-zinc-300 focus:outline-none resize-none placeholder:text-zinc-600"
          disabled={isScanning}
        />
        
        <div className="absolute bottom-4 right-4">
          <span className="text-xs text-zinc-600 font-mono">
            {input.length} CHARS
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onScan(input)}
        disabled={!input || isScanning}
        className={cn(
          "w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3",
          !input || isScanning
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-black shadow-lg shadow-green-900/20"
        )}
      >
        {isScanning ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing Packet...
          </>
        ) : (
          <>
            <Scan className="w-5 h-5" />
            Initiate Scan
          </>
        )}
      </motion.button>
    </div>
  )
}
