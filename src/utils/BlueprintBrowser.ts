// class BlueprintBrowser {
//   filteredBPs: SimpleBlueprint[] | null;
//   collatedBPs: SimpleBlueprint[] | null;
//   selectedCollatedBPs: SimpleBlueprint[] | null;
//   constructor() {
//     this.filteredBPs = null;
//     this.collatedBPs = null;
//     this.selectedCollatedBPs = null;
//   }
// }
import fs from "fs";
import { CharacterLevel } from "../components/characterLibrary/characterBuilder/helper";

import {
  Reduction,
  Resistance,
} from "../components/characterLibrary/characterSheet/helper";

// export default BlueprintBrowser;

// export interface SimpleBlueprint {
//   m_ValidationStatus: ValidationContext;
//   name: string;
//   assetGuid: BlueprintGuid;
//   m_AllElements: Element[];
//   name: string;
//   validationStatus: ValidationContext;
//   assetGuid: BlueprintGuid;
//   element: Element;
// }

// export interface ValidationContext {
//   m_ValidationStack: ValidationStack<Validated>;
//   m_Errors: Error[];
//   m_Fixups: Action<any>[];
//   validateEverything: boolean;
//   rawErrors: Error[];
//   rawFixups: Action<any>[];
//   errorsAdvanced: Error[];
//   hasErrors: boolean;
//   hasFixups: boolean;
//   errorsForHook: string[];
//   formattedValidationStack: string;
//   hasCircularDependencies: boolean;
//   errors: string[];
// }

// export enum ErrorLevel {
//   Unprioritized = 0,
//   Blocker = 1,
//   Critical = 2,
//   Normal = 3,
//   Minor = 4,
//   Trivial = 5,
//   Performance = 6,
// }

// export interface Error {
//   k__BackingField: ErrorLevel<Level>;
//   k__BackingField: Designers<Owner>;
//   active: boolean;
//   gameObject: string;
//   level: ErrorLevel;
//   messageFormat: string;
//   params: any[];
//   isShownInHook: boolean;
//   owner: Designers;
//   message: string;
// }

// class ValidationStack<T> {
//   m_ValidationStack: LinkedList<T>;
//   m_ElementsCounter: Dictionary<T, number>;
//   hasCircularDependencies: boolean;
// }

// export interface IdentityEqualityComparer {}

type BABProgression = "low" | "mid" | "high";
// TODO: specific health numbers;
type HPProgression = number;
type BaseSkillProgression = number;

interface AbilityProgression {
  level: number;
}
interface FeatProgression extends AbilityProgression {}
interface SpellProgression extends AbilityProgression {}

interface JSFeatBlueprint {
  featName: string;
  description: string;
  // names of any abilities provided by the feat
  linkedAbilities: string[];
}

interface ClassRequirement {
  className: string;
  requiredLevel: number;
  spellLevel: number;
}

export const ERRORS = {
  LOCATE_CLASS: "CLASS_NOT_FOUND",
} as const;

export type Error = ValueOf<typeof ERRORS>;
export type Errors = typeof ERRORS;

export type AbilityTarget =
  | "HOSTILE"
  | "ALLY"
  | "NEUTRAL"
  | "SELF"
  | "LOCATION"
  | "PB_HOSTILE"
  | "PB_ALLY"
  | "PB_NEUTRAL"
  | "HOSTILE_AOE"
  | "ALLY_AOE"
  | "NEUTRAL_AOE"
  | null;

export type SpellRange = "CLOSE" | "MEDIUM" | "LONG" | null;
export type SpellSave = "FORT" | "REF" | "WILL" | null;
export type SpellCastTime = "FREE" | "SWIFT" | "MOVE" | "STANDARD" | "ROUND";

interface JSSpellBlueprint {
  spellName: string;
  classRequired: ClassRequirement[];
  description: string;
  save: SpellSave;
  applySR: boolean;
  castTime: SpellCastTime;
  target: AbilityTarget;
  range: SpellRange;
}

interface SpellModifier {
  dc: number;
  effectiveLevel: number;
}

const WeaponTags = [
  "SLASHING",
  "PIERCING",
  "BASHING",
  "SIMPLE",
  "MARTIAL",
  "EXOTIC",
  "FINESSE",
  "LIGHT",
  "ONE-HANDED",
  "TWO-HANDED",
  "NATURAL",
  "UNARMED",
  "SPELL",
  "RAY",
  "TOUCH",
] as const;

const WeaponNames = [
  "Bardiche",
  "Bastard Sword",
  "Battle Axe",
  "Bite",
  "Bomb",
  "Claw",
  "Club",
  "Dagger",
  "Dart",
  "Dueling Sword",
  "Dwarven Urgrosh",
  "Dwarven Waraxe",
  "Earth Breaker",
  "Elven Curve Blade",
  "Estoc",
  "Falcata",
  "Falchion",
  "Fauchard",
  "Flail",
  "Glaive",
  "Gore",
  "Gnome Hooked Hammer",
  "Greataxe",
  "Greatclub",
  "Greatsword",
  "Hand Axe",
  "Hand Crossbow",
  "Heavy Crossbow",
  "Heavy Repeating Crossbow",
  "Heavy Flail",
  "Heavy Mace",
  "Heavy Shield Bash",
  "Javelin",
  "Kama",
  "Kinetic Blast",
  "Kukri",
  "Light Crossbow",
  "Light Repeating Crossbow",
  "Light Hammer",
  "Light Mace",
  "Light Pick",
  "Light Shield Bash",
  "Long Bow",
  "Longspear",
  "Longsword",
  "Nunchaku",
  "Orc Double Axe",
  "Other Natural Weapons",
  "Punching Dagger",
  "Quarterstaff",
  "Rapier",
  "Ray",
  "Sai",
  "Scimitar",
  "Scythe",
  "Short Bow",
  "Shortspear",
  "Shortsword",
  "Shuriken",
  "Siangham",
  "Sickle",
  "Sling",
  "Sling Staff",
  "Spear",
  "Spiked Heavy Shield Bash",
  "Spiked Light Shield Bash",
  "Starknife",
  "Tail",
  "Throwing Axe",
  "Tongi",
  "Touch",
  "Trident",
  "Two-bladed Sword",
  "Unarmed Strike",
  "WarHammer",
] as const;

const DamageTypes = [
  "SLASHING",
  "PIERCING",
  "BASHING",
  "FIRE",
  "COLD",
  "LIGHTNING",
  "ACID",
  "SONIC",
  "FORCE",
  "MISC",
] as const;

type WeaponTag = typeof WeaponTags[number];

type WeaponName = typeof WeaponNames[number];

type DamageType = typeof DamageTypes[number];

// {count}D{scale}
interface Dice {
  count: number;
  scale: number;
}

interface DamageDice extends Dice {
  damageType: DamageType;
}

function addingDice(a: Dice | Dice[], b: Dice): Dice | Dice[] {
  if (Array.isArray(a)) {
    const matchIdx = a.findIndex((d) => d.scale === b.scale);
    if (matchIdx > -1) {
      return a.map((d, idx) =>
        idx === matchIdx ? { ...d, count: d.count + b.count } : d
      );
    }
    return [...a, b];
  } else {
    if (a.scale === b.scale) {
      return {
        ...a,
        count: a.count + b.count,
      };
    } else {
      return [a, b];
    }
  }
}

function addingDamageDice(
  a: DamageDice | DamageDice[],
  b: DamageDice
): DamageDice | DamageDice[] {
  if (Array.isArray(a)) {
    const matchIdx = a.findIndex(
      (d) => d.damageType === b.damageType && d.scale === b.scale
    );
    if (matchIdx > -1) {
      return a.map((d, idx) =>
        idx === matchIdx ? { ...d, count: d.count + b.count } : d
      );
    }
    return [...a, b];
  } else {
    if (a.damageType === b.damageType && a.scale === b.scale) {
      return {
        ...a,
        count: a.count + b.count,
      };
    } else {
      return [a, b];
    }
  }
}

interface DamageBonus {
  baseDice: Dice | null;
  scalingDice: {
    // Initial dice
    dice: Dice | null;
    // level scaling starts at
    baseLevel: number;
    // number of levels between increments
    levelScaling: number;
    // dice to add
    incrementDice: Dice;
  } | null;
  modifier: number | null;
  scalingModifier: {
    // Initial modifier
    baseModifier: number;
    // level scaling starts at
    baseLevel: number;
    // number of levels between increments
    levelScaling: number;
    // modifier to add
    incrementModifier: number;
  } | null;
  damageType: DamageType;
}

interface WeaponModifier {
  requirment: (WeaponTag | WeaponName)[];
  hit: number;
  damage: number;
  // extra dice
  damageBonus: DamageBonus;
  threat: number;
  crit: number;
  critBonus: number;
}

interface ModifierObject {
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  health: number;
  combat: {
    baseAttackBonus: number;
    meleeAttackBonus: number;
    rangedAttackBonus: number;
    cmb: number;
    cmd: number;
    initiative: number;
    spellResistance: number;
  };
  defences: {
    ac: number;
    flat: number;
    touch: number;
    fortSave: number;
    refSave: number;
    willSave: number;
    speed: number;
  };
  skills: {
    athletics: number;
    persuasion: number;
    knwArcana: number;
    knwWorld: number;
    loreNature: number;
    loreReligion: number;
    mobility: number;
    perception: number;
    stealth: number;
    trickery: number;
    umd: number;
  };
  spells: {
    abjuration: SpellModifier;
    conjuration: SpellModifier;
    divination: SpellModifier;
    enchantment: SpellModifier;
    evocation: SpellModifier;
    illusion: SpellModifier;
    necromancy: SpellModifier;
    transmutation: SpellModifier;
    universal: SpellModifier;
  };
  martial: {
    weaponProf: WeaponModifier[];
    dr: Reduction[];
    er: Resistance[];
  };
}

interface RaceHeritage {
  name: string;
  description: string;
  feats: FeatProgression[];
  spellLikeAbilities: SpellProgression[];
  modifiers: ModifierObject;
  saveModifiers: {
    fort: number;
    ref: number;
    will: number;
  };
  skillModifiers: {
    athletics: number;
    mobility: number;
    trickery: number;
    stealth: number;
    knowArcana: number;
    knowWorld: number;
    loreNature: number;
    loreReligion: number;
    perception: number;
    persuasion: number;
    useMagicDevice: number;
  };
  damageReductions: Reduction[];
  resistances: Resistance[];
}

interface JSRaceBlueprint {
  raceName: string;
  heritages: RaceHeritage[];
}

interface JSClassBlueprint {
  className: string;
  maxLevel: number;
  babProgress: BABProgression;
  healthProgress: HPProgression;
  baseSkillProgress: BaseSkillProgression;
  featProgress: FeatProgression[];
  spellProgress: SpellProgression[];
  abilityProgress: AbilityProgression[];
}

interface Choice {
  name: string;
  options: Feat[] | Spell[] | Ability[];
}

interface Allocation {
  name: "ATTR" | "SKILL";
}

export interface BlueprintBrowserType {
  classes: JSClassBlueprint[];
  feats: JSFeatBlueprint[];
  spells: JSSpellBlueprint[];
  races: JSRaceBlueprint[];
  getClassLevel(
    characterLevel: number,
    className: string,
    classLevel: number
  ): (Allocation | Choice)[];
}

export class BlueprintBrowser implements BlueprintBrowserType {
  classes: JSClassBlueprint[];
  feats: JSFeatBlueprint[];
  spells: JSSpellBlueprint[];
  races: JSRaceBlueprint[];
  constructor() {
    this.classes = fs
      .readdirSync("./BlueprintExports/classes/")
      .map((f) => JSON.parse(f));
    this.feats = fs
      .readdirSync("./BlueprintExports/feats/")
      .map((f) => JSON.parse(f));
    this.spells = fs
      .readdirSync("./BlueprintExports/spells/")
      .map((f) => JSON.parse(f));
    this.races = fs
      .readdirSync("./BlueprintExports/races/")
      .map((f) => JSON.parse(f));
  }
  getClassLevel(
    characterLevel: number,
    className: string,
    classLevel: number
  ): (Allocation | Choice)[] {
    const choices: (Allocation | Choice)[] = [];
    return choices;
  }
  getClass(className: string): JSClassBlueprint | undefined {
    return this.classes.find((c) => c.className === className);
  }
  getClassMaxLevel(className: string): number | Errors["LOCATE_CLASS"] {
    const characterClass = this.getClass(className);
    return characterClass?.maxLevel || ERRORS.LOCATE_CLASS;
  }
  getLevelFeatures<T extends AbilityProgression>(
    classLevel: number,
    progress: T[]
  ): T[] {
    return progress.filter((f) => f.level === classLevel);
  }
  getClassProgression(
    className: string,
    classLevel: number
  ): JSClassBlueprint | Errors["LOCATE_CLASS"] {
    const characterClass = this.getClass(className);
    if (characterClass) {
      return {
        ...characterClass,
        featProgress: this.getLevelFeatures(
          classLevel,
          characterClass.featProgress
        ),
        spellProgress: this.getLevelFeatures(
          classLevel,
          characterClass.spellProgress
        ),
        abilityProgress: this.getLevelFeatures(
          classLevel,
          characterClass.abilityProgress
        ),
      };
    }
    return ERRORS.LOCATE_CLASS;
  }
}

export interface Blueprint {
  $type: string;
  m_Classes: { $id: string; $type: string; m_Class: string }[];
  m_Archetypes: [];
  m_AlternateProgressionClasses: [];
  // string - "Blueprint:id:FeatureName"
  m_UIDeterminatorsGroup: string[];
  m_ExclusiveProgression: string;
  LevelEntries: {
    $id: string;
    $type: string;
    m_Features: string[];
    Level: number;
  }[];
  UIGroups: {
    $id: string;
    $type: string;
    m_Features: string[];
  }[];
  m_FeatureRankIncrease: string;
  Groups: [];
  Ranks: number;
  IsClassFeature: boolean;
  IsPrerequisiteFor: [];
  m_DisplayName: string;
  m_Description: string;
  m_DescriptionShort: string;
  PrototypeLink: string;
  m_Overrides: [];
  Components: [];
  Comment: string;
  AssetGuid: {
    $id: string;
    $type: string;
  };
}

type FeatureType =
  | "CLASS"
  | "FEAT"
  | "ABILITY"
  | "SPELL"
  | "MYTHIC_PATH"
  | "MISC";

// Ignore Mythic Paths for now
export interface Feature {
  id: string;
  name: string;
  description: string;
  type: FeatureType;
  requirements: string[];
  components: string[];
  // isClass: boolean;
  // isMythicClass: boolean;
  referencedFeatures: string[];
}
