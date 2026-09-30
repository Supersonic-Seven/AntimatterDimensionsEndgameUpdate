const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.reality.dualityRebuyables[props.id],
    1e20,
    props.initialCost,
    props.costMult,
    props.costMult,
    DC.E309,
    1e3,
    props.costMult
  );
  const { effect } = props;
  if (props.isDecimal) props.effect = () => player.disablePostReality ? DC.D1 : Decimal.pow(effect, player.reality.dualityRebuyables[props.id]);
  else if (props.isQuadratic) props.effect = () => player.disablePostReality ? DC.D1 : Decimal.pow(effect, (player.reality.dualityRebuyables[props.id] + 1) * (player.reality.dualityRebuyables[props.id] / 2));
  else props.effect = () => player.disablePostReality ? 1 : effect * player.reality.dualityRebuyables[props.id];
  if (!props.formatEffect) props.formatEffect = value => `+${format(value, 2, 2)}`;
  props.formatCost = value => format(value, 2, 0);
  return props;
};

export const dualityUpgrades = [
  rebuyable({
    name: "Temporal Aeromagnifier",
    id: 1,
    initialCost: 1,
    costMult: 50,
    description: () => `Increase Temporal Intensifier multiplier by +${format(0.01, 2, 2)}`,
    effect: 0.01
  }),
  rebuyable({
    name: "Replicative Aeromagnifier",
    id: 2,
    initialCost: 3,
    costMult: 60,
    description: () => `Increase Replicative Intensifier multiplier by +${format(0.01, 2, 2)}`,
    effect: 0.01
  }),
  rebuyable({
    name: "Eternal Aeromagnifier",
    id: 3,
    initialCost: 8,
    costMult: 45,
    description: () => `Increase Eternal Intensifier multiplier by +${format(0.02, 2, 2)}`,
    effect: 0.02
  }),
  rebuyable({
    name: "Superluminal Aeromagnifier",
    id: 4,
    initialCost: 18,
    costMult: 75,
    description: () => `Increase Superluminal Intensifier multiplier by +${format(0.01, 2, 2)}`,
    effect: 0.01
  }),
  rebuyable({
    name: "Boundless Aeromagnifier",
    id: 5,
    initialCost: 30,
    costMult: 36,
    description: () => `Increase Boundless Intensifier multiplier by +${format(0.03, 2, 2)}`,
    effect: 0.03
  }),
  rebuyable({
    name: "Fabricated Hyperbolae",
    id: 6,
    initialCost: 1e4,
    costMult: 360,
    description: () => `Increase the Imaginary Machine cap by ${formatX(1e100)}`,
    effect: 1e100,
    formatEffect: value => `${formatX(value)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Hieroglyphic Empowerment",
    id: 7,
    initialCost: 2e5,
    costMult: 750,
    description: () => `Delay the first ${formatInt(4)} levels of Glyph Instability starting level by ${formatInt(2000)}`,
    effect: 2000,
    formatEffect: value => `+${formatInt(value)} levels`
  }),
  rebuyable({
    name: "Polytopic Tetrahedron",
    id: 8,
    initialCost: 1.5e6,
    costMult: 1500,
    description: () => `Raise Infinity Dimensions to ${formatPow(1.25, 2, 3)}`,
    effect: 1.25,
    formatEffect: value => `${formatPow(value, 2, 3)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Nebular Plexus",
    id: 9,
    initialCost: 1.2e7,
    costMult: 2400,
    description: () => `Multiply Galaxy strength`,
    effect: 1.15,
    formatEffect: value => `${formatX(value, 2, 2)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Disrupted Constrictions",
    id: 10,
    initialCost: 2e8,
    costMult: 4000,
    description: () => `Multiply Singularity gain`,
    effect: 1e100,
    formatEffect: value => `${formatX(value, 2)}`,
    isQuadratic: true
  }),
  {
    name: "Interference of Forever",
    id: 11,
    cost: new Decimal(1e9),
    requirement: () => `${format("1e1640")} total Relic Shards
      (You have ${format(player.celestials.effarig.relicShards, 2)})`,
    hasFailed: () => false,
    checkRequirement: () => player.celestials.effarig.relicShards.gte(DC.E1640),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    description: "Multiply Continuum purchases based on Hadronization amount",
    effect: () => player.disablePostReality ? 1 : Math.sqrt(Laitela.hadronizes),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    name: "Repercussions of Apparitions",
    id: 12,
    cost: new Decimal(6e9),
    requirement: () => `Make a level ${formatInt(102500)} Glyph with all Glyph level factor weights at
    ${formatInt(0)}`,
    hasFailed: () => !Object.values(player.celestials.effarig.glyphWeights).every(w => w === 0),
    checkRequirement: () => Object.values(player.celestials.effarig.glyphWeights).every(w => w === 0) &&
      gainedGlyphLevel().actualLevel.gte(102500),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Raise free Dimboost gain to a power based on repeatable Duality Upgrade purchases",
    effect: () => player.disablePostReality ? 1 : 1 + Math.log10(DualityUpgrades.totalRebuyables) * 1.5,
    formatEffect: value => `${formatPow(value, 2, 3)}`
  },
  {
    name: "Ephemerality of Duality",
    id: 13,
    cost: new Decimal(2e10),
    requirement: () => `Hadronize Lai'tela's Reality ${formatInt(12)} times`,
    hasFailed: () => false,
    checkRequirement: () => Laitela.hadronizes >= 12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Increase Dual Machine Cap based on Duality Upgrade purchases",
    effect: () => player.disablePostReality ? 1 : 1 + DualityUpgrades.totalRebuyables / 20 + DualityUpgrades.totalSinglePurchase / 2,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    name: "Reminiscence of Corruption",
    id: 14,
    cost: new Decimal(3e11),
    requirement: () => `Reach a tickspeed of ${format("e1e666")}`,
    hasFailed: () => false,
    checkRequirement: () => Tickspeed.perSecond.log10().gte("1e666"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Raise the Continuum Purchase boost to ${formatPow(1.2, 0, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.2
  },
  {
    name: "Invention of Duplexes",
    id: 15,
    cost: new Decimal(1e12),
    requirement: () => `Reach ${format("e5e55")} ${player.universes.current === 2 ? "matter" : "antimatter"} outside Pelle without ever having Infinity,
      Time, or ${formatInt(8)}th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions this Endgame while Dilated`,
    hasFailed: () => !player.requirementChecks.endgame.onlyLowDims || Pelle.isDoomed,
    checkRequirement: () => player.requirementChecks.endgame.onlyLowDims && player.dilation.active &&
      player.antimatter.add(1).log10().gte(5e55) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    description: "Unlock Hadrons",
  },
  {
    name: "Critical Acceleration",
    id: 16,
    cost: new Decimal(4e12),
    requirement: () => "Have a fully empowered Hadron",
    hasFailed: () => false,
    checkRequirement: () => Hadrons.timeFactor.times(4).gte(100),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock a 2nd Hadron effect",
  },
  {
    name: "Prodigious Rotations",
    id: 17,
    cost: new Decimal(9e12),
    requirement: () => `Reach ${format("1e44875")} Singularities`,
    hasFailed: () => false,
    checkRequirement: () => player.celestials.laitela.singularities.gte("1e44875"),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE,
    description: "Unlock a 3rd Hadron effect",
  },
  {
    name: "Proportional Equilibrium",
    id: 18,
    cost: new Decimal(1.6e13),
    formatCost: x => format(x, 1),
    requirement: () => `Have ${format(2.6e9, 1)} total Galaxies outside Pelle`,
    hasFailed: () => Pelle.isDoomed,
    checkRequirement: () => actualBaseGalaxiesWithoutGeneration().gte(2.6e9) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock a 4th Hadron effect",
  },
  {
    name: "Designated Emanation",
    id: 19,
    cost: new Decimal(4.2e13),
    formatCost: x => format(x, 1),
    requirement: () => `Have ${format(1e45)} Tickspeed Continuum outside Pelle without ever having Time Studies in this Endgame`,
    hasFailed: () => player.requirementChecks.endgame.maxStudies > 0 || Pelle.isDoomed,
    checkRequirement: () => player.requirementChecks.endgame.maxStudies <= 0 &&
      Tickspeed.continuumValue.gte(1e45) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: () => `purchase more than ${formatInt(0)} Time Studies`,
    description: "Unlock Dark Hadrons"
  },
  {
    name: "Binate Velocity",
    id: 20,
    cost: new Decimal(1e16),
    requirement: () => `Have a Continuum increase of at least ${formatX(4444444, 2, 2)}`,
    hasFailed: () => false,
    checkRequirement: () => Laitela.matterExtraPurchaseFactor.gte(4444444),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Unlock Autobuyers for repeatable Duality Upgrades and generate Dual Machines
      ${formatInt(10)} times faster`,
    effect: () => player.disablePostReality ? 1 : 10
  },
  {
    name: "Empyrean Eradication",
    id: 21,
    cost: new Decimal(3e17),
    requirement: () => `Reach ${format("e1e88")} ${player.universes.current === 2 ? "matter" : "antimatter"} outside Pelle with Continuum disabled for the entire Endgame`,
    hasFailed: () => !player.requirementChecks.endgame.noContinuum || Pelle.isDoomed,
    checkRequirement: () => player.requirementChecks.endgame.noContinuum &&
      Currency.antimatter.value.add(1).log10().gte(1e88) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "enable Continuum",
    description: "Dark Hadrons are more powerful based on Dual Machines",
    effect: () => player.disablePostReality ? 0 : Decimal.log10(Currency.dualMachines.value.add(1)).div(100).toNumber(),
    formatEffect: value => `+${formatPercents(value, 2, 2)}`
  },
  {
    name: "Depiction Devastation",
    id: 22,
    cost: new Decimal(2e18),
    requirement: () => `Reach ${format("e1e85")} ${player.universes.current === 2 ? "matter" : "antimatter"} outside Pelle without ever equipping Glyphs this Endgame`,
    hasFailed: () => !player.requirementChecks.endgame.noGlyphs || Pelle.isDoomed,
    checkRequirement: () => player.requirementChecks.endgame.noGlyphs &&
      Currency.antimatter.value.add(1).log10().gte(1e85) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "equip Glyphs",
    description: () => `Raise all Glyph Sacrifice values to ${formatPow(1.2, 2, 3)}`,
    effect: () => player.disablePostReality ? 1 : 1.2
  },
  {
    name: "Tetragrammatical Traumatization",
    id: 23,
    cost: new Decimal(6e18),
    requirement: () => `Reach Glyph level ${formatInt(385000)} in Ra's Reality with
      at most -15 Glyphs equipped`,
    hasFailed: () => !Ra.isRunning ||
      player.requirementChecks.reality.maxGlyphs > -15,
    checkRequirement: () => Ra.isRunning &&
      player.requirementChecks.reality.maxGlyphs <= -15 && gainedGlyphLevel().actualLevel.gte(385000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Tesseracts increase Galaxy strength",
    effect: () => player.disablePostReality ? 1 : Tesseracts.effectiveCount / 100,
    formatEffect: value => `${formatX(value)}`
  },
  {
    name: "Singularized Shattering",
    id: 24,
    cost: new Decimal(1.5e19),
    formatCost: x => format(x, 1),
    requirement: () => `Have ${format(105.5e6, 2, 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies in Ra's Reality
      with Celestial Matter toggled off`,
    hasFailed: () => !Ra.isRunning || !player.requirementChecks.reality.noCelMatter,
    checkRequirement: () => Ra.isRunning && player.requirementChecks.reality.noCelMatter &&
      player.galaxies.gte(105.5e6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "turn on Celestial Matter",
    description: "Singularities increase Galaxy strength",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.log10(player.celestials.laitela.singularities.add(1)).div(10000),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    name: "Polydimensional Production",
    id: 25,
    cost: new Decimal(1e20),
    requirement: () => `Have ${formatInt(32)} fully empowered Dark Hadrons`,
    hasFailed: () => false,
    checkRequirement: () => player.celestials.laitela.hadrons.dark >= 32 && Hadrons.timeFactor.div(5).gte(100),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock Hypercubes",
  },
  {
    name: "Deepened Desolation",
    id: 26,
    cost: new Decimal("1e500"),
    requirement: () => `Acquire ${format(1e95, 2, 2)} Null Particles`,
    hasFailed: () => false,
    checkRequirement: () => Currency.nullParticles.gte(1e95),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Uncap Null Matter and have it boost Divine Dimensions at a severely reduced rate",
    effect: () => player.disablePostReality ? 1 : Currency.nullMatter.value.max(1).log10().pow(0.04),
    formatEffect: value => `${formatPow(value, 2, 3)}`
  },
  {
    name: "Compressed Collections",
    id: 27,
    cost: new Decimal("1e600"),
    requirement: () => `Reach ${formatInt(20000)} Hawking Radiation`,
    hasFailed: () => false,
    checkRequirement: () => Currency.hawkingRadiation.gte(20000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "The Galaxy-based Endgame Skill cost scaling is severely reduced"
  },
  {
    name: "Cubic Collapse",
    id: 28,
    cost: new Decimal("1e700"),
    requirement: () => `Obtain ${formatInt(47)} Hexeracts`,
    hasFailed: () => false,
    checkRequirement: () => Hexeracts.effectiveCount >= 47,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "The reward for destablizing Lai'tela's Reality is stronger based on Hexeracts",
    effect: () => player.disablePostReality ? 1 : Math.pow(Hexeracts.effectiveCount, 3),
    formatEffect: value => `${formatPow(value, 2)}`
  },
  {
    name: "Aethereal Augmentations",
    id: 29,
    cost: new Decimal("1e800"),
    requirement: () => `Reach ${format(1e42, 2, 2)} Star Power`,
    hasFailed: () => false,
    checkRequirement: () => Currency.starPower.gte(1e42),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Star Power boosts Galactic Power generation at a severely reduced rate",
    effect: () => player.disablePostReality ? 1 : Currency.starPower.value.max(1).log10().pow(0.05),
    formatEffect: value => `${formatPow(value, 2, 3)}`
  },
  {
    name: "Timeless Transcension",
    id: 30,
    cost: new Decimal("1e900"),
    requirement: () => `Reach ${format(Decimal.pow10(1e272), 2, 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} outside Doomed/Cursed Realities`,
    hasFailed: () => Pelle.isDoomed || Slabdrill.isCursed,
    checkRequirement: () => player.antimatter.gte(Decimal.pow10(Decimal.pow10(Math.E * 100))) && !Pelle.isDoomed && !Slabdrill.isCursed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `The 9th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension is stronger based on Tickspeed`,
    effect: () => player.disablePostReality ? 1 : Tickspeed.perSecond.max(1).log10(),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
];
