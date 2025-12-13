"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/lib/character-types";
import { getFieldsBySection, getSections } from "@/lib/character-schema";
import { getByPath, setByPath } from "@/lib/path-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RenameCharacterDialog } from "./RenameCharacterDialog";
import { DeleteCharacterDialog } from "./DeleteCharacterDialog";
import { Section } from "./Section";
import { FieldRenderer } from "./FieldRenderer";
import { ArrowLeft } from "lucide-react";

type CharacterEditorProps = {
  initialCharacter: Character;
};

type PendingUpdate = {
  path: string;
  value: unknown;
};

type SaveStatus = "idle" | "saving" | "saved" | "error" | "stale";

export function CharacterEditor({ initialCharacter }: CharacterEditorProps) {
  const router = useRouter();
  const [character, setCharacter] = React.useState<Character>(initialCharacter);
  const [pendingUpdates, setPendingUpdates] = React.useState<PendingUpdate[]>(
    []
  );
  const [pendingName, setPendingName] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Reset local state if the initial character changes (navigate between ids without reload).
  React.useEffect(() => {
    setCharacter(initialCharacter);
    setPendingUpdates([]);
    setPendingName(null);
    setStatus("idle");
    setErrorMessage(null);
  }, [initialCharacter]);

  const handleFieldChange = (path: string, value: unknown) => {
    setCharacter((prev) => {
      const next: Character = {
        ...prev,
        data: { ...prev.data },
      };
      setByPath(next.data, path, value);

      if (path === "identity.characterName" && typeof value === "string") {
        next.name = value;
      }

      return next;
    });

    if (path === "identity.characterName" && typeof value === "string") {
      setPendingName(value);
      // Do not enqueue a separate data update for the name field;
      // the server will keep data.identity.characterName in sync.
      return;
    }

    setPendingUpdates((prev) => {
      const existingIndex = prev.findIndex((u) => u.path === path);
      const update: PendingUpdate = { path, value };
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = update;
        return copy;
      }
      return [...prev, update];
    });
  };

  // Debounced autosave effect.
  React.useEffect(() => {
    if (pendingUpdates.length === 0 && !pendingName) {
      return;
    }

    setStatus("saving");
    setErrorMessage(null);

    const timeout = setTimeout(async () => {
      const body = {
        expectedVersion: character.version,
        name: pendingName ?? undefined,
        updates: pendingUpdates,
      };

      try {
        const res = await fetch(`/api/characters/${character.id}/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          if (res.status === 409) {
            setStatus("stale");
            setErrorMessage("Changes were stale. Reloading latest data...");

            // Reload character from server to resolve version mismatch.
            const reloadRes = await fetch(`/api/characters/${character.id}`);
            if (!reloadRes.ok) {
              throw new Error("Failed to reload character after conflict");
            }
            const fresh = (await reloadRes.json()) as Character;
            setCharacter(fresh);
            setPendingUpdates([]);
            setPendingName(null);
            setStatus("idle");
            setErrorMessage(
              "Character reloaded due to changes from another client."
            );
            return;
          }

          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to save changes");
        }

        const data = (await res.json()) as {
          version: number;
          updatedAt: string;
        };

        setCharacter((prev) => ({
          ...prev,
          version: data.version,
          updatedAt: data.updatedAt,
        }));

        setPendingUpdates([]);
        setPendingName(null);
        setStatus("saved");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error?.message || "Failed to save changes");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [character.id, character.version, pendingUpdates, pendingName]);

  const sections = getSections();
  const abilitySectionName = "Ability Scores";
  const abilityScoreFields = getFieldsBySection(abilitySectionName).filter((field) =>
    field.path.endsWith(".score"),
  );

  const statusLabel = (() => {
    if (status === "saving") return "Saving...";
    if (status === "saved") {
      const date = new Date(character.updatedAt);
      const label = Number.isNaN(date.getTime())
        ? character.updatedAt
        : date.toLocaleTimeString();
      return `Saved at ${label}`;
    }
    if (status === "stale") return "Stale data resolved";
    if (status === "error") return "Error saving changes";
    return "";
  })();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-semibold">
              {character.name || "Unnamed Character"}
            </h1>
          </div>
          <div className="flex gap-2">
            <RenameCharacterDialog
              id={character.id}
              name={character.name}
              version={character.version}
            />
            <DeleteCharacterDialog
              id={character.id}
              name={character.name || "Unnamed Character"}
              redirectTo="/"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <span>ID: {character.id}</span>
          <Separator orientation="vertical" className="h-4 w-px" />
          <span>Version: {character.version}</span>
          {statusLabel ? (
            <>
              <Separator orientation="vertical" className="h-4 w-px" />
              <span>{statusLabel}</span>
            </>
          ) : null}
        </div>
        {errorMessage ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        ) : null}
      </header>

      <ScrollArea className="flex-1 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="space-y-6">
          {abilityScoreFields.length > 0 ? (
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">Ability Scores</h2>
                <Separator className="mt-1" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {abilityScoreFields.map((field) => {
                  const rawScore = getByPath(character.data, field.path);
                  const score = typeof rawScore === "number" ? rawScore : null;
                  const modifier =
                    typeof score === "number"
                      ? Math.floor((score - 10) / 2)
                      : null;
                  const modifierLabel =
                    typeof modifier === "number"
                      ? `${modifier >= 0 ? "+" : ""}${modifier}`
                      : "—";

                  return (
                    <div
                      key={field.path}
                      className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
                    >
                      <div className="flex-1">
                        <FieldRenderer
                          field={field}
                          value={rawScore}
                          onChange={(value) => handleFieldChange(field.path, value)}
                        />
                      </div>
                      <div className="min-w-[3rem] rounded-md bg-zinc-100 px-2 py-1 text-center text-sm font-semibold tabular-nums text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
                        {modifierLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {sections
            .filter((sectionName) => sectionName !== abilitySectionName)
            .map((sectionName) => (
              <Section
                key={sectionName}
                title={sectionName}
              >
                {getFieldsBySection(sectionName).map((field) => (
                  <FieldRenderer
                    key={field.path}
                    field={field}
                    value={getByPath(character.data, field.path)}
                    onChange={(value) => handleFieldChange(field.path, value)}
                  />
                ))}
              </Section>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
