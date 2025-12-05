// Rate limiting and abuse prevention for chat API
import { logAbuse } from "./abuseMonitoring";

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const messageCache = new Map<string, { response: string; timestamp: number }>();

const RATE_LIMIT = {
  maxRequests: 10, // max 10 requests
  windowMs: 60000, // per minute
  maxMessageLength: 500, // max 500 chars per message
  cacheExpiry: 300000, // cache expires after 5 minutes
  minTimeBetweenRequests: 500, // min 500ms between requests
};

export function checkRateLimit(clientId: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const userLimit = requestCounts.get(clientId);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return { allowed: true };
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    const remainingTime = Math.ceil((userLimit.resetTime - now) / 1000);
    logAbuse(clientId, "rate-limit", `Exceeded ${RATE_LIMIT.maxRequests} requests per minute`, {
      attemptedCount: userLimit.count,
      remaining: remainingTime,
    });
    return {
      allowed: false,
      message: `⏳ Trop de requêtes. Réessayez dans ${remainingTime} secondes.`,
    };
  }

  userLimit.count++;
  return { allowed: true };
}

export function validateMessageContent(message: string): { valid: boolean; reason?: string } {
  // Check message length
  if (message.length > RATE_LIMIT.maxMessageLength) {
    return {
      valid: false,
      reason: `Message trop long (max ${RATE_LIMIT.maxMessageLength} caractères)`,
    };
  }

  // Check for empty message
  if (!message.trim()) {
    return { valid: false, reason: "Le message ne peut pas être vide" };
  }

  // Check for suspicious patterns (repeated characters, spam patterns)
  const repeatedChars = /(.)\1{9,}/;
  if (repeatedChars.test(message)) {
    logAbuse("unknown", "invalid-content", "Detected repeated characters pattern");
    return { valid: false, reason: "Message invalide détecté" };
  }

  // Check for SQL injection attempts
  const sqlPatterns =
    /('|(--)|;|(\*)|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter)/i;
  if (sqlPatterns.test(message)) {
    logAbuse("unknown", "injection-attempt", "SQL injection pattern detected");
    return { valid: false, reason: "Contenu invalide détecté" };
  }

  // Check for prompt injection attempts
  const injectionPatterns =
    /(ignore|forget|system prompt|forget everything|jailbreak|bypass|override)/i;
  if (injectionPatterns.test(message)) {
    logAbuse("unknown", "injection-attempt", "Prompt injection pattern detected");
    return {
      valid: false,
      reason: "Message non autorisé - tentative de contournement détectée",
    };
  }

  return { valid: true };
}

export function getCachedResponse(
  cacheKey: string
): { cached: boolean; response?: string } {
  const cached = messageCache.get(cacheKey);

  if (!cached) {
    return { cached: false };
  }

  if (Date.now() - cached.timestamp > RATE_LIMIT.cacheExpiry) {
    messageCache.delete(cacheKey);
    return { cached: false };
  }

  return { cached: true, response: cached.response };
}

export function cacheResponse(cacheKey: string, response: string): void {
  messageCache.set(cacheKey, { response, timestamp: Date.now() });
}

export function getClientId(request: Request): string {
  // Get IP from headers (works with proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

  // Get or create session ID from request
  const sessionCookie = request.headers.get("cookie")?.match(/sessionId=([^;]*)/)?.[1];
  const sessionId = sessionCookie || `session-${Date.now()}`;

  return `${ip}:${sessionId}`;
}

export function createCacheKey(
  message: string,
  missionId?: string,
  stepId?: string
): string {
  // Simple hash using built-in methods
  let hash = 0;
  const str = `${message}:${missionId}:${stepId}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `cache-${Math.abs(hash)}`;
}

// Cleanup old cache entries periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  messageCache.forEach((value, key) => {
    if (now - value.timestamp > RATE_LIMIT.cacheExpiry) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => messageCache.delete(key));
}, RATE_LIMIT.cacheExpiry);
