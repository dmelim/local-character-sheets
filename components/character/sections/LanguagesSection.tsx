"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";

export function LanguagesSection({ character, onFieldChange }: SectionProps) {
  const value = getByPath(character.data, "roleplay.languages");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Languages</h2>
        <Separator className="mt-1" />
      </div>
      <TextAreaField
        label="Languages"
        value={typeof value === "string" ? value : ""}
        onChange={(next) => onFieldChange("roleplay.languages", next)}
        rows={4}
      />
    </section>
  );
}

