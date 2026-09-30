export const Hadrons = {
  get hadrons() {
    return player.celestials.laitela.hadrons;
  },
  get timeFactor() {
    return DualityUpgrade(15).isBought ? Time.thisEndgameRealTime._ms.div(36000) : DC.D0;
  },
  get speedFactor() {
    return DC.D1.timesEffectsOf(Achievement(235), Achievement(247)).times(
      DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 1.25 : 1).times(
      DivinityMilestone.divineDimensions.isReached && !player.disablePostReality ? 1.25 : 1).div(
      1 - DivineDimensions.conversionFormula3).times(
      Decimal.pow(DivinityMilestone.finalRebirth.isReached && !player.disablePostReality ? 1.05 :
      (DivinityMilestone.pelleQoL.isReached && !player.disablePostReality ? 1.04 : 1.025), this.hadrons.totalExotic)).times(
      DivinityMilestone.celestialSurge.isReached && !player.disablePostReality ? 4 : 1).times(
      DivinityMilestone.finalRebirth.isReached && !player.disablePostReality ? 2 : 1).times(
      DivinityMilestone.ascendedSurge.isReached && !player.disablePostReality ? 4 : 1);
  },
  get singularityMultiplier() {
    let time = this.timeFactor.times(4).times(this.speedFactor);
    time = time.gte(100) ? time.sub(100).sqrt().add(100) : time;
    return DualityUpgrade(15).isBought && !player.disablePostReality ? Decimal.pow10(new Decimal(this.hadrons.totalLight).times(
      time.min((100 * Accelerators.emptiness.effectValue2 + EndgameMastery(251).effectOrDefault(0)) *
      (DivinityMilestone.serpentPower.isReached ? 2 : 1))).times(10)) : DC.D1;
  },
  get darkMatterCapMultiplier() {
    let time = this.timeFactor.times(2).times(this.speedFactor);
    time = time.gte(100) ? time.sub(100).sqrt().add(100) : time;
    return DualityUpgrade(16).isBought && !player.disablePostReality ? Decimal.pow10(new Decimal(this.hadrons.totalLight).times(
      time.min((100 * Accelerators.emptiness.effectValue2 + EndgameMastery(251).effectOrDefault(0)) *
      (DivinityMilestone.serpentPower.isReached ? 2 : 1))).times(100)) : DC.D1;
  },
  get darkEnergyAscensionBoost() {
    let time = this.timeFactor.times(this.speedFactor);
    time = time.gte(100) ? time.sub(100).sqrt().add(100) : time;
    return DualityUpgrade(17).isBought && !player.disablePostReality ? new Decimal(this.hadrons.totalLight).times(
      time.min((100 * Accelerators.emptiness.effectValue2 + EndgameMastery(251).effectOrDefault(0)) *
      (DivinityMilestone.serpentPower.isReached ? 2 : 1))) : DC.D0;
  },
  get entropyFormulaBoost() {
    let time = this.timeFactor.div(2).times(this.speedFactor);
    time = time.gte(100) ? time.sub(100).sqrt().add(100) : time;
    return DualityUpgrade(18).isBought && !player.disablePostReality ? Decimal.pow(Decimal.log10(
      time.max(1).min((100 * Accelerators.emptiness.effectValue2 + EndgameMastery(251).effectOrDefault(0)) *
      (DivinityMilestone.serpentPower.isReached ? 2 : 1)))
      .times(2).add(1), this.hadrons.totalLight) : DC.D1;
  },
  get continuumMultiplier() {
    let time = this.timeFactor.div(5).times(this.speedFactor);
    time = time.gte(100) ? time.sub(100).sqrt().add(100) : time;
    return DualityUpgrade(19).isBought && !player.disablePostReality ? Decimal.pow(Decimal.log10(
      time.max(1).min((100 * Accelerators.emptiness.effectValue2 + EndgameMastery(251).effectOrDefault(0)) *
      (DivinityMilestone.serpentPower.isReached ? 2 : 1))).div(10).times(
      1 + DualityUpgrade(21).effectOrDefault(0)).add(1), this.hadrons.totalDark) : DC.D1;
  }
};
