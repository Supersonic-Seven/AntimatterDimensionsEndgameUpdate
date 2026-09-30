function rebuyableCost(initialCost, increment, id, capIncreaseAt, superExponent) {
  if (player.dilation.rebuyables[id] >= superExponent) return Decimal.pow10(1e10).pow(Decimal.pow(1.0002, Math.max(player.dilation.rebuyables[id] - superExponent, 0)));
  return Decimal.multiply(initialCost, Decimal.pow(increment, player.dilation.rebuyables[id] + (Math.max(player.dilation.rebuyables[id] - capIncreaseAt, 0) * Math.max(player.dilation.rebuyables[id] - (capIncreaseAt + 1), 0) / 2)));
}
function rebuyable(config) {
  return {
    id: config.id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id, config.capIncreaseAt(player.dilation.rebuyables[config.id]), config.superExponent ? config.superExponent(player.dilation.rebuyables[config.id]) : Infinity),
    initialCost: config.initialCost,
    increment: config.increment,
    capIncreaseAt: () => config.capIncreaseAt(player.dilation.rebuyables[config.id]),
    superExponent: () => config.superExponent ? config.superExponent(player.dilation.rebuyables[config.id]) : Infinity,
    description: config.description,
    effect: () => config.effect(player.dilation.rebuyables[config.id]),
    formatEffect: config.formatEffect,
    formatCost: config.formatCost,
    purchaseCap: () => config.purchaseCap(player.dilation.rebuyables[config.id]),
    reachedCap: () => player.dilation.rebuyables[config.id] >= config.purchaseCap(player.dilation.rebuyables[config.id]),
    pelleOnly: Boolean(config.pelleOnly),
    rebuyable: true
  };
}

export const dilationUpgrades = {
  dtGain: rebuyable({
    id: 1,
    initialCost: 1e4,
    increment: 10,
    capIncreaseAt: () => Decimal.floor(Decimal.log10(DilationUpgradeScaling.PRIMARY_SCALING).sub(3)).toNumber(),
    description: () =>
      ((SingularityMilestone.dilatedTimeFromSingularities.canBeApplied || Achievement(187).canBeApplied)
        ? `${formatX(2 * Effects.product(
          SingularityMilestone.dilatedTimeFromSingularities,
          Achievement(187),
          BreakEternityUpgrade.dilatedTimeMultiplier
        ), 2, 2)} Dilated Time gain`
        : "Double Dilated Time gain"),
    effect: bought => {
      const base = 2 * Effects.product(
        SingularityMilestone.dilatedTimeFromSingularities,
        Achievement(187),
        BreakEternityUpgrade.dilatedTimeMultiplier
      );
      return Decimal.pow(base, bought);
    },
    formatEffect: value => {
      const nonInteger = SingularityMilestone.dilatedTimeFromSingularities.canBeApplied ||
        Achievement(187).canBeApplied ||
        BreakEternityUpgrade.dilatedTimeMultiplier;
      return formatX(value, 2, nonInteger ? 2 : 0);
    },
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  galaxyThreshold: rebuyable({
    id: 2,
    initialCost: 1e6,
    increment: 100,
    capIncreaseAt: () => Decimal.floor((Decimal.log10(DilationUpgradeScaling.PRIMARY_SCALING).div(2)).sub(2)).toNumber(),
    superExponent: () => 100000,
    description: () =>
      ((Perk.bypassTGReset.isBought && !player.disablePostReality) && (!Pelle.isDoomed || PellePerkUpgrade.perkTGR.canBeApplied)
        ? "Reset Tachyon Galaxies, but lower their threshold"
        : "Reset Dilated Time and Tachyon Galaxies, but lower their threshold"),
    // The 38th purchase is at 1e80, and is the last purchase.
    effect: bought => (bought < 38 || (BreakEternityUpgrade.tgThresholdUncap.isBought && !player.disablePostReality) ? Decimal.pow(0.8, bought) : DC.D0),
    formatEffect: effect => {
      if (effect.eq(0)) return `${formatX(getTachyonGalaxyMultForDisplay(effect), 4, 4)}`;
      const nextEffect = effect.eq(Decimal.pow(0.8, 37)) && (!BreakEternityUpgrade.tgThresholdUncap.isBought || player.disablePostReality) ? DC.D0 : effect.times(0.8);
      return `${formatX(getTachyonGalaxyMultForDisplay(effect), 4, 4)} ➜
        Next: ${formatX(getTachyonGalaxyMultForDisplay(nextEffect), 4, 4)}`;
    },
    formatCost: value => format(value, 2),
    purchaseCap: () => (BreakEternityUpgrade.tgThresholdUncap.isBought && !player.disablePostReality) ? Number.MAX_VALUE : 38
  }),
  tachyonGain: rebuyable({
    id: 3,
    initialCost: 1e7,
    increment: 20,
    capIncreaseAt: () => Decimal.floor((Decimal.log10(DilationUpgradeScaling.PRIMARY_SCALING).div(Math.log10(20))).sub(Math.log10(5e5) / Math.log10(20))).toNumber(),
    description: () => {
      if (Pelle.isDoomed && !PelleDestructionUpgrade.x3TPUpgrade.canBeApplied) return `Multiply the amount of Tachyon Particles gained by ${formatInt(1)}`;
      if (Enslaved.isRunning) return `Multiply the amount of Tachyon Particles gained
      by ${Math.pow(3, Enslaved.tachyonNerf).toFixed(2)}`;
      return "Triple the amount of Tachyon Particles gained";
    },
    effect: bought => {
      if (Pelle.isDoomed && !PelleDestructionUpgrade.x3TPUpgrade.canBeApplied) return DC.D1.pow(bought);
      return DC.D3.pow(bought);
    },
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  doubleGalaxies: {
    id: 4,
    cost: 5e6,
    description: () => (Alpha.isDestroyed
      ? `Gain twice as many Tachyon Galaxies`
      : `Gain twice as many Tachyon Galaxies, up to ${formatInt(500)} base Galaxies`),
    effect: 2
  },
  tdMultReplicanti: {
    id: 5,
    cost: 1e9,
    description: () => {
      const rep10 = replicantiMult().pLog10();
      let multiplier = Slabdrill.isCursed ? "0.01" : "0.1";
      if (rep10.gt(9000)) {
        const ratio = DilationUpgrade.tdMultReplicanti.effectValue.pLog10().div(rep10);
        if (ratio.lt(0.095)) {
          multiplier = ratio.toFixed(2);
        }
      }
      return `Time Dimensions are affected by Replicanti multiplier ${formatPow(multiplier, 1, 3)}, reduced
        effect above ${formatX(DC.E9000)}`;
    },
    effect: () => {
      let rep10 = replicantiMult().pLog10().times(Slabdrill.isCursed ? 0.01 : 0.1);
      rep10 = rep10.gt(9000) ? (rep10.sub(9000)).times(0.5).add(9000) : rep10;
      return Decimal.pow10(rep10);
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  ndMultDT: {
    id: 6,
    cost: 5e7,
    description: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multiplier based on Dilated Time, unaffected by Time Dilation`,
    effect: () => Currency.dilatedTime.value.pow(308 * (Slabdrill.isCursed ? 8 : 1)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  ipMultDT: {
    id: 7,
    cost: 2e12,
    description: "Gain a multiplier to Infinity Points based on Dilated Time",
    effect: () => Currency.dilatedTime.value.pow(1000 * (Slabdrill.isCursed ? 32 : 1)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  timeStudySplit: {
    id: 8,
    cost: 1e10,
    description: "You can buy all three Time Study paths from the Dimension Split"
  },
  dilationPenalty: {
    id: 9,
    cost: 1e11,
    description: () => `Reduce the Dilation penalty (${formatPow(1.05, 2, 2)} after reduction)`,
    effect: 1.05,
  },
  ttGenerator: {
    id: 10,
    cost: 1e15,
    description: "Generate Time Theorems based on Tachyon Particles",
    effect: () => Slabdrill.isCursed ? Currency.tachyonParticles.value.pow(2).div(1000) :
      Currency.tachyonParticles.value.div(20000).times(
      Alpha.isRunning ? AlphaUnlocks.timeTheoremGeneration.effects.nerf.effectOrDefault(1) : 1),
    formatEffect: value => `${format(value, 2, 1)}/sec`
  },
  dtGainPelle: rebuyable({
    id: 11,
    initialCost: 1e14,
    increment: 100,
    capIncreaseAt: () => Decimal.floor((Decimal.log10(DilationUpgradeScaling.PRIMARY_SCALING).div(2)).sub(6)).toNumber(),
    pelleOnly: true,
    description: () => `${formatX(5)} Dilated Time gain`,
    effect: bought => Decimal.pow(5, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  galaxyMultiplier: rebuyable({
    id: 12,
    initialCost: 1e15,
    increment: 1000,
    capIncreaseAt: () => Decimal.floor((Decimal.log10(DilationUpgradeScaling.PRIMARY_SCALING).div(3)).sub(4)).toNumber(),
    pelleOnly: true,
    description: "Multiply Tachyon Galaxies gained, applies after TG doubling upgrade",
    effect: bought => bought + 1,
    formatEffect: value => `${formatX(value, 2)} ➜ ${formatX(value + 1, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  tickspeedPower: rebuyable({
    id: 13,
    initialCost: 1e16,
    increment: 1e4,
    capIncreaseAt: () => Decimal.floor((Decimal.log10(DilationUpgradeScaling.PRIMARY_SCALING).div(4)).sub(3)).toNumber(),
    pelleOnly: true,
    description: "Gain a power to Tickspeed",
    effect: bought => 1 + bought * 0.03,
    formatEffect: value => `${formatPow(value, 2, 2)} ➜ ${formatPow(value + 0.03, 2, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: () => Number.MAX_VALUE
  }),
  galaxyThresholdPelle: {
    id: 14,
    cost: 1e45,
    pelleOnly: true,
    description: "Apply a cube root to the Tachyon Galaxy threshold",
    effect: 1 / 3
  },
  flatDilationMult: {
    id: 15,
    cost: 1e55,
    pelleOnly: true,
    description: () => `Gain more Dilated Time based on current EP`,
    effect: () => Decimal.pow(1e9, Decimal.min(Decimal.pow(Decimal.max(player.eternityPoints.add(1).log10().sub(1500), 0).div(2500), 1.2), 1).times(Alpha.isDestroyed ? player.eternityPoints.add(1).log10().sub(4000).max(1).log10().max(1) : 1)),
    formatEffect: value => formatX(value, 2, 2)
  },
};
