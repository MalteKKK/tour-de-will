import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const VALID_PLAYERS = ["Will", "Malte", "Linda", "Nicola"];
const VALID_GAMES = ["bike-runner", "reaktion"];

export async function GET() {
  try {
    const result: Record<string, Record<string, number>> = {};
    for (const game of VALID_GAMES) {
      const scores = await redis.hgetall<Record<string, number>>(`scores:${game}`);
      result[game] = scores || {};
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { player, game, score } = await request.json();

    if (!VALID_PLAYERS.includes(player) || !VALID_GAMES.includes(game) || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const current = await redis.hget<number>(`scores:${game}`, player);
    if (current === null || score > current) {
      await redis.hset(`scores:${game}`, { [player]: score });
    }

    const allScores = await redis.hgetall<Record<string, number>>(`scores:${game}`);
    return NextResponse.json(allScores || {});
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
