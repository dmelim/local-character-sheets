"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";
import { TextField } from "../fields/TextField";

export function BackstorySection({ character, onFieldChange }: SectionProps) {
  const backstory = getByPath(character.data, "roleplay.backstoryAndPersonality");
  const alignment = getByPath(character.data, "roleplay.alignment");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Backstory &amp; Personality</h2>
        <Separator className="mt-1" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextAreaField
            label="Backstory & Personality"
            value={typeof backstory === "string" ? backstory : ""}
            onChange={(next) => onFieldChange("roleplay.backstoryAndPersonality", next)}
            rows={8}
          />
        </div>
        <TextField
          label="Alignment"
          value={typeof alignment === "string" ? alignment : ""}
          onChange={(next) => onFieldChange("roleplay.alignment", next)}
          width="md"
        />
      </div>
    </section>
  );
}

