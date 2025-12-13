"use client";

import * as React from "react";
import { FieldDef } from "@/lib/character-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type FieldRendererProps = {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const id = field.path;

  const handleStringChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    onChange(event.target.value ?? "");
  };

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const raw = event.target.value;
    if (raw === "") {
      onChange(null);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      onChange(null);
      return;
    }
    onChange(parsed);
  };

  const handleBooleanChange = (checked: boolean) => {
    onChange(checked);
  };

  const isAbilityScore =
    field.section === "Ability Scores" && field.path.endsWith(".score");

  const renderControl = () => {
    if (field.type === "boolean") {
      return (
        <div className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <Label
            htmlFor={id}
            className="flex-1 cursor-pointer"
          >
            {field.label}
          </Label>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={handleBooleanChange}
          />
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Label htmlFor={id}>{field.label}</Label>
        {field.type === "string" && field.multiline ? (
          <Textarea
            id={id}
            value={typeof value === "string" ? value : ""}
            onChange={handleStringChange}
          />
        ) : field.type === "string" ? (
          <Input
            id={id}
            value={typeof value === "string" ? value : ""}
            onChange={handleStringChange}
          />
        ) : (
          <Input
            id={id}
            type="number"
            className={cn(
              isAbilityScore && "w-16 text-center tabular-nums",
            )}
            min={isAbilityScore ? 1 : undefined}
            max={isAbilityScore ? 30 : undefined}
            step={isAbilityScore ? 1 : undefined}
            value={
              typeof value === "number" || value === null ? String(value ?? "") : ""
            }
            onChange={handleNumberChange}
          />
        )}
      </div>
    );
  };

  return <div>{renderControl()}</div>;
}
