"use client";

import { BooleanToggleField } from "@/components/character/fields/BooleanToggleField";
import { Heart } from "lucide-react";

type SavesProps = {
  successes: number;
  failures: number;
  onChange: (type: "successes" | "failures", value: number) => void;
};

export function DeathSaves({ successes, failures, onChange }: SavesProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Successes (max 3) */}
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

      {/* Failures (max 3) */}
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
  );
}
