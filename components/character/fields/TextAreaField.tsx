"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type TextAreaFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  id?: string;
  rows?: number;
};

export function TextAreaField({
  label,
  value,
  onChange,
  id,
  rows = 4,
}: TextAreaFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    onChange(event.target.value ?? "");
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={inputId}>{label}</Label>
      <Textarea
        id={inputId}
        rows={rows}
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );
}

