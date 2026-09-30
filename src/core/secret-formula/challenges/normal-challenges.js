// I tried to make it relatively simple to add more locks; the idea is that you give it a value here
// and then it's all handled in the backend
// If you need to lock a challenge, set lockedAt to a new Decimal variable reflective of a desired number of Infinities
// They will always be unlocked post-eternity

export const normalChallenges = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description() {
      return PlayerProgress.eternityUnlocked()
        ? "reach Infinity for the first time outside of a challenge."
        : "reach Infinity for the first time.";
    },
    name: () => `1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => "Infinities power themselves at a severely reduced rate",
      effect: () => player.infinities.max(4).log2().log2(),
      formatEffect: value => formatPow(value, 2, 3)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D0
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description:
      () => `buying ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions or Tickspeed upgrades halts production of
      ${Slabdrill.isCursed ? "your Antimatter Dimension." : `all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions.`} Production gradually returns to normal
      over ${formatInt(3)} minutes.`,
    name: () => `2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => `Gain a power to the first three Dimension types that increases over ${formatInt(5)} hours this Endgame`,
      effect: () => Time.thisEndgameRealTime.totalSeconds.max(1).min(18000).pow(0.75),
      formatEffect: value => formatPow(value, 2, 3)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description:
      () => `${Slabdrill.isCursed ? "your" : "the 1st"} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension is heavily weakened, but gets an uncapped exponentially
      increasing multiplier. This multiplier resets after Dimension Boosts and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`,
    name: () => `3rd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 3rd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => `Gain a Dilation to the 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension that increases over ${formatInt(5)} hours this Endgame`,
      effect: () => Time.thisEndgameRealTime.totalHours.min(5).div(100).add(1),
      formatEffect: value => formatPow(value, 2, 4)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: () => Slabdrill.isCursed ? "buying your Antimatter Dimension resets Antimatter." :
      `buying ${player.universes.current === 2 ? "a Matter" : "an Antimatter"} Dimension automatically erases all lower tier ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions, ` +
      "like a sacrifice without the boost.",
    name: () => `4th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 4th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => "Dimension Surges are cheaper based on their amount",
      effect: () => Decimal.pow(0.9, player.dimensionBoosts.max(1).log10()),
      formatEffect: value => formatPow(value, 2, 3)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description:
      () => `the Tickspeed purchase multiplier starts at ${formatX(1.080, 0, 3)} instead of ${formatX(1.1245, 0, 3)}.`,
    name: () => `5th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 5th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => "Galaxies are stronger based on total Galaxies",
      effect: () => Decimal.log10(GalacticPowers.galacticAscension.isUnlocked ?
        Replicanti.galaxies.total.max(1).times(player.galaxies.max(1)).times(player.dilation.totalTachyonGalaxies.max(1)).times(
        GalacticPower.freeGalaxies.max(1)).times(GalaxyGenerator.galaxies.max(1)).max(10) :
        Replicanti.galaxies.total.add(player.galaxies).add(player.dilation.totalTachyonGalaxies).add(
        GalacticPower.freeGalaxies).add(GalaxyGenerator.galaxies).max(10)).pow(2),
      formatEffect: value => formatX(value, 2, 2)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: () => Slabdrill.isCursed ? "Your Antimatter Dimension is more expensive." :
      `upgrading each ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension costs the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension ${formatInt(2)} tiers ` +
      `below it instead of ${player.universes.current === 2 ? "matter" : "antimatter"}. ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension prices are modified.`,
    name: () => `6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => `Gain more Continuum purchases based on 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`,
      effect: () => Decimal.log10(AntimatterDimension(8).amount.max(10)).pow(2),
      formatEffect: value => formatX(value, 2, 2)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () =>
      Slabdrill.isCursed ? `the multiplier from buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions is reduced to ${formatX(5)}.
        This increases by ${formatX(5)} per Dimension Boost, to a maximum of ${formatX(30)}, and is unaffected by any upgrades.` :
      `the multiplier from buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions is reduced to ${formatX(1)}. This increases by
        ${formatX(0.2, 1, 1)} per Dimension Boost, to a maximum of ${formatX(2)}, and is unaffected by any upgrades.`,
    name: () => `7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => "Buy OoM Power is stronger based on Dimension Surges",
      effect: () => Decimal.log10(player.dimensionBoosts.max(1)).add(1),
      formatEffect: value => formatX(value, 2, 2)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: () => `Dimension Boosts provide no multiplier and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies cannot be bought.
      ${Slabdrill.isCursed ? "" : `Dimensional Sacrifice resets ${player.universes.current === 2 ? "matter" : "antimatter"} and all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions,
      but also gives a significantly stronger multiplier.`}`,
    name: () => `8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : `Upgradeable 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer`,
    charged: {
      reward: () => "Dimensional Sacrifice is stronger based on itself",
      effect: () => Decimal.log10(Sacrifice.totalBoost.max(10).log10().log10().add(1)).add(1),
      formatEffect: value => formatX(value, 2, 2)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => `whenever you buy Tickspeed upgrades or ${formatInt(10)} of ${player.universes.current === 2 ? "a Matter" : "an Antimatter"} Dimension, ` +
      "everything else of equal cost will increase to its next cost step.",
    name: () => "Tickspeed Autobuyer",
    reward: () => Slabdrill.isCursed ? `Antimatter Dimension ${formatX(6.66, 2, 2)}` : "Upgradeable Tickspeed Autobuyer",
    charged: {
      reward: () => `Gain more Continuum purchases based on ${player.universes.current === 2 ? "Matter" : "Antimatter"}`,
      effect: () => Decimal.log10(Decimal.log10(player.antimatter.max(1e10))).pow(2),
      formatEffect: value => formatX(value, 2, 2)
    },
    lockedAt: DC.D0,
    alphaLockedAt: DC.D1
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: () => Slabdrill.isCursed ? `your Antimatter Dimension is raised ${formatPow(0.75, 2, 2)}.` :
      `there are only ${formatInt(6)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions. Dimension Boost ` +
      `and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy costs are modified.`,
    name: () => "Automated Dimension Boosts",
    reward: () => "Dimension Boosts Autobuyer",
    charged: {
      reward: () => "Gain more Galactic Power based on Dimension Surges",
      effect: () => player.dimensionBoosts.max(1).log10().div(20).add(1),
      formatEffect: value => formatPow(value, 2, 3)
    },
    lockedAt: DC.D16,
    alphaLockedAt: DC.D16
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => `there is ${player.universes.current === 2 ? "antimatter" : "normal matter"} which rises${Slabdrill.isCursed ? "" : ` once you have at
      least ${formatInt(1)} 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`}. If it exceeds your ${player.universes.current === 2 ? "matter" : "antimatter"}, it will Dimension Boost
      without giving the bonus.`,
    name: () => `Automated ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies`,
    reward: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies Autobuyer`,
    charged: {
      reward: () => "Unlock the Tangible Universe"
    },
    lockedAt: DC.D16,
    alphaLockedAt: DC.D16
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => Slabdrill.isCursed ? `your Antimatter Dimension is raised ${formatPow(0.5, 1, 1)} and returns
      over the span of ${formatInt(3)} minutes, resetting on Dimension Boosts and Antimatter Galaxies.` :
      `each ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension produces the Dimension ${formatInt(2)} tiers below it
      instead of ${formatInt(1)}. Both 1st and 2nd Dimensions produce ${player.universes.current === 2 ? "matter" : "antimatter"}.
      The 2nd, 4th, and 6th Dimensions are made stronger to compensate.`,
    name: () => "Automated Big Crunches",
    reward: () => "Big Crunches Autobuyer",
    charged: {
      reward: () => `Even-numbered ${player.universes.current === 2 ? "MDs" : "ADs"} are stronger based on 8th Dimensions and ${player.universes.current === 2 ? "MD" : "AD"} amounts are no longer affected by Entropy caps`,
      effect: () => Decimal.log10(AntimatterDimension(8).amount.max(10)),
      formatEffect: value => formatPow(value, 2, 3)
    },
    lockedAt: DC.D16,
    alphaLockedAt: DC.D16
  }
];
