function rebuyable(config) {
  const effectFunction = config.effect || (x => x);
  const { name, id, layer, maxUpgrades, description, isDisabled, noLabel, onPurchased } = config;
  return {
    rebuyable: true,
    name,
    id,
    layer,
    cost: () => new Decimal(config.initialCost).times(
      Decimal.pow(config.costIncrease, player.celestials.pelle.divinityRebuyables[config.id])),
    maxUpgrades,
    description,
    effect: () => effectFunction(player.celestials.pelle.divinityRebuyables[config.id]),
    isDisabled,
    formatEffect: config.formatEffect ||
      (value => {
        return (value === config.maxUpgrades
          ? `Currently: ${formatX(10 - value)}`
          : `Currently: ${formatX(10 - value)} | Next: ${formatX(10 - value - 1)}`);
      }),
    formatCost: value => formatPostBreak(value, 2, 0),
    noLabel,
    onPurchased
  };
}

export const divinityUpgrades = {
  divineL1U1: {
    name: "Celestial Storage",
    id: "divineL1U1",
    layer: 1,
    cost: new Decimal(10000),
    description: "Cosmic Sector boost affects Celestial Dimension Overflow start at a reduced rate",
    effect: () => Decimal.pow(Ethereal.sectorBoost, 0.1),
    formatEffect: value => formatX(value, 2, 2)
  },
  divineL1U2: {
    name: "Accelerated Reconstruction",
    id: "divineL1U2",
    layer: 1,
    cost: new Decimal(1e9),
    description: () => `Remnants of Alpha Decay time to reach cap is reduced by ${formatPercents(0.1)}`,
    effect: 0.9
  },
  divineL1U3: {
    name: "Divine Momentum",
    id: "divineL1U3",
    layer: 1,
    cost: new Decimal(1e20),
    description: "Divine Dimensions are boosted based on Celestial Points",
    effect: () => Decimal.pow(Decimal.log10(player.endgame.celestialPoints).div(Decimal.log10(DC.NUMMAX)).max(1), 3),
    formatEffect: value => formatX(value, 2, 2)
  },
  divineL1U4: {
    name: "Artisan of Destruction",
    id: "divineL1U4",
    layer: 1,
    cost: new Decimal(1e50),
    description: () => `Only in Pelle, raise the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent’s Exponent to the power
      of ${format(DivinityUpgrade.divineL5U2.isBought ? 1.02 : 1.01, 2, 2)}`,
    effect: () => DivinityUpgrade.divineL5U2.isBought ? 1.02 : 1.01
  },
  divineL1U5: {
    name: "The Great Revival",
    id: "divineL1U5",
    layer: 1,
    cost: new Decimal(1e100),
    description: "Unlock Divine Energy and Resurgence Upgrades"
  },
  divineL1U6: {
    name: "Wavelength",
    id: "divineL1U6",
    layer: 1,
    cost: new Decimal(1e125),
    description: "Divine Energy boosts Divine Dimensions",
    effect: () => Decimal.pow(Currency.divineEnergy.value.min(DC.E20000), 0.5).pow(
      Currency.divineEnergy.value.max(1).log10().max(1).log10().sub(3.3).max(1)).max(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  divineL1U7: {
    name: "Lucky Seven",
    id: "divineL1U7",
    layer: 1,
    cost: new Decimal(1e160),
    description: () => `Divine Energy production is multiplied by ${formatInt(7)}`,
    effect: 7
  },
  divineL1U8: {
    name: "Renewed Energy",
    id: "divineL1U8",
    layer: 1,
    cost: new Decimal(1e200),
    description: () => `Divine Energy is produced normally at a ${formatPercents(0.1)} rate`,
    effect: 0.1
  },
  divineL1U9: {
    name: "The Immortal Flow",
    id: "divineL1U9",
    layer: 1,
    cost: new Decimal(1e250),
    description: "Producing Divine Energy no longer halts Divine Dimension production"
  },
  divineL1U10: {
    name: "In Over My Head",
    id: "divineL1U10",
    layer: 1,
    cost: new Decimal(1e300),
    description: () => `Reduce the time for Dual Machines to approach their cap by ${formatPercents(0.5)}`,
    effect: 0.5
  },
  divineL2U1: {
    name: "Stellar Compound",
    id: "divineL2U1",
    layer: 2,
    cost: new Decimal(1),
    description: "Divine Dimensions gain a multiplier based on real time since your last Condense",
    effect: () => Decimal.pow(DivinityUpgrade.divineL5U1.isBought ? Time.thisSupernovaRealTime.totalSeconds.add(1) :
      Time.thisCondenseRealTime.totalSeconds.add(1), 3),
    formatEffect: value => formatX(value, 2, 2)
  },
  divineL2U2: {
    name: "Solar Flares",
    id: "divineL2U2",
    layer: 2,
    cost: new Decimal(7),
    description: "Divine Stars multiply Divine Energy production",
    effect: () => player.celestials.pelle.divinity.divineStars.max(1),
    formatEffect: value => formatX(value, 2)
  },
  divineL2U3: {
    name: "Postmortal",
    id: "divineL2U3",
    layer: 2,
    cost: new Decimal(17),
    description: "Divine Stars boost Ethereal Power production",
    effect: () => Decimal.pow(Decimal.log10(player.celestials.pelle.divinity.divineStars.add(1)).add(1), 7),
    formatEffect: value => formatX(value, 2, 2)
  },
  divineL2U4: {
    name: "Electrify",
    id: "divineL2U4",
    layer: 2,
    cost: new Decimal(77),
    description: "Divine Energy base gain is now based on your highest-ever Divine Matter"
  },
  divineL2U5: {
    name: "Cannot Afford Loss",
    id: "divineL2U5",
    layer: 2,
    cost: new Decimal(277),
    description: "Keep all Layer One Divine Upgrades on Condense"
  },
  divineL2U6: {
    name: "Headstart",
    id: "divineL2U6",
    layer: 2,
    cost: new Decimal(777),
    description: () => `Start Condense with ${format(5e36, 2, 2)} Divine Matter`,
    effect: 5e36
  },
  divineL2U7: {
    name: "Gravitate",
    id: "divineL2U7",
    layer: 2,
    cost: new Decimal(2777),
    description: () => `Divine Dimensions are raised ${formatPow(1.1, 2, 3)}`,
    effect: 1.1
  },
  divineL2U8: {
    name: "Liftoff",
    id: "divineL2U8",
    layer: 2,
    cost: new Decimal(7777),
    description: () => `The Divine Dimension Per-Purchase Multiplier is increased to ${formatX(17)}`
  },
  divineL2U9: {
    name: "Ascension",
    id: "divineL2U9",
    layer: 2,
    cost: new Decimal(77777),
    description: "Divine Dimensions are multiplied based on Celestial Matter",
    effect: () => Decimal.pow(Decimal.log10(Currency.celestialMatter.value.max(1)).add(1), 7),
    formatEffect: value => formatX(value, 2, 2)
  },
  divineL2U10: {
    name: "Completion",
    id: "divineL2U10",
    layer: 2,
    cost: new Decimal(1777777),
    description: () => `Divine Matter effects are set to highest-ever Divine Matter and Divine Energy gain
      is always produced at a ${formatPercents(1)} rate with no penalty`
  },
  divineL3U1: rebuyable({
    name: "Entropy Reduction",
    id: 0,
    layer: 3,
    initialCost: 1e7,
    costIncrease: 200,
    maxUpgrades: 7,
    description: () => `Decrease the post-Infinite Divine Dimension cost scaling multiplier by ${formatInt(1)}`,
    noLabel: true,
    onPurchased: () => GameCache.divineDimensionMultDecrease.invalidate()
  }),
  divineL3U2: rebuyable({
    name: "Divine Excellence",
    id: 1,
    layer: 3,
    initialCost: 1e8,
    costIncrease: 1e4,
    maxUpgrades: 12,
    description: () => `Multiply the Divine Dimension Per-Purchase Multiplier`,
    effect: value => player.disablePostReality ? 1 : Math.pow(1 + value/2, Math.log2(10)),
    formatEffect: value => formatX(value, 2, 2),
    noLabel: false
  }),
  divineL3U3: rebuyable({
    name: "Stellar Supercharger",
    id: 2,
    layer: 3,
    initialCost: 1e10,
    costIncrease: 1e10,
    maxUpgrades: 6,
    description: "Raise the Divine Star boost to a power",
    effect: value => player.disablePostReality ? 1 : value + 1,
    formatEffect: value => formatPow(value, 2),
    noLabel: false
  }),
  divineL3U4: rebuyable({
    name: "Nebulous Generation",
    id: 3,
    layer: 3,
    initialCost: 1e12,
    costIncrease: 100,
    maxUpgrades: 10,
    effect: value => player.disablePostReality ? DC.D0 : Player.bestRunVSPM.times(value / 20),
    description: () => {
      let generation = `Generate ${formatInt(5 * player.celestials.pelle.divinityRebuyables[3])}%`;
      if (!DivinityUpgrade.divineL3U4.isCapped) {
        generation += ` ➜ ${formatInt(5 * (1 + player.celestials.pelle.divinityRebuyables[3]))}%`;
      }
      return `${generation} of your best VS/min from your last 10 Condenses`;
    },
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${format(value, 2, 1)} VS/min`,
    noLabel: false
  }),
  divineL3U5: {
    name: "Power is a Journey",
    id: "divineL3U5",
    layer: 3,
    cost: new Decimal(1e77),
    description: "Gain a power effect to Divine Dimensions based on Condenses",
    effect: () => Decimal.log10(player.celestials.pelle.divinity.condenses.min(7000).div(777).add(1)).div(2).add(1).add(
      Decimal.log10(player.celestials.pelle.divinity.condenses.div(7000).max(1)).div(10)),
    formatEffect: value => formatPow(value, 2, 3)
  },
  divineL4U1: {
    name: "Power Grab",
    id: "divineL4U1",
    layer: 4,
    cost: new Decimal(1),
    description: () => `Gain a multiplier to Divine Energy and Divine Stars and a power to Divine Dimensions,
      all based on total Nebulae`,
    effects: {
      energy: () => player.records.bestSupernova.totalNeb.div(DivinityUpgrade.divineL4U4.isBought ? 7 : 10).add(1).pow(777),
      matter: () => Decimal.log10(player.records.bestSupernova.totalNeb.add(1)).add(1).pow(
        DivinityUpgrade.divineL4U4.isBought ? 0.25 : 0.2),
      stars: () => player.records.bestSupernova.totalNeb.add(1).pow(DivinityUpgrade.divineL4U4.isBought ? 2 : 1)
    }
  },
  divineL4U2: {
    name: "Reawaken",
    id: "divineL4U2",
    layer: 4,
    cost: new Decimal(3),
    description: "Keep the first five Layer Two Upgrades on Supernova and unlock autobuyers for all Divine Dimensions"
  },
  divineL4U3: {
    name: "Divine Art",
    id: "divineL4U3",
    layer: 4,
    cost: new Decimal(10),
    description: "Divine Dimensions gain a power effect based on real time spent in this Supernova",
    effect: () => Time.thisSupernovaRealTime.totalMinutes.min(300).div(10).add(1).pow(0.1).add(
      Time.thisSupernovaRealTime.totalMinutes.div(300).max(1).log10().div(10)),
    formatEffect: value => formatPow(value, 2, 3)
  },
  divineL4U4: {
    name: "Reinforcement",
    id: "divineL4U4",
    layer: 4,
    cost: new Decimal(30),
    description: "Keep the other five Layer Two Upgrades on Supernova and improve all effects of Power Grab"
  },
  divineL4U5: {
    name: "No More Limitations",
    id: "divineL4U5",
    layer: 4,
    cost: new Decimal(100),
    description: "Remove the Divine Matter Cap"
  },
  divineL5U1: {
    name: "Security",
    id: "divineL5U1",
    layer: 5,
    cost: new Decimal(700),
    description: () => "Stellar Compound’s effect now applies through Supernova"
  },
  divineL5U2: {
    name: "Bounty",
    id: "divineL5U2",
    layer: 5,
    cost: new Decimal(17000),
    description: "Keep Layer Three Upgrades on Supernova and make Artisan of Destruction twice as strong"
  },
  divineL5U3: {
    name: "Potency",
    id: "divineL5U3",
    layer: 5,
    cost: new Decimal(7e5),
    description: "Gain an additional power to Divine Dimensions based on current Nebulae",
    effect: () => Decimal.log10(Decimal.log10(player.celestials.pelle.divinity.nebulae.add(10))).add(1),
    formatEffect: value => formatPow(value, 2, 3)
  },
  divineL5U4: {
    name: "Tenacity",
    id: "divineL5U4",
    layer: 5,
    cost: new Decimal(7e7),
    description: () => `Generate Condenses at ${formatPercents(0.1)} the speed of your fastest`
  },
  divineL5U5: {
    name: "Goodbye",
    id: "divineL5U5",
    layer: 5,
    cost: new Decimal(1e10),
    description: () => `Generate ${formatPercents(0.01)} of your pending Divine Stars per second`
  }
};
