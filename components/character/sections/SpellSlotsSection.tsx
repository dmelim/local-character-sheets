"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { NumberField } from "../fields/NumberField";

export function SpellSlotsSection({ character, onFieldChange }: SectionProps) {
  const levels = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Spell Slots</h2>
        <Separator className="mt-1" />
      </div>
      <div className="space-y-4">
        {levels.map((level) => {
          const totalPath = `spellSlots.level${level}.total`;
          const expendedPath = `spellSlots.level${level}.expended`;
          const total = getByPath(character.data, totalPath);
          const expended = getByPath(character.data, expendedPath);

          return (
            <div
              key={level}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Level {level} Slots
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <NumberField
                  label={`Level ${level} Total`}
                  value={typeof total === "number" ? total : null}
                  onChange={(value) => onFieldChange(totalPath, value)}
                  width="sm"
                />
                <NumberField
                  label={`Level ${level} Expended`}
                  value={typeof expended === "number" ? expended : null}
                  onChange={(value) => onFieldChange(expendedPath, value)}
                  width="sm"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

