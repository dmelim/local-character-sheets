"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import {
  proficiencyBonusForLevel,
  savingThrowValue,
} from "@/lib/derived-stats";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { BooleanToggleField } from "../fields/BooleanToggleField";
import { TextField } from "../fields/TextField";

export function SavingThrowsSection({ character, onFieldChange }: SectionProps) {
  const levelRaw = getByPath(character.data, "identity.level");
  const level = typeof levelRaw === "number" ? levelRaw : null;
  const proficiencyBonus = proficiencyBonusForLevel(level);

  const formatSigned = (value: number | null) => {
    if (typeof value !== "number") return "?";
    return value >= 0 ? `+${value}` : `${value}`;
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Saving Throws</h2>
        <Separator className="mt-1" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const proficient = Boolean(
              getByPath(character.data, "saves.str.proficient"),
            );
            const abilityScore = getByPath(character.data, "abilities.str.score");
            const derived = savingThrowValue(
              typeof abilityScore === "number" ? abilityScore : null,
              proficient,
              proficiencyBonus,
            );
            return (
              <>
          <BooleanToggleField
            label="STR Save Proficient"
            checked={proficient}
            onChange={(checked) => onFieldChange("saves.str.proficient", checked)}
          />
          <TextField
            label="STR Save"
            value={formatSigned(derived)}
            width="sm"
            disabled
            className="text-center tabular-nums font-medium"
          />
              </>
            );
          })()}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const proficient = Boolean(
              getByPath(character.data, "saves.dex.proficient"),
            );
            const abilityScore = getByPath(character.data, "abilities.dex.score");
            const derived = savingThrowValue(
              typeof abilityScore === "number" ? abilityScore : null,
              proficient,
              proficiencyBonus,
            );
            return (
              <>
          <BooleanToggleField
            label="DEX Save Proficient"
            checked={proficient}
            onChange={(checked) => onFieldChange("saves.dex.proficient", checked)}
          />
          <TextField
            label="DEX Save"
            value={formatSigned(derived)}
            width="sm"
            disabled
            className="text-center tabular-nums font-medium"
          />
              </>
            );
          })()}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const proficient = Boolean(
              getByPath(character.data, "saves.con.proficient"),
            );
            const abilityScore = getByPath(character.data, "abilities.con.score");
            const derived = savingThrowValue(
              typeof abilityScore === "number" ? abilityScore : null,
              proficient,
              proficiencyBonus,
            );
            return (
              <>
          <BooleanToggleField
            label="CON Save Proficient"
            checked={proficient}
            onChange={(checked) => onFieldChange("saves.con.proficient", checked)}
          />
          <TextField
            label="CON Save"
            value={formatSigned(derived)}
            width="sm"
            disabled
            className="text-center tabular-nums font-medium"
          />
              </>
            );
          })()}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const proficient = Boolean(
              getByPath(character.data, "saves.int.proficient"),
            );
            const abilityScore = getByPath(character.data, "abilities.int.score");
            const derived = savingThrowValue(
              typeof abilityScore === "number" ? abilityScore : null,
              proficient,
              proficiencyBonus,
            );
            return (
              <>
          <BooleanToggleField
            label="INT Save Proficient"
            checked={proficient}
            onChange={(checked) => onFieldChange("saves.int.proficient", checked)}
          />
          <TextField
            label="INT Save"
            value={formatSigned(derived)}
            width="sm"
            disabled
            className="text-center tabular-nums font-medium"
          />
              </>
            );
          })()}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const proficient = Boolean(
              getByPath(character.data, "saves.wis.proficient"),
            );
            const abilityScore = getByPath(character.data, "abilities.wis.score");
            const derived = savingThrowValue(
              typeof abilityScore === "number" ? abilityScore : null,
              proficient,
              proficiencyBonus,
            );
            return (
              <>
          <BooleanToggleField
            label="WIS Save Proficient"
            checked={proficient}
            onChange={(checked) => onFieldChange("saves.wis.proficient", checked)}
          />
          <TextField
            label="WIS Save"
            value={formatSigned(derived)}
            width="sm"
            disabled
            className="text-center tabular-nums font-medium"
          />
              </>
            );
          })()}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const proficient = Boolean(
              getByPath(character.data, "saves.cha.proficient"),
            );
            const abilityScore = getByPath(character.data, "abilities.cha.score");
            const derived = savingThrowValue(
              typeof abilityScore === "number" ? abilityScore : null,
              proficient,
              proficiencyBonus,
            );
            return (
              <>
          <BooleanToggleField
            label="CHA Save Proficient"
            checked={proficient}
            onChange={(checked) => onFieldChange("saves.cha.proficient", checked)}
          />
          <TextField
            label="CHA Save"
            value={formatSigned(derived)}
            width="sm"
            disabled
            className="text-center tabular-nums font-medium"
          />
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
