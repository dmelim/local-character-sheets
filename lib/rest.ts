import { getByPath } from "@/lib/path-utils";
import type { CharacterUpdate } from "@/lib/character-types";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseOptionalNumber(value: unknown): number | null {
  if (isFiniteNumber(value)) return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function hasObjectAtPath(
  data: Record<string, unknown>,
  path: string,
): boolean {
  const value = getByPath(data, path);
  return typeof value === "object" && value !== null;
}

export function buildLongRestUpdates(
  data: Record<string, unknown>,
): CharacterUpdate[] {
  const updates: CharacterUpdate[] = [];

  // HP: current -> max (if max is a number), temp -> 0 (if hp exists)
  if (hasObjectAtPath(data, "hp")) {
    const hpMaxRaw = getByPath(data, "hp.max");
    if (isFiniteNumber(hpMaxRaw)) {
      updates.push({ path: "hp.current", value: hpMaxRaw });
    }
    updates.push({ path: "hp.temp", value: 0 });
  }

  // Death Saves: reset to 0 (if deathSaves exists)
  if (hasObjectAtPath(data, "deathSaves")) {
    updates.push({ path: "deathSaves.successes", value: 0 });
    updates.push({ path: "deathSaves.failures", value: 0 });
  }

  // Spell Slots: expended -> 0 for levels that exist
  if (hasObjectAtPath(data, "spellSlots")) {
    for (let level = 1; level <= 9; level += 1) {
      const levelPath = `spellSlots.level${level}`;
      if (!hasObjectAtPath(data, levelPath)) continue;
      updates.push({ path: `${levelPath}.expended`, value: 0 });
    }
  }

  // Hit Dice: regain half of max (min 1) by reducing spent
  if (hasObjectAtPath(data, "hitDice")) {
    const maxRaw = getByPath(data, "hitDice.max");
    const spentRaw = getByPath(data, "hitDice.spent");

    const max = parseOptionalNumber(maxRaw);
    const spent = parseOptionalNumber(spentRaw);
    if (max != null && spent != null) {
      const regain = Math.max(1, Math.floor(max / 2));
      const newSpent = Math.max(0, Math.floor(spent) - regain);
      const nextValue = typeof spentRaw === "string" ? String(newSpent) : newSpent;
      updates.push({ path: "hitDice.spent", value: nextValue });
    }
  }

  return updates;
}

