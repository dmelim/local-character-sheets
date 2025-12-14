"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import { TextField } from "../fields/TextField";
import { NumberField } from "../fields/NumberField";
import type { SectionProps } from "./types";
import { BooleanToggleField } from "../fields/BooleanToggleField";

export function IdentitySection({ character, onFieldChange }: SectionProps) {
  const name = getByPath(character.data, "identity.characterName");
  const charClass = getByPath(character.data, "identity.class");
  const subclass = getByPath(character.data, "identity.subclass");
  const species = getByPath(character.data, "identity.species");
  const background = getByPath(character.data, "identity.background");
  const level = getByPath(character.data, "identity.level");
  const xp = getByPath(character.data, "identity.xp");

  const heroicInspiration = getByPath(character.data, "inspiration.heroic");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Identity</h2>
        <Separator className="mt-1" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            label="Character Name"
            value={typeof name === "string" ? name : ""}
            onChange={(value) => onFieldChange("identity.characterName", value)}
            width="full"
          />
        </div>
        <TextField
          label="Class"
          value={typeof charClass === "string" ? charClass : ""}
          onChange={(value) => onFieldChange("identity.class", value)}
          width="md"
        />
        <TextField
          label="Subclass"
          value={typeof subclass === "string" ? subclass : ""}
          onChange={(value) => onFieldChange("identity.subclass", value)}
          width="md"
        />
        <TextField
          label="Species"
          value={typeof species === "string" ? species : ""}
          onChange={(value) => onFieldChange("identity.species", value)}
          width="md"
        />
        <TextField
          label="Background"
          value={typeof background === "string" ? background : ""}
          onChange={(value) => onFieldChange("identity.background", value)}
          width="md"
        />
        <NumberField
          label="Level"
          value={typeof level === "number" ? level : null}
          onChange={(value) => onFieldChange("identity.level", value)}
          width="xs"
          min={1}
          max={20}
        />
        <NumberField
          label="XP"
          value={typeof xp === "number" ? xp : null}
          onChange={(value) => onFieldChange("identity.xp", value)}
          width="sm"
        />

        <BooleanToggleField
          label="Heroic Inspiration"
          checked={Boolean(heroicInspiration)}
          onChange={(checked) => onFieldChange("inspiration.heroic", checked)}
        />
      </div>
    </section>
  );
}
