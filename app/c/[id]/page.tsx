import { notFound } from "next/navigation";
import { loadCharacter } from "@/lib/character-store";
import { CharacterEditor } from "@/components/character/CharacterEditor";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;
  let character = null;
  try {
    character = await loadCharacter(id);
  } catch (error: any) {
    if (error instanceof Error && error.message === "Invalid character id") {
      notFound();
    }
    throw error;
  }

  if (!character) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <CharacterEditor initialCharacter={character} />
    </main>
  );
}
