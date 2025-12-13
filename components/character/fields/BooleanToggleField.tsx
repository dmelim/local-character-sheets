"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Circle } from "lucide-react";

type BooleanToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;

  /** Optional icon to render inside the toggle */
  icon?: React.ReactNode;

  /** Hide the label visually (still accessible via aria-label) */
  hideLabel?: boolean;
};

export function BooleanToggleField({
  label,
  checked,
  onChange,
  id,
  icon,
  hideLabel = false,
}: BooleanToggleFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="flex items-center justify-center gap-1 px-3 py-2">
      {!hideLabel && (
        <Label htmlFor={inputId} className="flex-1">
          {label}
        </Label>
      )}

      <Toggle
        id={inputId}
        aria-label={label}
        size="sm"
        variant="ghost"
        pressed={checked}
        onPressedChange={onChange}
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
      >
        {icon ?? <Circle className="h-4 w-4" />}
      </Toggle>
    </div>
  );
}
