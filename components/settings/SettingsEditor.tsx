"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { AppSettings } from "@/lib/settings-store";

type SettingsEditorProps = {
  initialSettings: AppSettings;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SettingsEditor({ initialSettings }: SettingsEditorProps) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggle = async (checked: boolean) => {
    const optimistic: AppSettings = {
      ...settings,
      forsakenCovenant: checked,
    };
    setSettings(optimistic);
    setStatus("saving");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forsakenCovenant: checked }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save settings");
      }

      const next = (await res.json()) as AppSettings;
      setSettings(next);
      setStatus("saved");
    } catch (error: unknown) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Failed to save settings",
      );
    }
  };

  const statusLabel = (() => {
    if (status === "saving") return "Saving...";
    if (status === "saved") return "Saved";
    if (status === "error") return "Error saving";
    return "";
  })();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Settings are stored as JSON in <code>data/settings/settings.json</code>.
        </p>
      </header>

      <section className="flex flex-col gap-2 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="forsaken-convenant" className="text-sm">
            Forsaken Convenant
          </Label>
          <Switch
            id="forsaken-convenant"
            checked={settings.forsakenCovenant}
            onCheckedChange={handleToggle}
          />
        </div>
        {statusLabel ? (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{statusLabel}</p>
        ) : null}
        {errorMessage ? (
          <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
        ) : null}
      </section>
    </div>
  );
}
