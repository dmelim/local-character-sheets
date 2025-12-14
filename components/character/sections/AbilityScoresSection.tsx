"use client";

import * as React from "react";
import { getByPath } from "@/lib/path-utils";
import {
  abilityModifier,
  initiativeFromDexScore,
  passivePerceptionFromPerceptionMod,
  proficiencyBonusForLevel,
  savingThrowValue,
  skillModifierValue,
} from "@/lib/derived-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SectionProps } from "./types";
import { NumberField } from "../fields/NumberField";
import { DerivedStat } from "../fields/DerivedStat";
import { BooleanToggleField } from "../fields/BooleanToggleField";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

type Skill = { key: string; label: string };

type AbilityCardConfig = {
  ability: AbilityKey;
  title: string;
  skills: Skill[];
};

const ABILITY_CARDS: AbilityCardConfig[] = [
  {
    ability: "str",
    title: "Strength",
    skills: [{ key: "athletics", label: "Athletics" }],
  },
  {
    ability: "dex",
    title: "Dexterity",
    skills: [
      { key: "acrobatics", label: "Acrobatics" },
      { key: "sleightOfHand", label: "Sleight of Hand" },
      { key: "stealth", label: "Stealth" },
    ],
  },
  { ability: "con", title: "Constitution", skills: [] },
  {
    ability: "int",
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
    ability: "wis",
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
    ability: "cha",
    title: "Charisma",
    skills: [
      { key: "deception", label: "Deception" },
      { key: "intimidation", label: "Intimidation" },
      { key: "performance", label: "Performance" },
      { key: "persuasion", label: "Persuasion" },
    ],
  },
];

export function AbilityScoresSection({
  character,
  onFieldChange,
}: SectionProps) {
  const levelRaw = getByPath(character.data, "identity.level");
  const level = typeof levelRaw === "number" ? levelRaw : null;
  const proficiencyBonus = proficiencyBonusForLevel(level);

  const dexScoreRaw = getByPath(character.data, "abilities.dex.score");
  const dexScore = typeof dexScoreRaw === "number" ? dexScoreRaw : null;
  const derivedInitiative = initiativeFromDexScore(dexScore);
  const initiativeDisplay =
    typeof derivedInitiative === "number"
      ? derivedInitiative >= 0
        ? `d20 + ${derivedInitiative}`
        : `d20 - ${Math.abs(derivedInitiative)}`
      : "d20 + ?";

  const wisScoreRaw = getByPath(character.data, "abilities.wis.score");
  const wisScore = typeof wisScoreRaw === "number" ? wisScoreRaw : null;
  const perceptionProficient = Boolean(
    getByPath(character.data, "skills.perception.proficient")
  );
  const derivedPerceptionSkill = skillModifierValue(
    wisScore,
    perceptionProficient,
    proficiencyBonus
  );
  const derivedPassivePerception = passivePerceptionFromPerceptionMod(
    derivedPerceptionSkill
  );

  return (
    <section className="space-y-3">
      <Separator />
      <div className="flex flex-row gap-10 items-end">
        <h2 className="text-lg font-semibold">Abilities</h2>
        <div className="flex flex-row gap-20 items-center justify-center">
          <DerivedStat
            label="Proficiency"
            value={proficiencyBonus}
            tooltip="Derived from Level (1–4:+2, 5–8:+3, 9–12:+4, 13–16:+5, 17–20:+6)"
            width="xs"
          />

          <DerivedStat
            label="Initiative"
            value={derivedInitiative}
            tooltip="Initiative modifier = DEX modifier (roll d20 + this in play)"
            width="xs"
          />

          <DerivedStat
            label="Passive Perception"
            value={derivedPassivePerception}
            tooltip="Passive Perception = 10 + Perception modifier"
            width="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ABILITY_CARDS.map(({ ability, title, skills }) => {
          const scorePath = `abilities.${ability}.score`;
          const scoreRaw = getByPath(character.data, scorePath);
          const score = typeof scoreRaw === "number" ? scoreRaw : null;
          const mod = abilityModifier(score);

          const saveProfPath = `saves.${ability}.proficient`;
          const saveProficient = Boolean(
            getByPath(character.data, saveProfPath)
          );
          const saveDerived = savingThrowValue(
            score,
            saveProficient,
            proficiencyBonus
          );

          return (
            <Card key={ability} className="py-4">
              <CardHeader className="px-4 pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 px-4">
                <div className="flex items-center justify-between gap-4">
                  <NumberField
                    label="Score"
                    value={score}
                    onChange={(value) => onFieldChange(scorePath, value)}
                    width="md"
                    min={1}
                    max={30}
                    inputClassName="h-11 text-lg font-semibold"
                  />
                  <DerivedStat
                    label="Mod"
                    value={mod}
                    variant="box"
                    width="md"
                    className="gap-1"
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-2">
                  <div />
                  <div className="text-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Value
                  </div>
                  <div className="text-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Proficient
                  </div>

                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Saving Throw
                  </div>
                  <div className="flex justify-center">
                    <DerivedStat
                      label={`${title} Saving Throw`}
                      value={saveDerived}
                      hideLabel
                      layout="inline"
                      width="xs"
                    />
                  </div>
                  <div className="flex justify-center">
                    <BooleanToggleField
                      label={`${title} Save Proficient`}
                      checked={saveProficient}
                      onChange={(checked) =>
                        onFieldChange(saveProfPath, checked)
                      }
                      hideLabel
                      tooltip="Saving throw proficiency"
                    />
                  </div>

                  {skills.map((skill) => {
                    const profPath = `skills.${skill.key}.proficient`;
                    const proficient = Boolean(
                      getByPath(character.data, profPath)
                    );
                    const derived = skillModifierValue(
                      score,
                      proficient,
                      proficiencyBonus
                    );
                    return (
                      <React.Fragment key={skill.key}>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {skill.label}
                        </div>
                        <div className="flex justify-center">
                          <DerivedStat
                            label={skill.label}
                            value={derived}
                            hideLabel
                            layout="inline"
                            width="xs"
                          />
                        </div>
                        <div className="flex justify-center">
                          <BooleanToggleField
                            label={`${skill.label} Proficient`}
                            checked={proficient}
                            onChange={(checked) =>
                              onFieldChange(profPath, checked)
                            }
                            hideLabel
                            tooltip={`${skill.label} proficiency`}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
