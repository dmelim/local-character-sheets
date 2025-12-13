"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextField } from "../fields/TextField";
import { NumberField } from "../fields/NumberField";

export function SpellcastingSummarySection({ character, onFieldChange }: SectionProps) {
  const ability = getByPath(character.data, "spellcasting.ability");
  const modifier = getByPath(character.data, "spellcasting.modifier");
  const saveDc = getByPath(character.data, "spellcasting.saveDc");
  const attackBonus = getByPath(character.data, "spellcasting.attackBonus");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Spellcasting Summary</h2>
        <Separator className="mt-1" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <TextField
          label="Spellcasting Ability"
          value={typeof ability === "string" ? ability : ""}
          onChange={(value) => onFieldChange("spellcasting.ability", value)}
          width="md"
        />
        <NumberField
          label="Spellcasting Modifier"
          value={typeof modifier === "number" ? modifier : null}
          onChange={(value) => onFieldChange("spellcasting.modifier", value)}
          width="sm"
        />
        <NumberField
          label="Spell Save DC"
          value={typeof saveDc === "number" ? saveDc : null}
          onChange={(value) => onFieldChange("spellcasting.saveDc", value)}
          width="sm"
        />
        <NumberField
          label="Spell Attack Bonus"
          value={typeof attackBonus === "number" ? attackBonus : null}
          onChange={(value) => onFieldChange("spellcasting.attackBonus", value)}
          width="sm"
        />
      </div>
    </section>
  );
}

