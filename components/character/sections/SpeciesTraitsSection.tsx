"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { TextAreaField } from "../fields/TextAreaField";

export function SpeciesTraitsSection({ character, onFieldChange }: SectionProps) {
  const value = getByPath(character.data, "features.speciesTraits");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Species Traits</h2>
        <Separator className="mt-1" />
      </div>
      <TextAreaField
        label="Species Traits"
        value={typeof value === "string" ? value : ""}
        onChange={(next) => onFieldChange("features.speciesTraits", next)}
        rows={6}
      />
    </section>
  );
}

