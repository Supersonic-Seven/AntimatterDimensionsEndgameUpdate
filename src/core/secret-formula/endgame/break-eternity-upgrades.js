function rebuyable(config) {
  const effectFunction = config.effect || (x => x);
  const { name, id, maxUpgrades, description, isDisabled, noLabel, onPurchased } = config;
  return {
    rebuyable: true,
    name,
    id,
    cost: () => Decimal.pow(10, config.initialCost() * Math.pow(config.costIncrease(), player.breakEternityRebuyables[config.id])),
    maxUpgrades,
    description,
    effect: () => player.disablePostReality && !SlabdrillUnlocks.infinity.isUnlocked
      ? 1 : effectFunction(player.breakEternityRebuyables[config.id]),
    isDisabled,
    // There isn't enough room in the button to fit the EC reduction and "Next:" at the same time while still
    // presenting all the information in an understandable way, so we only show it if the upgrade is maxed
    formatEffect: config.formatEffect,
    formatCost: value => formatPostBreak(value, 2, 0),
    noLabel,
    onPurchased
  };
}

export const breakEternityUpgrades = {
  antimatterDimensionPow: rebuyable({
    name: () => `Exponentiation of ${player.universes.current === 2 ? "Matter" : "Antimatter"}`,
    id: 0,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 100 : 1e15,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 5 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.01, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Raise your ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multiplier to ${formatPow(1.01, 2, 2)}`
      : `Square All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Multipliers`,
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatPow(value, 2, 3) : `^${formatHybridSmall(value, 3)}`,
    noLabel: false
  }),
  infinityDimensionPow: rebuyable({
    name: "Exponentiation of Infinity",
    id: 1,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 1e4 : 1e16,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 5 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.02, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Raise all Infinity Dimension multipliers to ${formatPow(1.02, 2, 2)}` : "Square All Infinity Dimension Multipliers",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatPow(value, 2, 3) : `^${formatHybridSmall(value, 3)}`,
    noLabel: false
  }),
  timeDimensionPow: rebuyable({
    name: "Exponentiation of Time",
    id: 2,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 1e6 : 1e17,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 5 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.03, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Raise all Time Dimension multipliers to ${formatPow(1.03, 2, 2)}` : "Square All Time Dimension Multipliers",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatPow(value, 2, 3) : `^${formatHybridSmall(value, 3)}`,
    noLabel: false
  }),
  replicantiIntervalPow: rebuyable({
    name: "Exponentiation of Replication",
    id: 3,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 3e4 : 1e18,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 4 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(0.96, value) : Math.pow(0.5, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Raise the Replicanti Interval to ${formatPow(0.96, 2, 2)}` : "Square-root the Replicanti Interval",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatPow(value, 2, 3) : `^${format(value, 2, 3)}`,
    noLabel: false
  }),
  tachyonParticlePow: rebuyable({
    name: "Exponentiation of Dilation",
    id: 4,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 1.5e8 : 1e19,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 2 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.05, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Raise Tachyon Particle gain to ${formatPow(1.05, 2, 2)}` : "Square Tachyon Particle Gain",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatPow(value, 2, 3) : `^${formatHybridSmall(value, 3)}`,
    noLabel: false
  }),
  galaxyScaleDelay: rebuyable({
    name: "Potency of Galaxies",
    id: 5,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 1e5 : 1e20,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 5 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? value * 10 : value * 10000,
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Delay Distant/Remote Galaxy Scaling by +${formatInt(10)} Galaxies`
      : `Delay Distant/Remote Galaxy Scaling by +${formatInt(10000)} Galaxies`,
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${formatInt(value)} Galaxies`,
    noLabel: false
  }),
  infinityPowerConversion: rebuyable({
    name: "Accumulation of Power",
    id: 6,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 2e5 : 1e21,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 4 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.1, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Multiply the Infinity Power Conversion Rate by ${formatX(1.1, 1, 1)}` : "Double the Infinity Power Conversion Rate",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatX(value, 2, 3) : `${formatX(value, 2)}`,
    noLabel: false
  }),
  epMultiplierDelay: rebuyable({
    name: "Obstruction of Softcaps",
    id: 7,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 8e6 : 1e22,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 4 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.1, value) : Math.pow(10, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Raise the start of the 5x EP Multiplier Cost Scalings to ${formatPow(1.1, 2, 2)}`
      : `Raise the start of the 5x EP Multiplier Cost Scalings to ${formatPow(10)}`,
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatPow(value, 2, 3) : `^${formatHybridSmall(value, 3)}`,
    noLabel: false
  }),
  replicantiGalaxyPower: rebuyable({
    name: "Suspension of Scalings",
    id: 8,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 5e6 : 1e23,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 3 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.1, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Multiply the starting points of the Replicanti Galaxy cost scalings by ${formatX(1.1, 1, 1)}`
      : "Double the starting points of the Replicanti Galaxy Cost Scalings",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatX(value, 2, 3) : `${formatX(value, 2)}`,
    noLabel: false
  }),
  dilatedTimeMultiplier: rebuyable({
    name: "Amplification of Multiplication",
    id: 9,
    initialCost: () => SlabdrillUnlocks.infinity.isUnlocked ? 2e8 : 1e24,
    costIncrease: () => SlabdrillUnlocks.infinity.isUnlocked ? 2 : 1e10,
    maxUpgrades: 10,
    effect: value => SlabdrillUnlocks.infinity.isUnlocked ? Math.pow(1.1, value) : Math.pow(2, value),
    description: () => SlabdrillUnlocks.infinity.isUnlocked
      ? `Multiply the Per-Purchase Multiplier of the 2x Dilated Time Upgrade by ${formatX(1.1, 1, 1)}`
      : "Double the Per-Purchase Multiplier of the 2x Dilated Time Upgrade",
    isDisabled: effect => effect.eq(0),
    formatEffect: value => SlabdrillUnlocks.infinity.isUnlocked ? formatX(value, 2, 3) : `${formatX(value, 2)}`,
    noLabel: false
  }),
  doubleIPUncap: {
    name: "Increased Infinity",
    id: "doubleIPUncap",
    cost: Decimal.pow(10, 1e30),
    description: "Uncap the 2x IP Multiplier Upgrade"
  },
  tgThresholdUncap: {
    name: "Galactic Growth",
    id: "tgThresholdUncap",
    cost: Decimal.pow(10, 1e40),
    description: "Uncap the TG Threshold Upgrade and improve the formula"
  },
  tesseractMultiplier: {
    name: "Tesseract Traversement",
    id: "tesseractMultiplier",
    cost: Decimal.pow(10, 1e50),
    description: "Double all Effective Tesseracts",
    effect: 2
  },
  glyphSacrificeUncap: {
    name: "Sacrifice Supplementation",
    id: "glyphSacrificeUncap",
    cost: Decimal.pow(10, 1e70),
    description: "Uncap Glyph Sacrifice Values for all Glyphs"
  },
  glyphSlotImprovement: {
    name: "Potency Proliferation",
    id: "glyphSlotImprovement",
    cost: Decimal.pow(10, 1e100),
    description: "Add 3 more Glyph Slots outside Pelle",
    effect: 3
  },
};
