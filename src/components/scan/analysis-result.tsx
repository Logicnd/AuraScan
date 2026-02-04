'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, ShieldAlert, AlertOctagon, Terminal } from 'lucide-react'
import { GlitchText } from '@/components/ui/glitch-text'

interface Issue {
  id: string
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  line?: number
}

interface AnalysisResultProps {
  score: number
  issues: Issue[]
  timestamp: string
}

export function AnalysisResult({ score, issues, timestamp }: AnalysisResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'SECURE'
    if (score >= 70) return 'WARNING'
    return 'CRITICAL'
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Summary */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-mono text-zinc-500 uppercase">Analysis Complete</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Target Assessment</h2>
            <p className="text-sm text-zinc-400 font-mono">{timestamp}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-zinc-500 font-mono mb-1">INTEGRITY SCORE</div>
              <div className={`text-4xl font-bold ${getScoreColor(score)} font-mono`}>
                {score}%
              </div>
            </div>
            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
              score >= 90 ? 'border-green-500/20 bg-green-500/10' :
              score >= 70 ? 'border-yellow-500/20 bg-yellow-500/10' :
              'border-red-500/20 bg-red-500/10'
            }`}>
              <ShieldAlert className={`w-10 h-10 ${getScoreColor(score)}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          Detected Vulnerabilities
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">
            {issues.length}
          </span>
        </h3>

        {issues.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-lg border border-zinc-800 bg-black/50 p-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 w-2 h-2 rounded-full ${
                issue.severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                issue.severity === 'medium' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {issue.title}
                  </h4>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded uppercase ${
                    issue.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                    issue.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{issue.description}</p>
                {issue.line && (
                  <div className="text-xs font-mono text-zinc-600 mt-2">
                    Line {issue.line}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {issues.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/30">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
            <h4 className="text-zinc-300 font-bold mb-1">No Vulnerabilities Detected</h4>
            <p className="text-sm text-zinc-500">System integrity appears nominal.</p>
          </div>
        )}
      </div>
    </div>
  )
}
