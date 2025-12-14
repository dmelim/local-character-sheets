"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { BooleanToggleField } from "./BooleanToggleField";

type ToggleCounterProps = {
  /** How many toggles to render */
  max: number;

  /** How many toggles are enabled/clickable (defaults to max) */
  enabledMax?: number;

  /** Current count (0..max) */
  value: number | null | undefined;

  /** Called with the next count */
  onChange: (nextCount: number) => void;

  /** Icon rendered inside each toggle */
  icon: React.ReactNode;

  /** Used for aria-labels (e.g. "Level 1 expended") */
  ariaLabel: string;

  /** Optional tooltip shown on hover/focus */
  tooltip?: React.ReactNode;

  className?: string;
};

function clampCount(raw: number, max: number) {
  if (!Number.isFinite(raw)) return 0;
  const floored = Math.floor(raw);
  return Math.max(0, Math.min(max, floored));
}

export function ToggleCounter({
  max,
  enabledMax,
  value,
  onChange,
  icon,
  ariaLabel,
  tooltip,
  className,
}: ToggleCounterProps) {
  const safeMax = Math.max(0, Math.floor(max));
  const safeEnabledMax = clampCount(
    typeof enabledMax === "number" ? enabledMax : safeMax,
    safeMax,
  );
  const count = clampCount(typeof value === "number" ? value : 0, safeEnabledMax);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: safeMax }, (_, i) => (
        <BooleanToggleField
          key={i}
          label={`${ariaLabel} ${i + 1}`}
          checked={count > i}
          onChange={(checked) => onChange(checked ? i + 1 : i)}
          hideLabel
          icon={icon}
          tooltip={tooltip}
          disabled={i >= safeEnabledMax}
        />
      ))}
    </div>
  );
}
