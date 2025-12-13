import { NextRequest, NextResponse } from "next/server";
import { loadCharacter, saveCharacter } from "@/lib/character-store";
import { BatchedUpdateRequest } from "@/lib/character-types";
import { fieldByPath } from "@/lib/character-schema";
import { setByPath } from "@/lib/path-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  let body: BatchedUpdateRequest | null = null;
  try {
    body = (await request.json()) as BatchedUpdateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body.expectedVersion !== "number") {
    return NextResponse.json({ error: "expectedVersion is required" }, { status: 400 });
  }

  if (!Array.isArray(body.updates)) {
    return NextResponse.json({ error: "updates must be an array" }, { status: 400 });
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

  for (const update of body.updates) {
    if (!update || typeof update.path !== "string") continue;
    const field = fieldByPath[update.path];

    // Ignore updates for unknown fields so we only persist schema-defined data.
    if (!field) continue;

    const value = update.value;

    if (field.type === "number") {
      if (!(typeof value === "number" || value === null)) {
        return NextResponse.json(
          { error: `Invalid value for ${field.path}` },
          { status: 400 },
        );
      }
    } else if (field.type === "string") {
      if (typeof value !== "string") {
        return NextResponse.json(
          { error: `Invalid value for ${field.path}` },
          { status: 400 },
        );
      }
    } else if (field.type === "boolean") {
      if (typeof value !== "boolean") {
        return NextResponse.json(
          { error: `Invalid value for ${field.path}` },
          { status: 400 },
        );
      }
    }

    setByPath(character.data, update.path, update.value);
  }

  if (typeof body.name === "string" && body.name.trim()) {
    const name = body.name.trim();
    character.name = name;
    setByPath(character.data, "identity.characterName", name);
  }

  character.schemaVersion = 1;
  character.version += 1;
  character.updatedAt = new Date().toISOString();

  await saveCharacter(character);

  return NextResponse.json({
    version: character.version,
    updatedAt: character.updatedAt,
  });
}
