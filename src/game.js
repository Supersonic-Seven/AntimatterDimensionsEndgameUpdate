import TWEEN from "tween.js";

import { ElectronRuntime, SteamRuntime } from "@/steam";

import { deepmergeAll } from "@/utility/deepmerge";
import { DEV } from "@/env";
import { SpeedrunMilestones } from "./core/speedrun";
import { Cloud } from "./core/storage";
import { supportedBrowsers } from "./supported-browsers";

import Payments from "./core/payments";

import { sha512_256 } from "js-sha512";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

export function playerInfinityUpgradesOnReset() {

  const infinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "ipOffline"]
  );

  const breakInfinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "totalMult", "currentMult", "postGalaxy",
      "challengeMult", "achievementMult", "infinitiedMult",
      "infinitiedGeneration", "autoBuyerUpgrade", "autobuyMaxDimboosts",
      "ipOffline"]
  );

  if (player.celestials.pelle.doomed && DivinityMilestone.pelleQoL.isReached) {
    player.infinityUpgrades = breakInfinityUpgrades;
    player.infinityRebuyables = [8, 7, 10];
    return;
  }

  if (PelleUpgrade.keepBreakInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => breakInfinityUpgrades.has(u)));
    return;
  }

  if (PelleUpgrade.keepInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => infinityUpgrades.has(u)));
    player.infinityRebuyables = [0, 0, 0];
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
    return;
  }

  if ((RealityUpgrade(10).isBought && !player.disablePostReality) || EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityUpgrades = breakInfinityUpgrades;
    player.infinityRebuyables = Slabdrill.isCursed ? [23, 22, 10] : (Alpha.isRunning ? [18, 17, 10] : [8, 7, 10]);
  } else if (EternityMilestone.keepInfinityUpgrades.isReached) {
    player.infinityUpgrades = infinityUpgrades;
    player.infinityRebuyables = [0, 0, 0];
  } else {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [0, 0, 0];
  }

  if (Pelle.isDoomed) {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [0, 0, 0];
  }

  GameCache.tickSpeedMultDecrease.invalidate();
  GameCache.dimensionMultDecrease.invalidate();
}

export function playerCelestialInfinityUpgradesOnReset() {

  const celestialInfinityUpgrades = new Set(
    ["gameSpeedMultCIP", "celDimPurchaseBoost", "alphaDecayStartBoost",
      "celDimBoostBuff", "celGalaxyBuff", "celestialMatterConversionBuff",
      "antimatterCelestialDimBuff", "cipGen", "buffedStart"]
  );

  const celestialBreakInfinityUpgrades = new Set(
    ["gameSpeedMultCIP", "celDimPurchaseBoost", "alphaDecayStartBoost",
      "celDimBoostBuff", "celGalaxyBuff", "celestialMatterConversionBuff",
      "antimatterCelestialDimBuff", "cipGen", "buffedStart",
      "autoCD1", "autoCD2", "autoCDPlus",
      "betterAuto", "bulkCelDimBoosts", "celInfGen",
      "celTickspeedCostMult", "celDimCostMult", "cipGen",
      "celDimPurchaseBuff", "celDimboostBuff", "celGalaxyBuff"]
  );

  if (CelestialEternityUpgrade.startBreakInf.isBought) {
    player.endgame.celDimExpansion.celestialInfinityUpgrades = celestialBreakInfinityUpgrades;
    player.endgame.celDimExpansion.celestialInfinityRebuyables = [8, 7, 10, 10, 10, 10];
  } else if (CelestialEternityUpgrade.startInf.isBought) {
    player.endgame.celDimExpansion.celestialInfinityUpgrades = celestialInfinityUpgrades;
    player.endgame.celDimExpansion.celestialInfinityRebuyables = [0, 0, 0, 0, 0, 0];
  } else {
    player.endgame.celDimExpansion.celestialInfinityUpgrades.clear();
    player.endgame.celDimExpansion.celestialInfinityRebuyables = [0, 0, 0, 0, 0, 0];
  }

  GameCache.celestialTickSpeedMultDecrease.invalidate();
  GameCache.celestialDimensionMultDecrease.invalidate();
}

export function breakInfinity() {
  if (!Autobuyer.bigCrunch.hasMaxedInterval) return;
  if (InfinityChallenge.isRunning) return;
  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.maxIntervalForFree();
  }
  // There's a potential migration edge case involving already-maxed autobuyers; this should give the achievement
  Achievement(61).tryUnlock();
  player.break = !player.break;
  TabNotification.ICUnlock.tryTrigger();
  EventHub.dispatch(player.break ? GAME_EVENT.BREAK_INFINITY : GAME_EVENT.FIX_INFINITY);
  GameUI.update();
  if (Alpha.isRunning && Alpha.currentStage === 5) {
    Alpha.advanceLayer();
    Alpha.quotes.breakInfinity.show();
  }
  if (Slabdrill.isCursed && Slabdrill.currentStage === 3) {
    Slabdrill.advanceLayer();
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
    Glyphs.refreshActive();
    for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.omniGlyph(type));
    Slabdrill.quotes.breakInfinity.show();
  }
}

export function breakEternity() {
  player.break2 = !player.break2;
  EventHub.dispatch(GAME_EVENT.BREAK_ETERNITY);
  GameUI.update();
}

export function celestialBreakInfinity() {
  player.endgame.celDimExpansion.isBroken = !player.endgame.celDimExpansion.isBroken;
  EventHub.dispatch(GAME_EVENT.CELESTIAL_BREAK_INFINITY);
  GameUI.update();
}

export function gainedInfinityPoints() {
  let positiveIPPowers = DC.D1;
  if ((Pelle.isDoomed && PelleCelestialUpgrade.raTeresa3.canBeApplied) || GlyphAlteration.isAdded("infinity")) positiveIPPowers = positiveIPPowers.times(getSecondaryGlyphEffect("infinityIP"));
  if (EndgameMastery(141).isBought) positiveIPPowers = positiveIPPowers.timesEffectsOf(EndgameMastery(141));
  if (!player.disablePostReality) positiveIPPowers = positiveIPPowers.times(AlphaUnlocks.infinity.effects.buff.effectOrDefault(1));
  if (AlchemyResource.exponential.amount > 0 && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) positiveIPPowers = positiveIPPowers.times(ReplicantiMultipliers.ipPow);
  if (Ascensions.ipA.isUnlocked) positiveIPPowers = positiveIPPowers.timesEffectOf(InfinityUpgrade.ipMult);
  const div = new Decimal(Effects.min(
    308,
    Achievement(103),
    TimeStudy(111),
    EndgameMastery(151)
  )).max(positiveIPPowers.times(2)).toNumber();
  if (Pelle.isDisabled("IPMults")) {
    let ip = Decimal.pow10(player.records.thisInfinity.maxAM.add(1).log10().div(div).sub(0.75))
      .timesEffectsOf(PelleRifts.vacuum)
      .times(Pelle.specialGlyphEffect.infinity);
    if (PelleDestructionUpgrade.timestudy41.canBeApplied) ip = ip.timesEffectOf(TimeStudy(41));
    if (PelleDestructionUpgrade.timestudy51.canBeApplied) ip = ip.timesEffectOf(TimeStudy(51));
    if (PelleDestructionUpgrade.timestudy141.canBeApplied) ip = ip.timesEffectOf(TimeStudy(141));
    if (PelleDestructionUpgrade.timestudy142.canBeApplied) ip = ip.timesEffectOf(TimeStudy(142));
    if (PelleDestructionUpgrade.timestudy143.canBeApplied) ip = ip.timesEffectOf(TimeStudy(143));
    if (PelleAchievementUpgrade.achievement85.canBeApplied) ip = ip.timesEffectOf(Achievement(85));
    if (PelleAchievementUpgrade.achievement93.canBeApplied) ip = ip.timesEffectOf(Achievement(93));
    if (PelleAchievementUpgrade.achievement116.canBeApplied) ip = ip.timesEffectOf(Achievement(116));
    if (PelleAchievementUpgrade.achievement125.canBeApplied) ip = ip.timesEffectOf(Achievement(125));
    if (PelleAchievementUpgrade.achievement141.canBeApplied) ip = ip.timesEffectOf(Achievement(141).effects.ipGain);
    if (PelleDestructionUpgrade.x2IPUpgrade.canBeApplied) ip = ip.timesEffectOf(InfinityUpgrade.ipMult);
    if (PelleDestructionUpgrade.reenableIPDilationUpgrade.canBeApplied) ip = ip.timesEffectOf(DilationUpgrade.ipMultDT);
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) ip = ip.times(getAdjustedGlyphEffect("infinityIP"));
    if (PelleAlchemyUpgrade.alchemyExponential.canBeApplied && Replicanti.areUnlocked) ip = ip.times(ReplicantiMultipliers.ipMult);
    if (PelleCelestialUpgrade.raTeresa3.canBeApplied) ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
    if (EndgameMastery(141).isBought) ip = ip.powEffectsOf(EndgameMastery(141));
    if (!player.disablePostReality) ip = ip.pow(AlphaUnlocks.infinity.effects.buff.effectOrDefault(1));
    if (AlchemyResource.exponential.amount > 0 && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) ip = ip.pow(ReplicantiMultipliers.ipPow);
    if (Ascensions.ipA.isUnlocked) ip = ip.powEffectOf(InfinityUpgrade.ipMult);
    return ip.floor();
  }
  let ip = player.break
    ? Decimal.pow10(player.records.thisInfinity.maxAM.add(1).log10().div(div).sub(0.75))
    : new Decimal(308 / div);
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
    ip = ip.min(DC.E200);
  }
  ip = ip.times(GameCache.totalIPMult.value);
  if (Teresa.isRunning) {
    ip = ip.pow(0.55);
  } else if (V.isRunning) {
    ip = ip.pow(0.5);
  } else if (Laitela.isRunning) {
    ip = dilatedValueOf(ip);
  }
  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
  }
  if (EndgameMastery(141).isBought) {
    ip = ip.powEffectsOf(EndgameMastery(141));
  }
  if (!player.disablePostReality) {
    ip = ip.pow(AlphaUnlocks.infinity.effects.buff.effectOrDefault(1));
  }

  if (Alpha.isRunning && Alpha.currentStage < 12) {
    ip = ip.pow(AlphaUnlocks.infinityDimensions.effects.nerf.effectOrDefault(1));
  }

  const topTier = Alpha.currentStage >= 18 ? 1 : 0;
  if (Alpha.isRunning && player.challenge.eternity.current > topTier) {
    ip = ip.pow(Effects.min(
      1,
      AlphaUnlocks.eternityChallengeUnlock.effects.nerf,
      AlphaUnlocks.ecCompletion1.effects.nerf,
      AlphaUnlocks.ecCompletion5.effects.nerf
    ));
  }

  if (AlchemyResource.exponential.amount > 0 && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
    ip = ip.pow(ReplicantiMultipliers.ipPow);
  }

  if (SlabdrillUnlocks.timeStudy181.isUnlocked) ip = ip.pow(0.9);

  if (Ascensions.ipA.isUnlocked) ip = ip.powEffectOf(InfinityUpgrade.ipMult);

  if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) ip = ip.min(player.antimatter);

  return ip.floor();
}

function totalEPMult() {
  if (Pelle.isDisabled("EPMults")) {
    let ep = Pelle.specialGlyphEffect.time.timesEffectOf(PelleRifts.vacuum.milestones[2]);
    if (PelleDestructionUpgrade.x5EPUpgrade.canBeApplied && !Ascensions.epA.isUnlocked) ep = ep.timesEffectOf(EternityUpgrade.epMult);
    if (PelleDestructionUpgrade.timestudy61.canBeApplied) ep = ep.timesEffectOf(TimeStudy(61));
    if (PelleDestructionUpgrade.timestudy122.canBeApplied) ep = ep.timesEffectOf(TimeStudy(122));
    if (PelleDestructionUpgrade.timestudy121.canBeApplied) ep = ep.timesEffectOf(TimeStudy(121));
    if (PelleDestructionUpgrade.timestudy123.canBeApplied) ep = ep.timesEffectOf(TimeStudy(123));
    if (PelleRealityUpgrade.knowingExistence.canBeApplied) ep = ep.timesEffectOf(RealityUpgrade(12));
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) ep = ep.times(getAdjustedGlyphEffect("timeEP"));
    if (!player.disablePostReality) ep = ep.times(AlphaUnlocks.timestudy61.effects.buff.effectOrDefault(1));
    return ep;
  }
  let ep = getAdjustedGlyphEffect("cursedEP")
    .times(ShopPurchase.EPPurchases.currentMult)
    .timesEffectsOf(
      TimeStudy(61),
      TimeStudy(122),
      TimeStudy(121),
      TimeStudy(123),
      RealityUpgrade(12)
    ).times(getAdjustedGlyphEffect("timeEP")).times(player.disablePostReality ? 1 : AlphaUnlocks.timestudy61.effects.buff.effectOrDefault(1));
  if (!Ascensions.epA.isUnlocked) ep = ep.timesEffectOf(EternityUpgrade.epMult);
  if (LHC.voidRunning) ep = ep.timesEffectOf(NullUpgrade.eternityPointMult);
  if (SlabdrillUnlocks.timeStudy181.isUnlocked) ep = ep.times(Slabdrill.slabPowers.epMult());

  return ep;
}

export function gainedEternityPoints() {
  let positiveEPPowers = DC.D1;
  if (GlyphAlteration.isAdded("time")) positiveEPPowers = positiveEPPowers.times(getSecondaryGlyphEffect("timeEP"));
  if (EndgameMastery(142).isBought) positiveEPPowers = positiveEPPowers.timesEffectsOf(EndgameMastery(142));
  positiveEPPowers = positiveEPPowers.timesEffectOf(Ra.unlocks.eternityPointPower);
  positiveEPPowers = positiveEPPowers.timesEffectOf(Achievement(232));
  if (Ascensions.epA.isUnlocked) positiveEPPowers = positiveEPPowers.timesEffectOf(EternityUpgrade.epMult);
  const div = new Decimal(308 - PelleRifts.recursion.effectValue.toNumber()).max(positiveEPPowers.times(2)).toNumber();
  let ep = DC.D5.pow(player.records.thisEternity.maxIP.plus(
    gainedInfinityPoints()).add(1).log10().div(div).sub(0.7)).times(totalEPMult());

  if (Teresa.isRunning) {
    ep = ep.pow(0.55);
  } else if (V.isRunning) {
    ep = ep.pow(0.5);
  } else if (Laitela.isRunning) {
    ep = dilatedValueOf(ep);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
  }
  if (EndgameMastery(142).isBought) {
    ep = ep.powEffectsOf(EndgameMastery(142));
  }
  ep = ep.powEffectOf(Ra.unlocks.eternityPointPower);

  ep = ep.powEffectOf(Achievement(232));

  if (Alpha.isRunning) ep = ep.pow(AlphaUnlocks.eternityChallenge10.effects.nerf.effectOrDefault(1));
  if (Alpha.isRunning) ep = ep.pow(AlphaUnlocks.timeDimension8.effects.nerf.effectOrDefault(1));

  if (SlabdrillUnlocks.timeStudy181.isUnlocked) ep = ep.pow(0.9);
  if (Slabdrill.isCursed) ep = ep.min(DC.E2000).times(ep.div(DC.E2000).max(1).pow(0.25));
  if (Slabdrill.isCursed) ep = ep.min(DC.E2500).times(ep.div(DC.E2500).max(1).pow(0.5));
  if (Slabdrill.isCursed) ep = ep.min(DC.E3000).times(ep.div(DC.E3000).max(1).pow(0.75));

  if (Ascensions.epA.isUnlocked) ep = ep.powEffectOf(EternityUpgrade.epMult);

  if (Alpha.isRunning && Alpha.currentStage < 27) ep = ep.min(DC.E3350);

  if (ResurgenceUpgrade.epSurge.isBought && !player.disablePostReality) ep = ep.min(player.antimatter);

  return ep.floor();
}

export function requiredIPForEP(epAmount) {
  return Decimal.pow10((Decimal.log(Decimal.divide(epAmount, totalEPMult()), 5).add(0.7)).times(308))
    .clampMin(Number.MAX_VALUE);
}

export function gainedGlyphLevel() {
  const glyphState = getGlyphLevelInputs();
  let rawLevel = Decimal.floor(glyphState.rawLevel);
  let actualLevel = Decimal.floor(glyphState.actualLevel);
  return {
    rawLevel,
    actualLevel
  };
}

export function resetChallengeStuff() {
  player.chall2Pow = 1;
  player.chall3Pow = DC.D0_01;
  Currency.matter.reset();
  player.chall8TotalSacrifice = DC.D1;
  player.postC4Tier = 1;
  if (NormalChallenge(12).isRunning && Slabdrill.isCursed) player.chall2Pow = 0;
}

export function ratePerMinute(amount, time) {
  if (new Decimal(time).eq(0)) return DC.D0;
  return Decimal.divide(amount, new Decimal(time).div(60 * 1000).clampMin(1e-300));
}

// eslint-disable-next-line max-params
export function addInfinityTime(time, realTime, ip, infinities) {
  let challenge = "";
  if (player.challenge.normal.current) challenge = `Normal Challenge ${player.challenge.normal.current}`;
  if (player.challenge.infinity.current) challenge = `Infinity Challenge ${player.challenge.infinity.current}`;
  player.records.recentInfinities.pop();
  player.records.recentInfinities.unshift([time, realTime, ip, infinities, challenge]);
  GameCache.bestRunIPPM.invalidate();
}

export function resetInfinityRuns() {
  player.records.recentInfinities = Array.from(
    { length: 10 },
    () => [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, ""]
  );
  GameCache.bestRunIPPM.invalidate();
}

// Player gains 50% of infinities they would get based on their best infinities/hour crunch if they have the
// milestone and turned on infinity autobuyer with 1 minute or less per crunch
export function getInfinitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.bigCrunch.autoInfinitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisEternity.bestInfinitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

// eslint-disable-next-line max-params
export function addEternityTime(time, realTime, ep, eternities) {
  let challenge = "";
  if (player.challenge.eternity.current) {
    const currEC = player.challenge.eternity.current;
    const ec = EternityChallenge(currEC);
    const challText = player.dilation.active ? "Dilated EC" : "Eternity Challenge";
    challenge = `${challText} ${currEC} (${formatInt(ec.completions)}/${formatInt(ec.maxCompletions)})`;
  } else if (player.dilation.active) challenge = "Time Dilation";
  // If we call this function outside of dilation, it uses the existing AM and produces an erroneous number
  const gainedTP = player.dilation.active ? getTachyonGain() : DC.D0;
  player.records.recentEternities.pop();
  player.records.recentEternities.unshift([time, realTime, ep, eternities, challenge, gainedTP]);
  GameCache.averageRealTimePerEternity.invalidate();
}

export function resetEternityRuns() {
  player.records.recentEternities = Array.from(
    { length: 10 },
    () => [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]
  );
  GameCache.averageRealTimePerEternity.invalidate();
}

// Player gains 50% of the eternities they would get if they continuously repeated their fastest eternity, if they
// have the auto-eternity milestone and turned on eternity autobuyer with 0 EP
export function getEternitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.eternity.autoEternitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisReality.bestEternitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

function isOfflineEPGainEnabled() {
  return player.options.offlineProgress && !Autobuyer.bigCrunch.autoInfinitiesAvailable() &&
    !Autobuyer.eternity.autoEternitiesAvailable();
}

export function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached || !isOfflineEPGainEnabled()) return DC.D0;
  return player.records.bestEternity.bestEPminReality.times(TimeSpan.fromMilliseconds(new Decimal(ms)).totalMinutes.div(4));
}

// Note: realities and ampFactor must be distinct because there are a few things farther up which only multiply
// reality count and none of the other things
// eslint-disable-next-line max-params
export function addRealityTime(time, realTime, rm, level, realities, ampFactor, projIM) {
  let reality = "";
  const celestials = [Teresa, Effarig, Enslaved, V, Ra, Laitela];
  for (const cel of celestials) {
    if (cel.isRunning) reality = cel.displayName;
  }
  const shards = Effarig.shardsGained;
  player.records.recentRealities.pop();
  player.records.recentRealities.unshift([time, realTime, rm.times(ampFactor),
    realities, reality, level, shards.times(ampFactor), projIM]);
}

export function addEndgameTime(time, realTime, cp, dp, endgames) {
  player.records.recentEndgames.pop();
  player.records.recentEndgames.unshift([time, realTime, cp, dp, endgames]);
}

export function addCelestialInfinityTime(time, realTime, cip, celinfinities) {
  player.records.recentCelestialInfinities.pop();
  player.records.recentCelestialInfinities.unshift([time, realTime, cip, celinfinities]);
  GameCache.bestRunCIPPM.invalidate();
}

export function resetCelestialInfinityRuns() {
  player.records.recentCelestialInfinities = Array.from(
    { length: 10 },
    () => [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1]
  );
  GameCache.bestRunCIPPM.invalidate();
}

export function addCelestialEternityTime(time, realTime, cep, celeternities) {
  player.records.recentCelestialEternities.pop();
  player.records.recentCelestialEternities.unshift([time, realTime, cep, celeternities]);
}

export function addCondenseTime(time, realTime, vs, condenses) {
  player.records.recentCondenses.pop();
  player.records.recentCondenses.unshift([time, realTime, vs, condenses]);
}

export function resetCondenseRuns() {
  player.records.recentCondenses = Array.from(
    { length: 10 },
    () => [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1]
  );
  GameCache.bestRunVSPM.invalidate();
}

export function addSupernovaTime(time, realTime, neb, supernovae) {
  player.records.recentSupernovae.pop();
  player.records.recentSupernovae.unshift([time, realTime, neb, supernovae]);
}

export function gainedInfinities() {
  if (EternityChallenge(4).isRunning) {
    return DC.D1;
  }
  if (Pelle.isDoomed) {
    let pelleInfs = new Decimal(1);
    if (PelleAchievementUpgrade.achievement87.canBeApplied) pelleInfs = new Decimal(Effects.max(1, Achievement(87)));
    if (PelleDestructionUpgrade.timestudy32.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(TimeStudy(32));
    if (PelleRealityUpgrade.boundlessAmplifier.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(RealityUpgrade(5));
    if (PelleRealityUpgrade.innumerablyConstruct.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(RealityUpgrade(7));
    if (PelleAchievementUpgrade.achievement131.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(Achievement(131).effects.infinitiesGain);
    if (PelleDestructionUpgrade.timestudy191.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(TimeStudy(191).effects.infinitiesGain);
    if (PelleAchievementUpgrade.achievement164.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(Achievement(164));
    if (PelleCelestialUpgrade.raV3.canBeApplied) pelleInfs = pelleInfs.timesEffectsOf(Ra.unlocks.continuousTTBoost.effects.infinity);
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) pelleInfs = pelleInfs.times(getAdjustedGlyphEffect("infinityinfmult"));
    if (PelleDestructionUpgrade.singularityMilestones.canBeApplied) pelleInfs = pelleInfs.powEffectOf(SingularityMilestone.infinitiedPow);
    if (!player.disablePostReality) pelleInfs = pelleInfs.pow(AlphaUnlocks.eternityChallenge10.effects.buff.effectOrDefault(1));
    if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) pelleInfs = pelleInfs.pow(player.infinities.max(1e10).log10().log10());
    pelleInfs = pelleInfs.pow(BreakInfinityUpgrade.infinitiedGen.chargedEffect.effectOrDefault(1));
    pelleInfs = pelleInfs.pow(NormalChallenge(1).chargedEffect);
    return pelleInfs;
  }
  let infGain = Effects.max(
    1,
    Achievement(87)
  ).toDecimal();

  infGain = infGain.timesEffectsOf(
    TimeStudy(32),
    RealityUpgrade(5),
    RealityUpgrade(7),
    Achievement(131).effects.infinitiesGain,
    TimeStudy(191).effects.infinitiesGain,
    Achievement(164),
    Ra.unlocks.continuousTTBoost.effects.infinity
  );
  infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
  if (LHC.voidRunning) infGain = infGain.timesEffectOf(NullUpgrade.infinityMult);
  infGain = infGain.powEffectOf(SingularityMilestone.infinitiedPow);
  if (!player.disablePostReality) infGain = infGain.pow(AlphaUnlocks.eternityChallenge10.effects.buff.effectOrDefault(1));
  if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) infGain = infGain.pow(player.infinities.max(1e10).log10().log10());
  infGain = infGain.pow(BreakInfinityUpgrade.infinitiedGen.chargedEffect.effectOrDefault(1));
  infGain = infGain.pow(NormalChallenge(1).chargedEffect);
  if (SlabdrillUnlocks.eternityChallengeTen.isUnlocked) infGain = infGain.div(1e20);
  if (SlabdrillUnlocks.eternityChallengeTen.isUnlocked) infGain = infGain.times(Slabdrill.slabPowers.infMult());
  return infGain;
}

export function gainedCelestialInfinities() {
  return DC.D1;
}

export function gainedCelestialInfinityPoints() {
  const div = 308 * CelestialEternityUpgrade.betterCIP.effectOrDefault(1) * CelestialEternityPlusUpgrade.betterCIPFormula.effectOrDefault(1);
  let cip = player.endgame.celDimExpansion.isBroken
    ? Decimal.pow10(player.records.thisCelestialInfinity.maxCM.add(1).log10().div(div).sub(0.75))
    : new Decimal(308 / div);
  cip = cip.times(GameCache.totalCIPMult.value);

  return cip.floor();
}

function totalCEPMult() {
  return CelestialEternityUpgrade.cepMult.effectOrDefault(1);
}

export function gainedCelestialEternityPoints() {
  let cep = DC.D5.pow(player.records.thisCelestialEternity.maxCIP.plus(
    gainedCelestialInfinityPoints()).add(1).log10().div(308).sub(0.7)).times(totalCEPMult());

  cep = cep.min(DC.E4000).times(Decimal.pow10(1000 / 3).pow(cep.max(1).log10().div(4000).max(1).log10()));

  return cep.floor();
}

export function gainedCondenses() {
  return DC.D1.timesEffectOf(Achievement(261));
}

export function gainedDivineStars() {
  const div = EndgameMastery(231).effectOrDefault(308);
  let divs = Decimal.pow10(player.records.thisCondense.maxVM.add(1).log10().div(div).sub(0.75));
  divs = divs.timesEffectOf(DivinityUpgrade.divineL4U1.effects.stars);
  return divs.floor();
}

function totalNebMult() {
  return DC.D1;
}

export function gainedNebulae() {
  let neb = DC.D5.pow(player.records.thisSupernova.maxVS.plus(
    gainedDivineStars()).add(1).log10().div(308).sub(0.7)).times(totalNebMult());

  neb = neb.min(DC.E100).times(neb.div(DC.E100).max(1).pow(0.1));
  neb = neb.min(DC.E1000).times(neb.div(DC.E1000).max(1).pow(0.1)); // Temporary? Retest after Slabdrill overhaul

  return neb.floor();
}

export function updateRefresh() {
  GameStorage.save();
  location.reload(true);
}

export const GAME_SPEED_EFFECT = {
  FIXED_SPEED: 1,
  TIME_GLYPH: 2,
  BLACK_HOLE: 3,
  TIME_STORAGE: 4,
  SINGULARITY_MILESTONE: 5,
  NERFS: 6,
  CELESTIAL_MATTER: 7,
  RA_BUFFS: 8
};

function shouldApplyMaxThisEndgame() {
  if (Teresa.isRunning || Effarig.isRunning || Enslaved.isRunning || V.isRunning || Ra.isRunning || Laitela.isRunning || Pelle.isDoomed) return false;
  return player.endgame.celestialMatterMultiplier.isActive;
}

/**
  * @param {number[]?} effectsToConsider A list of various game speed changing effects to apply when calculating
  *   the game speed.  If left undefined, all effects will be applied.
  * @param {number?} blackHolesActiveOverride A numerical value which forces all black holes up to its specified index
  *   to be active for the purposes of game speed calculation. This is only used during offline black hole stuff.
  */
export function getGameSpeedupFactor(effectsToConsider, _applyMaxThisEndgame, blackHolesActiveOverride) {
  const applyMaxThisEndgame = _applyMaxThisEndgame === undefined ? shouldApplyMaxThisEndgame() : _applyMaxThisEndgame;
  let effects;
  if (effectsToConsider === undefined) {
    effects = [GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
      GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS,
      GAME_SPEED_EFFECT.CELESTIAL_MATTER, GAME_SPEED_EFFECT.RA_BUFFS];
  } else {
    effects = effectsToConsider;
  }

  if (Slabdrill.coreActive) return DC.D1;

  if (effects.includes(GAME_SPEED_EFFECT.FIXED_SPEED)) {
    if (EternityChallenge(12).isRunning || player.endgame.overcharge.isRunning || player.compression.active ||
        (player.universes.current >= 1 && (player.universes.current === 1 || player.universes.current % 2 === 0))) {
      return new Decimal(1 / 1000);
    }
  }

  let factor = DC.D1;
  if (effects.includes(GAME_SPEED_EFFECT.BLACK_HOLE)) {
    if (BlackHoles.areNegative) {
      factor = factor.times(player.blackHoleNegative);
    } else if (!BlackHoles.arePaused) {
      for (const blackHole of BlackHoles.list) {
        if (!blackHole.isUnlocked) break;
        const isActive = blackHolesActiveOverride === undefined
          ? blackHole.isActive
          : blackHole.id <= blackHolesActiveOverride;
        if (!isActive) break;
        factor = factor.times(Decimal.pow(blackHole.power, BlackHoles.unpauseAccelerationFactor));
        factor = factor.times(VUnlocks.achievementBH.effectOrDefault(1));
        if (Pelle.isDoomed && PelleCelestialUpgrade.vMilestones3.canBeApplied) factor = factor.times(VUnlocks.achievementBH.effectValue);
        if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) factor = factor.pow(Achievements.powerConv(VUnlocks.achievementBH.effectOrDefault(1)));
      }
    }
  }

  if (effects.includes(GAME_SPEED_EFFECT.SINGULARITY_MILESTONE)) {
    factor = factor.times(SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1));
  }

  if (effects.includes(GAME_SPEED_EFFECT.TIME_GLYPH)) {
    factor = factor.times(getAdjustedGlyphEffect("timespeed"));
    factor = Decimal.pow(factor, getAdjustedGlyphEffect("effarigblackhole"));
  }

  if (effects.includes(GAME_SPEED_EFFECT.CELESTIAL_MATTER)) {
    const celestialMatterExponent = CelestialDimensions.conversionExponent;
    if (player.endgame.celestialMatter.gt(0) && player.endgame.celestialMatterMultiplier.isActive) {
      factor = factor.times(Decimal.pow(player.endgame.celestialMatter, celestialMatterExponent));
    }
    factor = factor.timesEffectOf(CelestialInfinityUpgrade.gameSpeedMultCIP);
  }

  if (effects.includes(GAME_SPEED_EFFECT.RA_BUFFS)) {
    if (Ra.unlocks.gameSpeedTesseractBoost.canBeApplied) {
      factor = factor.timesEffectOf(Ra.unlocks.gameSpeedTesseractBoost);
    }
    if (Ra.unlocks.gameSpeedImprovement.canBeApplied) {
      factor = factor.powEffectOf(Ra.unlocks.gameSpeedImprovement);
    }
  }

  if (Enslaved.isStoringGameTime && effects.includes(GAME_SPEED_EFFECT.TIME_STORAGE)) {
    const storedTimeWeight = (Ra.unlocks.autoPulseTime.canBeApplied || ExpansionPack.enslavedPack.isBought) && !player.disablePostReality ? 0.99 : 1;
    factor = factor.times(1 - storedTimeWeight).plus(storedTimeWeight);
  }

  // These effects should always be active, but need to be disabled during offline black hole simulations because
  // otherwise it gets applied twice
  if (effects.includes(GAME_SPEED_EFFECT.NERFS)) {
    if (Effarig.isRunning) {
      factor = Effarig.multiplier(factor);
    } else if (Laitela.isRunning) {
      const divisor = (ExpansionPack.laitelaPack.isBought && !player.disablePostReality) ? 5 : 10;
      const nerfModifier = Math.clampMax(Time.thisRealityRealTime.totalMinutes.toNumber() / divisor, 1);
      factor = Decimal.pow(factor, nerfModifier);
    }
  }

  factor = factor.times(PelleUpgrade.timeSpeedMult.effectValue);

  if (!Pelle.isDoomed) factor = factor.pow(Universes.ephemeralLightToDilation);

  if (EndgameUpgrade(7).isBought && applyMaxThisEndgame && !player.disablePostReality) factor = Decimal.clampMin(factor, player.records.thisEndgame.peakGameSpeed);

  // 1e-300 is now possible with max inverted BH, going below it would be possible with
  // an effarig glyph.
  let gameSpeedCap = DC.E300;
  if (EndgameMilestone.gameSpeedUncap.isReached && !player.disablePostReality) gameSpeedCap = DC.BEMAX;
  factor = Decimal.clamp(factor, new Decimal(1e-300), gameSpeedCap);

  return factor;
}

export function getGameSpeedupForDisplay() {
  const speedFactor = getGameSpeedupFactor();
  if (
    Enslaved.isAutoReleasing &&
    Enslaved.canRelease(true) &&
    !BlackHoles.areNegative &&
    (!Pelle.isDisabled("blackhole") || PelleDestructionUpgrade.blackHole.canBeApplied)
  ) {
    return Decimal.max(Enslaved.autoReleaseSpeed, speedFactor);
  }
  return speedFactor;
}

// Separated out for organization; however this is also used in more than one spot in gameLoop() as well. Returns
// true if the rest of the game loop should be skipped
export function realTimeMechanics(realDiff) {
  // Ra memory generation bypasses stored real time, but memory chunk generation is disabled when storing real time.
  // This is in order to prevent players from using time inside of Ra's reality for amplification as well
  Ra.memoryTick(realDiff, !Enslaved.isStoringRealTime);
  if (AlchemyResource.momentum.isUnlocked) {
    player.celestials.ra.momentumTime += realDiff * Effects.product(Achievement(175), EndgameMastery(171), Achievement(222));
  }

  GameCache.celestialDimensionCommonMultiplier.invalidate();
  GameCache.divineDimensionCommonMultiplier.invalidate();

  CelestialDimensions.tick(realDiff);
  DivineDimensions.tick(realDiff);
  DarkMatterDimensions.tick(realDiff);

  // When storing real time, skip everything else having to do with production once stats are updated
  if (Enslaved.isStoringRealTime) {
    player.records.realTimePlayed += realDiff;
    player.records.thisInfinity.realTime += realDiff;
    player.records.thisEternity.realTime += realDiff;
    player.records.thisReality.realTime += realDiff;
    Enslaved.storeRealTime();
    // Most autobuyers will only tick usefully on the very first tick, but this needs to be here in order to allow
    // the autobuyers unaffected by time storage to tick as well
    Autobuyers.tick();
    AutomatorBackend.update(realDiff);
    GameUI.update();
    return true;
  }
  return false;
}

// "passDiff" is in ms. It is only unspecified when it's being called normally and not due to simulating time, in which
// case it uses the gap between now and the last time the function was called (capped at a day). This is on average
// equal to the update rate, but may be much larger if the game was unfocused or the device went to sleep for some time.
// eslint-disable-next-line complexity
export function gameLoop(passedDiff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");

  EventHub.dispatch(GAME_EVENT.GAME_TICK_BEFORE);

  const thisUpdate = Date.now();
  const passDiff = passedDiff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7) : passedDiff;
  let diff = new Decimal(passDiff);
  let realDiff = diff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7)
    : new Decimal(diff).toNumber();

  if (!player.introFrozen) player.introTick += realDiff;
  if (!player.hasSeenIntro && player.introTick === 0) {
    Quote.clearQueue();
  }

  if (player.introTick > 10000 && player.introTick < 15000) {
    player.introFrozen = true;
    player.introTick = 15000;
    Quotes.elemental.intro1.show();
  }

  if (player.introTick > 30000 && player.introTick < 35000) {
    player.introFrozen = true;
    player.introTick = 35000;
    Quotes.elemental.intro2.show();
  }

  if (player.introTick > 40000 && player.introTick < 45000) {
    player.introFrozen = true;
    player.introTick = 45000;
    Quotes.elemental.intro3.show();
  }

  if (player.introTick > 60000 && player.introTick < 90000) {
    player.introFrozen = true;
    player.introTick = 90000;
    player.hasSeenIntro = true;
  }

  if (player.introTick === 15000 && player.introFrozen && !ui.$viewModel.quotes.current) {
    Quote.addToQueue(Quotes.elemental.intro1);
  }

  if (player.introTick === 35000 && player.introFrozen && !ui.$viewModel.quotes.current) {
    Quote.addToQueue(Quotes.elemental.intro2);
  }

  if (player.introTick === 45000 && player.introFrozen && !ui.$viewModel.quotes.current) {
    Quote.addToQueue(Quotes.elemental.intro3);
  }

  if (player.celestials.slabdrill.isGoodbye && player.celestials.slabdrill.goodbyeTick < 1000) {
    player.celestials.slabdrill.goodbyeTick += realDiff;
  }

  if (player.celestials.slabdrill.isGoodbye && player.celestials.slabdrill.goodbyeTick >= 1000 &&
      player.celestials.slabdrill.goodbyeTick < 2000) {
    if (Slabdrill.isCursed && Slabdrill.currentStage === 10) {
      Slabdrill.advanceLayer();
    }
    Slabdrill.quotes.reality.show();
  }

  if (player.celestials.slabdrill.isGoodbye && player.celestials.slabdrill.goodbyeTick >= 3000 &&
      player.celestials.slabdrill.goodbyeTick < 8000) {
    player.celestials.slabdrill.goodbyeTick += realDiff;
  }

  if (player.celestials.slabdrill.isGoodbye && player.celestials.slabdrill.goodbyeTick >= 8000 &&
      player.celestials.slabdrill.goodbyeTick < 9000) {
    Slabdrill.quotes.glitch.show();
  }

  if (player.celestials.slabdrill.isGoodbye && player.celestials.slabdrill.goodbyeTick >= 10000 &&
      player.celestials.slabdrill.goodbyeTick < 40000) {
    player.celestials.slabdrill.goodbyeTick += realDiff;
  }

  if (player.celestials.slabdrill.goodbyeTick >= 40000 && player.celestials.slabdrill.goodbyeTick < 50000) {
    player.celestials.slabdrill.isGoodbye = false;
    player.celestials.slabdrill.goodbyeTick = 50000;
  }

  if (Slabdrill.isCursed && player.celestials.slabdrill.goodbyeTick >= 50000) {
    if (AntimatterDimension(9).amount.eq(0)) {
      player.celestials.slabdrill.goodbyeTick = Math.min(player.celestials.slabdrill.goodbyeTick + realDiff, 120000);
    } else {
      player.celestials.slabdrill.goodbyeTick += realDiff;
    }
  }

  if (player.celestials.slabdrill.goodbyeTick >= 1000 && player.celestials.slabdrill.goodbyeTick < 2000 &&
      player.celestials.slabdrill.isGoodbye && !ui.$viewModel.quotes.current) {
    Quote.addToQueue(Quotes.slabdrill.reality);
  }

  if (player.celestials.slabdrill.goodbyeTick >= 8000 && player.celestials.slabdrill.goodbyeTick < 9000 &&
      player.celestials.slabdrill.isGoodbye && !ui.$viewModel.quotes.current) {
    Quote.addToQueue(Quotes.slabdrill.glitch);
  }

  if (player.celestials.slabdrill.isGoodbye && player.celestials.slabdrill.goodbyeTick >= 3000 &&
      player.celestials.slabdrill.goodbyeTick < 30000) {
    diff = new Decimal(0);
    realDiff = 0;
  }

  if (player.celestials.slabdrill.hasBoughtNinthDimension && player.endgame.creditsTick < 13.01e6) {
    player.endgame.credits = true;
  }
  if (player.endgame.credits && (player.endgame.creditsTick < 13.01e6 || (player.endgame.creditsTick >= 13.015e6 && player.endgame.creditsTick < 13.02e6))) {
	  player.endgame.creditsTick += realDiff;
  }
  if (player.endgame.creditsTick >= 13.02e6) {
    player.endgame.credits = false;
  }
  if (Math.floor(player.endgame.creditsTick / 1000000) === 0) {
  	if (Math.floor((player.endgame.creditsTick % 1000000) / 10000) >= 2) {
  		player.endgame.creditsTick = Math.floor(player.endgame.creditsTick / 1000000 + 1) * 1000000;
  	}
  }
  if (Math.floor(player.endgame.creditsTick / 1000000) >= 1 && Math.floor(player.endgame.creditsTick / 1000000) <= 10) {
  	if ((Math.floor((player.endgame.creditsTick % 1000000) / 10000) >= (GameDatabase.endgameCredits.people.countWhere(
      x => (typeof x.roles === "number" ? x.roles === Math.floor(player.endgame.creditsTick / 1000000) : x.roles.includes(
        Math.floor(player.endgame.creditsTick / 1000000)))) - 1)) && (player.endgame.creditsTick % 10000) >= 4500) {
  		player.endgame.creditsTick = Math.floor(player.endgame.creditsTick / 1000000 + 1) * 1000000;
  	}
  	else if ((player.endgame.creditsTick % 10000) >= 4500) {
  		player.endgame.creditsTick = Math.floor(player.endgame.creditsTick / 10000 + 1) * 10000;
  	}
  }
  if (Math.floor(player.endgame.creditsTick / 1000000) === 11) {
  	if ((Math.floor((player.endgame.creditsTick % 1000000) / 10000) >= (GameDatabase.endgameCredits.people.countWhere(
      x => (typeof x.roles === "number" ? x.roles === 11 : x.roles.includes(11))) - 1)) && (player.endgame.creditsTick % 10000) >= 7000) {
  		player.endgame.creditsTick = Math.floor(player.endgame.creditsTick / 1000000 + 1) * 1000000;
  	}
    else if ((player.endgame.creditsTick % 10000) >= 7000) {
  		player.endgame.creditsTick = Math.floor(player.endgame.creditsTick / 10000 + 1) * 10000;
  	}
  }
  if (Math.floor(player.endgame.creditsTick / 1000000) === 12) {
  	if (Math.floor((player.endgame.creditsTick % 1000000) / 10000) >= 1) {
  		player.endgame.creditsTick = Math.floor(player.endgame.creditsTick / 1000000 + 1) * 1000000;
  	}
  }

  if (Slabdrill.isDestroyed && !player.celestials.slabdrill.hasBoughtNinthDimension) {
    diff = new Decimal(0);
    realDiff = 0;
  }

  if (player.endgame.credits) {
    diff = new Decimal(0);
    realDiff = 0;
  }

  if (player.flux.fluxTime > 0) {
    let finaltick = 1;
    if ((player.flux.fluxTime - realDiff * (player.flux.level - 1) / 1000) < 0) {
      finaltick = player.flux.fluxTime / (realDiff * (player.flux.level - 1) / 1000);
    }
    player.flux.fluxTime = Math.max(player.flux.fluxTime - realDiff * (player.flux.level - 1) / 1000, 0);
    realDiff = realDiff * (((player.flux.level - 1) * finaltick) + 1);
    diff = new Decimal(diff).times(((player.flux.level - 1) * finaltick) + 1);
  }

  // In certain cases we want to allow the player to interact with the game's settings and tabs, but prevent any actual
  // resource generation from happening - in these cases, we have to make sure this all comes before the hibernation
  // check or else it'll attempt to run the game anyway
  if (Speedrun.isPausedAtStart() || (GameEnd.creditsEverClosed && !(Slabdrill.isDestroyed && !player.celestials.slabdrill.hasBoughtNinthDimension))) {
    GameUI.update();
    return;
  }

  if (!GameStorage.ignoreBackupTimer) player.backupTimer += realDiff;

  // For single ticks longer than a minute from the GameInterval loop, we assume that the device has gone to sleep or
  // hibernation - in those cases we stop the interval and simulate time instead. The gameLoop interval automatically
  // restarts itself at the end of the simulateTime call. This will not trigger for an unfocused game, as this seems to
  // result in a ~1 second tick rate for browsers.
  // Note that we have to explicitly call all the real-time mechanics with the existing value of realDiff, because
  // simply letting it run through simulateTime seems to result in it using zero
  if (player.options.hibernationCatchup && passDiff === undefined && realDiff > 6e4 && player.hasSeenIntro) {
    GameIntervals.gameLoop.stop();
    simulateTime(realDiff / 1000, true);
    realTimeMechanics(realDiff);
    return;
  }

  // Run all the functions which only depend on real time and not game time, skipping the rest of the loop if needed
  if (realTimeMechanics(realDiff)) return;

  // Ra-Nameless auto-release stored time (once every 5 ticks)
  if (Enslaved.isAutoReleasing) {
    Enslaved.autoReleaseTick++;
  }
  if (Enslaved.autoReleaseTick >= player.celestials.enslaved.pulseTime) {
    Enslaved.autoReleaseTick = 0;
    Enslaved.useStoredTime(true);
    Enslaved.isReleaseTick = true;
  } else if (!Enslaved.isReleaseTick) {
    Enslaved.nextTickDiff = realDiff;
  }
  if (Enslaved.isReleaseTick || diff === undefined) {
    diff = new Decimal(Enslaved.nextTickDiff);
  }

  Autobuyers.tick();
  Tutorial.tutorialLoop();

  if (Achievement(165).isUnlocked && player.celestials.effarig.autoAdjustGlyphWeights) {
    autoAdjustGlyphWeights();
  }

  // We do these after autobuyers, since it's possible something there might
  // change a multiplier.
  GameCache.antimatterDimensionCommonMultiplier.invalidate();
  GameCache.antimatterDimensionFinalMultipliers.invalidate();
  GameCache.infinityDimensionCommonMultiplier.invalidate();
  GameCache.timeDimensionCommonMultiplier.invalidate();
  GameCache.totalIPMult.invalidate();
  GameCache.totalCIPMult.invalidate();

  const blackHoleDiff = realDiff;
  const fixedSpeedActive = EternityChallenge(12).isRunning || player.endgame.overcharge.isRunning || player.compression.active ||
    (player.universes.current >= 1 && (player.universes.current === 1 || player.universes.current % 2 === 0));
  if (!Enslaved.isReleaseTick && !fixedSpeedActive) {
    let speedFactor;
    if (options.blackHoleSpeedup === undefined) {
      speedFactor = getGameSpeedupFactor();
    } else {
      // This is only called from simulateTime() and is calculated externally in order to avoid weirdness when game
      // speed is directly nerfed
      speedFactor = new Decimal(options.blackHoleSpeedup);
      if (speedFactor.lt(0)) throw Error("The Speed Factor of BH is" + speedFactor.toString() + " which will cause game to crash.")
      if (speedFactor.eq(0)) console.log("The Speed Factor of BH is 0! Will it cause crash?")
    }

    if (Enslaved.isStoringGameTime && !fixedSpeedActive) {
      // These variables are the actual game speed used and the game speed unaffected by time storage, respectively
      const reducedTimeFactor = getGameSpeedupFactor([GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
        GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS,
        GAME_SPEED_EFFECT.CELESTIAL_MATTER, GAME_SPEED_EFFECT.RA_BUFFS], false);
      const totalTimeFactor = getGameSpeedupFactor([GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
        GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.CELESTIAL_MATTER, GAME_SPEED_EFFECT.RA_BUFFS], false);
      const multiplicandFactor = (EndgameUpgrade(7).isBought && !player.disablePostReality) ? getGameSpeedupFactor() : totalTimeFactor.sub(reducedTimeFactor);
      const amplification = Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1);
      const beforeStore = player.celestials.enslaved.stored;
      player.celestials.enslaved.stored = Decimal.clampMax(player.celestials.enslaved.stored.plus(
        new Decimal(diff).times(multiplicandFactor).times(amplification)), Enslaved.timeCap);
      Enslaved.currentBlackHoleStoreAmountPerMs = (player.celestials.enslaved.stored.sub(beforeStore)).div(diff);
      speedFactor = reducedTimeFactor;
    }
    diff = new Decimal(diff).times(speedFactor);
  } else if (fixedSpeedActive) {
    diff = new Decimal(diff).times(getGameSpeedupFactor());
    Enslaved.currentBlackHoleStoreAmountPerMs = DC.D0;
  }
  player.celestials.ra.peakGamespeed = Decimal.max(player.celestials.ra.peakGamespeed, getGameSpeedupFactor());
  player.records.thisEndgame.peakGameSpeed = Decimal.max(player.records.thisEndgame.peakGameSpeed, getGameSpeedupFactor());
  Enslaved.isReleaseTick = false;

  // These need to all be done consecutively in order to minimize the chance of a reset occurring between real time
  // updating and game time updating. This is only particularly noticeable when game speed is 1 and the player
  // expects to see identical numbers. We also don't increment the timers if the game has been beaten (Achievement 188)
  if (!Achievement(188).isUnlocked || PlayerProgress.endgameUnlocked()) {
    player.records.realTimeDoomed += realDiff;
    player.records.realTimePlayed += realDiff;
    player.records.totalTimePlayed = player.records.totalTimePlayed.add(diff);
    player.records.thisInfinity.realTime += realDiff;
    player.records.thisInfinity.time = player.records.thisInfinity.time.add(diff);
    player.records.thisEternity.realTime += realDiff;
    if (Enslaved.isRunning && Enslaved.feltEternity && !EternityChallenge(12).isRunning && !player.endgame.overcharge.isRunning &&
       !player.compression.active && !(player.universes.current >= 1 && (player.universes.current === 1 || player.universes.current % 2 === 0))) {
      player.records.thisEternity.time = player.records.thisEternity.time.add(new Decimal(diff).times(Currency.eternities.value.clampMax(1e66).plus(1)));
    } else {
      player.records.thisEternity.time = player.records.thisEternity.time.add(diff);
    }
    player.records.thisReality.realTime += realDiff;
    player.records.thisReality.time = player.records.thisReality.time.add(diff);
    player.records.thisEndgame.realTime += realDiff;
    player.records.thisEndgame.time = player.records.thisEndgame.time.add(diff);
    player.records.thisCelestialInfinity.realTime += realDiff;
    player.records.thisCelestialInfinity.time = player.records.thisCelestialInfinity.time.add(diff);
    player.records.thisCelestialEternity.realTime += realDiff;
    player.records.thisCelestialEternity.time = player.records.thisCelestialEternity.time.add(diff);
    player.records.thisCelestialReality.realTime += realDiff;
    player.records.thisCelestialReality.time = player.records.thisCelestialReality.time.add(diff);
    player.records.thisCondense.time = player.records.thisCondense.time.add(diff);
    player.records.thisCondense.realTime += realDiff;
    player.records.thisSupernova.time = player.records.thisSupernova.time.add(diff);
    player.records.thisSupernova.realTime += realDiff;
  }

  DeltaTimeState.update(realDiff, diff);

  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick < 2000) {
    player.celestials.slabdrill.warpTick += realDiff;
  }

  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick >= 2000 && player.celestials.slabdrill.warpTick < 3000) {
    Quotes.slabdrill.curse.show();
  }

  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick >= 3000 && player.celestials.slabdrill.warpTick < 5000) {
    player.celestials.slabdrill.warpTick += realDiff;
  }

  if (player.celestials.slabdrill.isWarping && player.celestials.slabdrill.warpTick >= 2000 && player.celestials.slabdrill.warpTick < 3000
      && !ui.$viewModel.quotes.current) {
    Quote.addToQueue(Quotes.slabdrill.curse);
  }

  updateNormalAndInfinityChallenges(diff);

  // IP generation is broken into a couple of places in gameLoop; changing that might change the
  // behavior of eternity farming.
  if (!Alpha.isRunning) preProductionGenerateIP(diff);
  if (Alpha.isRunning) preProductionGenerateIP(realDiff);
  preProductionGenerateCIP(realDiff);
  preProductionGenerateVS(realDiff);

  passivePrestigeGen();

  globalPassivePrestigeGen();


  applyAutoprestige(realDiff);
  updateImaginaryMachines(realDiff);
  updateDualMachines(realDiff);

  if (Penteracts.canBuyPenteract || Hexeracts.canBuyHexeract || Hepteracts.canBuyHepteract || Octeracts.canBuyOcteract) {
    TabNotification.hypercubes.clearTrigger();
    TabNotification.hypercubes.tryTrigger();
  }

  if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) player.infinityPoints = player.antimatter;
  if (ResurgenceUpgrade.epSurge.isBought && !player.disablePostReality) player.eternityPoints = player.antimatter;

  if (ExpansionPack.teresaPack.isBought && player.celestials.teresa.autoPour && !player.disablePostReality && !EndgameUpgrade(10).isLockingMechanics) {
    Teresa.pourRM(realDiff, true);
  }

  if (Achievement(268).isUnlocked) {
    player.celestials.teresa.bestRunAM = player.antimatter;
  }

  if (!Pelle.isDoomed) {
    player.celestials.ra.alchemy[0].bestPreDoom = player.celestials.ra.alchemy[0].amount;
    player.celestials.ra.alchemy[1].bestPreDoom = player.celestials.ra.alchemy[1].amount;
    player.celestials.ra.alchemy[2].bestPreDoom = player.celestials.ra.alchemy[2].amount;
    player.celestials.ra.alchemy[3].bestPreDoom = player.celestials.ra.alchemy[3].amount;
    player.celestials.ra.alchemy[4].bestPreDoom = player.celestials.ra.alchemy[4].amount;
    player.celestials.ra.alchemy[5].bestPreDoom = player.celestials.ra.alchemy[5].amount;
    player.celestials.ra.alchemy[6].bestPreDoom = player.celestials.ra.alchemy[6].amount;
    player.celestials.ra.alchemy[7].bestPreDoom = player.celestials.ra.alchemy[7].amount;
    player.celestials.ra.alchemy[8].bestPreDoom = player.celestials.ra.alchemy[8].amount;
    player.celestials.ra.alchemy[9].bestPreDoom = player.celestials.ra.alchemy[9].amount;
    player.celestials.ra.alchemy[10].bestPreDoom = player.celestials.ra.alchemy[10].amount;
    player.celestials.ra.alchemy[11].bestPreDoom = player.celestials.ra.alchemy[11].amount;
    player.celestials.ra.alchemy[12].bestPreDoom = player.celestials.ra.alchemy[12].amount;
    player.celestials.ra.alchemy[13].bestPreDoom = player.celestials.ra.alchemy[13].amount;
    player.celestials.ra.alchemy[14].bestPreDoom = player.celestials.ra.alchemy[14].amount;
    player.celestials.ra.alchemy[15].bestPreDoom = player.celestials.ra.alchemy[15].amount;
    player.celestials.ra.alchemy[16].bestPreDoom = player.celestials.ra.alchemy[16].amount;
    player.celestials.ra.alchemy[17].bestPreDoom = player.celestials.ra.alchemy[17].amount;
    player.celestials.ra.alchemy[18].bestPreDoom = player.celestials.ra.alchemy[18].amount;
    player.celestials.ra.alchemy[19].bestPreDoom = player.celestials.ra.alchemy[19].amount;
    player.celestials.ra.alchemy[20].bestPreDoom = player.celestials.ra.alchemy[20].amount;
  }

  if (ExpansionPack.effarigPack.isBought && !player.disablePostReality) {
    const effarigTick = Time.unscaledDeltaTime.totalMilliseconds.div(player.records.bestEndgame.realTime / 10).toNumber();
    player.celestials.effarig.effarigTime += effarigTick;
    if (player.celestials.effarig.effarigTime >= 1) {
      player.celestials.effarig.effarigTime -= 1;
      player.celestials.effarig.effarigLayer += 1;
    }
    if (player.celestials.effarig.effarigLayer >= 1) {
      EffarigUnlock.infinity.unlock();
    }
    if (player.celestials.effarig.effarigLayer >= 2) {
      EffarigUnlock.eternity.unlock();
    }
    if (player.celestials.effarig.effarigLayer >= 3) {
      EffarigUnlock.reality.unlock();
    }
  }

  if (ExpansionPack.vPack.isBought && !player.disablePostReality) {
    const vTick = Time.unscaledDeltaTime.totalMilliseconds.div(VUpgrade.auto.effectValue * 1000).toNumber();
    player.celestials.v.vTime += vTick;
    if (player.celestials.v.vAuto === 0 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[0] < 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.runUnlocks[0] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 1 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[1] < 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.runUnlocks[1] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 2 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[2] < 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.runUnlocks[2] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 3 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[3] < 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.runUnlocks[3] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 4 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[4] < 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.runUnlocks[4] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 5 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[5] < 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.runUnlocks[5] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 0 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[6] < 5 && player.celestials.v.vLayer === 1) {
      player.celestials.v.runUnlocks[6] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 1 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[7] < 5 && player.celestials.v.vLayer === 1) {
      player.celestials.v.runUnlocks[7] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vAuto === 2 && player.celestials.v.vTime >= 1 && player.celestials.v.runUnlocks[8] < 5 && player.celestials.v.vLayer === 1) {
      player.celestials.v.runUnlocks[8] += 1;
      V.updateTotalRunUnlocks();
    }
    if (player.celestials.v.vTime >= 1) {
      player.celestials.v.vTime -= 1;
      player.celestials.v.vAuto += 1;
      player.celestials.v.vTotal += 1;
    }
    if (player.celestials.v.vAuto >= 6 && player.celestials.v.vLayer === 0) {
      player.celestials.v.vAuto = 0;
    }
    if (player.celestials.v.vAuto >= 3 && player.celestials.v.vLayer === 1) {
      player.celestials.v.vAuto = 0;
    }
    if (player.celestials.v.vTotal >= 36 && V.isFlipped && player.celestials.v.vLayer === 0) {
      player.celestials.v.vTime = 0;
      player.celestials.v.vAuto = 0;
      player.celestials.v.vTotal = 0;
      player.celestials.v.vLayer = 1;
    }
  }

  const uncountabilityGain = new Decimal(AlchemyResource.uncountability.effectValue).times(Time.unscaledDeltaTime.totalSeconds);
  Currency.realities.add(uncountabilityGain);
  Currency.perkPoints.add(uncountabilityGain);

  const masteryGain = new Decimal(EndgameMastery(11).effectOrDefault(0)).times(Time.unscaledDeltaTime.totalSeconds.div(60));
  Currency.perkPoints.add(masteryGain);
  
  if ((Perk.autocompleteEC1.canBeApplied || EndgameMastery(22).isBought) && !player.disablePostReality) player.reality.lastAutoEC += realDiff;

  EternityChallenge(12).tryFail();
  Achievements._power.invalidate();

  TimeDimensions.tick(diff);
  InfinityDimensions.tick(diff);
  AntimatterDimensions.tick(diff, realDiff);

  const gain = Decimal.clampMin(FreeTickspeed.fromShards(Currency.timeShards.value).newAmount.sub(player.totalTickGained), 0);
  player.totalTickGained = player.totalTickGained.add(gain);

  updatePrestigeRates();
  tryCompleteInfinityChallenges();

  EternityChallenges.autoComplete.tick();

  NormalChallenges.tryChargeAll();

  const repDiff = Alpha.isRunning ? Decimal.pow(new Decimal(diff).div(realDiff), 0.1).times(realDiff) : diff;
  replicantiLoop(repDiff);

  Currency.dilatedTime.add(getDilationGainPerSecond().times(realDiff).div(1000));

  updateTachyonGalaxies();
  Currency.timeTheorems.add(getTTPerSecond().times(Alpha.isRunning || Slabdrill.isCursed ? realDiff : diff).div(1000));
  Currency.endgameSkills.add(getESPerSecond().times(realDiff).div(1000));
  InfinityDimensions.tryAutoUnlock();

  BlackHoles.updatePhases(blackHoleDiff);

  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ENDGAME) {
    recalculateAllGlyphs();
  }

  // Unlocks dilation at a certain total TT count for free, but we add the cost first in order to make
  // sure that TT count doesn't go negative and that we can actually buy it. This technically bumps the max theorem
  // amount up as well, but at this point of the game 5k TT is insignificant to basically all other sources of TT.
  if ((Ra.unlocks.autoUnlockDilation.canBeApplied && !player.disablePostReality) &&
    Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement) &&
    !isInCelestialReality() &&
    !Pelle.isDoomed) {
    Currency.timeTheorems.add(TimeStudy.dilation.cost);
    TimeStudy.dilation.purchase(true);
  }

  applyAutoUnlockPerks();
  if (GlyphSelection.active) GlyphSelection.update(gainedGlyphLevel());

  // There are some external checks which prevent excessive resource gain with Teresa-25; it may give TP outside of
  // dilation, but the TP gain function is also coded to behave differently if it's active
  const teresa1 = player.dilation.active && (Ra.unlocks.autoTP.canBeApplied || EndgameMilestone.startRa.isReached);
  const teresa25 = !isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied;
  if ((teresa1 || teresa25) && !Pelle.isDoomed && !player.disablePostReality) rewardTP();

  if (DivinityMilestone.divineDimensions.isReached && Pelle.isDoomed) {
    player.celestials.pelle.remnants = player.celestials.pelle.remnants.add(Decimal.max(Pelle.remnantsGain, 0));
  }

  if (DivinityMilestone.hadronEmpowerment.isReached && !Pelle.isDoomed) {
    if (player.antimatter.gte(Laitela.antimatterNeededToDestabilize)) {
      player.celestials.laitela.difficultyTier++;
      player.celestials.laitela.fastestCompletion = 300;
    }
    if (player.celestials.laitela.difficultyTier >= 8) {
      Laitela.hadronize();
    }
  }

  const uncapped = Decimal.min(player.endgame.unnerfedCelestialMatter, CelestialDimensions.SOFTCAP);
  const instability = Decimal.pow(Decimal.max(player.endgame.unnerfedCelestialMatter.div(CelestialDimensions.SOFTCAP), 1), 1 / CelestialDimensions.softcapPow);
  const beforeOverflow = Decimal.min(uncapped.times(instability), CelestialDimensions.OVERFLOW);
  const afterOverflow = Decimal.pow(Decimal.max(uncapped.times(instability).div(CelestialDimensions.OVERFLOW), 1), 1 / CelestialDimensions.OVERFLOW_MAG);
  const beforeMassOverflow = Decimal.min(beforeOverflow.times(afterOverflow), CelestialDimensions.MASS_OVERFLOW);
  const afterMassOverflow = Decimal.pow(Decimal.max(beforeOverflow.times(afterOverflow).div(CelestialDimensions.MASS_OVERFLOW), 1), 1 / CelestialDimensions.MASS_OVERFLOW_MAG);
  const totalPending = player.endgame.celDimExpansion.isBroken ? beforeMassOverflow.times(afterMassOverflow) : Decimal.min(beforeMassOverflow.times(afterMassOverflow), DC.NUMMAX);
  player.endgame.celestialMatter = totalPending;
  player.records.thisCelestialInfinity.maxCM = player.records.thisCelestialInfinity.maxCM.max(totalPending);
  player.records.thisCelestialEternity.maxCM = player.records.thisCelestialEternity.maxCM.max(totalPending);
  player.records.thisCelestialReality.maxCM = player.records.thisCelestialReality.maxCM.max(totalPending);
  player.records.totalCelMatter = player.records.totalCelMatter.max(totalPending);
  player.records.totalCelestialRealityCelMatter = player.records.totalCelestialRealityCelMatter.max(totalPending);
  player.records.totalCelestialEternityCelMatter = player.records.totalCelestialEternityCelMatter.max(totalPending);
  player.records.totalCelestialInfinityCelMatter = player.records.totalCelestialInfinityCelMatter.max(totalPending);

  let darkMatterProd = DC.D1;
  const unnerfedDM = player.celestials.laitela.unnerfedDarkMatter;
  darkMatterProd = unnerfedDM;
  const darkMatterThreshold1 = Laitela.darkMatterSoftcap1;
  if (darkMatterProd.gt(darkMatterThreshold1)) {
    darkMatterProd = Decimal.min(darkMatterProd, darkMatterThreshold1).times(
      Decimal.pow(Decimal.max(darkMatterProd.div(darkMatterThreshold1), 1), new Decimal(0.75).pow(
      Hexeracts.softcapReduction()).pow(1 - SingularityMilestone.weakenDMSoftcaps.effectOrDefault(0))));
  }
  const darkMatterThreshold2 = Laitela.darkMatterSoftcap2;
  if (darkMatterProd.gt(darkMatterThreshold2)) {
    darkMatterProd = Decimal.min(darkMatterProd, darkMatterThreshold2).times(
      Decimal.pow(Decimal.max(darkMatterProd.div(darkMatterThreshold2), 1), new Decimal(0.25).pow(
      Hexeracts.softcapReduction()).pow(1 - SingularityMilestone.weakenDMSoftcaps.effectOrDefault(0))));
  }
  const darkMatterThreshold3 = Laitela.darkMatterCap;
  if (darkMatterProd.gt(darkMatterThreshold3)) {
    darkMatterProd = Decimal.min(darkMatterProd, darkMatterThreshold3).times(
      Decimal.pow(Decimal.max(darkMatterProd.div(darkMatterThreshold3), 1), new Decimal(0.1).pow(
      1 - SingularityMilestone.weakenDMSoftcaps.effectOrDefault(0))));
  }
  const darkMatterThreshold4 = Laitela.darkMatterOmegaSoftcap;
  if (darkMatterProd.gt(darkMatterThreshold4)) {
    darkMatterProd = Decimal.min(darkMatterProd, darkMatterThreshold4).times(
      Decimal.pow(Decimal.max(darkMatterProd.div(darkMatterThreshold4), 1), new Decimal(0.375)));
  }
  player.celestials.laitela.darkMatter = Alpha.isDestroyed ? new Decimal(darkMatterProd) : Decimal.min(darkMatterProd, Laitela.darkMatterCap);
  player.celestials.laitela.maxDarkMatter = Decimal.max(player.celestials.laitela.darkMatter, player.celestials.laitela.maxDarkMatter);
  
  if (EndgameMastery(111).isBought && !player.disablePostReality) {
    player.reality.imaginaryMachines = MachineHandler.currentIMCap;
  }

  if (GalacticPower.isUnlocked) {
    Currency.galacticPower.add(getGalacticPowerGainPerSecond().times(realDiff).div(1000));
  }

  if (Ethereal.isUnlocked) {
    Currency.etherealPower.add(getEtherealPowerGainPerSecond().times(realDiff).div(1000));
  }

  if (Ethereal.isStarPowerUnlocked) {
    Currency.starPower.add(getStarPowerGainPerSecond().times(realDiff).div(1000));
    for (let star = 0; star < 9; star++) {
      freeStarReset(star, realDiff);
    }
  }

  if (LHC.nullifiedVoidRunning) {
    Currency.nullParticles.add(getNullParticleGainPerSecond().times(realDiff).div(1000));
  }

  if (PlayerProgress.compressionUnlocked()) Currency.thermalRadiation.add(getThermalRadiationGainPerSecond().times(realDiff).div(1000));
  updateElectromagneticWaves();

  if (player.universes.current === 1) Currency.relativisticParticles.add(getRelativisticParticlesPerSecond().times(realDiff).div(1000));
  if (player.universes.current === 2) Currency.molecularMass.add(getMolecularMassPerSecond().times(realDiff).div(1000));
  
  player.records.bestAntimatterExponentOutsideDoom = Decimal.max(Decimal.log10(
    Decimal.max(player.records.totalAntimatterOutsideDoom, 1)), player.records.bestAntimatterExponentOutsideDoom);

  player.records.thisReality.galaxies = Decimal.max(player.records.thisReality.galaxies, actualBaseGalaxies());

  player.records.bestEndgame.galaxies = Decimal.max(player.records.bestEndgame.galaxies, actualBaseGalaxies());

  if (Enslaved.canTickHintTimer) {
    player.celestials.enslaved.hintUnlockProgress += Enslaved.isRunning ? realDiff : (realDiff * 0.4);
    if (player.celestials.enslaved.hintUnlockProgress > (TimeSpan.fromHours(new Decimal(5)).totalMilliseconds.toNumber())) {
      EnslavedProgress.hintsUnlocked.giveProgress();
      Enslaved.quotes.hintUnlock.show();
    }
  }

  if (Slabdrill.isCursed) {
    Currency.serpentinePower.add(Slabdrill.powerPerSecond(realDiff));
  }

  if (Slabdrill.isCursed) {
    const slabBoost = SlabdrillUnlocks.timeStudy181.isUnlocked ? Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.effectOrDefault(1) : 1;
    if (Slabdrill.currentStage >= 2) player.reality.glyphs.sac.power = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 4) player.reality.glyphs.sac.infinity = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 6) player.reality.glyphs.sac.replication = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 8) player.reality.glyphs.sac.time = Slabdrill.power.pow(slabBoost);
    if (Slabdrill.currentStage >= 10) player.reality.glyphs.sac.dilation = Slabdrill.power.pow(slabBoost);
  }

  if (Slabdrill.isCursed && SlabdrillUnlocks.timeStudy181.isUnlocked) {
    player.celestials.effarig.relicShards = Slabdrill.power.times(
      SlabdrillUnlocks.dilation.isUnlocked ? AlchemyResource.effarig.effectValue : 1);
  }

  if (Slabdrill.isCursed && SlabdrillUnlocks.dilation.isUnlocked) {
    for (let ca = 0; ca < 5; ca++) {
      player.celestials.ra.alchemy[ca].amount = AlchemyResource.all[ca].cap;
      player.celestials.ra.alchemy[10].amount = AlchemyResource.all[10].cap;
    }
  }

  const hadrons = player.celestials.laitela.hadrons;
  const waves = player.compression.totalElectromagneticWaves.toNumber();
  hadrons.trueTotal = hadrons.total + waves;
  hadrons.totalLight = hadrons.light + waves;
  hadrons.totalDark = hadrons.dark + waves;
  hadrons.totalExotic = hadrons.exotic + waves;

  laitelaRealityTick(realDiff);
  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  V.updateTotalRunUnlocks();
  Ra.checkForUnlocks();
  AutomatorBackend.update(realDiff);
  Pelle.gameLoop(realDiff);
  GalaxyGenerator.loop(realDiff);
  GameEnd.gameLoop(realDiff);
  LHC.gameLoop(realDiff);
  tryAdvanceSector();
  if (Ascension.isUnlocked) player.endgame.ascensionTimer += realDiff;
  tryAscend();
  player.endgame.overcharge.chargesLeft.infinite = player.endgame.overcharge.completions.bi - player.endgame.overcharge.charged.infinite.size;
  player.endgame.overcharge.chargesLeft.eternal = player.endgame.overcharge.completions.eter - player.endgame.overcharge.charged.eternal.size;
  player.endgame.overcharge.chargesLeft.complex = player.endgame.overcharge.completions.chall - player.endgame.overcharge.charged.complex.size;
  player.endgame.overcharge.chargesLeft.temporal = player.endgame.overcharge.completions.ts - player.endgame.overcharge.charged.temporal.size;
  quoteCheck();

  if (!Enslaved.canAmplify) {
    Enslaved.boostReality = false;
  }

  // Stopping these checks after CREDITS_START reduces lag and allows for the glyph customization modal to appear
  if (GameEnd.endState < END_STATE_MARKERS.CREDITS_START) {
    if (Tabs.current.isPermanentlyHidden) {
      const tab = Tabs.all.reverse().find(t => !t.isPermanentlyHidden && t.id !== 10);
      if (tab) tab.show(true);
      else [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }

    if (Tabs.current.subtabs.find(t => t.isOpen).isPermanentlyHidden) {
      [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }
  }

  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

function updatePrestigeRates() {
  const currentIPmin = gainedInfinityPoints().dividedBy(Math.clampMin(0.0005, Time.thisInfinityRealTime.totalMinutes.toNumber()));
  if (currentIPmin.gt(player.records.thisInfinity.bestIPmin) && Player.canCrunch) {
    player.records.thisInfinity.bestIPmin = currentIPmin;
    player.records.thisInfinity.bestIPminVal = gainedInfinityPoints();
  }

  const currentEPmin = gainedEternityPoints().dividedBy(Math.clampMin(0.0005, Time.thisEternityRealTime.totalMinutes.toNumber()));
  if (currentEPmin.gt(player.records.thisEternity.bestEPmin) && Player.canEternity) {
    player.records.thisEternity.bestEPmin = currentEPmin;
    player.records.thisEternity.bestEPminVal = gainedEternityPoints();
  }

  const currentRSmin = Effarig.shardsGained.div(Decimal.clampMin(0.0005, Time.thisRealityRealTime.totalMinutes));
  if (currentRSmin.gt(player.records.thisReality.bestRSmin) && isRealityAvailable()) {
    player.records.thisReality.bestRSmin = currentRSmin;
    player.records.thisReality.bestRSminVal = Effarig.shardsGained;
  }

  const currentCPmin = gainedCelestialPoints().div(Decimal.clampMin(0.0005, Time.thisEndgameRealTime.totalMinutes));
  if (currentCPmin.gt(player.records.thisEndgame.bestCPmin) && isEndgameAvailable()) {
    player.records.thisEndgame.bestCPmin = currentCPmin;
    player.records.thisEndgame.bestCPminVal = gainedCelestialPoints();
  }

  const currentDPmin = gainedDoomedParticles().div(Decimal.clampMin(0.0005, Time.thisEndgameRealTime.totalMinutes));
  if (currentDPmin.gt(player.records.thisEndgame.bestDPmin) && isEndgameAvailable()) {
    player.records.thisEndgame.bestDPmin = currentDPmin;
    player.records.thisEndgame.bestDPminVal = gainedDoomedParticles();
  }

  const currentCIPmin = gainedCelestialInfinityPoints().dividedBy(Decimal.clampMin(0.0005, Time.thisCelestialInfinityRealTime.totalMinutes));
  if (currentCIPmin.gt(player.records.thisCelestialInfinity.bestCIPmin) && Currency.celestialMatter.gte(DC.NUMMAX)) {
    player.records.thisCelestialInfinity.bestCIPmin = currentCIPmin;
    player.records.thisCelestialInfinity.bestCIPminVal = gainedCelestialInfinityPoints();
  }

  const currentCEPmin = gainedCelestialEternityPoints().dividedBy(Decimal.clampMin(0.0005, Time.thisCelestialEternityRealTime.totalMinutes));
  if (currentCEPmin.gt(player.records.thisCelestialEternity.bestCEPmin) && Currency.celestialInfinityPoints.gte(DC.NUMMAX)) {
    player.records.thisCelestialEternity.bestCEPmin = currentCEPmin;
    player.records.thisCelestialEternity.bestCEPminVal = gainedCelestialEternityPoints();
  }

  const currentVSmin = gainedDivineStars().dividedBy(Decimal.clampMin(0.0005, Time.thisCondenseRealTime.totalMinutes));
  if (currentVSmin.gt(player.records.thisCondense.bestVSmin) && Currency.divineMatter.gte(DC.NUMMAX)) {
    player.records.thisCondense.bestVSmin = currentVSmin;
    player.records.thisCondense.bestVSminVal = gainedDivineStars();
  }

  const currentNebmin = gainedNebulae().dividedBy(Decimal.clampMin(0.0005, Time.thisSupernovaRealTime.totalMinutes));
  if (currentNebmin.gt(player.records.thisSupernova.bestNebmin) && Currency.divineStars.gte(DC.NUMMAX)) {
    player.records.thisSupernova.bestNebmin = currentNebmin;
    player.records.thisSupernova.bestNebminVal = gainedNebulae();
  }
}

function globalPassivePrestigeGen(realDiff) {
  let realitiedGain = DC.D0;
  let realityMult = DC.D1;
  if (ResurgenceUpgrade.realSurge.isBought && !player.disablePostReality) {
    realitiedGain = Time.deltaTime.times(realityMult);
    player.endgame.partRealitied = player.endgame.partRealitied.add(realitiedGain);
    Currency.realities.add(player.endgame.partRealitied.floor());
    player.endgame.partRealitied = player.endgame.partRealitied.sub(player.endgame.partRealitied.floor());
  }

  let endgamedGain = 0;
  let endgameMult = 1;
  endgameMult *= ((ExpansionPack.enslavedPack.isBought && !player.disablePostReality)
    ? Math.floor(1 + Math.pow(Math.log10(Math.min(Tesseracts.effectiveCount, 1000) * Math.max(Math.log10(Tesseracts.effectiveCount) - 2, 1) + 1), Math.log10(player.endgames + 1)))
    : 1);
  endgameMult *= Math.pow(1.33, Alpha.currentStage);
  if (DivinityMilestone.firstDivine.isReached && !player.disablePostReality) endgameMult *= 10;
  endgameMult *= DivineDimensions.conversionFormula1.toNumber();
  if (EndgameUpgrade(8).isBought) {
    endgamedGain = endgameMult * Time.unscaledDeltaTime.totalMilliseconds.div(Alpha.isDestroyed ? Decimal.clampMin(330, EndgameUpgrade(8).effectValue) : Decimal.clampMin(1000, EndgameUpgrade(8).effectValue)).toNumber();
    player.endgame.partEndgamed += endgamedGain;
    Currency.endgames.add(Math.floor(player.endgame.partEndgamed));
    player.endgame.partEndgamed = (player.endgame.partEndgamed - Math.floor(player.endgame.partEndgamed));
  }

  let celInfGen = DC.D0;
  let celInfMult = DC.D1;
  celInfMult = celInfMult.times(gainedCelestialInfinities());
  if (CelestialBreakInfinityUpgrade.celInfGen.isBought) {
    celInfGen = celInfGen.plus(new Decimal(0.5).times(Time.unscaledDeltaTime.totalMilliseconds).div(
      player.records.bestCelestialInfinity.realTime));
  }
  celInfGen = celInfGen.plus(player.endgame.celDimExpansion.partCelestialInfinitied);
  Currency.celestialInfinities.add(celInfGen.floor());
  player.endgame.celDimExpansion.partCelestialInfinitied = celInfGen.minus(celInfGen.floor()).toNumber();

  let condenseGen = DC.D0;
  let condenseMult = DC.D1;
  condenseMult = condenseMult.times(gainedCondenses());
  if (DivinityUpgrade.divineL5U4.isBought) {
    condenseGen = condenseGen.plus(new Decimal(0.1).times(Time.unscaledDeltaTime.totalMilliseconds).div(
      player.records.bestCondense.realTime)).times(condenseMult);
  }
  condenseGen = condenseGen.plus(player.celestials.pelle.divinity.partCondensed);
  Currency.condenses.add(condenseGen.floor());
  player.celestials.pelle.divinity.partCondensed = condenseGen.minus(condenseGen.floor()).toNumber();
}

function passivePrestigeGen(realDiff) {
  let eternitiedGain = DC.D0;
  if (RealityUpgrade(14).isBought && (!Pelle.isDoomed || PelleRealityUpgrade.eternalFlow.canBeApplied) && !player.disablePostReality) {
    eternitiedGain = DC.D1.timesEffectsOf(
      Achievement(113),
      RealityUpgrade(3),
      RealityUpgrade(14)
    );
    eternitiedGain = Decimal.times(eternitiedGain, getAdjustedGlyphEffect("timeetermult"));
    eternitiedGain = Time.deltaTime.times(Decimal.pow(eternitiedGain, AlchemyResource.eternity.effectValue));
    eternitiedGain = eternitiedGain.powEffectOf(Ra.unlocks.eternityGenBuff);
    player.reality.partEternitied = player.reality.partEternitied.plus(eternitiedGain);
    Currency.eternities.add(player.reality.partEternitied.floor());
    player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
  }

  if (!EternityChallenge(4).isRunning) {
    let infGen = DC.D0;
    if (BreakInfinityUpgrade.infinitiedGen.isBought && (!Pelle.isDoomed || PelleDestructionUpgrade.passiveInfGen.canBeApplied)) {
      // Multipliers are done this way to explicitly exclude ach87 and TS32
      if (Alpha.isRunning) infGen = infGen.plus(new Decimal(0.5).times(Time.unscaledDeltaTime.totalMilliseconds).div(
        Alpha.isDestroyed ? player.records.bestInfinity.time : Decimal.clampMin(50, player.records.bestInfinity.time)));
      if (!Alpha.isRunning) infGen = infGen.plus(new Decimal(0.5).times(Time.deltaTimeMs).div(
        Alpha.isDestroyed ? player.records.bestInfinity.time : Decimal.clampMin(50, player.records.bestInfinity.time)));
      infGen = infGen.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infGen = infGen.times(getAdjustedGlyphEffect("infinityinfmult"));
    }
    if (RealityUpgrade(11).isBought && (!Pelle.isDoomed || PelleRealityUpgrade.boundlessFlow.canBeApplied) && !player.disablePostReality) {
      infGen = infGen.plus(RealityUpgrade(11).effectValue.times(Time.deltaTime));
    }
    if (EffarigUnlock.eternity.isUnlocked && (!Pelle.isDoomed || PelleCelestialUpgrade.effarigRewards.canBeApplied)) {
      // We consider half of the eternities we gained above this tick
      // to have been gained before the infinities, and thus not to
      // count here. This gives us the desirable behavior that
      // infinities and eternities gained overall will be the same
      // for two ticks as for one tick of twice the length.
      infGen = infGen.plus(gainedInfinities().times(
        Currency.eternities.gte(DC.E9E15) ? Currency.eternities.value : Currency.eternities.value.minus(eternitiedGain.div(2).floor())).times(Time.deltaTime));
    }
    infGen = infGen.plus(player.partInfinitied);
    Currency.infinities.add(infGen.floor());
    player.partInfinitied = infGen.minus(infGen.floor()).toNumber();
  }
}

// Applies all perks which automatically unlock things when passing certain thresholds, needs to be checked every tick
function applyAutoUnlockPerks() {
  if (!TimeDimension(8).isUnlocked && (Perk.autounlockTD.canBeApplied && !player.disablePostReality)) {
    for (let dim = 5; dim <= 8; ++dim) TimeStudy.timeDimension(dim).purchase();
  }
  if (Perk.autounlockDilation3.canBeApplied && !player.disablePostReality) buyDilationUpgrade(DilationUpgrade.ttGenerator.id);
  if (Perk.autounlockReality.canBeApplied && !player.disablePostReality) TimeStudy.reality.purchase(true);
  applyEU2();
}

function laitelaRealityTick(realDiff) {
  const laitelaInfo = player.celestials.laitela;
  if (!Laitela.isRunning) return;
  if (laitelaInfo.entropy.gte(0)) {
    laitelaInfo.entropy = laitelaInfo.entropy.add(new Decimal(realDiff / 1000).times(Laitela.entropyGainPerSecond));
  }

  // Setting entropy to -1 on completion prevents the modal from showing up repeatedly
  if (laitelaInfo.entropy.gte(1)) {
    let completionText = `Lai'tela's Reality has been destabilized after ${Time.thisRealityRealTime.toStringShort()}.`;
    laitelaInfo.entropy = new Decimal(-1);
    const oldInfo = {
      fastestCompletion: laitelaInfo.fastestCompletion,
      difficultyTier: laitelaInfo.difficultyTier,
      realityReward: Laitela.realityReward
    };
    laitelaInfo.thisCompletion = Time.thisRealityRealTime.totalSeconds.toNumber();
    laitelaInfo.fastestCompletion = Math.min(laitelaInfo.thisCompletion, laitelaInfo.fastestCompletion);
    clearCelestialRuns();
    if (Time.thisRealityRealTime.totalSeconds.toNumber() < 30) {
      laitelaInfo.difficultyTier++;
      laitelaInfo.fastestCompletion = 300;
      completionText += laitelaBeatText(Laitela.maxAllowedDimension + 1);
      /*for (const quote of Laitela.quotes.all) {
        if (quote.requirement) {
          quote.show();
        }
      }*/
    }
    if (Laitela.realityReward.gt(oldInfo.realityReward)) {
      completionText += `<br><br>Dark Matter Multiplier: ${formatX(oldInfo.realityReward, 2, 2)}
      ➜ ${formatX(Laitela.realityReward, 2, 2)}`;
      if (oldInfo.fastestCompletion === 3600 || oldInfo.fastestCompletion === 300 && oldInfo.difficultyTier > 0) {
        if (Time.thisRealityRealTime.totalSeconds.toNumber() < 30) {
          // First attempt - destabilising
          completionText += `<br>Best Completion Time: None ➜ Destabilized
          <br>Highest Active Dimension: ${formatInt(8 - oldInfo.difficultyTier)} ➜
          ${formatInt(8 - laitelaInfo.difficultyTier)}`;
        } else {
          // First attempt - not destabilising
          completionText += `<br>Best Completion Time: None ➜
            ${TimeSpan.fromSeconds(new Decimal(laitelaInfo.fastestCompletion)).toStringShort()}
            <br>Highest Active Dimension: ${formatInt(8 - laitelaInfo.difficultyTier)}`;
        }
      } else if (Time.thisRealityRealTime.totalSeconds.toNumber() < 30) {
        // Second+ attempt - destabilising
        completionText += `<br>Best Completion Time: ${TimeSpan.fromSeconds(new Decimal(oldInfo.fastestCompletion)).toStringShort()}
          ➜ Destabilized
          <br>Highest Active Dimension: ${formatInt(8 - oldInfo.difficultyTier)} ➜
          ${formatInt(8 - laitelaInfo.difficultyTier)}`;
      } else {
        // Second+ attempt - not destabilising
        completionText += `<br>Best Completion Time: ${TimeSpan.fromSeconds(new Decimal(oldInfo.fastestCompletion)).toStringShort()}
        ➜ ${TimeSpan.fromSeconds(new Decimal(laitelaInfo.fastestCompletion)).toStringShort()}
        <br>Highest Active Dimension: ${formatInt(8 - oldInfo.difficultyTier)}`;
      }
      player.records.bestReality.laitelaSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    } else {
      completionText += ` You need to destabilize in faster than
        ${TimeSpan.fromSeconds(new Decimal(laitelaInfo.fastestCompletion)).toStringShort()} to improve your multiplier.`;
    }
    if (Laitela.isFullyDestabilized) SpeedrunMilestones(24).tryComplete();
    Modal.message.show(completionText, {}, 2);
  }
}

function laitelaBeatText(disabledDim) {
  switch (disabledDim) {
    case 1: return `<br><br>Lai'tela's Reality will now completely disable production from all Dimensions.
        The Reality can still be entered, but further destabilization is no longer possible.
        For completely destabilizing the Reality, you also get an additional ${formatX(Math.pow(8, Laitela.hadronizes + 1))}
        to Dark Energy gain.`;
    case 2: return `<br><br>Lai'tela's Reality will now disable production from all 2nd Dimensions during
      future runs, but the reward will be ${formatInt(100)} times stronger than before. Completely destabilizing
      the Reality for the final Dimension will give you an additional ${formatX(Math.pow(8, Laitela.hadronizes + 1))}
      to Dark Energy gain.`;
    case 3: return `<br><br>Lai'tela's Reality will now disable production from all 3rd Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before.`;
    case 8: return `<br><br>Lai'tela's Reality will now disable production from all 8th Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before. This boost can be
        repeated for each remaining Dimension by reaching destabilization within ${formatInt(30)} seconds again.`;
    default: return `<br><br>Lai'tela's Reality will now disable production from all
        ${disabledDim}th Dimensions during future runs, but the reward will be
        ${formatInt(100)} times stronger than before.`;
  }
}

// This gives IP/EP/RM from the respective upgrades that reward the prestige currencies continuously
function applyAutoprestige(diff) {
  Currency.infinityPoints.add(TimeStudy(181).effectOrDefault(0));

  if (TeresaUnlocks.epGen.canBeApplied || (LHC.voidRunning && player.endgame.largeHadronCollider.void.nullified)) {
    Currency.eternityPoints.add(player.records.thisEternity.bestEPmin.times(DC.D0_01)
      .times(getGameSpeedupFactor().times(diff).div(1000)).timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige));
  }

  if (InfinityUpgrade.ipGen.isCharged && !Pelle.isDoomed) {
    const addedRM = MachineHandler.gainedRealityMachines
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(diff).div(1000);
    Currency.realityMachines.add(addedRM);
  }

  if (PelleRifts.chaos.milestones[2].canBeApplied) {
    Currency.eternityPoints.add(gainedEternityPoints().times(DC.D0_1).times(diff).div(1000));
  }

  if (CelestialEternityUpgrade.passiveCIP.isBought) {
    Currency.celestialInfinityPoints.add(player.records.thisCelestialInfinity.bestCIPmin.times(DC.D0_01).times(diff).div(1000));
  }

  if (DivinityUpgrade.divineL5U5.isBought) {
    Currency.divineStars.add(player.records.thisCondense.bestVSmin.times(DC.D0_01).times(diff).div(1000));
  }
}

function updateImaginaryMachines(diff) {
  MachineHandler.updateIMCap();
  Currency.imaginaryMachines.add(MachineHandler.gainedImaginaryMachines(diff));
}

function updateDualMachines(diff) {
  MachineHandler.updateDMCap();
  Currency.dualMachines.add(MachineHandler.gainedDualMachines(diff));
}

function updateTachyonGalaxies() {
  const tachyonGalaxyMult = Effects.max(1, DilationUpgrade.doubleGalaxies);
  const tachyonGalaxyThreshold = Alpha.isDestroyed ? Infinity : 1000;
  const galaxiesPerOoM = decimalInfinitesimalLogarithmSolution(getBaseTachyonGalaxyMult());
  player.dilation.baseTachyonGalaxies = Decimal.max(player.dilation.baseTachyonGalaxies,
    Decimal.floor(Currency.dilatedTime.value.dividedBy(1000).log10().times(galaxiesPerOoM).div(getTachyonGalaxyPowers())).add(1));
  player.dilation.nextThreshold = new Decimal(getTachyonGalaxyMultForDisplay()).eq(1)
    ? Currency.dilatedTime.value : DC.E3.times(new Decimal(getTachyonGalaxyMultForDisplay()).pow(player.dilation.baseTachyonGalaxies));
  player.dilation.totalTachyonGalaxies =
    Decimal.min(player.dilation.baseTachyonGalaxies.times(tachyonGalaxyMult), tachyonGalaxyThreshold).add(
    Decimal.max(player.dilation.baseTachyonGalaxies.times(tachyonGalaxyMult).sub(tachyonGalaxyThreshold), 0).div(tachyonGalaxyMult));

  player.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies.times(DilationUpgrade.galaxyMultiplier.effectValue);
}

function updateElectromagneticWaves() {
  const electromagneticWaveMult = Effects.max(1, CompressionUpgrade.doubleWaves);
  const thresholdMult = getElectroWaveMult();
  player.compression.baseElectromagneticWaves = Decimal.max(player.compression.baseElectromagneticWaves,
    Decimal.floor(Decimal.log(Currency.thermalRadiation.value.div(1000), thresholdMult)).add(1));
  player.compression.nextThreshold = DC.E3.times(new Decimal(thresholdMult)
    .pow(player.compression.baseElectromagneticWaves));
  player.compression.totalElectromagneticWaves = player.compression.baseElectromagneticWaves.times(electromagneticWaveMult);
}

export function getTTPerSecond() {
  // All TT multipliers (note that this is equal to 1 pre-Ra)
  let ttMult = new Decimal(Effects.product(
    Ra.unlocks.continuousTTBoost.effects.ttGen,
    Achievement(137),
    Achievement(156),
  ));
  ttMult = ttMult.timesEffectOf(Ra.unlocks.achievementTTMult);
  if (GlyphAlteration.isAdded("dilation")) ttMult = ttMult.times(getSecondaryGlyphEffect("dilationTTgen"));

  let pelleTTMult = DC.D1;
  if (PelleCelestialUpgrade.raV3.canBeApplied) pelleTTMult = pelleTTMult.times(Effects.product(Ra.unlocks.continuousTTBoost.effects.ttGen));
  if (PelleCelestialUpgrade.raV4.canBeApplied) pelleTTMult = pelleTTMult.timesEffectOf(Ra.unlocks.achievementTTMult);
  if (PelleAchievementUpgrade.achievement137.canBeApplied) pelleTTMult = pelleTTMult.times(Effects.product(Achievement(137)));
  if (PelleAchievementUpgrade.achievement156.canBeApplied) pelleTTMult = pelleTTMult.times(Effects.product(Achievement(156)));
  if (PelleCelestialUpgrade.raTeresa3.canBeApplied) pelleTTMult = pelleTTMult.times(getSecondaryGlyphEffect("dilationTTgen"));

  // Glyph TT generation
  const glyphTT = Teresa.isRunning || Enslaved.isRunning || (Pelle.isDoomed && !PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied)
    ? DC.D0
    : new Decimal(getAdjustedGlyphEffect("dilationTTgen")).times(Pelle.isDoomed ? pelleTTMult : ttMult);

  // Dilation TT generation
  const dilationTT = DilationUpgrade.ttGenerator.isBought
    ? DilationUpgrade.ttGenerator.effectValue.times(Pelle.isDoomed ? pelleTTMult : ttMult)
    : DC.D0;

  // Lai'tela TT power
  let finalTT = dilationTT.add(glyphTT);
  if (finalTT.gt(1)) {
    if (!Pelle.isDoomed || PelleDestructionUpgrade.singularityMilestones.canBeApplied) {
      finalTT = finalTT.pow(SingularityMilestone.theoremPowerFromSingularities.effectOrDefault(1));
    }
    finalTT = finalTT.pow(player.disablePostReality ? 1 : AlphaUnlocks.timeTheoremGeneration.effects.buff.effectOrDefault(1));
    if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) finalTT = finalTT.pow(Achievements.powerConv(Ra.unlocks.achievementTTMult.effectOrDefault(1)));
    if (ResurgenceUpgrade.curr1Surge.isBought && !player.disablePostReality) finalTT = finalTT.pow(player.timestudy.theorem.max(1e10).log10().log10());
    finalTT = finalTT.powEffectOf(ResurgenceUpgrade.synergy1);
  }

  return finalTT;
}

export function getESPerSecond() {
  let esMult = DC.D1.timesEffectsOf(Achievement(276)).times(DivinityMilestone.serpentPower.isReached ? 10 : 1);
  // Compression ES generation
  const compressionES = CompressionUpgrade.esGenerator.isBought
    ? CompressionUpgrade.esGenerator.effectValue.times(esMult)
    : DC.D0;

  let finalES = compressionES;

  return finalES;
}

export function gainedCelestialPoints() {
  if (!player.break2) return DC.D1;
  let cp = player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().div(9e15);
  if (Achievement(207).isUnlocked && !player.disablePostReality) {
    cp = cp.times(Decimal.max(9e15 * (1e100 ** (0.5 ** player.celestials.pelle.divinities)), player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10()).div(9e15 * (1e100 ** (0.5 ** player.celestials.pelle.divinities))));
  }
  cp = Alpha.isDestroyed ? cp : Decimal.max(Decimal.min(cp, DC.NUMMAX.sub(player.endgame.celestialPoints)), 0);
  cp = Decimal.pow(cp, Decimal.pow(2 * EndgameMastery(232).effectOrDefault(1), player.celestials.pelle.divinities));
  cp = cp.powEffectsOf(EndgameMastery(212));
  return cp.floor();
}

export function gainedDoomedParticles() {
  if (!player.break2) return DC.D1;
  let dp = Alpha.isDestroyed
    ? player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().div(9e15)
    : Decimal.max(Decimal.min(player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().div(9e15), new Decimal(1e100 - player.endgame.doomedParticles.toNumber())), 0);
  dp = Decimal.pow(dp, Decimal.pow(2, player.celestials.pelle.divinities));
  return dp.floor();
}

export function quoteCheck() {
  Teresa.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Effarig.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Enslaved.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  V.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Ra.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Laitela.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Pelle.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Alpha.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Slabdrill.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
  Elemental.quotes.all.find(u => !u.isUnlocked && u.requirement)?.show();
}

// eslint-disable-next-line no-unused-vars
function recursiveTimeOut(fn, iterations, endFn) {
  fn(iterations);
  if (iterations === 0) endFn();
  else setTimeout(() => recursiveTimeOut(fn, iterations - 1, endFn), 0);
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmergeAll([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }

  GameUI.notify.showBlackHoles = true;
}

export function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a maximum tick count based on the values of real and fast
  // - Calling with real === true will always simulate at full accuracy with no tick count reduction unless it would
  //   otherwise simulate with more ticks than offline progress would allow
  // - Calling with fast === true will only simulate it with a max of 50 ticks
  // - Otherwise, tick count will be limited to the offline tick count (which may be set externally during save import)
  // Tick count is never *increased*, and only ever decreased if needed.
  if (seconds <= 0) return;
  let ticks = Math.floor(seconds * 20);
  GameUI.notify.showBlackHoles = false;

  // Limit the tick count (this also applies if the black hole is unlocked)
  let maxTicks = GameStorage.maxOfflineTicks(1000 * seconds, GameStorage.offlineTicks ?? player.options.offlineTicks);
  if (ticks > maxTicks && !fast) {
    ticks = maxTicks;
  } else if (ticks > 50 && !real && fast) {
    ticks = 50;
  }

  const playerStart = deepmergeAll([{}, player]);

  let totalGameTime;

  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    totalGameTime = BlackHoles.calculateGameTimeFromRealTime(seconds, BlackHoles.calculateSpeedups());
  } else {
    totalGameTime = getGameSpeedupFactor().times(seconds);
  }

  const infinitiedMilestone = getInfinitiedMilestoneReward(Alpha.isRunning ? seconds * 1000 : totalGameTime.times(1000));
  const eternitiedMilestone = getEternitiedMilestoneReward(Alpha.isRunning ? seconds * 1000 : totalGameTime.times(1000));

  if (eternitiedMilestone.gt(0)) {
    Currency.eternities.add(eternitiedMilestone);
  } else if (infinitiedMilestone.gt(0)) {
    Currency.infinities.add(infinitiedMilestone);
  } else {
    Currency.eternityPoints.add(getOfflineEPGain(seconds * 1000));
  }

  if (InfinityUpgrade.ipOffline.isBought && player.options.offlineProgress) {
    Currency.infinityPoints.add(player.records.thisEternity.bestIPMsWithoutMaxAll.times(seconds * 1000 / 2));
  }

  EventHub.dispatch(GAME_EVENT.OFFLINE_CURRENCY_GAINED);

  let remainingRealSeconds = seconds;
  if (remainingRealSeconds <= 0) return;
  // During async code the number of ticks remaining can go down suddenly
  // from "Speed up" which means tick length needs to go up, and thus
  // you can't just divide total time by total ticks to get tick length.
  // For example, suppose you had 6000 offline ticks, and called "Speed up"
  // 1000 ticks in, meaning that after "Speed up" there'd only be 1000 ticks more
  // (so 1000 + 1000 = 2000 ticks total). Dividing total time by total ticks would
  // use 1/6th of the total time before "Speed up" (1000 of 6000 ticks), and 1/2 after
  // (1000 of 2000 ticks). Short of some sort of magic user prediction to figure out
  // whether the user *will* press "Speed up" at some point, dividing remaining time
  // by remaining ticks seems like the best thing to do.
  let loopFn = i => {
    const diff = remainingRealSeconds / i;
    gameLoop(1000 * diff);
    remainingRealSeconds -= diff;
  };

  // Simulation code which accounts for BH cycles (segments where a BH is active doesn't use diff since it splits
  // up intervals based on real time instead in an effort to keep ticks all roughly equal in game time).
  // Black hole auto-pausing is entirely handled by the black hole phase advancement code (for actually pausing)
  // and calculateOfflineTick (for time calculation).
  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    loopFn = i => {
      const [realTickTime, blackHoleSpeedup] = BlackHoles.calculateOfflineTick(remainingRealSeconds,
        i, 0.0001);
      remainingRealSeconds -= realTickTime;
      if (realTickTime <= 0) throw Error("The game tries to simulate " + realTickTime + " seconds and this will cause game to randomly crash.");
      else gameLoop(1000 * realTickTime, { blackHoleSpeedup });
    };
  }

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    // Fast simulations happen when simulating between 10 and 50 seconds of offline time.
    // One easy way to get this is to autosave every 30 or 60 seconds, wait until the save timer
    // in the bottom-left hits 15 seconds, and refresh (without saving directly beforehand).
    GameIntervals.stop();
    // Fast simulations are always 50 ticks. They're done in this weird countdown way because
    // we want to be able to call the same function that we call when using async code (to avoid
    // duplicating functions), and that function expects a parameter saying how many ticks are remaining.
    for (let remaining = 50; remaining > 0; remaining--) {
      loopFn(remaining);
    }
    GameStorage.postLoadStuff();
    afterSimulation(seconds, playerStart);
  } else {
    const progress = {};
    ui.view.modal.progressBar = {};
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameIntervals.stop();
          ui.$viewModel.modal.progressBar = {
            label: "Offline Progress Simulation",
            info: () => `The game is being run at a lower accuracy in order to quickly calculate the resources you
              gained while you were away. See the How To Play entry on "Offline Progress" for technical details. If
              you are impatient and want to get back to the game sooner, you can click the "Speed up" button to
              simulate the rest of the time with half as many ticks (down to a minimum of ${formatInt(500)} ticks
              remaining). The "SKIP" button will instead use all the remaining offline time in ${formatInt(10)}
              ticks.`,
            progressName: "Ticks",
            current: doneSoFar,
            max: ticks,
            startTime: Date.now(),
            buttons: [{
              text: "Speed up",
              condition: (current, max) => max - current > 500,
              click: () => {
                const newRemaining = Math.clampMin(Math.floor(progress.remaining / 2), 500);
                // We subtract the number of ticks we skipped, which is progress.remaining - newRemaining.
                // This, and the below similar code in "SKIP", are needed or the progress bar to be accurate
                // (both with respect to the number of ticks it shows and with respect to how full it is).
                progress.maxIter -= progress.remaining - newRemaining;
                progress.remaining = newRemaining;
                // We update the progress bar max data (remaining will update automatically).
                ui.$viewModel.modal.progressBar.max = progress.maxIter;
              }
            },
            {
              text: "SKIP",
              condition: (current, max) => max - current > 10,
              click: () => {
                // We jump to 10 from the end (condition guarantees there are at least 10 left).
                // We subtract the number of ticks we skipped, which is progress.remaining - 10.
                progress.maxIter -= progress.remaining - 10;
                progress.remaining = 10;
              }
            }]
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          // .postLoadStuff will restart GameIntervals
          GameStorage.postLoadStuff();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        },
        progress
      });
  }
}

window.onload = function() {
  const supportedBrowser = browserCheck();
  GameUI.initialized = supportedBrowser;
  ui.view.initialized = supportedBrowser;
  setTimeout(() => {
    ElectronRuntime.updateZoom();
    document.getElementById("loading").style.display = "none";
  }, 500);
  if (!supportedBrowser) {
    GameIntervals.stop();
    document.getElementById("loading").style.display = "none";
    document.getElementById("browser-warning").style.display = "flex";
  }
};

window.onfocus = function() {
  setShiftKey(false);
};

window.onblur = function() {
  GameKeyboard.stopSpins();
};

export function setShiftKey(isDown) {
  ui.view.shiftDown = isDown;
}

export function setHoldingR(x) {
  Replicanti.galaxies.isPlayerHoldingR = x;
}

export function browserCheck() {
  return supportedBrowsers.test(navigator.userAgent);
}

export function init() {
  // eslint-disable-next-line no-console
  console.log("🌌 Antimatter Dimensions: Endgame Update 🌌");
  if (DEV) {
    // eslint-disable-next-line no-console
    console.log("👨‍💻 Development Mode 👩‍💻");
  }
  ElectronRuntime.initialize();
  SteamRuntime.initialize();
  Cloud.init();
  GameStorage.load();
  Tabs.all.find(t => t.config.id === player.options.lastOpenTab).show(true);
  Payments.init();
}

window.tweenTime = 0;
let lastFrame;
function animateTweens(time) {
  requestAnimationFrame(animateTweens);
  if (time === undefined || lastFrame === undefined) {
    lastFrame = time;
    return;
  }
  let delta = time - lastFrame;
  lastFrame = time;
  if (player.dilation.active && !Achievement(207).isUnlocked) {
    delta /= Pelle.isDoomed ? 1.5 : 10;
  }
  tweenTime += delta;
  TWEEN.update(tweenTime);
}

animateTweens();
