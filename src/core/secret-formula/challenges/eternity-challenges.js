const specialInfinityGlyphDisabledEffectText = () => (PelleRifts.chaos.milestones[1].canBeApplied && !PelleDestructionUpgrade.pelleGlyphEffects.canBeApplied
  ? "The Pelle-Specific effect from Infinity Glyphs is also disabled."
  : "");

export const eternityChallenges = [
  {
    id: 1,
    description: () => {
      if (Alpha.isRunning) return "Time Dimensions are disabled. Double the Infinity Dimension purchase cap.";
      return "Time Dimensions are disabled.";
    },
    goal: DC.E1800,
    goalIncrease: DC.E200,
    slabGoal: DC.E2900,
    slabGoalIncrease: DC.E400,
    reward: {
      description: "Time Dimension multiplier based on time spent this Eternity",
      effect: completions =>
        Decimal.pow(Decimal.max(player.records.thisEternity.time.div(10), 0.9), 0.3 + (completions * 0.05)),
      formatEffect: value => formatX(value, 2, 1)
    },
    // These will get notation-formatted and scrambled between for the final goal
    scrambleText: ["1e2600", "1e201600"],
  },
  {
    id: 2,
    description: "Infinity Dimensions are disabled.",
    goal: DC.E975,
    pelleGoal: DC.E1750,
    goalIncrease: DC.E175,
    alphaGoal: DC.E2200,
    alphaGoalIncrease: DC.E300,
    slabGoal: DC.E1700,
    slabGoalIncrease: DC.E200,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC2Nerf.canBeApplied,
    reward: {
      description: "1st Infinity Dimension multiplier based on Infinity Power",
      effect: completions => Currency.infinityPower.value.pow(5 / (700 - completions * 100)).clampMin(1),
      cap: () => Alpha.isDestroyed ? DC.BEMAX : DC.E1000,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 3,
    description: () => Slabdrill.isCursed
      ? `Your Antimatter Dimension is raised ${formatPow(0.5, 1, 1)}. Dimensional Sacrifice is disabled.`
      : `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions 5-8 don't produce anything. Dimensional Sacrifice is disabled.`,
    goal: DC.E600,
    pelleGoal: DC.E925,
    goalIncrease: DC.E75,
    alphaGoal: DC.E750,
    alphaGoalIncrease: DC.E100,
    slabGoal: DC.E1700,
    slabGoalIncrease: DC.E300,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC3Nerf.canBeApplied,
    reward: {
      description: () => `Increase the multiplier for buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`,
      effect: completions => completions * 0.72,
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  {
    id: 4,
    description: `all Infinity multipliers and generators are disabled. The goal must be reached within a certain
      number of Infinities or else you will fail the Challenge.`,
    goal: DC.E2750,
    goalIncrease: DC.E550,
    alphaGoal: DC.E3200,
    slabGoal: DC.E4500,
    slabGoalIncrease: DC.E1700,
    restriction: completions => Math.max(16 - 4 * completions, 0),
    checkRestriction: restriction => Currency.infinities.lte(restriction),
    formatRestriction: restriction => (restriction === 0
      ? "without any Infinities"
      : `in ${quantifyInt("Infinity", restriction)} or less`),
    failedRestriction: "(Too many Infinities for more)",
    reward: {
      description: "Infinity Dimension multiplier based on unspent IP",
      effect: completions => Currency.infinityPoints.value.pow(0.003 + completions * 0.002),
      cap: () => Alpha.isDestroyed ? DC.BEMAX : DC.E200,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 5,
    description: () => Slabdrill.isCursed ? "Dimension Boost costs scaling is massively increased." :
      `${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy cost increase scaling starts immediately (normally at ${formatInt(100)}
      Galaxies). Dimension Boost costs scaling is massively increased.`,
    goal: DC.E750,
    pelleGoal: DC.E1400,
    goalIncrease: DC.E400,
    alphaGoal: DC.E1650,
    slabGoal: DC.E3000,
    slabGoalIncrease: DC.E3000,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC5Nerf.canBeApplied,
    reward: {
      description: () => Slabdrill.isCursed ? "All Galaxies are stronger" : "Distant Galaxy cost scaling starts later",
      effect: completions => Slabdrill.isCursed ? completions / 20 + 1 : completions * 5,
      formatEffect: value => Slabdrill.isCursed ? formatPercents(value - 1) : `${formatInt(value)} ${player.universes.current === 2 ? "MG" : "AG"} later`
    }
  },
  {
    id: 6,
    // The asterisk, if present, will get replaced with strings generated from the scramble text
    description: () => {
      if (Enslaved.isRunning) return "you *. The cost of upgrading your max Replicanti Galaxies is massively reduced.";
      return `you cannot gain ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies normally. The cost of upgrading your max Replicanti` +
              " Galaxies is massively reduced.";
    },
    goal: DC.E750,
    pelleGoal: DC.E1500,
    goalIncrease: DC.E200,
    alphaGoal: DC.E800,
    slabGoal: DC.E3500,
    slabGoalIncrease: DC.E900,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC6Nerf.canBeApplied,
    reward: {
      description: () => `Further reduce ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension cost multiplier growth`,
      effect: completions => completions * 0.2,
      formatEffect: value => {
        const total = Math.round(Player.dimensionMultDecrease + Effects.sum(EternityChallenge(6).reward)) - value;
        return `-${format(value, 2, 1)} (${formatX(total, 2, 1)} total)`;
      }
    },
    scrambleText: [`cannot gain Antimatter Galaxies normally`, "c㏰'퐚 gai鸭 Anti꟢at랜erﻪﶓa⁍axie㮾 䂇orma㦂l"],
  },
  {
    id: 7,
    description: () =>
      `1st Time Dimensions produce 8th Infinity Dimensions${Slabdrill.isCursed ? ` and Infinity Dimensions are useless` :
      ` and 1st Infinity Dimensions produce 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`}. Tickspeed also directly applies to Infinity
      and Time Dimensions.`,
    goal: DC.E2000,
    pelleGoal: DC.E2700,
    goalIncrease: DC.E530,
    alphaGoal: DC.E1200,
    alphaGoalIncrease: DC.E200,
    slabGoal: DC.E1600,
    slabGoalIncrease: DC.E1000,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC7Nerf.canBeApplied,
    effect: () => TimeDimension(1).productionPerSecond,
    reward: {
      description: "1st Time Dimension produces 8th Infinity Dimensions",
      effect: completions => {
        let base = TimeDimension(1).productionPerSecond.pow(completions * 0.2).minus(1).clampMin(0);
        if (Pelle.isDoomed) base = base.min(DC.ENUMMAX).times(Decimal.pow10(base.max(1).log10().div(DC.NUMMAX).pow(0.1)));
        return base;
      },
      formatEffect: value => `${format(value, 2, 1)} per second`
    }
  },
  {
    id: 8,
    description: () => `you can only upgrade Infinity Dimensions ${formatInt(50)} times and Replicanti
      upgrades ${formatInt(40)} times. Infinity Dimension and Replicanti upgrade autobuyers are disabled.`,
    goal: DC.E1300,
    pelleGoal: DC.E2800,
    goalIncrease: DC.E750,
    alphaGoal: DC.E2400,
    slabGoal: DC.E4750,
    slabGoalIncrease: DC.E7250,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC8Nerf.canBeApplied,
    reward: {
      description: "Infinity Power strengthens Replicanti Galaxies",
      effect: completions => {
        const infinityPower = Decimal.log10(Currency.infinityPower.value.add(1).pLog10().add(1));
        return Decimal.max(0, Decimal.pow(infinityPower, (Slabdrill.isCursed ? 0.1 : 0.03) * completions).sub(1)).toNumber();
      },
      formatEffect: value => formatPercents(value, 2)
    }
  },
  {
    id: 9,
    description: () => `you cannot buy Tickspeed upgrades. Infinity Power instead multiplies
      Time Dimensions with greatly reduced effect. ${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E1750,
    pelleGoal: DC.E2900,
    goalIncrease: DC.E250,
    alphaGoal: DC.E9000,
    alphaGoalIncrease: DC.E4000,
    slabGoal: DC.E6000,
    slabGoalIncrease: DC.E4000,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC9Nerf.canBeApplied,
    reward: {
      description: "Infinity Dimension multiplier based on Time Shards",
      effect: completions => Currency.timeShards.value.pow(completions * (Slabdrill.isCursed ? 1 : 0.1)).clampMin(1),
      cap: () => Alpha.isDestroyed ? DC.BEMAX : (Slabdrill.isCursed ? DC.E1000 : DC.E400),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 10,
    description: () => {
      let description = `Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from
        Infinities to ${Slabdrill.isCursed ? "your Antimatter Dimension" : `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`}
        (Infinities${formatPow(950)}). ${specialInfinityGlyphDisabledEffectText()}`;
      EternityChallenge(10).applyEffect(v => description += ` Currently: ${formatX(v, 2, 1)}`);
      return description;
    },
    goal: DC.E3000,
    pelleGoal: DC.E3200,
    goalIncrease: DC.E300,
    alphaGoal: DC.E15000,
    alphaGoalIncrease: DC.E2000,
    slabGoal: DC.E25000,
    slabGoalIncrease: DC.E2000,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC10Nerf.canBeApplied,
    effect: () => Decimal.pow(Currency.infinitiesTotal.value, 950).clampMin(1).pow(TimeStudy(31).effectOrDefault(1)),
    reward: {
      description: "Time Dimension multiplier based on Infinities",
      effect: completions => {
        const mult = Currency.infinitiesTotal.value.times(2.783e-6).pow(
          Slabdrill.isCursed ? 0.04 + 0.01 * completions : 0.4 + 0.1 * completions).clampMin(1);
        return mult.powEffectOf(TimeStudy(31));
      },
      formatEffect: value => {
        // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
        const mult = formatX(value, 2, 1);
        return TimeStudy(31).canBeApplied
          ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (After TS31: ${mult})`
          : mult;
      }
    }
  },
  {
    id: 11,
    description: () => `all Dimension multipliers and powers are disabled except for the multipliers from
      Infinity Power and Dimension Boosts (to ${Slabdrill.isCursed ?
      "your Antimatter Dimension" : `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`}). ${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E450,
    pelleGoal: DC.E11200,
    goalIncrease: DC.E175,
    pelleGoalIncrease: DC.E1400,
    alphaGoal: DC.E6000,
    alphaGoalIncrease: DC.E450,
    slabGoal: DC.E7500,
    slabGoalIncrease: DC.E1000,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC11Nerf.canBeApplied,
    reward: {
      description: "Further reduce Tickspeed cost multiplier growth",
      effect: completions => completions * 0.07,
      formatEffect: value => {
        const total = Math.round(Player.tickSpeedMultDecrease + Effects.sum(EternityChallenge(11).reward)) - value;
        return `-${format(value, 2, 2)} (${formatX(total, 2, 2)} total)`;
      }
    }
  },
  {
    id: 12,
    description: () => (PlayerProgress.realityUnlocked()
      ? `the game runs ×${formatInt(1000)} slower; all other game speed effects are disabled. The goal must be reached
        within a certain amount of time or you will fail the Challenge. ${specialInfinityGlyphDisabledEffectText()}`
      : `the game runs ×${formatInt(1000)} slower. The goal must be reached
        within a certain amount of time or you will fail the Challenge.`),
    goal: DC.E100000,
    pelleGoal: DC.E208000,
    goalIncrease: DC.E10000,
    slabGoal: DC.E220000,
    slabGoalIncrease: DC.E60000,
    hasPelleGoal: () => !PelleDestructionUpgrade.disableEC12Nerf.canBeApplied,
    restriction: completions => Math.max(10 - 2 * completions, 1) / 10,
    checkRestriction: restriction => Time.thisEternity.totalSeconds.lt(restriction),
    formatRestriction: restriction => `in ${quantify("in-game second", restriction, 0, 1)} or less.`,
    failedRestriction: "(Too slow for more)",
    reward: {
      description: "Infinity Dimension cost multipliers are reduced",
      effect: completions => 1 - (completions * 0.008 * EndgameMastery(273).effectOrDefault(1)),
      formatEffect: value => `x${formatPow(value, 3, 3)}`
    }
  }
];
