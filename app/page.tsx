import { listCharacters } from "@/lib/character-store";
import { CreateCharacterDialog } from "@/components/character/CreateCharacterDialog";
import { CharacterCard } from "@/components/character/CharacterCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const characters = await listCharacters();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Sheetforge</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Local/LAN D&amp;D 2024 character sheets.
            </p>
          </div>
          <CreateCharacterDialog />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Characters are stored as JSON in <code>data/characters/</code> on disk.
        </p>
      </header>

      {characters.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          <p>No characters yet. Create one to get started.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
            />
          ))}
        </section>
      )}
    </main>
  );
}
