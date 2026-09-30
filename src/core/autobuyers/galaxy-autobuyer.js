import { UpgradeableAutobuyerState } from "./autobuyer";

export class GalaxyAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.galaxy;
  }

  get name() {
    return `${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy`;
  }

  get isUnlocked() {
    if (LHC.voidRunning && NullUpgrade.limerick5.isBought) return true;
    if (Pelle.isDisabled("galaxyAutobuyer")) return false;
    return this.canBeUpgraded;
  }

  get canBeUpgraded() {
    return NormalChallenge(11).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.galaxy.interval;
  }

  get limitGalaxies() {
    return this.data.limitGalaxies;
  }

  set limitGalaxies(value) {
    this.data.limitGalaxies = value;
  }

  get maxGalaxies() {
    return this.data.maxGalaxies;
  }

  set maxGalaxies(value) {
    this.data.maxGalaxies = value;
  }

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxGalaxies.isReached;
  }

  get interval() {
    return this.isBuyMaxUnlocked
      ? TimeSpan.fromSeconds(new Decimal(this.buyMaxInterval)).totalMilliseconds.toNumber()
      : super.interval;
  }

  get canTick() {
    return Galaxy.canBeBought && Galaxy.requirement.isSatisfied && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.INFINITY;
  }

  tick() {
    super.tick();
    const limit = this.limitGalaxies ? new Decimal(this.maxGalaxies) : DC.BEMAX;
    requestGalaxyReset(this.isBuyMaxUnlocked, limit);
  }
}
