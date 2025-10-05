import crypto from 'crypto-js'

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

export function checkRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): RateLimitResult {
  const now = Date.now()
  const key = `rate_limit:${ip}`
  const stored = rateLimitStore.get(key)

  if (!stored || now > stored.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: now + windowMs
    }
  }

  if (stored.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: stored.resetTime
    }
  }

  // Increment counter
  stored.count++
  rateLimitStore.set(key, stored)

  return {
    allowed: true,
    remaining: maxAttempts - stored.count,
    resetTime: stored.resetTime
  }
}

export function generateCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function hashCode(code: string): string {
  return crypto.SHA256(code).toString()
}

export function hashToken(token: string): string {
  return crypto.SHA256(token).toString()
}

export function generateToken(): string {
  return crypto.lib.WordArray.random(32).toString()
}

export function validateDNI(dni: string): boolean {
  // DNI validation for Argentina (7-8 digits)
  const dniRegex = /^\d{7,8}$/
  return dniRegex.test(dni)
}

export function validateCode(code: string): boolean {
  // Code validation (8-10 alphanumeric characters)
  const codeRegex = /^[A-Z0-9]{8,10}$/
  return codeRegex.test(code)
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}
