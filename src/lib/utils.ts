import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with compact notation
 */
export function formatCompactNumber(num: number): string {
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
}

/**
 * Format XP with level indicator
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M XP`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K XP`;
  return `${xp} XP`;
}

/**
 * Calculate level from XP
 */
export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } {
  const baseXP = 100;
  const multiplier = 1.15;
  
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = baseXP;
  
  while (totalXP >= xpForNextLevel && level < 100) {
    xpForCurrentLevel = xpForNextLevel;
    level++;
    xpForNextLevel = Math.floor(xpForCurrentLevel + baseXP * Math.pow(multiplier, level - 1));
  }
  
  return {
    level,
    currentXP: totalXP - xpForCurrentLevel,
    xpToNextLevel: xpForNextLevel - xpForCurrentLevel,
  };
}

/**
 * Get level tier based on level number
 */
export function getLevelTier(level: number): { name: string; color: string } {
  if (level <= 10) return { name: 'Novice', color: 'bronze' };
  if (level <= 25) return { name: 'Apprentice', color: 'silver' };
  if (level <= 50) return { name: 'Practitioner', color: 'gold' };
  if (level <= 75) return { name: 'Expert', color: 'platinum' };
  return { name: 'Master', color: 'diamond' };
}

/**
 * Get ethics score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'safe';
  if (score >= 60) return 'warning';
  if (score >= 40) return 'danger';
  return 'critical';
}

/**
 * Get ethics score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Ethical';
  if (score >= 60) return 'Needs Review';
  if (score >= 40) return 'Concerning';
  return 'Critical';
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return target.toLocaleDateString();
}

/**
 * Format duration in minutes/hours
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mask sensitive data (e.g., email)
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1);
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask PII in text
 */
export function maskPII(text: string): string {
  // Email
  text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');
  // Phone
  text = text.replace(/(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE]');
  // SSN
  text = text.replace(/\d{3}-\d{2}-\d{4}/g, '[SSN]');
  // Credit Card
  text = text.replace(/\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g, '[CARD]');
  
  return text;
}

/**
 * Calculate carbon footprint
 */
export function calculateCarbonFootprint(
  scans: number,
  deepAnalyses: number,
  arFrames: number
): { grams: number; equivalent: string } {
  const CO2_PER_SCAN = 0.2;
  const CO2_PER_DEEP = 0.5;
  const CO2_PER_AR = 0.01;
  
  const grams = scans * CO2_PER_SCAN + deepAnalyses * CO2_PER_DEEP + arFrames * CO2_PER_AR;
  
  let equivalent: string;
  if (grams < 1) {
    equivalent = 'Less than a breath';
  } else if (grams < 10) {
    equivalent = 'Like charging your phone for 1 minute';
  } else if (grams < 100) {
    equivalent = 'Like driving 0.2 miles';
  } else {
    equivalent = `About ${(grams / 404).toFixed(2)} miles of driving`;
  }
  
  return { grams, equivalent };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(text: string): string {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running as PWA
 */
export function isPWA(): boolean {
  if (!isBrowser()) return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Check if device supports haptic feedback
 */
export function supportsHaptics(): boolean {
  if (!isBrowser()) return false;
  return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 */
export function hapticFeedback(pattern: number | number[] = 50): void {
  if (supportsHaptics()) {
    navigator.vibrate(pattern);
  }
}

/**
 * Check if device has camera
 */
export async function hasCamera(): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch {
    return false;
  }
}

/**
 * Check WebXR support
 */
export async function supportsWebXR(): Promise<boolean> {
  if (!isBrowser()) return false;
  if (!('xr' in navigator)) return false;
  try {
    return await (navigator as Navigator & { xr: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr.isSessionSupported('immersive-ar');
  } catch {
    return false;
  }
}

/**
 * Generate share URL
 */
export function generateShareUrl(path: string, params?: Record<string, string>): string {
  const baseUrl = isBrowser() ? window.location.origin : 'https://aurascan.ai';
  const url = new URL(path, baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  return url.toString();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Get streak multiplier based on days
 */
export function getStreakMultiplier(days: number): number {
  if (days < 7) return 1;
  if (days < 14) return 1.25;
  if (days < 30) return 1.5;
  if (days < 60) return 1.75;
  if (days < 100) return 2;
  return 2.5;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}
