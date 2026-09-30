import { DimensionState } from "./dimension";

export function infinityDimensionCommonMultiplier() {
  let mult = new Decimal(ShopPurchase.allDimPurchases.currentMult)
    .timesEffectsOf(
      Achievement(63),
      Achievement(75),
      Achievement(77),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      InfinityChallenge(6).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords,
      AlchemyResource.dimensionality,
      ImaginaryUpgrade(8),
      PelleRifts.recursion.milestones[1]
    );

  if (Replicanti.areUnlocked && Replicanti.amount.gt(1)) {
    mult = mult.times(ReplicantiMultipliers.idMult);
  }

  if (LHC.voidRunning) mult = mult.timesEffectOf(NullUpgrade.infinityDimensionMult);

  return mult;
}

export function toggleAllInfDims() {
  const areEnabled = Autobuyer.infinityDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.infinityDimension(i).isActive = !areEnabled;
  }
}

class InfinityDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.infinity, tier);
    const UNLOCK_REQUIREMENTS = [
      undefined,
      DC.E1100,
      DC.E1900,
      DC.E2400,
      DC.E10500,
      DC.E30000,
      DC.E45000,
      DC.E54000,
      DC.E60000,
      DC.BEMAX
    ];
    const SLAB_UNLOCK_REQUIREMENTS = [
      undefined,
      DC.E580,
      DC.E860,
      DC.E950,
      DC.E10500,
      DC.E30000,
      DC.E45000,
      DC.E54000,
      DC.E60000,
      DC.BEMAX
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
    this._slabUnlockRequirement = SLAB_UNLOCK_REQUIREMENTS[tier];
    const COST_MULTS = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30, 1e100];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 50, 30, 10, 5, 5, 5, 5, 5, 1000];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280, 1e300];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
    this.ipRequirement = BASE_COSTS[1];
  }

  /** @returns {Decimal} */
  get cost() { return this.data.cost; }
  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }

  get isUnlocked() {
    return this.data.isUnlocked;
  }

  set isUnlocked(value) {
    this.data.isUnlocked = value;
  }

  get amRequirement() {
    return Slabdrill.isCursed ? this._slabUnlockRequirement : this._unlockRequirement;
  }

  get antimatterRequirementReached() {
    return player.records.thisEternity.maxAM.gte(this.amRequirement);
  }

  get hasIPUnlock() {
    return this.tier === 1 && !PlayerProgress.eternityUnlocked();
  }

  get ipRequirementReached() {
    return !this.hasIPUnlock || Currency.infinityPoints.value.gte(this.ipRequirement);
  }

  get canUnlock() {
    return ((Perk.bypassIDAntimatter.canBeApplied && !player.disablePostReality) || this.antimatterRequirementReached) &&
      this.ipRequirementReached;
  }

  get isAvailableForPurchase() {
    return InfinityDimensions.canBuy() && this.isUnlocked && this.isAffordable && !this.isCapped;
  }

  get isAffordable() {
    return Currency.infinityPoints.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = DC.D0;
    if (tier === 8) {
      // We need a extra 10x here (since ID8 production is per-second and
      // other ID production is per-10-seconds).
      EternityChallenge(7).reward.applyEffect(v => toGain = v.times(10));
      if (EternityChallenge(7).isRunning) EternityChallenge(7).applyEffect(v => toGain = v.times(10));
    } else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get productionPerSecond() {
    if (EternityChallenge(2).isRunning || EternityChallenge(10).isRunning || player.universes.current === 2 ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return DC.D0;
    }
    let production = this.totalAmount;
    if (EternityChallenge(11).isRunning) {
      return production;
    }
    if (EternityChallenge(7).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    if (EternityChallenge(11).isRunning) return DC.D1;
    let mult = GameCache.infinityDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? Achievement(94) : null,
        (tier === 4 && !Ascensions.sacA.isUnlocked) ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null
      );

    let purchValue;
    if (Laitela.continuumActive && !EternityChallenge(8).isRunning && Alpha.currentStage >= 9 && !player.disablePostReality) {
      purchValue = InfinityDimension(tier).continuumValue;
    } else {
      purchValue = Decimal.floor(this.baseAmount.div(10));
    }

    mult = mult.times(Decimal.pow(this.powerMultiplier, purchValue));


    if (tier === 1) {
      mult = mult.times(PelleRifts.decay.milestones[0].effectOrDefault(1));
    }

    if (SlabdrillUnlocks.infinityChallengeFour.isUnlocked) {
      mult = mult.times(Slabdrill.slabPowers.idMult());
    }


    mult = mult.pow(getAdjustedGlyphEffect("infinitypow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.infinity);
    mult = mult.pow(Ra.momentumValue);
    mult = mult.powEffectOf(PelleRifts.paradox);
    mult = mult.powEffectOf(SingularityMilestone.dimensionPow);
    mult = mult.powEffectOf(Ra.unlocks.allDimPowTT);
    mult = mult.powEffectOf(Ra.unlocks.infinityDimPower);

    if (ExpansionPack.pellePack.isBought && !player.disablePostReality) mult = mult.pow(Decimal.pow(Decimal.log10(player.records.bestEndgame.galaxies).div(100), 1.5).add(1));

    if (player.dilation.active || (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed())) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }

    if (PelleStrikes.powerGalaxies.hasStrike && !PelleStrikes.powerGalaxies.isDestroyed()) {
      mult = mult.pow(0.5);
    }

    if (tier === 4 && Ascensions.sacA.isUnlocked) mult = mult.powEffectOf(TimeStudy(72));

    mult = mult.powEffectsOf(
      BreakEternityUpgrade.infinityDimensionPow
    );

    if (tier === 8 && !player.disablePostReality) {
      mult = mult.pow(AlphaUnlocks.infinityDimensions.effects.buff.effectOrDefault(1));
    }

    if (tier === 1 && !player.disablePostReality) {
      mult = mult.pow(AlphaUnlocks.eternityUpgrades.effects.buff.effectOrDefault(1));
    }

    if (Alpha.isRunning) mult = mult.pow(AlphaUnlocks.eternityUpgrades.effects.nerf.effectOrDefault(1));
    if (SlabdrillUnlocks.infinityChallengeFour.isUnlocked) mult = mult.pow(0.75);

    if (SlabdrillUnlocks.eternity.isUnlocked) mult = mult.pow(0.75);
    if (SlabdrillUnlocks.eternityChallengeTen.isUnlocked) mult = mult.pow(0.75);

    mult = mult.powEffectOf(DualityUpgrade(8));

    if (Replicanti.areUnlocked && ResurgenceUpgrade.repSurge.isBought && !player.disablePostReality) mult = mult.pow(ReplicantiMultipliers.idPow);

    if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) mult = mult.pow(Achievements.powerConv(Achievement(75).effectOrDefault(1)));

    mult = mult.powEffectsOf(
      EternityUpgrade.idMultEP.chargedEffect,
      EternityUpgrade.idMultEternities.chargedEffect,
      EternityUpgrade.idMultICRecords.chargedEffect
    );

    mult = mult.pow(NormalChallenge(2).chargedEffect);

    mult = dilateMultiplier(mult, EtherealStars.orange.reward);

    if (player.endgame.overcharge.isRunning) {
      mult = dilateMultiplier(mult, Ascension.overchargePenalty);
    }

    if (player.compression.active) {
      mult = compressedMultiplier(mult);
    }

    if (player.universes.current === 1) mult = dilateMultiplier(mult, Decimal.pow(0.1, Decimal.pow(0.9, Currency.relativisticParticles.value.max(10).log10().log10().pow(2))));

    if (mult.gte(InfinityDimensions.OVERFLOW)) mult = Decimal.pow(10, Decimal.pow(mult.log10().div(Decimal.log10(InfinityDimensions.OVERFLOW)), 1 / InfinityDimensions.compressionMagnitude).times(Decimal.log10(InfinityDimensions.OVERFLOW)));

    if (mult.gte(InfinityDimensions.OVERFLOW_SQUARED)) mult = Decimal.pow(10, Decimal.pow(mult.log10().div(Decimal.log10(InfinityDimensions.OVERFLOW_SQUARED)), 1 / InfinityDimensions.compressionMag2).times(Decimal.log10(InfinityDimensions.OVERFLOW_SQUARED)));

    return mult;
  }

  get isProducing() {
    const tier = this.tier;
    if (EternityChallenge(2).isRunning || player.universes.current === 2 ||
      EternityChallenge(10).isRunning ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    let costMult = this._costMultiplier;
    EternityChallenge(12).reward.applyEffect(v => costMult = Math.pow(costMult, v));
    return costMult;
  }

  get powerMultiplier() {
    return new Decimal(this._powerMultiplier)
      .timesEffectsOf(this._tier === 8 ? GlyphSacrifice.infinity : null)
      .powEffectsOf(ImaginaryUpgrade(14), SingularityMilestone.perPurchaseDimMult);
  }

  get purchases() {
    // Because each ID purchase gives 10 IDs
    return this.data.baseAmount.div(10);
  }

  get purchaseCap() {
    if (Enslaved.isRunning) {
      return DC.D1;
    }
    return InfinityDimensions.capIncrease.add(this.tier === 8
      ? DC.BEMAX
      : InfinityDimensions.HARDCAP_PURCHASES);
  }

  get isCapped() {
    return new Decimal(this.purchases).gte(this.purchaseCap);
  }

  get hardcapIPAmount() {
    return this._baseCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap));
  }

  get continuumValue() {
    if (!this.isAvailableForPurchase) return DC.D0;
    // Nameless limits dim purchases to 1 only
    // Continuum should be no different
    if (Enslaved.isRunning) return DC.D1;
    // It's safe to use dimension.currencyAmount because this is
    // a dimension-only method (so don't just copy it over to tickspeed).
    // We need to use dimension.currencyAmount here because of different costs in NC6.
    return this.getContinuumValue.times(Laitela.matterExtraPurchaseFactor);
  }

  get getContinuumValue() {
    return Decimal.min(Decimal.log(Currency.infinityPoints.value.div(this.baseCost), this.costMultiplier), this.purchaseCap);
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    if (!Laitela.continuumActive || EternityChallenge(8).isRunning || Alpha.currentStage < 9 || player.disablePostReality) return DC.D0;
    return Decimal.floor(this.continuumValue.times(10));
  }

  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.cost = new Decimal(this.baseCost);
    this.amount = DC.D0;
    this.bought = DC.D0;
    this.baseAmount = DC.D0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    if (Alpha.isRunning && Alpha.currentStage < 10 && this.tier > 4) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.INFINITY_DIMENSION_UNLOCKED, this.tier);
    if (this.tier === 1 && !PlayerProgress.eternityUnlocked()) {
      Tab.dimensions.infinity.show();
    }
    if (this.tier === 8 && Alpha.isRunning && Alpha.currentStage === 10) {
      Alpha.advanceLayer();
      Alpha.quotes.eighthInfinityDimension.show();
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    if (Laitela.continuumActive && Alpha.currentStage >= 9 && !player.disablePostReality) return;
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString = this.tier === 1
        ? "purchase a 1st Infinity Dimension"
        : "purchase a Dimension which will produce 1st IDs";
      ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }
    if (DualityUpgrade(15).isLockingMechanics) {
      const lockString = "purchase an Infinity Dimension";
      DualityUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    Currency.infinityPoints.purchase(this.cost);
    this.cost = Decimal.round(this.cost.times(this.costMultiplier));
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(10);
    this.baseAmount = this.baseAmount.plus(10);

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= 1;
    }

    return true;
  }

  buyMax(auto) {
    if (Laitela.continuumActive && Alpha.currentStage >= 9 && !player.disablePostReality) return;
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString = this.tier === 1
        ? "purchase a 1st Infinity Dimension"
        : "purchase a Dimension which will produce 1st IDs";
      if (!auto) ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }
    if (DualityUpgrade(15).isLockingMechanics) {
      const lockString = "purchase an Infinity Dimension";
      DualityUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    let purchasesUntilHardcap = this.purchaseCap.sub(this.purchases);
    if (EternityChallenge(8).isRunning) {
      purchasesUntilHardcap = Decimal.clampMax(purchasesUntilHardcap, player.eterc8ids);
    }

    const costScaling = new DecimalLinearCostScaling(
      Currency.infinityPoints.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap
    );

    if (costScaling.purchases.lte(0)) return false;

    Currency.infinityPoints.purchase(costScaling.totalCost);
    this.cost = this.cost.times(costScaling.totalCostMultiplier);
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(costScaling.purchases.times(10));
    this.baseAmount = this.baseAmount.plus(costScaling.purchases.times(10));

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= costScaling.purchases.toNumber();
    }
    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {InfinityDimensionState}
 */
export const InfinityDimension = InfinityDimensionState.createAccessor();

export const InfinityDimensions = {
  /**
   * @type {InfinityDimensionState[]}
   */
  all: InfinityDimension.index.compact(),
  get HARDCAP_PURCHASES() {
    return Slabdrill.isCursed && SlabdrillUnlocks.timeStudy181.isUnlocked ? 5000 : (Alpha.isRunning ? AlphaUnlocks.breakUpgrades.effects.nerf.effectOrDefault(2000000) : 2000000);
  },

  get OVERFLOW() {
    return DC.E1E15.powEffectsOf(EndgameMastery(92));
  },

  get OVERFLOW_SQUARED() {
    return DC.ENUMMAX;
  },

  get compressionMagnitude() {
    const extraReduction = (ExpansionPack.enslavedPack.isBought && !player.disablePostReality) ? Math.pow(1 / Math.log10(Tesseracts.effectiveCount + 1), 0.2) : 1;
    let reduction = Effects.product(EndgameMastery(82), EndgameUpgrade(2)) * extraReduction;
    if (!player.disablePostReality) reduction *= AlphaUnlocks.infinityChallenges.effects.buff.effectOrDefault(1);
    return Math.max(10 * reduction, 2) - Math.max((0.2 - reduction) * 5, 0);
  },

  get compressionMag2() {
    let reduction = 1;
    return Math.max(10 * reduction, 2) - Math.max((0.2 - reduction) * 5, 0);
  },

  unlockNext() {
    if (InfinityDimension(8).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (InfinityDimension(8).isUnlocked)
      throw "All Infinity Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.infinityPower.reset();
    for (const dimension of InfinityDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of InfinityDimensions.all) {
      dimension.fullReset();
    }
  },

  get capIncrease() {
    return Decimal.floor(Tesseracts.capIncrease());
  },

  get totalDimCap() {
    return new Decimal(this.HARDCAP_PURCHASES).add(this.capIncrease);
  },

  canBuy() {
    return !EternityChallenge(2).isRunning && player.universes.current !== 2 &&
      !EternityChallenge(10).isRunning &&
      (!EternityChallenge(8).isRunning || player.eterc8ids > 0);
  },

  canAutobuy() {
    return this.canBuy() && !EternityChallenge(8).isRunning;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      InfinityDimension(tier).produceDimensions(InfinityDimension(tier - 1), new Decimal(diff).div(10));
    }

    if (EternityChallenge(7).isRunning) {
      if (!NormalChallenge(10).isRunning && !Slabdrill.isCursed) {
        InfinityDimension(1).produceDimensions(AntimatterDimension(7), diff);
      }
    } else {
      InfinityDimension(1).produceCurrency(Currency.infinityPower, diff);
    }

    if (!InfinityDimensions.all.every(d => d.tier > 8 || d.amount.eq(0)) || !InfinityDimensions.all.every(d => d.tier > 8 || d.continuumAmount.eq(0))) {
      player.requirementChecks.endgame.onlyLowDims = false;
    }

    player.requirementChecks.reality.maxID1 = player.requirementChecks.reality.maxID1
      .clampMin(InfinityDimension(1).amount);
  },

  tryAutoUnlock() {
    if (!EternityMilestone.autoUnlockID.isReached || InfinityDimension(8).isUnlocked) return;
    for (const dimension of this.all) {
      // If we cannot unlock this one, we can't unlock the rest, either
      if (!dimension.unlock()) break;
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    if (Laitela.continuumActive && Alpha.currentStage >= 9 && !player.disablePostReality) return;
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter(dimension => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions.slice().reverse().forEach(dimension => {
      if (dimension.purchases.eq(0)) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach(dimension => dimension.buyMax(false));
  },

  get powerConversionRate() {
    const multiplier = PelleRifts.paradox.milestones[2].effectOrDefault(1);
    const multiplier2 = Effects.product(
      BreakEternityUpgrade.infinityPowerConversion
    );
    const exponent = Effects.product(EndgameMastery(102), Ra.unlocks.spaceTheoremIPowConversion) * (SlabdrillUnlocks.infinityChallengeFour.isUnlocked ? 1.5 : 1);
    const divisor = Alpha.isRunning ? AlphaUnlocks.breakInfinity.effects.nerfC.effectOrDefault(1) : 1;
    return Math.pow((7 + getAdjustedGlyphEffect("infinityrate") + PelleUpgrade.infConversion.effectOrDefault(0)) * multiplier * multiplier2, exponent) / divisor;
  }
};
