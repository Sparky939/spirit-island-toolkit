import { Alignment } from "../characterSheet/helper";

interface CharacterBase {
  race: string | null;
  heritage: string | null;
  statArray: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  background: string | null;
  alignment: Alignment;
}

interface Feature {
  name: string;
  type: "CLASS" | "LEVEL";
}

export interface CharacterLevel {
  class: string;
  level: number;
  features: Feature[];
  skills: string[];
  attrBonus: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA" | null;
  spells: string[];
}

interface MythicLevel {
  feat: string;
}

export interface CharacterBuildType {
  name: string;
  base: CharacterBase;
  plan: CharacterLevel[];
  mythicPlan: MythicLevel[];
}

export class CharacterBuilder implements CharacterBuildType {
  name: string;
  base: CharacterBase;
  plan: CharacterLevel[];
  mythicPlan: MythicLevel[];
  constructor() {
    this.name = "";
    this.base = {
      race: null,
      heritage: null,
      statArray: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      background: null,
      alignment: "NN",
    };
    this.plan = [];
    this.mythicPlan = [];
  }
  addLevel(className: string) {
    const nextLevel = this.plan.filter((l) => l.class === className).length + 1;
  }
}

export default CharacterBuilder;
