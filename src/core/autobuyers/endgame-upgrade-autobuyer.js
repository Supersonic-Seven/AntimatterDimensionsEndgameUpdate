import { AutobuyerState } from "./autobuyer";

export class EndgameUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return EndgameUpgrade(this.id).name;
  }

  get data() {
    return player.auto.endgameUpgrades.all[this.id - 1];
  }

  get isUnlocked() {
    return DivinityMilestone.ascendedSurge.isReached && !player.disablePostReality;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const upg = EndgameUpgrade(this.id);
    upg.bulkPurchase();
  }

  static get entryCount() { return 5; }
  static get autobuyerGroupName() { return "Endgame Upgrade"; }
  static get isActive() { return player.auto.endgameUpgrades.isActive; }
  static set isActive(value) { player.auto.endgameUpgrades.isActive = value; }
}
