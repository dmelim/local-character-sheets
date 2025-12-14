"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type BooleanToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;

  /** Optional icon to render inside the toggle */
  icon?: React.ReactNode;

  /** Hide the label visually (still accessible via aria-label) */
  hideLabel?: boolean;

  /** Optional tooltip content (shown on hover/focus) */
  tooltip?: React.ReactNode;

  disabled?: boolean;
};

export function BooleanToggleField({
  label,
  checked,
  onChange,
  id,
  icon,
  hideLabel = false,
  tooltip,
  disabled = false,
}: BooleanToggleFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  const toggleNode = (
    <Toggle
      id={inputId}
      aria-label={label}
      size="sm"
      variant="ghost"
      pressed={checked}
      onPressedChange={onChange}
      disabled={disabled}
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
    >
      {icon ?? <Circle className="h-4 w-4" />}
    </Toggle>
  );

  return (
    <div className="flex items-center gap-1">
      {!hideLabel && <Label htmlFor={inputId}>{label}</Label>}

      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{toggleNode}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        toggleNode
      )}
    </div>
  );
}
