/**
 * Security utility functions for input sanitization and validation
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  return withoutTags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate and sanitize calendar event data
 */
export const sanitizeEventData = (eventData: any) => {
  return {
    title: sanitizeInput(eventData.title || ''),
    description: sanitizeInput(eventData.description || ''),
    location: sanitizeInput(eventData.location || ''),
    startDate: validateDate(eventData.startDate),
    endDate: validateDate(eventData.endDate)
  };
};

/**
 * Validate date input
 */
export const validateDate = (date: any): Date | null => {
  if (!date) return null;
  
  const parsedDate = new Date(date);
  
  // Check if date is valid
  if (isNaN(parsedDate.getTime())) {
    return null;
  }
  
  // Prevent dates too far in the past or future (10 years range)
  const now = new Date();
  const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
  const tenYearsFromNow = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
  
  if (parsedDate < tenYearsAgo || parsedDate > tenYearsFromNow) {
    return null;
  }
  
  return parsedDate;
};

/**
 * Rate limiting helper
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const apiRateLimiter = new RateLimiter(30, 60000); // 30 requests per minute