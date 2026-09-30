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
  if (Slabdrill.isCursed && Slabdrill.currentStage === 9) {
    Slabdrill.advanceLayer();
    Glyphs.refreshActive();
    Slabdrill.quotes.dilation.show();
  }
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
    if (upgrade.cost.lt(Decimal.pow10(1e10)) && upgrade.superExponent !== Infinity) buying = Math.clampMax(buying, upgrade.superExponent - upgAmount);
    const hasBoughtOverThreshold = Math.max(upgAmount - upgrade.capIncreaseAt, 0);
    const exactCostAtThreshold = Decimal.multiply(upgrade.config.initialCost, Decimal.pow(upgrade.config.increment, upgrade.capIncreaseAt));
    const dtOverThreshold = Decimal.log10(Currency.dilatedTime.value.div(exactCostAtThreshold)).toNumber();
    const canBuyOverThreshold = Math.floor(Math.sqrt(((dtOverThreshold / Math.log10(upgrade.config.increment)) * 2) + 0.25) - 0.5);
    const hasBoughtOverSuperscale = Math.max(upgAmount - upgrade.superExponent, 0);
    const logCostAtSuperscale = 1e10;
    const dtOverSuperscale = Currency.dilatedTime.value.max(1).log10().div(logCostAtSuperscale).toNumber();
    const canBuyOverSuperscale = Decimal.floor(Decimal.log(dtOverSuperscale, 1.0002)).toNumber();
    if (upgrade.cost.gte(Decimal.pow10(1e10)) && upgrade.superExponent !== Infinity) buying = canBuyOverSuperscale - hasBoughtOverSuperscale + 1;
    else if (upgrade.cost.gte(DilationUpgradeScaling.PRIMARY_SCALING)) buying = canBuyOverThreshold - hasBoughtOverThreshold + 1;
    if (upgrade.cost.lt(Decimal.pow10(1e10)) && upgrade.superExponent !== Infinity) buying = Math.clampMax(buying, upgrade.superExponent - upgAmount);
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.dilatedTime.purchase(cost);
    player.dilation.rebuyables[id] += buying;
    if (id === 2) {
      if (!Perk.bypassTGReset.isBought || (Pelle.isDoomed && !PellePerkUpgrade.perkTGR.canBeApplied) || player.disablePostReality) Currency.dilatedTime.reset();
      player.dilation.nextThreshold = DC.E3;
      player.dilation.baseTachyonGalaxies = DC.D0;
      player.dilation.totalTachyonGalaxies = DC.D0;
    }

    if (id === 3 && Pelle.isDoomed && !player.disablePostReality) {
      let PelleRetroTP = 1;
      if (PellePerkUpgrade.perkTP1.canBeApplied) PelleRetroTP = Effects.max(1, Perk.retroactiveTP1);
      if (PellePerkUpgrade.perkTP2.canBeApplied) PelleRetroTP = Effects.max(1, Perk.retroactiveTP2);
      if (PellePerkUpgrade.perkTP3.canBeApplied) PelleRetroTP = Effects.max(1, Perk.retroactiveTP3);
      if (PellePerkUpgrade.perkTP4.canBeApplied) PelleRetroTP = Effects.max(1, Perk.retroactiveTP4);
      Currency.tachyonParticles.multiply(Decimal.pow(PelleRetroTP, buying));
    }

    if (id === 3 && !Pelle.isDisabled("tpMults") && !player.disablePostReality) {
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

export function getTachyonGalaxyMultForDisplay(thresholdUpgrade) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? DilationUpgrade.galaxyThreshold.effectValue : thresholdUpgrade;
  const thresholdMult = (BreakEternityUpgrade.tgThresholdUncap.isBought && !player.disablePostReality)
    ? upgrade.times(3.65).add(Decimal.pow(upgrade, 0.001).times(0.35)) : upgrade.times(3.65).add(0.35);
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  const pelleExclusivePower = DilationUpgrade.galaxyThresholdPelle.canBeApplied ? DilationUpgrade.galaxyThresholdPelle.effectValue : 1;
  const extraPower = GalacticPowers.tachyonGalaxies.isUnlocked ? 1 / GalacticPowers.tachyonGalaxies.reward : 1;
  const power = pelleExclusivePower * EndgameUpgrade(22).effectOrDefault(1) * extraPower;
  return Decimal.pow(thresholdMult.times(glyphReduction).add(1), power);
}

export function getBaseTachyonGalaxyMult() {
  const thresholdMult = (BreakEternityUpgrade.tgThresholdUncap.isBought && !player.disablePostReality)
    ? DilationUpgrade.galaxyThreshold.effectValue.times(3.65).add(Decimal.pow(DilationUpgrade.galaxyThreshold.effectValue, 0.001).times(0.35))
    : DilationUpgrade.galaxyThreshold.effectValue.times(3.65).add(0.35);
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  return thresholdMult.times(glyphReduction);
}

export function getTachyonGalaxyPowers() {
  const pelleExclusivePower = DilationUpgrade.galaxyThresholdPelle.canBeApplied ? DilationUpgrade.galaxyThresholdPelle.effectValue : 1;
  const extraPower = GalacticPowers.tachyonGalaxies.isUnlocked ? 1 / GalacticPowers.tachyonGalaxies.reward : 1;
  return pelleExclusivePower * EndgameUpgrade(22).effectOrDefault(1) * extraPower;
}

export function getDilationGainPerSecond() {
  if (Pelle.isDoomed) {
    let pelleExtraDT = new Decimal(1);
    if (PelleAchievementUpgrade.achievement132.canBeApplied) pelleExtraDT = pelleExtraDT.timesEffectsOf(Achievement(132));
    if (PelleAchievementUpgrade.achievement137.canBeApplied) pelleExtraDT = pelleExtraDT.timesEffectsOf(Achievement(137));
    if (PelleRealityUpgrade.temporalAmplifier.canBeApplied) pelleExtraDT = pelleExtraDT.timesEffectOf(RealityUpgrade(1));
    if (PelleAlchemyUpgrade.alchemyDilation.canBeApplied) pelleExtraDT = pelleExtraDT.timesEffectOf(AlchemyResource.dilation);
    if (PelleCelestialUpgrade.raV3.canBeApplied) pelleExtraDT = pelleExtraDT.timesEffectOf(Ra.unlocks.continuousTTBoost.effects.dilatedTime);
    if (PelleCelestialUpgrade.raNameless4.canBeApplied) pelleExtraDT = pelleExtraDT.timesEffectOf(Ra.unlocks.peakGamespeedDT);
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) pelleExtraDT = pelleExtraDT.times(getAdjustedGlyphEffect("dilationDT"));
    if (PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied) pelleExtraDT = pelleExtraDT.times(ReplicantiMultipliers.dtMult);
    if (!PelleDestructionUpgrade.disableDTNerf.canBeApplied) pelleExtraDT = pelleExtraDT.div(1e5);
    pelleExtraDT = pelleExtraDT.timesEffectOf(EndgameMastery(112));
    const tachyonEffect = Currency.tachyonParticles.value.pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
    let dtRate = new Decimal(tachyonEffect)
      .timesEffectsOf(DilationUpgrade.dtGain, DilationUpgrade.dtGainPelle, DilationUpgrade.flatDilationMult)
      .times(ShopPurchase.dilatedTimePurchases.currentMult ** 0.5)
      .times(Pelle.specialGlyphEffect.dilation).times(pelleExtraDT)
      .times(Alpha.isRunning ? getGameSpeedupForDisplay().pow(0.01) : getGameSpeedupForDisplay());
    if (getAdjustedGlyphEffect("replicationdtgain").neq(0) && PelleDestructionUpgrade.destroyedGlyphEffects.canBeApplied && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
      dtRate = dtRate.pow(ReplicantiMultipliers.dtPow);
    }
    if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) {
      dtRate = dtRate.pow(player.dilation.dilatedTime.max(1e10).log10().log10());
    }
    if (dtRate.gte(DilationSoftcapStart.PRIMARY_THRESHOLD())) {
      dtRate = Decimal.pow(10, (((Decimal.log10(dtRate).sub(Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD()))).div(10)).add(
        Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD()))));
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
  dtRate = dtRate.times(ReplicantiMultipliers.dtMult);
  if (LHC.voidRunning) dtRate = dtRate.timesEffectOf(NullUpgrade.dilatedTimeMult);
  if (SlabdrillUnlocks.dilation.isUnlocked) dtRate = dtRate.times(Slabdrill.slabPowers.dtMult());
  if (Enslaved.isRunning && !dtRate.eq(0)) dtRate = Decimal.pow10(Decimal.pow(dtRate.plus(1).log10(), 0.85).sub(1));
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  dtRate = dtRate.times(Alpha.isRunning ? getGameSpeedupForDisplay().pow(0.01) : getGameSpeedupForDisplay());
  if (getAdjustedGlyphEffect("replicationdtgain").neq(0) && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) {
    dtRate = dtRate.pow(ReplicantiMultipliers.dtPow);
  }
  dtRate = dtRate.pow(Universes.ephemeralLightToDilation);
  if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) {
    dtRate = dtRate.pow(player.dilation.dilatedTime.max(1e10).log10().log10());
  }
  if (SlabdrillUnlocks.dilation.isUnlocked) dtRate = dtRate.pow(0.25);
  if (dtRate.gte(DilationSoftcapStart.PRIMARY_THRESHOLD())) {
    dtRate = Decimal.pow(10, (((Decimal.log10(dtRate).sub(Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD()))).div(10)).add(
      Decimal.log10(DilationSoftcapStart.PRIMARY_THRESHOLD()))));
  }
  if (player.universes.current === 1) dtRate = Decimal.pow10(Decimal.pow(dtRate.max(10).log10(), 0.1));
  return dtRate;
}

export function tachyonGainMultiplier() {
  if (Pelle.isDisabled("tpMults")) {
    let pelleTP = new Decimal(1);
    if (PelleDestructionUpgrade.x3TPUpgrade.canBeApplied) pelleTP = pelleTP.timesEffectOf(DilationUpgrade.tachyonGain);
    if (PelleRealityUpgrade.scourToEmpower.canBeApplied) pelleTP = pelleTP.timesEffectOf(GlyphSacrifice.dilation);
    if (PelleAchievementUpgrade.achievement132.canBeApplied) pelleTP = pelleTP.timesEffectOf(Achievement(132));
    if (PelleRealityUpgrade.superluminalAmplifier.canBeApplied) pelleTP = pelleTP.timesEffectOf(RealityUpgrade(4));
    if (PelleRealityUpgrade.paradoxicallyAttain.canBeApplied) pelleTP = pelleTP.timesEffectOf(RealityUpgrade(8));
    if (PelleRealityUpgrade.paradoxicalForever.canBeApplied) pelleTP = pelleTP.timesEffectOf(RealityUpgrade(15));
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

  if (LHC.voidRunning) mult = mult.timesEffectOf(NullUpgrade.tachyonParticleMult);

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
  const am = (isInCelestialReality() || Pelle.isDoomed || player.disablePostReality)
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
  let pend = getBaseTP(antimatter, requireEternity).times(tachyonGainMultiplier()).pow(player.disablePostReality ? 1 : AlphaUnlocks.dilatedEternity.effects.buff.effectOrDefault(1));
  if (SlabdrillUnlocks.dilation.isUnlocked) pend = pend.pow(0.25);
  if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) pend = pend.pow(Achievements.powerConv(RealityUpgrade(8).effectOrDefault(1)));
  if (!Pelle.isDoomed) pend = pend.pow(Universes.ephemeralLightToDilation);
  if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) pend = pend.pow(player.dilation.tachyonParticles.max(1e10).log10().log10());
  if (player.universes.current === 1) pend = Decimal.pow10(Decimal.pow(pend.max(10).log10(), 0.1));
  return pend;
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit dilation" button (saying whether you need more antimatter), and in last 10 eternities
export function getTachyonGain(requireEternity) {
  return getTP(Currency.antimatter.value, requireEternity).minus(Currency.tachyonParticles.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getTachyonReq() {
  let effectiveTP = Currency.tachyonParticles.value;
  if (player.universes.current === 1) effectiveTP = Decimal.pow10(Decimal.pow(effectiveTP.max(10).log10(), 10));
  effectiveTP = effectiveTP.pow(1 / (player.disablePostReality ? 1 : AlphaUnlocks.dilatedEternity.effects.buff.effectOrDefault(1)));
  if (SlabdrillUnlocks.dilation.isUnlocked) effectiveTP = effectiveTP.pow(1 / 0.25);
  if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) effectiveTP = effectiveTP.pow(1 / Achievements.powerConv(RealityUpgrade(8).effectOrDefault(1)));
  if (!Pelle.isDoomed) effectiveTP = effectiveTP.pow(DC.D1.div(Universes.ephemeralLightToDilation));
  if (ResurgenceUpgrade.curr2Surge.isBought && !player.disablePostReality && !Pelle.isDoomed) effectiveTP = effectiveTP.pow(DC.D1.div(player.dilation.tachyonParticles.max(1e10).log10().log10()));
  effectiveTP = effectiveTP.dividedBy(tachyonGainMultiplier());
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
  if (value.lte(0)) return new Decimal(0);
  const log10 = value.log10();
  let basePenalty = 0.75;
  if (Alpha.isRunning) basePenalty = Effects.min(1, AlphaUnlocks.unlockDilation.effects.nerf, AlphaUnlocks.dilatedEternity.effects.nerf);
  if (!player.disablePostReality) basePenalty = AlphaUnlocks.unlockDilation.effects.buff.effectOrDefault(0.75);
  const dilationPenalty = basePenalty * Effects.product(DilationUpgrade.dilationPenalty);
  return Decimal.pow10(new Decimal(Decimal.sign(log10)).times(Decimal.pow(Decimal.abs(log10), dilationPenalty)));
}

export function dilateMultiplier(value, mag) {
  if (value.lte(0)) return new Decimal(0);
  const log10 = value.log10();
  return Decimal.pow10(new Decimal(Decimal.sign(log10)).times(Decimal.pow(Decimal.abs(log10), mag)));
}

export function secondOrderDilateMultiplier(value, mag) {
  if (value.lte(1)) return new Decimal(0);
  const log10 = value.log10().log10();
  return Decimal.pow10(Decimal.pow10(new Decimal(Decimal.sign(log10)).times(Decimal.pow(Decimal.abs(log10), mag))));
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
    if (this.id === 10) {
      SpeedrunMilestones(15).tryComplete();
      if (Alpha.isRunning && Alpha.currentStage === 25) {
        Alpha.advanceLayer();
        Alpha.quotes.ttGen.show();
      }
    }
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

  get superExponent() {
    return this.config.superExponent(player.dilation.rebuyables[this.id]);
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
  PRIMARY_THRESHOLD: () => EndgameMastery(271).isBought ? new Decimal(Infinity) : DC.E20000
};
