export function abilityModifier(score: number | null | undefined): number | null {
  if (typeof score !== "number" || Number.isNaN(score)) return null;
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonusForLevel(
  level: number | null | undefined,
): number | null {
  if (typeof level !== "number" || Number.isNaN(level)) return null;

  const clamped = Math.max(1, Math.min(20, Math.floor(level)));
  if (clamped <= 4) return 2;
  if (clamped <= 8) return 3;
  if (clamped <= 12) return 4;
  if (clamped <= 16) return 5;
  return 6;
}

export function initiativeFromDexScore(
  dexScore: number | null | undefined,
): number | null {
  return abilityModifier(dexScore);
}

export function passivePerceptionFromPerceptionMod(
  perceptionMod: number | null | undefined,
): number {
  if (typeof perceptionMod !== "number" || Number.isNaN(perceptionMod)) return 10;
  return 10 + perceptionMod;
}

export function savingThrowValue(
  abilityScore: number | null | undefined,
  proficient: boolean,
  proficiencyBonus: number | null | undefined,
): number | null {
  const mod = abilityModifier(abilityScore);
  if (mod == null) return null;

  const pb =
    typeof proficiencyBonus === "number" && !Number.isNaN(proficiencyBonus)
      ? proficiencyBonus
      : 0;

  return mod + (proficient ? pb : 0);
}

export function skillModifierValue(
  abilityScore: number | null | undefined,
  proficient: boolean,
  proficiencyBonus: number | null | undefined,
): number | null {
  return savingThrowValue(abilityScore, proficient, proficiencyBonus);
}
