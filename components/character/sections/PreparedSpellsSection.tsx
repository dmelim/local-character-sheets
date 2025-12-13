"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";

export function PreparedSpellsSection({ character, onFieldChange }: SectionProps) {
  const value = getByPath(character.data, "spells.prepared");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Cantrips &amp; Prepared Spells</h2>
        <Separator className="mt-1" />
      </div>
      <TextAreaField
        label="Cantrips & Prepared Spells"
        value={typeof value === "string" ? value : ""}
        onChange={(next) => onFieldChange("spells.prepared", next)}
        rows={8}
      />
    </section>
  );
}

