// Note: chevrotain doesn't play well with unicode regex
/* eslint-disable require-unicode-regexp */
/* eslint-disable camelcase */
import { createToken, Lexer } from "chevrotain";

const createCategory = name => createToken({ name, pattern: Lexer.NA, longer_alt: Identifier });

// Shorthand for creating tokens and adding them to a list
const tokenLists = {};
// eslint-disable-next-line max-params
const createInCategory = (category, name, pattern, props = {}) => {
  const categories = [category];
  if (props.extraCategories) categories.push(...props.extraCategories);
  const token = createToken({
    name,
    pattern,
    categories,
    longer_alt: Identifier,
  });
  const categoryName = Array.isArray(category) ? category[0].name : category.name;
  if (tokenLists[categoryName] === undefined) tokenLists[categoryName] = [];
  tokenLists[categoryName].push(token);
  const patternWord = pattern.toString().match(/^\/([a-zA-Z0-9]*)\/[a-zA-Z]*$/ui);
  if (patternWord && patternWord[1]) token.$autocomplete = patternWord[1];
  Object.assign(token, props);
  return token;
};

const HSpace = createToken({
  name: "HSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED
});

const EOL = createToken({
  name: "EOL",
  line_breaks: true,
  pattern: /[ \t\r]*\n\s*/,
  label: "End of line",
});

const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /".*"/,
});

const StringLiteralSingleQuote = createToken({
  name: "StringLiteralSingleQuote",
  pattern: /'.*'/,
});

const Comment = createToken({
  name: "Comment",
  pattern: /(#|\/\/)[^\n]*/,
});

const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});

const BlackHoleStr = createToken({
  name: "BlackHoleStr",
  pattern: /[Bb][Hh][12]/,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z_0-9]*/,
});

const ComparisonOperator = createToken({
  name: "ComparisonOperator",
  pattern: Lexer.NA,
});

const AutomatorCurrency = createCategory("AutomatorCurrency");
const PrestigeEvent = createCategory("PrestigeEvent");
const StudyPath = createCategory("StudyPath");
const TimeUnit = createCategory("TimeUnit");

createInCategory(ComparisonOperator, "OpGTE", />=/, {
  $autocomplete: ">=",
  $compare: (a, b) => Decimal.gte(a, b),
});
createInCategory(ComparisonOperator, "OpLTE", /<=/, {
  $autocomplete: "<=",
  $compare: (a, b) => Decimal.lte(a, b),
});
createInCategory(ComparisonOperator, "OpGT", />/, {
  $autocomplete: ">",
  $compare: (a, b) => Decimal.gt(a, b),
});
createInCategory(ComparisonOperator, "OpLT", /</, {
  $autocomplete: "<",
  $compare: (a, b) => Decimal.lt(a, b),
});
const OpEQ = createInCategory(ComparisonOperator, "OpEQ", /==/, {
  $compare: (a, b) => Decimal.eq(a, b),
});
// EqualSign is a single = which is defined for both comparisons and define
const EqualSign = createToken({
  name: "EqualSign",
  pattern: /=/,
  categories: ComparisonOperator,
  label: "=",
  longer_alt: OpEQ,
});
EqualSign.$compare = (a, b) => Decimal.eq(a, b);

createInCategory(AutomatorCurrency, "EP", /ep/i, { $getter: () => Currency.eternityPoints.value });
createInCategory(AutomatorCurrency, "IP", /ip/i, { $getter: () => Currency.infinityPoints.value });
createInCategory(AutomatorCurrency, "AM", /am/i, { $getter: () => Currency.antimatter.value });
createInCategory(AutomatorCurrency, "DT", /dt/i, { $getter: () => Currency.dilatedTime.value });
createInCategory(AutomatorCurrency, "TP", /tp/i, { $getter: () => Currency.tachyonParticles.value });
createInCategory(AutomatorCurrency, "RG", /rg/i, { $getter: () => new Decimal(Replicanti.galaxies.total) });
createInCategory(AutomatorCurrency, "RM", /rm/i, { $getter: () => Currency.realityMachines.value });
createInCategory(AutomatorCurrency, "RS", /rs/i, { $getter: () => Currency.realityShards.value });

createInCategory(AutomatorCurrency, "infinities", /infinities/i, { $getter: () => Currency.infinities.value });
createInCategory(AutomatorCurrency, "bankedInfinities", /banked[ \t]+infinities/i, {
  $autocomplete: "banked infinities",
  $getter: () => Currency.infinitiesBanked.value
});
createInCategory(AutomatorCurrency, "eternities", /eternities/i, { $getter: () => Currency.eternities.value });
createInCategory(AutomatorCurrency, "realities", /realities/i, { $getter: () => Currency.realities.value });
createInCategory(AutomatorCurrency, "remnants", /remnants/i, {
  $autocomplete: "remnants",
  $getter: () => new Decimal(Currency.remnants.value)
});
createInCategory(AutomatorCurrency, "RealityResources", /reality[ \t]*resources?/i, {
  $autocomplete: "reality resources",
  $getter: () => new Decimal(AlchemyResource.reality.amount),
  $unlocked: () => Ra.pets.effarig.level >= 25 || AlchemyResource.reality.amount > 0,
});

createInCategory(AutomatorCurrency, "PendingIP", /pending[ \t]+ip/i, {
  $autocomplete: "pending IP",
  $getter: () => (Player.canCrunch ? gainedInfinityPoints() : DC.D0)
});
createInCategory(AutomatorCurrency, "PendingEP", /pending[ \t]+ep/i, {
  $autocomplete: "pending EP",
  $getter: () => (Player.canEternity ? gainedEternityPoints() : DC.D0)
});
createInCategory(AutomatorCurrency, "PendingTP", /pending[ \t]+tp/i, {
  $autocomplete: "pending TP",
  $getter: () => (player.dilation.active ? getTachyonGain() : DC.D0),
});
createInCategory(AutomatorCurrency, "PendingRM", /pending[ \t]+rm/i, {
  $autocomplete: "pending RM",
  $getter: () => (isRealityAvailable() ? MachineHandler.gainedRealityMachines : DC.D0)
});
createInCategory(AutomatorCurrency, "PendingRS", /pending[ \t]+rs/i, {
  $autocomplete: "pending RS",
  $getter: () => (Pelle.isDoomed ? Pelle.nextRealityShardGain : DC.D0)
});
createInCategory(AutomatorCurrency, "PendingGlyphLevel", /pending[ \t]+glyph[ \t]+level/i, {
  $autocomplete: "pending Glyph level",
  $getter: () => new Decimal(isRealityAvailable() ? gainedGlyphLevel().actualLevel : 0),
});
createInCategory(AutomatorCurrency, "PendingRemnants", /pending[ \t]+remnants/i, {
  $autocomplete: "pending remnants",
  $getter: () => new Decimal(Pelle.isDoomed ? Pelle.remnantsGain : 0)
});

createInCategory(AutomatorCurrency, "Rep", /rep(licanti)?/i, {
  $autocomplete: "rep",
  $getter: () => Replicanti.amount,
});
createInCategory(AutomatorCurrency, "TT", /(tt|time theorems?)/i, {
  $autocomplete: "TT",
  $getter: () => Currency.timeTheorems.value,
});
createInCategory(AutomatorCurrency, "TotalTT", /total[ \t]+tt/i, {
  $autocomplete: "total TT",
  $getter: () => player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost()),
});
createInCategory(AutomatorCurrency, "SpentTT", /spent[ \t]+tt/i, {
  $autocomplete: "spent TT",
  $getter: () => new Decimal(GameCache.currentStudyTree.value.spentTheorems[0]),
});

createInCategory(AutomatorCurrency, "TotalCompletions", /total[ \t]+completions/i, {
  $autocomplete: "total completions",
  $getter: () => EternityChallenges.completions,
});

createInCategory(AutomatorCurrency, "PendingCompletions", /pending[ \t]+completions/i, {
  $autocomplete: "pending completions",
  $getter: () => {
    // If we are not in an EC, pretend like we have a ton of completions so any check for sufficient
    // completions returns true
    if (!EternityChallenge.isRunning) return DC.NUMMAX;
    return EternityChallenge.current.gainedCompletionStatus.totalCompletions;
  }
});

createInCategory(AutomatorCurrency, "FilterScore", /filter[ \t]+score/i, {
  $autocomplete: "filter score",
  $getter: () => {
    // If the filter isn't unlocked somehow, return the most negative number in order to ensure it's nonblocking
    if (!EffarigUnlock.glyphFilter.isUnlocked) return -Number.MAX_VALUE;
    const choices = GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(),
      { isChoosingGlyph: false });
    const bestGlyph = AutoGlyphProcessor.pick(choices);
    return AutoGlyphProcessor.filterValue(bestGlyph);
  },
  $unlocked: () => EffarigUnlock.glyphFilter.isUnlocked,
});

// Space theorems can't be abbreviated as "ST" in the actual script content because then the lexer becomes unable
// to match it due to the fact that "start" (ec/dilation) also begins with those characters. As a workaround, ST
// uses the full string "space theorems" as does the "total ST" variant (for consistency)
createInCategory(AutomatorCurrency, "ST", /space[ \t]+theorems/i, {
  $autocomplete: "space theorems",
  $getter: () => V.availableST,
  $unlocked: () => V.spaceTheorems > 0,
});
createInCategory(AutomatorCurrency, "TotalST", /total[ \t]+space[ \t]+theorems/i, {
  $autocomplete: "total space theorems",
  $getter: () => V.spaceTheorems,
  $unlocked: () => V.spaceTheorems > 0,
});

for (let i = 1; i <= 12; ++i) {
  const id = i;
  createInCategory(AutomatorCurrency, `EC${i}`, new RegExp(`ec${i} completions`, "i"), {
    $autocomplete: `ec${i} completions`,
    // eslint-disable-next-line no-loop-func
    $getter: () => EternityChallenge(id).completions
  });
}

for (let i = 1; i <= 5; ++i) {
  const id = i;
  createInCategory(AutomatorCurrency, `Rift${i}`, new RegExp(`rifts?${i}\\b|rifts?[ \\t]+${i}[ \\t]+(percentage|fill|percent)`, "i"), {
    $autocomplete: `rift${i}`,
    // eslint-disable-next-line no-loop-func
    $getter: () => new Decimal(PelleRifts.all[id - 1]?.percentage ?? 0).times(100),
    $unlocked: () => Pelle.isUnlocked,
  });
}

createInCategory(AutomatorCurrency, "RiftMilestones", /(total[ \t]+)?rifts?[ \t]+milestones?/i, {
  $autocomplete: "rift milestones",
  $getter: () => new Decimal(PelleRifts.totalMilestones?.() ?? 0),
  $unlocked: () => Pelle.isUnlocked,
});
createInCategory(AutomatorCurrency, "PouredRM", /poured[ \t]*rm/i, {
  $autocomplete: "poured RM",
  $getter: () => new Decimal(player.celestials.teresa.pouredAmount),
  $unlocked: () => Teresa.isUnlocked,
});
createInCategory(AutomatorCurrency, "StoredGameTime", /stored[ \t]+(game[ \t]+)?time/i, {
  $autocomplete: "stored time",
  $getter: () => new Decimal(player.celestials.enslaved.stored),
  $unlocked: () => Enslaved.isUnlocked,
});
createInCategory(AutomatorCurrency, "StoredRealTimeCurrency", /stored[ \t]+real[ \t]+time/i, {
  $autocomplete: "stored real time",
  $getter: () => new Decimal(player.celestials.enslaved.storedReal),
  $unlocked: () => Enslaved.isUnlocked,
});
createInCategory(AutomatorCurrency, "LaitelaTier", /laitela[ \t]*tier/i, {
  $autocomplete: "laitela tier",
  $getter: () => new Decimal(8 - (Laitela.maxAllowedDimension ?? 8)),
  $unlocked: () => Laitela.isUnlocked,
});
createInCategory(AutomatorCurrency, "Entropy", /(laitela[ \t]+)?entropy/i, {
  $autocomplete: "entropy",
  $getter: () => new Decimal((Laitela.entropy ?? player.celestials.laitela.entropy ?? 0) * 100),
  $unlocked: () => Laitela.isUnlocked,
});
createInCategory(AutomatorCurrency, "GeneratedGalaxies", /(generated([ \t]+galaxies)?|gg)/i, {
  $autocomplete: "generated",
  $getter: () => (Pelle.hasGalaxyGenerator ? GalaxyGenerator.generatedGalaxies : DC.D0),
  $unlocked: () => Pelle.hasGalaxyGenerator,
});
createInCategory(AutomatorCurrency, "MemoryTeresa", /(memory[ \t]*(1|teresa)|teresa[ \t]*memory)/i, {
  $autocomplete: "memory teresa",
  $getter: () => new Decimal(Ra.pets.teresa.level),
  $unlocked: () => Ra.isUnlocked && Ra.pets.teresa.isUnlocked,
});
createInCategory(AutomatorCurrency, "MemoryEffarig", /(memory[ \t]*(2|effarig)|effarig[ \t]*memory)/i, {
  $autocomplete: "memory effarig",
  $getter: () => new Decimal(Ra.pets.effarig.level),
  $unlocked: () => Ra.isUnlocked && Ra.pets.effarig.isUnlocked,
});
createInCategory(AutomatorCurrency, "MemoryEnslaved", /(memory[ \t]*(3|enslaved)|enslaved[ \t]*memory)/i, {
  $autocomplete: "memory enslaved",
  $getter: () => new Decimal(Ra.pets.enslaved.level),
  $unlocked: () => Ra.isUnlocked && Ra.pets.enslaved.isUnlocked,
});
createInCategory(AutomatorCurrency, "MemoryV", /(memory[ \t]*(4|v)|v[ \t]*memory)/i, {
  $autocomplete: "memory v",
  $getter: () => new Decimal(Ra.pets.v.level),
  $unlocked: () => Ra.isUnlocked && Ra.pets.v.isUnlocked,
});

// $prestigeLevel is used by things that wait for a prestige event. Something waiting for
// eternity will be triggered by something waiting for reality, for example.
createInCategory(PrestigeEvent, "Infinity", /infinity/i, {
  extraCategories: [StudyPath],
  $autobuyer: () => Autobuyer.bigCrunch,
  $autobuyerDurationMode: AUTO_CRUNCH_MODE.TIME,
  $autobuyerXHighestMode: AUTO_CRUNCH_MODE.X_HIGHEST,
  $autobuyerCurrencyMode: AUTO_CRUNCH_MODE.AMOUNT,
  $prestigeAvailable: () => Player.canCrunch,
  $prestige: () => bigCrunchResetRequest(true),
  $prestigeLevel: 1,
  $prestigeCurrency: "IP",
  $studyPath: TIME_STUDY_PATH.INFINITY_DIM,
});
createInCategory(PrestigeEvent, "Eternity", /eternity/i, {
  $autobuyer: () => Autobuyer.eternity,
  $autobuyerDurationMode: AUTO_ETERNITY_MODE.TIME,
  $autobuyerXHighestMode: AUTO_ETERNITY_MODE.X_HIGHEST,
  $autobuyerCurrencyMode: AUTO_ETERNITY_MODE.AMOUNT,
  $prestigeAvailable: () => Player.canEternity,
  $prestigeLevel: 2,
  $prestigeCurrency: "EP",
  $prestige: () => eternity(false, true),
  $respec: () => {
    player.respec = true;
  },
});
createInCategory(PrestigeEvent, "Reality", /reality/i, {
  $autobuyer: () => Autobuyer.reality,
  $autobuyerCurrencyMode: AUTO_REALITY_MODE.RM,
  $prestigeAvailable: () => isRealityAvailable(),
  $prestigeLevel: 3,
  $prestigeCurrency: "RM",
  $prestige: () => autoReality(),
  $respec: () => {
    player.reality.respec = true;
  },
});
createInCategory(PrestigeEvent, "Doom", /doom/i, {
  $prestigeAvailable: () => Pelle.isUnlocked,
  $prestigeLevel: 4,
  $prestige: () => Pelle.initializeRun(),
});
createInCategory(PrestigeEvent, "Armageddon", /armageddon/i, {
  $prestigeAvailable: () => Pelle.canArmageddon,
  $prestigeLevel: 5,
  $prestigeCurrency: "RS",
  $prestige: () => Pelle.armageddon(true),
});
createInCategory(PrestigeEvent, "Endgame", /endgame/i, {
  $autobuyer: () => Autobuyer.endgame,
  $autobuyerCurrencyMode: AUTO_ENDGAME_MODE.CP,
  $prestigeAvailable: () => isEndgameAvailable(),
  $prestigeLevel: 6,
  $prestigeCurrency: "CP",
  $prestige: () => Endgame.newEndgame(),
  $respec: () => {
    player.endgame.respec = true;
  },
});

createInCategory(StudyPath, "Idle", /idle/i, { $studyPath: TIME_STUDY_PATH.IDLE });
createInCategory(StudyPath, "Passive", /passive/i, { $studyPath: TIME_STUDY_PATH.PASSIVE });
createInCategory(StudyPath, "Active", /active/i, { $studyPath: TIME_STUDY_PATH.ACTIVE });
createInCategory(StudyPath, "Antimatter", /antimatter/i, { $studyPath: TIME_STUDY_PATH.ANTIMATTER_DIM });
createInCategory(StudyPath, "Time", /time/i, { $studyPath: TIME_STUDY_PATH.TIME_DIM });
createInCategory(StudyPath, "Light", /light/i, { $studyPath: TIME_STUDY_PATH.LIGHT });
createInCategory(StudyPath, "Dark", /dark/i, { $studyPath: TIME_STUDY_PATH.DARK });

createInCategory(TimeUnit, "Milliseconds", /ms/i, {
  $autocomplete: "ms",
  $scale: 1,
});
createInCategory(TimeUnit, "Seconds", /s(ec(onds?)?)?/i, {
  $autocomplete: "sec",
  $scale: 1000,
});
createInCategory(TimeUnit, "Minutes", /m(in(utes?)?)?/i, {
  $autocomplete: "min",
  $scale: 60 * 1000,
});
createInCategory(TimeUnit, "Hours", /h(ours?)?/i, {
  $autocomplete: "hours",
  $scale: 3600 * 1000,
});

const Keyword = createToken({
  name: "Keyword",
  pattern: Lexer.NA,
  longer_alt: Identifier,
});

const keywordTokens = [];
const createKeyword = (name, pattern, props = {}) => {
  const categories = [Keyword];
  if (props.extraCategories) categories.push(...props.extraCategories);
  const token = createToken({
    name,
    pattern,
    categories,
    longer_alt: Identifier,
  });
  token.$autocomplete = name.toLocaleLowerCase();
  keywordTokens.push(token);
  Object.assign(token, props);
  return token;
};

createKeyword("Auto", /auto/i);
createKeyword("Buy", /buy/i);
// Necessary to hide it from Codemirror's tab auto-completion
createKeyword("Blob", /blob\s\s/i, {
  $unlocked: () => false,
});
createKeyword("If", /if/i);
createKeyword("Load", /load/i);
createKeyword("Notify", /notify/i);
createKeyword("Nowait", /nowait/i);
createKeyword("Off", /off/i);
createKeyword("On", /on/i);
createKeyword("Pause", /pause/i);
// Names are a little special, because they can be named anything (like ec12 or wait)
// So, we consume the label at the same time as we consume the preset. In order to report
// errors, we also match just the word name. And, we have to not match comments.
createKeyword("Name", /name([ \t]+(\/(?!\/)|[^\n#/])*)?/i);
createKeyword("Id", /id\b([ \t]+\d+)?/i);
createKeyword("Purchase", /purchase/i);
createKeyword("Respec", /respec/i);
createKeyword("Restart", /restart/i);
createKeyword("Start", /start/i);
createKeyword("Stop", /stop/i);
createKeyword("Studies", /studies/i);
createKeyword("Unlock", /unlock/i);
createKeyword("Until", /until/i);
createKeyword("Use", /use/i);
createKeyword("Wait", /wait/i);
createKeyword("While", /while/i);
createKeyword("BlackHole", /black[ \t]+hole/i, {
  $autocomplete: "black hole",
  $unlocked: () => BlackHole(1).isUnlocked,
});
createKeyword("StoreGameTime", /stored?[ \t]+game[ \t]+time/i, {
  $autocomplete: "store game time",
  $unlocked: () => Enslaved.isUnlocked,
});

createKeyword("Dilation", /dilation/i);
createKeyword("EC", /ec/i);
createKeyword("XHighest", /x[ \t]+highest/i, {
  $autocomplete: "x highest",
});

createKeyword("Celestial", /celestial/i);
createKeyword("Teresa", /teresa/i);
createKeyword("Effarig", /effarig/i);
createKeyword("Enslaved", /enslaved/i);
createKeyword("V", /v/i); 
createKeyword("Ra", /ra/i); 
createKeyword("Laitela", /laitela/i); 
createKeyword("Pelle", /pelle/i); 
createKeyword("Glyph", /glyphs?/i);
createKeyword("Unequip", /unequip/i);
createKeyword("Main", /main/i);
createKeyword("Protected", /protected/i);
createKeyword("Over", /over/i);
createKeyword("Create", /create/i);
createKeyword("Equip", /equip/i);
createKeyword("Cursed", /cursed/i);
createKeyword("Alchemy", /alchemy/i);
createKeyword("Reset", /reset/i);
createKeyword("Rift", /rifts?/i);
createKeyword("Pour", /pour/i);
createKeyword("Generator", /(galaxy[ \t]+)?generator/i);
createKeyword("StoreRealTime", /store[ \t]+real[ \t]+time/i, {
  $autocomplete: "store real time",
  $unlocked: () => Enslaved.isUnlocked,
});
createKeyword("Tab", /tabs?/i);
createKeyword("Sacrifice", /sacrifice/i);

// We allow ECLiteral to consume lots of digits because that makes error reporting more
// clear (it's nice to say ec123 is an invalid ec)
const ECLiteral = createToken({
  name: "ECLiteral",
  pattern: /ec[1-9][0-9]*/i,
  longer_alt: Identifier,
});

const LCurly = createToken({ name: "LCurly", pattern: /[ \t]*{/ });
const RCurly = createToken({ name: "RCurly", pattern: /[ \t]*}/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Pipe = createToken({ name: "Pipe", pattern: /\|/, label: "|" });
const Dash = createToken({ name: "Dash", pattern: /-/, label: "-" });
const Exclamation = createToken({ name: "Exclamation", pattern: /!/, label: "!" });

// The order here is the order the lexer looks for tokens in.
export const automatorTokens = [
  HSpace, StringLiteral, StringLiteralSingleQuote, Comment, EOL,
  ComparisonOperator, ...tokenLists.ComparisonOperator,
  LCurly, RCurly, Comma, EqualSign, Pipe, Dash, Exclamation,
  BlackHoleStr, NumberLiteral,
  AutomatorCurrency, ...tokenLists.AutomatorCurrency,
  ECLiteral,
  Keyword, ...keywordTokens,
  PrestigeEvent, ...tokenLists.PrestigeEvent,
  StudyPath, ...tokenLists.StudyPath,
  TimeUnit, ...tokenLists.TimeUnit,
  Identifier,
];

// Labels only affect error messages and Diagrams.
LCurly.LABEL = "'{'";
RCurly.LABEL = "'}'";
NumberLiteral.LABEL = "Number";
Comma.LABEL = "❟";

export const lexer = new Lexer(automatorTokens, {
  positionTracking: "full",
  ensureOptimizations: true
});

// The lexer uses an ID system that's separate from indices into the token array
export const tokenIds = [];
for (const token of lexer.lexerDefinition) {
  tokenIds[token.tokenTypeIdx] = token;
}

// We use this while building up the grammar
export const tokenMap = automatorTokens.mapToObject(e => e.name, e => e);

const automatorCurrencyNames = tokenLists.AutomatorCurrency.map(i => i.$autocomplete.toUpperCase());

export const standardizeAutomatorValues = function(x) {
  try {
    if (automatorCurrencyNames.includes(x.toUpperCase())) return x.toUpperCase();
  } catch {
    // This only happens if the input is a number or Decimal, in which case we don't attempt to change any formatting
    // and simply return
    return x;
  }
  for (const i of tokenLists.AutomatorCurrency) {
    // Check for a match of the full string.
    if (x.match(i.PATTERN) && x.match(i.PATTERN)[0].length === x.length) {
      return i.$autocomplete.toUpperCase();
    }
  }
  // If we get to this point, we haven't matched a currency name and instead assume it's a defined constant and
  // return it without any format changes since these are case-sensitive
  return x;
};

// In order to disallow individual words within command key words/phrases, we need to ignore certain patterns (mostly
// ones with special regex characters), split the rest of them up across all spaces and tabs, and then flatten the
// final resulting array. Note that this technically duplicates words present in multiple phrases (eg. "pending")
const ignoredPatterns = ["Identifier", "LCurly", "RCurly"];
export const forbiddenConstantPatterns = lexer.lexerDefinition
  .filter(p => !ignoredPatterns.includes(p.name))
  .map(p => p.PATTERN.source)
  .flatMap(p => ((p.includes("(") || p.includes(")")) ? p : p.split("[ \\t]+")));
