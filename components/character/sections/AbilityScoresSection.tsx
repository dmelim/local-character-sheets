"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import {
  abilityModifier,
  initiativeFromDexScore,
  passivePerceptionFromPerceptionMod,
  proficiencyBonusForLevel,
  skillModifierValue,
} from "@/lib/derived-stats";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { NumberField } from "../fields/NumberField";
import { ModifierBadge } from "../fields/ModifierBadge";
import { TextField } from "../fields/TextField";
import { DerivedStat } from "../fields/DerivedStat";

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;

export function AbilityScoresSection({
  character,
  onFieldChange,
}: SectionProps) {
  const level = getByPath(character.data, "identity.level");
  const dexScore = getByPath(character.data, "abilities.dex.score");
  const wisScore = getByPath(character.data, "abilities.wis.score");
  const perceptionProficient = Boolean(
    getByPath(character.data, "skills.perception.proficient")
  );

  const proficiencyBonus = proficiencyBonusForLevel(
    typeof level === "number" ? level : null
  );
  const derivedInitiative = initiativeFromDexScore(
    typeof dexScore === "number" ? dexScore : null
  );
  const initiativeDisplay =
    typeof derivedInitiative === "number"
      ? derivedInitiative >= 0
        ? `d20 + ${derivedInitiative}`
        : `d20 - ${Math.abs(derivedInitiative)}`
      : "d20 + ?";

  const derivedPerceptionSkill = skillModifierValue(
    typeof wisScore === "number" ? wisScore : null,
    perceptionProficient,
    proficiencyBonus
  );
  const derivedPassivePerception = passivePerceptionFromPerceptionMod(
    derivedPerceptionSkill
  );

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Ability Scores</h2>
        <Separator className="mt-1" />
      </div>

      <div className="flex items-center gap-30 justify-center">
        <DerivedStat
          label="Proficiency"
          value={proficiencyBonus}
          tooltip="Derived from Level (1–4:+2, 5–8:+3, 9–12:+4, 13–16:+5, 17–20:+6)"
          width="xs"
        />

        <DerivedStat
          label="Initiative"
          value={initiativeDisplay}
          tooltip="Initiative modifier = DEX modifier (roll d20 + this in play)"
          width="xs"
        />

        <DerivedStat
          label="Passive Perception"
          value={derivedPassivePerception}
          tooltip="Passive Perception = 10 + Perception modifier"
          width="sm"
        />
      </div>

      {/* Ability grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ABILITIES.map((key) => {
          const scorePath = `abilities.${key}.score`;
          const scoreRaw = getByPath(character.data, scorePath);
          const score = typeof scoreRaw === "number" ? scoreRaw : null;
          const modifier = abilityModifier(score);

          const labelMap: Record<(typeof ABILITIES)[number], string> = {
            str: "STR",
            dex: "DEX",
            con: "CON",
            int: "INT",
            wis: "WIS",
            cha: "CHA",
          };

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <div className="flex-1">
                <NumberField
                  label={`${labelMap[key]} Score`}
                  value={score}
                  onChange={(value) => onFieldChange(scorePath, value)}
                  width="xs"
                  min={1}
                  max={30}
                />
              </div>
              <ModifierBadge value={modifier} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
