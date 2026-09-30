export const ra = {
  pets: {
    teresa: {
      id: "teresa",
      name: "Teresa",
      color: "#8596ea",
      chunkGain: "Eternity Points",
      memoryGain: "current RM",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.eternityPoints.value.add(1).pLog10().div(5e3), 3.5).times(4),
      memoryProductionMultiplier: () => Ra.unlocks.teresaXP.effectOrDefault(1)
    },
    effarig: {
      id: "effarig",
      name: "Effarig",
      color: "#ea8585",
      chunkGain: "Relic Shards gained",
      memoryGain: "best Glyph level",
      requiredUnlock: () => Ra.unlocks.effarigUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Effarig.shardsGained, 0.175).times(4),
      memoryProductionMultiplier: () => Ra.unlocks.effarigXP.effectOrDefault(1)
    },
    enslaved: {
      id: "enslaved",
      name: "The Nameless Ones",
      color: "#f1aa7f",
      chunkGain: "Time Shards",
      memoryGain: "total time played",
      requiredUnlock: () => Ra.unlocks.enslavedUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.timeShards.value.add(1).pLog10().div(5e4), ResurgenceUpgrade.memSurge.isBought ? 3.5 : 2.5).times(4),
      memoryProductionMultiplier: () => Ra.unlocks.enslavedXP.effectOrDefault(1)
    },
    v: {
      id: "v",
      name: "V",
      color: "#ead584",
      chunkGain: "Infinity Power",
      memoryGain: "total Memory levels",
      requiredUnlock: () => Ra.unlocks.vUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.infinityPower.value.add(1).pLog10().div(1e6), ResurgenceUpgrade.memSurge.isBought ? 3.5 : 1.875).times(4),
      memoryProductionMultiplier: () => Ra.unlocks.vXP.effectOrDefault(1)
    }
  },
  unlocks: {
    autoTP: {
      id: 0,
      reward: "Tachyon Particles are given immediately when Time Dilation is active",
      pet: "teresa",
      level: 1,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raTeresa1.canBeApplied
    },
    chargedInfinityUpgrades: {
      id: 1,
      reward: () => `Unlock Charged Infinity Upgrades. You get one more maximum
        Charged Infinity Upgrade every ${formatInt(2)} levels`,
      effect: () => player.disablePostReality ? 0 : Math.min(12, Math.floor(Ra.pets.teresa.level / 2)),
      pet: "teresa",
      level: 2,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raTeresa2.canBeApplied
    },
    teresaXP: {
      id: 2,
      reward: "All Memory Chunks produce more Memories based on Reality Machines",
      effect: () => player.disablePostReality ? 1 : 1 + Decimal.pow(Currency.realityMachines.value.add(1).pLog10().div(100), 0.5).toNumber(),
      pet: "teresa",
      level: 5,
      displayIcon: `Ϟ`
    },
    alteredGlyphs: {
      id: 3,
      reward: "Unlock Altered Glyphs, which grant new effects to Glyphs based on Glyph Sacrifice",
      pet: "teresa",
      level: 10,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raTeresa3.canBeApplied
    },
    effarigUnlock: {
      id: 4,
      reward: "Unlock Effarig's Memories",
      pet: "teresa",
      level: 8,
      displayIcon: `Ϙ`
    },
    perkShopIncrease: {
      id: 5,
      reward: "Purchase caps are raised in Teresa's Perk Point Shop",
      pet: "teresa",
      level: 15,
      displayIcon: `<span class="fas fa-project-diagram"></span>`
    },
    unlockDilationStartingTP: {
      id: 6,
      reward: () => `In non-Celestial Realities, gain Tachyon Particles as if you reached the square root of your total
        ${player.universes.current === 2 ? "matter" : "antimatter"} in Dilation. Any multipliers to TP gain are applied retroactively, even outside Dilation`,
      effect: () => player.records.totalEndgameAntimatter.pow(0.5),
      pet: "teresa",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`
    },
    extraGlyphChoicesAndRelicShardRarityAlwaysMax: {
      id: 7,
      reward: () => `Get ${formatX(2)} Glyph choices and the bonus to Glyph rarity from Relic Shards
        is always its maximum value`,
      effect: 2,
      pet: "effarig",
      level: 1,
      displayIcon: `<i class="fas fa-grip-horizontal"></i>`
    },
    unlockGlyphAlchemy: {
      id: 8,
      reward: `Unlock Glyph Alchemy, which adds alchemical resources you can increase by Refining Glyphs. You unlock
        more resources through Effarig levels. Access through a new Reality tab.`,
      pet: "effarig",
      level: 2,
      displayIcon: `<span class="fas fa-vial"></span>`
    },
    effarigXP: {
      id: 9,
      reward: "All Memory Chunks produce more Memories based on highest Glyph level",
      effect: () => player.disablePostReality ? 1 : player.records.bestReality.glyphLevel.div(7000).add(1).toNumber(),
      pet: "effarig",
      level: 5,
      displayIcon: `<span class="fas fa-clone"></span>`
    },
    glyphEffectCount: {
      id: 10,
      reward: () => `Glyphs always have ${formatInt(4)} effects, and Effarig Glyphs can now have up to ${formatInt(7)}`,
      pet: "effarig",
      level: 10,
      displayIcon: `<span class="fas fa-braille"></span>`
    },
    enslavedUnlock: {
      id: 11,
      reward: "Unlock Nameless's Memories",
      pet: "effarig",
      level: 8,
      displayIcon: `<span class="c-ra-pet-milestones-effarig-link">\uf0c1</span>`
    },
    relicShardGlyphLevelBoost: {
      id: 12,
      reward: "Glyph level is increased based on Relic Shards gained",
      effect: () => player.disablePostReality ? 0 : 100 * Decimal.pow(Decimal.log10(Decimal.max(Effarig.shardsGained, 1)), 2).toNumber(),
      pet: "effarig",
      level: 15,
      displayIcon: `<span class="fas fa-fire"></span>`
    },
    maxGlyphRarityAndShardSacrificeBoost: {
      id: 13,
      reward: () => `Glyphs are always generated with ${formatPercents(1)} rarity and
        Glyph Sacrifice gain is raised to a power based on Relic Shards`,
      effect: () => SlabdrillUnlocks.timeStudy181.isUnlocked ?
        Math.pow(Currency.relicShards.value.max(1).log10().div(10).add(1).toNumber(), 0.2) : 1 + Effarig.maxRarityBoost / 100,
      pet: "effarig",
      level: 25,
      displayIcon: `<i class="fas fa-ankh"></i>`
    },
    blackHolePowerAutobuyers: {
      id: 14,
      reward: "Unlock Black Hole power upgrade autobuyers",
      pet: "enslaved",
      level: 1,
      displayIcon: `<span class="fas fa-circle"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless1.canBeApplied
    },
    improvedStoredTime: {
      id: 15,
      reward: "Stored game time is amplified and you can store more real time, increasing with Nameless levels",
      effects: {
        gameTimeAmplification: () => player.disablePostReality ? 1 : Decimal.pow(20, Decimal.clampMax(Ra.pets.enslaved.level, Ra.levelCap)),
        realTimeCap: () => player.disablePostReality ? 0 : 1000 * 3600 * Ra.pets.enslaved.level,
      },
      pet: "enslaved",
      level: 2,
      displayIcon: `<span class="fas fa-history"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless2.canBeApplied
    },
    enslavedXP: {
      id: 16,
      reward: "All Memory Chunks produce more Memories based on total time played",
      effect: () => player.disablePostReality ? 1 : 1 + Decimal.log10(player.records.totalTimePlayed).div(200).toNumber(),
      pet: "enslaved",
      level: 5,
      displayIcon: `<span class="fas fa-stopwatch"></span>`
    },
    autoPulseTime: {
      id: 17,
      reward: () => `Black Hole charging now only uses ${formatPercents(0.99)} of your game speed and you can
        automatically discharge ${formatPercents(0.01)} of your stored game time every ${formatInt(5)} ticks.`,
      pet: "enslaved",
      level: 10,
      displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless3.canBeApplied
    },
    vUnlock: {
      id: 18,
      reward: "Unlock V's Memories",
      pet: "enslaved",
      level: 8,
      displayIcon: `⌬`
    },
    peakGamespeedDT: {
      id: 19,
      reward: "Gain more Dilated Time based on peak game speed in each Reality",
      effect: () => player.disablePostReality ? 1 : Decimal.max(Decimal.pow(Decimal.log10(player.celestials.ra.peakGamespeed).sub(90), 3), 1).toNumber(),
      pet: "enslaved",
      level: 15,
      displayIcon: `<span class="fas fa-tachometer-alt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raNameless4.canBeApplied
    },
    allGamespeedGlyphs: {
      id: 20,
      reward: `All basic Glyphs gain the increased game speed effect from Time Glyphs,
        and Time Glyphs gain an additional effect`,
      pet: "enslaved",
      level: 25,
      displayIcon: `<span class="fas fa-clock"></span>`,
      onUnlock: () => {
        const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    instantECAndRealityUpgradeAutobuyers: {
      id: 21,
      reward: "Rebuyable Reality upgrades are bought automatically and Auto-Eternity Challenges happen instantly",
      pet: "v",
      level: 1,
      displayIcon: `<span class="fas fa-sync-alt"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV1.canBeApplied
    },
    autoUnlockDilation: {
      id: 22,
      reward: () => `In non-Celestial Realities, Time Dilation is unlocked automatically for free at
        ${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)} Time Theorems`,
      pet: "v",
      level: 2,
      displayIcon: `<span class="fas fa-fast-forward"></span>`
    },
    vXP: {
      id: 23,
      reward: "All Memory Chunks produce more Memories based on total Celestial levels.",
      effect: () => player.disablePostReality ? 1 : 1 + Ra.totalPetLevel / 50,
      pet: "v",
      level: 5,
      displayIcon: `<span class="fas fa-book"></span>`
    },
    unlockHardV: {
      id: 24,
      reward: () => `Unlock Hard V-Achievements and unlock a Triad Study every ${formatInt(6)} levels.
        Triad Studies are located at the bottom of the Time Studies page`,
      effect: () => player.disablePostReality ? 0 : Math.min(Math.floor(Ra.pets.v.level / 6), 4),
      pet: "v",
      level: 6,
      displayIcon: `<span class="fas fa-trophy"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV2.canBeApplied
    },
    continuousTTBoost: {
      id: 25,
      reward: "Time Theorems boost all forms of continuous non-dimension production",
      effects: {
        ttGen: () => player.disablePostReality ? 1 : Math.pow(10, 5 * Ra.theoremBoostFactor()),
        eternity: () => player.disablePostReality ? 1 : Math.pow(10, 2 * Ra.theoremBoostFactor()),
        infinity: () => player.disablePostReality ? 1 : Math.pow(10, 15 * Ra.theoremBoostFactor()),
        replicanti: () => player.disablePostReality ? 1 : Math.pow(10, 20 * Ra.theoremBoostFactor()),
        dilatedTime: () => player.disablePostReality ? 1 : Math.pow(10, 3 * Ra.theoremBoostFactor()),
        memories: () => player.disablePostReality ? 1 : 1 + Ra.theoremBoostFactor() / 50,
        memoryChunks: () => player.disablePostReality ? 1 : 1 + Ra.theoremBoostFactor() / 50,
        autoPrestige: () => player.disablePostReality ? 1 : 1 + 2.4 * Ra.theoremBoostFactor()
      },
      pet: "v",
      level: 10,
      displayIcon: `<span class="fas fa-university"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV3.canBeApplied
    },
    achievementTTMult: {
      id: 26,
      reward: "Achievement multiplier applies to Time Theorem generation",
      effect: () => player.disablePostReality ? 1 : Achievements.power,
      pet: "v",
      level: 15,
      displayIcon: `<span class="fas fa-graduation-cap"></span>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV4.canBeApplied
    },
    achievementPower: {
      id: 27,
      reward: () => `Achievement multiplier is raised ${formatPow(1.5, 1, 1)}`,
      effect: () => player.disablePostReality ? 1 : 1.5,
      pet: "v",
      level: 25,
      displayIcon: `<i class="fab fa-buffer"></i>`,
      disabledByPelle: () => !PelleCelestialUpgrade.raV5.canBeApplied
    },
    eternityPointPower: {
      id: 28,
      reward: "Eternity Points are raised based on Teresa Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.teresa.level) / 100,
      pet: "teresa",
      level: 30,
      displayIcon: `<span class="fas fa-angle-up"></span>`,
      disabledByPelle: false
    },
    realityMachineCap: {
      id: 29,
      reward: "Reality Machine cap is raised based on Teresa Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.teresa.level) / 100,
      pet: "teresa",
      level: 40,
      displayIcon: `<span class="fas fa-arrow-turn-up"></span>`,
      disabledByPelle: false
    },
    celestialDimensionConversionPower: {
      id: 30,
      reward: "The Celestial Dimension Conversion Exponent is increased based on Teresa Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.teresa.level) / 200,
      pet: "teresa",
      level: 50,
      displayIcon: `<span class="fas fa-star"></span>`,
      disabledByPelle: false
    },
    chargeBoost: {
      id: 31,
      reward: "Charged Infinity Upgrades act as if your Teresa Level was twice as high",
      effect: () => player.disablePostReality ? 1 : 2,
      pet: "teresa",
      level: 65,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: false
    },
    sacrificePower: {
      id: 32,
      reward: "Dimensional Sacrifice gain for all Glyphs is squared",
      effect: () => player.disablePostReality ? 1 : 2,
      pet: "teresa",
      level: 80,
      displayIcon: `Ω`,
      disabledByPelle: false
    },
    imaginaryMachines: {
      id: 33,
      reward: "Imaginary Machines gain a power based on total Glyph Sacrifice amount",
      effect: () => {
        const sacrificeSum = new Decimal(player.reality.glyphs.sac.power).add(player.reality.glyphs.sac.infinity).add(
          player.reality.glyphs.sac.time).add(player.reality.glyphs.sac.replication).add(player.reality.glyphs.sac.dilation).add(
          player.reality.glyphs.sac.effarig).add(player.reality.glyphs.sac.reality);
        return player.disablePostReality ? 1 : 1 + Decimal.log10(Decimal.log10(sacrificeSum.add(1)).add(1)).div(20).toNumber();
      },
      pet: "teresa",
      level: 100,
      displayIcon: `<span class="fas fa-gear"></span>`,
      disabledByPelle: false
    },
    celestialDimensionPower: {
      id: 34,
      reward: "Endgames and Teresa level empower Celestial Dimensions",
      effect: () => player.disablePostReality ? 1 : Math.pow(Math.clamp(Ra.pets.teresa.level * Math.log10(player.endgames + 1) / 2000, 1, 1.5) * Math.pow(Math.max(Ra.pets.teresa.level * Math.log10(player.endgames + 1) / 3000, 1), 0.1), 5),
      pet: "teresa",
      level: 125,
      displayIcon: `<span class="fas fa-award"></span>`,
      disabledByPelle: false
    },
    relicShardBoost: {
      id: 35,
      reward: "Relic Shard gain is boosted based on Effarig Level",
      effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(10, Math.floor(Ra.pets.effarig.level)),
      pet: "effarig",
      level: 30,
      displayIcon: `<span class="fas fa-flask"></span>`,
      disabledByPelle: false
    },
    instabilityDelay: {
      id: 36,
      reward: "Relic Shards delay the first three levels of Glyph Instability",
      effect: () => player.disablePostReality ? 0 : Decimal.log10(player.celestials.effarig.relicShards.add(1)).times(10).toNumber(),
      pet: "effarig",
      level: 40,
      displayIcon: `<span class="fas fa-arrow-right"></span>`,
      disabledByPelle: false
    },
    rarityBuff: {
      id: 37,
      reward: "Maximum Glyph Rarity is increased based on Effarig Level",
      effect: () => player.disablePostReality ? 0 : Math.floor(Ra.pets.effarig.level) / 2,
      pet: "effarig",
      level: 50,
      displayIcon: `<span class="fas fa-dice"></span>`,
      disabledByPelle: false
    },
    glyphLevelBuff: {
      id: 38,
      reward: "Gain a small multiplier to Glyph Level based on Effarig Level which applies after Instability",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.effarig.level) / 1000,
      pet: "effarig",
      level: 65,
      displayIcon: `<span class="fas fa-chart-line"></span>`,
      disabledByPelle: false
    },
    alchemyCapIncrease: {
      id: 39,
      reward: "Effarig Level multiplies Glyph Alchemy cap",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.effarig.level) / 100,
      pet: "effarig",
      level: 80,
      displayIcon: `<span class="fas fa-flask-vial"></span>`,
      disabledByPelle: false
    },
    realityGlyphRarity: {
      id: 40,
      reward: "Effarig Level increases Reality Glyph rarity",
      effect: () => player.disablePostReality ? 0 : Math.floor(Ra.pets.effarig.level) / 5,
      pet: "effarig",
      level: 100,
      displayIcon: `Ϟ`,
      disabledByPelle: false
    },
    glyphSlot: {
      id: 41,
      reward: "Gain another Glyph Slot",
      effect: 1,
      pet: "effarig",
      level: 125,
      displayIcon: `<span class="fas fa-plus"></span>`,
      disabledByPelle: false
    },
    gameSpeedImprovement: {
      id: 42,
      reward: "Game Speed gains a power based on Nameless Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.pow(Math.floor(Ra.pets.enslaved.level) / 100, 2),
      pet: "enslaved",
      level: 30,
      displayIcon: `<span class="fas fa-hourglass"></span>`,
      disabledByPelle: false
    },
    tickspeedPower: {
      id: 43,
      reward: "Gain a power to Tickspeed based on Nameless Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.enslaved.level) / 100,
      pet: "enslaved",
      level: 40,
      displayIcon: `<span class="fas fa-power-off"></span>`,
      disabledByPelle: false
    },
    gameSpeedTesseractBoost: {
      id: 44,
      reward: "Tesseracts boost Game Speed",
      effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(10, Tesseracts.effectiveCount),
      pet: "enslaved",
      level: 50,
      displayIcon: `<span class="fas fa-forward"></span>`,
      disabledByPelle: false
    },
    gameSpeedTachyonMult: {
      id: 45,
      reward: "Peak Game Speed this Endgame multiplies Tachyon Particles gained",
      effect: () => player.disablePostReality ? DC.D1 : player.records.thisEndgame.peakGameSpeed,
      pet: "enslaved",
      level: 65,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: false
    },
    eternityGenBuff: {
      id: 46,
      reward: "Nameless Level boosts Eternity Generation",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.enslaved.level) / 100,
      pet: "enslaved",
      level: 80,
      displayIcon: `∆`,
      disabledByPelle: false
    },
    imaginaryMachineEternityPower: {
      id: 47,
      reward: "Gain a power to Imaginary Machines based on Eternities",
      effect: () => player.disablePostReality ? 1 : 1 + Decimal.log10(Decimal.log10(player.eternities.add(1)).add(1)).div(20).toNumber(),
      pet: "enslaved",
      level: 100,
      displayIcon: `<span class="fas fa-lightbulb"></span>`,
      disabledByPelle: false
    },
    freeTesseractIncrease: {
      id: 48,
      reward: "Nameless Level increases the Free Tesseract Softcap starting threshold",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.enslaved.level) / 250,
      pet: "enslaved",
      level: 125,
      displayIcon: `<span class="fas fa-cubes"></span>`,
      disabledByPelle: false
    },
    achievementMultPower: {
      id: 49,
      reward: "Gain a power to Achievement Multiplier based on V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 100,
      pet: "v",
      level: 30,
      displayIcon: `<span class="fas fa-medal"></span>`,
      disabledByPelle: false
    },
    allDimPowTT: {
      id: 50,
      reward: "Time Theorems empower the first three Dimension types",
      effect: () => player.disablePostReality ? 1 : Math.pow(1 + Decimal.log10(Decimal.log10(Currency.timeTheorems.value.add(1)).add(1)).div(10).toNumber(), 5),
      pet: "v",
      level: 40,
      displayIcon: `<span class="fas fa-brain"></span>`,
      disabledByPelle: false
    },
    triadBuff: {
      id: 51,
      reward: "Triad Studies are more powerful based on V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 200,
      pet: "v",
      level: 50,
      displayIcon: `<span class="fas fa-3"></span>`,
      disabledByPelle: false
    },
    spaceTheoremIPowConversion: {
      id: 52,
      reward: "Space Theorems boost the Infinity Power Conversion Rate",
      effect: () => player.disablePostReality ? 1 : Math.pow(V.spaceTheorems + 1, 0.05),
      pet: "v",
      level: 65,
      displayIcon: `<span class="fas fa-ranking-star"></span>`,
      disabledByPelle: false
    },
    spaceTheoremBoost: {
      id: 53,
      reward: "Space Theorems are boosted by V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 200,
      pet: "v",
      level: 80,
      displayIcon: `<span class="fas fa-star"></span>`,
      disabledByPelle: false
    },
    spaceTheoremAchPower: {
      id: 54,
      reward: "Space Theorems empower Achievement Multiplier",
      effect: () => player.disablePostReality ? 1 : 1 + Math.log10(V.spaceTheorems + 1),
      pet: "v",
      level: 100,
      displayIcon: `<span class="fas fa-award"></span>`,
      disabledByPelle: false
    },
    infinityDimPower: {
      id: 55,
      reward: "Gain a power to Infinity Dimensions based on V Level",
      effect: () => player.disablePostReality ? 1 : 1 + Math.floor(Ra.pets.v.level) / 40,
      pet: "v",
      level: 125,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: false
    },
  }
};
