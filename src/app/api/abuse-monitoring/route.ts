import { NextResponse } from "next/server";
import { getAbuseStats, getRecentAbuseLog } from "@/lib/abuseMonitoring";

// Admin-only endpoint to monitor abuse attempts
export async function GET(request: Request) {
  // Verify admin access (you should replace this with proper auth)
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_TOKEN || "dev-token";

  if (!authHeader?.includes(adminToken)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "stats") {
    return NextResponse.json(getAbuseStats());
  }

  if (action === "logs") {
    const limit = parseInt(url.searchParams.get("limit") || "50");
    return NextResponse.json({
      logs: getRecentAbuseLog(limit),
      timestamp: new Date(),
    });
  }

  return NextResponse.json({
    message: "Monitoring API for abuse prevention",
    endpoints: [
      "/api/abuse-monitoring?action=stats - Get abuse statistics",
      "/api/abuse-monitoring?action=logs&limit=50 - Get recent abuse logs",
    ],
  });
}
