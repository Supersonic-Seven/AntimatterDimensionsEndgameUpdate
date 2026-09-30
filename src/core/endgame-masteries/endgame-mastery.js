import { EndgameMasteriesState } from "./endgame-masteries";

export const EndgameMasteries = {
  get pathList() {
    let pathArr = [];
    if (player.universes.current === 2) {
      pathArr.push({ path: ENDGAME_MASTERY_PATH.ANTIMATTER_DIM_COMPRESSION, masteries: [81, 91, 101], name: "MD Compression" });
    } else {
      pathArr.push({ path: ENDGAME_MASTERY_PATH.ANTIMATTER_DIM_COMPRESSION, masteries: [81, 91, 101], name: "AD Compression" });
    }
    pathArr.push({ path: ENDGAME_MASTERY_PATH.INFINITY_DIM_COMPRESSION, masteries: [82, 92, 102], name: "ID Compression" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.TIME_DIM_COMPRESSION, masteries: [83, 93, 103], name: "TD Compression" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.CELESTIAL_DIM_COMPRESSION, masteries: [84, 94, 104], name: "CD Compression" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.INFINITY_POINTS, masteries: [141, 151], name: "IP" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.ETERNITY_POINTS, masteries: [142, 152], name: "EP" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.REALITY_MACHINES, masteries: [143, 153], name: "RM" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.IMAGINARY_MACHINES, masteries: [144, 154], name: "iM" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.ENDGAME_ENTANGLEMENT, masteries: [281, 291, 301], name: "Endgame Entanglement" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.CELESTIAL_ENTANGLEMENT, masteries: [282, 292, 302], name: "Celestial Entanglement" });
    pathArr.push({ path: ENDGAME_MASTERY_PATH.DIVINE_ENTANGLEMENT, masteries: [283, 293, 303], name: "Divine Entanglement" });
    return pathArr;
  }
};

EndgameMasteries.paths = EndgameMasteries.pathList.mapToObject(e => e.path, e => e.masteries);

export class EndgameMasteryState extends EndgameMasteriesState {
  constructor(config) {
    const type = ENDGAME_MASTERY_TYPE.NORMAL;
    super(config, type);
    const path = EndgameMasteries.pathList.find(p => p.masteries.includes(this.id));
    this._path = path?.path ?? ENDGAME_MASTERY_PATH.NONE;
  }

  get isUnlocked() {
    return this.config.unlocked?.() ?? true;
  }

  get isBought() {
    return GameCache.endgameMasteries.value[this.id];
  }

  checkRequirement() {
    const check = req => (typeof req === "number"
      ? EndgameMastery(req).isBought
      : req());
    const currTree = GameCache.currentMasteryTree.value;
    switch (this.config.reqType) {
      case EM_REQUIREMENT_TYPE.AT_LEAST_ONE:
        return this.config.requirement.some(r => check(r));
      case EM_REQUIREMENT_TYPE.ALL:
        return this.config.requirement.every(r => check(r));
      case EM_REQUIREMENT_TYPE.COMPRESSION_PATH:
        return this.config.requirement.every(r => check(r)) && currTree &&
          currTree.currCompPathCount < currTree.allowedCompPathCount;
      case EM_REQUIREMENT_TYPE.CURRENCY_PATH:
        return this.config.requirement.every(r => check(r)) && currTree &&
          currTree.currCurrPathCount < currTree.allowedCurrPathCount;
      case EM_REQUIREMENT_TYPE.EXPANDED:
        return EndgameMastery.permaMasteries.isBought && this.config.requirement.every(r => check(r));
      case EM_REQUIREMENT_TYPE.ENTANGLEMENT:
        return EndgameMastery.timeCompression.isBought &&
          this.config.requirement.every(r => check(r)) && currTree &&
          currTree.currEntanglePathCount < currTree.allowedEntanglePathCount;
      default:
        throw Error(`Unrecognized EM requirement type: ${this.reqType}`);
    }
  }

  checkSetRequirement() {
    return true;
  }

  get canBeBought() {
    return this.checkRequirement() && this.checkSetRequirement();
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (this.isBought || !this.isAffordable || !this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    if (this.id >= 280) Currency.endgameSkills.subtract(this.cost);
    player.endgameMasteries.masteries.push(this.id);
    if (this.id >= 280) {
      player.endgameMasteries.maxSkills = player.endgameMasteries.skills.plus(EndgameSkills.calculateEndgameMasteriesCost());
    }
    if ((!EndgameMastery.permaMasteries.isBought || this.id >= 180) && this.id < 280) Currency.endgameSkills.subtract(this.cost);
    GameCache.endgameMasteries.invalidate();
    EndgameMasteryTree.commitToGameState([EndgameMastery(this.id)]);
    this.onPurchased();
    return true;
  }

  purchaseUntil() {
    EndgameMasteryTree.commitToGameState(buyMasteriesUntil(this.id));
  }

  get path() {
    return this._path;
  }

  onPurchased() {
    const id = this.id;
    if (id === 31 && Currency.realities.value.lt(100)) {
      Currency.realities.value = DC.E2;
    }
    if (id === 32 && Currency.realityMachines.value.lt(1000000)) {
      Currency.realityMachines.value.eq(1000000);
    }
    if (id === 42) {
      player.blackHole[0].unlocked = true;
      player.blackHole[1].unlocked = true;
      player.reality.upgradeBits = 67108800;
      player.reality.upgReqs = 67108800;
      if (player.reality.rebuyables[1] < 1) player.reality.rebuyables[1] = 1;
      if (player.reality.rebuyables[2] < 1) player.reality.rebuyables[2] = 1;
      if (player.reality.rebuyables[3] < 1) player.reality.rebuyables[3] = 1;
      if (player.reality.rebuyables[4] < 1) player.reality.rebuyables[4] = 1;
      if (player.reality.rebuyables[5] < 1) player.reality.rebuyables[5] = 1;
      Achievement(142).unlock();
      Achievement(144).unlock();
      Achievement(147).unlock();
      applyRUPG10();
    }
    if (id === 71) {
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.endgameGlyph(type));
    }
  }
}

EndgameMasteryState.masteries = mapGameData(
  GameDatabase.endgame.masteries,
  config => new EndgameMasteryState(config)
);

EndgameMasteryState.all = EndgameMasteryState.masteries.filter(e => e !== undefined);

/**
 * @returns {EndgameMasteryState}
 */
export function EndgameMastery(id) {
  return EndgameMasteryState.masteries[id];
}

/**
 * @returns {EndgameMasteryState[]}
 */
EndgameMastery.boughtEM = function() {
  return player.endgameMasteries.masteries.map(id => EndgameMastery(id));
};

EndgameMastery.preferredPaths = {
  compression: {
    get path() {
      return player.endgameMasteries.preferredPaths[0];
    },
    set path(value) {
      const options = [1, 2, 3, 4];
      player.endgameMasteries.preferredPaths[0] = value.filter(id => options.includes(id));
    },
    get masteries() {
      return player.endgameMasteries.preferredPaths[0].flatMap(path => EndgameMasteries.paths[path]);
    },
    get usePriority() {
      return this.path.length > 1;
    }
  },
  currency: {
    get path() {
      return player.endgameMasteries.preferredPaths[1];
    },
    set path(value) {
      const options = [5, 6, 7, 8];
      player.endgameMasteries.preferredPaths[1] = value.filter(id => options.includes(id));
    },
    get masteries() {
      return player.endgameMasteries.preferredPaths[1].flatMap(path => EndgameMasteries.paths[path]);
    },
    get usePriority() {
      return this.path.length > 1;
    }
  },
  entanglement: {
    get path() {
      return player.endgameMasteries.preferredPaths[2];
    },
    set path(value) {
      const options = [9, 10, 11];
      player.endgameMasteries.preferredPaths[2] = value.filter(id => options.includes(id));
    },
    get masteries() {
      return player.endgameMasteries.preferredPaths[2].flatMap(path => EndgameMasteries.paths[path]);
    },
    get usePriority() {
      return this.path.length > 1;
    }
  }
};

export const masteryIncrease = {
  entanglement: () => Math.pow(2, EndgameMastery.boughtEM().countWhere(e => e.id > 280 && e.id < 310)),
  entanglementCost: () => Math.pow(2, EndgameMastery.boughtEM().countWhere(e => e.id > 280 && e.id < 310)) * 1e6 - 1e6
}
