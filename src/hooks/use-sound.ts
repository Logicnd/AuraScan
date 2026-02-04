'use client'

import { useRef, useCallback } from 'react'

// Sound effect URLs (using Web Audio API for simple tones)
const SOUNDS = {
  click: { frequency: 1000, duration: 0.05, type: 'sine' as OscillatorType },
  hover: { frequency: 800, duration: 0.03, type: 'sine' as OscillatorType },
  success: { frequencies: [523.25, 659.25, 783.99], duration: 0.15, type: 'sine' as OscillatorType },
  error: { frequencies: [200, 150], duration: 0.2, type: 'square' as OscillatorType },
  notification: { frequencies: [880, 1108.73], duration: 0.1, type: 'sine' as OscillatorType },
  levelUp: { frequencies: [523.25, 659.25, 783.99, 1046.50], duration: 0.2, type: 'sine' as OscillatorType },
  scan: { frequency: 2000, duration: 0.5, type: 'sawtooth' as OscillatorType, sweep: true },
  glitch: { frequency: 100, duration: 0.1, type: 'square' as OscillatorType, noise: true },
  boot: { frequencies: [200, 400, 600, 800, 1000], duration: 0.1, type: 'sine' as OscillatorType },
  beep: { frequency: 1200, duration: 0.08, type: 'sine' as OscillatorType }
}

type SoundName = keyof typeof SOUNDS

interface UseSoundOptions {
  volume?: number
  enabled?: boolean
}

export function useSound(options: UseSoundOptions = {}) {
  const { volume = 0.3, enabled = true } = options
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextCtor) return null
      audioContextRef.current = new AudioContextCtor()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType,
    customVolume?: number
  ) => {
    if (!enabled) return

    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

      const vol = customVolume ?? volume
      gainNode.gain.setValueAtTime(vol, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch {
      // Audio context not available
    }
  }, [enabled, volume, getAudioContext])

  const playSequence = useCallback((
    frequencies: number[],
    duration: number,
    type: OscillatorType
  ) => {
    if (!enabled) return

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, duration, type)
      }, i * duration * 1000 * 0.8)
    })
  }, [enabled, playTone])

  const playSweep = useCallback((
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType
  ) => {
    if (!enabled) return

    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration)

      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch {
      // Audio context not available
    }
  }, [enabled, volume, getAudioContext])

  const play = useCallback((soundName: SoundName) => {
    if (!enabled) return

    const sound = SOUNDS[soundName]

    if ('frequencies' in sound) {
      playSequence(sound.frequencies, sound.duration, sound.type)
    } else if ('sweep' in sound && sound.sweep) {
      playSweep(sound.frequency, sound.frequency / 4, sound.duration, sound.type)
    } else {
      playTone(sound.frequency, sound.duration, sound.type)
    }
  }, [enabled, playTone, playSequence, playSweep])

  const playCustom = useCallback((
    frequency: number,
    duration: number = 0.1,
    type: OscillatorType = 'sine'
  ) => {
    playTone(frequency, duration, type)
  }, [playTone])

  return {
    play,
    playCustom,
    playTone,
    playSequence,
    playSweep
  }
}

// Hook for adding sound effects to events
export function useSoundEffect(soundName: SoundName, options?: UseSoundOptions) {
  const { play } = useSound(options)

  const trigger = useCallback(() => {
    play(soundName)
  }, [play, soundName])

  return trigger
}

// Hook for click sounds
export function useClickSound(options?: UseSoundOptions) {
  return useSoundEffect('click', options)
}

// Hook for hover sounds
export function useHoverSound(options?: UseSoundOptions) {
  return useSoundEffect('hover', options)
}
