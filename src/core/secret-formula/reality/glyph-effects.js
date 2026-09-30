export const GlyphCombiner = Object.freeze({
  /**
   * @param {number[]} x
   * @returns {number}
   */
  add: x => x.reduce(Number.sumReducer, 0),
  /**
   * @param {number[]} x
   * @returns {number}
   */
  multiply: x => x.reduce(Number.prodReducer, 1),
  /**
   * For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
   * so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
   * we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
   * is also close to 1 rather than close to x.length.
   * @param {number[]} x
   * @returns {number}
   */
  addExponents: x => x.reduce(Number.sumReducer, 1 - x.length),
  /**
   * @param {Decimal[]} x
   * @returns {Decimal}
   */
  addDecimal: x => x.reduce(Decimal.sumReducer, DC.D0),
  /**
   * @param {Decimal[]} x
   * @returns {Decimal}
   */
  multiplyDecimal: x => x.reduce(Decimal.prodReducer, DC.D1)
});

export const glyphEffects = {
  timepow: {
    id: "timepow",
    bitmaskIndex: 0,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Time Dimension power +{value}",
    totalDesc: "Time Dimension multipliers ^{value}",
    shortDesc: "TD power +{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.2).times(Decimal.pow(strength, 0.5)).div(100).add(1).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.4).times(Math.pow(strength, 1.2)).div(50).add(1).toNumber()
      : Decimal.pow(level, 0.32).times(Math.pow(strength, 0.45)).div(75).add(1.01).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  timespeed: {
    id: "timespeed",
    bitmaskIndex: 1,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {value}",
    totalDesc: "Game runs ×{value} faster",
    genericDesc: "Game speed multiplier",
    shortDesc: "Game speed ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.5).times(strength).add(1)
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, strength).add(1)
      : (GlyphAlteration.isEmpowered("time")
         ? Decimal.pow(level, 0.35).add(1)
         : Decimal.pow(level, 0.3).times(Decimal.pow(strength, 0.65)).div(20).add(1))),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("time"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  timeetermult: {
    id: "timeetermult",
    bitmaskIndex: 2,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Multiply Eternity gain by {value}",
    totalDesc: "Eternity gain ×{value}",
    genericDesc: "Eternity gain multiplier",
    shortDesc: "Eternities ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level.times(strength), 0.3).add(1)
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(Decimal.pow(level, 0.25).times(strength).times(GlyphAlteration.sacrificeBoost("time")))
      : Decimal.pow(new Decimal(strength + 3).times(level), 0.9).times(
        Decimal.pow(3, GlyphAlteration.sacrificeBoost("time")))),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getBoostColor("time"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  timeEP: {
    id: "timeEP",
    bitmaskIndex: 3,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain \n×{value} [and ^]{value2}"
      : "Multiply Eternity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain ×{value} and ^{value2}"
      : "Eternity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain multiplier and power"
      : "Eternity Point gain multiplier"),
    shortDesc: () => (GlyphAlteration.isAdded("time")
      ? "EP ×{value} and ^{value2}"
      : "EP ×{value}"),
    effect: (level, strength) => Slabdrill.isCursed ? DC.D2.pow(Decimal.pow(level, 0.5).times(strength))
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(Decimal.pow(level, strength + 1).times(100))
      : Decimal.clampMin(Decimal.pow(level.times(strength), 3).times(100), 1)),
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiplyDecimal,
    conversion: x => (EffarigUnlock.endgame.canBeApplied
      ? 1 + Decimal.log10(x).add(1).log10().toNumber() / 100
      : 1 + Decimal.log10(x).toNumber() / 1000),
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("time"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  dilationDT: {
    id: "dilationDT",
    bitmaskIndex: 4,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {value}",
    totalDesc: "Dilated Time gain ×{value}",
    shortDesc: "DT ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.1).times(Decimal.pow(strength, 0.5)).add(1)
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(level.times(strength).div(150))
      : (GlyphAlteration.isEmpowered("dilation")
         ? DC.D1_005.pow(level).times(15)
         : Decimal.pow(level.times(strength), 1.5).times(2))),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("dilation"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  dilationgalaxyThreshold: {
    id: "dilationgalaxyThreshold",
    bitmaskIndex: 5,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Tachyon Galaxy threshold multiplier ×{value}",
    genericDesc: "Tachyon Galaxy cost multiplier",
    shortDesc: "TG threshold ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? DC.D1.div(Decimal.pow(level, 0.03).times(Decimal.pow(strength, 0.25))).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.max(DC.D1.sub(Decimal.pow(level, 0.4).times(strength).div(100)).sub(GlyphAlteration.sacrificeBoost("dilation") / 40), 0.1)
        .div(Decimal.max(1, Decimal.abs((DC.D1.sub(Decimal.pow(level, 0.4).times(strength).div(100)).sub(
        GlyphAlteration.sacrificeBoost("dilation") / 40)).sub(1.1)))).toNumber()
      : Decimal.max(DC.D1.sub(Decimal.pow(level, 0.17).times(Math.pow(strength, 0.35)).div(100)).sub(
        GlyphAlteration.sacrificeBoost("dilation") / 50), 0.1).div(Decimal.max(1, Decimal.abs((DC.D1.sub(Decimal.pow(level, 0.17).times(
        Math.pow(strength, 0.35)).div(100)).sub(GlyphAlteration.sacrificeBoost("dilation") / 50)).sub(1.1)))).toNumber()),
    formatEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST,
    combine: effects => {
      const prod = effects.reduce(Number.prodReducer, 1);
      return prod < 0.4
        ? { value: Math.max(0.4 - Math.pow(0.4 - prod, 1.7), 0.1) / Math.max(1, Math.abs(Math.log(prod)) / 2), capped: true }
        : { value: prod, capped: false };
    },
    enabledInDoomed: true,
  },
  dilationTTgen: {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    bitmaskIndex: 6,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generates {value} Time Theorems/hour \n[and multiplies Time Theorem \ngeneration by] {value2}"
      : "Generates {value} Time Theorems per hour"),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generating {value} Time Theorems/hour and Time Theorem generation ×{value2}"
      : "Generating {value} Time Theorems per hour"),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Time Theorem generation and multiplier"
      : "Time Theorem generation"),
    shortDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "{value} TT/hr and TTgen ×{value2}"
      : "{value} TT/hr"),
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.25).times(strength).div(10000)
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level.times(strength), 0.6).div(1000)
      : Decimal.pow(level.times(strength), 0.5).div(10000)),
    /** @type {function(number): string} */
    formatEffect: x => format(x.times(3600), 2, 2),
    combine: GlyphCombiner.addDecimal,
    conversion: x => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.clampMin(Decimal.pow10(x.times(10000)), 1)
      : Decimal.clampMin(Decimal.pow(x.times(10000), 1.6), 1)),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("dilation"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  dilationpow: {
    id: "dilationpow",
    bitmaskIndex: 7,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension power +{value} while Dilated`,
    totalDesc: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers ^{value} while Dilated`,
    genericDesc: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions ^x while Dilated`,
    shortDesc: () => `Dilated ${player.universes.current === 2 ? "MD" : "AD"} power +{value}`,
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.05).times(Decimal.pow(strength, 0.3)).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? level.times(strength).add(1).toNumber()
      : Decimal.pow(level, 0.7).times(Math.pow(strength, 0.7)).div(25).add(1.1).toNumber()),
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  replicationspeed: {
    id: "replicationspeed",
    bitmaskIndex: 8,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Multiply Replication speed by {value}",
    totalDesc: "Replication speed ×{value}",
    genericDesc: "Replication speed multiplier",
    shortDesc: "Replication speed ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.4).times(strength)
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(level.times(strength).div(100))
      : (GlyphAlteration.isEmpowered("replication")
         ? DC.D1_007.pow(level).times(10)
         : Decimal.times(level, strength).times(3))),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("replication"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  replicationpow: {
    id: "replicationpow",
    bitmaskIndex: 9,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier power +{value}",
    totalDesc: "Replicanti multiplier ^{value}",
    shortDesc: "Replicanti mult. power +{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.1).times(Decimal.pow(strength, 0.5)).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? level.times(Math.pow(strength, 2)).times(GlyphAlteration.sacrificeBoost("replication")).add(1).toNumber()
      : Decimal.pow(level, 0.5).times(strength).div(25).add(GlyphAlteration.sacrificeBoost("replication") * 3).add(1.1).toNumber()),
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("replication"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  replicationdtgain: {
    id: "replicationdtgain",
    bitmaskIndex: 10,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Multiply Dilated Time \n[and Replicanti speed] by \n+{value} per ${format(DC.E10000)} replicanti`
      : `Multiply Dilated Time gain by \n+{value} per ${format(DC.E10000)} replicanti`),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Multiply Dilated Time and Replication speed by +{value} per ${format(DC.E10000)} replicanti`
      : `Multiply Dilated Time gain by +{value} per ${format(DC.E10000)} replicanti`),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Dilated Time+Replicanti mult from replicanti"
      : "Dilated Time gain multiplier from replicanti"),
    shortDesc: () => (GlyphAlteration.isAdded("replication")
      ? `×DT and repl. by +{value} per ${format(DC.E10000)} replicanti`
      : `×DT by +{value} per ${format(DC.E10000)} replicanti`),
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.06).times(Decimal.pow(strength, 0.2))
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, strength).times(0.0005)
      : Decimal.pow(level, 0.3).times(Decimal.pow(strength, 0.65)).times(0.0003)),
    formatEffect: x => format(x.times(10000), 2, 2),
    formatSingleEffect: x => format(x.times(10000), 2, 2),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // We also introduce a 3x mult per glyph after the first, so that stacking level 1, 0% glyphs still has an effect.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? DC.D0 : effects.reduce(Decimal.prodReducer, Decimal.pow(0.0001, 1 - effects.length)),
      capped: false
    }),
    conversion: x => x,
    formatSecondaryEffect: x => format(x, 2, 3),
    formatSingleSecondaryEffect: x => format(x, 5, 5),
    alteredColor: () => GlyphAlteration.getAdditionColor("replication"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  replicationglyphlevel: {
    id: "replicationglyphlevel",
    bitmaskIndex: 11,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => `Replicanti factor for Glyph level:\n ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    totalDesc: () => `Replicanti factor for Glyph level: ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    genericDesc: "Replicanti factor for Glyph level",
    shortDesc: "Replicanti pow. for level +{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.1).times(Decimal.pow(strength, 0.5)).div(1000).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(Decimal.pow(level, 0.3).times(strength), 0.5).div(40).toNumber()
      : Decimal.pow(Decimal.pow(level, 0.25).times(Math.pow(strength, 0.4)), 0.5).div(50).toNumber()),
    formatEffect: x => format(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1
        ? { value: 0.1 + 0.2 * (sum - 0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    },
    enabledInDoomed: true,
  },
  infinitypow: {
    id: "infinitypow",
    bitmaskIndex: 12,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension power +{value}",
    totalDesc: "Infinity Dimension multipliers ^{value}",
    shortDesc: "ID power +{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.15).times(Decimal.pow(strength, 0.4)).div(100).add(1).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.3).times(strength).div(50).add(Math.min(GlyphAlteration.sacrificeBoost("infinity") / 50, 2.5)).add(
        Math.pow(Math.max(Math.log10(GlyphAlteration.sacrificeBoost("infinity")) - Math.log10(125), 0) + 1, 2.5) - 1).add(1).toNumber()
      : Decimal.pow(level, 0.21).times(Math.pow(strength, 0.4)).div(75).add(
        Math.min(GlyphAlteration.sacrificeBoost("infinity") / 50, 2.5)).add(
        Math.pow(Math.max(Math.log10(GlyphAlteration.sacrificeBoost("infinity")) - Math.log10(125), 0) + 1, 2) - 1).add(1.007).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("infinity"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  infinityrate: {
    id: "infinityrate",
    bitmaskIndex: 13,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => `Infinity Power conversion rate: \n^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    totalDesc: () => `Infinity Power conversion rate: ^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    genericDesc: "Infinity Power conversion rate",
    shortDesc: "Infinity Power conversion +{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.2).times(Decimal.pow(strength, 0.75)).div(10).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.25).times(strength).times(0.05).toNumber()
      : Decimal.pow(level, 0.2).times(Math.pow(strength, 0.4)).times(0.04).toNumber()),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  infinityIP: {
    id: "infinityIP",
    bitmaskIndex: 14,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain \n×{value} [and ^]{value2}"
      : "Multiply Infinity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain ×{value} and ^{value2}"
      : "Infinity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain multiplier and power"
      : "Infinity Point gain multiplier"),
    shortDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "IP ×{value} and ^{value2}"
      : "IP ×{value}"),
    effect: (level, strength) => Slabdrill.isCursed ? DC.D2.pow(level.times(Decimal.pow(strength, 3)))
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(Decimal.pow(level, strength + 1).times(10000))
      : Decimal.clampMin(Decimal.pow(level.times(strength + 1), 6).times(10000), 1)),
    formatEffect: x => format(x, 2, 3),
    combine: effects => {
      let sum = effects.reduce(Decimal.prodReducer, DC.D1);
      return { value: sum, capped: false };
    },
    softcap: value => ((Effarig.eternityCap !== undefined) ? Decimal.min(value, Effarig.eternityCap) : value),
    conversion: x => (EffarigUnlock.endgame.canBeApplied
      ? 1 + Decimal.log10(x).add(1).log10().toNumber() / 150
      : 1 + Decimal.log10(x).toNumber() / 1800),
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("infinity"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  infinityinfmult: {
    id: "infinityinfmult",
    bitmaskIndex: 15,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Multiply Infinity gain by {value}",
    totalDesc: "Infinity gain ×{value}",
    genericDesc: "Infinity gain multiplier",
    shortDesc: "Infinities ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level.times(strength), 0.6).add(1)
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(level.times(strength))
      : (GlyphAlteration.isEmpowered("infinity")
         ? DC.D1_02.pow(level)
         : Decimal.pow(level.times(strength), 1.5).times(2))),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("infinity"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: () => PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied
  },
  powerpow: {
    id: "powerpow",
    bitmaskIndex: 16,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => (GlyphAlteration.isAdded("power")
      ? `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension power +{value}\n[and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy cost ×]{value2}`
      : `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension power +{value}`),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers ^{value} and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy cost ×{value2}`
      : `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions multipliers ^x and ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy cost multiplier`
      : `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers ^x`),
    shortDesc: () => (GlyphAlteration.isAdded("power")
      ? `${player.universes.current === 2 ? "MD" : "AD"} power +{value} and ${player.universes.current === 2 ? "MG" : "AG"} cost ×{value2}`
      : `${player.universes.current === 2 ? "MD" : "AD"} power +{value}`),
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.1).times(Decimal.pow(strength, 0.3)).div(100).add(1).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.25).times(strength).div(50).add(1).toNumber()
      : Decimal.pow(level, 0.2).times(Math.pow(strength, 0.4)).div(75).add(1.015).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => (EffarigUnlock.endgame.canBeApplied ? 1 / x : 2 / (x + 1)),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: true,
  },
  powermult: {
    id: "powermult",
    bitmaskIndex: 17,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers ×{value}`,
    genericDesc: () => `Multiplier to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers`,
    shortDesc: () => `${player.universes.current === 2 ? "MD" : "AD"} ×{value}`,
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow10(Decimal.pow(level, 1.25).times(Decimal.pow(strength, 5)))
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(Decimal.pow(level, strength).times(9e15))
      : (GlyphAlteration.isEmpowered("power")
         ? DC.D11111.pow(level.times(220))
         : Decimal.pow(level.times(strength).times(10), level.times(strength).times(10)))),
    formatEffect: x => formatPostBreak(x, 2, 0),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("power"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  powerdimboost: {
    id: "powerdimboost",
    bitmaskIndex: 18,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{value}",
    genericDesc: "Dimension Boost multiplier",
    shortDesc: "Dimboost mult. ×{value}",
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.15).times(Decimal.pow(strength, 0.6))
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(Decimal.pow(level, 0.5).times(strength).times(GlyphAlteration.sacrificeBoost("power")))
      : Decimal.clampMin(Decimal.pow(level.times(strength), 0.5).times(
        Decimal.pow(1 + GlyphAlteration.sacrificeBoost("power"), 3)), 1)),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getBoostColor("power"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  powerbuy10: {
    id: "powerbuy10",
    bitmaskIndex: 19,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => `Increase the bonus from buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions by {value}`,
    totalDesc: () => `Multiplier from "Buy ${formatInt(10)}" ×{value}`,
    genericDesc: () => `"Buy ${formatInt(10)}" bonus increase`,
    shortDesc: () => `${player.universes.current === 2 ? "MD" : "AD"} "Buy ${formatInt(10)}" mult. ×{value}`,
    effect: (level, strength) => Slabdrill.isCursed ? Decimal.pow(level, 0.3).times(Decimal.pow(strength, 1.5)).toNumber()
      : (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, strength).add(1).toNumber()
      : level.times(strength).div(12).add(1).toNumber()),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  effarigrm: {
    id: "effarigrm",
    bitmaskIndex: 20,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Reality Machine multiplier ×{value}",
    genericDesc: "Reality Machine multiplier",
    shortDesc: "RM ×{value}",
    effect: (level, strength) => EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow10(Decimal.pow(level, 0.6).times(strength))
      : (GlyphAlteration.isEmpowered("effarig")
         ? Decimal.pow(level, 1.5)
         : Decimal.pow(level, 0.6).times(strength)),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("effarig"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  effarigglyph: {
    id: "effarigglyph",
    bitmaskIndex: 21,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Glyph Instability starting level +{value}",
    genericDesc: "Glyph Instability delay",
    shortDesc: "Instability delay +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.floor(Decimal.pow(level.times(strength), 0.6).times(10)).toNumber()
      : Decimal.floor(Decimal.pow(level.times(strength), 0.5).times(10)).toNumber()),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  effarigblackhole: {
    id: "effarigblackhole",
    bitmaskIndex: 22,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Game speed power +{value}",
    totalDesc: "Game speed ^{value}",
    genericDesc: "Game speed ^x",
    shortDesc: "Game speed power +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.27).times(Math.pow(strength, 0.45)).div(72).add(1).toNumber()
      : Decimal.pow(level, 0.25).times(Math.pow(strength, 0.4)).div(75).add(1).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  effarigachievement: {
    id: "effarigachievement",
    bitmaskIndex: 23,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Achievement multiplier power +{value}",
    totalDesc: "Achievement multiplier ^{value}",
    genericDesc: "Achievement multiplier ^x",
    shortDesc: "Achievement mult. power +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.5).times(strength).div(50).add(GlyphAlteration.sacrificeBoost("effarig") / 8).add(1).toNumber()
      : Decimal.pow(level, 0.4).times(Math.pow(strength, 0.6)).div(60).add(
        GlyphAlteration.sacrificeBoost("effarig") / 10).add(1).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("effarig"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  effarigforgotten: {
    id: "effarigforgotten",
    bitmaskIndex: 24,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" multiplier ^{value} [and\nDimension Boost multiplier ^]{value2}`
      : `Bonus from buying ${formatInt(10)} Dimensions ^{value}`),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Multiplier from "Buy ${formatInt(10)}" ^{value} and Dimension Boost multiplier ^{value2}`
      : `Multiplier from "Buy ${formatInt(10)}" ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" and Dimension Boost multipliers ^x`
      : `"Buy ${formatInt(10)}" multiplier ^x`),
    shortDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Buy ${formatInt(10)} mult. ^{value}, Dimboost mult. ^{value2}`
      : `Buy ${formatInt(10)} mult. ^{value}`),
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.5).times(strength).times(2).add(1).toNumber()
      : Decimal.pow(level, 0.25).times(Math.pow(strength, 0.4)).times(2).add(1).toNumber()),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    conversion: x => (EffarigUnlock.endgame.canBeApplied ? Math.pow(x, 0.5) : Math.pow(x, 0.4)),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("effarig"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  effarigdimensions: {
    id: "effarigdimensions",
    bitmaskIndex: 25,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "All Dimension power +{value}",
    totalDesc: "All Dimension multipliers ^{value}",
    genericDesc: "All Dimension multipliers ^x",
    shortDesc: "All Dimension power +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.3).times(Math.pow(strength, 0.75)).div(400).add(1).toNumber()
      : Decimal.pow(level, 0.25).times(Math.pow(strength, 0.4)).div(500).add(1).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  effarigantimatter: {
    id: "effarigantimatter",
    bitmaskIndex: 26,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} production:\n${formatInt(10)}^x ➜ ${formatInt(10)}^(x^{value})`,
    genericDesc: () => `${player.universes.current === 2 ? "Matter" : "Antimatter"} production exponent power`,
    shortDesc: () => `${player.universes.current === 2 ? "M" : "AM"} production exponent ^{value}`,
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.26).times(Math.pow(strength, 0.45)).div(4800).add(1).toNumber()
      : Decimal.pow(level, 0.25).times(Math.pow(strength, 0.4)).div(5000).add(1).toNumber()),
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("effarig")
  },
  timeshardpow: {
    id: "timeshardpow",
    bitmaskIndex: 27,
    isGenerated: true,
    // This gets explicitly added to time glyphs elsewhere (once unlocked)
    glyphTypes: [],
    singleDesc: "Time Shard power +{value}",
    totalDesc: "Time Shard gain ^{value}",
    genericDesc: "Time Shards ^x",
    shortDesc: "Time Shard power +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level, 0.4).times(strength).div(1000).add(1).toNumber()
      : Decimal.pow(level, 0.35).times(strength / 3.5).div(400).add(1).toNumber()),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  cursedgalaxies: {
    id: "cursedgalaxies",
    bitmaskIndex: 0,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: `All Galaxies are {value} weaker`,
    totalDesc: "All Galaxy strength -{value}",
    shortDesc: "Galaxy Strength -{value}",
    // Multiplies by 0.768 per glyph
    effect: level => Decimal.pow(level, -0.03).toNumber(),
    formatEffect: x => formatPercents(1 - x, 2),
    combine: GlyphCombiner.multiply,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("cursed"),
  },
  curseddimensions: {
    id: "curseddimensions",
    bitmaskIndex: 1,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "All Dimension multipliers ^{value}",
    shortDesc: "All Dimensions ^{value}",
    // Multiplies by 0.734 per glyph
    effect: level => Decimal.pow(level, -0.035).toNumber(),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("cursed"),
  },
  cursedtickspeed: {
    id: "cursedtickspeed",
    bitmaskIndex: 2,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is multiplied by ×{value}",
    totalDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is increased by ×{value}",
    shortDesc: "TD Tickspeed threshold ×{value}",
    // Additive 3.82 per glyph
    effect: level => Decimal.clampMin(Decimal.log10(level), 1).toNumber(),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("cursed"),
  },
  cursedEP: {
    id: "cursedEP",
    bitmaskIndex: 3,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Divide Eternity Point gain by {value}",
    totalDesc: "Eternity Point gain / {value}",
    shortDesc: "EP / {value}",
    // Divides e666.6 per glyph
    effect: level => Decimal.pow10(level.neg().div(10)),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiplyDecimal,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("cursed"),
  },
  realityglyphlevel: {
    id: "realityglyphlevel",
    bitmaskIndex: 4,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Increase the effective level of equipped basic Glyphs by {value}",
    totalDesc: "Equipped basic Glyph level +{value}",
    shortDesc: "Basic Glyph Level +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.floor(level.div(15).times(strength / 3.5)).toNumber()
      : Decimal.floor(Decimal.sqrt(level.times(90).times(strength / 3.5))).toNumber()),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
    enabledInDoomed: () => false // Disabled by function getAdjustedGlyphLevel(...)
  },
  realitygalaxies: {
    id: "realitygalaxies",
    bitmaskIndex: 5,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "All Galaxies are {value} stronger",
    totalDesc: "All Galaxy strength +{value}",
    shortDesc: "Galaxy Strength +{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level.div(50000).times(strength / 3.5), 0.6).add(1).toNumber()
      : Decimal.pow(level.div(100000).times(strength / 3.5), 0.5).add(1).toNumber()),
    formatEffect: x => formatPercents(x - 1, 2),
    combine: GlyphCombiner.multiply,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("reality")
  },
  realityrow1pow: {
    id: "realityrow1pow",
    bitmaskIndex: 6,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Multiplier from Reality Upgrade Amplifiers ^{value}",
    totalDesc: "Reality Upgrade Amplifier multiplier ^{value}",
    shortDesc: "Amplifier Multiplier ^{value}",
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.pow(level.div(100000).times(strength / 3.5), 1.5).add(1).toNumber()
      : level.div(125000).times(strength / 3.5).add(1).toNumber()),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("reality")
  },
  realityDTglyph: {
    id: "realityDTglyph",
    bitmaskIndex: 7,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => `Dilated Time factor for Glyph level: \n^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    totalDesc: () => `Dilated Time factor for Glyph level: ^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    genericDesc: "Dilated Time factor for Glyph level",
    shortDesc: "DT pow. for level +{value}",
    // You can only get this effect on level 25000 reality glyphs anyway, might as well make it look nice
    // Disregard my man Hevi's above comment we pushing this shit
    effect: (level, strength) => (EffarigUnlock.endgame.canBeApplied
      ? Decimal.clampMax(Decimal.pow(level.div(25000).times(strength / 3.5), 0.6).div(10), 1.5).times(
        Decimal.clampMin(Decimal.log10(Decimal.max(Decimal.pow(level.div(25000).times(
        strength / 3.5), 0.6).div(10).sub(0.5), 1)).add(1), 1)).toNumber()
      : Decimal.clampMax(Decimal.pow(level.div(25000).times(strength / 3.5), 0.5).div(10), 1.5).times(
        Decimal.clampMin(Decimal.log10(Decimal.max(Decimal.pow(level.div(25000).times(
        strength / 3.5), 0.5).div(10).sub(0.5), 1)).add(1), 1)).toNumber()),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: () => !Pelle.isGlyphTypeDisabled("reality")
  },
  companiondescription: {
    id: "companiondescription",
    bitmaskIndex: 8,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "It does nothing but sit there and cutely smile at you, whisper into your dreams politely, " +
      "and plot the demise of all who stand against you. This one-of-a-kind Glyph will never leave you.",
    totalDesc: "+{value} happiness",
    shortDesc: "Doesn't want to hurt you",
    effect: () => {
      if (Enslaved.isRunning) return 0;
      const cursedCount = Glyphs.active.countWhere(g => g?.type === "cursed");
      if (cursedCount > 0) return Math.pow(0.2 + 0.2 * Math.random(), cursedCount);
      return 0.4 + 0.6 * Math.random();
    },
    formatEffect: x => formatPercents(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  companionEP: {
    id: "companionEP",
    bitmaskIndex: 9,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "Thanks for your dedication for the game! You reached {value} Eternity Points on your first Reality.",
    shortDesc: "It loves you very, very much",
    totalDesc: () => ((Enslaved.isRunning || Glyphs.active.countWhere(g => g?.type === "cursed")) ? "Help me" : "Yay!"),
    // The EP value for this is entirely encoded in rarity, but level needs to be present to
    // make sure the proper parameter is being used. The actual glyph level shouldn't do anything.
    // eslint-disable-next-line no-unused-vars
    effect: (level, strength) => Decimal.pow10(1e6 * strengthToRarity(strength)),
    formatEffect: x => formatPostBreak(x, 2),
    combine: GlyphCombiner.multiplyDecimal,
    enabledInDoomed: true,
  }
};
