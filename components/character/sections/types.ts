import type { Character } from "@/lib/character-types";
import type { AppSettings } from "@/lib/settings-store";

export type OnFieldChange = (path: string, value: unknown) => void;

export type SectionProps = {
  character: Character;
  onFieldChange: OnFieldChange;
  settings?: AppSettings;
};
