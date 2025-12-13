"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import { NumberField } from "../fields/NumberField";
import { TextField } from "../fields/TextField";
import { BooleanToggleField } from "../fields/BooleanToggleField";
import type { SectionProps } from "./types";
import { Shield } from "lucide-react";

export function ArmorHealthSurvivalSection({
  character,
  onFieldChange,
}: SectionProps) {
  const ac = getByPath(character.data, "defense.armorClass");
  const shield = getByPath(character.data, "defense.shield");

  const hpCurrent = getByPath(character.data, "hp.current");
  const hpMax = getByPath(character.data, "hp.max");
  const hpTemp = getByPath(character.data, "hp.temp");

  const hitDiceMax = getByPath(character.data, "hitDice.max");
  const hitDiceSpent = getByPath(character.data, "hitDice.spent");

  const deathSuccesses = getByPath(character.data, "deathSaves.successes");
  const deathFailures = getByPath(character.data, "deathSaves.failures");

  const heroicInspiration = getByPath(character.data, "inspiration.heroic");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Armor, Health &amp; Survival</h2>
        <Separator className="mt-1" />
      </div>
      <div className="space-y-4">
        {/* Armor */}
        <div className="space-y-1">
          <div className="flex gap-3">
            <NumberField
              label="Armor Class"
              value={typeof ac === "number" ? ac : null}
              onChange={(value) => onFieldChange("defense.armorClass", value)}
              width="sm"
            />
            <BooleanToggleField
              label="Shield"
              checked={Boolean(shield)}
              onChange={(checked) => onFieldChange("defense.shield", checked)}
              icon={<Shield />}
              hideLabel
            />
          </div>
        </div>

        {/* HP */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            HP
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <NumberField
              label="Current HP"
              value={typeof hpCurrent === "number" ? hpCurrent : null}
              onChange={(value) => onFieldChange("hp.current", value)}
              width="sm"
            />
            <NumberField
              label="Max HP"
              value={typeof hpMax === "number" ? hpMax : null}
              onChange={(value) => onFieldChange("hp.max", value)}
              width="sm"
            />
            <NumberField
              label="Temp HP"
              value={typeof hpTemp === "number" ? hpTemp : null}
              onChange={(value) => onFieldChange("hp.temp", value)}
              width="sm"
            />
          </div>
        </div>

        {/* Hit Dice */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Hit Dice
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Hit Dice Max"
              value={typeof hitDiceMax === "string" ? hitDiceMax : ""}
              onChange={(value) => onFieldChange("hitDice.max", value)}
              width="sm"
            />
            <TextField
              label="Hit Dice Spent"
              value={typeof hitDiceSpent === "string" ? hitDiceSpent : ""}
              onChange={(value) => onFieldChange("hitDice.spent", value)}
              width="sm"
            />
          </div>
        </div>

        {/* Death Saves & Heroic Inspiration */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Death Saves
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Successes"
              value={typeof deathSuccesses === "number" ? deathSuccesses : null}
              onChange={(value) => onFieldChange("deathSaves.successes", value)}
              width="xs"
            />
            <NumberField
              label="Failures"
              value={typeof deathFailures === "number" ? deathFailures : null}
              onChange={(value) => onFieldChange("deathSaves.failures", value)}
              width="xs"
            />
          </div>
          <div className="pt-1">
            <BooleanToggleField
              label="Heroic Inspiration"
              checked={Boolean(heroicInspiration)}
              onChange={(checked) =>
                onFieldChange("inspiration.heroic", checked)
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
