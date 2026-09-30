function rebuyable(config) {
  const effectFunction = config.effect || (x => x);
  const { name, id, maxUpgrades, description, isDisabled, noLabel, onPurchased } = config;
  return {
    rebuyable: true,
    name,
    id,
    cost: () => new Decimal(config.initialCost).times(
      Decimal.pow(config.costIncrease, player.endgame.largeHadronCollider.void.rebuyables[config.id])),
    maxUpgrades,
    description,
    effect: () => effectFunction(player.endgame.largeHadronCollider.void.rebuyables[config.id]),
    isDisabled,
    formatEffect: config.formatEffect,
    formatCost: value => formatPostBreak(value, 2, 0),
    noLabel,
    onPurchased
  };
}

export const nullUpgrades = {
  antimatterDimensionMult: rebuyable({
    name: "Empty Energy",
    id: 0,
    initialCost: 100,
    costIncrease: 10,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow10(Math.pow(value, 2)),
    description: () => `Multiply all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`,
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  infinityPointMult: rebuyable({
    name: "Vacant Vastness",
    id: 1,
    initialCost: 10000,
    costIncrease: 100,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow10(Math.pow(value, 2)),
    description: () => "Multiply Infinity Point Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  infinityMult: rebuyable({
    name: "Abandoned Abundance",
    id: 2,
    initialCost: 1e6,
    costIncrease: 1000,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow(1.25, value),
    description: () => "Multiply Infinity Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    noLabel: false
  }),
  infinityDimensionMult: rebuyable({
    name: "Ineffective Infinities",
    id: 3,
    initialCost: 1e8,
    costIncrease: 10000,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow10(Math.pow(value, 2)),
    description: () => "Multiply all Infinity Dimensions",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  replicantiSpeedMult: rebuyable({
    name: "Desolate Duplication",
    id: 4,
    initialCost: 1e10,
    costIncrease: 100000,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow(1.25, value),
    description: () => "Multiply Replicanti Speed",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    noLabel: false
  }),
  eternityPointMult: rebuyable({
    name: "Immortal Idleness",
    id: 5,
    initialCost: 1e12,
    costIncrease: 1e6,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow10(Math.pow(value, 2)),
    description: () => "Multiply Eternity Point Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  timeDimensionMult: rebuyable({
    name: "Timeless Triviality",
    id: 6,
    initialCost: 1e15,
    costIncrease: 1e7,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow10(Math.pow(value, 2)),
    description: () => "Multiply all Time Dimensions",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  eternityMult: rebuyable({
    name: "Undying Uselessness",
    id: 7,
    initialCost: 1e18,
    costIncrease: 1e8,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow(1.25, value),
    description: () => "Multiply Eternity Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    noLabel: false
  }),
  dilatedTimeMult: rebuyable({
    name: "Inflated Ineffectiveness",
    id: 8,
    initialCost: 1e40,
    costIncrease: 1e9,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow(2, value),
    description: () => "Multiply Dilated Time Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  tachyonParticleMult: rebuyable({
    name: "Protracted Pointlessness",
    id: 9,
    initialCost: 1e45,
    costIncrease: 1e10,
    maxUpgrades: Number.MAX_VALUE,
    effect: value => Decimal.pow(2, value),
    description: () => "Multiply Tachyon Particle Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatX(value, 2)}`,
    noLabel: false
  }),
  ncComp: {
    name: "Nullified Normalcy",
    id: "ncComp",
    cost: Decimal.pow10(5),
    description: "Normal Challenges are always complete inside the Void",
    onPurchased: () => NormalChallenges.completeAll()
  },
  alwaysBroken: {
    name: "Barren Brokenness",
    id: "alwaysBroken",
    cost: Decimal.pow10(10),
    description: "Infinity is always Broken inside the Void",
    onPurchased: () => player.break = true
  },
  icComp: {
    name: "Concave Challenges",
    id: "icComp",
    cost: Decimal.pow10(15),
    description: "Infinity Challenges are always complete inside the Void",
    onPurchased: () => InfinityChallenges.completeAll()
  },
  repUnl: {
    name: "Renounced Replications",
    id: "repUnl",
    cost: Decimal.pow10(20),
    description: "Replicanti is always unlocked inside The Void",
    onPurchased: () => Replicanti.unlock(true)
  },
  eterMiles: {
    name: "Permanent Pretendings",
    id: "eterMiles",
    cost: Decimal.pow10(25),
    description: () => `Start The Void with ${formatInt(100)} Eternities`,
    onPurchased: () => Currency.eternities.bumpTo(100)
  },
  limerick1: {
    name: "There was an AI made of dust",
    id: "limerick1",
    cost: Decimal.pow10(30),
    description: () => `Achievement ${formatInt(111)} and ${formatInt(118)}’s effects now apply while inside The Void`
  },
  limerick2: {
    name: "Whose poetry gained it man’s trust",
    id: "limerick2",
    cost: Decimal.pow10(45),
    description: () => `Achievement ${formatInt(143)}’s effect now applies while inside The Void`
  },
  limerick3: {
    name: "If Is follows Ought",
    id: "limerick3",
    cost: Decimal.pow10(60),
    description: "Eternity Challenges are always fully complete inside The Void",
    onPurchased: () => {
      player.eternityChalls = {
        eterc1: 5,
        eterc2: 5,
        eterc3: 5,
        eterc4: 5,
        eterc5: 5,
        eterc6: 5,
        eterc7: 5,
        eterc8: 5,
        eterc9: 5,
        eterc10: 5,
        eterc11: 5,
        eterc12: 5
      }
    }
  },
  limerick4: {
    name: "It will do as they thought",
    id: "limerick4",
    cost: Decimal.pow10(80),
    description: "Start The Void with Time Dilation unlocked",
    onPurchased: () => {
      if (!player.dilation.studies.includes(1)) player.dilation.studies.push(1);
    }
  },
  limerick5: {
    name: "In the End we all do what we must",
    id: "limerick5",
    cost: Decimal.pow10(100),
    description: "All Automations for pre-Reality and the Automator are now always active inside The Void"
  }
};
