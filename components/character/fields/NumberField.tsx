"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Width = "xs" | "sm" | "md";

type NumberFieldProps = {
  label: string;
  value: number | null | undefined;
  onChange?: (value: number | null) => void;
  id?: string;
  width?: Width;
  min?: number;
  max?: number;
  disabled?: boolean;
  hideLabel?: boolean;
  layout?: "vertical" | "inline";
  className?: string;
  inputClassName?: string;
};

const widthClasses: Record<Width, string> = {
  xs: "w-16",
  sm: "w-24",
  md: "w-32",
};

export function NumberField({
  label,
  value,
  onChange,
  id,
  width = "sm",
  min,
  max,
  disabled = false,
  hideLabel = false,
  layout = "vertical",
  className,
  inputClassName,
}: NumberFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (disabled) return;
    const raw = event.target.value;
    if (raw === "") {
      onChange?.(null);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      onChange?.(null);
      return;
    }
    onChange?.(parsed);
  };

  return (
    <div
      className={cn(
        layout === "inline" ? "flex items-center gap-2" : "space-y-1",
        className,
      )}
    >
      {!hideLabel ? <Label htmlFor={inputId}>{label}</Label> : null}
      <Input
        id={inputId}
        type="number"
        className={cn(
          widthClasses[width],
          "text-center tabular-nums",
          inputClassName,
        )}
        min={min}
        max={max}
        aria-label={hideLabel ? label : undefined}
        value={typeof value === "number" || value === null ? String(value ?? "") : ""}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
