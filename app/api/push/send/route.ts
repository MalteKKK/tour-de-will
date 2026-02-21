import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import webpush from "web-push";

const VALID_PLAYERS = ["Will", "Malte", "Linda", "Nicola"];

function getWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return null;
  webpush.setVapidDetails("mailto:tour-de-will@example.com", publicKey, privateKey);
  return webpush;
}

export async function POST(request: NextRequest) {
  try {
    const wp = getWebPush();
    if (!wp) {
      return NextResponse.json({ error: "Push not configured" }, { status: 503 });
    }

    const { title, body, targetPlayers } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
    }

    const players = targetPlayers || VALID_PLAYERS;
    const results: Record<string, string> = {};

    for (const player of players) {
      const subJson = await redis.get(`push:${player}`);
      if (!subJson) {
        results[player] = "no subscription";
        continue;
      }

      const subscription = typeof subJson === "string" ? JSON.parse(subJson) : subJson;

      try {
        await wp.sendNotification(
          subscription,
          JSON.stringify({ title, body, url: "/countdown" })
        );
        results[player] = "sent";
      } catch {
        await redis.del(`push:${player}`);
        results[player] = "expired";
      }
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
