"use client";

import { Plus, Trash2 } from "lucide-react";
import { getByPath } from "@/lib/path-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { BooleanToggleField } from "../fields/BooleanToggleField";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";

type PreparedSpellEntry = {
  id: string;
  level: string;
  name: string;
  castingTime: string;
  range: string;
  concentration: boolean;
  ritual: boolean;
  material: boolean;
  notes: string;
};

function newRowId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `row_${Date.now()}_${Math.random().toString(16).slice(2)}`
  );
}

function createEmptyRow(id: string = newRowId()): PreparedSpellEntry {
  return {
    id,
    level: "",
    name: "",
    castingTime: "",
    range: "",
    concentration: false,
    ritual: false,
    material: false,
    notes: "",
  };
}

function coerceString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function coerceBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function parseEntries(raw: string): PreparedSpellEntry[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((row) => {
      const record = row as Record<string, unknown> | null;
      return {
        id: coerceString(record?.id) || newRowId(),
        level: coerceString(record?.level),
        name: coerceString(record?.name),
        castingTime: coerceString(record?.castingTime),
        range: coerceString(record?.range),
        concentration: coerceBoolean(record?.concentration),
        ritual: coerceBoolean(record?.ritual),
        material: coerceBoolean(record?.material),
        notes: coerceString(record?.notes),
      };
    });
  } catch {
    return [];
  }
}

function isEmptyRow(row: PreparedSpellEntry): boolean {
  return (
    row.level.trim() === "" &&
    row.name.trim() === "" &&
    row.castingTime.trim() === "" &&
    row.range.trim() === "" &&
    row.notes.trim() === "" &&
    !row.concentration &&
    !row.ritual &&
    !row.material
  );
}

export function PreparedSpellsSection({
  character,
  onFieldChange,
}: SectionProps) {
  const rawEntries = getByPath(character.data, "spells.prepared");
  const raw = typeof rawEntries === "string" ? rawEntries : "";

  const parsed = useMemo(() => parseEntries(raw), [raw]);

  const placeholderRowId = useMemo(() => {
    void character.id;
    return newRowId();
  }, [character.id]);
  const emptyExtraRowIds = useMemo(() => [] as string[], []);
  const [extraRowsState, setExtraRowsState] = useState(() => ({
    characterId: character.id,
    ids: [] as string[],
  }));
  const extraRowIds =
    extraRowsState.characterId === character.id
      ? extraRowsState.ids
      : emptyExtraRowIds;

  const filteredExtraRowIds = useMemo(() => {
    if (extraRowIds.length === 0) return extraRowIds;
    const parsedIds = new Set(parsed.map((row) => row.id));
    return extraRowIds.filter((id) => !parsedIds.has(id));
  }, [extraRowIds, parsed]);

  const rows = useMemo<PreparedSpellEntry[]>(() => {
    const extras = filteredExtraRowIds.map((id) => createEmptyRow(id));
    if (parsed.length === 0 && extras.length === 0) {
      return [createEmptyRow(placeholderRowId)];
    }
    return [...parsed, ...extras];
  }, [filteredExtraRowIds, parsed, placeholderRowId]);

  const commit = useCallback(
    (nextRows: PreparedSpellEntry[]) => {
      const meaningful = nextRows.filter((row) => !isEmptyRow(row));
      const nextStored = JSON.stringify(meaningful);

      if (nextStored === raw) return;

      onFieldChange("spells.prepared", nextStored);
    },
    [onFieldChange, raw]
  );

  const handleTextFieldChange = useCallback(
    (
      rowId: string,
      key: "level" | "name" | "castingTime" | "range" | "notes",
      value: string
    ) => {
      const next = rows.map((row) =>
        row.id === rowId ? { ...row, [key]: value } : row
      );
      commit(next);
    },
    [commit, rows]
  );

  const handleToggleChange = useCallback(
    (
      rowId: string,
      key: "concentration" | "ritual" | "material",
      checked: boolean
    ) => {
      const next = rows.map((row) =>
        row.id === rowId ? { ...row, [key]: checked } : row
      );
      commit(next);
    },
    [commit, rows]
  );

  const handleAddRow = useCallback(() => {
    setExtraRowsState((prev) => {
      const ids = prev.characterId === character.id ? prev.ids : [];
      return { characterId: character.id, ids: [...ids, newRowId()] };
    });
  }, [character.id]);

  const handleRemoveRow = useCallback(
    (rowId: string) => {
      if (filteredExtraRowIds.includes(rowId)) {
        setExtraRowsState((prev) => {
          const ids = prev.characterId === character.id ? prev.ids : [];
          return { characterId: character.id, ids: ids.filter((id) => id !== rowId) };
        });
        return;
      }
      if (parsed.length === 0 && rowId === placeholderRowId) return;
      commit(rows.filter((row) => row.id !== rowId));
    },
    [character.id, commit, filteredExtraRowIds, parsed.length, placeholderRowId, rows]
  );

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Cantrips &amp; Prepared Spells</h2>
        <Separator className="mt-1" />
      </div>

      <div className="space-y-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
        <div className="grid grid-cols-[minmax(3rem,0.4fr)_minmax(10rem,1.2fr)_minmax(8rem,0.8fr)_minmax(8rem,0.8fr)_minmax(7rem,0.7fr)_minmax(12rem,1.3fr)_auto] items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <div className="text-center">Level</div>
          <div>Name</div>
          <div className="text-center">Casting Time</div>
          <div className="text-center">Range</div>
          <div className="text-center">C / R / M</div>
          <div>Notes</div>
          <div />
        </div>

        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(3rem,0.4fr)_minmax(10rem,1.2fr)_minmax(8rem,0.8fr)_minmax(8rem,0.8fr)_minmax(7rem,0.7fr)_minmax(12rem,1.3fr)_auto] items-center gap-2"
            >
              <Input
                value={row.level}
                onChange={(e) =>
                  handleTextFieldChange(row.id, "level", e.target.value)
                }
                className={cn(
                  "h-8 text-center text-sm tabular-nums",
                  isEmptyRow(row) ? "text-zinc-500" : ""
                )}
                placeholder="0"
                aria-label={`Row ${index + 1} level`}
              />

              <Input
                value={row.name}
                onChange={(e) =>
                  handleTextFieldChange(row.id, "name", e.target.value)
                }
                className={cn(
                  "h-8 text-sm",
                  isEmptyRow(row) ? "text-zinc-500" : ""
                )}
                placeholder="Spell name"
                aria-label={`Row ${index + 1} name`}
              />

              <Input
                value={row.castingTime}
                onChange={(e) =>
                  handleTextFieldChange(row.id, "castingTime", e.target.value)
                }
                className="h-8 text-center text-sm"
                placeholder="Action"
                aria-label={`Row ${index + 1} casting time`}
              />

              <Input
                value={row.range}
                onChange={(e) =>
                  handleTextFieldChange(row.id, "range", e.target.value)
                }
                className="h-8 text-center text-sm"
                placeholder="60 ft"
                aria-label={`Row ${index + 1} range`}
              />

              <div className="flex items-center justify-center gap-1">
                <BooleanToggleField
                  label="Concentration"
                  checked={row.concentration}
                  onChange={(checked) =>
                    handleToggleChange(row.id, "concentration", checked)
                  }
                  hideLabel
                  icon={
                    <span className="text-[10px] font-semibold leading-none">
                      C
                    </span>
                  }
                  tooltip="Concentration"
                />
                <BooleanToggleField
                  label="Ritual"
                  checked={row.ritual}
                  onChange={(checked) =>
                    handleToggleChange(row.id, "ritual", checked)
                  }
                  hideLabel
                  icon={
                    <span className="text-[10px] font-semibold leading-none">
                      R
                    </span>
                  }
                  tooltip="Ritual"
                />
                <BooleanToggleField
                  label="Material Components Required"
                  checked={row.material}
                  onChange={(checked) =>
                    handleToggleChange(row.id, "material", checked)
                  }
                  hideLabel
                  icon={
                    <span className="text-[10px] font-semibold leading-none">
                      M
                    </span>
                  }
                  tooltip="Requires Material Components"
                />
              </div>

              <Input
                value={row.notes}
                onChange={(e) =>
                  handleTextFieldChange(row.id, "notes", e.target.value)
                }
                className="h-8 text-sm"
                placeholder="Notes"
                aria-label={`Row ${index + 1} notes`}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemoveRow(row.id)}
                aria-label={`Remove spell row ${index + 1}`}
                title="Remove spell row"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRow}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Add row
          </Button>
        </div>
      </div>
    </section>
  );
}
