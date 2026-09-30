const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.endgame.rebuyables[props.id],
    1e100,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  if (props.overflowing) props.effect = () => player.disablePostReality ? DC.D1 : Decimal.pow(effect, player.endgame.rebuyables[props.id]).min(DC.NUMMAX).times(Decimal.pow(effect, player.endgame.rebuyables[props.id]).div(DC.NUMMAX).max(2).log2());
  else if (props.isDecimal) props.effect = () => player.disablePostReality ? DC.D1 : Decimal.pow(effect, player.endgame.rebuyables[props.id]);
  else props.effect = () => player.disablePostReality ? 1 : Math.pow(effect, player.endgame.rebuyables[props.id]);
  props.description = () => props.textTemplate.replace("{value}", format(effect, 2, 2));
  props.formatEffect = value => (props.id === 2 || props.id === 3) ? formatX(value, 2, 4) : formatX(value, 2, 2);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const endgameUpgrades = [
  rebuyable({
    name: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Ameilorator`,
    id: 1,
    initialCost: 1e40,
    costMult: 60,
    textTemplate: "Delay the Infinity Upgrade 23 Softcap start by a factor of {value}",
    effect: 1.2,
    overflowing: true
  }),
  rebuyable({
    name: "Infinity Ameliorator",
    id: 2,
    initialCost: 1e42,
    costMult: 300,
    textTemplate: "Reduce the Infinity Dimension Compression Softcap by a factor of {value}",
    effect: 0.99
  }),
  rebuyable({
    name: "Time Ameliorator",
    id: 3,
    initialCost: 1e44,
    costMult: 150,
    textTemplate: "Reduce the Time Dimension Compression Softcap by a factor of {value}",
    effect: 0.99
  }),
  rebuyable({
    name: "Darkness Ameliorator",
    id: 4,
    initialCost: 1e48,
    costMult: 480,
    textTemplate: "Increase the Dark Matter hardcap by a factor of {value}",
    effect: 1e25,
    isDecimal: true
  }),
  rebuyable({
    name: "Celestial Ameliorator",
    id: 5,
    initialCost: 1e56,
    costMult: 120,
    textTemplate: "Delay the Celestial Matter Softcap start by a factor of {value}",
    effect: 2,
    isDecimal: true
  }),
  {
    name: "Resourceful Rebirth",
    id: 6,
    cost: new Decimal(1e45),
    requirement: () => `Have ${format(DC.E280)} Reality Shards without purchasing the 6th Galaxy Generator Upgrade`,
    hasFailed: () => GalaxyGeneratorUpgrades.RSMult.boughtAmount > 0,
    checkRequirement: () => GalaxyGeneratorUpgrades.RSMult.boughtAmount === 0 && Currency.realityShards.gte(DC.E280) && 
      player.endgames >= 10,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "purchase the 6th Galaxy Generator Upgrade",
    description: () =>
      `Start with ${format(1e7)} Perk Points, ${formatInt(1000)} Realities,
      ${format(1e12)} Relic Shards, and both Nameless upgrades unlocked`
  },
  {
    name: "Catastrophic Clocking",
    id: 7,
    cost: new Decimal(1e52),
    requirement: () => `Play for ${formatPostBreak("1e666")} Years`,
    checkRequirement: () => Time.totalTimePlayed.totalYears.gt(Decimal.pow(10, 666)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Outside of Celestial Realities, Game Speed is equal to maximum Game Speed this Endgame if you enabled Celestial Matter"
  },
  {
    name: "Endgame Emolument",
    id: 8,
    cost: new Decimal(1e60),
    requirement: () => `Manually Endgame in under ${formatInt(10)} minutes (real time)`,
    hasFailed: () => Time.thisEndgameRealTime.totalMinutes.gte(10),
    checkRequirement: () => Time.bestEndgameRealTime.totalMinutes.lt(10),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Generate Endgames ${formatInt(10)} times slower than your fastest Endgame (real time)`,
    effect: () => player.disablePostReality ? DC.NUMMAX : new Decimal(player.records.bestEndgame.realTime * 10),
    formatEffect: value => {
      if (new Decimal(value).gte(9999999999)) return "No Endgame generation";
      let endgames = 1;
      endgames *= ((ExpansionPack.enslavedPack.isBought && !player.disablePostReality)
        ? Math.floor(1 + Math.pow(Math.log10(Math.min(Tesseracts.effectiveCount, 1000) * Math.max(Math.log10(Tesseracts.effectiveCount) - 2, 1) + 1), Math.log10(player.endgames + 1)))
        : 1);
      endgames *= Math.pow(1.33, Alpha.currentStage);
      if (DivinityMilestone.firstDivine.isReached && !player.disablePostReality) endgames *= 10;
      endgames *= DivineDimensions.conversionFormula1.toNumber();
      const timeStr = Time.bestEndgameRealTime.totalMilliseconds.lte(100) && !Alpha.isDestroyed
        ? `${TimeSpan.fromMilliseconds(new Decimal(1000)).toStringShort()} (capped)`
        : (Time.bestEndgameRealTime.totalMilliseconds.lte(33)
           ? `${TimeSpan.fromMilliseconds(new Decimal(330)).toStringShort()} (capped)`
           : `${TimeSpan.fromMilliseconds(new Decimal(value)).toStringShort()}`);
      return `${quantify("Endgame", endgames)} every ${timeStr}`;
    }
  },
  {
    name: "Imagination Illumination",
    id: 9,
    cost: new Decimal(1e70),
    requirement: "Finish the 4th Row of Imaginary Upgrades without purchasing Fabrication of Ideals",
    hasFailed: () => ImaginaryUpgrade(15).isBought,
    checkRequirement: () => !ImaginaryUpgrade(15).isBought && ImaginaryUpgrade(16).isBought && ImaginaryUpgrade(17).isBought &&
      ImaginaryUpgrade(18).isBought && ImaginaryUpgrade(19).isBought && ImaginaryUpgrade(20).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "purchase Fabrication of Ideals",
    description: "You keep all Imaginary Upgrades on Endgame"
  },
  {
    name: "Celestial Chaos",
    id: 10,
    cost: new Decimal(1e83),
    requirement: () => "Complete Effarig, Nameless, V and Ra before pouring anything into Teresa",
    hasFailed: () => player.celestials.teresa.pouredAmount.gt(0),
    checkRequirement: () => player.celestials.teresa.pouredAmount.eq(0) &&
      EffarigUnlock.reality.isUnlocked && Enslaved.isCompleted && V.spaceTheorems >= 36 && Ra.totalPetLevel >= 100,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "pour RM into Teresa",
    description: () => `Record Teresa ${player.universes.current === 2 ? "Matter" : "Antimatter"} is kept on Endgame`
  },
  {
    name: "Nonary Neutralization",
    id: 11,
    cost: new Decimal(1e50),
    requirement: () => `Reach ${format(1e50)} Celestial Matter`,
    checkRequirement: () => Currency.celestialMatter.value.add(1).log10().gte(50),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () =>
      `Delay the Infinity Challenge 8 Reward Hardcap by ${formatPow(9)},
      and multiply all Celestial Dimensions by ${formatX(9)}`,
    effect: () => player.disablePostReality ? 1 : 9
  },
  {
    name: "Unstable Undermining",
    id: 12,
    cost: new Decimal(1e68),
    requirement: "Reach the second Galaxy Generator softcap",
    checkRequirement: () => GalaxyGenerator.galaxies.gte(1e60),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Reduce the Galaxy Generator Instability Magnitude by ${formatInt(1)}`,
    effect: () => player.disablePostReality ? 0 : 1
  },
  {
    name: "Barrier Breaching",
    id: 13,
    cost: new Decimal(1e78),
    requirement: () => `Reach a Glyph Level of ${formatInt(76543)}`,
    checkRequirement: () => player.records.bestEndgame.glyphLevel.gte(76543),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    description: "Weaken the third Glyph Level Instability"
  },
  {
    name: "Stellar Supplimentation",
    id: 14,
    cost: new Decimal(1e84),
    requirement: () => `Reach ${format(1e40)} Galaxies without purchasing the 6th Galaxy Generator Upgrade`,
    hasFailed: () => GalaxyGeneratorUpgrades.RSMult.boughtAmount > 0,
    checkRequirement: () => GalaxyGeneratorUpgrades.RSMult.boughtAmount === 0 && GalaxyGenerator.galaxies.gte(1e40) && 
      player.endgames >= 10,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "purchase the 6th Galaxy Generator Upgrade",
    description: () => `Weaken the second Galaxy Generator Instability Magnitude by ${formatPercents(0.1)}`,
    effect: () => player.disablePostReality ? 1 : 0.9
  },
  {
    name: () => `${player.universes.current === 2 ? "Matter Multitudes" : "Antimatter Amassment"}`,
    id: 15,
    cost: new Decimal(1e150),
    requirement: () => `Reach ${format(Decimal.pow(10, 1e33))} ${player.universes.current === 2 ? "Matter" : "Antimatter"} outside Pelle`,
    hasFailed: () => Pelle.isDoomed,
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(1e33) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Gain a power to the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent based on Imaginary Machines`,
    effect: () => player.disablePostReality ? 1 : 1 + (Decimal.pow(Decimal.log10(Decimal.log10(
      player.reality.imaginaryMachines.add(1)).add(1)), 2).min(10).add(Decimal.log10(Decimal.log10(
      player.reality.imaginaryMachines.add(1)).add(1)).sub(Math.sqrt(10)).max(0)).div(200)).toNumber(),
    formatEffect: value => formatPow(value, 2, 4)
  },
  {
    name: "Currency Collections",
    id: 16,
    cost: new Decimal(1e55),
    requirement: () => `Have ${format(1e10)} Galactic Power`,
    checkRequirement: () => Currency.galacticPower.gte(1e10),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You can equip a second Currency Path in Endgame Masteries",
    effect: () => player.disablePostReality ? 1 : 2
  },
  {
    name: "Compression Calculations",
    id: 17,
    cost: new Decimal(1e65),
    requirement: () => `Have ${format(1e20)} Galactic Power`,
    checkRequirement: () => Currency.galacticPower.gte(1e20),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You can equip a second Compression Path in Endgame Masteries",
    effect: () => player.disablePostReality ? 1 : 2
  },
  {
    name: "Money Multiplication",
    id: 18,
    cost: new Decimal(1e75),
    requirement: () => `Have ${format(1e30)} Galactic Power`,
    hasFailed: () => !EndgameUpgrade(16).isBought,
    checkRequirement: () => Currency.galacticPower.gte(1e30) && EndgameUpgrade(16).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You can equip a third Currency Path in Endgame Masteries",
    effect: () => player.disablePostReality ? 1 : 3
  },
  {
    name: "Dimensional Distension",
    id: 19,
    cost: new Decimal(1e85),
    requirement: () => `Have ${format(1e40)} Galactic Power`,
    hasFailed: () => !EndgameUpgrade(17).isBought,
    checkRequirement: () => Currency.galacticPower.gte(1e40) && EndgameUpgrade(17).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You can equip a third Compression Path in Endgame Masteries",
    effect: () => player.disablePostReality ? 1 : 3
  },
  {
    name: "Omnipotent Opulence",
    id: 20,
    cost: new Decimal(1e95),
    requirement: () => `Have ${format(1e50)} Galactic Power`,
    hasFailed: () => !(EndgameUpgrade(18).isBought && EndgameUpgrade(19).isBought),
    checkRequirement: () => Currency.galacticPower.gte(1e50) && EndgameUpgrade(18).isBought && EndgameUpgrade(19).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You can equip a fourth Compression and Currency Path in Endgame Masteries",
    effect: () => player.disablePostReality ? 1 : 4
  },
  {
    name: "Infinite Improvements",
    id: 21,
    cost: Decimal.pow(10, 120),
    requirement: "Have Increased Infinity Purchased",
    hasFailed: () => !BreakEternityUpgrade.doubleIPUncap.isBought,
    checkRequirement: () => BreakEternityUpgrade.doubleIPUncap.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Remove the x2 Infinity Point Softcap"
  },
  {
    name: "Tachyon Transcendence",
    id: 22,
    cost: Decimal.pow(10, 170),
    requirement: "Have Galactic Growth Purchased",
    hasFailed: () => !BreakEternityUpgrade.tgThresholdUncap.isBought,
    checkRequirement: () => BreakEternityUpgrade.tgThresholdUncap.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Apply a power to the Tachyon Galaxy Threshold based on Endgames`,
    effect: () => player.disablePostReality ? 1 : 1 / Math.log10(player.endgames + 1),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    name: "Quaternary Quantification",
    id: 23,
    cost: Decimal.pow(10, 240),
    requirement: "Have Tesseract Traversement Purchased",
    hasFailed: () => !BreakEternityUpgrade.tesseractMultiplier.isBought,
    checkRequirement: () => BreakEternityUpgrade.tesseractMultiplier.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Celestial Points delay the Free Tesseract Softcap",
    effect: () => player.disablePostReality ? 1 : Math.pow(1 + Decimal.log10(Decimal.max(Decimal.log10(player.endgame.celestialPoints.max(1)).div(200), 1)).toNumber(), 2),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Sacrificial Supercharger",
    id: 24,
    cost: Decimal.pow(10, 330),
    requirement: () => `Have Sacrifice Supplimentation Purchased`,
    hasFailed: () => !BreakEternityUpgrade.glyphSacrificeUncap.isBought,
    checkRequirement: () => BreakEternityUpgrade.glyphSacrificeUncap.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "All Glyph Sacrifice Values are increased based on Celestial Matter",
    effect: () => player.disablePostReality ? 1 : Decimal.pow(Decimal.max(Decimal.log10(Decimal.log10(player.endgame.celestialMatter.add(1)).add(1)).div(2), 1), 1.5).toNumber(),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    name: "Supremacy Surge",
    id: 25,
    cost: Decimal.pow(10, 440),
    requirement: () => `Have Potency Proliferation Purchased`,
    hasFailed: () => !BreakEternityUpgrade.glyphSlotImprovement.isBought,
    checkRequirement: () => BreakEternityUpgrade.glyphSlotImprovement.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Glyph Level gains a multiplier based on ${player.universes.current === 2 ? "Matter" : "Antimatter"} which applies after Instability`,
    effect: () => player.disablePostReality ? 1 : Decimal.min(Decimal.pow(Decimal.max(Decimal.log10(Decimal.log10(player.antimatter.add(1)).add(1)).div(100), 1), 0.05), 1.2).toNumber(),
    formatEffect: value => formatX(value, 2, 4)
  },
];
