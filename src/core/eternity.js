import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

function giveEternityRewards(auto) {
  player.records.bestEternity.time = Decimal.min(player.records.thisEternity.time, player.records.bestEternity.time);
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

  if (!EternityMilestone.keepAutobuyers.isReached && !(Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied)) {
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
  AntimatterDimensions.reset();

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
  NormalChallenges.clearCompletions();
  if (!PelleUpgrade.keepInfinityChallenges.canBeApplied) InfinityChallenges.clearCompletions();
  if (!isReality && EternityMilestone.keepAutobuyers.isReached || Pelle.isDoomed) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isUnlocked && (!Pelle.isDoomed || PelleAchievementUpgrade.achievement133.isBought)) InfinityChallenges.completeAll();
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
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = 0;
  player.records.totalInfinityAntimatter = DC.E1;
  player.records.totalEternityAntimatter = DC.E1;
  player.totalTickGained = 0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("eternity");
}

export function applyEU1() {
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.canBeApplied) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

// We want this to be checked before any EP-related autobuyers trigger, but we need to call this from the autobuyer
// code since those run asynchronously from gameLoop
export function applyEU2() {
  if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.canBeApplied) {
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
    if (PelleAchievementUpgrade.achievement102.isBought) pelleEternities = pelleEternities.timesEffectsOf(Achievement(102));
    if (PelleAchievementUpgrade.achievement113.isBought) pelleEternities = pelleEternities.timesEffectsOf(Achievement(113));
    if (PelleRealityUpgrade.eternalAmplifier.isBought) pelleEternities = pelleEternities.timesEffectsOf(RealityUpgrade(3));
    if (PelleDestructionUpgrade.destroyedGlyphEffects.isBought) pelleEternities = pelleEternities.times(getAdjustedGlyphEffect("timeetermult"));
    if (PelleAlchemyUpgrade.alchemyEternity.isBought) pelleEternities = pelleEternities.pow(AlchemyResource.eternity.effectValue);
    return pelleEternities;
  }
  return new Decimal(getAdjustedGlyphEffect("timeetermult"))
      .timesEffectsOf(RealityUpgrade(3),Achievement(102),Achievement(113))
      .pow(AlchemyResource.eternity.effectValue);
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

class EternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => DC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return (!Pelle.isDoomed || PelleDestructionUpgrade.x5EPUpgrade.isBought) && Currency.eternityPoints.gte(this.cost);
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
    const diff = Math.clampMin(value - player.epmultUpgrades, 0);
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
    ++this.boughtAmount;
    return true;
  }

  costInv() {
    let tempVal = DC.D0;
    let bulk = DC.D1;
    let cur = Currency.eternityPoints.value.max(1);
    if (cur.gt(this.costIncreaseThresholds[3]) && !EndgameMastery(152).isBought) {
      cur = Decimal.log(cur.div(500), 1e3);
      return Decimal.max(Decimal.floor(Decimal.pow(cur.add(Decimal.pow(1332, 1.2)), 1 / 1.2)), 1332).toNumber();
      // eslint-disable-next-line no-else-return
    }
    if (cur.gt(this.costIncreaseThresholds[2])) {
      bulk = Decimal.floor(this.costIncreaseThresholds[2].div(500).log(500));
      tempVal = DC.E3.pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 1e3));
      return Decimal.floor(bulk.add(cur.log(1e3)).add(1)).toNumber();
    }
    if (cur.gt(this.costIncreaseThresholds[1])) {
      bulk = Decimal.floor(this.costIncreaseThresholds[1].div(500).log(100));
      tempVal = (DC.E2.times(5)).pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 500));
      return Decimal.floor(bulk.add(cur.log(500)).add(1)).toNumber();
    }
    if (cur.gt(this.costIncreaseThresholds[0])) {
      bulk = Decimal.floor(this.costIncreaseThresholds[0].div(500).log(50));
      tempVal = DC.E2.pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 100));
      return Decimal.floor(bulk.add(cur.log(100)).add(1)).toNumber();
    }
    return Decimal.floor(cur.div(500).max(1 / 50).log(50).add(1)).toNumber();
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }
    let bulk = Math.floor(this.costInv());
    if (bulk < 1) return false;
    const price = this.costAfterCount(bulk - 1);
    bulk = Math.max(bulk - this.boughtAmount, 0);
    if (bulk === 0 || !isFinite(bulk)) return false;
    Currency.eternityPoints.subtract(price);
    this.boughtAmount = this.boughtAmount + bulk;
    let i = 0;
    while (Currency.eternityPoints.gt(this.costAfterCount(this.boughtAmount)) &&
    i < 50 && this.boughtAmount <= 9e15) {
      this.boughtAmount += 1;
      Currency.eternityPoints.subtract(this.costAfterCount(this.boughtAmount - 1));
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = 0;
  }

  get costIncreaseThresholds() {
    return [
      DC.E100.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      DC.NUMMAX.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      DC.E1300.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay),
      DC.E4000.powEffectsOf(BreakEternityUpgrade.epMultiplierDelay)
    ];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    const purchaseScale = EndgameMastery(152).isBought ? count : Math.pow(count, 1.2) - Math.pow(1332, 1.2);
    return DC.E3.pow(purchaseScale).times(500);
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
