import { AutomatorPanels } from "@/components/tabs/automator/AutomatorDocs";
import { GlyphInfo } from "@/components/modals/options/SelectGlyphInfoDropdown";

import { AUTOMATOR_MODE, AUTOMATOR_TYPE } from "./automator/automator-backend";
import { deepmergeAll } from "@/utility/deepmerge";
import { GlyphTypes } from "./glyph-effects";

// This is actually reassigned when importing saves
// eslint-disable-next-line prefer-const
window.player = {
  username: "[username]",
  disablePostReality: false,
  hasSeenIntro: false,
  introTick: 0,
  introFrozen: true,
  antimatter: DC.E1,
  dimensions: {
    antimatter: Array.range(0, 9).map(() => ({
      bought: DC.D0,
      costBumps: DC.D0,
      amount: DC.D0
    })),
    infinity: Array.range(0, 9).map(tier => ({
      isUnlocked: false,
      bought: DC.D0,
      amount: DC.D0,
      cost: [DC.E8, DC.E9, DC.E10, DC.E20, DC.E140, DC.E200, DC.E250, DC.E280, new Decimal(Infinity)][tier],
      baseAmount: DC.D0
    })),
    time: Array.range(0, 9).map(tier => ({
      cost: [DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350, new Decimal(Infinity)][tier],
      amount: DC.D0,
      bought: DC.D0
    })),
    celestial: Array.range(0, 9).map(tier => ({
      isUnlocked: false,
      bought: DC.D0,
      amount: DC.D0,
      cost: [DC.D1, DC.E1, DC.E2, DC.E4, DC.E10, DC.E30, DC.E100, DC.E300, new Decimal(Infinity)][tier],
      baseAmount: DC.D0,
    })),
    divine: Array.range(0, 9).map(tier => ({
      bought: DC.D0,
      amount: DC.D0,
      cost: [DC.E1, DC.E3, DC.E6, DC.E10, DC.E15, DC.E21, DC.E28, DC.E36, new Decimal(Infinity)][tier],
      baseAmount: DC.D0,
    }))
  },
  buyUntil10: true,
  sacrificed: DC.D0,
  achievementBits: Array.repeat(0, 29),
  secretAchievementBits: Array.repeat(0, 4),
  infinityUpgrades: new Set(),
  infinityRebuyables: [0, 0, 0],
  breakEternityUpgrades: new Set(),
  breakEternityRebuyables: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  challenge: {
    normal: {
      current: 0,
      bestTimes: Array.repeat(DC.BEMAX, 11),
      completedBits: 0,
    },
    infinity: {
      current: 0,
      bestTimes: Array.repeat(DC.BEMAX, 8),
      completedBits: 0,
    },
    eternity: {
      current: 0,
      unlocked: 0,
      requirementBits: 0,
    }
  },
  infinity: {
    upgradeBits: 0
  },
  auto: {
    autobuyersOn: true,
    disableContinuum: false,
    endgame: {
      mode: 0,
      amountCP: DC.D1,
      amountDP: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighestCP: DC.D1,
      xHighestDP: DC.D1,
      isActive: false
    },
    reality: {
      mode: 0,
      rm: DC.D1,
      glyph: 0,
      time: 0,
      shard: 0,
      isActive: false
    },
    eternity: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: false
    },
    bigCrunch: {
      cost: 1,
      interval: 150000,
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: true,
      lastTick: 0,
      hasIncreasedAlphaCosts: true
    },
    galaxy: {
      cost: 1,
      interval: 20000,
      limitGalaxies: false,
      maxGalaxies: 1,
      buyMax: false,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    dimBoost: {
      cost: 1,
      interval: 4000,
      limitDimBoosts: false,
      maxDimBoosts: 1,
      limitUntilGalaxies: false,
      galaxies: 10,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    tickspeed: {
      isUnlocked: false,
      cost: 1,
      interval: 500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: true,
      lastTick: 0,
      isBought: false
    },
    celestialTickspeed: {
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: true,
      lastTick: 0
    },
    celestialDimBoost: {
      limitCelDimBoosts: false,
      maxCelDimBoosts: 1,
      limitUntilCelGalaxies: false,
      celGalaxies: 10,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    celestialGalaxy: {
      limitCelGalaxies: false,
      maxCelGalaxies: 1,
      buyMax: false,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    celestialCrunch: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: true,
      lastTick: 0
    },
    celestialEternity: {
      mode: 0,
      amount: DC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: DC.D1,
      isActive: true,
      lastTick: 0
    },
    sacrifice: {
      multiplier: DC.D2,
      isActive: true
    },
    antimatterDims: {
      all: Array.range(0, 8).map(tier => ({
        isUnlocked: false,
        cost: 1,
        interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
        bulk: 1,
        mode: AUTOBUYER_MODE.BUY_10,
        isActive: true,
        lastTick: 0,
        isBought: false
      })),
      isActive: true,
    },
    infinityDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    celestialDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    divineDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    replicantiGalaxies: {
      isActive: false,
    },
    replicantiUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeTheorems: {
      isActive: false,
    },
    dilationUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    pelleDilationUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    blackHolePower: {
      all: Array.range(0, 2).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    realityUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    imaginaryUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    dualityUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    darkMatterDims: {
      isActive: false,
      lastTick: 0,
    },
    ascension: {
      isActive: false,
      lastTick: 0,
    },
    annihilation: {
      isActive: false,
      multiplier: 1.05,
      mode: 0,
    },
    tesseracts: {
      isActive: false,
    },
    bulkSingularity: {
      isActive: false,
      lowerBound: 0.1,
      upperBound: 10,
      hasLowerBound: false,
      hasUpperBound: false,
    },
    galaxyGenerator: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    musicGlyphPurge: {
      isActive: false,
    },
    endgameUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    singularity: { isActive: false },
    ipMultBuyer: { isActive: false, },
    epMultBuyer: { isActive: false, },
    cipMultBuyer: { isActive: false, },
  },
  infinityPoints: DC.D0,
  infinities: DC.D0,
  infinitiesBanked: DC.D0,
  dimensionBoosts: DC.D0,
  galaxies: DC.D0,
  news: {
    // This is properly handled in NewsHandler.addSeenNews which adds properties as needed
    seen: {},
    specialTickerData: {
      uselessNewsClicks: 0,
      paperclips: 0,
      newsQueuePosition: 1000,
      eiffelTowerChapter: 0,
      storyChapter: 0,
      effarigChapter: 0,
      discordLevel: 1,
      dayOfEndgame: 0,
      celestialFuneralChapter: 0
    },
    totalSeen: 0,
  },
  lastUpdate: new Date().getTime(),
  backupTimer: 0,
  storedTime: 0,
  flux: {
    isUnlocked: false,
    level: 1,
    fluxTime: 0,
    maxUnlockedFlux: 2
  },
  lastExportTime: Date.now(),
  chall2Pow: 1,
  chall3Pow: DC.D0_01,
  matter: DC.D1,
  chall9TickspeedCostBumps: DC.D0,
  chall8TotalSacrifice: DC.D1,
  ic2Count: 0,
  partInfinityPoint: DC.D0,
  partInfinitied: 0,
  break: false,
  break2: false,
  secretUnlocks: {
    themes: new Set(),
    viewSecretTS: false,
    cancerAchievements: false,
  },
  shownRuns: {
    Reality: true,
    Eternity: true,
    Infinity: true
  },
  requirementChecks: {
    infinity: {
      maxAll: false,
      noSacrifice: true,
      noAD8: true,
    },
    eternity: {
      onlyAD1: true,
      onlyAD8: true,
      noAD1: true,
      noRG: true,
    },
    reality: {
      noAM: true,
      noTriads: true,
      noPurchasedTT: true,
      noInfinities: true,
      noEternities: true,
      noContinuum: true,
      maxID1: DC.D0,
      maxStudies: 0,
      maxGlyphs: 0,
      slowestBH: 1,
      noCelMatter: true,
    },
    endgame: {
      noGlyphsDoomed: true,
      onlyLowDims: true,
      maxStudies: 0,
      noContinuum: true,
      noGlyphs: true,
    },
    permanent: {
      emojiGalaxies: 0,
      singleTickspeed: 0,
      perkTreeDragging: 0
    }
  },
  records: {
    gameCreatedTime: Date.now(),
    totalTimePlayed: DC.D0,
    timePlayedAtBHUnlock: DC.BEMAX,
    realTimePlayed: 0,
    realTimeDoomed: 0,
    fullGameCompletions: 0,
    previousRunRealTime: 0,
    totalAntimatter: DC.E1,
    totalAntimatterOutsideDoom: DC.E1,
    bestAntimatterExponentOutsideDoom: DC.D0,
    bestDoomedAntimatterThisDivinity: DC.E1,
    totalEndgameAntimatter: DC.E1,
    totalRealityAntimatter: DC.E1,
    totalEternityAntimatter: DC.E1,
    totalInfinityAntimatter: DC.E1,
    totalCelMatter: DC.D0,
    totalCelestialRealityCelMatter: DC.D0,
    totalCelestialEternityCelMatter: DC.D0,
    totalCelestialInfinityCelMatter: DC.D0,
    totalDivineMatter: DC.E1,
    totalCondenseDivineMatter: DC.E1,
    totalSupernovaDivineMatter: DC.E1,
    recentInfinities: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, ""]),
    recentEternities: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]),
    recentRealities: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0, DC.D0, DC.D0]),
    recentEndgames: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, 1]),
    recentCelestialInfinities: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    recentCelestialEternities: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    recentCondenses: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    recentSupernovae: Array.range(0, 10).map(() =>
      [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1]),
    thisInfinity: {
      time: DC.D0,
      realTime: 0,
      lastBuyTime: DC.D0,
      maxAM: DC.D0,
      bestIPmin: DC.D0,
      bestIPminVal: DC.D0,
    },
    bestInfinity: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestIPminEternity: DC.D0,
      bestIPminReality: DC.D0,
    },
    thisEternity: {
      time: DC.D0,
      realTime: 0,
      maxAM: DC.D0,
      maxIP: DC.D0,
      bestIPMsWithoutMaxAll: DC.D0,
      bestEPmin: DC.D0,
      bestEPminVal: DC.D0,
      bestInfinitiesPerMs: DC.D0,
    },
    bestEternity: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestEPminReality: DC.D0,
    },
    thisReality: {
      time: DC.D0,
      realTime: 0,
      maxAM: DC.D0,
      maxIP: DC.D0,
      maxEP: DC.D0,
      bestEternitiesPerMs: DC.D0,
      maxReplicanti: DC.D0,
      maxDT: DC.D0,
      bestRSmin: DC.D0,
      bestRSminVal: DC.D0,
      galaxies: DC.D0,
    },
    bestReality: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      glyphStrength: 0,
      RM: DC.D0,
      RMSet: [],
      RMmin: DC.D0,
      RMminSet: [],
      glyphLevel: DC.D0,
      glyphLevelSet: [],
      bestEP: DC.D0,
      bestEPSet: [],
      speedSet: [],
      iMCapSet: [],
      laitelaSet: [],
    },
    thisEndgame: {
      time: DC.D0,
      realTime: 0,
      bestCPmin: DC.D0,
      bestDPmin: DC.D0,
      peakGameSpeed: DC.D1,
    },
    bestEndgame: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestCPmin: DC.D0,
      bestDPmin: DC.D0,
      glyphLevel: DC.D0,
      galaxies: DC.D0,
    },
    thisCelestialInfinity: {
      time: DC.D0,
      realTime: 0,
      maxCM: DC.D0,
      bestCIPmin: DC.D0,
      bestCIPminVal: DC.D0,
    },
    bestCelestialInfinity: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestCIPminCelestialEternity: DC.D0,
      bestCIPminCelestialReality: DC.D0,
    },
    thisCelestialEternity: {
      time: DC.D0,
      realTime: 0,
      maxCM: DC.D0,
      maxCIP: DC.D0,
      bestCEPmin: DC.D0,
      bestCEPminVal: DC.D0,
      bestCelestialInfinitiesPerMs: DC.D0,
    },
    bestCelestialEternity: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestCEPminCelestialReality: DC.D0,
    },
    thisCelestialReality: {
      time: DC.D0,
      realTime: 0,
      maxCM: DC.D0,
      maxCIP: DC.D0,
      maxCEP: DC.D0,
      bestCelestialEternitiesPerMs: DC.D0,
    },
    thisCondense: {
      time: DC.D0,
      realTime: 0,
      maxVM: DC.D0,
      bestVSmin: DC.D0,
      bestVSminVal: DC.D0,
    },
    bestCondense: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestVSminSupernova: DC.D0,
    },
    thisSupernova: {
      time: DC.D0,
      realTime: 0,
      maxVM: DC.D0,
      maxVS: DC.D0,
      bestNebmin: DC.D0,
      bestNebminVal: DC.D0,
      bestCondensesPerMs: DC.D0,
    },
    bestSupernova: {
      time: DC.BEMAX,
      realTime: Number.MAX_VALUE,
      bestNebminTotal: DC.D0,
      bestSupernovaePerMs: DC.D0,
      maxNeb: DC.D0,
      totalNeb: DC.D0
    },
    permanent: {
      maxCP: DC.D0,
      maxDP: DC.D0,
    },
  },
  speedrun: {
    isUnlocked: false,
    isActive: false,
    isSegmented: false,
    usedSTD: false,
    hasStarted: false,
    hideInfo: false,
    displayAllMilestones: false,
    startDate: 0,
    name: "",
    offlineTimeUsed: 0,
    // One spot for every entry in GameDatabase.speedrunMilestones (note: 1-indexed)
    records: Array.repeat(0, 26),
    achievementTimes: {},
    seedSelection: SPEEDRUN_SEED_STATE.FIXED,
    initialSeed: 0,
    previousRuns: {}
  },
  IPMultPurchases: DC.D0,
  version: 110,
  infinityPower: DC.D1,
  postC4Tier: 0,
  eternityPoints: DC.D0,
  eternities: DC.D0,
  eternityUpgrades: new Set(),
  epmultUpgrades: DC.D0,
  timeShards: DC.D0,
  totalTickGained: DC.D0,
  totalTickBought: DC.D0,
  replicanti: {
    unl: false,
    amount: DC.D0,
    chance: DC.D1.div(100),
    chanceCost: DC.E150,
    interval: DC.E3,
    intervalCost: DC.E140,
    boughtGalaxyCap: DC.D0,
    galaxies: DC.D0,
    galCost: DC.E170,
  },
  timestudy: {
    theorem: DC.D0,
    maxTheorem: DC.D0,
    amBought: DC.D0,
    ipBought: DC.D0,
    epBought: DC.D0,
    studies: [],
    shopMinimized: false,
    preferredPaths: [[], 0],
    presets: new Array(6).fill({
      name: "",
      studies: "",
    }),
  },
  eternityChalls: {},
  respec: false,
  eterc8ids: 50,
  eterc8repl: 40,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: DC.D0,
    dilatedTime: DC.D0,
    nextThreshold: DC.E3,
    baseTachyonGalaxies: DC.D0,
    totalTachyonGalaxies: DC.D0,
    upgrades: new Set(),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      11: 0,
      12: 0,
      13: 0,
    },
    lastEP: DC.DM1,
  },
  realities: DC.D0,
  partSimulatedReality: 0,
  reality: {
    realityMachines: DC.D0,
    maxRM: DC.D0,
    imaginaryMachines: DC.D0,
    iMCap: DC.D0,
    dualMachines: DC.D0,
    jMCap: DC.D0,
    glyphs: {
      active: [],
      inventory: [],
      sac: {
        power: DC.D0,
        infinity: DC.D0,
        time: DC.D0,
        replication: DC.D0,
        dilation: DC.D0,
        effarig: DC.D0,
        reality: DC.D0
      },
      undo: [],
      sets: new Array(70).fill(0).map(() => ({
        name: "",
        glyphs: [],
      })),
      protectedRows: 2,
      filter: {
        select: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        trash: AUTO_GLYPH_REJECT.SACRIFICE,
        simple: 0,
        types: GlyphTypes.list
          .filter(t => ALCHEMY_BASIC_GLYPH_TYPES.includes(t.id))
          .mapToObject(t => t.id, t => ({
            rarity: 0,
            score: 0,
            effectCount: 0,
            specifiedMask: 0,
            effectScores: Array.repeat(0, t.effects.length),
          })),
      },
      createdRealityGlyph: false,
      cosmetics: {
        active: false,
        glowNotification: false,
        unlockedFromNG: [],
        symbolMap: {},
        colorMap: {},
      }
    },
    initialSeed: Math.floor(Date.now() * Math.random() + 1),
    // The seed value should get set from initialSeed upon unlocking reality, but we set it to 1 as a fallback in
    // case somehow it doesn't get set properly. Do not change this to 0, as a seed of 0 causes the game to hang
    seed: 1,
    secondGaussian: 1e6,
    musicSeed: Math.floor(Date.now() * Math.random() + 0xBCDDECCB),
    musicSecondGaussian: 1e6,
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    upgradeBits: 0,
    upgReqs: 0,
    imaginaryUpgradeBits: 0,
    imaginaryUpgReqs: 0,
    imaginaryRebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    },
    dualityUpgradeBits: 0,
    dualityUpgReqs: 0,
    dualityRebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    },
    reqLock: {
      reality: 0,
      imaginary: 0,
      duality: 0
    },
    perks: new Set(),
    respec: false,
    showGlyphSacrifice: false,
    showSidebarPanel: GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT,
    autoSort: 0,
    autoCollapse: false,
    autoAutoClean: false,
    applyFilterToPurge: false,
    moveGlyphsOnProtection: false,
    perkPoints: DC.D0,
    unlockedEC: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: DC.D0,
    autoAchieve: true,
    gainedAutoAchievements: true,
    automator: {
      state: {
        mode: AUTOMATOR_MODE.STOP,
        topLevelScript: 0,
        editorScript: 0,
        repeat: true,
        forceRestart: true,
        followExecution: true,
        stack: [],
      },
      scripts: {
      },
      constants: {},
      constantSortOrder: [],
      execTimer: 0,
      type: AUTOMATOR_TYPE.TEXT,
      forceUnlock: false,
      currentInfoPane: AutomatorPanels.INTRO_PAGE,
    },
    achTimer: DC.D0,
    hasCheckedFilter: false,
  },
  blackHole: Array.range(0, 2).map(id => ({
    id,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0,
  })),
  blackHolePause: false,
  blackHoleAutoPauseMode: 0,
  blackHolePauseTime: 0,
  blackHoleNegative: 1,
  celestials: {
    teresa: {
      pouredAmount: DC.D0,
      quoteBits: 0,
      quotes: [],
      unlockBits: 0,
      run: false,
      bestRunAM: DC.D1,
      bestAMSet: [],
      perkShop: Array.repeat(0, 7),
      lastRepeatedMachines: DC.D0,
      charged: new Set(),
      disCharge: false,
      chargeMode: false,
      autoPour: false
    },
    effarig: {
      relicShards: DC.D0,
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      quotes: [],
      glyphWeights: {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      },
      autoAdjustGlyphWeights: false,
      effarigTime: 0,
      effarigLayer: 0
    },
    enslaved: {
      isStoring: false,
      stored: DC.D0,
      isStoringReal: false,
      storedReal: 0,
      autoStoreReal: false,
      isAutoReleasing: false,
      quoteBits: 0,
      quotes: [],
      unlocks: [],
      run: false,
      completed: false,
      tesseracts: 0,
      hasSecretStudy: false,
      feltEternity: false,
      progressBits: 0,
      hintBits: 0,
      hintUnlockProgress: 0,
      glyphHintsGiven: 0,
      zeroHintTime: 0,
      pulseAmount: 0.01,
      pulseTime: 5
    },
    v: {
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      quotes: [],
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      goalReductionSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      STSpent: 0,
      runGlyphs: [[], [], [], [], [], [], [], [], []],
      // The -10 is for glyph count, as glyph count for V is stored internally as a negative number
      runRecords: [DC.E1.neg(), DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0],
      wantsFlipped: true,
      upgrades: Array.repeat(0, 1),
      vTime: 0,
      vAuto: 0,
      vTotal: 0,
      vLayer: 0,
    },
    ra: {
      pets: {
        teresa: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        effarig: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        enslaved: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        v: {
          level: 1,
          memories: DC.D0,
          memoryChunks: DC.D0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        }
      },
      alchemy: Array.repeat(0, 21)
        .map(() => ({
          amount: 0,
          bestPreDoom: 0,
          reaction: false
        })),
      highestRefinementValue: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0
      },
      quoteBits: 0,
      quotes: [],
      momentumTime: 0,
      unlockBits: 0,
      unlocks: [],
      run: false,
      charged: new Set(),
      disCharge: false,
      peakGamespeed: DC.D1,
      petWithRemembrance: ""
    },
    laitela: {
      darkMatter: DC.D0,
      unnerfedDarkMatter: DC.D0,
      maxDarkMatter: DC.D0,
      run: false,
      quoteBits: 0,
      quotes: [],
      dimensions: Array.range(0, 8).map(() =>
        ({
          amount: DC.D0,
          intervalUpgrades: DC.D0,
          powerDMUpgrades: DC.D0,
          powerDEUpgrades: DC.D0,
          timeSinceLastUpdate: 0,
          ascensionCount: DC.D0
        })),
      entropy: DC.D0,
      thisCompletion: 3600,
      fastestCompletion: 3600,
      difficultyTier: 0,
      upgrades: {},
      darkMatterMult: DC.D1,
      darkEnergy: DC.D0,
      singularitySorting: {
        displayResource: 0,
        sortResource: 0,
        showCompleted: 0,
        sortOrder: 0,
      },
      singularities: DC.D0,
      singularityCapIncreases: DC.D0,
      lastCheckedMilestones: DC.D0,
      milestoneGlow: true,
      hadronizes: 0,
      hadrons: {
        total: 0,
        light: 0,
        dark: 0,
        exotic: 0,
        trueTotal: 0,
        totalLight: 0,
        totalDark: 0,
        totalExotic: 0
      }
    },
    pelle: {
      doomed: false,
      upgrades: new Set(),
      remnants: DC.D0,
      realityShards: DC.D0,
      records: {
        totalAntimatter: DC.D0,
        totalEndgameAntimatter: DC.D0,
        totalRealityAntimatter: DC.D0,
        totalEternityAntimatter: DC.D0,
        totalInfinityAntimatter: DC.D0,
        totalInfinityPoints: DC.D0,
        totalEternityPoints: DC.D0,
      },
      rebuyables: {
        antimatterDimensionMult: 0,
        timeSpeedMult: 0,
        glyphLevels: 0,
        infConversion: 0,
        galaxyPower: 0,
        galaxyGeneratorAdditive: 0,
        galaxyGeneratorMultiplicative: 0,
        galaxyGeneratorAntimatterMult: 0,
        galaxyGeneratorIPMult: 0,
        galaxyGeneratorEPMult: 0,
        galaxyGeneratorRSMult: 0,
        galaxyGeneratorDTMult: 0,
        galaxyGeneratorRemnantPow: 0,
        galaxyGeneratorExponential: 0,
        galaxyGeneratorSuperExponential: 0
      },
      rifts: {
        vacuum: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        decay: {
          fill: DC.D0,
          active: false,
          percentageSpent: 0,
          reducedTo: 1
        },
        chaos: {
          fill: 0,
          active: false,
          reducedTo: 1
        },
        recursion: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        },
        paradox: {
          fill: DC.D0,
          active: false,
          reducedTo: 1
        }
      },
      progressBits: 0,
      galaxyGenerator: {
        unlocked: false,
        spentGalaxies: DC.D0,
        generatedGalaxies: DC.D0,
        phase: 0,
        sacrificeActive: false
      },
      quoteBits: 0,
      quotes: [],
      collapsed: {
        upgrades: false,
        rifts: false,
        galaxies: false,
        destruction: [false, false, false, false, false, false, false, false]
      },
      showBought: false,
      divinities: 0,
      divinity: {
        divineMatter: DC.E1,
        divineEnergy: DC.D0,
        isProducingEnergy: false,
        condenses: DC.D0,
        divineStars: DC.D0,
        partCondensed: 0,
        supernovae: DC.D0,
        nebulae: DC.D0
      },
      divinityUpgrades: new Set(),
      divinityRebuyables: [0, 0, 0, 0],
      resurgenceUpgrades: new Set()
    },
    alpha: {
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      quotes: [],
      stage: 0,
      records: {
        antimatter: DC.E1,
        dimensions: {
          antimatter: Array.range(0, 9).map(() => ({
            bought: DC.D0,
            costBumps: DC.D0,
            amount: DC.D0
          })),
          infinity: Array.range(0, 9).map(tier => ({
            isUnlocked: false,
            bought: DC.D0,
            amount: DC.D0,
            cost: [DC.E8, DC.E9, DC.E10, DC.E20, DC.E140, DC.E200, DC.E250, DC.E280, new Decimal(Infinity)][tier],
            baseAmount: DC.D0
          })),
          time: Array.range(0, 9).map(tier => ({
            cost: [DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350, new Decimal(Infinity)][tier],
            amount: DC.D0,
            bought: DC.D0
          }))
        },
        buyUntil10: true,
        sacrificed: DC.D0,
        infinityUpgrades: new Set(),
        infinityRebuyables: [0, 0, 0],
        challenge: {
          normal: {
            current: 0,
            bestTimes: Array.repeat(DC.BEMAX, 11),
            completedBits: 0,
          },
          infinity: {
            current: 0,
            bestTimes: Array.repeat(DC.BEMAX, 8),
            completedBits: 0,
          },
          eternity: {
            current: 0,
            unlocked: 0,
            requirementBits: 0,
          }
        },
        infinity: {
          upgradeBits: 0
        },
        auto: {
          autobuyersOn: true,
          disableContinuum: false,
          eternity: {
            amount: DC.D1,
            increaseWithMult: true,
            time: 1,
            xHighest: DC.D1,
            isActive: false
          },
          bigCrunch: {
            cost: 1,
            interval: 150000,
            mode: 0,
            amount: DC.D1,
            increaseWithMult: true,
            time: 1,
            xHighest: DC.D1,
            isActive: true,
            lastTick: 0,
          },
          galaxy: {
            cost: 1,
            interval: 20000,
            limitGalaxies: false,
            maxGalaxies: 1,
            buyMax: false,
            buyMaxInterval: 0,
            isActive: true,
            lastTick: 0
          },
          dimBoost: {
            cost: 1,
            interval: 4000,
            limitDimBoosts: false,
            maxDimBoosts: 1,
            limitUntilGalaxies: false,
            galaxies: 10,
            buyMaxInterval: 0,
            isActive: true,
            lastTick: 0
          },
          tickspeed: {
            isUnlocked: false,
            cost: 1,
            interval: 500,
            mode: AUTOBUYER_MODE.BUY_SINGLE,
            isActive: true,
            lastTick: 0,
            isBought: false
          },
          sacrifice: {
            multiplier: DC.D2,
            isActive: true
          },
          antimatterDims: {
            all: Array.range(0, 8).map(tier => ({
              isUnlocked: false,
              cost: 1,
              interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
              bulk: 1,
              mode: AUTOBUYER_MODE.BUY_10,
              isActive: true,
              lastTick: 0,
              isBought: false
            })),
            isActive: true,
          },
          infinityDims: {
            all: Array.range(0, 8).map(() => ({
              isActive: false,
              lastTick: 0,
            })),
            isActive: true,
          },
          replicantiGalaxies: {
            isActive: false,
          },
          replicantiUpgrades: {
            all: Array.range(0, 3).map(() => ({
              isActive: false,
              lastTick: 0,
            })),
            isActive: true,
          },
          ipMultBuyer: { isActive: false, },
        },
        infinityPoints: DC.D0,
        infinities: DC.D0,
        infinitiesBanked: DC.D0,
        dimensionBoosts: DC.D0,
        galaxies: DC.D0,
        chall2Pow: 1,
        chall3Pow: DC.D0_01,
        matter: DC.D1,
        chall9TickspeedCostBumps: DC.D0,
        chall8TotalSacrifice: DC.D1,
        ic2Count: 0,
        partInfinityPoint: DC.D0,
        partInfinitied: 0,
        break: false,
        requirementChecks: {
          infinity: {
            maxAll: false,
            noSacrifice: true,
            noAD8: true,
          },
          eternity: {
            onlyAD1: true,
            onlyAD8: true,
            noAD1: true,
            noRG: true,
          }
        },
        records: {
          totalTimePlayed: DC.D0,
          totalEndgameAntimatter: DC.E1,
          totalRealityAntimatter: DC.E1,
          totalEternityAntimatter: DC.E1,
          totalInfinityAntimatter: DC.E1,
          recentInfinities: Array.range(0, 10).map(() =>
            [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, ""]),
          recentEternities: Array.range(0, 10).map(() =>
            [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]),
          thisInfinity: {
            time: DC.D0,
            realTime: 0,
            lastBuyTime: DC.D0,
            maxAM: DC.D0,
            bestIPmin: DC.D0,
            bestIPminVal: DC.D0,
          },
          bestInfinity: {
            time: DC.BEMAX,
            realTime: Number.MAX_VALUE,
            bestIPminEternity: DC.D0,
            bestIPminReality: DC.D0,
          },
          thisEternity: {
            time: DC.D0,
            realTime: 0,
            maxAM: DC.D0,
            maxIP: DC.D0,
            bestIPMsWithoutMaxAll: DC.D0,
            bestEPmin: DC.D0,
            bestEPminVal: DC.D0,
            bestInfinitiesPerMs: DC.D0,
          },
          bestEternity: {
            time: DC.BEMAX,
            realTime: Number.MAX_VALUE,
            bestEPminReality: DC.D0,
          },
          thisReality: {
            time: DC.D0,
            realTime: 0,
            maxAM: DC.D0,
            maxIP: DC.D0,
            maxEP: DC.D0,
            bestEternitiesPerMs: DC.D0,
            maxReplicanti: DC.D0,
            maxDT: DC.D0,
            bestRSmin: DC.D0,
            bestRSminVal: DC.D0,
            galaxies: DC.D0,
          },
        },
        IPMultPurchases: DC.D0,
        infinityPower: DC.D1,
        postC4Tier: 0,
        eternityPoints: DC.D0,
        eternities: DC.D0,
        eternityUpgrades: new Set(),
        epmultUpgrades: DC.D0,
        timeShards: DC.D0,
        totalTickGained: DC.D0,
        totalTickBought: DC.D0,
        replicanti: {
          unl: false,
          amount: DC.D0,
          chance: DC.D1.div(100),
          chanceCost: DC.E150,
          interval: DC.E3,
          intervalCost: DC.E140,
          boughtGalaxyCap: DC.D0,
          galaxies: DC.D0,
          galCost: DC.E170,
        },
        timestudy: {
          theorem: DC.D0,
          maxTheorem: DC.D0,
          amBought: DC.D0,
          ipBought: DC.D0,
          epBought: DC.D0,
          studies: [],
        },
        eternityChalls: {},
        respec: false,
        eterc8ids: 50,
        eterc8repl: 40,
        dilation: {
          studies: [],
          active: false,
          tachyonParticles: DC.D0,
          dilatedTime: DC.D0,
          nextThreshold: DC.E3,
          baseTachyonGalaxies: DC.D0,
          totalTachyonGalaxies: DC.D0,
          upgrades: new Set(),
          rebuyables: {
            1: 0,
            2: 0,
            3: 0,
            11: 0,
            12: 0,
            13: 0,
          },
          lastEP: DC.DM1,
        }
      }
    },
    slabdrill: {
      isWarping: false,
      warpTick: 0,
      isCursed: false,
      unlockBits: 0,
      quoteBits: 0,
      quotes: [],
      stage: 0,
      serpentinePower: DC.D0,
      isGoodbye: false,
      goodbyeTick: 0,
      isDestroyed: false,
      hasBoughtNinthDimension: false,
      core: {
        isActive: false,
        chaosCores: 0,
        lastFound: Date.now()
      },
      records: {
        antimatter: DC.E1,
        dimensions: {
          antimatter: Array.range(0, 8).map(() => ({
            bought: DC.D0,
            costBumps: DC.D0,
            amount: DC.D0
          })),
          infinity: Array.range(0, 8).map(tier => ({
            isUnlocked: false,
            bought: DC.D0,
            amount: DC.D0,
            cost: [DC.E8, DC.E9, DC.E10, DC.E20, DC.E140, DC.E200, DC.E250, DC.E280, new Decimal(Infinity)][tier],
            baseAmount: DC.D0
          })),
          time: Array.range(0, 8).map(tier => ({
            cost: [DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350, new Decimal(Infinity)][tier],
            amount: DC.D0,
            bought: DC.D0
          }))
        },
        buyUntil10: true,
        sacrificed: DC.D0,
        infinityUpgrades: new Set(),
        infinityRebuyables: [0, 0, 0],
        challenge: {
          normal: {
            current: 0,
            bestTimes: Array.repeat(DC.BEMAX, 11),
            completedBits: 0,
          },
          infinity: {
            current: 0,
            bestTimes: Array.repeat(DC.BEMAX, 8),
            completedBits: 0,
          },
          eternity: {
            current: 0,
            unlocked: 0,
            requirementBits: 0,
          }
        },
        infinity: {
          upgradeBits: 0
        },
        auto: {
          autobuyersOn: true,
          disableContinuum: false,
          eternity: {
            amount: DC.D1,
            increaseWithMult: true,
            time: 1,
            xHighest: DC.D1,
            isActive: false
          },
          bigCrunch: {
            cost: 1,
            interval: 150000,
            mode: 0,
            amount: DC.D1,
            increaseWithMult: true,
            time: 1,
            xHighest: DC.D1,
            isActive: true,
            lastTick: 0,
          },
          galaxy: {
            cost: 1,
            interval: 20000,
            limitGalaxies: false,
            maxGalaxies: 1,
            buyMax: false,
            buyMaxInterval: 0,
            isActive: true,
            lastTick: 0
          },
          dimBoost: {
            cost: 1,
            interval: 4000,
            limitDimBoosts: false,
            maxDimBoosts: 1,
            limitUntilGalaxies: false,
            galaxies: 10,
            buyMaxInterval: 0,
            isActive: true,
            lastTick: 0
          },
          tickspeed: {
            isUnlocked: false,
            cost: 1,
            interval: 500,
            mode: AUTOBUYER_MODE.BUY_SINGLE,
            isActive: true,
            lastTick: 0,
            isBought: false
          },
          sacrifice: {
            multiplier: DC.D2,
            isActive: true
          },
          antimatterDims: {
            all: Array.range(0, 8).map(tier => ({
              isUnlocked: false,
              cost: 1,
              interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
              bulk: 1,
              mode: AUTOBUYER_MODE.BUY_10,
              isActive: true,
              lastTick: 0,
              isBought: false
            })),
            isActive: true,
          },
          infinityDims: {
            all: Array.range(0, 8).map(() => ({
              isActive: false,
              lastTick: 0,
            })),
            isActive: true,
          },
          replicantiGalaxies: {
            isActive: false,
          },
          replicantiUpgrades: {
            all: Array.range(0, 3).map(() => ({
              isActive: false,
              lastTick: 0,
            })),
            isActive: true,
          },
          ipMultBuyer: { isActive: false, },
        },
        infinityPoints: DC.D0,
        infinities: DC.D0,
        infinitiesBanked: DC.D0,
        dimensionBoosts: DC.D0,
        galaxies: DC.D0,
        chall2Pow: 1,
        chall3Pow: DC.D0_01,
        matter: DC.D1,
        chall9TickspeedCostBumps: DC.D0,
        chall8TotalSacrifice: DC.D1,
        ic2Count: 0,
        partInfinityPoint: DC.D0,
        partInfinitied: 0,
        break: false,
        requirementChecks: {
          infinity: {
            maxAll: false,
            noSacrifice: true,
            noAD8: true,
          },
          eternity: {
            onlyAD1: true,
            onlyAD8: true,
            noAD1: true,
            noRG: true,
          }
        },
        records: {
          totalTimePlayed: DC.D0,
          totalEndgameAntimatter: DC.E1,
          totalRealityAntimatter: DC.E1,
          totalEternityAntimatter: DC.E1,
          totalInfinityAntimatter: DC.E1,
          recentInfinities: Array.range(0, 10).map(() =>
            [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, ""]),
          recentEternities: Array.range(0, 10).map(() =>
            [DC.BEMAX, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]),
          thisInfinity: {
            time: DC.D0,
            realTime: 0,
            lastBuyTime: DC.D0,
            maxAM: DC.D0,
            bestIPmin: DC.D0,
            bestIPminVal: DC.D0,
          },
          bestInfinity: {
            time: DC.BEMAX,
            realTime: Number.MAX_VALUE,
            bestIPminEternity: DC.D0,
            bestIPminReality: DC.D0,
          },
          thisEternity: {
            time: DC.D0,
            realTime: 0,
            maxAM: DC.D0,
            maxIP: DC.D0,
            bestIPMsWithoutMaxAll: DC.D0,
            bestEPmin: DC.D0,
            bestEPminVal: DC.D0,
            bestInfinitiesPerMs: DC.D0,
          },
          bestEternity: {
            time: DC.BEMAX,
            realTime: Number.MAX_VALUE,
            bestEPminReality: DC.D0,
          },
          thisReality: {
            time: DC.D0,
            realTime: 0,
            maxAM: DC.D0,
            maxIP: DC.D0,
            maxEP: DC.D0,
            bestEternitiesPerMs: DC.D0,
            maxReplicanti: DC.D0,
            maxDT: DC.D0,
            bestRSmin: DC.D0,
            bestRSminVal: DC.D0,
            galaxies: DC.D0,
          },
        },
        IPMultPurchases: DC.D0,
        infinityPower: DC.D1,
        postC4Tier: 0,
        eternityPoints: DC.D0,
        eternities: DC.D0,
        eternityUpgrades: new Set(),
        epmultUpgrades: DC.D0,
        timeShards: DC.D0,
        totalTickGained: DC.D0,
        totalTickBought: DC.D0,
        replicanti: {
          unl: false,
          amount: DC.D0,
          chance: DC.D1.div(100),
          chanceCost: DC.E150,
          interval: DC.E3,
          intervalCost: DC.E140,
          boughtGalaxyCap: DC.D0,
          galaxies: DC.D0,
          galCost: DC.E170,
        },
        timestudy: {
          theorem: DC.D0,
          maxTheorem: DC.D0,
          amBought: DC.D0,
          ipBought: DC.D0,
          epBought: DC.D0,
          studies: [],
        },
        eternityChalls: {},
        respec: false,
        eterc8ids: 50,
        eterc8repl: 40,
        dilation: {
          studies: [],
          active: false,
          tachyonParticles: DC.D0,
          dilatedTime: DC.D0,
          nextThreshold: DC.E3,
          baseTachyonGalaxies: DC.D0,
          totalTachyonGalaxies: DC.D0,
          upgrades: new Set(),
          rebuyables: {
            1: 0,
            2: 0,
            3: 0,
            11: 0,
            12: 0,
            13: 0,
          },
          lastEP: DC.DM1,
        }
      }
    }
  },
  endgames: 0,
  endgame: {
    celestialPoints: DC.D0,
    doomedParticles: DC.D0,
    celestialMatter: DC.D0,
    unnerfedCelestialMatter: DC.D0,
    celestialMatterMultiplier: {
      isActive: true
    },
    pelleDestruction: {
      achievements: new Set(),
      upgrades: new Set(),
      realityUpgrades: new Set(),
      imaginaryUpgrades: new Set(),
      celestials: new Set(),
      perks: new Set(),
      alchemy: new Set(),
      strikes: new Set()
    },
    respec: false,
    galacticPower: DC.D0,
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    upgradeBits: 0,
    upgReqs: 0,
    reqLock: 0,
    partRealitied: DC.D0,
    partEndgamed: 0,
    expansionPacks: {
      areUnlocked: false,
      boughtPacks: new Set()
    },
    ethereal: {
      power: DC.D0,
      sector: 1,
      isExtended: false,
      stars: {
        red: DC.D0,
        orange: DC.D0,
        yellow: DC.D0,
        green: DC.D0,
        blue: DC.D0,
        purple: DC.D0,
        white: DC.D0,
        black: DC.D0,
        gray: DC.D0
      },
      isStarPowerUnlocked: false,
      starPower: DC.D0
    },
    hypercubes: {
      penteracts: 0,
      hexeracts: 0,
      hepteracts: 0,
      octeracts: 0
    },
    celDimExpansion: {
      softcapsCollapsed: false,
      totalTickBought: DC.D0,
      dimBoosts: DC.D0,
      galaxies: DC.D0,
      celestialInfinities: DC.D0,
      celestialInfinityPoints: DC.D0,
      celestialInfinityUpgrades: new Set(),
      cipMultUpgrades: DC.D0,
      partCelestialInfinityPoint: DC.D0,
      partCelestialInfinitied: 0,
      isBreakUnlocked: false,
      isBroken: false,
      celestialInfinityRebuyables: [0, 0, 0, 0, 0, 0],
      celestialEternities: DC.D0,
      celestialEternityPoints: DC.D0,
      celestialEternityUpgrades: new Set(),
      cepMultUpgrades: DC.D0,
      celestialEternityRebuyables: [0, 0, 0],
      celestialEternityPlusUpgrades: new Set()
    },
    largeHadronCollider: {
      accelerators: {
        potency: {
          fill: 0,
          active: false
        },
        emptiness: {
          fill: 0,
          active: false
        },
        cosmic: {
          fill: 0,
          active: false
        }
      },
      powerCores: 1,
      void: {
        isRunning: false,
        highestAntimatter: DC.E1,
        nullMatter: DC.D0,
        upgrades: new Set(),
        rebuyables: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        nullified: false,
        nullParticles: DC.D0,
        mode: 0
      }
    },
    ascension: 0,
    ascensionTimer: 0,
    overcharge: {
      isRunning: false,
      level: 1,
      completions: {
        bi: 0,
        eter: 0,
        chall: 0,
        ts: 0
      },
      charged: {
        infinite: new Set(),
        eternal: new Set(),
        complex: new Set(),
        temporal: new Set()
      },
      chargesLeft: {
        infinite: 0,
        eternal: 0,
        temporal: 0
      },
      discharge: {
        infinite: false,
        eternal: false,
        temporal: false
      },
      allowComplex: true
    },
    credits: false,
    creditsTick: 0,
    fullCompletions: 0
  },
  endgameMasteries: {
    skills: DC.D0,
    maxSkills: DC.D0,
    ggBought: 0,
    cpBought: 0,
    dpBought: 0,
    masteries: [],
    shopMinimized: false,
    preferredPaths: [[], [], []],
    presets: new Array(6).fill({
      name: "",
      masteries: "",
    }),
    permanentMasteries: [],
  },
  compression: {
    active: false,
    hawkingRadiation: DC.D0,
    thermalRadiation: DC.D0,
    nextThreshold: DC.E3,
    baseElectromagneticWaves: DC.D0,
    totalElectromagneticWaves: DC.D0,
    upgrades: new Set(),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
    }
  },
  universes: {
    current: 0,
    highestTransientAntimatter: DC.E1,
    relativisticParticles: DC.D0,
    ephemeralLight: DC.D0,
    highestTangibleMatter: DC.E1,
    molecularMass: DC.D0,
    stellarAugmenters: DC.D0
  },
  expanse: {
    elemental: {
      quoteBits: 0,
      quotes: [],
    },
  },
  isGameEnd: false,
  tabNotifications: new Set(),
  triggeredTabNotificationBits: 0,
  triggeredNotifications: [],
  tutorialState: 0,
  tutorialActive: true,
  options: {
    hasSeenUsernameModal: false,
    news: {
      enabled: true,
      repeatBuffer: 40,
      AIChance: 0,
      ENDChance: 0.5,
      StoryChance: 0,
      MatureChance: 0,
      speed: 1,
      includeAnimated: true,
    },
    notation: "Mixed scientific",
    lnotation: "Stacked Scientific",
    notationDigits: {
      comma: 5,
      notation: 9
    },
    sidebarResourceID: 0,
    retryChallenge: false,
    retryCelestial: false,
    showAllChallenges: false,
    cloudEnabled: true,
    hideGoogleName: false,
    showCloudModal: true,
    forceCloudOverwrite: false,
    syncSaveIntervals: true,
    hotkeys: true,
    themeClassic: "Normal",
    themeModern: "Normal",
    updateRate: 33,
    newUI: true,
    offlineProgress: true,
    loadBackupWithoutOffline: false,
    automaticTabSwitching: false,
    respecIntoProtected: false,
    offlineTicks: 1e5,
    hibernationCatchup: true,
    statTabResources: 0,
    multiplierTab: {
      currTab: 0,
      showAltGroup: false,
      replacePowers: false,
    },
    autosaveInterval: 30000,
    showTimeSinceSave: true,
    saveFileName: "",
    exportedFileCount: 0,
    hideCompletedAchievementRows: false,
    glyphTextColors: true,
    headerTextColored: false,
    showNewGlyphIcon: true,
    showUnequippedGlyphIcon: true,
    highContrastRarity: false,
    swapGlyphColors: false,
    hideAlterationEffects: false,
    ignoreGlyphEffects: true,
    ignoreGlyphLevel: true,
    ignoreGlyphRarity: true,
    glyphBG: GLYPH_BG_SETTING.AUTO,
    glyphBorders: true,
    showHintText: {
      showPercentage: true,
      achievements: true,
      achievementUnlockStates: true,
      challenges: true,
      studies: true,
      glyphEffectDots: true,
      realityUpgrades: true,
      perks: true,
      alchemy: true,
      glyphInfoType: GlyphInfo.types.NONE,
      showGlyphInfoByDefault: false,
      masteries: true,
      breakEternityUpgrades: true,
      endgameUpgrades: true,
      divinityUpgrades: true,
      resurgenceUpgrades: true,
      nullUpgrades: true,
    },
    animations: {
      bigCrunch: true,
      eternity: true,
      dilation: true,
      tachyonParticles: true,
      reality: true,
      background: true,
      blobSnowflakes: 16,
      blobHole: false,
      stars: true,
      hadrons: true
    },
    confirmations: {
      doom: true,
      armageddon: true,
      sacrifice: true,
      challenges: true,
      exitChallenge: true,
      eternity: true,
      dilation: true,
      compression: true,
      overcharge: true,
      resetReality: true,
      resetEndgame: true,
      cursedCore: true,
      universes: true,
      glyphReplace: true,
      glyphSacrifice: true,
      autoClean: true,
      sacrificeAll: true,
      glyphSelection: true,
      glyphUndo: true,
      deleteGlyphSetSave: true,
      glyphRefine: true,
      bigCrunch: true,
      replicantiGalaxy: true,
      antimatterGalaxy: true,
      dimensionBoost: true,
      switchAutomatorMode: true,
      respecIAP: true
    },
    awayProgress: {
      antimatter: true,
      dimensionBoosts: true,
      antimatterGalaxies: true,
      infinities: true,
      infinityPoints: true,
      replicanti: true,
      replicantiGalaxies: true,
      eternities: true,
      eternityPoints: true,
      tachyonParticles: true,
      dilatedTime: true,
      tachyonGalaxies: true,
      timeTheorems: true,
      achievementCount: true,
      realities: true,
      realityMachines: true,
      imaginaryMachines: true,
      relicShards: true,
      darkMatter: true,
      darkEnergy: true,
      singularities: true,
      celestialMemories: true,
      blackHole: true,
      realityShards: true
    },
    hiddenTabBits: 0,
    hiddenSubtabBits: Array.repeat(0, 11),
    lastOpenTab: 0,
    lastOpenSubtab: Array.repeat(0, 11),
    perkLayout: 0,
    perkPhysicsEnabled: true,
    automatorEvents: {
      newestFirst: false,
      timestampType: 0,
      maxEntries: 200,
      clearOnReality: true,
      clearOnRestart: true,
    },
    invertTTgenDisplay: false,
    invertESgenDisplay: false,
    autoRealityForFilter: false,
    brightAlpha: false,
    simpleHotkeysCelestialMode: false,
  },
  IAP: {
    enabled: false,
    checkoutSession: {
      id: false,
    }
  },
  DEV: false
};

export const Player = {
  defaultStart: deepmergeAll([{}, player]),

  get isInMatterChallenge() {
    return NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning;
  },

  get isInAntimatterChallenge() {
    return NormalChallenge.isRunning || InfinityChallenge.isRunning;
  },

  get antimatterChallenge() {
    return NormalChallenge.current || InfinityChallenge.current;
  },

  get isInAnyChallenge() {
    return this.isInAntimatterChallenge || EternityChallenge.isRunning;
  },

  get anyChallenge() {
    return this.antimatterChallenge || EternityChallenge.current;
  },

  get canCrunch() {
    if (Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(NormalChallenge.current?.id)) return false;
    if (Alpha.isRunning && Alpha.currentStage < 3) return false;
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    const goal = (challenge === undefined) ? DC.NUMMAX : challenge.goal;
    return player.records.thisInfinity.maxAM.gte(goal);
  },

  get canEternity() {
    return player.records.thisEternity.maxIP.gte(Player.eternityGoal);
  },

  get bestRunIPPM() {
    return GameCache.bestRunIPPM.value;
  },

  get bestRunCIPPM() {
    return GameCache.bestRunCIPPM.value;
  },

  get bestRunVSPM() {
    return GameCache.bestRunVSPM.value;
  },

  get averageRealTimePerEternity() {
    return GameCache.averageRealTimePerEternity.value;
  },

  get tickSpeedMultDecrease() {
    return GameCache.tickSpeedMultDecrease.value;
  },

  get dimensionMultDecrease() {
    return GameCache.dimensionMultDecrease.value;
  },

  get celestialTickSpeedMultDecrease() {
    return GameCache.celestialTickSpeedMultDecrease.value;
  },

  get celestialDimensionMultDecrease() {
    return GameCache.celestialDimensionMultDecrease.value;
  },

  get divineDimensionMultDecrease() {
    return GameCache.divineDimensionMultDecrease.value;
  },

  get infinityGoal() {
    if (Alpha.isRunning && Alpha.currentStage < 3) return DC.E300;
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? DC.NUMMAX : challenge.goal;
  },

  get infinityLimit() {
    if (Alpha.isRunning && Alpha.currentStage < 3) return DC.E300;
    const trueHardcap = player.break2 ? (Pelle.isDoomed ? DC.ENUMMAX : LHC.breakingPoint) : DC.E9E15;
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? trueHardcap : challenge.goal;
  },

  get eternityGoal() {
    return EternityChallenge.isRunning
      ? EternityChallenge.current.currentGoal
      : requiredIPForEP(1);
  },

  get automatorUnlocked() {
    if (LHC.voidRunning && NullUpgrade.limerick5.isBought) return true;
    return (AutomatorPoints.totalPoints >= AutomatorPoints.pointsForAutomator || player.reality.automator.forceUnlock) && !player.disablePostReality;
  },

  resetRequirements(key) {
    const glyphCount = player.requirementChecks.reality.maxGlyphs;
    // This switch case intentionally falls through because every lower layer should be reset as well
    switch (key) {
      case "reality":
        player.requirementChecks.reality = {
          noAM: true,
          noTriads: true,
          noPurchasedTT: true,
          // Note that these two checks below are only used in row 2, which is in principle always before the "flow"
          // upgrades in row 3 which passively generate infinities/eternities. These upgrades won't cause a lockout
          // as these requirements are only invalidated on manual infinities or eternities.
          noInfinities: true,
          noEternities: true,
          noContinuum: player.auto.disableContinuum,
          maxID1: DC.D0,
          maxStudies: 0,
          // This only gets set to the correct value when Glyphs.updateMaxGlyphCount is called, which always happens
          // before this part of the code is reached in the Reality reset. Nevertheless, we want to keep its old value.
          maxGlyphs: glyphCount,
          slowestBH: BlackHoles.areNegative ? player.blackHoleNegative : 1,
          noCelMatter: !player.endgame.celestialMatterMultiplier.isActive,
        };
      // eslint-disable-next-line no-fallthrough
      case "eternity":
        player.requirementChecks.eternity = {
          onlyAD1: true,
          onlyAD8: true,
          noAD1: true,
          noRG: true,
        };
      // eslint-disable-next-line no-fallthrough
      case "infinity":
        player.requirementChecks.infinity = {
          maxAll: false,
          noSacrifice: true,
          noAD8: true,
        };
        break;
      default:
        throw Error("Unrecognized prestige layer for requirement reset");
    }
  }
};

export function guardFromNaNValues(obj) {
  function isObject(ob) {
    return ob !== null && typeof ob === "object" && !(ob instanceof Decimal);
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (key === "automator") continue;

    let value = obj[key];
    if (isObject(value)) {
      guardFromNaNValues(value);
      continue;
    }

    if (typeof value === "number") {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null) {
            throw new Error("Null numerical player property assignment");
          }
          if (newValue === undefined) {
            throw new Error("Undefined numerical player property assignment");
          }
          if (typeof newValue !== "number") {
            throw new Error("Non-Number assignment to Number player property");
          }
          if (!isFinite(newValue)) {
            throw new Error("NaN player property assignment (numerical overflow)");
          }
          value = newValue;
        }
      });
    }

    if (value instanceof Decimal) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null) {
            throw new Error("Null Decimal player property assignment");
          }
          if (newValue === undefined) {
            throw new Error("Undefined Decimal player property assignment");
          }
          if (!(newValue instanceof Decimal)) {
            throw new Error("Non-Decimal assignment to Decimal player property");
          }
          if (!isFinite(newValue.sign)) {
            throw new Error("NaN player property assignment (new decimal sign value) this usually means a log10 property has failed");
          }
          if (!isFinite(newValue.layer)) {
            throw new Error("NaN player property assignment (new decimal layer value) this usually means you exceeded Infinity");
          }
          if (!isFinite(newValue.mag)) {
            throw new Error("NaN player property assignment (new decimal mag value) this usually means Layer failed to work properly");
          }
          if (!isFinite(newValue.mantissa) && player.DEV) {
            console.log("NaN player property assignment (old decimal value) old log10 failed ignore this error");
          }
          if (!isFinite(newValue.exponent) && player.DEV) {
            console.log("NaN player property assignment (old decimal value) number exceeded ee308 on some end ignore this error");
          }
          value = newValue;
        }
      });
    }
  }
}
