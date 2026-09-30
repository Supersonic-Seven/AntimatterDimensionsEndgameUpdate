export const celestialInfinityUpgrades = {
  gameSpeedMultCIP: {
    id: "gameSpeedMultCIP",
    cost: 1,
    description: () => `Gain a multiplier to Game Speed based on unspent Celestial Infinity Points`,
    effect: () => player.disablePostReality ? DC.D1 : Currency.celestialInfinityPoints.value.plus(1).pow(308),
    formatEffect: value => formatX(value, 2, 1)
  },
  celDimPurchaseBoost: {
    id: "celDimPurchaseBoost",
    cost: 2,
    description: () => `Increase the Celestial Dimension Per-Purchase Multiplier to ${formatX(3)}`,
    effect: 3
  },
  alphaDecayStartBoost: {
    id: "alphaDecayStartBoost",
    cost: 5,
    description: () => `Gain a very small boost to Alpha Decay starting time based on Celestial Infinities`,
    effect: () => Decimal.pow(player.endgame.celDimExpansion.celestialInfinities, 0.5).div(100).min(1).add(
      DC.D4.times(DC.D1.sub(Decimal.pow(0.8, player.endgame.celDimExpansion.celestialInfinities.max(1).log10().sub(4).max(0))))),
    formatEffect: value => `${TimeSpan.fromHours(value).toStringShort()}`
  },
  celDimBoostBuff: {
    id: "celDimBoostBuff",
    cost: 10,
    description: () => `Increase the Celestial Dimension Boost base multiplier to ${formatX(100)}`,
    effect: 100
  },
  celGalaxyBuff: {
    id: "celGalaxyBuff",
    cost: 25,
    description: () => `Increase the Celestial Galaxy buff from ${formatX(1.02, 2, 2)} to ${formatX(1.03, 2, 2)} per Galaxy`,
    effect: 1.03
  },
  celestialMatterConversionBuff: {
    id: "celestialMatterConversionBuff",
    cost: 50,
    description: () => `Increase the Celestial Matter Conversion Rate base from ${formatPow(2)} to ${formatPow(2.5, 1, 1)}`,
    effect: 2.5
  },
  antimatterCelestialDimBuff: {
    id: "antimatterCelestialDimBuff",
    cost: 100,
    description: () => `Multiply all Celestial Dimensions by the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent's Exponent after Alpha Decay`,
    effect: () => Decimal.log10(Decimal.log10(player.antimatter.add(1)).add(1)).max(1)
  },
  cipGen: {
    id: "cipGen",
    cost: 300,
    description: () => `Generate CIP at ${formatPercents(0.1)} of your fastest Celestial Crunch`,
    effect: () => player.records.bestCelestialInfinity.time.times(10)
  },
  buffedStart: {
    id: "buffedStart",
    cost: 1000,
    description: () => `Start Celestial Infinities with ${formatInt(4)} Celestial Dimension Boosts and ${formatInt(2)} Celestial Galaxies`,
    effect: 4
  }
};
