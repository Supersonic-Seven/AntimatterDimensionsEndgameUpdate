export const infinityChallenges = [
  {
    id: 1,
    description: `all Normal Challenge restrictions are active at once, with the exception of the
      Tickspeed (C9) and Big Crunch (C12) Challenges.`,
    goal: () => Slabdrill.isCursed ? DC.E420 : DC.E650,
    isQuickResettable: true,
    reward: {
      description: () => `${Slabdrill.isCursed ? formatX(666) : formatX(2.3, 1, 1)} on all Infinity Dimensions for each
        Infinity Challenge completed`,
      effect: () => Math.pow(Slabdrill.isCursed ? 666 : 2.3, InfinityChallenges.completed.length),
      formatEffect: value => (Slabdrill.isCursed ? formatX(value, 2) : formatX(value, 1, 1))
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E1000 : DC.E2000,
  },
  {
    id: 2,
    description: () => `Dimensional Sacrifice happens automatically every ${formatInt(400)}
      milliseconds ${Slabdrill.isCursed ? "and it functions like a Dimension Boost reset without the boost." :
      `once you have an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`}`,
    goal: () => Slabdrill.isCursed ? DC.E1600 : DC.E10500,
    isQuickResettable: false,
    reward: {
      description: () => `Dimensional Sacrifice autobuyer and ${Slabdrill.isCursed ? "unlock" : "stronger"} Dimensional Sacrifice
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": false })} ➜
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": true })}`,
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E1620 : DC.E11000,
  },
  {
    id: 3,
    description: () =>
      `Tickspeed upgrades are always ${formatX(1)}. For every Tickspeed upgrade purchase, you instead get a static
      multiplier on ${Slabdrill.isCursed ? "your Antimatter Dimension" : `all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`} which increases
      based on ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`,
    goal: () => Slabdrill.isCursed ? DC.E2600 : DC.E5000,
    isQuickResettable: false,
    effect: () => (Laitela.continuumActive
        ? Decimal.pow(player.galaxies.times(0.005).add(1.05), Tickspeed.continuumValue.times(Slabdrill.isCursed ? 12 : 1))
        : Decimal.pow(player.galaxies.times(0.005).add(1.05), player.totalTickBought.times(Slabdrill.isCursed ? 12 : 1))),
    formatEffect: value => formatX(value, 2, 2),
    reward: {
      description: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multiplier based on ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies and Tickspeed purchases`,
      effect: () => (Laitela.continuumActive
        ? Decimal.pow(player.galaxies.times(0.005).add(1.05), Tickspeed.continuumValue.times(Slabdrill.isCursed ? 12 : 1))
        : Decimal.pow(player.galaxies.times(0.005).add(1.05), player.totalTickBought.times(Slabdrill.isCursed ? 12 : 1))),
      formatEffect: value => formatX(value, 2, 2),
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E2200 : DC.E12000,
  },
  {
    id: 4,
    description: () =>
      Slabdrill.isCursed ? `Your Antimatter Dimension produces less (${formatPow(0.25, 2, 2)}).` :
      `only the latest bought ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension's production is normal. All other ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions
      produce less (${formatPow(0.25, 2, 2)}).`,
    goal: () => Slabdrill.isCursed ? DC.E600 : DC.E13000,
    isQuickResettable: true,
    effect: 0.25,
    reward: {
      description: () => Slabdrill.isCursed ? `Your Antimatter Dimension multiplier becomes multiplier${formatPow(1.05, 2, 2)}` :
        `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers become multiplier${formatPow(1.05, 2, 2)}`,
      effect: 1.05
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E3000 : DC.E14000,
  },
  {
    id: 5,
    description: () =>
      Slabdrill.isCursed ? `Antimatter Dimension and Tickspeed cost scaling is massively increased.` :
      `buying ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions 1-4 causes all cheaper ${player.universes.current === 2 ? "MD" : "AD"} costs to increase.
      Buying ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions 5-8 causes all more expensive ${player.universes.current === 2 ? "MD" : "AD"} costs to increase.`,
    goal: () => Slabdrill.isCursed ? DC.E4750 : DC.E16500,
    isQuickResettable: true,
    reward: {
      description: () =>
        Slabdrill.isCursed ? `All Galaxies are ${formatX(6.66, 2, 2)} stronger and reduce the requirements for them
        and Dimension Boosts by ${formatInt(1)}` :
        `All Galaxies are ${formatPercents(0.1)} stronger and reduce the requirements for them
        and Dimension Boosts by ${formatInt(1)}`,
      effect: () => Slabdrill.isCursed ? 6.66 : 1.1
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E6666 : DC.E18000,
  },
  {
    id: 6,
    description: () => Slabdrill.isCursed ? `exponentially rising matter divides the multiplier of your Antimatter Dimension.` :
      `exponentially rising ${player.universes.current === 2 ? "antimatter" : "matter"} divides the multiplier on all of your ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions
      once you have at least ${formatInt(1)} 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`,
    goal: () => Slabdrill.isCursed ? DC.E12500 : DC.D2E22222,
    isQuickResettable: true,
    effect: () => Currency.matter.value.clampMin(1),
    formatEffect: value => `/${format(value, 1, 2)}`,
    reward: {
      description: "Infinity Dimension multiplier based on tickspeed",
      effect: () => Slabdrill.isCursed
        ? Tickspeed.perSecond.pow(0.005)
        : Tickspeed.perSecond.pow(0.0005),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E13000 : DC.E22500,
  },
  {
    id: 7,
    description: () => {
      // Copied from DimBoost.power; this is the base amount before any multipliers. Post-eternity this isn't
      // necessarily 2.5x by the time the player sees this challenge; it's probably most accurate to say what it
      // currently is, and this phrasing avoids 10x ➜ 10x with the old description.
      const mult = Effects.max(
        2,
        InfinityUpgrade.dimboostMult,
        InfinityChallenge(7).reward,
        TimeStudy(81)
      );
      return `you cannot buy ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies. Base Dimension Boost multiplier is increased to a maximum
        of ${formatX(10)}. (Current base multiplier: ${formatX(mult, 2, 2)})`;
    },
    goal: () => Slabdrill.isCursed ? DC.E9600 : DC.E10000,
    isQuickResettable: false,
    effect: 10,
    reward: {
      description: () => `Dimension Boost multiplier is increased to a minimum of ${Slabdrill.isCursed ? formatX(32) : formatX(4)}`,
      effect: () => Slabdrill.isCursed ? 32 : 4
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E17000 : DC.E23000,
  },
  {
    id: 8,
    description: () =>
      `${player.universes.current === 2 ? "MD" : "AD"} production rapidly and continually drops over time${Slabdrill.isCursed ? "." : `. Purchasing ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension or Tickspeed
        upgrades sets production back to ${formatPercents(1)} before it starts dropping again.`}`,
    goal: () => Slabdrill.isCursed ? DC.E15000 : DC.E27000,
    isQuickResettable: true,
    effect: () => DC.D0_8446303389034288.pow(
      Decimal.max(0, player.records.thisInfinity.time.sub(Slabdrill.isCursed ? 0 : player.records.thisInfinity.lastBuyTime))),
    reward: {
      description: () =>
        Slabdrill.isCursed ? `Your Antimatter Dimension is raised by ${formatPow(1.125, 2, 3)}` :
        `You get a multiplier to ${player.universes.current === 2 ? "MD" : "AD"} 2-7 based on 1st and 8th ${player.universes.current === 2 ? "MD" : "AD"} multipliers.`,
      effect: () => Slabdrill.isCursed ? new Decimal(1.125) :
        AntimatterDimension(1).multiplier.times(AntimatterDimension(8).multiplier).pow(0.02).clampMax(DC.E1E15.powEffectsOf(EndgameMastery(91), EndgameUpgrade(11))).pow(
        Alpha.isDestroyed ? Decimal.max(Decimal.pow(5, Decimal.log10(Decimal.log10(AntimatterDimension(1).multiplier.times(AntimatterDimension(8).multiplier).pow(0.02)).div(
        Decimal.log10(DC.E1E15.powEffectsOf(EndgameMastery(91), EndgameUpgrade(11)))))), 1) : 1),
      cap: () => Alpha.isDestroyed ? DC.BEMAX : DC.E1E15.powEffectsOf(EndgameMastery(91), EndgameUpgrade(11)),
      formatEffect: value => Slabdrill.isCursed ? formatPow(value, 2, 3) : formatX(value, 2, 2)
    },
    unlockAM: () => Slabdrill.isCursed ? DC.E18000 : DC.E28000,
  },
];
