"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DerivedStatProps = {
  label: string;
  value: number | null | undefined | string;

  /** Optional explanation shown on hover/focus (e.g. "10 + Perception") */
  tooltip?: React.ReactNode;

  /** Display style */
  variant?: "pill" | "box";

  /** Compact width presets */
  width?: "xs" | "sm" | "md";

  /** Render label + value inline instead of stacked */
  layout?: "vertical" | "inline";

  /** Hide the label (useful when label is rendered elsewhere) */
  hideLabel?: boolean;

  className?: string;
};

const widthClasses: Record<NonNullable<DerivedStatProps["width"]>, string> = {
  xs: "min-w-[3rem]",
  sm: "min-w-[4rem]",
  md: "min-w-[5rem]",
};

function formatSigned(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function DerivedStat({
  label,
  value,
  tooltip,
  variant = "pill",
  width = "sm",
  layout = "vertical",
  hideLabel = false,
  className,
}: DerivedStatProps) {
  const display = (() => {
    if (typeof value === "number") {
      return Number.isNaN(value) ? "?" : formatSigned(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : "—";
    }
    return "—";
  })();

  const valueNode = (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 tabular-nums font-semibold text-zinc-900 dark:text-zinc-50",
        widthClasses[width],
        variant === "pill"
          ? "rounded-full bg-zinc-100 px-2 py-0.5 text-sm dark:bg-zinc-900"
          : "rounded-md bg-zinc-100 px-2 py-1 text-base dark:bg-zinc-900"
      )}
    >
      {display}
    </span>
  );

  const labelNode = !hideLabel ? (
    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
      {label}
    </span>
  ) : null;

  const core =
    layout === "inline" ? (
      <div className={cn("flex items-center gap-2", className)}>
        {labelNode}
        {valueNode}
      </div>
    ) : (
      <div
        className={cn(
          "flex flex-col items-center justify-between gap-2",
          className
        )}
      >
        {labelNode}
        {valueNode}
      </div>
    );

  if (!tooltip) return core;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{core}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
