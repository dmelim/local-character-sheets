"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";

export function WeaponsSection({ character, onFieldChange }: SectionProps) {
  const entries = getByPath(character.data, "attacks.entries");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Weapons &amp; Damage / Cantrips</h2>
        <Separator className="mt-1" />
      </div>
      <TextAreaField
        label="Weapons & Damage / Cantrips (JSON)"
        value={typeof entries === "string" ? entries : ""}
        onChange={(value) => onFieldChange("attacks.entries", value)}
        rows={6}
      />
    </section>
  );
}

