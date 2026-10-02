class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class DimBoost {
  static get power() {
    if (NormalChallenge(8).isRunning) {
      return DC.D1;
    }

    let boost = Effects.max(
      2,
      InfinityUpgrade.dimboostMult,
      InfinityChallenge(7).reward,
      InfinityChallenge(7),
      TimeStudy(81)
    )
      .toDecimal()
      .timesEffectsOf(
        TimeStudy(83),
        TimeStudy(231),
        Achievement(117),
        Achievement(142),
        PelleRifts.recursion.milestones[0]
      ).times(getAdjustedGlyphEffect("powerdimboost")).powEffectsOf(InfinityUpgrade.dimboostMult.chargedEffect);
    if (GlyphAlteration.isAdded("effarig")) boost = boost.pow(getSecondaryGlyphEffect("effarigforgotten"));
    if (Alpha.isRunning) boost = boost.pow(AlphaUnlocks.fourthDimboost.effects.nerf.effectOrDefault(1));
    if (!player.disablePostReality) boost = boost.pow(AlphaUnlocks.fourthDimboost.effects.buff.effectOrDefault(1));
    if (SlabdrillUnlocks.dimboost.isUnlocked) boost = boost.times(Slabdrill.slabPowers.dbMult());
    if (SlabdrillUnlocks.dimboost.isUnlocked) boost = boost.sub(1).div(100).add(1);
    return boost;
  }

  static get exponentialPower() {
    return this.power.max(10).log10().log10().div(100).times(BreakInfinityUpgrade.autobuyMaxDimboosts.chargedEffect.effectOrDefault(1));
  }

  static multiplierToNDTier(tier) {
    const normalBoostMult = DimBoost.power.pow(this.purchasedBoosts.add(1).sub(tier)).clampMin(1);
    const imaginaryBoostMult = DimBoost.power.times(ImaginaryUpgrade(24).effectOrDefault(1))
      .pow(this.imaginaryBoosts).clampMin(1);
    return normalBoostMult.times(imaginaryBoostMult);
  }

  static get powerToND() {
    return this.purchasedBoosts.times(this.exponentialPower).add(1);
  }

  static get maxDimensionsUnlockable() {
    if (Slabdrill.isCursed) return Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 8), 1);
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get canUnlockNewDimension() {
    return DimBoost.purchasedBoosts.add(4).lt(DimBoost.maxDimensionsUnlockable);
  }

  static get maxBoosts() {
    if (Ra.isRunning) {
      // Ra makes boosting impossible. Note that this function isn't called
      // when giving initial boosts, so the player will still get those.
      return DC.D0;
    }
    if (InfinityChallenge(1).isRunning) {
      // Usually, in Challenge 8, the only boosts that are useful are the first 5
      // (the fifth unlocks sacrifice). In IC1 (Challenge 8 and Challenge 10
      // combined, among other things), only the first 2 are useful
      // (they unlock new dimensions).
      // There's no actual problem with bulk letting the player get
      // more boosts than this; it's just that boosts beyond this are pointless.
      return DC.D2;
    }
    if (NormalChallenge(8).isRunning) {
      // See above. It's important we check for this after checking for IC1 since otherwise
      // this case would trigger when we're in IC1.
      return DC.D5;
    }
    return DC.BEMAX;
  }

  static get canBeBought() {
    if (DimBoost.purchasedBoosts.gte(this.maxBoosts)) return false;
    if ((player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) && (!Alpha.isRunning || player.antimatter.gte(DC.NUMMAX))) return false;
    return true;
  }

  static get lockText() {
    if (DimBoost.purchasedBoosts.gte(this.maxBoosts)) {
      if (Ra.isRunning) return "Locked (Ra's Reality)";
      if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
      if (NormalChallenge(8).isRunning) return `Locked (8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension
        Autobuyer Challenge)`;
    }
    return null;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    const targetResets = DimBoost.purchasedBoosts.add(bulk);
    const tier = Decimal.min(targetResets.add(3), this.maxDimensionsUnlockable).toNumber();
    if (Ascensions.dbA.isUnlocked) {
      let dis = Effects.sum(
        TimeStudy(211),
        TimeStudy(222)
      );
      if (!player.disablePostReality) dis += AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0);
      let logBase;
      if (tier === 6 && NormalChallenge(10).isRunning) {
        logBase = DC.D20.sub(dis);
      } else if (tier === 8) {
        logBase = DC.D15.sub(dis);
      }
      else logBase = DC.D15;
      logBase = logBase.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
      let naturalBase = (8 / tier) * 15;
      let logarithm = Decimal.pow10(logBase.div(naturalBase));
      logarithm = logarithm.pow(NormalChallenge(4).chargedEffect);
      if (targetResets.lt(5)) return new DimBoostRequirement(tier, logarithm);
      return new DimBoostRequirement(tier, Decimal.pow(logarithm, targetResets.sub(4)));
    }
    let amount = DC.D20;
    if (Slabdrill.isCursed) amount = DC.D60;
    let discount = Effects.sum(
      TimeStudy(211),
      TimeStudy(222)
    );
    if (!player.disablePostReality) discount += AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0);
    let multi = 1;
    if (Alpha.isRunning) multi *= AlphaUnlocks.fifthDimboost.effects.nerf.effectOrDefault(1);
    if (Slabdrill.isCursed) {
      amount = amount.add(targetResets.sub(1).mul(DC.D20.sub(discount).times(multi)).round());
    } else if (tier === 6 && NormalChallenge(10).isRunning) {
      amount = amount.add(targetResets.sub(3).mul(DC.D20.sub(discount).times(multi)).round());
    } else if (tier === 8) {
      amount = amount.add(targetResets.sub(5).mul(DC.D15.sub(discount).times(multi)).round());
    }
    if (EternityChallenge(5).isRunning) {
      amount = Decimal.pow(targetResets.sub(1), 3).add(targetResets).add(amount).sub(1);
    }

    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);

    amount = amount.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));

    amount = Decimal.round(amount);

    let costAtSoftcap = DC.D20;
    if (Slabdrill.isCursed) {
      costAtSoftcap = costAtSoftcap.add(DC.E100.sub(1).mul(DC.D20.sub(Effects.sum(TimeStudy(211), TimeStudy(222)) +
        (!player.disablePostReality ? AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0) : 0)).times(
        Alpha.isRunning ? AlphaUnlocks.fifthDimboost.effects.nerf.effectOrDefault(1) : 1)).round());
    } else if (this.maxDimensionsUnlockable === 6 && NormalChallenge(10).isRunning) {
      costAtSoftcap = costAtSoftcap.add(DC.E100.sub(3).mul(DC.D20.sub(Effects.sum(TimeStudy(211), TimeStudy(222)) +
        (!player.disablePostReality ? AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0) : 0)).times(
        Alpha.isRunning ? AlphaUnlocks.fifthDimboost.effects.nerf.effectOrDefault(1) : 1)).round());
    } else if (this.maxDimensionsUnlockable === 8) {
      costAtSoftcap = costAtSoftcap.add(DC.E100.sub(5).mul(DC.D15.sub(Effects.sum(TimeStudy(211), TimeStudy(222)) +
        (!player.disablePostReality ? AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0) : 0)).times(
        Alpha.isRunning ? AlphaUnlocks.fifthDimboost.effects.nerf.effectOrDefault(1) : 1)).round());
    }
    if (EternityChallenge(5).isRunning) {
      costAtSoftcap = Decimal.pow(DC.E100.sub(1), 3).add(DC.E100).add(costAtSoftcap).sub(1);
    }
    costAtSoftcap = costAtSoftcap.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) costAtSoftcap = costAtSoftcap.sub(1);
    costAtSoftcap = costAtSoftcap.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
    costAtSoftcap = Decimal.round(costAtSoftcap);

    if (amount.gt(costAtSoftcap)) {
      const inc = Slabdrill.isCursed
        ? DC.D20.sub(discount).times(multi).times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1))
        : (NormalChallenge(10).isRunning
          ? DC.D20.sub(discount).times(multi).times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1))
          : DC.D15.sub(discount).times(multi).times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1)));
      let aboveCap = amount.sub(20);
      aboveCap = aboveCap.div(inc);
      aboveCap = aboveCap.add(Slabdrill.isCursed ? 1 : (NormalChallenge(10).isRunning ? 3 : 5));
      aboveCap = aboveCap.div(DC.E100);
      aboveCap = Decimal.sqr(aboveCap);
      aboveCap = aboveCap.times(DC.E100);
      aboveCap = aboveCap.sub(Slabdrill.isCursed ? 1 : (NormalChallenge(10).isRunning ? 3 : 5));
      aboveCap = aboveCap.times(inc);
      aboveCap = aboveCap.add(20);
      amount = Decimal.round(aboveCap);
    }

    return new DimBoostRequirement(tier, amount);
  }

  static get unlockedByBoost() {
    if (DimBoost.lockText !== null) return DimBoost.lockText;
    const boosts = DimBoost.purchasedBoosts;
    const allNDUnlocked = EternityMilestone.unlockAllND.isReached;

    let newUnlock = "";
    if (!allNDUnlocked && boosts.lt(DimBoost.maxDimensionsUnlockable - 4)) {
      newUnlock = `unlock the ${formatInt(boosts.add(5))}th Dimension`;
    } else if (boosts.eq(4) && !NormalChallenge(10).isRunning && !EternityChallenge(3).isRunning && !Slabdrill.isCursed) {
      newUnlock = "unlock Sacrifice";
    }

    const formattedMultText = `give a ${formatX(DimBoost.power, 2, 2)} multiplier `;
    let dimensionRange = `to the 1st Dimension`;
    if (boosts.gt(0)) dimensionRange = `to Dimensions 1-${Decimal.min(boosts.add(1), 8)}`;
    if (boosts.gte(DimBoost.maxDimensionsUnlockable - 1)) dimensionRange = `to all Dimensions`;
    if (boosts.gte(DimBoost.maxDimensionsUnlockable - 1) && Slabdrill.isCursed) dimensionRange = `to your Dimension`;
    const formattedPowText = Ascensions.dbA.isUnlocked ? `and a +${formatPow(DimBoost.exponentialPower, 2, 3)} power to all Dimensions` : "";

    let boostEffects;
    if (NormalChallenge(8).isRunning) boostEffects = newUnlock;
    else if (Ascensions.dbA.isUnlocked && boosts.gte(DimBoost.maxDimensionsUnlockable - 1) && newUnlock === "") boostEffects = boostEffects = `${formattedMultText} ${formattedPowText}`;
    else if (newUnlock === "") boostEffects = `${formattedMultText} ${dimensionRange} ${formattedPowText}`;
    else boostEffects = `${newUnlock} and ${formattedMultText} ${dimensionRange} ${formattedPowText}`;

    if (boostEffects === "") return "Dimension Boosts are currently useless";
    const areDimensionsKept = (Perk.antimatterNoReset.isBought || Achievement(111).canBeApplied) &&
      (!player.disablePostReality || (LHC.voidRunning && player.endgame.largeHadronCollider.void.nullified) || (Alpha.isRunning && Alpha.currentStage >= 12)
      || (LHC.voidRunning && NullUpgrade.limerick1.isBought) || SlabdrillUnlocks.eternityChallengeTen.isUnlocked) &&
      ((!Pelle.isDoomed || PelleAchievementUpgrade.achievement111.canBeApplied) || PelleUpgrade.dimBoostResetsNothing.isBought);
    if (areDimensionsKept) return boostEffects[0].toUpperCase() + boostEffects.substring(1);
    return `Reset your ${Slabdrill.isCursed ? "Dimension" : "Dimensions"} to ${boostEffects}`;
  }

  static get purchasedBoosts() {
    return Decimal.fromDecimal(player.dimensionBoosts.floor());
  }

  static get imaginaryBoosts() {
    return Ra.isRunning
      ? DC.D0
      : Decimal.pow(ImaginaryUpgrade(12).effectOrDefault(0) * ImaginaryUpgrade(23).effectOrDefault(1), DualityUpgrade(12).effectOrDefault(1));
  }

  static get totalBoosts() {
    return Decimal.floor(this.purchasedBoosts.add(this.imaginaryBoosts));
  }

  static get startingDimensionBoosts() {
    if (InfinityUpgrade.skipResetGalaxy.isBought) return DC.D4;
    if (InfinityUpgrade.skipReset3.isBought) return DC.D3;
    if (InfinityUpgrade.skipReset2.isBought) return DC.D2;
    if (InfinityUpgrade.skipReset1.isBought) return DC.D1;
    return DC.D0;
  }

  static get maxBuyableDimBoosts() {
    // Boosts that unlock new dims are bought one at a time, unlocking the next dimension
    if (DimBoost.canUnlockNewDimension) {
      if (DimBoost.requirement.isSatisfied) return DC.D1;
    }
    const req1 = DimBoost.bulkRequirement(1);
    if (!req1.isSatisfied) return DC.D0;
    const req2 = DimBoost.bulkRequirement(2);
    if (!req2.isSatisfied) {
      return DC.D1;
    }

    const tier = DimBoost.maxDimensionsUnlockable;
    const ad = AntimatterDimension(tier).totalAmount;
    let calcBoosts;
    if (Ascensions.dbA.isUnlocked) {
      let dis = Effects.sum(
        TimeStudy(211),
        TimeStudy(222)
      );
      if (!player.disablePostReality) dis += AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0);
      let logBase;
      if (tier === 6) {
        logBase = DC.D20.sub(dis);
      } else if (tier === 8) {
        logBase = DC.D15.sub(dis);
      }
      logBase = logBase.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
      let naturalBase = (8 / tier) * 15;
      let logarithm = Decimal.pow10(logBase.div(naturalBase));
      logarithm = logarithm.pow(NormalChallenge(4).chargedEffect);
      calcBoosts = ad.max(1).log(logarithm);
      calcBoosts = calcBoosts.add(Slabdrill.isCursed ? 0 : (NormalChallenge(10).isRunning ? 2 : 4));
      if (calcBoosts.floor().lte(DimBoost.purchasedBoosts)) return DC.D0;
      calcBoosts = calcBoosts.sub(DimBoost.purchasedBoosts);
      const boosts = Decimal.min(DC.BEMAX, calcBoosts.floor());
      return boosts;
    }
    let amount = DC.D20;
    if (Slabdrill.isCursed) amount = DC.D60;
    let discount = Effects.sum(
      TimeStudy(211),
      TimeStudy(222)
    );
    if (!player.disablePostReality) discount += AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0);
    let multiplierPerDB;
    if (Slabdrill.isCursed) {
      multiplierPerDB = DC.D20.sub(discount);
    } else if (tier === 6) {
      multiplierPerDB = DC.D20.sub(discount);
    } else if (tier === 8) {
      multiplierPerDB = DC.D15.sub(discount);
    }
    if (Alpha.isRunning) multiplierPerDB = multiplierPerDB.times(AlphaUnlocks.fifthDimboost.effects.nerf.effectOrDefault(1));
  
    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);
  
    multiplierPerDB = multiplierPerDB.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
    amount = amount.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
  
    calcBoosts = ad.sub(amount).div(multiplierPerDB);
  
  
    if (EternityChallenge(5).isRunning) {
      const ad = AntimatterDimension(tier).totalAmount;
      let estimateTotalAmount = Decimal.floor(Decimal.cbrt(ad.div(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1)))).add(1);
      const freeBoost = Slabdrill.isCursed ? new Decimal(0) : (NormalChallenge(10).isRunning ? new Decimal(2) : new Decimal(4));
      const divisor1 = Slabdrill.isCursed ? new Decimal(20) : (NormalChallenge(10).isRunning ? new Decimal(20) : new Decimal(15));
      const divisor2 = Effects.sum(TimeStudy(211), TimeStudy(222)) + (player.disablePostReality ? 0 : AlphaUnlocks.fifthDimboost.effects.buff.effectOrDefault(0));
      const multi = divisor1.sub(divisor2).times(Alpha.isRunning ? AlphaUnlocks.fifthDimboost.effects.nerf.effectOrDefault(1) : 1);
      const extraEffect = InfinityChallenge(5).isCompleted ? new Decimal(1) : new Decimal(0);
      const cubicSum = DC.D20.add(estimateTotalAmount.sub(freeBoost.add(1)).mul(multi));
      const listedCost = estimateTotalAmount.lt(freeBoost) ? new Decimal(0) : (Decimal.pow(estimateTotalAmount.sub(1), 3).add(estimateTotalAmount).add(cubicSum).sub(1).sub(Effects.sum(InfinityUpgrade.resetBoost)).sub(extraEffect)).times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
      if (listedCost.gt(0)) {
        if (listedCost.lt(ad)) {
          estimateTotalAmount = estimateTotalAmount.add(1);
        }
        if (listedCost.gte(ad)) {
          estimateTotalAmount = estimateTotalAmount.sub(1);
          if (listedCost.gte(ad)) {
            estimateTotalAmount = estimateTotalAmount.add(1);
          }
        }
        calcBoosts = estimateTotalAmount;
      } else {
        calcBoosts = freeBoost;
        // Dimension boosts 1-4 dont use 8th dims, 1-2 dont use 6th dims, so add those extras afterwards.
      }
      calcBoosts = calcBoosts.sub(1);
    } else {
      calcBoosts = calcBoosts.add(Slabdrill.isCursed ? 0 : (NormalChallenge(10).isRunning ? 2 : 4));
      // Dimension boosts 1-4 dont use 8th dims, 1-2 dont use 6th dims, so add those extras afterwards.
    }

    if (calcBoosts.gt(DC.E100)) {
      calcBoosts = calcBoosts.div(DC.E100);
      calcBoosts = Decimal.sqrt(calcBoosts);
      calcBoosts = calcBoosts.times(DC.E100);
    }
    
    // Add one cause (x-b)/i is off by one otherwise
    if (calcBoosts.floor().add(1).lte(DimBoost.purchasedBoosts)) return DC.D0;
    calcBoosts = calcBoosts.sub(DimBoost.purchasedBoosts);
    const minBoosts = Decimal.min(DC.BEMAX, calcBoosts.floor().add(1));
    return minBoosts;
  }

  static get maxBuyableDimBoostsAfterCap() {
    return Decimal.min(DimBoost.maxBuyableDimBoosts, DimBoost.maxBoosts.sub(player.dimensionBoosts));
  }
}

// eslint-disable-next-line max-params
export function softReset(tempBulk, forcedADReset = false, forcedAMReset = false, enteringAntimatterChallenge = false) {
  if (Currency.antimatter.gt(Player.infinityLimit)) return;
  const bulk = Decimal.min(tempBulk, DimBoost.maxBoosts.sub(player.dimensionBoosts));
  EventHub.dispatch(GAME_EVENT.DIMBOOST_BEFORE, bulk);
  player.dimensionBoosts = (Decimal.max(DC.D0, player.dimensionBoosts.add(bulk)));
  resetChallengeStuff();
  const canKeepDimensions = Pelle.isDoomed
    ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
    : (Perk.antimatterNoReset.canBeApplied && (!player.disablePostReality || (LHC.voidRunning && player.endgame.largeHadronCollider.void.nullified)));
  if (forcedADReset || !canKeepDimensions) {
    AntimatterDimensions.resetUpToNine();
    player.sacrificed = DC.D0;
    resetTickspeed();
  }
  skipResetsIfPossible(enteringAntimatterChallenge);
  const canKeepAntimatter = Pelle.isDoomed
    ? (PelleUpgrade.dimBoostResetsNothing.canBeApplied || PelleAchievementUpgrade.achievement111.canBeApplied)
    : (Achievement(111).isUnlocked || Perk.antimatterNoReset.canBeApplied) &&
      (!player.disablePostReality || (LHC.voidRunning && player.endgame.largeHadronCollider.void.nullified) || (Alpha.isRunning && Alpha.currentStage >= 12)
      || (LHC.voidRunning && NullUpgrade.limerick1.isBought) || SlabdrillUnlocks.eternityChallengeTen.isUnlocked);
  if (!forcedAMReset && canKeepAntimatter) {
    Currency.antimatter.bumpTo(Currency.antimatter.startingValue);
  } else {
    Currency.antimatter.reset();
  }
  EventHub.dispatch(GAME_EVENT.DIMBOOST_AFTER, bulk);
}

export function skipResetsIfPossible(enteringAntimatterChallenge) {
  if (enteringAntimatterChallenge || Player.isInAntimatterChallenge) return;
  if (InfinityUpgrade.skipResetGalaxy.isBought && player.dimensionBoosts.lt(4)) {
    player.dimensionBoosts = DC.D4;
    if (player.galaxies.lt(1)) player.galaxies = DC.D1;
  } else if (InfinityUpgrade.skipReset3.isBought && player.dimensionBoosts.lt(3)) player.dimensionBoosts = DC.D3;
  else if (InfinityUpgrade.skipReset2.isBought && player.dimensionBoosts.lt(2)) player.dimensionBoosts = DC.D2;
  else if (InfinityUpgrade.skipReset1.isBought && player.dimensionBoosts.lt(1)) player.dimensionBoosts = DC.D1;
}

export function manualRequestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.dimensionBoost) {
    Modal.dimensionBoost.show({ bulk });
    return;
  }
  requestDimensionBoost(bulk);
}

export function requestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  if (Alpha.isRunning && DimBoost.purchasedBoosts.gte(4) && Alpha.currentStage < 1) return;
  Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
  if (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought && bulk) maxBuyDimBoosts();
  else softReset(1);
  if (Slabdrill.isCursed && Slabdrill.currentStage === 0) {
    secondSoftCelestialReset();
    Slabdrill.advanceLayer();
    Slabdrill.quotes.dimboost.show();
  }
  if (Alpha.isRunning && DimBoost.purchasedBoosts.gte(4) && Alpha.currentStage === 0) {
    Alpha.advanceLayer();
    Alpha.quotes.fourthDB.show();
  }
  if (Alpha.isRunning && DimBoost.purchasedBoosts.gte(5) && Alpha.currentStage === 1) {
    Alpha.advanceLayer();
    Alpha.quotes.fifthDB.show();
  }
}

function maxBuyDimBoosts() {
  softReset(DimBoost.maxBuyableDimBoosts);
}
