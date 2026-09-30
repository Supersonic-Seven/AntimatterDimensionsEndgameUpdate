import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics";

class DualityUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.dualMachines;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.reality.dualityUpgradeBits;
  }

  set bits(value) {
    player.reality.dualityUpgradeBits = value;
  }

  get hasPlayerLock() {
    return (player.reality.reqLock.dual & (1 << this.bitIndex)) !== 0;
  }

  set hasPlayerLock(value) {
    if (value) player.reality.reqLock.dual |= 1 << this.bitIndex;
    else player.reality.reqLock.dual &= ~(1 << this.bitIndex);
  }

  get isLockingMechanics() {
    return this.hasPlayerLock && this.isPossible && !this.isAvailableForPurchase;
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
      Modal.upgradeLock.show({ upgrade: this, isImaginary: false, isDual: true, isEndgame: false, specialLockText });
    }
  }

  get isAvailableForPurchase() {
    return (player.reality.dualityUpgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  get canBeApplied() {
    return super.canBeApplied;
  }

  tryUnlock() {
    if (!MachineHandler.isDMUnlocked || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.reality.dualityUpgReqs |= (1 << this.id);
    GameUI.notify.reality(`You've unlocked a Duality Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_BOUGHT);
    if (this.id === 15) {
      player.celestials.laitela.hadrons.total = Laitela.hadronizes;
      player.celestials.laitela.hadrons.light = Laitela.hadronizes;
      TabNotification.hadrons.tryTrigger();
    }
    if (this.id === 25) {
      TabNotification.hypercubes.tryTrigger();
    }
  }
}

class RebuyableDualityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.dualMachines;
  }

  get boughtAmount() {
    return player.reality.dualityRebuyables[this.id];
  }

  get canBeApplied() {
    return super.canBeApplied;
  }

  set boughtAmount(value) {
    player.reality.dualityRebuyables[this.id] = value;
  }

  onPurchased() {
    if (this.id === 7) {
      GameCache.staticGlyphWeights.invalidate();
    }
  }

  bulkPurchase() {
    if (!this.isAffordable) return false;
    this.boughtAmount += getInverseHybridCostScaling(
      Currency.dualMachines.value,
      1e20,
      this.config.initialCost,
      this.config.costMult,
      this.config.costMult,
      DC.E309,
      1e3,
      this.config.costMult
    ).sub(player.reality.dualityRebuyables[this.id]).toNumber();
    Currency.dualMachines.subtract(getHybridCostScaling(
      player.reality.dualityRebuyables[this.id] - 1,
      1e20,
      this.config.initialCost,
      this.config.costMult,
      this.config.costMult,
      DC.E309,
      1e3,
      this.config.costMult
    ));
    return true;
  }
}

DualityUpgradeState.index = mapGameData(
  GameDatabase.reality.dualityUpgrades,
  config => (config.id <= 10
    ? new RebuyableDualityUpgradeState(config)
    : new DualityUpgradeState(config))
);

export const DualityUpgrade = id => DualityUpgradeState.index[id];

export const DualityUpgrades = {
  all: DualityUpgradeState.index.compact(),
  get totalRebuyables() {
    const rebuyables = player.reality.dualityRebuyables;
    let total = 0;
    for (const i in rebuyables) total += rebuyables[i];
    return total;
  },
  get totalSinglePurchase() {
    return this.all.countWhere(u => u.isBought);
  },
  get allBought() {
    return (player.reality.dualityUpgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.dualityUpgrades.length - 5);
  }
};
