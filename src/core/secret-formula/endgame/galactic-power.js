export const galacticPowerRewards = {
  galaxyStrength: {
    id: 1,
    galacticPower: 0,
    reward: "Increase Galaxy Strength",
    effect: () => player.disablePostReality ? 1 : Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(10), 3).add(1).min(30000).times(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).max(1)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Galaxies are ${value >= 11 ? formatX(value, 2, 2) : formatPercents(value - 1, 2, 2)} stronger`
  },
  remoteGalaxyScale: {
    id: 2,
    galacticPower: 1e10,
    reward: "Delay Remote Galaxy Scaling",
    effect: () => player.disablePostReality ? 0 : Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).times(5), 2).min(2.5e6).times(Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).max(1), 2)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Remote Galaxy Scaling is delayed by ${formatHybridLarge(value, 3)} Galaxies`
  },
  remoteGalaxyPower: {
    id: 3,
    galacticPower: 1e20,
    reward: "Weaken Remote Galaxy Scaling",
    effect: () => player.disablePostReality ? 1 : DC.D1.sub(((Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)), 0.5).times(5)).div(100))).max(0.1).div(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).max(1)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? 1 / GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? 1 / GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Remote Galaxy Scaling is ${formatPercents(1 - value, 2, 2)} weaker`
  },
  galGenInstability1: {
    id: 4,
    galacticPower: 1e50,
    reward: "Delay the first Galaxy Generator Instability Threshold",
    effect: () => player.disablePostReality ? DC.D0 : Decimal.pow(10, Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).times(50)).min(1e50).pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).max(1)),
    formatEffect: value => `The first Galaxy Generator Instability Threshold is delayed by ${formatX(value, 2, 2)} Galaxies`
  },
  replicantiGalaxies: {
    id: 5,
    galacticPower: 1e100,
    reward: "Multiply Replicanti Galaxy gain",
    effect: () => player.disablePostReality ? 1 : Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(100), 1.25).add(1).min(6).times(Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).max(1), 0.5)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Gain ${formatX(value, 2, 2)} more Replicanti Galaxies`
  },
  tachyonGalaxies: {
    id: 6,
    galacticPower: 1e150,
    reward: "Decrease the Tachyon Galaxy Threshold Multiplier",
    effect: () => player.disablePostReality ? 1 : Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(200), 3).add(1).min(5).times(Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).max(1), 0.5)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Apply a ${format(value, 2, 2)}th root to the Tachyon Galaxy Threshold Multiplier`
  },
  galGenInstability2: {
    id: 7,
    galacticPower: 1e200,
    reward: "Decrease the power of the second Galaxy Generator Instability Magnitude",
    effect: () => player.disablePostReality ? 1 : (Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(100), 1.5).div(10)).add(1).min(1.6).times(Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(Decimal.log10(DC.NUMMAX)).max(1), 0.25)).pow(GalacticPowers.galaxyEmpowerment1.isUnlocked ? GalacticPowers.galaxyEmpowerment1.reward : 1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Apply a ${format(value, 2, 2)}th root to the second Galaxy Generator Instability Magnitude`
  },
  etherealUnlock: {
    id: 8,
    galacticPower: Number.MAX_VALUE,
    reward: "Unlock the Ethereal"
  },
  galacticAscension: {
    id: 9,
    galacticPower: new Decimal("1e7800"),
    reward: "Galaxy types now multiply each other instead of add if they are above zero"
  },
  galaxyEmpowerment1: {
    id: 10,
    galacticPower: new Decimal("1e10000"),
    reward: "Increase the effect of all above Galactic Powers exponentially",
    effect: () => player.disablePostReality ? 1 : Decimal.log10(Decimal.log10(Currency.galacticPower.value.add(1)).add(1)).div(4).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `The above Galactic Powers are ${value >= 11 ? formatX(value, 2, 2) : formatPercents(value - 1, 2, 2)} stronger`
  },
  celestialGalaxyEmpowerment: {
    id: 11,
    galacticPower: new Decimal("1e15000"),
    reward: "Increase the power of Celestial Galaxies",
    effect: () => player.disablePostReality ? 1 : Decimal.pow(Decimal.log10(Currency.galacticPower.value.add(1)).div(15000), 5).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Celestial Galaxies are ${value >= 11 ? formatX(value, 2, 2) : formatPercents(value - 1, 2, 2)} stronger`
  },
  freeGalaxies: {
    id: 12,
    galacticPower: new Decimal("1e25000"),
    reward: "Gain free Galaxies",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(Currency.galacticPower.value.div("1e25000"), 0.001).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1),
    formatEffect: value => `${formatHybridLarge(value, 3)} free Galaxies`
  },
  galaxyScaling: {
    id: 13,
    galacticPower: new Decimal("1e40000"),
    reward: () => `Reduce the base cost scaling of ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies`,
    effect: () => player.disablePostReality ? 1 : Decimal.pow(0.9, Decimal.log10(Decimal.log10(Currency.galacticPower.value.add(1)).div(40000)).add(1).pow(2).sub(1)).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy cost scaling is reduced by ${formatPercents(1 - value, 2, 2)}`
  },
  galaxyGenerationEmpowerment: {
    id: 14,
    galacticPower: new Decimal("1e66000"),
    reward: "Empower Galaxy Generation",
    effect: () => player.disablePostReality ? 1 : Decimal.log10(Decimal.log10(Currency.galacticPower.value.add(1)).div(66000)).add(1).pow(GalacticPowers.galaxyEmpowerment2.isUnlocked ? GalacticPowers.galaxyEmpowerment2.reward : 1).toNumber(),
    formatEffect: value => `Galaxy Generation is empowered by ${formatPow(value, 2, 3)}`
  },
  galaxyEmpowerment2: {
    id: 15,
    galacticPower: new Decimal("1e100000"),
    reward: "Increase the effect of all above Galactic Powers exponentially",
    effect: () => player.disablePostReality ? 1 : Decimal.log10(Decimal.log10(Currency.galacticPower.value.add(1)).div(100000)).add(1).toNumber(),
    formatEffect: value => `The above Galactic Powers are ${value >= 11 ? formatX(value, 2, 2) : formatPercents(value - 1, 2, 2)} stronger`
  },
  stelliferousUniverse: {
    id: 16,
    galacticPower: DC.NUMMAX.pow(1000),
    reward: "Unlock the Stelliferous Universe"
  }
};
