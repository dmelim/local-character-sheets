"use client";

import { Plus, Trash2 } from "lucide-react";
import { getByPath } from "@/lib/path-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";

type AttackEntry = {
  id: string;
  name: string;
  atkBonusOrDc: string;
  damageAndType: string;
  notes: string;
};

function newRowId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `row_${Date.now()}_${Math.random().toString(16).slice(2)}`
  );
}

function createEmptyRow(id: string = newRowId()): AttackEntry {
  return { id, name: "", atkBonusOrDc: "", damageAndType: "", notes: "" };
}

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
        id: coerceString(record?.id) || newRowId(),
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

export function WeaponsSection({ character, onFieldChange }: SectionProps) {
  const rawEntries = getByPath(character.data, "attacks.entries");
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

  const rows = useMemo<AttackEntry[]>(() => {
    const extras = filteredExtraRowIds.map((id) => createEmptyRow(id));
    if (parsed.length === 0 && extras.length === 0) {
      return [createEmptyRow(placeholderRowId)];
    }
    return [...parsed, ...extras];
  }, [filteredExtraRowIds, parsed, placeholderRowId]);

  const serializeRows = useCallback((nextRows: AttackEntry[]) => {
    const meaningful = nextRows.filter((r) => !isEmptyRow(r));
    return JSON.stringify(meaningful);
  }, []);

  const commit = useCallback(
    (nextRows: AttackEntry[]) => {
      const normalized =
        nextRows.length === 0 || nextRows.every(isEmptyRow) ? [] : nextRows;

      const nextStored = serializeRows(normalized);

      if (nextStored === raw) return;

      onFieldChange("attacks.entries", nextStored);
    },
    [onFieldChange, raw, serializeRows]
  );

  const handleFieldChange = useCallback(
    (
      rowId: string,
      key: "name" | "atkBonusOrDc" | "damageAndType" | "notes",
      value: string
    ) => {
      const next = rows.map((row) =>
        row.id === rowId ? { ...row, [key]: value } : row
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
        <h2 className="text-lg font-semibold">Weapons &amp; Damage / Cantrips</h2>
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
              key={row.id}
              className="grid grid-cols-[minmax(10rem,1.2fr)_minmax(6rem,0.7fr)_minmax(10rem,1fr)_minmax(12rem,1.4fr)_auto] items-center gap-2"
            >
              <Input
                value={row.name}
                onChange={(e) =>
                  handleFieldChange(row.id, "name", e.target.value)
                }
                className={cn(
                  "h-8 text-sm",
                  isEmptyRow(row) ? "text-zinc-500" : ""
                )}
                placeholder="Name"
                aria-label={`Row ${index + 1} name`}
              />
              <Input
                value={row.atkBonusOrDc}
                onChange={(e) =>
                  handleFieldChange(row.id, "atkBonusOrDc", e.target.value)
                }
                className="h-8 text-center text-sm tabular-nums"
                placeholder="+X / DC Y"
                aria-label={`Row ${index + 1} attack bonus or DC`}
              />
              <Input
                value={row.damageAndType}
                onChange={(e) =>
                  handleFieldChange(row.id, "damageAndType", e.target.value)
                }
                className="h-8 text-sm"
                placeholder="1d8+X slashing"
                aria-label={`Row ${index + 1} damage and type`}
              />
              <Input
                value={row.notes}
                onChange={(e) =>
                  handleFieldChange(row.id, "notes", e.target.value)
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
                aria-label={`Remove row ${index + 1}`}
                title="Remove row"
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
