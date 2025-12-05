// Monitoring and logging for abuse detection

interface AbuseLog {
  timestamp: Date;
  clientId: string;
  type: "rate-limit" | "invalid-content" | "injection-attempt" | "cache-hit";
  message?: string;
  details?: Record<string, string | number | boolean>;
}

const abuseLog: AbuseLog[] = [];
const MAX_LOG_SIZE = 1000;

export function logAbuse(
  clientId: string,
  type: AbuseLog["type"],
  message?: string,
  details?: Record<string, string | number | boolean>
): void {
  const log: AbuseLog = {
    timestamp: new Date(),
    clientId,
    type,
    message,
    details,
  };

  abuseLog.push(log);

  // Keep log size manageable
  if (abuseLog.length > MAX_LOG_SIZE) {
    abuseLog.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.warn("[ABUSE LOG]", log);
  }
}

export function getAbuseStats(): {
  totalLogs: number;
  byType: Record<string, number>;
  topAbusers: Array<{ clientId: string; count: number }>;
} {
  const byType: Record<string, number> = {};
  const clientCounts: Record<string, number> = {};

  abuseLog.forEach((log) => {
    byType[log.type] = (byType[log.type] || 0) + 1;
    clientCounts[log.clientId] = (clientCounts[log.clientId] || 0) + 1;
  });

  const topAbusers = Object.entries(clientCounts)
    .map(([clientId, count]) => ({ clientId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalLogs: abuseLog.length,
    byType,
    topAbusers,
  };
}

export function getRecentAbuseLog(limit: number = 50): AbuseLog[] {
  return abuseLog.slice(-limit);
}

// Clear old logs periodically (keep last 24 hours)
setInterval(() => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let i = 0;
  while (i < abuseLog.length && abuseLog[i].timestamp < oneDayAgo) {
    i++;
  }
  if (i > 0) {
    abuseLog.splice(0, i);
  }
}, 60 * 60 * 1000); // Check every hour
