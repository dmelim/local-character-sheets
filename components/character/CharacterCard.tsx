"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CharacterListItem } from "@/lib/character-types";
import { DeleteCharacterDialog } from "./DeleteCharacterDialog";

type CharacterCardProps = {
  character: CharacterListItem;
};

export function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();
  const characterName = character.name || "Unnamed Character";

  const updated = new Date(character.updatedAt);
  const updatedLabel = Number.isNaN(updated.getTime())
    ? character.updatedAt
    : updated.toLocaleString();

  const handleClick = () => {
    router.push(`/c/${character.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="h-auto cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
    >
      <CardHeader>
        <CardTitle className="truncate">{characterName}</CardTitle>
        <CardAction>
          <DeleteCharacterDialog
            id={character.id}
            name={characterName}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-red-600"
                aria-label={`Delete ${characterName}`}
                title="Delete character"
                onClick={(event) => event.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Updated: <span>{updatedLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}
