/**
 * Abstract representation of a full endgame masteries tree object. The intended usage is to supply the constructor with
 * an import string and a budget of endgame skills, which it will use together to determine which masteries can
 * actually be purchased in the specified order. All of the complex purchasing logic should be handled here, and not
 * in any EndgameMasteryState objects. During parsing, some minor additional info is stored in order to improve user
 * feedback when attempting to import other mastery trees.
 *
 * Usage notes:
 * - Unless commitToGameState() is called, this only ever creates a "virtual" tree object which does not change the
 *   overall game state. This class serves the purpose of having all the purchasing and locking logic in one place.
 *   Only upon calling commitToGameState() will the game actually try to get every mastery specified in tree.
 * - The general intent is that the logic in this class is meant to pull minimally from the extrenal game state; for
 *   example, how many compression paths are allowed or which masteries are purchasable depend on only the data in the tree
 *   object itself and should not depend on the actual current game state
 * - All mastery entries must be Strings because numbers (EM) need to be supported
 *
 * @member {Number[]} spentSkills      Two-element array containing ES totals for masteries which were actually
 *  purchased after accounting for various conditions which would forbid some being bought (eg. cost or tree structure)
 * @member {String[]} invalidMasteries     Array of masteries from the initial string which are correctly formatted
 *  but don't actually exist; used for informational purposes elsewhere
 * @member {EndgameMasteryState[]} selectedMasteries   Array of all given valid masteries, whether or not they are actually
 *  accessible or purchasable in the given order
 * @member {EndgameMasteryState[]} purchasedMasteries  Array of masteries which were actually purchased, using the given amount
 *  of available skills
 */
export class EndgameMasteryTree {
  // The first parameter will either be an import string or an array of masteries
  constructor(masteries) {
    this.spentSkills = [0, 0];
    this.invalidMasteries = [];
    this.purchasedMasteries = [];
    this.selectedMasteries = [];
    switch (typeof masteries) {
      case "string":
        // Input parameter is an unparsed mastery import string
        if (EndgameMasteryTree.isValidImportString(masteries)) {
          this.attemptBuyArray(this.parseMasteryImport(masteries), false);
        }
        break;
      case "object":
        // Input parameter is an array of endgame mastery objects
        this.attemptBuyArray([...masteries], false);
        this.selectedMasteries = [...masteries];
        break;
      case "undefined":
        // If not supplied with anything, we leave everything at default values and don't attempt to buy anything
        break;
      default:
        throw new Error("Unrecognized input parameter for EndgameMasteryTree constructor");
    }
  }

  // Note that this only checks pure formatting, not whether or not a mastery exists, but verifying correct
  // formatting separately from verifying existence allows us to produce more useful in-game error messages for
  // import strings which are formatted correctly but aren't entirely valid
  static isValidImportString(input) {
    if (input.trim() === "") {
      return false;
    }
    let test = input.replaceAll(/ +/gu, "");
    EndgameMasteryTree.sets.forEach((_, x) => test = test.replaceAll(new RegExp(`${x},?`, "gu"), ""));
    return /^,?((\d{2,3}(-\d{2,3})?)\b,?)*(\|\d{1,2}!?)?$/iu.test(test);
  }

  // Getter for all the masteries in the current game state
  static get currentMasteries() {
    const currentMasteries = player.endgameMasteries.masteries.map(s => EndgameMastery(s));
    return currentMasteries;
  }

  // THIS METHOD HAS LASTING CONSEQUENCES ON THE GAME STATE. MASTERIES WILL ACTUALLY BE PURCHASED IF POSSIBLE.
  // This method attempts to take the parameter array and purchase all the masteries specified, using the current game
  // state to determine if they are affordable. Input array may be either an id array or a EndgameMasteryState array
  static commitToGameState(masteryArray, auto = true) {
    for (const item of masteryArray) {
      const mastery = typeof item === "number" ? EndgameMastery(item) : item;
      if (mastery && !mastery.isBought) mastery.purchase(auto);
    }
    GameCache.currentMasteryTree.invalidate();
  }

  static get sets() {
    // Grouping of masteries. The key followed by an array of the masteries the key is a shorthand for.
    return new Map([
      ["antimatter", [81, 91, 101]],
      ["infinity", [82, 92, 102]],
      ["time", [83, 93, 103]],
      ["celestial", [84, 94, 104]],
      ["ip", [141, 151]],
      ["ep", [142, 152]],
      ["rm", [143, 153]],
      ["im", [144, 154]],
      ["endgameE", [281, 291, 301]],
      ["celestialE", [282, 292, 302]],
      ["divineE", [283, 293, 303]]
    ]);
  }

  static truncateInput(input) {
    let internal = input.toLowerCase();
    // Convert every name into the ids it is a shorthand for
    this.sets.forEach((ids, name) => (internal = internal.replace(name, ids.join())));
    return internal
      .replace(/[|,]$/u, "")
      .replaceAll(" ", "")
      // Allows 11,,21 to be parsed as 11,21 and 11,|1 to be parsed as 11|1
      .replace(/,{2,}/gu, ",")
      .replace(/,\|/gu, "|");
  }

  static formatMasteryList(input) {
    const internal = input.toLowerCase().replaceAll(" ", "");
    return internal.replaceAll(",", ", ").replace("|", " | ");
  }

  // This reads off all the masteries in the import string and splits them into invalid and valid mastery IDs. We hold on
  // to invalid masteries for additional information to present to the player
  parseMasteryImport(input) {
    const masteryDB = GameDatabase.endgame.masteries.map(s => s.id);
    const output = [];
    const masteriesString = EndgameMasteryTree.truncateInput(input).split("|")[0];
    if (masteriesString.length) {
      const masteryCluster = masteriesString.split(",");
      for (const masteryRange of masteryCluster) {
        const masteryRangeSplit = masteryRange.split("-");
        const masteryArray = masteryRangeSplit[1]
          ? this.masteryRangeToArray(masteryRangeSplit[0], masteryRangeSplit[1])
          : masteryRangeSplit;
        for (const mastery of masteryArray) {
          if (masteryDB.includes(parseInt(mastery, 10))) {
            const emObject = EndgameMastery(mastery);
            this.selectedMasteries.push(emObject);
            output.push(emObject);
          } else {
            this.invalidMasteries.push(mastery);
          }
        }
      }
    }
    return output;
  }

  masteryRangeToArray(firstNumber, lastNumber) {
    const masteriesArray = [];
    const first = this.checkEndgameMasteryNumber(firstNumber);
    const last = this.checkEndgameMasteryNumber(lastNumber);
    if ((first !== 0) && (last !== 0)) {
      for (let id = first; id <= last; id++) {
        if (EndgameMastery(id)) {
          masteriesArray.push(id);
        }
      }
    }
    return masteriesArray;
  }

  checkEndgameMasteryNumber(token) {
    const emNumber = parseFloat(token);
    if (!EndgameMastery(emNumber)) {
      return 0;
    }
    return emNumber;
  }

  // Attempt to purchase all masteries specified in the array which may be either mastery IDs (which get converted) or
  // mastery objects. The method needs to support both because turning it entirely to masteries causes circular references
  // which make the game fail to load
  attemptBuyArray(masteryArray, checkCosts) {
    for (const mastery of masteryArray) {
      const toBuy = typeof mastery === "object" ? mastery : EndgameMastery(mastery);
      if (this.hasRequirements(toBuy)) this.buySingleMastery(toBuy, checkCosts);
    }
  }

  // Tries to buy a single mastery, accounting for all various requirements and locking behavior in the game. Does not
  // update anything cost-related, use buySingleMastery() to actually purchase. checkOnlyStructure is used to ignore
  // secondary requirements
  hasRequirements(mastery, checkOnlyStructure = false) {
    // Import strings can contain repeated or undefined entries
    if (!mastery || this.purchasedMasteries.includes(mastery)) return false;

    // Because the player data may not reflect the state of the EndgameMasteryTree object's purchasedMasteries,
    // we have to do all the checks here with purchasedMasteries. mastery.isBought and similar functions cannot be used.
    const check = req => (typeof req === "number"
      ? this.purchasedMasteries.includes(EndgameMastery(req))
      : req());
    const config = mastery.config;
    let reqSatisfied;
    switch (config.reqType) {
      case EM_REQUIREMENT_TYPE.AT_LEAST_ONE:
        reqSatisfied = config.requirement.some(r => check(r));
        break;
      case EM_REQUIREMENT_TYPE.ALL:
        reqSatisfied = config.requirement.every(r => check(r));
        break;
      case EM_REQUIREMENT_TYPE.COMPRESSION_PATH:
        reqSatisfied = config.requirement.every(r => check(r)) && this.currCompPathCount < this.allowedCompPathCount;
        break;
      case EM_REQUIREMENT_TYPE.CURRENCY_PATH:
        reqSatisfied = config.requirement.every(r => check(r)) && this.currCurrPathCount < this.allowedCurrPathCount;
        break;
      case EM_REQUIREMENT_TYPE.EXPANDED:
        reqSatisfied = EndgameMastery.permaMasteries.isBought && config.requirement.every(r => check(r));
        break;
      case EM_REQUIREMENT_TYPE.ENTANGLEMENT:
        reqSatisfied = EndgameMastery.timeCompression.isBought &&
          config.requirement.every(r => check(r)) && this.currEntanglePathCount < this.allowedEntanglePathCount;
        break;
      default:
        throw Error(`Unrecognized EM requirement type: ${this.reqType}`);
    }
    return reqSatisfied;
  }

  // Buys the specified mastery; no requirement verification beyond cost, use hasRequirements() to verify proper structure
  buySingleMastery(mastery, checkCosts) {
    const config = mastery.config;
    if (checkCosts) {
      const maxES = Currency.endgameSkills.value.add(GameCache.currentMasteryTree.value.spentSkills[0])
        .clampMax(Number.MAX_VALUE).toNumber();
      const hasES = this.spentSkills[0] + config.cost <= maxES;
      if (!hasES) return;
    }

    this.purchasedMasteries.push(mastery);
  }

  get currCompPathCount() {
    return [81, 82, 83, 84].countWhere(x => this.purchasedMasteries.includes(EndgameMastery(x)));
  }

  get currCurrPathCount() {
    return [141, 142, 143, 144].countWhere(x => this.purchasedMasteries.includes(EndgameMastery(x)));
  }

  get currEntanglePathCount() {
    return [281, 282, 283].countWhere(x => this.purchasedMasteries.includes(EndgameMastery(x)));
  }

  get allowedCompPathCount() {
    if (EndgameUpgrade(20).isBought) return 4;
    if (EndgameUpgrade(19).isBought) return 3;
    if (EndgameUpgrade(17).isBought) return 2;
    return 1;
  }

  get allowedCurrPathCount() {
    if (EndgameUpgrade(20).isBought) return 4;
    if (EndgameUpgrade(18).isBought) return 3;
    if (EndgameUpgrade(16).isBought) return 2;
    return 1;
  }

  get allowedEntanglePathCount() {
    if (CompressionUpgrade.entanglementSplit.isBought) return 3;
    return 1;
  }

  get compressionPaths() {
    const pathSet = new Set();
    const validPaths = [ENDGAME_MASTERY_PATH.ANTIMATTER_DIM_COMPRESSION, ENDGAME_MASTERY_PATH.INFINITY_DIM_COMPRESSION, ENDGAME_MASTERY_PATH.TIME_DIM_COMPRESSION, ENDGAME_MASTERY_PATH.CELESTIAL_DIM_COMPRESSION];
    for (const path of validPaths) {
      const pathEntry = EndgameMasteries.pathList.find(p => p.path === path);
      for (const mastery of this.purchasedMasteries) {
        if (pathEntry.masteries.includes(mastery.id)) {
          pathSet.add(pathEntry.name);
          break;
        }
      }
    }
    return Array.from(pathSet);
  }

  get currencyPaths() {
    const pathSet = new Set();
    const validPaths = [ENDGAME_MASTERY_PATH.INFINITY_POINTS, ENDGAME_MASTERY_PATH.ETERNITY_POINTS, ENDGAME_MASTERY_PATH.REALITY_MACHINES, ENDGAME_MASTERY_PATH.IMAGINARY_MACHINES];
    for (const path of validPaths) {
      const pathEntry = EndgameMasteries.pathList.find(p => p.path === path);
      for (const mastery of this.purchasedMasteries) {
        if (pathEntry.masteries.includes(mastery.id)) {
          pathSet.add(pathEntry.name);
          break;
        }
      }
    }
    return Array.from(pathSet);
  }

  get entanglementPaths() {
    const pathSet = new Set();
    const validPaths = [ENDGAME_MASTERY_PATH.ENDGAME_ENTANGLEMENT, ENDGAME_MASTERY_PATH.CELESTIAL_ENTANGLEMENT, ENDGAME_MASTERY_PATH.DIVINE_ENTANGLEMENT];
    for (const path of validPaths) {
      const pathEntry = EndgameMasteries.pathList.find(p => p.path === path);
      for (const mastery of this.purchasedMasteries) {
        if (pathEntry.masteries.includes(mastery.id)) {
          pathSet.add(pathEntry.name);
          break;
        }
      }
    }
    return Array.from(pathSet);
  }

  // Creates an export string based on all currently purchased masteries
  get exportString() {
    return `${this.purchasedMasteries
      .filter(s => s instanceof EndgameMasteryState)
      .map(s => s.id)
      .join(",")}|`;
  }
}
