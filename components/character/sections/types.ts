import type { Character } from "@/lib/character-types";

export type OnFieldChange = (path: string, value: unknown) => void;

export type SectionProps = {
  character: Character;
  onFieldChange: OnFieldChange;
};

