import { IntervaledAutobuyerState } from "./autobuyer";

export class CelestialGalaxyAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.celestialGalaxy;
  }

  get name() {
    return `Celestial Galaxy`;
  }

  get isUnlocked() {
    return CelestialBreakInfinityUpgrade.autoCDPlus.isBought;
  }

  get interval() {
    let minValue = 1000 / CelestialBreakInfinityUpgrade.betterAuto.effectOrDefault(1) /
      (CelestialEternityUpgrade.instaAutos.isBought ? 1e300 : 1);
    return this.isBuyMaxUnlocked
      ? TimeSpan.fromSeconds(Decimal.max(this.buyMaxInterval, minValue / 1000)).totalMilliseconds.toNumber()
      : minValue;
  }

  get limitCelGalaxies() {
    return this.data.limitCelGalaxies;
  }

  set limitCelGalaxies(value) {
    this.data.limitCelGalaxies = value;
  }

  get maxCelGalaxies() {
    return this.data.maxCelGalaxies;
  }

  set maxCelGalaxies(value) {
    this.data.maxCelGalaxies = value;
  }

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return CelestialEternityUpgrade.bulkCelGalaxies.isBought;
  }

  get canTick() {
    return CelestialGalaxy.canBeBought && CelestialGalaxy.requirement.isSatisfied && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ENDGAME;
  }

  tick() {
    super.tick();
    const limit = this.limitCelGalaxies ? new Decimal(this.maxCelGalaxies) : DC.BEMAX;
    requestCelestialGalaxyReset(this.isBuyMaxUnlocked, limit);
  }
}
