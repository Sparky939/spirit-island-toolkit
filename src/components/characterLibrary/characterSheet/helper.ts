import { AbilityTarget } from "../../../utils/BlueprintBrowser";
import { updateAt } from "../../../utils/referenceHelper";
import { CharacterBuildType, CharacterLevel } from "../characterBuilder/helper";
import { getScoreModifier } from "../helper";

export interface Class {
  name: string;
  levels: number;
}

export interface Feature {
  name: string;
  type:
    | "PHYSICAL"
    | "SPECIAL"
    | "SUPERNATURAL"
    | "FEAT"
    | "TRAIT"
    | "SPELL"
    | null;
  description: string;
  target: AbilityTarget;
  targetDescription: string | null;
  castTime: string | null;
  duration: string | null;
}

export interface SpellList {
  // Class / Mythic Path
  source: string;
  hasCantrips: boolean;
  // Max spell level available from source (6/9)
  // Is this needed?
  maxSpellLevel: number;
  spells: number[];
}

// Damage Reduction
export interface Reduction {
  value: number;
  exception: string;
}

// Energy Resistance
export interface Resistance {
  value: number;
  energyType: string;
}

export type Alignment =
  | "LG"
  | "NG"
  | "CG"
  | "LN"
  | "NN"
  | "CN"
  | "LE"
  | "NE"
  | "CE";

export interface CharacterSheetType {
  attributes: {
    str: number;
    strMod: number;
    dex: number;
    dexMod: number;
    con: number;
    conMod: number;
    int: number;
    intMod: number;
    wis: number;
    wisMod: number;
    cha: number;
    chaMod: number;
  };
  alignment: Alignment;
  classes: Class[];
  health: number;
  combat: {
    baseAttackBonus: number[];
    meleeAttackBonus: number[];
    rangedAttackBonus: number[];
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
  abilities: {
    special: Feature[];
    feats: Feature[];
    traits: Feature[];
    spells: Feature[];
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
  spells: SpellList[];
  martial: {
    weaponProf: string[];
    dr: Reduction[];
    er: Resistance[];
  };
}

function getBonusFromLevels(
  levels: CharacterLevel[],
  attr: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA"
): number {
  return levels.reduce((bonus: number, level) => {
    return bonus + (level.attrBonus === "STR" ? 1 : 0);
  }, 0);
}

class CharacterSheet implements CharacterSheetType {
  attributes: {
    str: number;
    strMod: number;
    dex: number;
    dexMod: number;
    con: number;
    conMod: number;
    int: number;
    intMod: number;
    wis: number;
    wisMod: number;
    cha: number;
    chaMod: number;
  };
  alignment: Alignment;
  classes: Class[];
  health: number;
  combat: {
    baseAttackBonus: number[];
    meleeAttackBonus: number[];
    rangedAttackBonus: number[];
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
  abilities: {
    special: Feature[];
    feats: Feature[];
    traits: Feature[];
    spells: Feature[];
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
  spells: SpellList[];
  martial: {
    weaponProf: string[];
    dr: Reduction[];
    er: Resistance[];
  };
  constructor(props: CharacterBuildType) {
    const attr = {
      str: props.base.statArray.str + getBonusFromLevels(props.plan, "STR"),
      dex: props.base.statArray.dex + getBonusFromLevels(props.plan, "DEX"),
      con: props.base.statArray.con + getBonusFromLevels(props.plan, "CON"),
      int: props.base.statArray.int + getBonusFromLevels(props.plan, "INT"),
      wis: props.base.statArray.wis + getBonusFromLevels(props.plan, "WIS"),
      cha: props.base.statArray.cha + getBonusFromLevels(props.plan, "CHA"),
    };
    this.attributes = {
      ...attr,
      strMod: getScoreModifier(attr.str),
      dexMod: getScoreModifier(attr.dex),
      conMod: getScoreModifier(attr.con),
      intMod: getScoreModifier(attr.int),
      wisMod: getScoreModifier(attr.wis),
      chaMod: getScoreModifier(attr.cha),
    };
    this.alignment = props.base.alignment;
    this.classes = props.plan.reduce((classes: Class[], level): Class[] => {
      const newClass = level.class;
      const currentClassIdx = classes.findIndex((c) => c.name === newClass);
      if (currentClassIdx === -1) {
        return [...classes, { name: newClass, levels: 1 }];
      }
      return updateAt(classes, currentClassIdx, (c) => ({
        ...c,
        levels: c.levels + 1,
      }));
    }, []);
    this.health = 0;
    this.combat = {
      baseAttackBonus: [],
      meleeAttackBonus: [],
      rangedAttackBonus: [],
      cmb: 0,
      cmd: 0,
      initiative: 0,
      spellResistance: 0,
    };
    this.defences = {
      ac: 0,
      flat: 0,
      touch: 0,
      fortSave: 0,
      refSave: 0,
      willSave: 0,
      speed: 0,
    };
    this.abilities = {
      special: [],
      feats: [],
      spells: [],
      traits: [],
    };
    this.skills = {
      athletics: 0,
      persuasion: 0,
      knwArcana: 0,
      knwWorld: 0,
      loreNature: 0,
      loreReligion: 0,
      mobility: 0,
      perception: 0,
      stealth: 0,
      trickery: 0,
      umd: 0,
    };
    this.spells = [];
    this.martial = {
      weaponProf: ["SIMPLE"],
      dr: [],
      er: [],
    };
  }
}

export default CharacterSheet;
