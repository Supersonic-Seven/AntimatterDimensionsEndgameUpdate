import { IntervaledAutobuyerState } from "./autobuyer";

export class CelestialDimBoostAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.celestialDimBoost;
  }

  get name() {
    return `Celestial Dimension Boost`;
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

  get limitCelDimBoosts() {
    return this.data.limitCelDimBoosts;
  }

  set limitCelDimBoosts(value) {
    this.data.limitCelDimBoosts = value;
  }

  get maxCelDimBoosts() {
    return this.data.maxCelDimBoosts;
  }

  set maxCelDimBoosts(value) {
    this.data.maxCelDimBoosts = value;
  }

  get limitUntilCelGalaxies() {
    return this.data.limitUntilCelGalaxies;
  }

  set limitUntilCelGalaxies(value) {
    this.data.limitUntilCelGalaxies = value;
  }

  get celGalaxies() {
    return this.data.celGalaxies;
  }

  set celGalaxies(value) {
    this.data.celGalaxies = value;
  }

  get bulk() {
    return this.data.bulk;
  }

  set bulk(value) {
    this.data.bulk = value;
  }

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return CelestialBreakInfinityUpgrade.bulkCelDimBoosts.isBought;
  }

  get canTick() {
    return CelestialDimBoost.canBeBought && CelestialDimBoost.requirement.isSatisfied && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ENDGAME;
  }

  tick() {
    if (this.isBuyMaxUnlocked) {
      const galaxyCondition = !this.limitUntilCelGalaxies || player.endgame.celDimExpansion.galaxies.gte(this.celGalaxies);
      if (!galaxyCondition) return;
      requestCelestialDimensionBoost(true);
      super.tick();
      return;
    }

    const limitCondition = !this.limitCelDimBoosts || CelestialDimBoost.purchasedBoosts.lt(this.maxCelDimBoosts);
    const galaxyCondition = this.limitUntilCelGalaxies && player.endgame.celDimExpansion.galaxies.gte(this.celGalaxies);
    if (limitCondition || galaxyCondition) {
      requestCelestialDimensionBoost(false);
      super.tick();
    }
  }
}
