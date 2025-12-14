"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { getByPath } from "@/lib/path-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { cn } from "@/lib/utils";

type AttackEntry = {
  name: string;
  atkBonusOrDc: string;
  damageAndType: string;
  notes: string;
};

const EMPTY_ROW: AttackEntry = {
  name: "",
  atkBonusOrDc: "",
  damageAndType: "",
  notes: "",
};

function coerceString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseEntries(raw: string): AttackEntry[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((row) => {
      const record = row as Record<string, unknown> | null;
      return {
        name: coerceString(record?.name),
        atkBonusOrDc: coerceString(record?.atkBonusOrDc),
        damageAndType: coerceString(record?.damageAndType),
        notes: coerceString(record?.notes),
      };
    });
  } catch {
    return [];
  }
}

function isEmptyRow(row: AttackEntry): boolean {
  return (
    row.name.trim() === "" &&
    row.atkBonusOrDc.trim() === "" &&
    row.damageAndType.trim() === "" &&
    row.notes.trim() === ""
  );
}

function ensureTrailingEmptyRow(nextRows: AttackEntry[]): AttackEntry[] {
  if (nextRows.length === 0) return [{ ...EMPTY_ROW }];
  if (!isEmptyRow(nextRows[nextRows.length - 1])) return [...nextRows, { ...EMPTY_ROW }];
  return nextRows;
}

export function WeaponsSection({ character, onFieldChange }: SectionProps) {
  const rawEntries = getByPath(character.data, "attacks.entries");
  const raw = typeof rawEntries === "string" ? rawEntries : "";

  const parsed = React.useMemo(() => parseEntries(raw), [raw]);

  const lastEmittedRef = React.useRef<string | null>(null);
  const [rows, setRows] = React.useState<AttackEntry[]>(() =>
    ensureTrailingEmptyRow(parsed),
  );

  React.useEffect(() => {
    if (lastEmittedRef.current === raw) return;
    setRows(ensureTrailingEmptyRow(parsed));
  }, [parsed, raw]);

  const serializeMeaningfulRows = React.useCallback((nextRows: AttackEntry[]) => {
    const meaningful = nextRows.filter((row) => !isEmptyRow(row));
    return JSON.stringify(meaningful);
  }, []);

  const commitRows = React.useCallback(
    (nextRows: AttackEntry[]) => {
      const normalized =
        nextRows.length === 0 || nextRows.every(isEmptyRow)
          ? [{ ...EMPTY_ROW }]
          : ensureTrailingEmptyRow(nextRows);

      setRows(normalized);

      const nextStored = serializeMeaningfulRows(normalized);
      if (nextStored === raw) return;

      lastEmittedRef.current = nextStored;
      onFieldChange("attacks.entries", nextStored);
    },
    [onFieldChange, raw, serializeMeaningfulRows],
  );

  const handleFieldChange = React.useCallback(
    (index: number, key: keyof AttackEntry, value: string) => {
      const next = rows.map((row, i) => (i === index ? { ...row, [key]: value } : row));

      const isLast = index === next.length - 1;
      if (isLast && !isEmptyRow(next[index])) {
        next.push({ ...EMPTY_ROW });
      }

      commitRows(next);
    },
    [commitRows, rows],
  );

  const handleAddRow = React.useCallback(() => {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }, []);

  const handleRemoveRow = React.useCallback(
    (index: number) => {
      const next = rows.filter((_, i) => i !== index);
      commitRows(next);
    },
    [commitRows, rows],
  );

  return (
    <section className="space-y-3">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Weapons &amp; Damage / Cantrips
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleAddRow}
            aria-label="Add row"
            title="Add row"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="mt-1" />
      </div>

      <div className="space-y-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="grid grid-cols-[minmax(10rem,1.2fr)_minmax(6rem,0.7fr)_minmax(10rem,1fr)_minmax(12rem,1.4fr)_auto] items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <div>Name</div>
          <div className="text-center">Atk Bonus / DC</div>
          <div>Damage &amp; Type</div>
          <div>Notes</div>
          <div />
        </div>

        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(10rem,1.2fr)_minmax(6rem,0.7fr)_minmax(10rem,1fr)_minmax(12rem,1.4fr)_auto] items-center gap-2"
            >
              <Input
                value={row.name}
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                className={cn("h-8 text-sm", isEmptyRow(row) ? "text-zinc-500" : "")}
                placeholder="Name"
                aria-label={`Row ${index + 1} name`}
              />
              <Input
                value={row.atkBonusOrDc}
                onChange={(e) =>
                  handleFieldChange(index, "atkBonusOrDc", e.target.value)
                }
                className="h-8 text-center text-sm tabular-nums"
                placeholder="+X / DC Y"
                aria-label={`Row ${index + 1} attack bonus or DC`}
              />
              <Input
                value={row.damageAndType}
                onChange={(e) =>
                  handleFieldChange(index, "damageAndType", e.target.value)
                }
                className="h-8 text-sm"
                placeholder="1d8+X slashing"
                aria-label={`Row ${index + 1} damage and type`}
              />
              <Input
                value={row.notes}
                onChange={(e) => handleFieldChange(index, "notes", e.target.value)}
                className="h-8 text-sm"
                placeholder="Notes"
                aria-label={`Row ${index + 1} notes`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemoveRow(index)}
                aria-label={`Remove row ${index + 1}`}
                title="Remove row"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
