export const endgameMasteries = [
  {
    id: 11,
    cost: 1,
    requirement: [],
    reqType: EM_REQUIREMENT_TYPE.ALL,
    description: () => `Generate ${formatInt(1)} Perk Point per minute per Endgame`,
    effect: () => player.disablePostReality ? 0 : player.endgames,
    formatEffect: value => `${formatHybridSmall(value, 3)}/min`
  },
  {
    id: 21,
    cost: 2,
    requirement: [11],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Automator Speed goes up by ${formatPercents(0.06)} rather than ${formatPercents(0.006, 1, 1)}`
  },
  {
    id: 22,
    cost: 2,
    requirement: [11],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Start with Auto-EC Unlocked, and divide the time by ${formatInt(60)}`,
    effect: () => player.disablePostReality ? 1 : 60
  },
  {
    id: 31,
    cost: 2,
    requirement: [21],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Start Endgames with ${formatInt(100)} Realities`,
    effect: () => player.disablePostReality ? 0 : 100
  },
  {
    id: 32,
    cost: 2,
    requirement: [22],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Start Endgames with ${formatInt(1000000)} Reality Machines`,
    effect: () => player.disablePostReality ? 0 : 1000000
  },
  {
    id: 41,
    cost: 3,
    requirement: [31],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Buff the reward of the Achievement "I Am Speed" to a ${formatPercents(1)} Chance`,
    effect: () => player.disablePostReality ? 0.1 : 1
  },
  {
    id: 42,
    cost: 3,
    requirement: [32],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Start Endgames with all Reality Upgrades unlocked"
  },
  {
    id: 51,
    cost: 4,
    requirement: [41],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Gain a multiplier to Galaxy strength based on Remnants`,
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(Decimal.log10(Currency.remnants.value.add(1)).add(1), 0.5),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 52,
    cost: 6,
    requirement: [41, 42],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Galaxies are ${formatPercents(0.1)} stronger`,
    effect: () => player.disablePostReality ? 1 : 1.1
  },
  {
    id: 53,
    cost: 4,
    requirement: [42],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Gain a free Tesseract`,
    effect: () => player.disablePostReality ? 0 : 1
  },
  {
    id: 61,
    cost: 4,
    requirement: [52],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Improve the Remnant Formula (see Remnant Gain Factors in the Pelle subtab)"
  },
  {
    id: 71,
    cost: 7,
    requirement: [61],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Start with ${formatInt(5)} of each basic Glyph on Endgame at ${formatInt(4)} effects, ${formatPercents(1)} rarity, and level based on Endgames and peak GL`,
    effect: () => player.disablePostReality ? DC.D1 : (EffarigUnlock.endgame.canBeApplied ? player.records.bestEndgame.glyphLevel : new Decimal(1 - ((1 / Math.max(player.endgames, 1)) ** 0.1)).times(player.records.bestEndgame.glyphLevel)),
    formatEffect: value => formatHybridSmall(value, 3)
  },
  {
    id: 81,
    cost: 4,
    requirement: [71],
    reqType: EM_REQUIREMENT_TYPE.COMPRESSION_PATH,
    description: () => `Weaken the Infinity Upgrade ${formatInt(23)} Softcap by ${formatPercents(0.5)}`
  },
  {
    id: 82,
    cost: 4,
    requirement: [71],
    reqType: EM_REQUIREMENT_TYPE.COMPRESSION_PATH,
    description: () => `Reduce the Infinity Dimension Compression Magnitude by ${formatPercents(0.05)}`,
    effect: () => player.disablePostReality ? 1 : 0.95
  },
  {
    id: 83,
    cost: 4,
    requirement: [71],
    reqType: EM_REQUIREMENT_TYPE.COMPRESSION_PATH,
    description: () => `Reduce the Time Dimension Compression Magnitude by ${formatPercents(0.05)}`,
    effect: () => player.disablePostReality? 1 : 0.95
  },
  {
    id: 84,
    cost: 4,
    requirement: [71],
    reqType: EM_REQUIREMENT_TYPE.COMPRESSION_PATH,
    description: () => `Reduce the Celestial Matter Softcap by ${formatPercents(0.1)}`,
    effect: () => player.disablePostReality ? 1 : 0.9
  },
  {
    id: 91,
    cost: 7,
    requirement: [81],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Delay the Infinity Challenge ${formatInt(8)} Reward Hardcap based on Endgames`,
    effect: () => player.disablePostReality ? 1 : player.endgames,
    formatEffect: value => formatPow(value, 2)
  },
  {
    id: 92,
    cost: 7,
    requirement: [82],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Delay the Infinity Dimension Compression Start based on Endgames",
    effect: () => player.disablePostReality ? 1 : player.endgames,
    formatEffect: value => formatPow(value, 2)
  },
  {
    id: 93,
    cost: 7,
    requirement: [83],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Delay the Time Dimension Compression Start based on Endgames",
    effect: () => player.disablePostReality ? 1 : player.endgames,
    formatEffect: value => formatPow(value, 2)
  },
  {
    id: 94,
    cost: 7,
    requirement: [84],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Delay the Celestial Matter Softcap Start based on Endgames",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(10, Decimal.pow(player.endgames, 0.25)),
    formatEffect: value => formatX(value, 2)
  },
  {
    id: 101,
    cost: 6,
    requirement: [91],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent to the power of ${format(1.01, 2, 2)}`,
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternity.isUnlocked ? 1 : 1.01
  },
  {
    id: 102,
    cost: 6,
    requirement: [92],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise the Infinity Power Conversion Rate to the power of ${format(1.01, 2, 2)}`,
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternity.isUnlocked ? 1 : 1.01
  },
  {
    id: 103,
    cost: 6,
    requirement: [93],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Apply a square-root to the Free Tickspeed Threshold Multiplier",
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternity.isUnlocked ? 1 : 0.5
  },
  {
    id: 104,
    cost: 6,
    requirement: [94],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Increase the CM conversion exponent by ${formatPercents(0.1)}`,
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternity.isUnlocked ? 1 : 1.1
  },
  {
    id: 111,
    cost: 5,
    requirement: [101, 102, 103, 104],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Imaginary Machines are always their maximum value"
  },
  {
    id: 112,
    cost: 4,
    requirement: [111],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dilated Time gain is multiplied by your Reality Shard count",
    effect: () => player.disablePostReality ? DC.D1 : Currency.realityShards.value.plus(1),
    formatEffect: value => formatX(value, 2)
  },
  {
    id: 121,
    cost: 7,
    requirement: [111],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Gain another Glyph Slot in Pelle",
    effect: 1
  },
  {
    id: 122,
    cost: 7,
    requirement: [111],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Decrease Galaxy Generator Instability by ${formatInt(1)}`,
    effect: () => player.disablePostReality ? 0 : 1
  },
  {
    id: 131,
    cost: 8,
    requirement: [121, 122],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `The effect of the Imaginary Upgrade "Entropic Condensing" is improved`,
  },
  {
    id: 141,
    cost: 4,
    requirement: [131],
    reqType: EM_REQUIREMENT_TYPE.CURRENCY_PATH,
    description: () => `IP Gain is raised to the power of ${format(1.2, 2, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.2
  },
  {
    id: 142,
    cost: 4,
    requirement: [131],
    reqType: EM_REQUIREMENT_TYPE.CURRENCY_PATH,
    description: () => `EP Gain is raised to the power of ${format(1.3, 2, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.3
  },
  {
    id: 143,
    cost: 4,
    requirement: [131],
    reqType: EM_REQUIREMENT_TYPE.CURRENCY_PATH,
    description: () => `RM Gain is raised to the power of ${format(1.4, 2, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.4
  },
  {
    id: 144,
    cost: 4,
    requirement: [131],
    reqType: EM_REQUIREMENT_TYPE.CURRENCY_PATH,
    description: () => `iM Gain is raised to the power of ${format(1.1, 2, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.1
  },
  {
    id: 151,
    cost: 3,
    requirement: [141],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Make the Infinity Point formula better`,
    effect: () => player.disablePostReality ? Effects.min(308, Achievement(103), TimeStudy(111)) : Effects.min(308, Achievement(103), TimeStudy(111)) / ((Decimal.log10(Decimal.log10(Currency.celestialPoints.value.plus(1)).add(1)).div(20)).add(1)).toNumber(),
    formatEffect: value => `log(x)/${format(Effects.min(308, Achievement(103), TimeStudy(111)), 2, 2)} ➜ log(x)/${format(value, 2, 2)}`
  },
  {
    id: 152,
    cost: 3,
    requirement: [142],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Remove the exponential scaling of the ${formatX(5)} EP Multiplier`
  },
  {
    id: 153,
    cost: 3,
    requirement: [143],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Increase the effectiveness of the Imaginary Upgrade "Elliptic Materiality" by ${formatPercents(0.5)}`,
    effect: () => player.disablePostReality ? 1 : 1.5
  },
  {
    id: 154,
    cost: 3,
    requirement: [144],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise the effect of the Imaginary Upgrade "Transience of Information" to the power of ${formatInt(10)}`,
    effect: () => player.disablePostReality ? 1 : 10
  },
  {
    id: 161,
    cost: 5,
    requirement: [151, 152, 153, 154],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Improve Singularity Gain per bulk increase based on Singularities owned",
    effect: () => player.disablePostReality ? DC.D0 : Decimal.floor((new Decimal(Decimal.log10(Decimal.clamp(Currency.singularities.value.div(1e50), 1, 1e120))).div(5)).add(
      new Decimal(Decimal.log10(Decimal.clamp(Currency.singularities.value.div(1e170), 1, 1e250))).div(10)).add(
      new Decimal(Decimal.log10(Decimal.clamp(Currency.singularities.value.div(new Decimal("1e420")), 1, new Decimal("1e2500")))).div(100)).add(
      Decimal.pow(new Decimal(Decimal.log10(Decimal.clamp(Currency.singularities.value.div(new Decimal("1e2920")), 1, new Decimal("1e390625")))), 0.25)).add(1)),
    cap: DC.E2,
    formatEffect: value => `+${format(value, 2)}`
  },
  {
    id: 171,
    cost: 7,
    requirement: [161],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Momentum increases ${formatInt(10)} times faster`,
    effect: () => player.disablePostReality ? 1 : 10
  },
  {
    id: 181,
    cost: 175000,
    requirement: [171],
    reqType: EM_REQUIREMENT_TYPE.EXPANDED,
    description: () => `Decrease base Galaxy Generator Instability by ${formatInt(1)} again`,
    effect: () => player.disablePostReality ? 0 : 1
  },
  {
    id: 191,
    cost: 50000,
    requirement: [181],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Your Achievement Multiplier now affects Celestial Dimensions",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow10(Decimal.pow(Achievements.power.max(1).log10(), 0.5))
  },
  {
    id: 192,
    cost: 50000,
    requirement: [181],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Your Achievement Multiplier now affects Divine Dimensions at a reduced rate",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow10(Decimal.pow(Achievements.power.max(1).log10(), 0.25))
  },
  {
    id: 201,
    cost: 75000,
    requirement: [191, 192],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Achievement Multiplier now affects Entropy gain at an extremely reduced rate",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(Achievements.power.max(1).log10(), 2)
  },
  {
    id: 211,
    cost: 100000,
    requirement: [201],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise Divine Dimensions to ${formatPow(1.3, 1, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.3
  },
  {
    id: 212,
    cost: 100000,
    requirement: [201],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise Celestial Points to ${formatPow(1.2, 1, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.2
  },
  {
    id: 213,
    cost: 100000,
    requirement: [201],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise Dual Machines to ${formatPow(1.1, 1, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.1
  },
  {
    id: 221,
    cost: 150000,
    requirement: [211],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Multiply Divine Energy gain based on Hadrons",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow10(new Decimal(player.celestials.laitela.hadrons.trueTotal).pow(1.25))
  },
  {
    id: 222,
    cost: 150000,
    requirement: [212],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent in Pelle to ${formatPow(1.2, 1, 1)}`,
    effect: () => player.disablePostReality ? 1 : 1.2
  },
  {
    id: 223,
    cost: 150000,
    requirement: [213],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Multiply Dual Machine gain based on Star Power",
    effect: () => player.disablePostReality ? 1 : Ethereal.starPower.add(1).log10().pow(10)
  },
  {
    id: 231,
    cost: 200000,
    requirement: [221],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Improve the Divine Star formula slightly",
    effect: () => player.disablePostReality ? 308 : 280
  },
  {
    id: 232,
    cost: 200000,
    requirement: [222],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Slightly improve the effect of Achievement 207",
    effect: () => player.disablePostReality ? 1 : 1.05
  },
  {
    id: 233,
    cost: 200000,
    requirement: [223],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Reduce the time it takes for Dual Machines to approach their cap by ${formatX(5)}`,
    effect: () => player.disablePostReality ? 1 : 5
  },
  {
    id: 241,
    cost: 300000,
    requirement: [231, 232, 233],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Ethereal Power gain is multiplied based on total Endgame Skills",
    effect: () => player.disablePostReality ? 1 : player.endgameMasteries.maxSkills.pow(2)
  },
  {
    id: 251,
    cost: 500000,
    requirement: [241],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Increase the Hadron effectiveness cap by ${formatPercents(1)}`,
    effect: () => player.disablePostReality ? 0 : 100
  },
  {
    id: 261,
    cost: 750000,
    requirement: [251],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Raise the Celestial Matter Conversion Exponent to ${formatPow(1.25, 2, 2)}`,
    effect: () => player.disablePostReality ? 1 : 1.25
  },
  {
    id: 262,
    cost: 750000,
    requirement: [251],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Delay the start of all Dark Matter caps by ${formatPow(2)}`,
    effect: () => player.disablePostReality ? 1 : 2
  },
  {
    id: 271,
    cost: 1000000,
    requirement: [261],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Remove the Dilated Time Softcap"
  },
  {
    id: 272,
    cost: 1000000,
    requirement: [261],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Weaken the harsh Replicanti softcap`,
    effect: () => player.disablePostReality ? 10 : 2
  },
  {
    id: 273,
    cost: 1000000,
    requirement: [262],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Eternity Challenge 12's reward is ${formatX(10)} stronger`,
    effect: () => player.disablePostReality ? 1 : 10
  },
  {
    id: 274,
    cost: 1000000,
    requirement: [262],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `All Glyph Instability thresholds are ${formatX(2)} weaker`,
    effect: () => player.disablePostReality ? 1 : 2
  },
  {
    id: 281,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [271, 272, 273, 274],
    reqType: EM_REQUIREMENT_TYPE.ENTANGLEMENT,
    description: "Multiply Thermal Radiation based on Celestial Points",
    effect: () => player.disablePostReality ? DC.D1 : player.endgame.celestialPoints.max(10).log10().log10().pow(0.75),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 282,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [271, 272, 273, 274],
    reqType: EM_REQUIREMENT_TYPE.ENTANGLEMENT,
    description: "Multiply Thermal Radiation based on Celestial Points of Eternity",
    effect: () => player.disablePostReality ? DC.D1 : player.endgame.celDimExpansion.celestialEternityPoints.max(1).log10().div(4000).pow(8),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 283,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [271, 272, 273, 274],
    reqType: EM_REQUIREMENT_TYPE.ENTANGLEMENT,
    description: "Multiply Thermal Radiation based on Nebulae",
    effect: () => player.disablePostReality ? DC.D1 : player.celestials.pelle.divinity.nebulae.log10().pow(0.3),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 291,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [281],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Empower Galactic Power based on Celestial Points",
    effect: () => player.disablePostReality ? DC.D1 : player.endgame.celestialPoints.max(10).log10().log10().pow(0.15),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    id: 292,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [282],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Empower Galactic Power based on Celestial Points of Eternity",
    effect: () => player.disablePostReality ? DC.D1 : player.endgame.celDimExpansion.celestialEternityPoints.max(1).log10().div(4000).pow(1.5),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    id: 293,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [283],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Empower Galactic Power based on Nebulae",
    effect: () => player.disablePostReality ? DC.D1 : player.celestials.pelle.divinity.nebulae.log10().pow(0.05),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    id: 301,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [291],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Empower the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent in Pelle based on Hawking Radiation`,
    effect: () => player.disablePostReality ? DC.D1 : player.compression.hawkingRadiation.max(1).pow(0.04).min(DC.E20.pow(0.04)).times(player.compression.hawkingRadiation.max(1).log10().div(20).max(1).log2().add(1)),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    id: 302,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [292],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Empower Celestial Dimensions based on Hawking Radiation",
    effect: () => player.disablePostReality ? DC.D1 : player.compression.hawkingRadiation.max(1).pow(0.08).min(DC.E20.pow(0.08)).times(player.compression.hawkingRadiation.max(1).log10().div(20).pow(2).max(1).log2().add(1)),
    formatEffect: value => formatPow(value, 2, 3)
  },
  {
    id: 303,
    cost: () => 1e6 * masteryIncrease.entanglement(),
    requirement: [293],
    reqType: EM_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Empower Divine Dimensions based on Hawking Radiation",
    effect: () => player.disablePostReality ? DC.D1 : player.compression.hawkingRadiation.max(1).pow(0.02).min(DC.E20.pow(0.02)).times(player.compression.hawkingRadiation.max(1).log10().div(20).pow(0.5).max(1).log2().add(1)),
    formatEffect: value => formatPow(value, 2, 3)
  }
];
