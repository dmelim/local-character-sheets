export type Character = {
  schemaVersion: 1;
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  version: number;
  data: Record<string, unknown>;
};

export type CharacterListItem = Pick<Character, "id" | "name" | "updatedAt" | "version">;

export type CharacterUpdate = {
  path: string;
  value: unknown;
};

export type BatchedUpdateRequest = {
  expectedVersion: number;
  name?: string;
  updates: CharacterUpdate[];
};

export type RenameRequest = {
  name: string;
  expectedVersion: number;
};

