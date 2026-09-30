// This is supposed to be in ./navigation.js but importing doesn't work for some stupid reason
// progress should always return number, even if it will return infinity
function emphasizeEnd(fraction) {
  return Decimal.pow(fraction, 10).toNumber();
}

function rebuyableCost(initialCost, increment, id) {
  return initialCost * Math.pow(increment, player.celestials.v.upgrades[id]);
}

function rebuyable(config) {
  const { id, cap, costCap, description, formatEffect, formatCost } = config;
  return {
    id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
    cap,
    costCap,
    description,
    effect: () => config.effect(player.celestials.v.upgrades[config.id]),
    formatEffect,
    formatCost,
    rebuyable: true
  };
}

export const V_REDUCTION_MODE = {
  SUBTRACTION: 1,
  DIVISION: 2
};

export const v = {
  // Note: mainUnlock IDs here are one-indexed to match with navigation indices
  mainUnlock: {
    realities: {
      id: 1,
      name: "Realities",
      resource: () => Currency.realities.value,
      requirement: 1250,
      format: x => formatInt(x),
      progress: () => new Decimal(Currency.realities.value).div(EndgameMilestone.vReduction.isReached ? 100 : 1250).toNumber(),
    },
    eternities: {
      id: 2,
      name: "Eternities",
      resource: () => Currency.eternities.value,
      requirement: 1e70,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.eternities.value.add(1).pLog10().div(70)),
    },
    infinities: {
      id: 3,
      name: "Infinities",
      resource: () => Currency.infinitiesTotal.value,
      requirement: 1e160,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.infinitiesTotal.value.add(1).pLog10().div(160)),
    },
    dilatedTime: {
      id: 4,
      name: "Dilated Time",
      resource: () => player.records.thisReality.maxDT,
      requirement: DC.E320,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxDT.add(1).pLog10().div(320)),
    },
    replicanti: {
      id: 5,
      name: "Replicanti",
      resource: () => player.records.thisReality.maxReplicanti,
      requirement: DC.E320000,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxReplicanti.add(1).pLog10().div(320000)),
    },
    realityMachines: {
      id: 6,
      name: "Reality Machines",
      resource: () => Currency.realityMachines.value,
      requirement: 1e60,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.realityMachines.value.add(1).pLog10().div(60)),
    },
  },
  runUnlocks: [
    {
      id: 0,
      name: "Glyph Knight",
      description: value => `Unlock Reality with at most ${quantifyInt("Glyph", -value)} equipped.`,
      // This achievement has internally negated values since the check is always greater than
      values: [-5, -4, -3, -2, -1, 0],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => new Decimal(-player.requirementChecks.reality.maxGlyphs),
      formatRecord: x => (x.gte(-5) ? formatInt(x.neg()) : "Not reached"),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 1,
      name: "AntiStellar",
      description: value => `Have ${formatInt(value)} total Galaxies from all types.`,
      values: [4000, 4300, 4600, 4900, 5200, 5500],
      condition: () => V.isRunning,
      currentValue: () => actualBaseGalaxiesWithoutGeneration(),
      formatRecord: x => formatHybridLarge(x, 3),
      shardReduction: tiers => Math.floor(300 * tiers),
      maxShardReduction: goal => goal - 4000,
      perReductionStep: 3,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: value => `Get ${format(Decimal.pow10(value))} Infinity Points in Eternity Challenge 7.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6],
      condition: () => V.isRunning && EternityChallenge(7).isRunning,
      currentValue: () => Currency.infinityPoints.value.add(1).log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 1.2e5 * tiers,
      maxShardReduction: goal => goal - 6e5,
      perReductionStep: DC.E1200,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 3,
      name: "Young Boy",
      description: value => `Get ${format(Decimal.pow10(value))} ${player.universes.current === 2 ? "Matter" : "Antimatter"} in Eternity Challenge 12 without
        unlocking Time Dilation.`,
      values: [400e6, 450e6, 500e6, 600e6, 700e6, 800e6],
      condition: () => V.isRunning && EternityChallenge(12).isRunning && !PlayerProgress.dilationUnlocked(),
      currentValue: () => Currency.antimatter.value.add(1).log10(),
      formatRecord: x => format(Decimal.pow10(x)),
      shardReduction: tiers => 50e6 * tiers,
      maxShardReduction: goal => goal - 400e6,
      perReductionStep: DC.E500000,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: value => `Get ${format(Decimal.pow10(value))} Eternity Points.`,
      values: [7000, 7600, 8200, 8800, 9400, 10000],
      condition: () => V.isRunning,
      currentValue: () => Currency.eternityPoints.value.add(1).log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 600 * tiers,
      maxShardReduction: goal => goal - 7000,
      perReductionStep: 1e6,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 5,
      name: "Matterception",
      description: value => `Get ${formatInt(value)} Dimension Boosts while Dilated and inside Eternity Challenge 5.`,
      values: [51, 52, 53, 54, 55, 56],
      condition: () => V.isRunning && player.dilation.active && EternityChallenge(5).isRunning,
      currentValue: () => DimBoost.purchasedBoosts,
      formatRecord: x => formatHybridLarge(x, 3),
      shardReduction: tiers => Math.floor(tiers),
      maxShardReduction: () => 5,
      reductionStepSize: 100,
      perReductionStep: 1,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 6,
      name: "Requiem for a Glyph",
      description: value => `Unlock Reality with at most ${formatInt(-value)} Glyphs equipped for the entire Reality.`,
      // This achievement has internally negated values since the check is always greater than
      values: [1, 4, 7, 10, 13],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => new Decimal(-player.requirementChecks.reality.maxGlyphs),
      formatRecord: x => formatInt(x.neg()),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 7,
      name: "Post-destination",
      description: value => `Get ${formatInt(400000)} Time Theorems with a /${format(Decimal.pow10(value), 2, 2)}
        Black Hole or slower, without discharging or entering EC12.`,
      values: [100, 150, 200, 250, 300],
      condition: () => V.isRunning,
      currentValue: () => new Decimal(
        // Dirty hack I know lmao
        Currency.timeTheorems.gte(400000)
          ? -Math.log10(player.requirementChecks.reality.slowestBH)
          : 0),
      formatRecord: x => `${formatInt(1)} / ${format(Decimal.pow(10, x))}`,
      shardReduction: tiers => 50 * tiers,
      maxShardReduction: goal => goal - 50,
      reductionStepSize: 2,
      perReductionStep: 10,
      mode: V_REDUCTION_MODE.DIVISION,
      isHard: true
    },
    {
      id: 8,
      name: "Shutter Glyph",
      description: value => `Reach a Glyph of level ${formatInt(value)}.`,
      values: [6500, 7000, 8000, 9000, 10000],
      condition: () => V.isRunning,
      currentValue: () => new Decimal(gainedGlyphLevel().actualLevel),
      formatRecord: x => formatHybridLarge(x, 3),
      shardReduction: tiers => Math.floor(500 * tiers),
      maxShardReduction: () => 500,
      perReductionStep: 5,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    }
  ],
  unlocks: {
    vAchievementUnlock: {
      id: 0,
      reward: "Unlock V, The Celestial Of Achievements",
      description: "Meet all the above requirements simultaneously",
      requirement: () => Object.values(GameDatabase.celestials.v.mainUnlock).every(e => e.progress() >= 1)
    },
    shardReduction: {
      id: 1,
      reward: `You can spend Perk Points to reduce the goal requirement of all tiers of each V-Achievement.`,
      description: () => `Have ${formatInt(2)} V-Achievements`,
      requirement: () => V.spaceTheorems >= 2,
      pelleDisabled: () => !PelleCelestialUpgrade.vMilestones1.canBeApplied
    },
    adPow: {
      id: 2,
      reward: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension power based on total Space Theorems.`,
      description: () => `Have ${formatInt(5)} V-Achievements`,
      effect: () => player.disablePostReality ? 1 : 1 + Math.sqrt(V.spaceTheorems) / 80,
      format: x => formatPow(x, 3, 3),
      requirement: () => V.spaceTheorems >= 5,
      pelleDisabled: () => !PelleCelestialUpgrade.vMilestones1.canBeApplied
    },
    fastAutoEC: {
      id: 3,
      reward: "Achievement multiplier reduces Auto-EC completion time.",
      description: () => `Have ${formatInt(10)} V-Achievements`,
      effect: () => player.disablePostReality ? 1 : Achievements.power,
      // Base rate is 60 ECs at 20 minutes each
      format: x => ((Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied || EndgameMilestone.startRa.isReached) && !player.disablePostReality
        ? "Instant (Ra upgrade)"
        : `${TimeSpan.fromMinutes(new Decimal(60).times(20).div(x)).toStringShort()} for full completion`),
      requirement: () => V.spaceTheorems >= 10,
      pelleDisabled: () => !PelleCelestialUpgrade.vMilestones2.canBeApplied
    },
    autoAutoClean: {
      id: 4,
      reward: "Unlock the ability to Automatically Purge Glyphs on Reality.",
      description: () => `Have ${formatInt(16)} V-Achievements`,
      requirement: () => V.spaceTheorems >= 16,
      pelleDisabled: () => !PelleCelestialUpgrade.vMilestones2.canBeApplied
    },
    achievementBH: {
      id: 5,
      reward: "Achievement multiplier affects Black Hole power.",
      description: () => `Have ${formatInt(30)} V-Achievements`,
      effect: () => player.disablePostReality ? 1 : Achievements.power,
      format: x => formatX(x, 2, 0),
      requirement: () => V.spaceTheorems >= 30,
      pelleDisabled: () => !PelleCelestialUpgrade.vMilestones3.canBeApplied
    },
    raUnlock: {
      id: 6,
      reward() {
        return `Reduce the Space Theorem cost of Time Studies by ${formatInt(2)}.
                Unlock Ra, Celestial of the Forgotten.`;
      },
      description: () => `Have ${formatInt(36)} V-Achievements`,
      effect: () => player.disablePostReality ? 0 : 2,
      requirement: () => V.spaceTheorems >= 36,
      pelleDisabled: () => !PelleCelestialUpgrade.vMilestones3.canBeApplied
    }
  }
};

export const vUpgrades = {
  auto: rebuyable({
    id: 0,
    initialCost: 1e80,
    increment: 1e5,
    description: () => `Reduce the time to automatically complete V-Achievements`,
    effect: bought => 60 / Math.pow(2, bought),
    formatEffect: value => value <= 0.03 ? "Instant" : TimeSpan.fromMilliseconds(new Decimal(value * 1000)).toStringShort(),
    formatCost: value => format(value, 2),
    costCap: 1e135,
    cap: Number.MAX_VALUE
  }),
};
