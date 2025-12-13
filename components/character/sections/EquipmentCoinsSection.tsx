"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";
import { NumberField } from "../fields/NumberField";

export function EquipmentCoinsSection({ character, onFieldChange }: SectionProps) {
  const equipment = getByPath(character.data, "inventory.equipment");

  const cp = getByPath(character.data, "inventory.coins.cp");
  const sp = getByPath(character.data, "inventory.coins.sp");
  const ep = getByPath(character.data, "inventory.coins.ep");
  const gp = getByPath(character.data, "inventory.coins.gp");
  const pp = getByPath(character.data, "inventory.coins.pp");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Equipment &amp; Coins</h2>
        <Separator className="mt-1" />
      </div>

      <TextAreaField
        label="Equipment"
        value={typeof equipment === "string" ? equipment : ""}
        onChange={(next) => onFieldChange("inventory.equipment", next)}
        rows={6}
      />

      <div className="grid gap-3 md:grid-cols-5">
        <NumberField
          label="CP"
          value={typeof cp === "number" ? cp : null}
          onChange={(value) => onFieldChange("inventory.coins.cp", value)}
          width="xs"
        />
        <NumberField
          label="SP"
          value={typeof sp === "number" ? sp : null}
          onChange={(value) => onFieldChange("inventory.coins.sp", value)}
          width="xs"
        />
        <NumberField
          label="EP"
          value={typeof ep === "number" ? ep : null}
          onChange={(value) => onFieldChange("inventory.coins.ep", value)}
          width="xs"
        />
        <NumberField
          label="GP"
          value={typeof gp === "number" ? gp : null}
          onChange={(value) => onFieldChange("inventory.coins.gp", value)}
          width="xs"
        />
        <NumberField
          label="PP"
          value={typeof pp === "number" ? pp : null}
          onChange={(value) => onFieldChange("inventory.coins.pp", value)}
          width="xs"
        />
      </div>
    </section>
  );
}

