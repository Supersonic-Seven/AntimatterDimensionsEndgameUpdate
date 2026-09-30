import { EndgameMastery } from "./endgame-mastery";
import { EndgameMasteriesState } from "./endgame-masteries";

export class PermanentEndgameMasteryState extends EndgameMasteriesState {
  constructor(config) {
    super(config, ENDGAME_MASTERY_TYPE.PERMANENT);
  }

  get isBought() {
    return player.endgameMasteries.permanentMasteries.includes(this.id);
  }

  get canBeBought() {
    return this.isAffordable && this.config.requirement();
  }

  get description() {
    return this.config.description;
  }

  get cost() {
    return typeof this.config.cost === "function" ? this.config.cost() : this.config.cost;
  }

  get totalEndgameSkillRequirement() {
    if (this.id === 3) return 20000000;
    if (this.id === 2) return 150000;
    if (this.id === 1) return 100;
    return 0;
  }

  purchase(quiet = false) {
    if (this.isBought || !this.canBeBought) return false;
    if (this.id === 1) {
      TabNotification.endgameUpgrades.tryTrigger();
      // ID 1 is the endgame upgrades unlock mastery
      if (!quiet) {
        Tab.endgame.upgrades.show();
      }
    }

    if (this.id == 2) {
      respecEndgameMasteries();
    }

    if (this.id === 4) {
      Modal.message.show(`This feature is not yet implemented. Please wait for updates.`, {}, 3);
    }

    player.endgameMasteries.permanentMasteries.push(this.id);
    Currency.endgameSkills.subtract(this.cost);
    return true;
  }
}

PermanentEndgameMasteryState.masteries = mapGameData(
  GameDatabase.endgame.permanentMasteries,
  config => new PermanentEndgameMasteryState(config)
);

/**
 * @type {PermanentEndgameMasteryState}
 */
export function PermanentEndgameMastery(id) {
  return PermanentEndgameMasteryState.masteries[id];
}

EndgameMastery.endgameUpgrades = PermanentEndgameMasteryState.masteries[1];

EndgameMastery.permaMasteries = PermanentEndgameMasteryState.masteries[2];

EndgameMastery.timeCompression = PermanentEndgameMasteryState.masteries[3];

EndgameMastery.celestialReality = PermanentEndgameMasteryState.masteries[4];

EndgameMastery.boughtEndgameUpgradesEM = function() {
  return player.endgameMasteries.permanentMasteries.map(id => PermanentEndgameMasteryState.masteries[id]);
};
