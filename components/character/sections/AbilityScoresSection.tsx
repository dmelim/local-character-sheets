"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import {
  abilityModifier,
  initiativeFromDexScore,
  passivePerceptionFromPerceptionMod,
  proficiencyBonusForLevel,
} from "@/lib/derived-stats";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { NumberField } from "../fields/NumberField";
import { ModifierBadge } from "../fields/ModifierBadge";
import { TextField } from "../fields/TextField";

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;

export function AbilityScoresSection({
  character,
  onFieldChange,
}: SectionProps) {
  const level = getByPath(character.data, "identity.level");
  const dexScore = getByPath(character.data, "abilities.dex.score");
  const perceptionMod = getByPath(character.data, "skills.perception.value");

  const proficiencyBonus = proficiencyBonusForLevel(
    typeof level === "number" ? level : null,
  );
  const derivedInitiative = initiativeFromDexScore(
    typeof dexScore === "number" ? dexScore : null,
  );
  const derivedPassivePerception = passivePerceptionFromPerceptionMod(
    typeof perceptionMod === "number" ? perceptionMod : null,
  );

  const speed = getByPath(character.data, "core.speed");
  const size = getByPath(character.data, "core.size");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Ability Scores</h2>
        <Separator className="mt-1" />
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <NumberField
          label="Proficiency Bonus"
          value={proficiencyBonus}
          disabled
          width="sm"
        />
        <NumberField
          label="Initiative"
          value={derivedInitiative}
          disabled
          width="sm"
        />
        <NumberField
          label="Speed"
          value={typeof speed === "number" ? speed : null}
          onChange={(value) => onFieldChange("core.speed", value)}
          width="sm"
        />
        <TextField
          label="Size"
          value={typeof size === "string" ? size : ""}
          onChange={(value) => onFieldChange("core.size", value)}
          width="xs"
        />
        <NumberField
          label="Passive Perception"
          value={derivedPassivePerception}
          disabled
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
