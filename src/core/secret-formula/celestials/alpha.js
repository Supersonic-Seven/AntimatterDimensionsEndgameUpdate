export const alphaUnlocks = {
  fourthDimboost: {
    id: 0,
    requirement: 1,
    nerfDescription: "Square-root the Dimension Boost Multiplier",
    buffDescription: "Square the Dimension Boost Multiplier",
    effects: {
      nerf: 0.5,
      buff: 2
    }
  },
  fifthDimboost: {
    id: 1,
    requirement: 2,
    nerfDescription: "Double the Dimension Boost Scaling Threshold",
    buffDescription: () => `Decrease the base Dimension Boost Scaling Threshold by ${formatInt(2)}`,
    effects: {
      nerf: 2,
      buff: 2
    }
  },
  firstGalaxy: {
    id: 2,
    requirement: 3,
    nerfDescription: () => `All Galaxies are ${formatPercents(1 - Math.clamp(Decimal.log10(Decimal.log10(player.antimatter.add(1)).add(1)).div(20).add(0.5).toNumber(), 0.5, 1), 2)} weaker`,
    buffDescription: "The Alternation Effect in Glyph Alchemy affects all Galaxy types",
    effects: {
      nerf: () => Math.clamp(Decimal.log10(Decimal.log10(player.antimatter.add(1)).add(1)).div(20).add(0.5).toNumber(), 0.5, 1)
    }
  },
  infinity: {
    id: 3,
    requirement: 4,
    nerfDescription: "Infinity Upgrade costs are squared",
    buffDescription: () => `IP Gain is raised ${formatPow(1 + (Tesseracts.effectiveCount / 1000), 2, 3)} (based on Tesseracts)`,
    effects: {
      nerf: 2,
      buff: () => 1 + (Tesseracts.effectiveCount / 1000)
    }
  },
  autoCrunchChallenge: {
    id: 4,
    requirement: 5,
    nerfDescription: () => `The Big Crunch Autobuyer purchase scaling is increased to ${formatX(2.5, 1, 1)}`,
    buffDescription: "Charged Infinity Upgrades act as if your Teresa Level was twice as high",
    effects: {
      nerf: 2.5,
      buff: 2
    }
  },
  breakInfinity: {
    id: 5,
    requirement: 6,
    nerfDescription: () => `BIU costs ${formatX(1000)}, post-Break Tickspeed/${player.universes.current === 2 ? "MD" : "AD"} cost scalings start at ${formatX(20)}, IPow Conversion Rate /${format(Decimal.max(DC.D8.div(Decimal.log10(Decimal.log10(Currency.infinityPoints.value.add(1)).add(1)).pow(2).clampMin(0.001)), 1).toNumber(), 2, 2)} (based on IP), but Galaxy strength is doubled`,
    buffDescription: () => `Reduce Post-Break Tickspeed cost scaling by ${format(0.15, 2, 2)} and Post-Break Dimension cost scaling by ${format(0.25, 2, 2)}`,
    effects: {
      nerfA: 1000,
      nerfB: 20,
      nerfC: () => Decimal.max(DC.D8.div(Decimal.log10(Decimal.log10(Currency.infinityPoints.value.add(1)).add(1)).pow(2).clampMin(0.001)), 1).toNumber(),
      buffA: 0.15,
      buffB: 0.25
    }
  },
  powerGalaxies: {
    id: 6,
    requirement: 7,
    nerfDescription: () => `Distant Galaxy Cost Scaling starts at ${formatInt(1)} Galaxy`,
    buffDescription: () => `Galaxy scalings for Distant/Remote ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies are doubled`,
    effects: {
      nerf: 1,
      buff: 2
    }
  },
  breakUpgrades: {
    id: 7,
    requirement: 8,
    nerfDescription: () => `The Infinity Dimension Purchase cap is decreased to ${formatInt(player.records.thisReality.galaxies.toNumber() * (EternityChallenge(1).isRunning ? 2 : 1))} (based on Galaxies)`,
    buffDescription: () => `Reduce Post-Break Tickspeed cost scaling by ${format(0.15, 2, 2)} and Post-Break Dimension cost scaling by ${format(0.25, 2, 2)}`,
    effects: {
      nerf: () => player.records.thisReality.galaxies.toNumber() * (EternityChallenge(1).isRunning ? 2 : 1),
      buffA: 0.15,
      buffB: 0.25
    }
  },
  infinityChallenges: {
    id: 8,
    requirement: 9,
    nerfDescription: () => `The Repeatable IP Multiplier Upgrade is capped at ${formatInt(150)} Purchases`,
    buffDescription: () => `Reduce Infinity Dimension Compression by ${formatPercents(0.25, 2)} and convert Infinity Dimensions to Continuum`,
    effects: {
      nerf: 150,
      buff: 0.75
    }
  },
  replicanti: {
    id: 9,
    requirement: 10,
    nerfDescription: () => `Replicanti Interval is squared and is only boosted by ${formatPercents(0.1)} of Game Speed`,
    buffDescription: "Replicanti Interval is square-rooted",
    effects: {
      nerf: 2,
      buff: 0.5
    }
  },
  infinityDimensions: {
    id: 10,
    requirement: 11,
    nerfDescription: () => `Infinity Point gain is raised ${formatPow(Math.clamp(1 - Decimal.log10(player.records.thisInfinity.maxAM.add(1)).sub(72500).div(227500).toNumber(), 0, 1), 2, 3)} (only applies first Eternity)`,
    buffDescription: () => `The ${formatInt(8)}th Infinity Dimension is powered ${formatInt(100)}`,
    effects: {
      nerf: () => Math.clamp(1 - Decimal.log10(player.records.thisInfinity.maxAM.add(1)).sub(72500).div(227500).toNumber(), 0, 1),
      buff: 100
    }
  },
  eternity: {
    id: 11,
    requirement: 12,
    nerfDescription: () => `The Time Dimension Per-Purchase Multiplier is decreased to ${formatX(2)}`,
    buffDescription: () => `Remove the nerf "Any ${formatInt(8)}th TDs purchased above ${format(1e8, 2, 2)} will not increase the multiplier"`,
    effects: {
      nerf: 2
    }
  },
  timestudy61: {
    id: 12,
    requirement: 13,
    nerfDescription: () => `Raise all Time Theorem costs to ${formatPow(1.5, 2, 3)}`,
    buffDescription: () => `Eternity Point gain is multiplied by ${formatX(Decimal.pow10(Decimal.log10(Currency.infinityPoints.value.add(1)).div(1000)), 2, 2)} (based on IP)`,
    effects: {
      nerf: 1.5,
      buff: () => Decimal.pow10(Decimal.log10(Currency.infinityPoints.value.add(1)).div(1000))
    }
  },
  timeDimension4: {
    id: 13,
    requirement: 14,
    nerfDescription: () => `The multiplier of your highest Time Dimension is always ${formatX(1)}`,
    buffDescription: () => `The Time Dimension Per-Purchase Multiplier is increased to ${formatX(10)}`,
    effects: {
      buff: 10
    }
  },
  eternityUpgrades: {
    id: 14,
    requirement: 15,
    nerfDescription: () => `All Infinity Dimensions are raised ${formatPow(0.9, 2, 3)}`,
    buffDescription: () => `The ${formatInt(1)}st Infinity Dimension is powered ${formatInt(100)}`,
    effects: {
      nerf: 0.9,
      buff: 100
    }
  },
  eternityChallengeUnlock: {
    id: 15,
    requirement: 16,
    nerfDescription: () => `Infinity Points are raised ${formatPow(0.75, 2, 3)} inside Eternity Challenges`,
    buffDescription: () => `Uncap Eternity Upgrade ${formatInt(1)}`,
    effects: {
      nerf: 0.75
    }
  },
  ecCompletion1: {
    id: 16,
    requirement: 17,
    nerfDescription: () => `IP nerf in Eternity Challenges is decreased to ${formatPow(0.65, 2, 3)}`,
    buffDescription: () => `Reduce Time Dimension Compression by ${formatPercents(0.25, 2)} and convert Time Dimensions to Continuum`,
    effects: {
      nerf: 0.65,
      buff: 0.75
    }
  },
  ecCompletion5: {
    id: 17,
    requirement: 18,
    nerfDescription: () => `IP nerf in Eternity Challenges is decreased to ${formatPow(0.55, 2, 3)}, but remove the nerf from Eternity Challenge ${formatInt(1)}`,
    buffDescription: () => `All Time Dimension Multipliers are raised ${formatPow(5)}`,
    effects: {
      nerf: 0.55,
      buff: 5
    }
  },
  timestudy181: {
    id: 18,
    requirement: 19,
    nerfDescription: () => `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are raised ${formatPow(0.9, 2, 3)}`,
    buffDescription: () => `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Multipliers are raised ${formatPow(5)}`,
    effects: {
      nerf: 0.9,
      buff: 5
    }
  },
  eternityChallenge10: {
    id: 19,
    requirement: 20,
    nerfDescription: () => `Eternity Point gain is raised ${formatPow(0.9, 2, 3)}`,
    buffDescription: "Infinity gain is squared",
    effects: {
      nerf: 0.9,
      buff: 2
    }
  },
  timestudy192: {
    id: 20,
    requirement: 21,
    nerfDescription: () => `Post-Infinite Replicanti scale is increased to ${formatX(1.5, 1, 1)} per ${format(DC.NUMMAX, 2, 2)} Replicanti`,
    buffDescription: "Replicanti boosts Dark Energy gain at a reduced rate",
    effects: {
      nerf: 1.5,
      buff: () => ReplicantiMultipliers.deMult
    }
  },
  eternityChallenge11: {
    id: 21,
    requirement: 22,
    nerfDescription: () => `Eternity Challenge ${formatInt(11)} must have a ${formatX(5)} Bulk Completion`,
    buffDescription: () => `Reduce Post-Break Tickspeed cost scale by ${format(0.075, 3, 3)}`,
    effects: {
      buff: 0.075
    }
  },
  ec11Bulk: {
    id: 22,
    requirement: 23,
    nerfDescription: () => `The Dilation Study costs ${formatInt(10000)} Time Theorems, but remove the TD4 nerf and reduce the Free Tickspeed threshold to ${format(1.2, 2, 2)}`,
    buffDescription: () => `Reduce Post-Break Tickspeed cost scale by ${format(0.075, 3, 3)}`,
    effects: {
      nerfA: 10000,
      nerfB: 1.2,
      buff: 0.075
    }
  },
  unlockDilation: {
    id: 23,
    requirement: 24,
    nerfDescription: () => `The base Dilation penalty is increased to ${formatPow(0.5, 2, 3)}`,
    buffDescription: () => `The base Dilation penalty is reduced to ${formatPow(0.8, 2, 3)}`,
    effects: {
      nerf: 0.5,
      buff: 0.8
    }
  },
  dilatedEternity: {
    id: 24,
    requirement: 25,
    nerfDescription: () => `The base Dilation penalty is increased to ${formatPow(0.42, 2, 3)} and Dilated Time is only boosted by ${formatPercents(0.01)} of Game Speed`,
    buffDescription: () => `Tachyon Particle gain is raised ${formatPow(1.4, 2, 3)}`,
    effects: {
      nerf: 0.42,
      buff: 1.4
    }
  },
  timeTheoremGeneration: {
    id: 25,
    requirement: 26,
    nerfDescription: () => `Time Theorem Generation is ${formatPercents(Math.clamp(1 - Decimal.log10(Currency.dilatedTime.value.add(1)).div(100).toNumber(), 0, 1), 2)} weaker (based on DT)`,
    buffDescription: () => `Time Theorem Generation is raised ${formatPow(10)}`,
    effects: {
      nerf: () => Math.clamp(Decimal.log10(Currency.dilatedTime.value.add(1)).div(100).toNumber(), 0, 1),
      buff: 10
    }
  },
  timeDimension8: {
    id: 26,
    requirement: 27,
    nerfDescription: () => `Eternity Point gain is raised ${formatPow(Math.clamp(1 - Decimal.log10(player.records.thisEternity.maxIP.add(1)).sub(1.5e6).div(1.875e7).max(0).pow(0.375).toNumber(), 0, 1), 2, 3)}`,
    buffDescription: () => `The ${formatInt(8)}th Time Dimension is powered ${formatInt(1000)}`,
    effects: {
      nerf: () => Math.clamp(1 - Decimal.log10(player.records.thisEternity.maxIP.add(1)).sub(1.5e6).div(1.875e7).max(0).pow(0.375).toNumber(), 0, 1),
      buff: 1000
    }
  },
  reality: {
    id: 27,
    requirement: 28,
    nerfDescription: "None",
    buffDescription: "Remove almost all hardcaps"
  }
};
