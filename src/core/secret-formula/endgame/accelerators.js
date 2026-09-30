export const accelerators = {
  potency: {
    id: 1,
    key: "potency",
    name: "Potency Accelerator",
    drainResource: () => player.universes.current === 2 ? "Matter" : "Antimatter",
    baseEffect1: x => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Generation ${formatPow(x, 2, 3)}`,
    baseEffect2: x => `Entropy Gain ${formatX(x, 2, 2)}`,
    baseEffect3: x => `Divine Matter/Energy Production ${formatX(x, 2, 2)}`,
    percentage: totalFill => Decimal.log10(totalFill.plus(1).log10().div(1e200)).div(100).toNumber(),
    percentageToFill: percentage => Decimal.pow10(Decimal.pow10(percentage * 100).times(1e200)).sub(1),
    effects: {
      alpha: percentage => player.disablePostReality ? DC.D1 : Decimal.pow10(percentage / 10),
      beta: percentage => player.disablePostReality ? DC.D1 : Decimal.pow10(percentage),
      gamma: percentage => player.disablePostReality ? DC.D1 : Decimal.pow10(percentage / 5),
    },
    currency: () => Currency.antimatter,
    unlockReq: () => Decimal.pow10(1e200),
    milestones: [
      {
        resource: "potency",
        requirement: 0.15,
        description: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are squared while inside The Void`,
        effect: () => 2
      },
      {
        resource: "potency",
        requirement: 0.4,
        description: () => `Total Hadrons increase the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Hardcap`,
        effect: () => player.disablePostReality ? 0 : Math.clamp(Math.floor(Math.pow(2 * Math.max(player.celestials.laitela.hadrons.trueTotal - 100, 0) + 0.25, 0.5) - 0.5), 0, 25),
        formatEffect: value => `${format(LHC.breakingPoint.root(Decimal.pow10(value)), 2)} ➜ ${format(LHC.breakingPoint, 2)}`
      },
      {
        resource: "potency",
        requirement: 0.75,
        description: () => `Convert Celestial Dimensions to Continuum and boost them by Continuum Purchases at a ${formatPow(0.1, 1, 1)} rate`
      },
    ]
  },
  emptiness: {
    id: 2,
    key: "emptiness",
    name: "Emptiness Accelerator",
    drainResource: "Null Matter",
    baseEffect1: x => `${player.universes.current === 2 ? "MDs" : "ADs"} ${formatPow(x, 2, 3)} while inside The Void`,
    baseEffect2: x => `Hadron Effectiveness cap +${formatPercents(x - 1, 2)}`,
    baseEffect3: x => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Overflow Magnitude ${formatInt(10)} ➜ ${format(x, 2, 2)}`,
    percentage: totalFill => Decimal.min(totalFill.div(20000), totalFill.max(1).log10()).div(100).toNumber(),
    percentageToFill: percentage => Decimal.max(new Decimal(percentage * 100).times(20000), Decimal.pow10(percentage * 100)),
    effects: {
      alpha: percentage => Decimal.pow(1 + percentage / 100, 1 + percentage / 100),
      beta: percentage => player.disablePostReality ? 1 : 1 + percentage / 100,
      gamma: percentage => player.disablePostReality ? 10 : 1 / (0.1 + percentage * 3 / 2000),
    },
    currency: () => Currency.nullMatter,
    unlockReq: () => Decimal.pow10(5),
    milestones: [
      {
        resource: "emptiness",
        requirement: 0.07,
        description: () => `While inside The Void, ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are raised to a power based on total ${player.universes.current === 2 ? "Matter" : "Antimatter"} produced outside Doom`,
        effect: () => Decimal.log10(Decimal.log10(player.records.totalAntimatterOutsideDoom)).div(200).add(1),
        formatEffect: value => formatPow(value, 2, 3)
      },
      {
        resource: "emptiness",
        requirement: 0.3,
        description: () => `Divine Dimensions are powered based on best ${player.universes.current === 2 ? "Matter" : "Antimatter"} inside The Void`,
        effect: () => player.disablePostReality ? DC.D1 : Decimal.log10(Decimal.log10(player.endgame.largeHadronCollider.void.highestAntimatter)).div(100).add(1),
        formatEffect: value => formatPow(value, 2, 3)
      },
      {
        resource: "emptiness",
        requirement: 1,
        description: () => `The ${player.universes.current === 2 ? "Matter" : "Antimatter"} Hardcap is increased by ${formatInt(25)} OoM^2s`,
        effect: () => player.disablePostReality ? 0 : 25
      },
    ]
  },
  cosmic: {
    id: 3,
    key: "cosmic",
    name: "Cosmic Accelerator",
    drainResource: "Galaxies",
    baseEffect1: x => `Galaxy Generation ${formatPow(x, 2, 3)}`,
    baseEffect2: x => `${player.universes.current === 2 ? "M" : "AM"} Exponent ${formatPow(x, 2, 3)} while Doomed`,
    baseEffect3: x => `${player.universes.current === 2 ? "M" : "AM"} Exponent^2 ${formatPow(x, 2, 4)} while Doomed`,
    percentage: totalFill => Math.min(Decimal.log10(totalFill.max("1e3000")).sub(3000).div(5000).sqrt().times(20).div(100).toNumber(),
      Decimal.log10(totalFill.max(1)).sub(3000).div(5000).times(20).div(100).toNumber()),
    percentageToFill: percentage => Decimal.max(Decimal.pow10(Decimal.sqr(percentage * 100 / 20).times(5000).add(3000)),
      Decimal.pow10(new Decimal(percentage * 100 / 20).times(5000).add(3000))),
    effects: {
      alpha: percentage => player.disablePostReality ? 1 : 1 + percentage / 200,
      beta: percentage => player.disablePostReality ? 1 : 1 + percentage / 100,
      gamma: percentage => player.disablePostReality ? 1 : 1 + percentage / 2000,
    },
    currency: () => Currency.galaxyGeneratorGalaxies,
    unlockReq: () => Decimal.pow10(3000),
    milestones: [
      {
        resource: "cosmic",
        requirement: 0.2,
        description: "While inside The Void, Galaxies are stronger based on Cosmic Accelerator percentage",
        effect: () => 1 + Accelerators.cosmic.percentage * 100,
        formatEffect: value => formatX(value, 2, 2)
      },
      {
        resource: "cosmic",
        requirement: 0.4,
        description: "Unlock a new Galaxy Generator Upgrade"
      },
      {
        resource: "cosmic",
        requirement: 1,
        description: () => `The ${player.universes.current === 2 ? "Matter" : "Antimatter"} Hardcap is increased by ${format(Decimal.log10(DC.NUMMAX).sub(275), 4, 4)} OoM^2s`,
        effect: () => player.disablePostReality ? 0 : Decimal.log10(DC.NUMMAX).sub(275).toNumber()
      },
    ]
  }
};
