export const tabNotifications = {
  firstInfinity: {
    id: 0,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "upgrades"
      },
      {
        parent: "challenges",
        tab: "normal"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() &&
      !PlayerProgress.infinityUnlocked(),
    events: [GAME_EVENT.BIG_CRUNCH_BEFORE]
  },
  breakInfinity: {
    id: 1,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "break"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Autobuyer.bigCrunch.hasMaxedInterval
  },
  IDUnlock: {
    id: 2,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && !InfinityDimension(2).isUnlocked
  },
  ICUnlock: {
    id: 3,
    tabsToHighLight: [
      {
        parent: "challenges",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked()
  },
  replicanti: {
    id: 4,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "replicanti"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Currency.infinityPoints.gte(DC.E140),
    events: [GAME_EVENT.BIG_CRUNCH_AFTER]
  },
  firstEternity: {
    id: 5,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      },
      {
        parent: "eternity",
        tab: "milestones"
      },
      {
        parent: "eternity",
        tab: "upgrades"
      },
      {
        parent: "dimensions",
        tab: "time"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked(),
    events: [GAME_EVENT.ETERNITY_RESET_BEFORE]
  },
  dilationAfterUnlock: {
    id: 6,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "dilation"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() &&
      !PlayerProgress.realityUnlocked()
  },
  realityUnlock: {
    id: 7,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() &&
      !PlayerProgress.realityUnlocked() && TimeStudy.reality.canBeBought,
    events: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION,
      GAME_EVENT.OFFLINE_CURRENCY_GAINED, GAME_EVENT.ACHIEVEMENT_UNLOCKED]
  },
  blackHoleUnlock: {
    id: 8,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "hole"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() &&
      !BlackHoles.areUnlocked && Currency.realityMachines.gte(100),
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  automatorUnlock: {
    id: 9,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "automator"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && Player.automatorUnlocked,
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  teresaUnlock: {
    id: 10,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "celestial-navigation"
      },
      {
        parent: "celestials",
        tab: "teresa"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() &&
      player.celestials.teresa.pouredAmount.eq(new Decimal(0)) && Teresa.isUnlocked,
    events: [GAME_EVENT.REALITY_UPGRADE_BOUGHT]
  },
  alchemyUnlock: {
    id: 11,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "reality",
        tab: "alchemy"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && player.celestials.ra.pets.effarig.level >= 2,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  newAutobuyer: {
    id: 12,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "autobuyers"
      },
    ],
    // Always externally triggered, but needs to be ignored in cel7 because they're unlocked differently
    condition: () => !Pelle.isDoomed,
  },
  imaginaryMachineUnlock: {
    id: 13,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "imag_upgrades"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked() && MachineHandler.isIMUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  laitelaUnlock: {
    id: 14,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "laitela"
      },
    ],
    // Always externally triggered
    condition: () => true,
  },
  pelleUnlock: {
    id: 15,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "pelle"
      },
    ],
    // Always externally triggered
    condition: () => true,
  },
  newGlyphCosmetic: {
    id: 16,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs",
      },
    ],
    // Always externally triggered
    condition: () => true,
  },
  endgameUnlock: {
    id: 17,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "endgame"
      },
      {
        parent: "endgame",
        tab: "break-eternity"
      },
      {
        parent: "endgame",
        tab: "pelle-destruction"
      },
      {
        parent: "endgame",
        tab: "expansion-packs"
      },
      {
        parent: "endgame",
        tab: "masteries"
      },
      {
        parent: "endgame",
        tab: "milestones"
      },
      {
        parent: "reality",
        tab: "imag_upgrades"
      },
      {
        parent: "dimensions",
        tab: "celestial"
      }
    ],
    condition: () => !PlayerProgress.endgameUnlocked(),
    events: [GAME_EVENT.ENDGAME_RESET_BEFORE]
  },
  breakEternity: {
    id: 18,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "break-eternity"
      }
    ],
    condition: () => !player.break2 && Currency.antimatter.gte(DC.E9E15),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  packsUnlock: {
    id: 19,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "expansion-packs"
      }
    ],
    condition: () => !ExpansionPacks.areUnlocked && GalaxyGenerator.galaxies.gte(Decimal.pow(2, 64)),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  endgameUpgrades: {
    id: 20,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "upgrades"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  galacticPower: {
    id: 21,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "power"
      }
    ],
    condition: () => GalacticPower.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  ethereal: {
    id: 22,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "ethereal"
      }
    ],
    condition: () => Ethereal.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  alphaUnlock: {
    id: 23,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "alpha"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  dualMachineUnlock: {
    id: 24,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "dual_upgrades"
      }
    ],
    condition: () => MachineHandler.isDMUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  hadrons: {
    id: 25,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "laitela"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  celDimExpansion: {
    id: 26,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "celestial"
      }
    ],
    condition: () => Alpha.isDestroyed,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  celInfinity: {
    id: 27,
    tabsToHighLight: [
      {
        parent: "cdexpansion",
        tab: "celestial-infinity"
      }
    ],
    condition: () => !PlayerProgress.celestialInfinityUnlocked(),
    events: [GAME_EVENT.CELESTIAL_CRUNCH_BEFORE]
  },
  stars: {
    id: 28,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "ethereal"
      }
    ],
    condition: () => Currency.etherealPower.gte(1e25),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  hypercubes: {
    id: 29,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "hypercubes"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  secondShop: {
    id: 30,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "effarig"
      }
    ],
    condition: () => Achievement(227).isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  divinity: {
    id: 31,
    tabsToHighLight: [
      {
        parent: "divinity",
        tab: "milestones"
      }
    ],
    condition: () => player.celestials.pelle.divinities > 0,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  celBreak: {
    id: 32,
    tabsToHighLight: [
      {
        parent: "cdexpansion",
        tab: "celestial-break-infinity"
      }
    ],
    condition: () => CelestialInfinityUpgrade.all.filter(u => u.isBought).length === CelestialInfinityUpgrade.all.length,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  divTwo: {
    id: 33,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "divine"
      },
      {
        parent: "divinity",
        tab: "upgrades"
      }
    ],
    condition: () => DivinityMilestone.divineDimensions.isReached,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  resurge: {
    id: 34,
    tabsToHighLight: [
      {
        parent: "divinity",
        tab: "resurgence"
      }
    ],
    condition: () => ResurgenceUpgrades.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  divThree: {
    id: 35,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "expansion-packs"
      }
    ],
    condition: () => DivinityMilestone.hadronEmpowerment.isReached,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  celEternity: {
    id: 36,
    tabsToHighLight: [
      {
        parent: "cdexpansion",
        tab: "celestial-eternity"
      }
    ],
    condition: () => !PlayerProgress.celestialEternityUnlocked(),
    events: [GAME_EVENT.CELESTIAL_ETERNITY_RESET_BEFORE]
  },
  largeHadronCollider: {
    id: 37,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "collider"
      }
    ],
    condition: () => ExpansionPack.alphaPack.isBought,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  celEternityPlus: {
    id: 38,
    tabsToHighLight: [
      {
        parent: "cdexpansion",
        tab: "celestial-eternity-plus"
      }
    ],
    condition: () => Currency.celestialEternityPoints.gte("1e1000"),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillUnlock: {
    id: 39,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      }
    ],
    condition: () => Slabdrill.isCursed,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeOne: {
    id: 40,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "dimensions",
        tab: "celestial"
      }
    ],
    condition: () => SlabdrillUnlocks.dimboost.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeTwo: {
    id: 41,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "reality",
        tab: "glyphs"
      }
    ],
    condition: () => SlabdrillUnlocks.galaxy.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeThree: {
    id: 42,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "endgame",
        tab: "break-eternity"
      }
    ],
    condition: () => SlabdrillUnlocks.infinity.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeFour: {
    id: 43,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "reality",
        tab: "glyphs"
      }
    ],
    condition: () => SlabdrillUnlocks.breakInfinity.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeFive: {
    id: 44,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "celestials",
        tab: "laitela"
      }
    ],
    condition: () => SlabdrillUnlocks.infinityChallengeFour.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeSix: {
    id: 45,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "endgame",
        tab: "ethereal"
      }
    ],
    condition: () => SlabdrillUnlocks.replicanti.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeSeven: {
    id: 46,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "endgame",
        tab: "masteries"
      }
    ],
    condition: () => SlabdrillUnlocks.eternity.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeEight: {
    id: 47,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "celestials",
        tab: "effarig"
      }
    ],
    condition: () => SlabdrillUnlocks.timeStudy181.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeNine: {
    id: 48,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "achievements",
        tab: "normal"
      }
    ],
    condition: () => SlabdrillUnlocks.eternityChallengeTen.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeTen: {
    id: 49,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "reality",
        tab: "alchemy"
      }
    ],
    condition: () => SlabdrillUnlocks.dilation.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabdrillStrikeEleven: {
    id: 50,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      },
      {
        parent: "dimensions",
        tab: "antimatter"
      }
    ],
    condition: () => SlabdrillUnlocks.reality.isUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  goodbye: {
    id: 51,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "antimatter"
      }
    ],
    condition: () => Slabdrill.isDestroyed,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  extendMasteries: {
    id: 52,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "masteries"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  extendSingularityMilestones: {
    id: 53,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "laitela"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  extendGalacticPowers: {
    id: 54,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "power"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  ascension: {
    id: 55,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "ascension"
      }
    ],
    // Always externally triggered
    condition: () => true,
  },
  transientUniverse: {
    id: 56,
    tabsToHighLight: [
      {
        parent: "universes",
        tab: "transient"
      }
    ],
    condition: () => Universes.isUnlocked(1),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  compressionUnlock: {
    id: 57,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "compression"
      }
    ],
    condition: () => PlayerProgress.compressionUnlocked(),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  tangibleUniverse: {
    id: 58,
    tabsToHighLight: [
      {
        parent: "universes",
        tab: "tangible"
      }
    ],
    condition: () => Universes.isUnlocked(2),
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  divTwentyTwo: {
    id: 59,
    tabsToHighLight: [
      {
        parent: "endgame",
        tab: "expansion-packs"
      }
    ],
    condition: () => DivinityMilestone.serpentPower.isReached,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  slabPack: {
    id: 60,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "slabdrill"
      }
    ],
    condition: () => ExpansionPack.slabPack.isBought,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
};
