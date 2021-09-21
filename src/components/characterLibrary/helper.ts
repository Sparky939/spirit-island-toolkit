// TODO: List all class names as union
type ClassName = string;

interface ClassFeature {
  name: string;
  level: number;
}

interface Archetype {}

interface CharacterClass {
  id: string;
  name: string;
  archetype: Archetype;
  level: number;
  features: ClassFeature[];
}

interface CharacterRace {
  id: string;
  name: string;
}

interface Feature {
  name: string;
  source: string;
}

interface Level {
  features: Feature[];
}

interface Build {
  baseScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  levels: Level[];
}

type Alignment = "LG" | "NG" | "CG" | "LN" | "NN" | "CN" | "LE" | "NE" | "CE";
// TODO: List explicit Deity properties
interface Deity {
  name: string;
  domains: string[];
}

interface Character {
  name: string;
  alignment: Alignment;
  deity: Deity;
  race: CharacterRace;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  health: number;
  armorClass: number;
  touchArmorClass: number;
  flatArmorClass: number;
  CMD: number;
  CMB: number;
  baseAttackBonus: number;
  baseMoveSpeed: number;
  mainHand: Weapon;
  offHand: Weapon;
}

interface DamageDice {
  amount: number;
  size: number;
}

interface Weapon {
  attackBonus: number;
  damageDice: DamageDice;
}

function getScoreModifier(score: number): number {
  return (score - 10) / 2;
}

function createNewLevel() {}

function getModifierBreakdown(reference: string) {}

export { getScoreModifier };
