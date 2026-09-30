import { GameMechanicState } from "../game-mechanics";

// This is only ever called from manual player actions, which means we can immediately commit them to the game state
// eslint-disable-next-line complexity
export function buyMasteriesUntil(id) {
  let masteryArray = [];
  const lastInPrevRow = Math.floor(id / 10) * 10 - 1;
  const requestedPath = EndgameMastery(id).path;
  const currTree = GameCache.currentMasteryTree.value;
  // Makes an array [start, start+1, ... , end], empty if end < start
  const range = (start, end) => [...Array(Math.clampMin(end - start + 1, 0)).keys()].map(i => i + start);

  // If the player tries to buy a mastery which is immediately buyable, we try to buy it first in case buying other
  // masteries up to that point renders it unaffordable. Effectively the clicked mastery is higher priority than all others
  masteryArray.push(id);

  // Greddily buy all masteries before the compression split then try again; if the requested mastery was above the compression
  // split, then we're done and don't need to attempt to buy any more
  masteryArray.push(...range(11, Math.min(lastInPrevRow, 80)));
  masteryArray.push(id);

  if (id < 81) return masteryArray;

  // Priority for behavior when buying in the Compression split; we follow only the first applicable entry below:
  // - If we're buying a mastery within the split, we first buy just the requested path up to the requested mastery.
  //   (stops buying)
  // - If we can't buy any additional paths or have 4 paths available, we attempt to buy everything here, prioritizing
  //   preferred paths. With less than 4 paths available, this only purchases the rest of any unfinished paths
  //   (continues onward)
  // - If the player has a preferred path, we attempt to buy it (continues onward)
  // - If the player doesn't have a preferred path, we say so and do nothing (stops buying)
  // - Otherwise we do nothing (stops buying)
  if (id < 111) {
    masteryArray.push(...EndgameMasteries.paths[requestedPath].filter(s => (s <= id)));
    return masteryArray;
  }

  if (currTree.currCompPathCount === currTree.allowedCompPathCount || currTree.allowedCompPathCount === 4) {
    masteryArray.push(...EndgameMastery.preferredPaths.compression.masteries);
    masteryArray.push(...range(81, 104));
  } else if (EndgameMastery.preferredPaths.compression.path.length > 0) {
    masteryArray.push(...EndgameMastery.preferredPaths.compression.masteries);
  } else if (currTree.currCompPathCount < currTree.allowedCompPathCount) {
    GameUI.notify.error("You haven't selected enough preferred Compression paths.");
    return masteryArray;
  }

  masteryArray.push(...range(111, Math.min(id, 140)));
  if (id < 141) return masteryArray;

  // Priority for behavior when buying in the Compression split; we follow only the first applicable entry below:
  // - If we're buying a mastery within the split, we first buy just the requested path up to the requested mastery.
  //   (stops buying)
  // - If we can't buy any additional paths or have 4 paths available, we attempt to buy everything here, prioritizing
  //   preferred paths. With less than 4 paths available, this only purchases the rest of any unfinished paths
  //   (continues onward)
  // - If the player has a preferred path, we attempt to buy it (continues onward)
  // - If the player doesn't have a preferred path, we say so and do nothing (stops buying)
  // - Otherwise we do nothing (stops buying)
  // It's pretty much the same as the other split actually

  if (id < 161) {
    masteryArray.push(...EndgameMasteries.paths[requestedPath].filter(s => (s <= id)));
    return masteryArray;
  }

  if (currTree.currCurrPathCount === currTree.allowedCurrPathCount || currTree.allowedCurrPathCount === 4) {
    masteryArray.push(...EndgameMastery.preferredPaths.currency.masteries);
    masteryArray.push(...range(141, 154));
  } else if (EndgameMastery.preferredPaths.currency.path.length > 0) {
    masteryArray.push(...EndgameMastery.preferredPaths.currency.masteries);
  } else if (currTree.currCurrPathCount < currTree.allowedCurrPathCount) {
    GameUI.notify.error("You haven't selected enough preferred Currency paths.");
    return masteryArray;
  }

  // Buy most of the other masteries
  masteryArray.push(...range(161, Math.min(id, 280)));
  if (id < 281) return masteryArray;

  // Finish buying the masteries
  if (currTree.currEntanglePathCount === currTree.allowedEntanglePathCount || currTree.allowedEntanglePathCount === 3) {
    masteryArray.push(...EndgameMastery.preferredPaths.entanglement.masteries);
    masteryArray.push(...range(281, 303));
  } else if (EndgameMastery.preferredPaths.entanglement.path.length > 0) {
    masteryArray.push(...EndgameMastery.preferredPaths.entanglement.masteries);
  } else if (currTree.currEntanglePathCount < currTree.allowedEntanglePathCount) {
    GameUI.notify.error("You haven't selected enough preferred Entanglement paths.");
    return masteryArray;
  }

  return masteryArray;
}

export function respecEndgameMasteries() {
  for (const mastery of EndgameMastery.boughtEM()) {
    mastery.refund();
  }
  Currency.endgameSkills.add(masteryIncrease.entanglementCost());
  player.endgameMasteries.masteries = [];
  GameCache.endgameMasteries.invalidate();
  Tab.endgame.masteries.show();
  GameCache.currentMasteryTree.invalidate();
  player.endgameMasteries.maxSkills = player.endgameMasteries.skills.plus(EndgameSkills.calculateEndgameMasteriesCost());
}

export class EndgameMasteriesState extends GameMechanicState {
  constructor(config, type) {
    super(config);
    this.type = type;
  }

  get cost() {
    return typeof this.config.cost === "function" ? this.config.cost() : this.config.cost;
  }

  refund() {
    if ((!EndgameMastery.permaMasteries.isBought || this.id >= 180) && this.id < 280) Currency.endgameSkills.add(this.cost);
  }

  get isAffordable() {
    return Currency.endgameSkills.gte(this.cost);
  }

  get canBeBought() {
    return true;
  }
}
