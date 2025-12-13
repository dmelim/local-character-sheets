"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextField } from "../fields/TextField";

export function AttunementSection({ character, onFieldChange }: SectionProps) {
  const slot1 = getByPath(character.data, "inventory.attunement.slot1");
  const slot2 = getByPath(character.data, "inventory.attunement.slot2");
  const slot3 = getByPath(character.data, "inventory.attunement.slot3");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Magic Item Attunement</h2>
        <Separator className="mt-1" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <TextField
          label="Attunement Slot 1"
          value={typeof slot1 === "string" ? slot1 : ""}
          onChange={(value) => onFieldChange("inventory.attunement.slot1", value)}
          width="md"
        />
        <TextField
          label="Attunement Slot 2"
          value={typeof slot2 === "string" ? slot2 : ""}
          onChange={(value) => onFieldChange("inventory.attunement.slot2", value)}
          width="md"
        />
        <TextField
          label="Attunement Slot 3"
          value={typeof slot3 === "string" ? slot3 : ""}
          onChange={(value) => onFieldChange("inventory.attunement.slot3", value)}
          width="md"
        />
      </div>
    </section>
  );
}

