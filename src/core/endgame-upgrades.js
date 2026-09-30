import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics";

class EndgameUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return typeof this.config.name === "function" ? this.config.name() : this.config.name;
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.celestialPoints;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.endgame.upgradeBits;
  }

  set bits(value) {
    player.endgame.upgradeBits = value;
  }

  get hasPlayerLock() {
    return (player.endgame.reqLock & (1 << this.bitIndex)) !== 0;
  }

  set hasPlayerLock(value) {
    if (value) player.endgame.reqLock |= 1 << this.bitIndex;
    else player.endgame.reqLock &= ~(1 << this.bitIndex);
  }

  get isLockingMechanics() {
    const shouldBypass = this.config.bypassLock?.() ?? false;
    return this.hasPlayerLock && this.isPossible && !shouldBypass && !this.isAvailableForPurchase;
  }

  // Required to be changed this way to avoid direct prop mutation in Vue components
  setMechanicLock(value) {
    this.hasPlayerLock = value;
  }

  toggleMechanicLock() {
    this.hasPlayerLock = !this.hasPlayerLock;
  }

  // Note we don't actually show the modal if we already failed or unlocked it
  tryShowWarningModal(specialLockText) {
    if (this.isPossible && !this.isAvailableForPurchase) {
      Modal.upgradeLock.show({ upgrade: this, isImaginary: false, isDual: false, isEndgame: true, specialLockText });
    }
  }

  get isAvailableForPurchase() {
    return (player.endgame.upgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const endgameReached = PlayerProgress.endgameUnlocked() && EndgameMastery.endgameUpgrades.isBought;
    if (!endgameReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.endgame.upgReqs |= (1 << this.id);
    GameUI.notify.endgame(`You've unlocked a Endgame Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.ENDGAME_UPGRADE_BOUGHT);
    const id = this.id;
  }
}

class RebuyableEndgameUpgradeState extends RebuyableMechanicState {
  get name() {
    return typeof this.config.name === "function" ? this.config.name() : this.config.name;
  }

  get currency() {
    return Currency.celestialPoints;
  }

  get boughtAmount() {
    return player.endgame.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.endgame.rebuyables[this.id] = value;
  }

  bulkPurchase() {
    if (!this.isAffordable) return false;
    this.boughtAmount += getInverseHybridCostScaling(
      Currency.celestialPoints.value,
      1e100,
      this.config.initialCost,
      this.config.costMult,
      this.config.costMult / 10,
      DC.E309,
      1e3,
      this.config.initialCost * this.config.costMult
    ).sub(player.endgame.rebuyables[this.id]).toNumber();
    Currency.celestialPoints.subtract(getHybridCostScaling(
      player.endgame.rebuyables[this.id] - 1,
      1e100,
      this.config.initialCost,
      this.config.costMult,
      this.config.costMult / 10,
      DC.E309,
      1e3,
      this.config.initialCost * this.config.costMult
    ));
    return true;
  }
}

EndgameUpgradeState.index = mapGameData(
  GameDatabase.endgame.upgrades,
  config => (config.id < 6
    ? new RebuyableEndgameUpgradeState(config)
    : new EndgameUpgradeState(config))
);

/**
 * @param {number} id
 * @return {EndgameUpgradeState|RebuyableEndgameUpgradeState}
 */
export const EndgameUpgrade = id => EndgameUpgradeState.index[id];

export const EndgameUpgrades = {
  /**
   * @type {(EndgameUpgradeState|RebuyableEndgameUpgradeState)[]}
   */
  all: EndgameUpgradeState.index.compact(),
  get allBought() {
    return (player.endgame.upgradeBits >> 6) + 1 === 1 << (GameDatabase.endgame.upgrades.length - 5);
  },
  get isUnlocked() {
    return EndgameMastery.endgameUpgrades.isBought;
  }
};
