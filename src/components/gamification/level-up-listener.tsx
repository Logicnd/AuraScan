'use client'

import { useEffect, useState, useRef } from 'react'
import { useGamification } from '@/lib/store/gamification'
import { LevelUpModal } from './level-up-modal'

export function LevelUpListener() {
  const { level, title } = useGamification()
  const [showModal, setShowModal] = useState(false)
  const prevLevelRef = useRef(level)
  const isMounted = useRef(false)

  useEffect(() => {
    // Skip the first render to avoid showing modal on page reload
    if (!isMounted.current) {
      isMounted.current = true
      prevLevelRef.current = level
      return
    }

    // Check if level has increased
    if (level > prevLevelRef.current) {
      setShowModal(true)
      // Play sound effect here if implemented
    }
    
    prevLevelRef.current = level
  }, [level, title])

  return (
    <LevelUpModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
      level={level}
      title={title}
    />
  )
}
