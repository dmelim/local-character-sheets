"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterListItem } from "@/lib/character-types";

type CharacterCardProps = {
  character: CharacterListItem;
};

export function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();

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
        <CardTitle className="truncate">{character.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Updated: <span>{updatedLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}
