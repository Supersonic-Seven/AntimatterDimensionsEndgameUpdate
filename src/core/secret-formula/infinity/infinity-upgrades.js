function dimInfinityMult() {
  return Currency.infinitiesTotal.value.times(0.2).plus(1);
}
function chargedDimInfinityMult() {
  return 1 + Decimal.log10(Decimal.max(1, Currency.infinitiesTotal.value.add(1).pLog10())).toNumber() * Math.sqrt(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1))) / 150;
}

export const infinityUpgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension gains a multiplier based on time played" :
      `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on time played`,
    effect: () => Decimal.pow(Time.totalTimePlayed.totalMinutes.div(2), 0.15),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a power effect based on time played and Teresa level`,
      effect: () => 1 +
        Decimal.log10(Decimal.log10(Time.totalTimePlayed.totalMilliseconds)).times(
        Math.pow(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1)), 0.5)).div(150).toNumber(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim18mult: {
    id: "18Mult",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.totalTimeMult.isBought,
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension gains a multiplier based on Infinities" :
      `1st and 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on Infinities`,
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => `1st and 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a power effect based on Infinities and Teresa level`,
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim27mult: {
    id: "27Mult",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.buy10Mult.isBought,
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension gains a multiplier based on Infinities" :
      `2nd and 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on Infinities`,
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => `2nd and 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a power effect based on Infinities and Teresa level`,
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim36mult: {
    id: "36Mult",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.dim18mult.isBought,
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension gains a multiplier based on Infinities" :
      `3rd and 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on Infinities`,
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => `3rd and 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a power effect based on Infinities and Teresa level`,
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim45mult: {
    id: "45Mult",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.dim27mult.isBought,
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension gains a multiplier based on Infinities" :
      `4th and 5th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on Infinities`,
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => `4th and 5th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a power effect based on Infinities and Teresa level`,
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  resetBoost: {
    id: "resetBoost",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.dim36mult.isBought,
    description: () =>
      `Decrease the number of Dimensions needed for Dimension Boosts and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies by ${formatInt(9)}`,
    effect: 9,
    charged: {
      description: () => "Decrease Dimension Boost requirement based on Teresa level",
      effect: () => 1 / (1 + Math.sqrt(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1))) / 10),
      formatEffect: value => `${formatX(value, 4, 4)}`
    }
  },
  buy10Mult: {
    id: "dimMult",
    cost: () => Math.pow(1, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    description: () => `Increase the multiplier for buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`,
    effect: () => 1.1,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.2, 0, 1)}`,
    charged: {
      description: () => `The multiplier for buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gains ` +
        "a power effect based on Teresa level",
      effect: () => 1 + (Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1))) / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: () => Math.pow(2, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.dim45mult.isBought,
    description: "All Galaxies are twice as strong",
    effect: 2,
    charged: {
      description: "All Galaxies are stronger based on Teresa level",
      effect: () => 2 + Math.sqrt(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1))) / 100,
      formatEffect: value => `+${formatPercents(value - 1)}`
    }
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: () => Math.pow(3, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension gains a multiplier based on time spent in current Infinity" :
      `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on time spent in current Infinity`,
    effect: () => Decimal.max(Decimal.pow(Time.thisInfinity.totalMinutes.div(4), 0.25), 1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a power effect based on time spent in current Infinity and Teresa level`,
      effect: () => 1 +
        Decimal.log10(Decimal.log10(Time.thisInfinity.totalMilliseconds.plus(100))).times(
        Math.sqrt(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1)))).div(150).toNumber(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: () => Math.pow(5, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.thisInfinityTimeMult.isBought,
    description: () => Slabdrill.isCursed ? "Multiplier to your Antimatter Dimension based on unspent Infinity Points" :
      `Multiplier to 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension based on unspent Infinity Points`,
    effect: () => {
      const divisor = (EndgameMastery(81).isBought && !player.disablePostReality) ? 5 : 10;
      const subtrahend = (EndgameMastery(81).isBought && !player.disablePostReality) ? 1.5 : 0;
      return Decimal.min(Currency.infinityPoints.value.dividedBy(2), Decimal.pow(DC.E1E15, EndgameUpgrade(1).effectOrDefault(1))).pow(Decimal.max((Decimal.log10(Currency.infinityPoints.value.add(10).log10()).div(divisor)).sub(subtrahend), 1.5)).plus(1);
    },
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: () => `Multiplier to 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension based on unspent Infinity Points, powered by Teresa level`,
      effect: () => {
        const divisor = (EndgameMastery(81).isBought && !player.disablePostReality) ? 5 : 10;
        const subtrahend = (EndgameMastery(81).isBought && !player.disablePostReality) ? 1.5 : 0;
        return Decimal.min(Currency.infinityPoints.value.dividedBy(2), Decimal.pow(DC.E1E15, EndgameUpgrade(1).effectOrDefault(1))).pow(Decimal.sqrt(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1))).times(Decimal.max((Decimal.log10(Currency.infinityPoints.value.add(10).log10()).div(divisor)).sub(subtrahend), 1.5))).plus(1);
      },
      formatEffect: value => formatX(value, 2, 2)
    }
  },
  dimboostMult: {
    id: "resetMult",
    cost: () => Math.pow(7, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.unspentIPMult.isBought,
    description: "Increase Dimension Boost multiplier",
    effect: () => 2.5,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.5, 0, 1)}`,
    charged: {
      description: "Dimension Boost multiplier gains a power effect based on Teresa level",
      effect: () => 1 + (Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1))) / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  ipGen: {
    id: "passiveGen",
    cost: () => Math.pow(10, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.dimboostMult.isBought,
    description: () => `Passively generate Infinity Points ${formatInt(10)} times slower than your fastest Infinity`,
    // Cutting corners: this is not actual effect, but it is totalIPMult that is displyed on upgrade
    effect: () => (Teresa.isRunning || V.isRunning || (Pelle.isDoomed && !PelleDestructionUpgrade.passiveIPGen.canBeApplied) ? DC.D0 : GameCache.totalIPMult.value),
    formatEffect: value => {
      if (Teresa.isRunning || V.isRunning) return "Disabled in this reality";
      if (Pelle.isDoomed && !PelleDestructionUpgrade.passiveIPGen.canBeApplied) return "Disabled";
      if (Alpha.isRunning && player.records.bestInfinity.realTime >= 999999999999) return "Too slow to generate";
      if (player.records.bestInfinity.time.gte(999999999999)) return "Too slow to generate";
      if (Alpha.isRunning) return `${format(value, 2)} every ${TimeSpan.fromMilliseconds(Time.bestInfinityRealTime.totalMilliseconds.times(10)).toStringShort()}`;
      return `${format(value, 2)} every ${TimeSpan.fromMilliseconds(Time.bestInfinity.totalMilliseconds.times(10)).toStringShort()}`;
    },
    charged: {
      description: () =>
        `Gain Reality Machines each real-time second proportional to amount gained on Reality,
        increasing with Teresa level`,
      effect: () => Math.pow(Ra.pets.teresa.level * Ra.unlocks.chargeBoost.effectOrDefault(1) * (player.disablePostReality ? 1 : AlphaUnlocks.autoCrunchChallenge.effects.buff.effectOrDefault(1)), 2) *
        Ra.unlocks.continuousTTBoost.effects.autoPrestige.effectOrDefault(1),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  skipReset1: {
    id: "skipReset1",
    cost: () => Math.pow(20, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    description: () =>
      Slabdrill.isCursed ? `Start every reset with ${formatInt(1)} Dimension Boost` :
      `Start every reset with ${formatInt(1)} Dimension Boost, automatically unlocking the 5th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`,
  },
  skipReset2: {
    id: "skipReset2",
    cost: () => Math.pow(40, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.skipReset1.isBought,
    description: () =>
      Slabdrill.isCursed ? `Start every reset with ${formatInt(2)} Dimension Boosts` :
      `Start every reset with ${formatInt(2)} Dimension Boosts, automatically unlocking the 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`,
  },
  skipReset3: {
    id: "skipReset3",
    cost: () => Math.pow(80, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.skipReset2.isBought,
    description: () =>
      Slabdrill.isCursed ? `Start every reset with ${formatInt(3)} Dimension Boosts` :
      `Start every reset with ${formatInt(3)} Dimension Boosts, automatically unlocking the 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`,
  },
  skipResetGalaxy: {
    id: "skipResetGalaxy",
    cost: () => Math.pow(300, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => InfinityUpgrade.skipReset3.isBought,
    description: () =>
      Slabdrill.isCursed ? `Start every reset with ${formatInt(4)} Dimension Boosts and ${player.universes.current === 2 ? "a Matter" : "an Antimatter"} Galaxy` :
      `Start every reset with ${formatInt(4)} Dimension Boosts, automatically unlocking the 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension;
      and ${player.universes.current === 2 ? "a Matter" : "an Antimatter"} Galaxy`,
  },
  ipOffline: {
    id: "ipOffline",
    cost: () => Math.pow(1000, Alpha.isRunning ? AlphaUnlocks.infinity.effects.nerf.effectOrDefault(1) : 1),
    checkRequirement: () => Achievement(41).isUnlocked,
    description: () => (player.options.offlineProgress
      ? `Only while offline, gain ${formatPercents(0.5)} of your best IP/min without using Max All`
      : "This upgrade would give offline Infinity Point generation, but offline progress is currently disabled"),
    effect: () => (player.options.offlineProgress
      ? player.records.thisEternity.bestIPMsWithoutMaxAll.times(TimeSpan.fromMinutes(new Decimal(1)).totalMilliseconds.div(2))
      : DC.D0),
    isDisabled: () => !player.options.offlineProgress,
    formatEffect: value => `${format(value, 2, 2)} IP/min`,
  },
  ipMult: {
    id: "ipMult",
    cost: () => InfinityUpgrade.ipMult.cost,
    checkRequirement: () => Achievement(41).isUnlocked || Ascensions.ipA.isUnlocked,
    costCap: () => Ascensions.ipA.isUnlocked ? DC.BEMAX : (Alpha.isRunning ? Decimal.pow10(AlphaUnlocks.infinityChallenges.effects.nerf.effectOrDefault(Decimal.log10((BreakEternityUpgrade.doubleIPUncap.isBought && !player.disablePostReality) ? DC.BEMAX : DC.E6E6).sub(1))).times(10) : ((BreakEternityUpgrade.doubleIPUncap.isBought && !player.disablePostReality) ? DC.BEMAX : DC.E6E6)),
    costIncreaseThreshold: () => Ascensions.ipA.isUnlocked ? DC.BEMAX : ((EndgameUpgrade(21).isBought && !player.disablePostReality) ? Decimal.pow10(1e125) : DC.E3E6),
    description: () => Ascensions.ipA.isUnlocked ? `Increase the exponent of Infinity Points by +${formatPow(0.01, 2, 2)}` : `Multiply Infinity Points from all sources by ${formatX(2)}`,
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => Ascensions.ipA.isUnlocked ? player.IPMultPurchases.div(100).add(1) : ((player.IPMultPurchases.gte(3300000) && (!BreakEternityUpgrade.doubleIPUncap.isBought || player.disablePostReality) ? DC.E1E6 : Decimal.round(DC.D2.pow(player.IPMultPurchases)))),
    cap: () => {
      if (Ascensions.ipA.isUnlocked) return DC.BEMAX;
      const normcap = (BreakEternityUpgrade.doubleIPUncap.isBought && !player.disablePostReality) ? DC.BEMAX : DC.E1E6;
      return Alpha.isRunning ? Decimal.pow(2, AlphaUnlocks.infinityChallenges.effects.nerf.effectOrDefault(Decimal.log2(Effarig.eternityCap ?? normcap))) : (Effarig.eternityCap ?? normcap);
    },
    formatEffect: value => `${Ascensions.ipA.isUnlocked ? formatPow(value, 2, 2) : formatX(value, 2, 2)}`,
  }
};
