import { SetPurchasableMechanicState } from "./game-mechanics";

export class ResurgenceUpgradeState extends SetPurchasableMechanicState {
  get name() {
    return this.config.name;
  }
  
  get currency() {
    return Currency.divineEnergy;
  }

  get set() {
    return player.celestials.pelle.resurgenceUpgrades;
  }

  onPurchased() {
    this.config.onPurchased?.();
    if (this.config.id === "unl1") {
      TabNotification.extendMasteries.tryTrigger();
    }
    if (this.config.id === "unl2") {
      TabNotification.extendSingularityMilestones.tryTrigger();
    }
    if (this.config.id === "unl3") {
      TabNotification.extendGalacticPowers.tryTrigger();
    }
    if (this.config.id === "unl4") {
      TabNotification.ascension.tryTrigger();
    }
  }

  get isEffectActive() {
    return !player.disablePostReality && this.isBought;
  }
}

export const ResurgenceUpgrade = mapGameDataToObject(
  GameDatabase.celestials.resurgenceUpgrades,
  config => (config.rebuyable
    ? new ResurgenceUpgradeState(config)
    : new ResurgenceUpgradeState(config))
);

export const ResurgenceUpgrades = {
  all: ResurgenceUpgrade.all,
  get isUnlocked() {
    return DivinityUpgrade.divineL1U5.isBought;
  }
};
