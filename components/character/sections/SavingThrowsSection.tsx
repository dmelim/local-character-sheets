"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { BooleanToggleField } from "../fields/BooleanToggleField";
import { NumberField } from "../fields/NumberField";

export function SavingThrowsSection({ character, onFieldChange }: SectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Saving Throws</h2>
        <Separator className="mt-1" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <BooleanToggleField
            label="STR Save Proficient"
            checked={Boolean(getByPath(character.data, "saves.str.proficient"))}
            onChange={(checked) => onFieldChange("saves.str.proficient", checked)}
          />
          <NumberField
            label="STR Save"
            value={
              typeof getByPath(character.data, "saves.str.value") === "number"
                ? (getByPath(character.data, "saves.str.value") as number)
                : null
            }
            onChange={(value) => onFieldChange("saves.str.value", value)}
            width="xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BooleanToggleField
            label="DEX Save Proficient"
            checked={Boolean(getByPath(character.data, "saves.dex.proficient"))}
            onChange={(checked) => onFieldChange("saves.dex.proficient", checked)}
          />
          <NumberField
            label="DEX Save"
            value={
              typeof getByPath(character.data, "saves.dex.value") === "number"
                ? (getByPath(character.data, "saves.dex.value") as number)
                : null
            }
            onChange={(value) => onFieldChange("saves.dex.value", value)}
            width="xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BooleanToggleField
            label="CON Save Proficient"
            checked={Boolean(getByPath(character.data, "saves.con.proficient"))}
            onChange={(checked) => onFieldChange("saves.con.proficient", checked)}
          />
          <NumberField
            label="CON Save"
            value={
              typeof getByPath(character.data, "saves.con.value") === "number"
                ? (getByPath(character.data, "saves.con.value") as number)
                : null
            }
            onChange={(value) => onFieldChange("saves.con.value", value)}
            width="xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BooleanToggleField
            label="INT Save Proficient"
            checked={Boolean(getByPath(character.data, "saves.int.proficient"))}
            onChange={(checked) => onFieldChange("saves.int.proficient", checked)}
          />
          <NumberField
            label="INT Save"
            value={
              typeof getByPath(character.data, "saves.int.value") === "number"
                ? (getByPath(character.data, "saves.int.value") as number)
                : null
            }
            onChange={(value) => onFieldChange("saves.int.value", value)}
            width="xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BooleanToggleField
            label="WIS Save Proficient"
            checked={Boolean(getByPath(character.data, "saves.wis.proficient"))}
            onChange={(checked) => onFieldChange("saves.wis.proficient", checked)}
          />
          <NumberField
            label="WIS Save"
            value={
              typeof getByPath(character.data, "saves.wis.value") === "number"
                ? (getByPath(character.data, "saves.wis.value") as number)
                : null
            }
            onChange={(value) => onFieldChange("saves.wis.value", value)}
            width="xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BooleanToggleField
            label="CHA Save Proficient"
            checked={Boolean(getByPath(character.data, "saves.cha.proficient"))}
            onChange={(checked) => onFieldChange("saves.cha.proficient", checked)}
          />
          <NumberField
            label="CHA Save"
            value={
              typeof getByPath(character.data, "saves.cha.value") === "number"
                ? (getByPath(character.data, "saves.cha.value") as number)
                : null
            }
            onChange={(value) => onFieldChange("saves.cha.value", value)}
            width="xs"
          />
        </div>
      </div>
    </section>
  );
}

