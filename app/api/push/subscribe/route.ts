import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const VALID_PLAYERS = ["Will", "Malte", "Linda", "Nicola"];

export async function POST(request: NextRequest) {
  try {
    const { player, subscription } = await request.json();

    if (!VALID_PLAYERS.includes(player) || !subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Store subscription keyed by player
    await redis.set(`push:${player}`, JSON.stringify(subscription));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
