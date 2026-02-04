'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useGamification } from '@/lib/store/gamification'
import { ScannerInput } from '@/components/scan/scanner-input'
import { AnalysisResult } from '@/components/scan/analysis-result'
import { HackingAnimation } from '@/components/ui/hacking-animation'
import { GlitchText } from '@/components/ui/glitch-text'

export default function ScanPage() {
  const { addXp } = useGamification()
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle')
  const [result, setResult] = useState<any>(null)

  const handleScan = (content: string) => {
    setStatus('scanning')
  }

  const handleScanComplete = () => {
    // Mock analysis result
    const mockResult = {
      score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      timestamp: new Date().toISOString(),
      issues: [
        {
          id: 'vuln-1',
          severity: 'high',
          title: 'Hardcoded Credentials',
          description: 'Detected potential API keys in source code.',
          line: 42
        },
        {
          id: 'vuln-2',
          severity: 'medium',
          title: 'Insecure Dependency',
          description: 'Package "evil-corp-lib" is known to contain malware.',
        }
      ]
    }

    setResult(mockResult)
    setStatus('complete')
    addXp(100)
    toast.success('SCAN COMPLETE', {
      description: '+100 XP | Vulnerabilities Identified'
    })
  }

  const resetScan = () => {
    setStatus('idle')
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <GlitchText text="ETHICS SCANNER" />
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Deploy advanced heuristics to analyze code for vulnerabilities, 
            ethical biases, and security flaws.
          </p>
        </div>

        <motion.div
          layout
          className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl"
        >
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScannerInput onScan={handleScan} isScanning={false} />
            </motion.div>
          )}

          {status === 'scanning' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HackingAnimation onComplete={handleScanComplete} />
            </motion.div>
          )}

          {status === 'complete' && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnalysisResult 
                score={result.score} 
                issues={result.issues} 
                timestamp={result.timestamp} 
              />
              <div className="mt-8 flex justify-center">
                <button
                  onClick={resetScan}
                  className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold transition-colors border border-zinc-700"
                >
                  NEW SCAN
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
