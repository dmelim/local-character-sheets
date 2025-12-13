"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { BooleanToggleField } from "../fields/BooleanToggleField";
import { NumberField } from "../fields/NumberField";

type Skill = {
  key: string;
  label: string;
};

type AbilityGroup = {
  title: string;
  skills: Skill[];
};

const GROUPS: AbilityGroup[] = [
  { title: "Strength", skills: [{ key: "athletics", label: "Athletics" }] },
  {
    title: "Dexterity",
    skills: [
      { key: "acrobatics", label: "Acrobatics" },
      { key: "sleightOfHand", label: "Sleight of Hand" },
      { key: "stealth", label: "Stealth" },
    ],
  },
  {
    title: "Intelligence",
    skills: [
      { key: "arcana", label: "Arcana" },
      { key: "history", label: "History" },
      { key: "investigation", label: "Investigation" },
      { key: "nature", label: "Nature" },
      { key: "religion", label: "Religion" },
    ],
  },
  {
    title: "Wisdom",
    skills: [
      { key: "animalHandling", label: "Animal Handling" },
      { key: "insight", label: "Insight" },
      { key: "medicine", label: "Medicine" },
      { key: "perception", label: "Perception" },
      { key: "survival", label: "Survival" },
    ],
  },
  {
    title: "Charisma",
    skills: [
      { key: "deception", label: "Deception" },
      { key: "intimidation", label: "Intimidation" },
      { key: "performance", label: "Performance" },
      { key: "persuasion", label: "Persuasion" },
    ],
  },
];

export function SkillsSection({ character, onFieldChange }: SectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Skills</h2>
        <Separator className="mt-1" />
      </div>

      <div className="space-y-5">
        {GROUPS.map((group) => (
          <div
            key={group.title}
            className="space-y-2"
          >
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {group.title}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {group.skills.flatMap((skill) => {
                const profPath = `skills.${skill.key}.proficient`;
                const valuePath = `skills.${skill.key}.value`;

                const profLabel = `${skill.label} Proficient`;
                const valueLabel = skill.label;

                const valueRaw = getByPath(character.data, valuePath);

                return [
                  <BooleanToggleField
                    key={profPath}
                    label={profLabel}
                    checked={Boolean(getByPath(character.data, profPath))}
                    onChange={(checked) => onFieldChange(profPath, checked)}
                  />,
                  <NumberField
                    key={valuePath}
                    label={valueLabel}
                    value={typeof valueRaw === "number" ? valueRaw : null}
                    onChange={(value) => onFieldChange(valuePath, value)}
                    width="xs"
                  />,
                ];
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

