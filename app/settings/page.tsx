import Link from "next/link";
import { loadSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { SettingsEditor } from "@/components/settings/SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await loadSettings();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back</Link>
        </Button>
      </div>
      <SettingsEditor initialSettings={settings} />
    </main>
  );
}

