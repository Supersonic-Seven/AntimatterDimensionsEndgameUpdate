import { cloneDeep } from "lodash";

window.PRESTIGE_EVENT = {
  DIMENSION_BOOST: 0,
  ANTIMATTER_GALAXY: 1,
  INFINITY: 2,
  ETERNITY: 3,
  REALITY: 4,
  ENDGAME: 5,
  CELESTIAL_INFINITY: 6,
  CELESTIAL_ETERNITY: 7,
  CONDENSE: 8,
  SUPERNOVA: 9
};

function deepFreeze(obj) {
  Object.keys(obj).forEach(prop => {
    const reference = obj[prop];
    if (typeof reference === "object") deepFreeze(reference);
  });
  return Object.freeze(obj);
}

window.DC = deepFreeze({
  // Naming Scheme:
  // D[0-9]: Decimal mantissa variable
  // _: decimal (.) part of the mantissa
  // E[0-9]: Decimal exponent variable
  // C: Calculation. D - .div, P - .pow

  /* eslint-disable key-spacing */
  DM1:                  new Decimal("-1"),
  D0:                   new Decimal("0"),

  D0_01:                new Decimal("0.01"),
  D0_1:                 new Decimal("0.1"),
  D0_4:                 new Decimal("0.4"),
  D0_55:                new Decimal("0.55"),
  D0_8446303389034288:  new Decimal("0.8446303389034288"),
  D0_95:                new Decimal("0.95"),
  D0_965:               new Decimal("0.965"),
  D1:                   new Decimal("1"),
  D1_0000109:           new Decimal("1.0000109"),
  D1_00038:             new Decimal("1.00038"),
  D1_0004:              new Decimal("1.0004"),
  D1_0025:              new Decimal("1.0025"),
  D1_005:               new Decimal("1.005"),
  D1_007:               new Decimal("1.007"),
  D1_02:                new Decimal("1.02"),
  D1_0285:              new Decimal("1.0285"),
  D1_2:                 new Decimal("1.2"),
  D1_3:                 new Decimal("1.3"),
  D2:                   new Decimal("2"),
  D3:                   new Decimal("3"),
  D4:                   new Decimal("4"),
  D5:                   new Decimal("5"),
  D6:                   new Decimal("6"),
  D6_66:                new Decimal("6.66"),
  D7:                   new Decimal("7"),
  D8:                   new Decimal("8"),
  D9:                   new Decimal("9"),
  D11:                  new Decimal("11"),
  D12:                  new Decimal("12"),
  D13:                  new Decimal("13"),
  D14:                  new Decimal("14"),
  D15:                  new Decimal("15"),
  D16:                  new Decimal("16"),
  D17:                  new Decimal("17"),
  D18:                  new Decimal("18"),
  D19:                  new Decimal("19"),
  D20:                  new Decimal("20"),
  D24:                  new Decimal("24"),
  D60:                  new Decimal("60"),
  D80:                  new Decimal("80"),
  D99:                  new Decimal("99"),
  D11111:               new Decimal("11111"),
  D3E4:                 new Decimal("30000"),
  D2E5:                 new Decimal("2e5"),
  D2E6:                 new Decimal("2e6"),
  D5E7:                 new Decimal("5e7"),
  D2E9:                 new Decimal("2e9"),
  D2E25:                new Decimal("2e25"),
  D2E22222:             new Decimal("2e22222"),
  D9_99999E999:         new Decimal("9.99999e999"),
  D9_9999E9999:         new Decimal("9.9999e9999"),

  // Calculations for precise numbers.
  C1D1_1245:                Decimal.div(1, 1.1245),
  D2P30D0_61:               Decimal.pow(2, 30 / 0.61),
  C2P30:                    Decimal.pow(2, 30),
  C2P140:                   Decimal.pow(2, 140),
  C2P1024:                  Decimal.pow(2, 1024),
  C10P16000D3:              Decimal.pow(10, 16000 / 3),

  // 1e1 is 10
  E1:                   new Decimal("1e1"),
  E2:                   new Decimal("1e2"),
  E3:                   new Decimal("1e3"),
  E4:                   new Decimal("1e4"),
  E5:                   new Decimal("1e5"),
  E6:                   new Decimal("1e6"),
  E7:                   new Decimal("1e7"),
  E8:                   new Decimal("1e8"),
  E9:                   new Decimal("1e9"),
  E10:                  new Decimal("1e10"),
  E12:                  new Decimal("1e12"),
  E15:                  new Decimal("1e15"),
  E20:                  new Decimal("1e20"),
  E21:                  new Decimal("1e21"),
  E25:                  new Decimal("1e25"),
  E28:                  new Decimal("1e28"),
  E29:                  new Decimal("1e29"),
  E30:                  new Decimal("1e30"),
  E31:                  new Decimal("1e31"),
  E36:                  new Decimal("1e36"),
  E40:                  new Decimal("1e40"),
  E45:                  new Decimal("1e45"),
  E50:                  new Decimal("1e50"),
  E55:                  new Decimal("1e55"),
  E58:                  new Decimal("1e58"),
  E60:                  new Decimal("1e60"),
  E63:                  new Decimal("1e63"),
  E70:                  new Decimal("1e70"),
  E75:                  new Decimal("1e75"),
  E80:                  new Decimal("1e80"),
  E90:                  new Decimal("1e90"),
  E100:                 new Decimal("1e100"),
  E130:                 new Decimal("1e130"),
  E140:                 new Decimal("1e140"),
  E150:                 new Decimal("1e150"),
  E160:                 new Decimal("1e160"),
  E170:                 new Decimal("1e170"),
  E175:                 new Decimal("1e175"),
  E200:                 new Decimal("1e200"),
  E220:                 new Decimal("1e220"),
  E235:                 new Decimal("1e235"),
  E250:                 new Decimal("1e250"),
  E260:                 new Decimal("1e260"),
  E280:                 new Decimal("1e280"),
  E300:                 new Decimal("1e300"),
  E308:                 new Decimal("1e308"),
  E309:                 new Decimal("1e309"),
  E310:                 new Decimal("1e310"),
  E315:                 new Decimal("1e315"),
  E320:                 new Decimal("1e320"),
  E349:                 new Decimal("1e349"),
  E400:                 new Decimal("1e400"),
  E420:                 new Decimal("1e420"),
  E450:                 new Decimal("1e450"),
  E500:                 new Decimal("1e500"),
  E530:                 new Decimal("1e530"),
  E550:                 new Decimal("1e550"),
  E580:                 new Decimal("1e580"),
  E600:                 new Decimal("1e600"),
  E616:                 new Decimal("1e616"),
  E650:                 new Decimal("1e650"),
  E675:                 new Decimal("1e675"),
  E700:                 new Decimal("1e700"),
  E750:                 new Decimal("1e750"),
  E775:                 new Decimal("1e775"),
  E800:                 new Decimal("1e800"),
  E850:                 new Decimal("1e850"),
  E860:                 new Decimal("1e860"),
  E900:                 new Decimal("1e900"),
  E925:                 new Decimal("1e925"),
  E950:                 new Decimal("1e950"),
  E975:                 new Decimal("1e975"),
  E1000:                new Decimal("1e1000"),
  E1050:                new Decimal("1e1050"),
  E1100:                new Decimal("1e1100"),
  E1150:                new Decimal("1e1150"),
  E1200:                new Decimal("1e1200"),
  E1250:                new Decimal("1e1250"),
  E1300:                new Decimal("1e1300"),
  E1400:                new Decimal("1e1400"),
  E1500:                new Decimal("1e1500"),
  E1600:                new Decimal("1e1600"),
  E1620:                new Decimal("1e1620"),
  E1640:                new Decimal("1e1640"),
  E1650:                new Decimal("1e1650"),
  E1700:                new Decimal("1e1700"),
  E1750:                new Decimal("1e1750"),
  E1800:                new Decimal("1e1800"),
  E1900:                new Decimal("1e1900"),
  E2000:                new Decimal("1e2000"),
  E2125:                new Decimal("1e2125"),
  E2200:                new Decimal("1e2200"),
  E2350:                new Decimal("1e2350"),
  E2400:                new Decimal("1e2400"),
  E2500:                new Decimal("1e2500"),
  E2600:                new Decimal("1e2600"),
  E2650:                new Decimal("1e2650"),
  E2700:                new Decimal("1e2700"),
  E2750:                new Decimal("1e2750"),
  E2800:                new Decimal("1e2800"),
  E2900:                new Decimal("1e2900"),
  E3000:                new Decimal("1e3000"),
  E3150:                new Decimal("1e3150"),
  E3200:                new Decimal("1e3200"),
  E3350:                new Decimal("1e3350"),
  E3500:                new Decimal("1e3500"),
  E3600:                new Decimal("1e3600"),
  E4000:                new Decimal("1e4000"),
  E4200:                new Decimal("1e4200"),
  E4500:                new Decimal("1e4500"),
  E4750:                new Decimal("1e4750"),
  E5000:                new Decimal("1e5000"),
  E5500:                new Decimal("1e5500"),
  E6000:                new Decimal("1e6000"),
  E6500:                new Decimal("1e6500"),
  E6666:                new Decimal("1e6666"),
  E7000:                new Decimal("1e7000"),
  E7250:                new Decimal("1e7250"),
  E7500:                new Decimal("1e7500"),
  E8000:                new Decimal("1e8000"),
  E8400:                new Decimal("1e8400"),
  E9000:                new Decimal("1e9000"),
  E9600:                new Decimal("1e9600"),
  E10000:               new Decimal("1e10000"),
  E10500:               new Decimal("1e10500"),
  E11000:               new Decimal("1e11000"),
  E11111:               new Decimal("1e11111"),
  E11200:               new Decimal("1e11200"),
  E12000:               new Decimal("1e12000"),
  E12500:               new Decimal("1e12500"),
  E13000:               new Decimal("1e13000"),
  E13500:               new Decimal("1e13500"),
  E14000:               new Decimal("1e14000"),
  E15000:               new Decimal("1e15000"),
  E15750:               new Decimal("1e15750"),
  E16000:               new Decimal("1e16000"),
  E16500:               new Decimal("1e16500"),
  E17000:               new Decimal("1e17000"),
  E17500:               new Decimal("1e17500"),
  E18000:               new Decimal("1e18000"),
  E18750:               new Decimal("1e18750"),
  E20000:               new Decimal("1e20000"),
  E21750:               new Decimal("1e21750"),
  E22500:               new Decimal("1e22500"),
  E23000:               new Decimal("1e23000"),
  E25000:               new Decimal("1e25000"),
  E27000:               new Decimal("1e27000"),
  E28000:               new Decimal("1e28000"),
  E30000:               new Decimal("1e30000"),
  E45000:               new Decimal("1e45000"),
  E54000:               new Decimal("1e54000"),
  E60000:               new Decimal("1e60000"),
  E100000:              new Decimal("1e100000"),
  E110000:              new Decimal("1e110000"),
  E164000:              new Decimal("1e164000"),
  E200000:              new Decimal("1e200000"),
  E201600:              new Decimal("1e201600"),
  E208000:              new Decimal("1e208000"),
  E210000:              new Decimal("1e210000"),
  E220000:              new Decimal("1e220000"),
  E300000:              new Decimal("1e300000"),
  E320000:              new Decimal("1e320000"),
  E400000:              new Decimal("1e400000"),
  E500000:              new Decimal("1e500000"),
  E600000:              new Decimal("1e600000"),
  E610000:              new Decimal("1e610000"),
  E1E6:                 new Decimal("1e1000000"),
  E2E6:                 new Decimal("1e2000000"),
  E2_5E6:               new Decimal("1e2500000"),
  E3E6:                 new Decimal("1e3000000"),
  E6E6:                 new Decimal("1e6000000"),
  E1E7:                 new Decimal("1e10000000"),
  E2E7:                 new Decimal("1e20000000"),
  E4E7:                 new Decimal("1e40000000"),
  E6E7:                 new Decimal("1e60000000"),
  E1E8:                 new Decimal("1e100000000"),
  E1E9:                 new Decimal("1e1000000000"),
  E1E12:                new Decimal("1e1000000000000"),
  E1_5E12:              new Decimal("1e1500000000000"),
  E1E15:                new Decimal("1e1000000000000000"),
  E9E15:                new Decimal("1e9000000000000000"),

  //Hardcoded post-e9e15 values to be reformatted later
  E9E115:               Decimal.pow(10, 9e115),
  E1E300:               Decimal.pow(10, 1e300),
  ENUMMAX:              Decimal.pow(10, Number.MAX_VALUE),

  // Special case values
  NUMSAFE:              new Decimal(Number.MAX_SAFE_INTEGER),
  NUMMAX:               new Decimal(Number.MAX_VALUE),
  BIMAX:                new Decimal("e9e15"),
  BEMAX:                new Decimal("10^^9000000000000000")
});

window.AUTOBUYER_MODE = {
  BUY_SINGLE: 1,
  BUY_10: 10,
  BUY_MAX: 100,
};

window.AUTO_CRUNCH_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_HIGHEST: 2
};

window.AUTO_CELESTIAL_CRUNCH_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_HIGHEST: 2
};

window.AUTO_ETERNITY_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_HIGHEST: 2
};

window.AUTO_CELESTIAL_ETERNITY_MODE = {
  AMOUNT: 0,
  TIME: 1,
  X_HIGHEST: 2
};

window.AUTO_REALITY_MODE = {
  RM: 0,
  GLYPH: 1,
  EITHER: 2,
  BOTH: 3,
  TIME: 4,
  RELIC_SHARD: 5,
};

window.AUTO_ENDGAME_MODE = {
  AMOUNTCP: 0,
  AMOUNTDP: 1,
  TIME: 2,
  X_HIGHEST_CP: 3,
  X_HIGHEST_DP: 4
};

window.RECENT_PRESTIGE_RESOURCE = {
  ABSOLUTE_GAIN: 0,
  RATE: 1,
  CURRENCY: 2,
  PRESTIGE_COUNT: 3,
};

// Free tickspeed multiplier with TS171. Shared here because formatting glyph effects depends on it
window.TS171_MULTIPLIER = 1.25;

// Used as drag and drop data type
window.GLYPH_MIME_TYPE = "text/x-ivark-glyph";

// These need to be in descending order for searching over them to work trivially, and all need to be hex codes
// in order for reality glyph color parsing to work properly in the cosmetic handler
window.GlyphRarities = [
  {
    minStrength: 8.5,
    name: "Perfect",
    darkColor: "#800000",
    lightColor: "#800000",
    darkHighContrast: "#900000",
    lightHighContrast: "#a00000"
  }, {
    minStrength: 6,
    name: "Superlunary",
    darkColor: "#c0c040",
    lightColor: "#c0c040",
    darkHighContrast: "#e0e060",
    lightHighContrast: "#ffff80"
  }, {
    minStrength: 5.375,
    name: "Sublime",
    darkColor: "#20c0a0",
    lightColor: "#20c0a0",
    darkHighContrast: "#00e0a0",
    lightHighContrast: "#00ffc0"
  }, {
    minStrength: 4.75,
    name: "Empyrean",
    darkColor: "#c03000",
    lightColor: "#c03000",
    darkHighContrast: "#e03800",
    lightHighContrast: "#ff4000"
  }, {
    minStrength: 4.125,
    name: "Elysian",
    darkColor: "#8020a0",
    lightColor: "#8020a0",
    darkHighContrast: "#a000a0",
    lightHighContrast: "#800080"
  }, {
    minStrength: 3.5,
    name: "Celestial",
    darkColor: "#3d3dec",
    lightColor: "#9696ff",
    darkHighContrast: "#ffff00",
    lightHighContrast: "#c0c000"
  }, {
    minStrength: 3.25,
    name: "Transcendent",
    darkColor: "#03ffec",
    lightColor: "#00c3c3",
    darkHighContrast: "#00ffff",
    lightHighContrast: "#00c0c0"
  }, {
    minStrength: 3,
    name: "Mythical",
    darkColor: "#d50000",
    lightColor: "#d50000",
    darkHighContrast: "#c00000",
    lightHighContrast: "#ff0000"
  }, {
    minStrength: 2.75,
    name: "Legendary",
    darkColor: "#ff9800",
    lightColor: "#d68100",
    darkHighContrast: "#ff8000",
    lightHighContrast: "#ff8000"
  }, {
    minStrength: 2.5,
    name: "Epic",
    darkColor: "#9c27b0",
    lightColor: "#9c27b0",
    darkHighContrast: "#ff00ff",
    lightHighContrast: "#ff00ff"
  }, {
    minStrength: 2,
    name: "Rare",
    darkColor: "#5096f3",
    lightColor: "#0d40ff",
    darkHighContrast: "#6060ff",
    lightHighContrast: "#0000ff"
  }, {
    minStrength: 1.5,
    name: "Uncommon",
    darkColor: "#43a047",
    lightColor: "#1e8622",
    darkHighContrast: "#00ff00",
    lightHighContrast: "#00b000"
  }, {
    minStrength: 1,
    name: "Common",
    darkColor: "#ffffff",
    lightColor: "#000000",
    darkHighContrast: "#ffffff",
    lightHighContrast: "#000000"
  },
];

window.GLYPH_BG_SETTING = {
  AUTO: 0,
  LIGHT: 1,
  DARK: 2,
};

window.GLYPH_TYPES = [
  "power",
  "infinity",
  "replication",
  "time",
  "dilation",
  "effarig",
  "reality",
  "cursed",
  "companion"
];

window.BASIC_GLYPH_TYPES = [
  "power",
  "infinity",
  "replication",
  "time",
  "dilation"
];

window.ALCHEMY_BASIC_GLYPH_TYPES = [
  "power",
  "infinity",
  "replication",
  "time",
  "dilation",
  "effarig"
];

window.GLYPH_SYMBOLS = {
  power: "Ω",
  infinity: "∞",
  replication: "Ξ",
  time: "Δ",
  dilation: "Ψ",
  effarig: "Ϙ",
  reality: "Ϟ",
  cursed: "⸸",
  companion: "♥"
};

window.CANCER_GLYPH_SYMBOLS = {
  power: "⚡",
  infinity: "8",
  replication: "⚤",
  time: "🕟",
  dilation: "☎",
  effarig: "🦒",
  reality: "⛧",
  cursed: "☠",
  companion: "³"
};

window.ALTERATION_TYPE = {
  ADDITION: 1,
  EMPOWER: 2,
  BOOST: 3
};

window.BLACK_HOLE_PAUSE_MODE = {
  NO_PAUSE: 0,
  PAUSE_BEFORE_BH1: 1,
  PAUSE_BEFORE_BH2: 2,
};

window.GLYPH_SIDEBAR_MODE = {
  INVENTORY_MANAGEMENT: 0,
  FILTER_SETTINGS: 1,
  SAVED_SETS: 2,
  SACRIFICE_TYPE: 3,
};

window.AUTO_SORT_MODE = {
  NONE: 0,
  LEVEL: 1,
  POWER: 2,
  EFFECT: 3,
  SCORE: 4
};

window.AUTO_GLYPH_SCORE = {
  LOWEST_SACRIFICE: 0,
  EFFECT_COUNT: 1,
  RARITY_THRESHOLD: 2,
  SPECIFIED_EFFECT: 3,
  EFFECT_SCORE: 4,
  LOWEST_ALCHEMY: 5,
  ALCHEMY_VALUE: 6
};

window.AUTO_GLYPH_REJECT = {
  SACRIFICE: 0,
  REFINE: 1,
  REFINE_TO_CAP: 2,
};

window.TIME_STUDY_PATH = {
  NONE: 0,
  ANTIMATTER_DIM: 1,
  INFINITY_DIM: 2,
  TIME_DIM: 3,
  ACTIVE: 4,
  PASSIVE: 5,
  IDLE: 6,
  LIGHT: 7,
  DARK: 8
};

window.TIME_STUDY_TYPE = {
  NORMAL: 0,
  ETERNITY_CHALLENGE: 1,
  DILATION: 2,
  TRIAD: 3
};

window.TS_REQUIREMENT_TYPE = {
  AT_LEAST_ONE: 0,
  ALL: 1,
  DIMENSION_PATH: 2,
};

window.ENDGAME_MASTERY_PATH = {
  NONE: 0,
  ANTIMATTER_DIM_COMPRESSION: 1,
  INFINITY_DIM_COMPRESSION: 2,
  TIME_DIM_COMPRESSION: 3,
  CELESTIAL_DIM_COMPRESSION: 4,
  INFINITY_POINTS: 5,
  ETERNITY_POINTS: 6,
  REALITY_MACHINES: 7,
  IMAGINARY_MACHINES: 8,
  ENDGAME_ENTANGLEMENT: 9,
  CELESTIAL_ENTANGLEMENT: 10,
  DIVINE_ENTANGLEMENT: 11
};

window.ENDGAME_MASTERY_TYPE = {
  NORMAL: 0,
  PERMANENT: 1
};

window.EM_REQUIREMENT_TYPE = {
  AT_LEAST_ONE: 0,
  ALL: 1,
  COMPRESSION_PATH: 2,
  CURRENCY_PATH: 3,
  EXPANDED: 4,
  ENTANGLEMENT: 5
};

window.ALCHEMY_RESOURCE = {
  POWER: 0,
  INFINITY: 1,
  TIME: 2,
  REPLICATION: 3,
  DILATION: 4,
  CARDINALITY: 5,
  ETERNITY: 6,
  DIMENSIONALITY: 7,
  INFLATION: 8,
  ALTERNATION: 9,
  EFFARIG: 10,
  SYNERGISM: 11,
  MOMENTUM: 12,
  DECOHERENCE: 13,
  EXPONENTIAL: 14,
  FORCE: 15,
  UNCOUNTABILITY: 16,
  BOUNDLESS: 17,
  MULTIVERSAL: 18,
  UNPREDICTABILITY: 19,
  REALITY: 20
};

window.SINGULARITY_MILESTONE_RESOURCE = {
  SINGULARITIES: 0,
  CONDENSE_COUNT: 1,
  MANUAL_TIME: 2,
  AUTO_TIME: 3,
};

window.SINGULARITY_MILESTONE_SORT = {
  SINGULARITIES_TO_NEXT: 0,
  CURRENT_COMPLETIONS: 1,
  PERCENT_COMPLETIONS: 2,
  FINAL_COMPLETION: 3,
  MOST_RECENT: 4,
};

window.COMPLETED_MILESTONES = {
  FIRST: 0,
  LAST: 1,
  IGNORED: 2,
};

window.SORT_ORDER = {
  ASCENDING: 0,
  DESCENDING: 1,
};

// One-indexed and ordered to simplify code elsewhere, do not change to be zero-indexed or reorder
window.PROGRESS_STAGE = {
  PRE_INFINITY: 1,

  EARLY_INFINITY: 2,
  BREAK_INFINITY: 3,
  REPLICANTI: 4,

  EARLY_ETERNITY: 5,
  ETERNITY_CHALLENGES: 6,
  EARLY_DILATION: 7,
  LATE_ETERNITY: 8,

  EARLY_REALITY: 9,

  TERESA: 10,
  EFFARIG: 11,
  ENSLAVED: 12,
  V: 13,
  RA: 14,
  IMAGINARY_MACHINES: 15,
  LAITELA: 16,
  PELLE: 17,
};

window.STD_BACKEND_URL = "https://antimatterdimensionspayments.ew.r.appspot.com";

window.SPEEDRUN_SEED_STATE = {
  UNKNOWN: 0,
  FIXED: 1,
  RANDOM: 2,
  PLAYER: 3,
};

window.cloneDeep = value => cloneDeep(value);
