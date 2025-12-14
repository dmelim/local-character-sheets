"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { abilityModifier, proficiencyBonusForLevel } from "@/lib/derived-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./types";
import { DerivedStat } from "../fields/DerivedStat";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

const ABILITY_OPTIONS: Array<{ key: AbilityKey; label: string }> = [
  { key: "str", label: "Strength" },
  { key: "dex", label: "Dexterity" },
  { key: "con", label: "Constitution" },
  { key: "int", label: "Intelligence" },
  { key: "wis", label: "Wisdom" },
  { key: "cha", label: "Charisma" },
];

function normalizeSpellcastingAbilityKey(raw: unknown): AbilityKey | null {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().toLowerCase();

  if (normalized === "strength" || normalized === "str") return "str";
  if (normalized === "dexterity" || normalized === "dex") return "dex";
  if (normalized === "constitution" || normalized === "con") return "con";
  if (normalized === "intelligence" || normalized === "int") return "int";
  if (normalized === "wisdom" || normalized === "wis") return "wis";
  if (normalized === "charisma" || normalized === "cha") return "cha";
  return null;
}

export function SpellcastingSummarySection({ character, onFieldChange }: SectionProps) {
  const abilityRaw = getByPath(character.data, "spellcasting.ability");
  const storedAbility = typeof abilityRaw === "string" ? abilityRaw : "";

  const normalizedKey = normalizeSpellcastingAbilityKey(storedAbility);
  const selectedLabel =
    ABILITY_OPTIONS.find((opt) => opt.label === storedAbility)?.label ??
    (normalizedKey
      ? ABILITY_OPTIONS.find((opt) => opt.key === normalizedKey)?.label ?? ""
      : "");

  const levelRaw = getByPath(character.data, "identity.level");
  const level = typeof levelRaw === "number" ? levelRaw : null;
  const proficiencyBonus = proficiencyBonusForLevel(level);

  const abilityScoreRaw = normalizedKey
    ? getByPath(character.data, `abilities.${normalizedKey}.score`)
    : null;
  const abilityScore = typeof abilityScoreRaw === "number" ? abilityScoreRaw : null;

  const spellcastingMod = abilityModifier(abilityScore);
  const spellSaveDc =
    typeof proficiencyBonus === "number" && typeof spellcastingMod === "number"
      ? 8 + proficiencyBonus + spellcastingMod
      : null;
  const spellAttackBonus =
    typeof proficiencyBonus === "number" && typeof spellcastingMod === "number"
      ? proficiencyBonus + spellcastingMod
      : null;

  return (
    <section className="space-y-3">
      <Card className="py-4">
        <CardHeader className="px-4 pb-2">
          <CardTitle className="text-base">Spellcasting</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-4">
          <div className="space-y-1">
            <Label htmlFor="spellcasting-ability">Spellcasting Ability</Label>
            <select
              id="spellcasting-ability"
              value={selectedLabel}
              onChange={(e) => onFieldChange("spellcasting.ability", e.target.value)}
              className={cn(
                "border-input placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              )}
            >
              <option value="" disabled>
                Select ability...
              </option>
              {ABILITY_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <DerivedStat
              label="Spellcasting Modifier"
              value={spellcastingMod}
              tooltip="Spellcasting modifier = ability modifier"
              width="xs"
            />
            <DerivedStat
              label="Spell Save DC"
              value={typeof spellSaveDc === "number" ? String(spellSaveDc) : ""}
              tooltip="Spell Save DC = 8 + proficiency bonus + spellcasting modifier"
              width="xs"
            />
            <DerivedStat
              label="Spell Attack Bonus"
              value={spellAttackBonus}
              tooltip="Spell attack bonus = proficiency bonus + spellcasting modifier"
              width="xs"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
