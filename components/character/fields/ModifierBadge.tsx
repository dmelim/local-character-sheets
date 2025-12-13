"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ModifierBadgeProps = {
  value: number | null | undefined;
  className?: string;
};

export function ModifierBadge({ value, className }: ModifierBadgeProps) {
  const label =
    typeof value === "number"
      ? `${value >= 0 ? "+" : ""}${value}`
      : "—";

  return (
    <div
      className={cn(
        "min-w-[3rem] rounded-md bg-zinc-100 px-2 py-1 text-center text-sm font-semibold tabular-nums text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50",
        className,
      )}
    >
      {label}
    </div>
  );
}

