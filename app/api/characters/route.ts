import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { listCharacters, createCharacter } from "@/lib/character-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await listCharacters();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 },
    );
  }

  const name = body.name.trim();
  const id = crypto.randomUUID();

  const character = await createCharacter(name, id);

  return NextResponse.json({ id: character.id });
}

