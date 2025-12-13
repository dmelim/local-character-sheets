import { promises as fs } from "fs";
import path from "path";
import { Character, CharacterListItem } from "./character-types";
import { setByPath } from "./path-utils";

const DATA_DIR = path.join(process.cwd(), "data", "characters");

async function ensureCharactersDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function isValidId(id: string): boolean {
  // UUID-ish and path safe: no path separators, no traversal.
  return /^[a-zA-Z0-9-]+$/.test(id);
}

function getCharacterPath(id: string): string {
  if (!isValidId(id)) {
    throw new Error("Invalid character id");
  }
  return path.join(DATA_DIR, `${id}.json`);
}

export async function listCharacters(): Promise<CharacterListItem[]> {
  await ensureCharactersDir();
  const entries = await fs.readdir(DATA_DIR);
  const items: CharacterListItem[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    const fullPath = path.join(DATA_DIR, entry);
    try {
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = JSON.parse(raw) as Character;
      if (!parsed.id || !parsed.name || !parsed.updatedAt) continue;
      items.push({
        id: parsed.id,
        name: parsed.name,
        updatedAt: parsed.updatedAt,
        version: parsed.version ?? 1,
      });
    } catch {
      // Ignore invalid files
      continue;
    }
  }

  items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  return items;
}

export async function loadCharacter(id: string): Promise<Character | null> {
  await ensureCharactersDir();
  const filePath = getCharacterPath(id);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Character;
    return parsed;
  } catch (error: any) {
    if (error && (error.code === "ENOENT" || error.code === "ENOTDIR")) {
      return null;
    }
    throw error;
  }
}

async function atomicWriteCharacter(id: string, character: Character): Promise<void> {
  await ensureCharactersDir();
  const targetPath = getCharacterPath(id);
  const tempPath = `${targetPath}.tmp-${Math.random().toString(36).slice(2)}`;
  const data = JSON.stringify(character, null, 2);
  await fs.writeFile(tempPath, data, "utf8");
  await fs.rename(tempPath, targetPath);
}

export async function saveCharacter(character: Character): Promise<void> {
  if (!character.id) {
    throw new Error("Character must have an id");
  }
  await atomicWriteCharacter(character.id, character);
}

export async function deleteCharacter(id: string): Promise<void> {
  await ensureCharactersDir();
  const filePath = getCharacterPath(id);
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    if (error && error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}

export async function createCharacter(name: string, id: string): Promise<Character> {
  const now = new Date().toISOString();
  const character: Character = {
    schemaVersion: 1,
    id,
    name,
    createdAt: now,
    updatedAt: now,
    version: 1,
    data: {},
  };

  // Ensure name is mirrored in data.identity.characterName
  setByPath(character.data, "identity.characterName", name);

  await saveCharacter(character);
  return character;
}

