"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Character } from "@/lib/character-types";
import { setByPath } from "@/lib/path-utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { OnFieldChange } from "./sections/types";
import { DeleteCharacterDialog } from "./DeleteCharacterDialog";
import { RenameCharacterDialog } from "./RenameCharacterDialog";
import { AbilityScoresSection } from "./sections/AbilityScoresSection";
import { ArmorHealthSurvivalSection } from "./sections/ArmorHealthSurvivalSection";
import { AttunementSection } from "./sections/AttunementSection";
import { BackstorySection } from "./sections/BackstorySection";
import { ClassFeaturesSection } from "./sections/ClassFeaturesSection";
import { EquipmentCoinsSection } from "./sections/EquipmentCoinsSection";
import { FeatsSection } from "./sections/FeatsSection";
import { IdentitySection } from "./sections/IdentitySection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { PreparedSpellsSection } from "./sections/PreparedSpellsSection";
import { ProficienciesSection } from "./sections/ProficienciesSection";
import { SavingThrowsSection } from "./sections/SavingThrowsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SpeciesTraitsSection } from "./sections/SpeciesTraitsSection";
import { SpellcastingSummarySection } from "./sections/SpellcastingSummarySection";
import { SpellSlotsSection } from "./sections/SpellSlotsSection";
import { AppearanceSection } from "./sections/AppearanceSection";
import { WeaponsSection } from "./sections/WeaponsSection";

type CharacterEditorProps = {
  initialCharacter: Character;
};

type SaveStatus = "idle" | "saving" | "saved" | "error" | "stale";

export function CharacterEditor({ initialCharacter }: CharacterEditorProps) {
  const router = useRouter();
  const [character, setCharacter] = React.useState<Character>(initialCharacter);
  const [pending, setPending] = React.useState<Record<string, unknown>>({});
  const [pendingName, setPendingName] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCharacter(initialCharacter);
    setPending({});
    setPendingName(null);
    setStatus("idle");
    setErrorMessage(null);
  }, [initialCharacter]);

  const handleFieldChange: OnFieldChange = (path, value) => {
    setCharacter((prev) => {
      const next: Character = { ...prev, data: { ...prev.data } };
      setByPath(next.data, path, value);
      if (path === "identity.characterName" && typeof value === "string") {
        next.name = value;
      }
      return next;
    });

    if (path === "identity.characterName" && typeof value === "string") {
      setPendingName(value);
    }

    setPending((prev) => ({ ...prev, [path]: value }));
  };

  React.useEffect(() => {
    const hasPending = Object.keys(pending).length > 0 || pendingName != null;
    if (!hasPending) return;

    setStatus("saving");
    setErrorMessage(null);

    const timeout = setTimeout(async () => {
      const snapshot = pending;
      const snapshotName = pendingName;
      const updates = Object.entries(snapshot).map(([path, value]) => ({
        path,
        value,
      }));

      try {
        const res = await fetch(`/api/characters/${character.id}/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedVersion: character.version,
            name: snapshotName ?? undefined,
            updates,
          }),
        });

        if (!res.ok) {
          if (res.status === 409) {
            setStatus("stale");
            setErrorMessage("Changes were stale. Reloading latest data...");

            const reloadRes = await fetch(`/api/characters/${character.id}`);
            if (!reloadRes.ok) {
              throw new Error("Failed to reload character after conflict");
            }

            const fresh = (await reloadRes.json()) as Character;
            setCharacter(fresh);
            setPending({});
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

        setPending((prev) => {
          const next = { ...prev };
          for (const [path, value] of Object.entries(snapshot)) {
            if (next[path] === value) {
              delete next[path];
            }
          }
          return next;
        });
        setPendingName((prev) => (prev === snapshotName ? null : prev));
        setStatus("saved");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error?.message || "Failed to save changes");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [character.id, character.version, pending, pendingName]);

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

      <div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <IdentitySection
              character={character}
              onFieldChange={handleFieldChange}
            />
            <ArmorHealthSurvivalSection
              character={character}
              onFieldChange={handleFieldChange}
            />
          </div>

          <AbilityScoresSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <SavingThrowsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <SkillsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <WeaponsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <ClassFeaturesSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <SpeciesTraitsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <FeatsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <ProficienciesSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <SpellcastingSummarySection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <SpellSlotsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <PreparedSpellsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <AppearanceSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <BackstorySection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <LanguagesSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <EquipmentCoinsSection
            character={character}
            onFieldChange={handleFieldChange}
          />
          <AttunementSection
            character={character}
            onFieldChange={handleFieldChange}
          />
        </div>
      </div>
    </div>
  );
}
