"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { BooleanToggleField } from "../fields/BooleanToggleField";
import { TextAreaField } from "../fields/TextAreaField";

export function ProficienciesSection({ character, onFieldChange }: SectionProps) {
  const light = Boolean(getByPath(character.data, "proficiencies.armor.light"));
  const medium = Boolean(getByPath(character.data, "proficiencies.armor.medium"));
  const heavy = Boolean(getByPath(character.data, "proficiencies.armor.heavy"));
  const shields = Boolean(getByPath(character.data, "proficiencies.armor.shields"));
  const weapons = getByPath(character.data, "proficiencies.weapons");
  const tools = getByPath(character.data, "proficiencies.tools");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Equipment Training &amp; Proficiencies</h2>
        <Separator className="mt-1" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <BooleanToggleField
          label="Light Armor Training"
          checked={light}
          onChange={(checked) => onFieldChange("proficiencies.armor.light", checked)}
        />
        <BooleanToggleField
          label="Medium Armor Training"
          checked={medium}
          onChange={(checked) => onFieldChange("proficiencies.armor.medium", checked)}
        />
        <BooleanToggleField
          label="Heavy Armor Training"
          checked={heavy}
          onChange={(checked) => onFieldChange("proficiencies.armor.heavy", checked)}
        />
        <BooleanToggleField
          label="Shields Training"
          checked={shields}
          onChange={(checked) => onFieldChange("proficiencies.armor.shields", checked)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TextAreaField
          label="Weapons"
          value={typeof weapons === "string" ? weapons : ""}
          onChange={(value) => onFieldChange("proficiencies.weapons", value)}
          rows={4}
        />
        <TextAreaField
          label="Tools"
          value={typeof tools === "string" ? tools : ""}
          onChange={(value) => onFieldChange("proficiencies.tools", value)}
          rows={4}
        />
      </div>
    </section>
  );
}

