import { lexer, tokenIds } from "./lexer";
import { compile } from "./compiler";
import { parser } from "./parser";

function walkSuggestion(suggestion, prefix, output) {
  const hasAutocomplete = suggestion.$autocomplete &&
    suggestion.$autocomplete.startsWith(prefix) && suggestion.$autocomplete !== prefix;
  const isUnlocked = suggestion.$unlocked ? suggestion.$unlocked() : true;
  if (hasAutocomplete && isUnlocked) output.add(suggestion.$autocomplete);
  for (const s of suggestion.categoryMatches) {
    walkSuggestion(tokenIds[s], prefix, output);
  }
}

// eslint-disable-next-line no-unused-vars
CodeMirror.registerHelper("lint", "automato", (contents, _, editor) => {
  const doc = editor.getDoc();
  const errors = compile(contents, true).errors;
  return errors.map(e => ({
    message: e.info,
    severity: "error",
    from: doc.posFromIndex(e.startOffset),
    to: doc.posFromIndex(e.endOffset + 1),
  }));
});

CodeMirror.registerHelper("hint", "anyword", editor => {
  const cursor = editor.getDoc().getCursor();
  let start = cursor.ch;
  const end = cursor.ch;
  const line = editor.getLine(cursor.line);
  while (start && /[\w-]/u.test(line.charAt(start - 1)))--start;
  const lineStart = line.slice(0, start);
  const currentPrefix = line.slice(start, end).toLowerCase();

  const suggestions = new Set();

  const tabTokens = lineStart.trim().split(/\s+/);
  if (tabTokens[0]?.toLowerCase() === "tab") {
    const isNowait = tabTokens[1]?.toLowerCase() === "nowait";
    const mainTabArg = isNowait ? tabTokens[2] : tabTokens[1];
    const isMainTabSlot = !mainTabArg || (isNowait ? tabTokens.length === 2 : tabTokens.length === 1);

    const MAIN_TABS = [
      "dimensions", "options", "statistics", "achievements", "automation",
      "challenges", "infinity", "eternity", "reality", "celestials",
      "shop", "endgame", "cdexpansion", "divinity", "universes"
    ];

    const SUBTAB_MAP = {
      celestials: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "teresa", "effarig", "enslaved", "v", "ra", "laitela", "pelle", "alpha", "slabdrill"],
      celestial: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "teresa", "effarig", "enslaved", "v", "ra", "laitela", "pelle", "alpha", "slabdrill"],
      dimensions: ["antimatter", "infinity", "time", "celestial", "divine"],
      options: ["saving", "visual", "gameplay"],
      statistics: ["statistics", "challenges", "prestige runs", "glyph sets", "stored time"],
      achievements: ["normal", "secret"],
      automation: ["autobuyers", "automator"],
      challenges: ["normal", "infinity", "eternity"],
      infinity: ["upgrades", "break", "replicanti"],
      eternity: ["studies", "upgrades", "milestones", "dilation"],
      reality: ["glyphs", "upgrades", "imag_upgrades", "dual_upgrades", "perks", "hole", "alchemy"],
      endgame: ["endgame", "break-eternity", "pelle-destruction", "expansion-packs", "masteries", "milestones", "upgrades", "power", "ethereal", "hypercubes", "collider", "ascension", "compression"],
      cdexpansion: ["celestial-infinity", "celestial-break-infinity", "celestial-eternity", "celestial-eternity-plus"],
      divinity: ["milestones", "upgrades", "resurgence"],
      universes: ["transient", "tangible"]
    };

    if (isMainTabSlot) {
      if (!isNowait && "nowait".startsWith(currentPrefix)) suggestions.add("nowait");
      for (const tab of MAIN_TABS) {
        if (tab.startsWith(currentPrefix)) suggestions.add(tab);
      }
    } else {
      const cleanMain = mainTabArg?.toLowerCase().replace(/[-_\s]/g, "");
      const matchedKey = Object.keys(SUBTAB_MAP).find(k => k.replace(/[-_\s]/g, "") === cleanMain);
      if (matchedKey) {
        for (const sub of SUBTAB_MAP[matchedKey]) {
          if (sub.startsWith(currentPrefix)) suggestions.add(sub);
        }
      }
      if ("nowait".startsWith(currentPrefix)) suggestions.add("nowait");
    }
  }

  const lineLex = lexer.tokenize(lineStart);
  if (lineLex.errors.length === 0) {
    const rawSuggestions = parser.computeContentAssist("command", lineLex.tokens);
    for (const s of rawSuggestions) {
      if (s.ruleStack[1] === "badCommand") continue;
      walkSuggestion(s.nextTokenType, currentPrefix, suggestions);
    }
  }

  return {
    list: Array.from(suggestions),
    from: CodeMirror.Pos(cursor.line, start),
    to: CodeMirror.Pos(cursor.line, end)
  };
});

const commentRule = { regex: /(\/\/|#).*/u, token: "comment", next: "start" };

// This is a state machine which determines the syntax highlighting for the automator. Top-level props define
// the states, the array entries define the transition rules which are checked in order of appearance, and next
// specifies which state to transition to after consuming the given regex. Without an entry for "next" the state
// machine will remain in the same state and run the transition check after consuming the regex. The "next" prop
// in the line with "sol" is a fallback transition which will be followed if none of the rules are matched.
// Matches to the regexes will color the matched text according to the specified color of cm-[token] in liquibyte.css
// Note: This has no bearing on the actual functionality and behavior of the automator itself and is purely visual.
CodeMirror.defineSimpleMode("automato", {
  // The start state contains the rules that are intially used
  start: [
    commentRule,
    { regex: /studies\s+/ui, token: "keyword", next: "studiesArgs" },
    { regex: /celestial\s+/ui, token: "keyword", next: "celestialArgs" },
    { regex: /glyphs?\s+/ui, token: "keyword", next: "glyphArgs" },
    { regex: /alchemy\s+/ui, token: "keyword", next: "alchemyArgs" },
    { regex: /rifts?\s+/ui, token: "keyword", next: "riftArgs" },
    { regex: /tabs?\s+/ui, token: "keyword", next: "tabArgs" },
    { regex: /blob\s\s/ui, token: "blob" },
    {
      // eslint-disable-next-line max-len
      regex: /(auto|if|pause|studies|time[ \t]+theorems?|space[ \t]+theorems?|until|wait|while|black[ \t]+hole|stored?[ \t]+(game|real)[ \t]+time|notify)\s/ui,
      token: "keyword",
      next: "commandArgs"
    },
    {
      regex: /stop/ui,
      token: "keyword",
      next: "commandDone"
    },
    {
      regex: /start\s|unlock\s/ui,
      token: "keyword",
      next: "startUnlock"
    },
    { regex: /infinity\S+|eternity\S+|reality\S+|doom\S+|armageddon\S+|endgame\S+|pause\S+|restart\S+/ui, token: "error", next: "commandDone" },
    { regex: /infinity|eternity|reality|doom|armageddon|endgame/ui, token: "keyword", next: "prestige" },
    { regex: /pause|restart/ui, token: "keyword", next: "commandDone" },
    { regex: /\}/ui, dedent: true },
    { regex: /\S+\s/ui, token: "error", next: "commandDone" },
  ],
  studiesArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /load(\s+|$)/ui, token: "variable-2", next: "studiesLoad" },
    { regex: /respec/ui, token: "variable-2", next: "commandDone" },
    { regex: /purchase/ui, token: "variable-2", next: "studiesList" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
  ],
  studiesList: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(antimatter|infinity|time)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /(active|passive|idle)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /(light|dark)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /([1-9][0-9]+)(?=[\s,!|-]|$)/ui, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable", next: "commandDone" },
    { regex: /!$/ui, token: "variable-2" },
    { regex: /([1-9]|1[0-2])(?=!|$)/ui, token: "number" },
  ],
  studiesLoad: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /id(\s+|$)/ui, token: "variable-2", next: "studiesLoadId" },
    { regex: /name(\s+|$)/ui, token: "variable-2", next: "studiesLoadPreset" },
    { regex: /\S+/ui, token: "error" },
  ],
  studiesLoadId: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /\d/ui, token: "qualifier", next: "commandDone" },
  ],
  studiesLoadPreset: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(\/(?!\/)|[^\s#/])+/ui, token: "qualifier", next: "commandDone" },
  ],
  celestialArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(teresa|effarig|enslaved|v|ra|laitela|pelle)(\s+|$)/ui, token: "variable-2", next: "celestialAction" },
    { regex: /\S+/ui, token: "error" },
  ],
  celestialAction: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /start(\s+|$)/ui, token: "keyword", next: "celestialModifiers" },
    { regex: /pour(\s+|$)/ui, token: "keyword", next: "teresaPourArgs" },
    { regex: /\S+/ui, token: "error" },
  ],
  teresaPourArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
    { regex: /(on|off)(\s+|$)/ui, token: "property", next: "teresaPourModifiers" },
    { regex: /\S+/ui, token: "error" },
  ],
  teresaPourModifiers: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  tabArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
    { regex: /[1-9](\s+|$)/ui, token: "number", next: "tabModifiers" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9-]*/u, token: "variable-2", next: "tabSubArgs" },
    { regex: /\S+/ui, token: "error" },
  ],
  tabSubArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /[1-9](\s+|$)/ui, token: "number", next: "tabModifiers" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9-]*/u, token: "variable-2", next: "tabModifiers" },
    { regex: /\S+/ui, token: "error" },
  ],
  tabModifiers: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  celestialModifiers: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  glyphArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
    { regex: /load(\s+|$)/ui, token: "variable-2", next: "glyphLoad" },
    { regex: /unequip(\s+|$)/ui, token: "variable-2", next: "glyphUnequip" },
    { regex: /create(\s+|$)/ui, token: "variable-2", next: "glyphTarget" },
    { regex: /equip(\s+|$)/ui, token: "variable-2", next: "glyphTarget" },
    { regex: /\S+/ui, token: "error" },
  ],
  glyphTarget: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(cursed|reality)(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  glyphUnequip: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(on|off|main|protected)(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  glyphLoad: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /id(\s+|$)/ui, token: "variable-2", next: "glyphLoadId" },
    { regex: /name(\s+|$)/ui, token: "variable-2", next: "glyphLoadPreset" },
    { regex: /\S+/ui, token: "error" },
  ],
  glyphLoadId: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /\d+/ui, token: "qualifier", next: "commandDone" },
  ],
  glyphLoadPreset: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(\/(?!\/)|[^\s#/])+/ui, token: "qualifier", next: "commandDone" },
  ],
  alchemyArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(on|off)(\s+|$)/ui, token: "property", next: "alchemyModifiers" },
    { regex: /reset(\s+|$)/ui, token: "variable-2", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  alchemyModifiers: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  riftArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
    { regex: /[1-5](\s+|$)/ui, token: "number", next: "riftAction" },
    { regex: /sacrifice(\s+|$)/ui, token: "property", next: "riftModifiers" },
    { regex: /\S+/ui, token: "error" },
  ],
  riftAction: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /(on|off|sacrifice)(\s+|$)/ui, token: "property", next: "riftModifiers" },
    { regex: /\S+/ui, token: "error" },
  ],
  riftModifiers: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s+|$)/ui, token: "property", next: "commandDone" },
    { regex: /\S+/ui, token: "error" },
  ],
  prestige: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /nowait(\s|$)/ui, token: "property" },
    { regex: /respec/ui, token: "variable-2" },
    { regex: /over(\s+|$)/ui, token: "variable-2", next: "commandDone" },
  ],
  commandDone: [
    commentRule,
    { sol: true, next: "start" },
    // This seems necessary to have a closing curly brace de-indent automatically in some cases
    { regex: /\}/ui, dedent: true },
    { regex: /\S+/ui, token: "error" },
  ],
  startUnlock: [
    commentRule,
    { sol: true, next: "start" },
    {
      regex: /ec\s?(1[0-2]|[1-9])|dilation/ui,
      token: "variable-2",
      next: "commandDone",
    },
    { regex: /nowait(\s|$)/ui, token: "property" },
  ],
  commandArgs: [
    commentRule,
    { sol: true, next: "start" },
    { regex: /<=|>=|<|>/ui, token: "operator" },
    { regex: /nowait(\s|$)/ui, token: "property" },
    { regex: /".*"/ui, token: "string", next: "commandDone" },
    { regex: /'.*'/ui, token: "string", next: "commandDone" },
    { regex: /(on|off|pour|bh1|bh2|dilation|load|respec)(\s|$)/ui, token: "variable-2" },
    { regex: /(eternity|reality|use)(\s|$)/ui, token: "variable-2" },
    { regex: /(antimatter|infinity|time)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /(active|passive|idle)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /(light|dark)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /x[\t ]+highest(\s|$)/ui, token: "variable-2" },
    { regex: /pending[\t ]+(completions|ip|ep|tp|rm|rs|remnants|glyph[\t ]+level)(\s|$)/ui, token: "variable-2" },
    { regex: /total[\t ]+(completions|tt|space theorems)(\s|$)/ui, token: "variable-2" },
    { regex: /spent[\t ]+tt(\s|$)/ui, token: "variable-2" },
    { regex: /filter[ \t]+score/ui, token: "variable-2" },
    { regex: /ec(1[0-2]|[1-9])[\t ]+completions(\s|$)/ui, token: "variable-2" },
    { regex: /(am|ip|ep|all)(\s|$)/ui, token: "variable-2" },
    {
      regex: /(rm|remnants|rs|rg|dt|tp|tt|space theorems|(banked )?infinities|eternities|realities|rep(licanti)?)(\s|$)/ui,
      token: "variable-2",
    },
    { regex: /reality[ \t]*resources?(\s|$)/ui, token: "variable-2" },
    { regex: /(rifts?[1-5]|rifts?[ \t]+[1-5][ \t]+(percentage|fill|percent))(\s|$)/ui, token: "variable-2" },
    { regex: /(total[ \t]+)?rifts?[ \t]+milestones?(\s|$)/ui, token: "variable-2" },
    { regex: /poured[ \t]*rm(\s|$)/ui, token: "variable-2" },
    { regex: /stored[ \t]+(game[ \t]+|real[ \t]+)?time(\s|$)/ui, token: "variable-2" },
    { regex: /laitela[ \t]*tier(\s|$)/ui, token: "variable-2" },
    { regex: /(laitela[ \t]+)?entropy(\s|$)/ui, token: "variable-2" },
    { regex: /(generated([ \t]+galaxies)?|gg)(\s|$)/ui, token: "variable-2" },
    { 
      regex: /(memory[ \t]*(1|2|3|4|teresa|effarig|enslaved|v)|(teresa|effarig|enslaved|v)[ \t]*memory)(\s|$)/ui, token: "variable-2" 
    },
    { regex: / sec(onds ?) ?| min(utes ?) ?| hours ?/ui, token: "variable-2" },
    { regex: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9]|t[1-4])/ui, token: "number" },
    { regex: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ui, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable" },
    { regex: /\{/ui, indent: true, next: "commandDone" },
    // This seems necessary to have a closing curly brace de-indent automatically in some cases
    { regex: /\}/ui, dedent: true },
  ],

  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    lineComment: "//",
    electricChars: "}",
  }
});
