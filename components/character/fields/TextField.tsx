"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Width = "full" | "md" | "sm" | "xs";

type TextFieldProps = {
  label: string;
  value: string | undefined;
  onChange?: (value: string) => void;
  id?: string;
  width?: Width;
  disabled?: boolean;
  className?: string;
};

const widthClasses: Record<Width, string> = {
  full: "w-full",
  md: "max-w-xs",
  sm: "w-24",
  xs: "w-20",
};

export function TextField({
  label,
  value,
  onChange,
  id,
  width = "full",
  disabled = false,
  className,
}: TextFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (disabled) return;
    onChange?.(event.target.value ?? "");
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        className={cn(widthClasses[width], className)}
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
