export const celestialEternityPlusUpgrades = {
  megaCelTickspeedReduction: {
    id: "megaCelTickspeedReduction",
    cost: DC.E1000,
    description: () => `Reduce the Celestial Tickspeed cost scaling multiplier to ${formatX(1.5, 1, 1)}`,
    effect: 0.15,
    onPurchased: () => GameCache.celestialTickSpeedMultDecrease.invalidate()
  },
  megaCelDimReduction: {
    id: "megaCelDimReduction",
    cost: DC.E2000,
    description: () => `Reduce the Celestial Dimension cost scaling multiplier to ${formatX(1.8, 1, 1)}`,
    effect: 0.2,
    onPurchased: () => GameCache.celestialDimensionMultDecrease.invalidate()
  },
  betterCIPFormula: {
    id: "betterCIPFormula",
    cost: DC.E3000,
    description: () => `Reduce the Celestial Infinity Point conversion formula divisor by ${formatPercents(0.1)}`,
    effect: 0.9
  },
  oldStoneSlabAndSteelDrill: {
    id: "oldStoneSlabAndSteelDrill",
    cost: DC.E4000,
    description: () => (player.celestials.slabdrill.isWarping ? "Unlock the Cursed Reality" : "Unlock Pelle's Domain"),
    onPurchased: () => Pelle.quotes.reachGoal.show()
  }
};
