import { IntervaledAutobuyerState } from "./autobuyer";

export class CelestialEternityAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.celestialEternity;
  }

  get name() {
    return `Celestial Eternity`;
  }

  get isUnlocked() {
    return CelestialEternityUpgrade.celEternityAuto.isBought;
  }

  get interval() {
    return 1000 / CelestialBreakInfinityUpgrade.betterAuto.effectOrDefault(1) / (CelestialEternityUpgrade.instaAutos.isBought ? 1e300 : 1);
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return CelestialEternityUpgrade.betterCelEternityAuto.isBought;
  }

  get increaseWithMult() {
    return this.data.increaseWithMult;
  }

  set increaseWithMult(value) {
    this.data.increaseWithMult = value;
  }

  get amount() {
    return this.data.amount;
  }

  // This is unused mechanically, but should be zero to suppress the "Current bulk:" text
  get bulk() {
    return 0;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xHighest() {
    return this.data.xHighest;
  }

  set xHighest(value) {
    this.data.xHighest = value;
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  get canTick() {
    return Currency.celestialInfinityPoints.gte(DC.NUMMAX) && super.canTick;
  }

  /*get resetTickOn() {
    return PRESTIGE_EVENT.CELESTIAL_REALITY;
  }*/

  get highestPrevPrestige() {
    return player.records.thisCelestialReality.maxCEP;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisCelestialEternityRealTime.totalSeconds.toNumber(), 0);
  }

  get willEternity() {
    switch (this.mode) {
      case AUTO_CELESTIAL_ETERNITY_MODE.AMOUNT:
        return gainedCelestialEternityPoints().gte(this.amount);
      case AUTO_CELESTIAL_ETERNITY_MODE.TIME:
        return Time.thisCelestialEternityRealTime.totalSeconds.toNumber() > this.time;
      case AUTO_CELESTIAL_ETERNITY_MODE.X_HIGHEST:
      default:
        return gainedCelestialEternityPoints().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    super.tick();
    if (this.willEternity) celestialEternityResetRequest(true);
  }

  reset() {
    super.reset();
    if (CelestialEternityUpgrade.betterCelEternityAuto.isBought) return;
    this.mode = AUTO_CELESTIAL_ETERNITY_MODE.AMOUNT;
  }
}
