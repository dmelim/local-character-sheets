"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";

export function AppearanceSection({ character, onFieldChange }: SectionProps) {
  const value = getByPath(character.data, "roleplay.appearance");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <Separator className="mt-1" />
      </div>
      <TextAreaField
        label="Appearance"
        value={typeof value === "string" ? value : ""}
        onChange={(next) => onFieldChange("roleplay.appearance", next)}
        rows={6}
      />
    </section>
  );
}

