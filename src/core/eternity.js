import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

function giveEternityRewards(auto) {
  player.records.bestEternity.time = Decimal.min(player.records.thisEternity.time, player.records.bestEternity.time);
  player.records.bestEternity.realTime = Math.clamp(player.records.thisEternity.realTime, 1, player.records.bestEternity.realTime);
  Currency.eternityPoints.add(gainedEternityPoints());

  const newEternities = gainedEternities();

  if (Currency.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  Currency.eternities.add(newEternities);

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion(false);
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion(false);
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.challenge.eternity.requirementBits &= ~(1 << challenge.id);
    respecTimeStudies(auto);
  }

  addEternityTime(
    player.records.thisEternity.time,
    player.records.thisEternity.realTime,
    gainedEternityPoints(),
    newEternities
  );

  player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
    newEternities.div(Math.clampMin(33, player.records.thisEternity.realTime))
  );
  player.records.bestEternity.bestEPminReality =
    player.records.bestEternity.bestEPminReality.max(player.records.thisEternity.bestEPmin);

  Currency.infinitiesBanked.value = Currency.infinitiesBanked.value.plusEffectsOf(
    Achievement(131).effects.bankedInfinitiesGain,
    TimeStudy(191).effects.bankedInfinitiesGain,
  );

  if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked) {
    EffarigUnlock.eternity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function eternityAnimation() {
  FullScreenAnimationHandler.display("a-eternify", 3);
}

export function eternityResetRequest() {
  if (!Player.canEternity) return;
  if (GameEnd.creditsEverClosed) return;
  askEternityConfirmation();
}

export function eternity(force, auto, specialConditions = {}) {
  if (Alpha.isRunning && Alpha.currentStage < 11) return;
  if (specialConditions.switchingDilation && !Player.canEternity) {
    // eslint-disable-next-line no-param-reassign
    force = true;
  }
  // We define this variable so we can use it in checking whether to give
  // the secret achievement for respec without studies.
  // Annoyingly, we need to check for studies right here; giveEternityRewards removes studies if we're in an EC,
  // so doing the check later doesn't give us the initial state of having studies or not.
  const noStudies = player.timestudy.studies.length === 0;
  if (!force) {
    if (!Player.canEternity) return false;
    if (RealityUpgrade(10).isLockingMechanics) {
      RealityUpgrade(10).tryShowWarningModal();
      return false;
    }
    if (RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) {
      RealityUpgrade(12).tryShowWarningModal();
      return false;
    }
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    giveEternityRewards(auto);
    player.requirementChecks.reality.noEternities = false;
  }

  if (player.dilation.active) rewardTP();

  // This needs to be after the dilation check for the "can gain TP" check in rewardTP to be correct.
  if (force) {
    player.challenge.eternity.current = 0;
  }

  initializeChallengeCompletions();
  initializeResourcesAfterEternity();

  if ((!EternityMilestone.keepAutobuyers.isReached && !(Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied)) && !(LHC.voidRunning && NullUpgrade.alwaysBroken.isBought)) {
    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    player.break = false;
  }

  player.challenge.eternity.current = 0;
  if (!specialConditions.enteringEC && (!Pelle.isDoomed || PelleStrikes.dilation.isDestroyed())) {
    player.dilation.active = false;
  }
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.resetUpToNine();

  if (!specialConditions.enteringEC && player.respec) {
    if (noStudies) {
      SecretAchievement(34).unlock();
    }
    respecTimeStudies(auto);
    player.respec = false;
  }

  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  applyEU1();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  Currency.antimatter.reset();
  ECTimeStudyState.invalidateCachedRequirements();

  PelleStrikes.eternity.trigger();

  if (Alpha.isRunning && Alpha.currentStage === 11) {
    Alpha.advanceLayer();
    Alpha.quotes.eternity.show();
  }

  for (let c = 1; c < 13; c++) {
    if (Alpha.isRunning && Alpha.currentStage === 16 && EternityChallenge(c).completions >= 1) {
      Alpha.advanceLayer();
      Alpha.quotes.firstEternityChall.show();
    }
    if (Alpha.isRunning && Alpha.currentStage === 17 && EternityChallenge(c).completions >= 5) {
      Alpha.advanceLayer();
      Alpha.quotes.bulkEternityChall.show();
    }
  }

  if (Alpha.isRunning && Alpha.currentStage === 19 && EternityChallenge(10).completions >= 1) {
    Alpha.advanceLayer();
    Alpha.quotes.eternityChallTen.show();
  }

  if (Alpha.isRunning && Alpha.currentStage === 22 && EternityChallenge(11).completions >= 5) {
    Alpha.advanceLayer();
    Alpha.quotes.completeEternityChallEleven.show();
  }

  if (Alpha.isRunning && Alpha.currentStage === 24 && Currency.tachyonParticles.gt(0)) {
    Alpha.advanceLayer();
    Alpha.quotes.dilatedEternity.show();
  }

  if (Slabdrill.isCursed && Slabdrill.currentStage === 6) {
    Slabdrill.advanceLayer();
    Glyphs.refreshActive();
    Slabdrill.quotes.eternity.show();
  }

  if (Slabdrill.isCursed && Slabdrill.currentStage === 8 && EternityChallenge(10).completions >= 1) {
    Slabdrill.advanceLayer();
    Glyphs.refreshActive();
    Slabdrill.quotes.eternityChallengeTen.show();
  }

  EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_AFTER);
  return true;
}

// eslint-disable-next-line no-empty-function
export function animateAndEternity(callback) {
  if (!Player.canEternity) return false;
  const hasAnimation = !FullScreenAnimationHandler.isDisplaying &&
    !RealityUpgrade(10).isLockingMechanics &&
    !(RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) &&
    ((player.dilation.active && player.options.animations.dilation) ||
    (!player.dilation.active && player.options.animations.eternity));

  if (hasAnimation) {
    if (player.dilation.active) {
      animateAndUndilate(callback);
    } else {
      eternityAnimation();
      setTimeout(() => {
        eternity();
        if (callback) callback();
      }, 2250);
    }
  } else {
    eternity();
    if (callback) callback();
  }
  return hasAnimation;
}

export function initializeChallengeCompletions(isReality) {
  if (!(LHC.voidRunning && NullUpgrade.ncComp.isBought)) NormalChallenges.clearCompletions();
  if (!PelleUpgrade.keepInfinityChallenges.canBeApplied && !(LHC.voidRunning && NullUpgrade.icComp.isBought)) InfinityChallenges.clearCompletions();
  if (!isReality && EternityMilestone.keepAutobuyers.isReached || Pelle.isDoomed) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isUnlocked && (!player.disablePostReality || SlabdrillUnlocks.eternityChallengeTen.isUnlocked) &&
    (!Pelle.isDoomed || PelleAchievementUpgrade.achievement133.canBeApplied)) InfinityChallenges.completeAll();
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
}

export function initializeResourcesAfterEternity() {
  player.sacrificed = DC.D0;
  Currency.infinities.reset();
  player.records.bestInfinity.time = new Decimal(999999999999);
  player.records.bestInfinity.realTime = 999999999999;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? DC.D4 : DC.D0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? DC.D1 : DC.D0;
  player.partInfinityPoint = DC.D0;
  player.partInfinitied = 0;
  player.IPMultPurchases = DC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = 0;
  player.records.totalInfinityAntimatter = DC.E1;
  player.records.totalEternityAntimatter = DC.E1;
  player.totalTickGained = DC.D0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("eternity");
}

export function applyEU1() {
  if (player.eternityUpgrades.size < 3 && (Perk.autounlockEU1.canBeApplied && !player.disablePostReality)) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

// We want this to be checked before any EP-related autobuyers trigger, but we need to call this from the autobuyer
// code since those run asynchronously from gameLoop
export function applyEU2() {
  if (player.eternityUpgrades.size < 6 && (Perk.autounlockEU2.canBeApplied && !player.disablePostReality)) {
    const secondRow = EternityUpgrade.all.filter(u => u.id > 3);
    for (const upgrade of secondRow) {
      if (player.eternityPoints.gte(upgrade.cost / 1e10)) player.eternityUpgrades.add(upgrade.id);
    }
  }
}

function askEternityConfirmation() {
  if (player.dilation.active && player.options.confirmations.dilation) {
    Modal.exitDilation.show();
  } else if (player.options.confirmations.eternity) {
    Modal.eternity.show();
  } else {
    animateAndEternity();
  }
}

export function gainedEternities() {
  if (Pelle.isDoomed) {
    let pelleEternities = new Decimal(1);
    if (PelleAchievementUpgrade.achievement102.canBeApplied) pelleEternities = pelleEternities.timesEffectsOf(Achievement(102));
    if (PelleAchievementUpgrade.achievement113.canBeApplied) pelleEternities = pelleEternities.timesEffectsOf(Achievement(113));
    if (PelleRealityUpgrade.eternalAmplifier.canBeApplied) pelleEternities = pelleEternities.timesEffectsOf(RealityUpgrade(3));
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) pelleEternities = pelleEternities.times(getAdjustedGlyphEffect("timeetermult"));
    if (PelleAlchemyUpgrade.alchemyEternity.canBeApplied) pelleEternities = pelleEternities.pow(AlchemyResource.eternity.effectValue);
    if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) pelleEternities = pelleEternities.pow(player.eternities.max(1e10).log10().log10());
    return pelleEternities;
  }
  let eter = new Decimal(getAdjustedGlyphEffect("timeetermult"))
      .timesEffectsOf(RealityUpgrade(3),Achievement(102),Achievement(113))
      .pow(AlchemyResource.eternity.effectValue);
  if (LHC.voidRunning) eter = eter.timesEffectOf(NullUpgrade.eternityMult);
  if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) eter = eter.pow(player.eternities.max(1e10).log10().log10());
  return eter;
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    if (Pelle.isDoomed && this.config.givenByPelle) {
      return this.config.givenByPelle();
    }
    return Currency.eternities.gte(this.config.eternities);
  }
}
export const EternityMilestone = mapGameDataToObject(
  GameDatabase.eternity.milestones,
  config => (config.isBaseResource
    ? new EternityMilestoneState(config)
    : new EternityMilestoneState(config))
);

class ChargedEternityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

class EternityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedEternityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }

  get isAvailableForPurchase() {
    if (this.id === 3 && Alpha.isRunning && Alpha.currentStage < 14) return false;
    return true;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      EventHub.dispatch(GAME_EVENT.ETERNITY_UPGRADE_BOUGHT);
      return true;
    }
    if (this.canCharge) {
      this.charge();
      EventHub.dispatch(GAME_EVENT.ETERNITY_UPGRADE_CHARGED);
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined && Ascensions.oc2A.isUnlocked;
  }

  get isCharged() {
    return player.endgame.overcharge.charged.eternal.has(this.id);
  }

  get canCharge() {
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      player.endgame.overcharge.chargesLeft.eternal !== 0;
  }

  charge() {
    player.endgame.overcharge.charged.eternal.add(this.id);
  }

  disCharge() {
    player.endgame.overcharge.charged.eternal.delete(this.id);
  }

  onPurchased() {
    if (this.id === 3 && Alpha.isRunning && Alpha.currentStage === 14) {
      Alpha.advanceLayer();
      Alpha.quotes.infinityChallTimeBoost.show();
    }
  }
}

export function tryChargeAllEternityUpgrades() {
  if (player.endgame.overcharge.chargesLeft.eternal < 6) return;
  const upgrades = [
    EternityUpgrade.idMultEP,
    EternityUpgrade.idMultEternities,
    EternityUpgrade.idMultICRecords,
    EternityUpgrade.tdMultAchs,
    EternityUpgrade.tdMultTheorems,
    EternityUpgrade.tdMultRealTime
  ];
  for (const upgrade of upgrades) {
    if (upgrade.canCharge) {
      upgrade.charge();
    }
  }
}

export function disChargeAllEternityUpgrades() {
  const upgrades = [
    EternityUpgrade.idMultEP,
    EternityUpgrade.idMultEternities,
    EternityUpgrade.idMultICRecords,
    EternityUpgrade.tdMultAchs,
    EternityUpgrade.tdMultTheorems,
    EternityUpgrade.tdMultRealTime
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.endgame.overcharge.discharge.eternal = false;
  EventHub.dispatch(GAME_EVENT.ETERNITY_UPGRADES_DISCHARGED);
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => Ascensions.epA.isUnlocked ? player.epmultUpgrades.div(100).add(1) : DC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return (!Pelle.isDoomed || PelleDestructionUpgrade.x5EPUpgrade.canBeApplied) && Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = Decimal.clampMin(value.sub(player.epmultUpgrades), 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(DC.D5.pow(diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.eternityPoints.subtract(this.cost);
    this.boughtAmount = this.boughtAmount.add(1);
    return true;
  }

  costInv() {
    let tempVal = DC.D0;
    let bulk = DC.D1;
    let cur = Currency.eternityPoints.value.max(1);
    if (Ascensions.epA.isUnlocked) {
      return Decimal.floor(cur.max(2).log10().log10()).add(1);
    }
    if (cur.gt(this.costIncreaseThresholds[4]) && (!EndgameMastery(152).isBought || player.disablePostReality)) {
      bulk = Decimal.max(Decimal.floor(Decimal.pow(Decimal.log(this.costIncreaseThresholds[4].div(500), 1e3).sub(1332).add(Decimal.pow(1332, 1.2)), 1 / 1.2)), 1332);
      tempVal = DC.E3.pow(Decimal.pow(bulk, 1.2).sub(Decimal.pow(1332, 1.2)).add(1332)).times(500);
      cur = Decimal.log(tempVal.div(500), 1e30).sub(bulk).max(0);
      return Decimal.floor(Decimal.pow(cur.add(bulk).add(Decimal.pow(1332, 1.2)), 1 / 1.2));
      // eslint-disable-next-line no-else-return
    }
    if (cur.gt(this.costIncreaseThresholds[4]) && (EndgameMastery(152).isBought && !player.disablePostReality)) {
      bulk = Decimal.floor(this.costIncreaseThresholds[4].div(500).log(1000));
      tempVal = DC.E30.pow(bulk).times(500);
      cur = cur.div(tempVal).max(1);
      return Decimal.floor(bulk.add(cur.log(1e30)).add(1));
    }
    if (cur.gt(this.costIncreaseThresholds[3]) && (!EndgameMastery(152).isBought || player.disablePostReality)) {
      cur = Decimal.log(cur.div(500), 1e3).sub(1332);
      return Decimal.max(Decimal.floor(Decimal.pow(cur.add(Decimal.pow(1332, 1.2)), 1 / 1.2)), 1332);
      // eslint-disable-next-line no-else-return
    }
    if (cur.gt(this.costIncreaseThresholds[3]) && (EndgameMastery(152).isBought && !player.disablePostReality)) {
      bulk = Decimal.floor(this.costIncreaseThresholds[3].div(500).log(1000));
      tempVal = DC.E3.pow(bulk).times(500);
      cur = cur.div(tempVal).max(1);
      return Decimal.floor(bulk.add(cur.log(1e3)).add(1));
    }
    if (cur.gt(this.costIncreaseThresholds[2])) {
      bulk = Decimal.floor(this.costIncreaseThresholds[2].div(500).log(500));
      tempVal = DC.E3.pow(bulk).times(500);
      cur = cur.div(tempVal).max(1);
      return Decimal.floor(bulk.add(cur.log(1e3)).add(1));
    }
    if (cur.gt(this.costIncreaseThresholds[1])) {
      bulk = Decimal.floor(this.costIncreaseThresholds[1].div(500).log(100));
      tempVal = (DC.E2.times(5)).pow(bulk).times(500);
      cur = cur.div(tempVal).max(1);
      return Decimal.floor(bulk.add(cur.log(500)).add(1));
    }
    if (cur.gt(this.costIncreaseThresholds[0])) {
      bulk = Decimal.floor(this.costIncreaseThresholds[0].div(500).log(50));
      tempVal = DC.E2.pow(bulk).times(500);
      cur = cur.div(tempVal).max(1);
      return Decimal.floor(bulk.add(cur.log(100)).add(1));
    }
    return Decimal.floor(cur.div(500).max(1).log(50).add(1));
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }
    let bulk = Decimal.floor(this.costInv());
    if (bulk.lt(1)) return false;
    const price = this.costAfterCount(bulk.sub(1));
    bulk = Decimal.max(bulk.sub(this.boughtAmount), 0);
    if (bulk.eq(0)) return false;
    Currency.eternityPoints.subtract(price);
    this.boughtAmount = this.boughtAmount.add(bulk);
    let i = 0;
    while (Currency.eternityPoints.gt(this.costAfterCount(this.boughtAmount)) &&
    i < 50 && this.boughtAmount.lte(9e15)) {
      this.boughtAmount = this.boughtAmount.add(1);
      Currency.eternityPoints.subtract(this.costAfterCount(this.boughtAmount.sub(1)));
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = DC.D0;
  }

  get costIncreaseThresholds() {
    return [
      DC.E100.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      DC.NUMMAX.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      DC.E1300.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      DC.E4000.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      Decimal.pow10(1e125)
    ];
  }

  costAfterCount(count) {
    if (Ascensions.epA.isUnlocked) {
      return Decimal.pow10(Decimal.pow10(count));
    }
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length - 1; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    const purchaseScale = (EndgameMastery(152).isBought && !player.disablePostReality) ? count : Decimal.pow(count, 1.2).sub(Decimal.pow(1332, 1.2)).add(1332);
    const tempCost = DC.E3.pow(purchaseScale).times(500);
    if (tempCost.gte("e1e125")) return DC.E30.pow(purchaseScale).times(500);
    return tempCost;
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
