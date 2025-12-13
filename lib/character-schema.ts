export type FieldType = "string" | "number" | "boolean";

export type FieldDef = {
  path: string;
  label: string;
  type: FieldType;
  section: string;
  multiline?: boolean;
};

export const fields: FieldDef[] = [
  // Identity
  { path: "identity.characterName", label: "Character Name", type: "string", section: "Identity" },
  { path: "identity.background", label: "Background", type: "string", section: "Identity" },
  { path: "identity.class", label: "Class", type: "string", section: "Identity" },
  { path: "identity.subclass", label: "Subclass", type: "string", section: "Identity" },
  { path: "identity.species", label: "Species", type: "string", section: "Identity" },
  { path: "identity.level", label: "Level", type: "number", section: "Identity" },
  { path: "identity.xp", label: "XP", type: "number", section: "Identity" },

  // Core Stats
  { path: "core.proficiencyBonus", label: "Proficiency Bonus", type: "number", section: "Core Stats" },
  { path: "core.initiative", label: "Initiative", type: "number", section: "Core Stats" },
  { path: "core.speed", label: "Speed", type: "number", section: "Core Stats" },
  { path: "core.size", label: "Size", type: "string", section: "Core Stats" },
  { path: "core.passivePerception", label: "Passive Perception", type: "number", section: "Core Stats" },

  // Defense
  { path: "defense.armorClass", label: "Armor Class", type: "number", section: "Defense" },
  { path: "defense.shield", label: "Shield", type: "boolean", section: "Defense" },

  // Hit Points
  { path: "hp.current", label: "Current HP", type: "number", section: "Hit Points" },
  { path: "hp.max", label: "Max HP", type: "number", section: "Hit Points" },
  { path: "hp.temp", label: "Temp HP", type: "number", section: "Hit Points" },

  // Hit Dice
  { path: "hitDice.max", label: "Hit Dice Max", type: "string", section: "Hit Dice" },
  { path: "hitDice.spent", label: "Hit Dice Spent", type: "string", section: "Hit Dice" },

  // Death Saves
  { path: "deathSaves.successes", label: "Successes", type: "number", section: "Death Saves" },
  { path: "deathSaves.failures", label: "Failures", type: "number", section: "Death Saves" },

  // Heroic Inspiration
  { path: "inspiration.heroic", label: "Heroic Inspiration", type: "boolean", section: "Heroic Inspiration" },

  // Ability Scores (modifiers are derived in the UI)
  { path: "abilities.str.score", label: "STR Score", type: "number", section: "Ability Scores" },
  { path: "abilities.dex.score", label: "DEX Score", type: "number", section: "Ability Scores" },
  { path: "abilities.con.score", label: "CON Score", type: "number", section: "Ability Scores" },
  { path: "abilities.int.score", label: "INT Score", type: "number", section: "Ability Scores" },
  { path: "abilities.wis.score", label: "WIS Score", type: "number", section: "Ability Scores" },
  { path: "abilities.cha.score", label: "CHA Score", type: "number", section: "Ability Scores" },

  // Saving Throws
  { path: "saves.str.proficient", label: "STR Save Proficient", type: "boolean", section: "Saving Throws" },
  { path: "saves.str.value", label: "STR Save", type: "number", section: "Saving Throws" },
  { path: "saves.dex.proficient", label: "DEX Save Proficient", type: "boolean", section: "Saving Throws" },
  { path: "saves.dex.value", label: "DEX Save", type: "number", section: "Saving Throws" },
  { path: "saves.con.proficient", label: "CON Save Proficient", type: "boolean", section: "Saving Throws" },
  { path: "saves.con.value", label: "CON Save", type: "number", section: "Saving Throws" },
  { path: "saves.int.proficient", label: "INT Save Proficient", type: "boolean", section: "Saving Throws" },
  { path: "saves.int.value", label: "INT Save", type: "number", section: "Saving Throws" },
  { path: "saves.wis.proficient", label: "WIS Save Proficient", type: "boolean", section: "Saving Throws" },
  { path: "saves.wis.value", label: "WIS Save", type: "number", section: "Saving Throws" },
  { path: "saves.cha.proficient", label: "CHA Save Proficient", type: "boolean", section: "Saving Throws" },
  { path: "saves.cha.value", label: "CHA Save", type: "number", section: "Saving Throws" },

  // Skills
  { path: "skills.athletics.proficient", label: "Athletics Proficient", type: "boolean", section: "Skills" },
  { path: "skills.athletics.value", label: "Athletics", type: "number", section: "Skills" },
  { path: "skills.acrobatics.proficient", label: "Acrobatics Proficient", type: "boolean", section: "Skills" },
  { path: "skills.acrobatics.value", label: "Acrobatics", type: "number", section: "Skills" },
  { path: "skills.sleightOfHand.proficient", label: "Sleight of Hand Proficient", type: "boolean", section: "Skills" },
  { path: "skills.sleightOfHand.value", label: "Sleight of Hand", type: "number", section: "Skills" },
  { path: "skills.stealth.proficient", label: "Stealth Proficient", type: "boolean", section: "Skills" },
  { path: "skills.stealth.value", label: "Stealth", type: "number", section: "Skills" },
  { path: "skills.arcana.proficient", label: "Arcana Proficient", type: "boolean", section: "Skills" },
  { path: "skills.arcana.value", label: "Arcana", type: "number", section: "Skills" },
  { path: "skills.history.proficient", label: "History Proficient", type: "boolean", section: "Skills" },
  { path: "skills.history.value", label: "History", type: "number", section: "Skills" },
  { path: "skills.investigation.proficient", label: "Investigation Proficient", type: "boolean", section: "Skills" },
  { path: "skills.investigation.value", label: "Investigation", type: "number", section: "Skills" },
  { path: "skills.nature.proficient", label: "Nature Proficient", type: "boolean", section: "Skills" },
  { path: "skills.nature.value", label: "Nature", type: "number", section: "Skills" },
  { path: "skills.religion.proficient", label: "Religion Proficient", type: "boolean", section: "Skills" },
  { path: "skills.religion.value", label: "Religion", type: "number", section: "Skills" },
  { path: "skills.animalHandling.proficient", label: "Animal Handling Proficient", type: "boolean", section: "Skills" },
  { path: "skills.animalHandling.value", label: "Animal Handling", type: "number", section: "Skills" },
  { path: "skills.insight.proficient", label: "Insight Proficient", type: "boolean", section: "Skills" },
  { path: "skills.insight.value", label: "Insight", type: "number", section: "Skills" },
  { path: "skills.medicine.proficient", label: "Medicine Proficient", type: "boolean", section: "Skills" },
  { path: "skills.medicine.value", label: "Medicine", type: "number", section: "Skills" },
  { path: "skills.perception.proficient", label: "Perception Proficient", type: "boolean", section: "Skills" },
  { path: "skills.perception.value", label: "Perception", type: "number", section: "Skills" },
  { path: "skills.survival.proficient", label: "Survival Proficient", type: "boolean", section: "Skills" },
  { path: "skills.survival.value", label: "Survival", type: "number", section: "Skills" },
  { path: "skills.deception.proficient", label: "Deception Proficient", type: "boolean", section: "Skills" },
  { path: "skills.deception.value", label: "Deception", type: "number", section: "Skills" },
  { path: "skills.intimidation.proficient", label: "Intimidation Proficient", type: "boolean", section: "Skills" },
  { path: "skills.intimidation.value", label: "Intimidation", type: "number", section: "Skills" },
  { path: "skills.performance.proficient", label: "Performance Proficient", type: "boolean", section: "Skills" },
  { path: "skills.performance.value", label: "Performance", type: "number", section: "Skills" },
  { path: "skills.persuasion.proficient", label: "Persuasion Proficient", type: "boolean", section: "Skills" },
  { path: "skills.persuasion.value", label: "Persuasion", type: "number", section: "Skills" },

  // Weapons & Damage Cantrips
  {
    path: "attacks.entries",
    label: "Weapons & Damage / Cantrips (JSON)",
    type: "string",
    section: "Weapons & Damage Cantrips",
    multiline: true,
  },

  // Class Features
  {
    path: "features.classFeatures",
    label: "Class Features",
    type: "string",
    section: "Class Features",
    multiline: true,
  },

  // Species Traits
  {
    path: "features.speciesTraits",
    label: "Species Traits",
    type: "string",
    section: "Species Traits",
    multiline: true,
  },

  // Feats
  {
    path: "features.feats",
    label: "Feats",
    type: "string",
    section: "Feats",
    multiline: true,
  },

  // Equipment Training & Proficiencies
  { path: "proficiencies.armor.light", label: "Light Armor Training", type: "boolean", section: "Equipment Training & Proficiencies" },
  { path: "proficiencies.armor.medium", label: "Medium Armor Training", type: "boolean", section: "Equipment Training & Proficiencies" },
  { path: "proficiencies.armor.heavy", label: "Heavy Armor Training", type: "boolean", section: "Equipment Training & Proficiencies" },
  { path: "proficiencies.armor.shields", label: "Shields Training", type: "boolean", section: "Equipment Training & Proficiencies" },
  {
    path: "proficiencies.weapons",
    label: "Weapons",
    type: "string",
    section: "Equipment Training & Proficiencies",
    multiline: true,
  },
  {
    path: "proficiencies.tools",
    label: "Tools",
    type: "string",
    section: "Equipment Training & Proficiencies",
    multiline: true,
  },

  // Spellcasting Overview
  { path: "spellcasting.ability", label: "Spellcasting Ability", type: "string", section: "Spellcasting Overview" },
  { path: "spellcasting.modifier", label: "Spellcasting Modifier", type: "number", section: "Spellcasting Overview" },
  { path: "spellcasting.saveDc", label: "Spell Save DC", type: "number", section: "Spellcasting Overview" },
  { path: "spellcasting.attackBonus", label: "Spell Attack Bonus", type: "number", section: "Spellcasting Overview" },

  // Spell Slots
  ...Array.from({ length: 9 }, (_, i) => {
    const level = i + 1;
    return [
      {
        path: `spellSlots.level${level}.total`,
        label: `Level ${level} Total`,
        type: "number",
        section: "Spell Slots",
      } as FieldDef,
      {
        path: `spellSlots.level${level}.expended`,
        label: `Level ${level} Expended`,
        type: "number",
        section: "Spell Slots",
      } as FieldDef,
    ];
  }).flat(),

  // Cantrips & Prepared Spells
  {
    path: "spells.prepared",
    label: "Cantrips & Prepared Spells",
    type: "string",
    section: "Cantrips & Prepared Spells",
    multiline: true,
  },

  // Backstory & Personality
  {
    path: "roleplay.backstoryAndPersonality",
    label: "Backstory & Personality",
    type: "string",
    section: "Backstory & Personality",
    multiline: true,
  },
  { path: "roleplay.alignment", label: "Alignment", type: "string", section: "Backstory & Personality" },

  // Appearance
  {
    path: "roleplay.appearance",
    label: "Appearance",
    type: "string",
    section: "Appearance",
    multiline: true,
  },

  // Languages
  {
    path: "roleplay.languages",
    label: "Languages",
    type: "string",
    section: "Languages",
    multiline: true,
  },

  // Equipment
  {
    path: "inventory.equipment",
    label: "Equipment",
    type: "string",
    section: "Equipment",
    multiline: true,
  },

  // Coins
  { path: "inventory.coins.cp", label: "CP", type: "number", section: "Coins" },
  { path: "inventory.coins.sp", label: "SP", type: "number", section: "Coins" },
  { path: "inventory.coins.ep", label: "EP", type: "number", section: "Coins" },
  { path: "inventory.coins.gp", label: "GP", type: "number", section: "Coins" },
  { path: "inventory.coins.pp", label: "PP", type: "number", section: "Coins" },

  // Magic Item Attunement
  { path: "inventory.attunement.slot1", label: "Attunement Slot 1", type: "string", section: "Magic Item Attunement" },
  { path: "inventory.attunement.slot2", label: "Attunement Slot 2", type: "string", section: "Magic Item Attunement" },
  { path: "inventory.attunement.slot3", label: "Attunement Slot 3", type: "string", section: "Magic Item Attunement" },
];

export const fieldByPath: Record<string, FieldDef> = Object.fromEntries(
  fields.map((field) => [field.path, field]),
);

export function getSections(): string[] {
  return Array.from(new Set(fields.map((f) => f.section)));
}

export function getFieldsBySection(section: string): FieldDef[] {
  return fields.filter((f) => f.section === section);
}
