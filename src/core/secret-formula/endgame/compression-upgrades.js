function rebuyableCost(initialCost, increment, id) {
  return Decimal.multiply(initialCost, Decimal.pow(increment, player.compression.rebuyables[id]));
}
function rebuyable(config) {
  return {
    id: config.id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
    initialCost: config.initialCost,
    increment: config.increment,
    description: config.description,
    effect: () => config.effect(player.compression.rebuyables[config.id]),
    formatEffect: config.formatEffect,
    formatCost: config.formatCost,
    purchaseCap: () => config.purchaseCap(player.compression.rebuyables[config.id]),
    reachedCap: () => player.compression.rebuyables[config.id] >= config.purchaseCap(player.compression.rebuyables[config.id]),
    rebuyable: true
  };
}

export const compressionUpgrades = {
  trGain: rebuyable({
    id: 1,
    initialCost: 1e4,
    increment: 10,
    description: () => "Double Thermal Radiation gain",
    effect: bought => Decimal.pow(2, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  waveThreshold: rebuyable({
    id: 2,
    initialCost: 1e6,
    increment: 100,
    description: () => "Reset Thermal Radiation and Electromagnetic Waves, but lower their threshold",
    // The 250th purchase is at 1e504, and is the last purchase.
    effect: bought => Decimal.pow(0.99, bought),
    formatEffect: effect => {
      if (effect.eq(Decimal.pow(0.99, 250))) return `${formatX(getElectroWaveMult(effect), 4, 4)}`;
      const nextEffect = effect.times(0.99);
      return `${formatX(getElectroWaveMult(effect), 4, 4)} ➜
        Next: ${formatX(getElectroWaveMult(nextEffect), 4, 4)}`;
    },
    formatCost: value => format(value, 2),
    purchaseCap: () => 250
  }),
  hrGain: rebuyable({
    id: 3,
    initialCost: 1e7,
    increment: 20,
    description: () => "Triple the amount of Hawking Radiation gained",
    effect: bought => DC.D3.pow(bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  doubleWaves: {
    id: 4,
    cost: 5e6,
    description: () => `Gain twice as many Electromagnetic Waves`,
    effect: 2
  },
  stMultReplicanti: {
    id: 5,
    cost: 1e9,
    description: () => `Space Theorems are affected by the double-log2 of your Replicanti Multiplier`,
    effect: () => {
      return replicantiMult().max(4).log2().log2();
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  adMultTR: {
    id: 6,
    cost: 5e7,
    description: () => `Gain a multiplier to ${player.universes.current === 2 ? "MDs" : "ADs"} based on Thermal Radiation and real time this Endgame applying after the Compression nerf`,
    effect: () => Currency.thermalRadiation.value.pow(Time.thisEndgameRealTime.totalMinutes.pow(0.75)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  adBigMultTR: {
    id: 7,
    cost: 2e12,
    description: () => `Gain another multiplier to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions based on Thermal Radiation that applies after the Compression nerf`,
    effect: () => Currency.thermalRadiation.value.pow(1000).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  entanglementSplit: {
    id: 8,
    cost: 1e10,
    description: "You can purchase all three Entanglement Paths in the Mastery Tree and empower all Machines based on TR",
    effect: () => Currency.thermalRadiation.value.max(1).log10().div(308).add(1).pow(2),
    formatEffect: value => formatPow(value, 2, 3)
  },
  compressionPenalty: {
    id: 9,
    cost: 1e11,
    description: "The Compression nerf is slightly weaker"
  },
  esGenerator: {
    id: 10,
    cost: 1e15,
    description: "Generate Endgame Skills based on Hawking Radiation",
    effect: () => Currency.hawkingRadiation.value.pow(0.5),
    formatEffect: value => `${format(value, 2, 1)}/sec`
  }
};
