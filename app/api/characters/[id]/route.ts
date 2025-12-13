import { NextRequest, NextResponse } from "next/server";
import { deleteCharacter, loadCharacter, saveCharacter } from "@/lib/character-store";
import { RenameRequest } from "@/lib/character-types";
import { setByPath } from "@/lib/path-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const character = await loadCharacter(id);
    if (!character) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(character);
  } catch (error: any) {
    if (error instanceof Error && error.message === "Invalid character id") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    throw error;
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  let body: RenameRequest | null = null;

  try {
    body = (await request.json()) as RenameRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (typeof body.expectedVersion !== "number") {
    return NextResponse.json({ error: "expectedVersion is required" }, { status: 400 });
  }

  let character;
  try {
    character = await loadCharacter(id);
  } catch (error: any) {
    if (error instanceof Error && error.message === "Invalid character id") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    throw error;
  }

  if (!character) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (character.version !== body.expectedVersion) {
    return NextResponse.json({ error: "Version mismatch" }, { status: 409 });
  }

  const name = body.name.trim();
  character.name = name;
  setByPath(character.data, "identity.characterName", name);
  character.version += 1;
  character.updatedAt = new Date().toISOString();

  await saveCharacter(character);

  return NextResponse.json({
    id: character.id,
    name: character.name,
    version: character.version,
    updatedAt: character.updatedAt,
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await deleteCharacter(id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error instanceof Error && error.message === "Invalid character id") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    throw error;
  }
}
