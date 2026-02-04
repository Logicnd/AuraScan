'use client'

import { useEffect, useRef, useState, RefObject } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return [ref, isVisible]
}

interface UseParallaxOptions {
  speed?: number
  direction?: 'up' | 'down'
}

export function useParallax<T extends HTMLElement>(
  options: UseParallaxOptions = {}
): [RefObject<T>, number] {
  const { speed = 0.5, direction = 'up' } = options
  const ref = useRef<T>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - windowHeight / 2

      const multiplier = direction === 'up' ? -1 : 1
      setOffset(distanceFromCenter * speed * multiplier)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return [ref, offset]
}

interface UseTypingEffectOptions {
  speed?: number
  delay?: number
  loop?: boolean
}

export function useTypingEffect(
  text: string,
  options: UseTypingEffectOptions = {}
): [string, boolean] {
  const { speed = 50, delay = 0, loop = false } = options
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const startTyping = () => {
      setIsTyping(true)
      let index = 0

      const type = () => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index))
          index++
          timeout = setTimeout(type, speed + Math.random() * 30)
        } else {
          setIsTyping(false)
          if (loop) {
            timeout = setTimeout(() => {
              setDisplayedText('')
              startTyping()
            }, delay * 2)
          }
        }
      }

      timeout = setTimeout(type, delay)
    }

    startTyping()
    return () => clearTimeout(timeout)
  }, [text, speed, delay, loop])

  return [displayedText, isTyping]
}

interface UseCountUpOptions {
  duration?: number
  delay?: number
  decimals?: number
}

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
): number {
  const { duration = 2000, delay = 0, decimals = 0 } = options
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationId: number

    const startAnimation = () => {
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = easeOutQuart * end

        setCount(Number(currentCount.toFixed(decimals)))

        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    const timeout = setTimeout(startAnimation, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(animationId)
    }
  }, [end, duration, delay, decimals])

  return count
}

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

export function useHover<T extends HTMLElement>(): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return [ref, isHovered]
}

export function useGlitch(duration: number = 200): [boolean, () => void] {
  const [isGlitching, setIsGlitching] = useState(false)

  const triggerGlitch = () => {
    setIsGlitching(true)
    setTimeout(() => setIsGlitching(false), duration)
  }

  return [isGlitching, triggerGlitch]
}
