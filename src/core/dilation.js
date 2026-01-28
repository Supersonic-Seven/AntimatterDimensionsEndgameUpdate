import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import FullScreenAnimationHandler from "./full-screen-animation-handler";
import { SpeedrunMilestones } from "./speedrun";

export function animateAndDilate() {
  FullScreenAnimationHandler.display("a-dilate", 2);
  setTimeout(() => {
    startDilatedEternity();
    if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
  }, 1000);
}

// eslint-disable-next-line no-empty-function
export function animateAndUndilate(callback) {
  FullScreenAnimationHandler.display("a-undilate", 2);
  setTimeout(() => {
    eternity(false, false, { switchingDilation: true });
    if (callback) callback();
  }, 1000);
}

export function startDilatedEternityRequest() {
  if (!PlayerProgress.dilationUnlocked() || (Pelle.isDoomed && !Pelle.canDilateInPelle)) return;
  const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
  if (player.dilation.active) {
    if (player.options.confirmations.dilation) {
      Modal.exitDilation.show();
    } else if (playAnimation) {
      animateAndUndilate();
    } else {
      eternity(false, false, { switchingDilation: true });
    }
  } else if (player.options.confirmations.dilation) {
    Modal.enterDilation.show();
  } else if (playAnimation) {
    animateAndDilate();
  } else {
    startDilatedEternity();
  }
}

export function startDilatedEternity(auto) {
  if (!PlayerProgress.dilationUnlocked()) return false;
  if (GameEnd.creditsEverClosed) return false;
  if (player.dilation.active) {
    eternity(false, auto, { switchingDilation: true });
    return false;
  }
  Achievement(136).unlock();
  eternity(false, auto, { switchingDilation: true });
  player.dilation.active = true;
  if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
  return true;
}

const DIL_UPG_NAMES = [
  null, "dtGain", "galaxyThreshold", "tachyonGain", "doubleGalaxies", "tdMultReplicanti",
  "ndMultDT", "ipMultDT", "timeStudySplit", "dilationPenalty", "ttGenerator",
  "dtGainPelle", "galaxyMultiplier", "tickspeedPower", "galaxyThresholdPelle", "flatDilationMult"
];

export function buyDilationUpgrade(id, bulk = 1) {
  if (GameEnd.creditsEverClosed) return false;
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = DilationUpgrade[DIL_UPG_NAMES[id]];
  if (id > 3 && id < 11) {
    if (player.dilation.upgrades.has(id)) return false;
    if (!Currency.dilatedTime.purchase(upgrade.cost)) return false;
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies.times(2);
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    if (Currency.dilatedTime.lt(upgrade.cost) || upgAmount >= upgrade.purchaseCap) return false;

    let buying = Decimal.affordGeometricSeries(Currency.dilatedTime.value,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount).toNumber();
    buying = Math.clampMax(buying, bulk);
    buying = Math.clampMax(buying, upgrade.purchaseCap - upgAmount);
    if (upgrade.cost.lt(DilationUpgradeScaling.PRIMARY_SCALING)) buying = Math.clampMax(buying, upgrade.capIncreaseAt - upgAmount);
    const hasBoughtOverThreshold = Math.max(upgAmount - upgrade.capIncreaseAt, 0);
    const exactCostAtThreshold = Decimal.multiply(upgrade.config.initialCost, Decimal.pow(upgrade.config.increment, upgrade.capIncreaseAt));
    const dtOverThreshold = Decimal.log10(Currency.dilatedTime.value.div(exactCostAtThreshold)).toNumber();
    const canBuyOverThreshold = Math.floor(Math.sqrt(((dtOverThreshold / Math.log10(upgrade.config.increment)) * 2) + 0.25) - 0.5);
    if (upgrade.cost.gte(DilationUpgradeScaling.PRIMARY_SCALING)) buying = canBuyOverThreshold - hasBoughtOverThreshold + 1;
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.dilatedTime.subtract(cost);
    player.dilation.rebuyables[id] += buying;
    if (id === 2) {
      if (!Perk.bypassTGReset.isBought || (Pelle.isDoomed && !PellePerkUpgrade.perkTGR.isBought)) Currency.dilatedTime.reset();
      player.dilation.nextThreshold = DC.E3;
      player.dilation.baseTachyonGalaxies = DC.D0;
      player.dilation.totalTachyonGalaxies = DC.D0;
    }

    if (id === 3 && Pelle.isDoomed) {
      let PelleRetroTP = 1;
      if (PellePerkUpgrade.perkTP1.isBought) PelleRetroTP = Effects.max(1, Perk.retroactiveTP1);
      if (PellePerkUpgrade.perkTP2.isBought) PelleRetroTP = Effects.max(1, Perk.retroactiveTP2);
      if (PellePerkUpgrade.perkTP3.isBought) PelleRetroTP = Effects.max(1, Perk.retroactiveTP3);
      if (PellePerkUpgrade.perkTP4.isBought) PelleRetroTP = Effects.max(1, Perk.retroactiveTP4);
      Currency.tachyonParticles.multiply(Decimal.pow(PelleRetroTP, buying));
    }

    if (id === 3 && !Pelle.isDisabled("tpMults")) {
      let retroactiveTPFactor = Effects.max(
        1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      if (Enslaved.isRunning) {
        retroactiveTPFactor = Math.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      Currency.tachyonParticles.multiply(Decimal.pow(retroactiveTPFactor, buying));
    }
  }
  return true;
}

export function getTachyonGalaxyMult(thresholdUpgrade) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? DilationUpgrade.galaxyThreshold.effectValue : thresholdUpgrade;
  const thresholdMult = BreakEternityUpgrade.tgThresholdUncap.isBought ? 3.65 * upgrade + (0.35 * (upgrade ** 0.001)) : 3.65 * upgrade + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  const pelleExclusivePower = DilationUpgrade.galaxyThresholdPelle.canBeApplied ? DilationUpgrade.galaxyThresholdPelle.effectValue : 1;
  const extraPower = GalacticPowers.tachyonGalaxies.isUnlocked ? 1 / GalacticPowers.tachyonGalaxies.reward : 1;
  const power = pelleExclusivePower * EndgameUpgrade(22).effectOrDefault(1) * extraPower;
  return (1 + thresholdMult * glyphReduction) ** power;
}

export function getDilationGainPerSecond() {
  if (Pelle.isDoomed) {
    let pelleExtraDT = new Decimal(1);
    if (PelleAchievementUpgrade.achievement132.isBought) pelleExtraDT = pelleExtraDT.timesEffectsOf(Achievement(132));
    if (PelleAchievementUpgrade.achievement137.isBought) pelleExtraDT = pelleExtraDT.timesEffectsOf(Achievement(137));
    if (PelleRealityUpgrade.temporalAmplifier.isBought) pelleExtraDT = pelleExtraDT.timesEffectOf(RealityUpgrade(1));
    if (PelleAlchemyUpgrade.alchemyDilation.isBought) pelleExtraDT = pelleExtraDT.timesEffectOf(AlchemyResource.dilation);
    if (PelleCelestialUpgrade.raV3.isBought) pelleExtraDT = pelleExtraDT.timesEffectOf(Ra.unlocks.continuousTTBoost.effects.dilatedTime);
    if (PelleCelestialUpgrade.raNameless4.isBought) pelleExtraDT = pelleExtraDT.timesEffectOf(Ra.unlocks.peakGamespeedDT);
    if (PelleDestructionUpgrade.destroyedGlyphEffects.isBought) pelleExtraDT = pelleExtraDT.times(getAdjustedGlyphEffect("dilationDT"));
    if (PelleDestructionUpgrade.destroyedGlyphEffects.isBought) pelleExtraDT = pelleExtraDT.times(
      Decimal.clampMin(Decimal.log10(Replicanti.amount.add(1)).times(getAdjustedGlyphEffect("replicationdtgain")), 1));
    if (!PelleDestructionUpgrade.disableDTNerf.isBought) pelleExtraDT = pelleExtraDT.div(1e5);
    if (EndgameMilestone.realityShardDTBoost.isReached) pelleExtraDT = pelleExtraDT.times(Currency.realityShards.value.plus(1));
    const tachyonEffect = Currency.tachyonParticles.value.pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
    let dtRate = new Decimal(tachyonEffect)
      .timesEffectsOf(DilationUpgrade.dtGain, DilationUpgrade.dtGainPelle, DilationUpgrade.flatDilationMult)
      .times(ShopPurchase.dilatedTimePurchases.currentMult ** 0.5)
      .times(Pelle.specialGlyphEffect.dilation).times(pelleExtraDT)
      .times(getGameSpeedupForDisplay());
    if (dtRate.gte(DilationSoftcapStart.PRIMARY_THRESHOLD)) {
      dtRate = Decimal.pow(10, (((Decimal.log10(dtRate).sub(Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD))).div(10)).add(
        Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD))));
    }
    return dtRate;
  }
  let dtRate = new Decimal(Currency.tachyonParticles.value)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      Achievement(137),
      RealityUpgrade(1),
      AlchemyResource.dilation,
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT
    );
  dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT"));
  dtRate = dtRate.times(ShopPurchase.dilatedTimePurchases.currentMult);
  dtRate = dtRate.times(
    Decimal.clampMin(Decimal.log10(Replicanti.amount.add(1)).times(getAdjustedGlyphEffect("replicationdtgain")), 1));
  if (Enslaved.isRunning && !dtRate.eq(0)) dtRate = Decimal.pow10(Decimal.pow(dtRate.plus(1).log10(), 0.85).sub(1));
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  dtRate = dtRate.times(getGameSpeedupForDisplay());
  if (dtRate.gte(DilationSoftcapStart.PRIMARY_THRESHOLD)) {
    dtRate = Decimal.pow(10, (((Decimal.log10(dtRate).sub(Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD))).div(10)).add(
      Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD))));
  }
  return dtRate;
}

export function tachyonGainMultiplier() {
  if (Pelle.isDisabled("tpMults")) {
    let pelleTP = new Decimal(1);
    if (PelleDestructionUpgrade.x3TPUpgrade.isBought) pelleTP = pelleTP.timesEffectOf(DilationUpgrade.tachyonGain);
    if (PelleRealityUpgrade.scourToEmpower.isBought) pelleTP = pelleTP.timesEffectOf(GlyphSacrifice.dilation);
    if (PelleAchievementUpgrade.achievement132.isBought) pelleTP = pelleTP.timesEffectOf(Achievement(132));
    if (PelleRealityUpgrade.superluminalAmplifier.isBought) pelleTP = pelleTP.timesEffectOf(RealityUpgrade(4));
    if (PelleRealityUpgrade.paradoxicallyAttain.isBought) pelleTP = pelleTP.timesEffectOf(RealityUpgrade(8));
    if (PelleRealityUpgrade.paradoxicalForever.isBought) pelleTP = pelleTP.timesEffectOf(RealityUpgrade(15));
    pelleTP = pelleTP.timesEffectOf(Ra.unlocks.gameSpeedTachyonMult);
    return pelleTP;
  }
  const pow = Enslaved.isRunning ? Enslaved.tachyonNerf : 1;
  let mult = new Decimal(1)
    .timesEffectsOf(
      DilationUpgrade.tachyonGain,
      GlyphSacrifice.dilation,
      Achievement(132),
      RealityUpgrade(4),
      RealityUpgrade(8),
      RealityUpgrade(15),
      Ra.unlocks.gameSpeedTachyonMult
    );

  mult = mult.pow(pow);
  
  return mult;
}

export function rewardTP() {
  Currency.tachyonParticles.bumpTo(getTP(player.records.thisEternity.maxAM, true));
  player.dilation.lastEP = Currency.eternityPoints.value;
}

// This function exists to apply Teresa-25 in a consistent way; TP multipliers can be very volatile and
// applying the reward only once upon unlock promotes min-maxing the upgrade by unlocking dilation with
// TP multipliers as large as possible. Applying the reward to a base TP value and letting the multipliers
// act dynamically on this fixed base value elsewhere solves that issue
export function getBaseTP(antimatter, requireEternity) {
  if (!Player.canEternity && requireEternity) return DC.D0;
  const am = (isInCelestialReality() || Pelle.isDoomed)
    ? antimatter
    : Ra.unlocks.unlockDilationStartingTP.effectOrDefault(antimatter);
  let baseTP = Decimal.pow(Decimal.log10(am).div(160), 1.8);
  if (Enslaved.isRunning) baseTP = baseTP.pow(Enslaved.tachyonNerf);
  baseTP = baseTP.powEffectsOf(
    BreakEternityUpgrade.tachyonParticlePow
  );
  return baseTP;
}

// Returns the TP that would be gained this run
export function getTP(antimatter, requireEternity) {
  return getBaseTP(antimatter, requireEternity).times(tachyonGainMultiplier());
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit dilation" button (saying whether you need more antimatter), and in last 10 eternities
export function getTachyonGain(requireEternity) {
  return getTP(Currency.antimatter.value, requireEternity).minus(Currency.tachyonParticles.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getTachyonReq() {
  let effectiveTP = Currency.tachyonParticles.value.dividedBy(tachyonGainMultiplier());
  const reciprocalpow = DC.D1.timesEffectsOf(BreakEternityUpgrade.tachyonParticlePow).reciprocal();
  effectiveTP = effectiveTP.pow(reciprocalpow);
  if (Enslaved.isRunning) effectiveTP = effectiveTP.pow(1 / Enslaved.tachyonNerf);
  return Decimal.pow10(
    effectiveTP
      .times(Math.pow(160, 1.8))
      .pow(5 / 9)
      .toNumber()
  );
}

export function getDilationTimeEstimate(goal) {
  const rawDTGain = getDilationGainPerSecond();
  const currentDT = Currency.dilatedTime.value;
  if (rawDTGain.eq(0)) return null;
  if (PelleRifts.paradox.isActive && !PelleRifts.paradox.isMaxed) {
    const drain = Pelle.riftDrainPercent;
    const goalNetRate = rawDTGain.minus(Decimal.multiply(goal, drain));
    const currNetRate = rawDTGain.minus(currentDT.times(drain));
    if (goalNetRate.lt(0)) return "Never affordable due to Rift drain";
    return TimeSpan.fromSeconds(currNetRate.div(goalNetRate).ln().div(drain)).toTimeEstimate();
  }
  return TimeSpan.fromSeconds(Decimal.sub(goal, currentDT)
    .div(rawDTGain)).toTimeEstimate();
}

export function dilatedValueOf(value) {
  if (value.lte(0)) return 0;
  const log10 = value.log10();
  const dilationPenalty = 0.75 * Effects.product(DilationUpgrade.dilationPenalty);
  return Decimal.pow10(new Decimal(Decimal.sign(log10)).times(Decimal.pow(Decimal.abs(log10), dilationPenalty)));
}

class DilationUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get set() {
    return player.dilation.upgrades;
  }

  onPurchased() {
    if (this.id === 4) player.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies.times(2);
    if (this.id === 10) SpeedrunMilestones(15).tryComplete();
  }
}

class RebuyableDilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get boughtAmount() {
    return player.dilation.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.dilation.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.config.reachedCap();
  }

  get purchaseCap() {
    return this.config.purchaseCap(player.dilation.rebuyables[this.id]);
  }

  get capIncreaseAt() {
    return this.config.capIncreaseAt(player.dilation.rebuyables[this.id]);
  }

  purchase(bulk) {
    buyDilationUpgrade(this.config.id, bulk);
  }
}

export const DilationUpgrade = mapGameDataToObject(
  GameDatabase.eternity.dilation,
  config => (config.rebuyable
    ? new RebuyableDilationUpgradeState(config)
    : new DilationUpgradeState(config))
);

export const DilationUpgrades = {
  rebuyable: [
    DilationUpgrade.dtGain,
    DilationUpgrade.galaxyThreshold,
    DilationUpgrade.tachyonGain,
  ],
  fromId: id => DilationUpgrade.all.find(x => x.id === Number(id))
};

export const DilationUpgradeScaling = {
  PRIMARY_SCALING: DC.E5000
};

export const DilationSoftcapStart = {
  PRIMARY_THRESHOLD: DC.E20000
};
