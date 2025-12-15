"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { NumberField } from "../fields/NumberField";
import { ToggleCounter } from "../fields/ToggleCounter";
import { LoaderPinwheel } from "lucide-react";

const MAX_EXPENDED_ICONS_BY_LEVEL: Record<number, number> = {
  1: 4,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
  9: 1,
};

export function SpellSlotsSection({ character, onFieldChange }: SectionProps) {
  const levels = React.useMemo(
    () => Array.from({ length: 9 }, (_, i) => i + 1),
    []
  );

  React.useEffect(() => {
    for (const level of levels) {
      const totalPath = `spellSlots.level${level}.total`;
      const expendedPath = `spellSlots.level${level}.expended`;
      const totalRaw = getByPath(character.data, totalPath);
      const expendedRaw = getByPath(character.data, expendedPath);

      const total =
        typeof totalRaw === "number" && !Number.isNaN(totalRaw)
          ? totalRaw
          : null;
      const expended =
        typeof expendedRaw === "number" && !Number.isNaN(expendedRaw)
          ? expendedRaw
          : 0;

      const maxExpendedIcons = MAX_EXPENDED_ICONS_BY_LEVEL[level] ?? 0;
      const enabledMaxForLevel =
        typeof total === "number"
          ? Math.max(0, Math.min(maxExpendedIcons, Math.floor(total)))
          : 0;

      const clamped = Math.max(
        0,
        Math.min(enabledMaxForLevel, Math.floor(expended))
      );
      if (typeof expendedRaw === "number" && expendedRaw === clamped) continue;
      if (typeof expendedRaw !== "number" && clamped === 0) continue;

      onFieldChange(expendedPath, clamped);
    }
  }, [character.data, levels, onFieldChange]);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Spell Slots</h2>
        <Separator className="mt-1" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => {
          const totalPath = `spellSlots.level${level}.total`;
          const expendedPath = `spellSlots.level${level}.expended`;
          const totalRaw = getByPath(character.data, totalPath);
          const expendedRaw = getByPath(character.data, expendedPath);

          const total =
            typeof totalRaw === "number" && !Number.isNaN(totalRaw)
              ? totalRaw
              : null;
          const expended =
            typeof expendedRaw === "number" && !Number.isNaN(expendedRaw)
              ? expendedRaw
              : 0;

          const maxExpendedIcons = MAX_EXPENDED_ICONS_BY_LEVEL[level] ?? 0;
          const enabledMaxForLevel =
            typeof total === "number"
              ? Math.max(0, Math.min(maxExpendedIcons, Math.floor(total)))
              : 0;

          const clampedExpended = Math.max(
            0,
            Math.min(enabledMaxForLevel, Math.floor(expended))
          );

          return (
            <div
              key={level}
              className="space-y-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Level {level}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Total
                  </div>
                  <NumberField
                    label={`Level ${level} total slots`}
                    value={total}
                    onChange={(value) => {
                      onFieldChange(totalPath, value);
                      const nextTotal =
                        typeof value === "number" && !Number.isNaN(value)
                          ? value
                          : null;
                      const nextMax =
                        typeof nextTotal === "number"
                          ? Math.max(
                              0,
                              Math.min(maxExpendedIcons, Math.floor(nextTotal))
                            )
                          : 0;
                      if (clampedExpended > nextMax) {
                        onFieldChange(expendedPath, nextMax);
                      }
                    }}
                    width="xs"
                    hideLabel
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Expended
                </div>
                <ToggleCounter
                  max={maxExpendedIcons}
                  enabledMax={enabledMaxForLevel}
                  value={clampedExpended}
                  onChange={(nextCount) => {
                    const clampedNext = Math.max(
                      0,
                      Math.min(enabledMaxForLevel, nextCount)
                    );
                    onFieldChange(expendedPath, clampedNext);
                  }}
                  icon={<LoaderPinwheel className="h-4 w-4" />}
                  ariaLabel={`Level ${level} slots expended`}
                  tooltip="Expended slots"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
