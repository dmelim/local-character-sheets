"use client";

import { BooleanToggleField } from "@/components/character/fields/BooleanToggleField";
import { Heart } from "lucide-react";

type DeathSavesProps = {
  successes: number;
  failures: number;
  onChange: (type: "successes" | "failures", value: number) => void;
};

export function DeathSaves({ successes, failures, onChange }: DeathSavesProps) {
  return (
    <div className="space-y-1 flex">
      {/* Successes */}
      <div className="flex items-center">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Success
        </span>
        <div className="flex">
          {[0, 1, 2].map((i) => (
            <BooleanToggleField
              key={`success-${i}`}
              label={`Death Save Success ${i + 1}`}
              hideLabel
              icon={<Heart className="h-4 w-4" />}
              checked={successes > i}
              onChange={(checked) => onChange("successes", checked ? i + 1 : i)}
            />
          ))}
        </div>
      </div>

      {/* Failures */}
      <div className="flex items-center">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Failure
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <BooleanToggleField
              key={`failure-${i}`}
              label={`Death Save Failure ${i + 1}`}
              hideLabel
              icon={<Heart className="h-4 w-4 rotate-180 opacity-60" />}
              checked={failures > i}
              onChange={(checked) => onChange("failures", checked ? i + 1 : i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
