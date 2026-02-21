import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const VALID_PLAYERS = ["Will", "Malte", "Linda", "Nicola"];

export async function GET() {
  try {
    const result: Record<string, string[]> = {};
    for (const player of VALID_PLAYERS) {
      const achievements = await redis.smembers(`achievements:${player}`);
      if (achievements.length > 0) {
        result[player] = achievements;
      }
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { player, achievementId } = await request.json();

    if (!VALID_PLAYERS.includes(player) || typeof achievementId !== "string") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await redis.sadd(`achievements:${player}`, achievementId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
