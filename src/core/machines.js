export const MachineHandler = {
  get baseRMCap() { return DC.E1000; },

  get baseHardcapRM() {
    let effectMultipliers = DC.D1;
    if (ExpansionPack.teresaPack.isBought && !player.disablePostReality) effectMultipliers = effectMultipliers.timesEffectsOf(PerkShopUpgrade.rmMult);
    if (ExpansionPack.teresaPack.isBought && !player.disablePostReality && !Alpha.isDestroyed) effectMultipliers = effectMultipliers.times(Teresa.rmMultiplier);
    if (EffarigUnlock.endgame.canBeApplied) effectMultipliers = effectMultipliers.times(getAdjustedGlyphEffect("effarigrm"));
    const smallBoost = DC.D1.timesEffectsOf(EndgameMastery(153));
    const largeBoost = DC.D1.timesEffectsOf(SingularityMilestone.rmCap, Ra.unlocks.realityMachineCap).times(DivineDimensions.conversionFormula2).timesEffectOf(ResurgenceUpgrade.machineSurge);
    return Decimal.pow(this.baseRMCap.times(effectMultipliers).times(
      Decimal.pow(ImaginaryUpgrade(6).effectOrDefault(1), smallBoost)), largeBoost).times(
      ResurgenceUpgrade.rmSurge.isBought && !player.disablePostReality ? player.realities : 1).powEffectOf(CompressionUpgrade.entanglementSplit);
  },

  get hardcapRM() {
    const rmHardcap = this.baseHardcapRM;
    return Alpha.isDestroyed ? rmHardcap.pow(this.uncappedRM.div(rmHardcap).add(1).log10().add(1).log10().add(1).log10().add(1)).times(Teresa.rmMultiplier) : rmHardcap;
  },

  get distanceToRMCap() {
    return this.hardcapRM.minus(Currency.realityMachines.value);
  },

  get realityMachineMultiplier() {
    return new Decimal(ShopPurchase.RMPurchases.currentMult).timesEffectOf(PerkShopUpgrade.rmMult).times(
      getAdjustedGlyphEffect("effarigrm")).times(Achievement(167).effectOrDefault(1));
  },

  get uncappedRM() {
    let log10FinalEP = player.records.thisReality.maxEP.plus(gainedEternityPoints()).add(1).log10();
    if (!PlayerProgress.realityUnlocked()) {
      if (log10FinalEP.gt(8000)) log10FinalEP = new Decimal(8000);
      if (log10FinalEP.gt(6000)) log10FinalEP = log10FinalEP.sub((log10FinalEP.sub(6000)).times(0.75));
    }
    let rmGain = DC.E3.pow(log10FinalEP.div(4000).sub(1));
    // Increase base RM gain if <10 RM
    if (rmGain.gte(1) && rmGain.lt(10)) rmGain = new Decimal(27).div(4000).times(log10FinalEP).sub(26);
    rmGain = rmGain.times(this.realityMachineMultiplier);
    rmGain = rmGain.times(Teresa.rmMultiplier);
    if (EndgameMastery(143).isBought) {
      rmGain = rmGain.powEffectsOf(EndgameMastery(143));
    }
    rmGain = rmGain.pow(DivineDimensions.conversionFormula2);
    rmGain = rmGain.times(ResurgenceUpgrade.rmSurge.isBought && !player.disablePostReality ? player.realities : 1);
    rmGain = rmGain.powEffectOf(CompressionUpgrade.entanglementSplit);
    return rmGain.floor();
  },

  get gainedRealityMachines() {
    return this.uncappedRM.clampMax(this.hardcapRM);
  },

  get isIMUnlocked() {
    return Currency.realityMachines.value.gte(this.hardcapRM) || Currency.imaginaryMachines.gt(0);
  },

  get baseIMCap() {
    const uncappedRM = this.uncappedRM;
    if (Pelle.isDoomed) return new Decimal(1.6e15);
    return Decimal.min((Decimal.pow(Decimal.clampMin(new Decimal(uncappedRM.add(1).log10()).sub(1000), 0), 2).times(
      Decimal.pow(Decimal.clampMin(new Decimal(uncappedRM.add(1).log10()).sub(100000), 1), 0.2)).times(
      Decimal.pow(Decimal.clampMin(new Decimal(uncappedRM.add(1).log10()).div(1000000000), 1),
      new Decimal(Decimal.log10(uncappedRM.add(1).log10())).div(7.5)))).pow(
      new Decimal(Effects.product(EndgameMastery(144), Ra.unlocks.imaginaryMachines, Ra.unlocks.imaginaryMachineEternityPower)).times(
      Decimal.max(Decimal.log10(uncappedRM.add(1).log10()).sub(45), 0).div(10).add(1)).times(
      EtherealStars.green.reward).times(DivineDimensions.conversionFormula2).timesEffectsOf(
      ResurgenceUpgrade.imSurge, ResurgenceUpgrade.machineSurge, CompressionUpgrade.entanglementSplit)), this.hardcapIM);
  },

  get baseIMHardcap() {
    return DC.E1000;
  },

  get baseHardcapIM() {
    return this.baseIMHardcap.times(DualityUpgrade(6).effectOrDefault(1)).pow(EtherealStars.green.reward.times(
      DivineDimensions.conversionFormula2).timesEffectsOf(
      ResurgenceUpgrade.imSurge, ResurgenceUpgrade.machineSurge, CompressionUpgrade.entanglementSplit));
  },

  get hardcapIM() {
    const imHardcap = this.baseHardcapIM;
    return Alpha.isDestroyed ? imHardcap.pow(this.uncappedIM.div(imHardcap).add(1).log10().add(1).log10().add(1).log10().add(1)) : imHardcap;
  },

  get uncappedIM() {
    const uncappedRM = this.uncappedRM;
    return Pelle.isDoomed
      ? new Decimal(1.6e15)
      : (Decimal.pow(Decimal.clampMin(new Decimal(uncappedRM.add(1).log10()).sub(1000), 0), 2).times(
        Decimal.pow(Decimal.clampMin(new Decimal(uncappedRM.add(1).log10()).sub(100000), 1), 0.2)).times(
        Decimal.pow(Decimal.clampMin(new Decimal(uncappedRM.add(1).log10()).div(1000000000), 1),
        new Decimal(Decimal.log10(uncappedRM.add(1).log10())).div(7.5)))).pow(
        new Decimal(Effects.product(EndgameMastery(144), Ra.unlocks.imaginaryMachines, Ra.unlocks.imaginaryMachineEternityPower)).times(
        Decimal.max(Decimal.log10(uncappedRM.add(1).log10()).sub(45), 0).div(10).add(1)).times(
        EtherealStars.green.reward).times(DivineDimensions.conversionFormula2).timesEffectsOf(
        ResurgenceUpgrade.imSurge, ResurgenceUpgrade.machineSurge, CompressionUpgrade.entanglementSplit));
  },

  get currentIMCap() {
    return Decimal.min(player.reality.iMCap.times(ImaginaryUpgrade(13).effectOrDefault(1)), this.hardcapIM);
  },

  // This is iM cap based on in-game values at that instant, may be lower than the actual cap
  get projectedIMCap() {
    return Decimal.min(this.baseIMCap.times(ImaginaryUpgrade(13).effectOrDefault(1)), this.hardcapIM);
  },

  // Use iMCap to store the base cap; applying multipliers separately avoids some design issues the 3xTP upgrade has
  updateIMCap() {
    if (this.uncappedRM.gte(this.baseRMCap)) {
      if (this.baseIMCap.gt(player.reality.iMCap)) {
        player.records.bestReality.iMCapSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
        player.reality.iMCap = this.baseIMCap;
      }
    }
  },

  // Time in seconds to reduce the missing amount by a factor of two
  get scaleTimeForIM() {
    return 60 / ImaginaryUpgrade(20).effectOrDefault(1);
  },

  gainedImaginaryMachines(diff) {
    return (this.currentIMCap.sub(Currency.imaginaryMachines.value)).times(
      new Decimal(1).sub(Decimal.pow(2, new Decimal(0).sub(diff).div(1000).div(this.scaleTimeForIM))));
  },

  estimateIMTimer(cost) {
    const imCap = this.currentIMCap;
    if (imCap.lte(cost)) return Infinity;
    const currentIM = Currency.imaginaryMachines.value;
    // This is doing log(a, 1/2) - log(b, 1/2) where a is % left to imCap of cost and b is % left to imCap of current
    // iM. log(1 - x, 1/2) should be able to estimate the time taken for iM to increase from 0 to imCap * x since every
    // fixed interval the difference between current iM to max iM should decrease by a factor of 1/2.
    return Decimal.max(0, new Decimal(Decimal.log2(imCap.div(imCap.sub(cost)))).sub(
      Decimal.log2(imCap.div(imCap.sub(currentIM))))).times(this.scaleTimeForIM);
  },

  get isDMUnlocked() {
    return Currency.imaginaryMachines.value.gte(this.hardcapIM) || Currency.dualMachines.gt(0);
  },

  get baseDMCap() {
    const uncappedRM = this.uncappedRM;
    return Decimal.min(Decimal.pow(Decimal.clampMin(this.uncappedIM.add(1).log10().sub(1000), 0), Decimal.clampMin(
      Decimal.log10(Currency.realityMachines.value.add(1).log10().add(1)).sub(3).min(2).times(
      Decimal.log10(Currency.realityMachines.value.add(1).log10().add(1)).div(5).max(1).pow(0.5)), 1).times(
      Decimal.clampMin(Decimal.log10(Decimal.log10(Decimal.log10(uncappedRM.add(1)).add(1)).add(1)).sub(
      1.75).times(12).min(0.6).add(1), 1).add(Decimal.clampMin(Decimal.log10(Decimal.log10(Decimal.log10(
      uncappedRM.add(1)).add(1)).add(1)).sub(1.8).times(4).min(0.6), 0)).add(Decimal.clampMin(
      Decimal.log10(Decimal.log10(Decimal.log10(uncappedRM.add(1)).add(1)).add(1)).sub(1.95).times(2), 0))).times(
      DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 1.1 : 1).times(
      DivineDimensions.conversionFormula2).timesEffectsOf(
      ResurgenceUpgrade.machineSurge, EndgameMastery(213), CompressionUpgrade.entanglementSplit)).timesEffectOf(
      EndgameMastery(223)), this.hardcapDM);
  },

  get baseDMHardcap() {
    return DC.E1000;
  },

  get baseHardcapDM() {
    return this.baseDMHardcap;
  },

  get hardcapDM() {
    return this.baseHardcapDM;
  },

  get uncappedDM() {
    const uncappedRM = this.uncappedRM;
    return Decimal.pow(Decimal.clampMin(this.uncappedIM.add(1).log10().sub(1000), 0), Decimal.clampMin(
      Decimal.log10(Currency.realityMachines.value.add(1).log10().add(1)).sub(3).min(2).times(
      Decimal.log10(Currency.realityMachines.value.add(1).log10().add(1)).div(5).max(1).pow(0.5)), 1).times(
      Decimal.clampMin(Decimal.log10(Decimal.log10(Decimal.log10(uncappedRM.add(1)).add(1)).add(1)).sub(
      1.75).times(12).min(0.6).add(1), 1).add(Decimal.clampMin(Decimal.log10(Decimal.log10(Decimal.log10(
      uncappedRM.add(1)).add(1)).add(1)).sub(1.8).times(4).min(0.6), 0)).add(Decimal.clampMin(
      Decimal.log10(Decimal.log10(Decimal.log10(uncappedRM.add(1)).add(1)).add(1)).sub(1.95).times(2), 0))).times(
      DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 1.1 : 1).times(
      DivineDimensions.conversionFormula2).timesEffectsOf(
      ResurgenceUpgrade.machineSurge, EndgameMastery(213), CompressionUpgrade.entanglementSplit)).timesEffectOf(
      EndgameMastery(223));
  },

  get currentDMCap() {
    return Decimal.min(player.reality.jMCap.times(DualityUpgrade(13).effectOrDefault(1)), this.hardcapDM);
  },

  // This is jM cap based on in-game values at that instant, may be lower than the actual cap
  get projectedDMCap() {
    return Decimal.min(this.baseDMCap.times(DualityUpgrade(13).effectOrDefault(1)), this.hardcapDM);
  },

  // Use DMCap to store the base cap; applying multipliers separately avoids some design issues the 3xTP upgrade has
  updateDMCap() {
    if (this.uncappedIM.gte(this.baseIMCap)) {
      if (this.baseDMCap.gt(player.reality.jMCap)) {
        player.reality.jMCap = this.baseDMCap;
      }
    }
  },

  // Time in seconds to reduce the missing amount by a factor of two
  get scaleTimeForDM() {
    return ((600 / DualityUpgrade(20).effectOrDefault(1)) / (DivinityUpgrade.divineL1U10.isBought ? 2 : 1)) /
      EndgameMastery(233).effectOrDefault(1);
  },

  gainedDualMachines(diff) {
    return (this.currentDMCap.sub(Currency.dualMachines.value)).times(
      new Decimal(1).sub(Decimal.pow(2, new Decimal(0).sub(diff).div(1000).div(this.scaleTimeForDM))));
  },

  estimateDMTimer(cost) {
    const jmCap = this.currentDMCap;
    if (jmCap.lte(cost)) return Infinity;
    const currentDM = Currency.dualMachines.value;
    // This is doing log(a, 1/2) - log(b, 1/2) where a is % left to jmCap of cost and b is % left to jmCap of current
    // jM. log(1 - x, 1/2) should be able to estimate the time taken for jM to increase from 0 to jmCap * x since every
    // fixed interval the difference between current jM to max jM should decrease by a factor of 1/2.
    return Decimal.max(0, new Decimal(Decimal.log2(jmCap.div(jmCap.sub(cost)))).sub(
      Decimal.log2(jmCap.div(jmCap.sub(currentDM))))).times(this.scaleTimeForDM);
  }
};
