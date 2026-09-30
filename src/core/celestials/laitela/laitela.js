import { Quotes } from "../quotes";

import { DarkMatterDimensions } from "./dark-matter-dimension";

export const Laitela = {
  displayName: "Lai'tela",
  possessiveName: "Lai'tela's",
  get celestial() {
    return player.celestials.laitela;
  },
  get isUnlocked() {
    if (EndgameMilestone.celestialEarlyUnlock.isReached) return true;
    return ImaginaryUpgrade(15).isBought;
  },
  initializeRun() {
    clearCelestialRuns();
    this.celestial.run = true;
  },
  get isRunning() {
    return this.celestial.run;
  },
  get difficultyTier() {
    return player.celestials.laitela.difficultyTier;
  },
  set difficultyTier(tier) {
    player.celestials.laitela.difficultyTier = tier;
  },
  get maxAllowedDimension() {
    return 8 - this.difficultyTier;
  },
  get isFullyDestabilized() {
    return Laitela.maxAllowedDimension === 0;
  },
  get continuumUnlocked() {
    if (EndgameMilestone.celestialEarlyUnlock.isReached) return true;
    return ImaginaryUpgrade(15).isBought;
  },
  get continuumActive() {
    return this.continuumUnlocked && !player.auto.disableContinuum;
  },
  setContinuum(x) {
    player.auto.disableContinuum = !x;
    // If continuum is now not disabled (i.e. is enabled) we update the relevant requirement check.
    if (!player.auto.disableContinuum) {
      player.requirementChecks.reality.noContinuum = false;
      player.requirementChecks.endgame.noContinuum = false;
    }
  },
  get matterExtraPurchaseFactor() {
    if (Slabdrill.isCursed && SlabdrillUnlocks.infinityChallengeFour.isUnlocked) {
      return DC.D1.add(Slabdrill.power.max(1).log10().div(100));
    }
    if ((Pelle.isDoomed && !PelleDestructionUpgrade.continuumBuff.canBeApplied) || player.disablePostReality ||
      player.universes.current === 2) return DC.D1;
    return (Decimal.pow(Decimal.pow(new Decimal(Decimal.log10(Currency.darkMatter.max.add(1))).div(50), 0.4).times(0.5).add(1).times(
      SingularityMilestone.continuumMult.effectOrDefault(new Decimal(0)).add(1)).times(
      DualityUpgrade(11).effectOrDefault(1)).times(Hadrons.continuumMultiplier).timesEffectOf(
      SingularityMilestone.singContinuumBoost), DualityUpgrade(14).effectOrDefault(1))).times(
      BreakInfinityUpgrade.autobuyerSpeed.chargedEffect.effectOrDefault(1)).times(NormalChallenge(6).chargedEffect).times(
      NormalChallenge(9).chargedEffect);
  },
  get hadronizes() {
    return this.celestial.hadronizes;
  },
  get realityReward() {
    const fullLaitelaCompletion = Decimal.clampMin(Decimal.pow(100, 8).times(Decimal.pow(new Decimal(360).div(300), 2)), 1);
    const currentLaitelaProgress = Decimal.clampMin(Decimal.pow(100, this.difficultyTier).times(
      Decimal.pow(new Decimal(360).div(player.celestials.laitela.fastestCompletion), 2)), 1);
    return Decimal.pow(currentLaitelaProgress, this.hadronizes + 1).times(Decimal.pow(
      fullLaitelaCompletion, (this.hadronizes * (this.hadronizes + 1)) / 2)).powEffectOf(DualityUpgrade(28));
  },
  get realityRewardDE() {
    const fullDestabilization = this.isFullyDestabilized ? Decimal.pow(8, this.hadronizes + 1) : DC.D1;
    return Decimal.pow(8, (this.hadronizes * (this.hadronizes + 1)) / 2).times(fullDestabilization).powEffectOf(DualityUpgrade(28));
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    const maxSpeed = (ExpansionPack.laitelaPack.isBought && !player.disablePostReality) ? 1000 : 100;
    const hadronizeBump = this.hadronizes > 0 ? 1e12 : 1;
    const extraHadronizeBoost = DC.D1.times(Hadrons.entropyFormulaBoost).times(
      DivinityMilestone.firstDivine.isReached ? Decimal.log10(player.records.bestEndgame.galaxies.max(1)) : 1)
      .times(Accelerators.potency.effectValue2).times(
      DivinityMilestone.finalRebirth.isReached && !player.disablePostReality ? Time.thisEndgameRealTime.totalMinutes.pow(3).add(1) : 1)
      .timesEffectsOf(ResurgenceUpgrade.entropySurge, EndgameMastery(201), SingularityMilestone.continuumEntropyMult).pow(
      Achievements.powerConv(EndgameMastery(201).effectOrDefault(1)));
    const hadronizeAntimatter = Decimal.pow(1000, this.hadronizes).times(hadronizeBump).times(1e11).div(extraHadronizeBoost);
    return Decimal.clamp(Decimal.pow(new Decimal(Currency.antimatter.value.add(1).log10()).div(
      hadronizeAntimatter), 2), 0, maxSpeed).div(200);
  },
  get antimatterNeededToDestabilize() {
    const hadrBump = this.hadronizes > 0 ? 1e12 : 1;
    const extraHadrBoost = DC.D1.times(Hadrons.entropyFormulaBoost).times(
      DivinityMilestone.firstDivine.isReached ? Decimal.log10(player.records.bestEndgame.galaxies.max(1)) : 1)
      .times(Accelerators.potency.effectValue2).times(
      DivinityMilestone.finalRebirth.isReached && !player.disablePostReality ? Time.thisEndgameRealTime.totalMinutes.pow(3).add(1) : 1)
      .timesEffectsOf(ResurgenceUpgrade.entropySurge, EndgameMastery(201), SingularityMilestone.continuumEntropyMult).pow(
      Achievements.powerConv(EndgameMastery(201).effectOrDefault(1)));
    const hadrAM = Decimal.pow(1000, this.hadronizes).times(hadrBump).times(1e11).div(extraHadrBoost);
    const currRoot = (this.maxAllowedDimension === 0 ? DC.BEMAX : 8 / this.maxAllowedDimension);
    return Decimal.pow10(hadrAM).pow(Decimal.sqrt(20/3)).pow(currRoot);
  },
  get darkMatterMultGain() {
    const extraPow = (ExpansionPack.laitelaPack.isBought && !player.disablePostReality)
      ? Decimal.pow((Decimal.log10(Decimal.log10(Currency.darkMatter.value.add(1)).add(1)).add(1)).div(2), 2).add(1) : 1;
    return Decimal.pow(Decimal.pow(Currency.darkMatter.value.dividedBy(this.annihilationDMRequirement)
      .plus(1).log10(), 1.5).times(ImaginaryUpgrade(21).effectOrDefault(1)), extraPow);
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultRatio() {
    return (this.celestial.darkMatterMult.add(this.darkMatterMultGain)).div(this.celestial.darkMatterMult);
  },
  get darkMatterSoftcap1() {
    return DC.E10000.times(EtherealStars.white.reward).powEffectOf(EndgameMastery(262));
  },
  get darkMatterSoftcap2() {
    return DC.E100000.times(EtherealStars.white.reward).powEffectOf(EndgameMastery(262));
  },
  get darkMatterCap() {
    let baseCap = DC.NUMMAX;
    if (ImaginaryUpgrade(26).isBought) baseCap = DC.E1000;
    if (ImaginaryUpgrade(27).isBought) baseCap = DC.E4000;
    if (ImaginaryUpgrade(28).isBought) baseCap = DC.E20000;
    if (ImaginaryUpgrade(29).isBought) baseCap = DC.E100000;
    const realityReward = (ExpansionPack.laitelaPack.isBought && !player.disablePostReality) ? this.realityReward : 1;
    return baseCap.times(EndgameUpgrade(4).effectOrDefault(1)).times(realityReward).times(
      Hadrons.darkMatterCapMultiplier).times(EtherealStars.white.reward).powEffectOf(EndgameMastery(262));
  },
  get darkMatterOmegaSoftcap() {
    return Decimal.pow10(6.5625e10);
  },
  get annihilationUnlocked() {
    return ImaginaryUpgrade(19).isBought;
  },
  get annihilationDMRequirement() {
    return 1e60;
  },
  get canAnnihilate() {
    return Laitela.annihilationUnlocked && Currency.darkMatter.gte(this.annihilationDMRequirement);
  },
  annihilate(force) {
    if (!force && !this.canAnnihilate) return false;
    this.celestial.darkMatterMult = this.celestial.darkMatterMult.add(this.darkMatterMultGain);
    if (force || !DivinityMilestone.hadronEmpowerment.isReached) DarkMatterDimensions.reset();
    Laitela.quotes.annihilation.show();
    Achievement(176).unlock();
    return true;
  },
  // Greedily buys the cheapest available upgrade until none are affordable
  maxAllDMDimensions(maxTier) {
    // Note that tier is 1-indexed
    const unlockedDimensions = DarkMatterDimensions.all
      .filter(d => d.isUnlocked && d.tier <= maxTier);
    for (let i = 0; i < unlockedDimensions.length; i++) {
      unlockedDimensions[i].buyManyInterval(Infinity);
    }
    for (let i = 0; i < unlockedDimensions.length; i++) {
      unlockedDimensions[i].buyManyPowerDM(Infinity);
    }
    for (let i = 0; i < unlockedDimensions.length; i++) {
      unlockedDimensions[i].buyManyPowerDE(Infinity);
    }
  },
  hadronize() {
    if (!Laitela.isFullyDestabilized) return false;
    this.celestial.fastestCompletion = 3600;
    this.celestial.difficultyTier = 0;
    this.celestial.hadronizes += 1;
    if (DualityUpgrade(15).isBought) this.celestial.hadrons.total += 1;
    if (DualityUpgrade(15).isBought) this.celestial.hadrons.light += 1;
    if (DivinityMilestone.hadronEmpowerment.isReached) this.celestial.hadrons.dark += 1;
    return true;
  },
  reset() {
    this.annihilate(true);
    this.celestial.darkMatterMult = DC.D1;
    Currency.darkMatter.max = DC.D1;
    Currency.darkMatter.reset();
    Currency.unnerfedDarkMatter.reset();
    this.celestial.singularities = ExpansionPack.laitelaPack.isBought ? DC.E1 : DC.D0;
    this.celestial.singularityCapIncreases = DC.D0;
  },
  fullReset() {
    this.reset();
    this.celestial.fastestCompletion = 3600;
    this.celestial.difficultyTier = 0;
    this.celestial.hadronizes = 0;
    this.celestial.hadrons.total = 0;
    this.celestial.hadrons.light = 0;
    this.celestial.hadrons.dark = 0;
  },
  quotes: Quotes.laitela,
  symbol: "ᛝ"
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.laitela.isOpen) Laitela.quotes.unlock.show();
});
