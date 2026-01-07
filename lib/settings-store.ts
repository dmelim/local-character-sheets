import { promises as fs } from "fs";
import path from "path";

export type AppSettings = {
  schemaVersion: 1;
  updatedAt: string; // ISO string
  forsakenCovenant: boolean;
};

const SETTINGS_DIR = path.join(process.cwd(), "data", "settings");
const SETTINGS_FILE = path.join(SETTINGS_DIR, "settings.json");

async function ensureSettingsDir(): Promise<void> {
  await fs.mkdir(SETTINGS_DIR, { recursive: true });
}

function defaultSettings(): AppSettings {
  return {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    forsakenCovenant: false,
  };
}

async function atomicWriteSettings(settings: AppSettings): Promise<void> {
  await ensureSettingsDir();
  const tempPath = `${SETTINGS_FILE}.tmp-${Math.random().toString(36).slice(2)}`;
  const data = JSON.stringify(settings, null, 2);
  await fs.writeFile(tempPath, data, "utf8");
  await fs.rename(tempPath, SETTINGS_FILE);
}

export async function loadSettings(): Promise<AppSettings> {
  await ensureSettingsDir();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    const base = defaultSettings();
    const merged: AppSettings = {
      ...base,
      ...parsed,
      schemaVersion: 1,
      forsakenCovenant: Boolean(parsed.forsakenCovenant),
      updatedAt:
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : base.updatedAt,
    };

    return merged;
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: unknown }).code
        : undefined;
    if (code === "ENOENT" || code === "ENOTDIR") {
      const initial = defaultSettings();
      await atomicWriteSettings(initial);
      return initial;
    }
    throw error;
  }
}

export async function saveSettings(next: AppSettings): Promise<AppSettings> {
  const normalized: AppSettings = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    forsakenCovenant: Boolean(next.forsakenCovenant),
  };
  await atomicWriteSettings(normalized);
  return normalized;
}

export async function updateSettings(
  patch: Partial<Pick<AppSettings, "forsakenCovenant">>,
): Promise<AppSettings> {
  const current = await loadSettings();
  return saveSettings({
    ...current,
    forsakenCovenant:
      typeof patch.forsakenCovenant === "boolean"
        ? patch.forsakenCovenant
        : current.forsakenCovenant,
  });
}
