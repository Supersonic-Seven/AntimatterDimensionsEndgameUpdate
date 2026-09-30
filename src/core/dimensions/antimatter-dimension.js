import { DimensionState } from "./dimension";

// Multiplier applied to all Antimatter Dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
export function antimatterDimensionCommonMultiplier() {
  let multiplier = DC.D1;

  multiplier = multiplier.times(Achievements.power);
  multiplier = multiplier.times(ShopPurchase.dimPurchases.currentMult);
  multiplier = multiplier.times(ShopPurchase.allDimPurchases.currentMult);

  if (!EternityChallenge(9).isRunning) {
    multiplier = multiplier.times(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).max(1));
  }
  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    Achievement(18),
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(72),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10),
    AlchemyResource.dimensionality,
    PelleUpgrade.antimatterDimensionMult
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));
  multiplier = multiplier.times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));

  if (Pelle.isDoomed && !PelleDestructionUpgrade.disableADNerf.canBeApplied) multiplier = multiplier.dividedBy(Currency.antimatter.value.add(1).log10().times(50).max(1));
  if (Alpha.isRunning) multiplier = multiplier.div(Currency.antimatter.value.add(1).log10().times(125).max(1));
  if (Slabdrill.isCursed) multiplier = multiplier.div(Currency.antimatter.value.add(1).log10().times(1666).max(1));
  if (Slabdrill.isCursed) multiplier = multiplier.times(Decimal.pow(6.66, NormalChallenges.all.countWhere(c => c.id <= 9 && c.isCompleted)));

  if (LHC.voidRunning) multiplier = multiplier.timesEffectOf(NullUpgrade.antimatterDimensionMult);

  return multiplier;
}

export function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 9) throw new Error(`Invalid Antimatter Dimension tier ${tier}`);
  if (Slabdrill.isCursed && tier > (Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 10), 2) - 1)) return DC.D1;
  if (NormalChallenge(10).isRunning && tier > 6) return DC.D1;
  if (EternityChallenge(11).isRunning) {
    return Currency.infinityPower.value.pow(
      InfinityDimensions.powerConversionRate
    ).max(1).times(DimBoost.multiplierToNDTier(tier));
  }

  if (Slabdrill.coreActive) return DC.D1.times(Slabdrill.slabPowers.adMult());

  let multiplier = DC.D1;

  multiplier = applyNDMultipliers(multiplier, tier);
  multiplier = applyNDPowers(multiplier, tier);

  const glyphDilationPowMultiplier = getAdjustedGlyphEffect("dilationpow");
  if (player.dilation.active || (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed())) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.ndMultDT);

  if (Effarig.isRunning) {
    multiplier = Effarig.multiplier(multiplier);
  } else if (V.isRunning) {
    multiplier = multiplier.pow(0.5);
  }

  // This power effect goes intentionally after all the nerf effects and shouldn't be moved before them
  if (AlchemyResource.inflation.isUnlocked && multiplier.gte(AlchemyResource.inflation.effectValue)) {
    multiplier = multiplier.pow(1.05);
  }

  multiplier = multiplier.powEffectsOf(
    BreakEternityUpgrade.antimatterDimensionPow
  );

  if (Alpha.isRunning) multiplier = multiplier.pow(AlphaUnlocks.timestudy181.effects.nerf.effectOrDefault(1));

  if (!player.disablePostReality) multiplier = multiplier.pow(AlphaUnlocks.timestudy181.effects.buff.effectOrDefault(1));

  if (LHC.voidRunning) {
    multiplier = multiplier.powEffectOf(Accelerators.potency._milestones[0]);
    multiplier = multiplier.pow(Accelerators.emptiness.effectValue1);
    multiplier = multiplier.powEffectOf(Accelerators.emptiness._milestones[0]);
    if (DivinityMilestone.celestialSurge.isReached) multiplier = multiplier.pow(2);
    if (DivinityMilestone.finalRebirth.isReached) multiplier = multiplier.pow(Time.thisEndgameRealTime.totalSeconds.max(1).log10().div(5).pow(3).add(1));
    multiplier = multiplier.pow(Currency.nullParticles.value.max(1).log10().div(5).add(1).pow(5));
  }

  if (ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality) multiplier = multiplier.pow(Achievements.powerConv(Achievements.power));

  multiplier = multiplier.pow(NormalChallenge(2).chargedEffect);

  if (tier % 2 === 0) multiplier = multiplier.pow(NormalChallenge(12).chargedEffect);

  multiplier = dilateMultiplier(multiplier, Achievement(231).effectOrDefault(1));

  multiplier = dilateMultiplier(multiplier, EtherealStars.red.reward);

  if (tier === 1) multiplier = dilateMultiplier(multiplier, NormalChallenge(3).chargedEffect);

  if (player.endgame.overcharge.isRunning) {
    multiplier = dilateMultiplier(multiplier, Ascension.overchargePenalty);
  }

  if (player.compression.active) {
    multiplier = compressedMultiplier(multiplier);
  }

  multiplier = multiplier.timesEffectOf(CompressionUpgrade.adMultTR);

  multiplier = multiplier.timesEffectOf(CompressionUpgrade.adBigMultTR);

  if (player.universes.current === 1) multiplier = dilateMultiplier(multiplier, Decimal.pow(0.1, Decimal.pow(0.9, Currency.relativisticParticles.value.max(10).log10().log10().pow(2))));

  if (tier === 9) multiplier = multiplier.max(10).log10();
  if (tier === 9) {
    multiplier = multiplier.timesEffectsOf(DualityUpgrade(30));
  }
  if (tier === 9 && Slabdrill.isCursed) multiplier = multiplier.pow(Math.max(((player.celestials.slabdrill.goodbyeTick - 300000) / 30000) + 1, 1));

  return multiplier;
}

function applyNDMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.antimatterDimensionCommonMultiplier.value);

  let buy10Value;
  if (Laitela.continuumActive && tier !== 9) {
    buy10Value = AntimatterDimension(tier).continuumValue;
  } else {
    buy10Value = Decimal.floor(AntimatterDimension(tier).bought.div(10));
  }

  if (!Ascensions.b10mA.isUnlocked) multiplier = multiplier.times(Decimal.pow(AntimatterDimensions.buyTenMultiplier, buy10Value));
  multiplier = multiplier.times(DimBoost.multiplierToNDTier(tier));

  let infinitiedMult = DC.D1.timesEffectsOf(
    BreakInfinityUpgrade.infinitiedMult
  );
  if (tier !== 9) infinitiedMult = infinitiedMult.timesEffectOf(AntimatterDimension(tier).infinityUpgrade);
  infinitiedMult = infinitiedMult.pow(TimeStudy(31).effectOrDefault(1));
  multiplier = multiplier.times(infinitiedMult);

  if (tier === 1) {
    multiplier = multiplier
      .timesEffectsOf(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(11),
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        !Ascensions.sacA.isUnlocked ? TimeStudy(234) : null
      );
  }
  if ((tier === 8 && !Ascensions.sacA.isUnlocked) || (tier === 1 && Slabdrill.isCursed)) {
    multiplier = multiplier.times(Sacrifice.totalBoost);
  }

  multiplier = multiplier.timesEffectsOf(
    tier === 2 ? Achievement(12) : null,
    tier >= 3 && tier <= 8 ? Achievement(13) : null,
    tier === 4 ? Achievement(14) : null,
    tier >= 5 && tier <= 8 ? Achievement(15) : null,
    tier === 6 ? Achievement(16) : null,
    tier === 7 ? Achievement(17) : null,
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(64) : null,
    (tier < 8 && !Ascensions.sacA.isUnlocked) ? TimeStudy(71) : null,
    (tier === (Slabdrill.isCursed ? 1 : 8) && !Ascensions.sacA.isUnlocked) ? TimeStudy(214) : null,
    (tier > 1 && tier < 8 && !Slabdrill.isCursed) ? InfinityChallenge(8).reward : null
  );
  if (Achievement(43).isUnlocked) {
    multiplier = multiplier.times(1 + tier / 100);
  }

  if (Slabdrill.isCursed) multiplier = multiplier.times(Slabdrill.slabPowers.adMult());

  multiplier = multiplier.clampMin(1);

  return multiplier;
}

function applyNDPowers(mult, tier) {
  let multiplier = mult;
  const glyphPowMultiplier = getAdjustedGlyphEffect("powerpow");
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");

  if (InfinityChallenge(4).isRunning && (player.postC4Tier !== tier || Slabdrill.isCursed)) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier.pow(glyphPowMultiplier * glyphEffarigPowMultiplier * Ra.momentumValue);

  multiplier = multiplier
    .powEffectsOf(
      AntimatterDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      AlchemyResource.power,
      Achievement(183),
      PelleRifts.paradox,
      SingularityMilestone.dimensionPow,
      Ra.unlocks.allDimPowTT,
      BreakInfinityUpgrade.totalAMMult.chargedEffect,
      BreakInfinityUpgrade.currentAMMult.chargedEffect,
      BreakInfinityUpgrade.infinitiedMult.chargedEffect,
      BreakInfinityUpgrade.achievementMult.chargedEffect,
      BreakInfinityUpgrade.slowestChallengeMult.chargedEffect
    );

  if (ExpansionPack.pellePack.isBought && !player.disablePostReality) multiplier = multiplier.pow(Decimal.pow(Decimal.log10(player.records.bestEndgame.galaxies).div(100), 1.5).add(1));

  multiplier = multiplier.pow(getAdjustedGlyphEffect("curseddimensions"));

  multiplier = multiplier.pow(VUnlocks.adPow.effectOrDefault(1));

  if (Pelle.isDoomed && PelleCelestialUpgrade.vMilestones1.canBeApplied) multiplier = multiplier.pow(VUnlocks.adPow.effectValue);

  if (PelleStrikes.infinity.hasStrike && !PelleStrikes.infinity.isDestroyed()) {
    multiplier = multiplier.pow(0.5);
  }

  if (Ascensions.dbA.isUnlocked) multiplier = multiplier.pow(DimBoost.powerToND);

  if (Ascensions.b10mA.isUnlocked) {
    let OoMValue;
    if (Laitela.continuumActive && tier !== 9) {
      OoMValue = AntimatterDimension(tier).continuumValue.max(1).log10();
    } else {
      OoMValue = Decimal.floor(AntimatterDimension(tier).bought.div(10)).max(1).log10();
    }

    multiplier = multiplier.pow(AntimatterDimensions.buyOoMPower.times(OoMValue).add(1));
  }

  if (Ascensions.sacA.isUnlocked && tier === 8) {
    multiplier = multiplier.pow(Sacrifice.totalPower);
  }

  if (tier < 8 && Ascensions.sacA.isUnlocked) multiplier = multiplier.powEffectOf(TimeStudy(71));

  if (tier === 8 && Ascensions.sacA.isUnlocked) multiplier = multiplier.powEffectOf(TimeStudy(214));

  if (tier === 1 && Ascensions.sacA.isUnlocked) multiplier = multiplier.powEffectOf(TimeStudy(234));

  if (SlabdrillUnlocks.infinity.isUnlocked) multiplier = multiplier.pow(Slabdrill.slabPowers.adPow());
  if (Slabdrill.isCursed) multiplier = multiplier.powEffectOf(InfinityChallenge(8).reward);
  if (Slabdrill.isCursed && NormalChallenge(10).isRunning) multiplier = multiplier.pow(0.75);
  if (Slabdrill.isCursed && NormalChallenge(12).isRunning) multiplier = multiplier.pow(0.5 + player.chall2Pow / 2);
  if (Slabdrill.isCursed && EternityChallenge(3).isRunning) multiplier = multiplier.pow(0.5);
  if (Slabdrill.isCursed && SlabdrillUnlocks.eternityChallengeTen.isUnlocked) multiplier = multiplier.pow(0.75);

  return multiplier;
}

function onBuyDimension(tier) {
  if (tier === 1) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM1);
  if (tier === 2) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
  if (tier !== 9) Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (player.speedrun.isActive && !player.speedrun.hasStarted) Speedrun.startTimer();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning || InfinityChallenge(1).isRunning) {
    AntimatterDimensions.resetAmountUpToTier(tier - 1);
    if (Slabdrill.isCursed) Currency.antinatter.reset();
  }

  player.postC4Tier = tier;
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  if (tier !== 8) player.requirementChecks.eternity.onlyAD8 = false;
  if (tier !== 1) player.requirementChecks.eternity.onlyAD1 = false;
  if (tier === 8) player.requirementChecks.infinity.noAD8 = false;
  if (tier === 1) player.requirementChecks.eternity.noAD1 = false;
  if (tier === 9 && Slabdrill.isDestroyed) {
    player.celestials.slabdrill.hasBoughtNinthDimension = true;
    GameEnd.creditsEverClosed = false;
  }
}

export function buyOneDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;

  const cost = dimension.cost;

  if (tier === 8 && DualityUpgrade(15).isLockingMechanics) {
    const lockString = `purchase an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`;
    DualityUpgrade(15).tryShowWarningModal(lockString);
    return false;
  }

  if (tier === 8 && Enslaved.isRunning && AntimatterDimension(8).bought.gte(1)) return false;
  if (tier === 9 && true && Slabdrill.isDestroyed && AntimatterDimension(9).bought.gte(1)) return false;

  if (cost.lt(DC.E9E15)) dimension.currencyAmount = dimension.currencyAmount.minus(cost);

  if (dimension.boughtBefore10 === 9) {
    dimension.challengeCostBump();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought = dimension.bought.plus(1);

  if (tier === 1) {
    Achievement(28).tryUnlock();
  }

  onBuyDimension(tier);

  return true;
}

export function buyManyDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if (tier === 8 && DualityUpgrade(15).isLockingMechanics) {
    const lockString = `purchase an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`;
    DualityUpgrade(15).tryShowWarningModal(lockString);
    return false;
  }

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);
  if (tier === 9 && true && Slabdrill.isDestroyed) return buyOneDimension(9);

  if (cost.lt(DC.E9E15)) dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought = dimension.bought.plus(dimension.remainingUntil10);

  onBuyDimension(tier);

  return true;
}

export function buyAsManyAsYouCanBuy(tier) {
  const dimension = AntimatterDimension(tier);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (tier === 8 && DualityUpgrade(15).isLockingMechanics) {
    const lockString = `purchase an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`;
    DualityUpgrade(15).tryShowWarningModal(lockString);
    return false;
  }

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);
  if (tier === 9 && true && Slabdrill.isDestroyed) return buyOneDimension(9);

  if (cost.lt(DC.E9E15)) dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought = dimension.bought.plus(howMany);

  onBuyDimension(tier);

  return true;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  if (Laitela.continuumActive && tier !== 9) return;
  const dimension = AntimatterDimension(tier);
  dimension.challengeCostBump();
  dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10));
  dimension.bought = Decimal.round(dimension.bought.plus(dimension.remainingUntil10));
  onBuyDimension(tier);
}

export function maxAll() {
  if (Laitela.continuumActive) {
    buyMaxDimension(9);
    return;
  }

  player.requirementChecks.infinity.maxAll = true;

  for (let tier = 1; tier < 10; tier++) {
    buyMaxDimension(tier);
  }

  // Do this here because tickspeed might not have been unlocked before
  // (and maxAll might have unlocked it by buying dimensions).
  buyMaxTickSpeed();
}

export function buyMaxDimension(tier, bulk = Infinity) {
  const dimension = AntimatterDimension(tier);
  if ((Laitela.continuumActive && tier !== 9) || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return;
  const cost = dimension.costUntil10;
  let bulkLeft = bulk;
  const goal = Player.infinityGoal;
  if (dimension.cost.gt(goal) && Player.isInAntimatterChallenge) return;

  if (tier === 8 && DualityUpgrade(15).isLockingMechanics) {
    const lockString = `purchase an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension`;
    DualityUpgrade(15).tryShowWarningModal(lockString);
    return false;
  }

  if (tier === 8 && Enslaved.isRunning) {
    buyOneDimension(8);
    return;
  }

  if (tier === 9 && true && Slabdrill.isDestroyed) {
    buyOneDimension(9);
    return;
  }

  // Buy any remaining until 10 before attempting to bulk-buy
  if (dimension.currencyAmount.gte(cost)) {
    if (cost.lt(DC.E9E15)) dimension.currencyAmount = dimension.currencyAmount.minus(cost);
    buyUntilTen(tier);
    bulkLeft--;
  }

  if (bulkLeft <= 0) return;

  // Buy in a while loop in order to properly trigger abnormal price increases
  if (NormalChallenge(9).isRunning || (InfinityChallenge(5).isRunning && !Slabdrill.isCursed)) {
    while (dimension.isAffordableUntil10 && dimension.cost.lt(goal) && bulkLeft > 0) {
      // We can use dimension.currencyAmount or Currency.antimatter here, they're the same,
      // but it seems safest to use dimension.currencyAmount for consistency.
      if (cost.lt(DC.E9E15)) dimension.currencyAmount = dimension.currencyAmount.minus(dimension.costUntil10);
      buyUntilTen(tier);
      bulkLeft--;
    }
    return;
  }

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  let maxBought = dimension.costScale.getMaxBoughtDecimal(
    Decimal.floor(dimension.bought.div(10)).add(dimension.costBumps), dimension.currencyAmount, 10
  );
  if (tier === 9) {
    maxBought = dimension.costScale.getMaxBoughtDecimal(
      Decimal.floor(dimension.bought.div(10)).add(dimension.costBumps), dimension.currencyAmount.max(1).log10(), 10
    );
  }
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying.gt(bulkLeft)) buying = new Decimal(bulkLeft);
  if (dimension.currencyAmount.gte(Decimal.pow10(maxBought.logPrice))) {
    dimension.amount = dimension.amount.plus(buying.times(10)).round();
    dimension.bought = dimension.bought.plus(buying.times(10)).round();
    if (cost.lt(DC.E9E15)) dimension.currencyAmount = dimension.currencyAmount.minus(Decimal.pow10(maxBought.logPrice));
  }
}

class AntimatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24, 1e100];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15, 1e10];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6, 1e100];
    this._c6BaseCost = C6_BASE_COSTS[tier];
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4, 1e10];
    this._c6BaseCostMultiplier = C6_BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: Slabdrill.isCursed ? (InfinityChallenge(5).isRunning ? 1e15 : (NormalChallenge(6).isRunning ? 1000 : 100)) :
        (NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier),
      costScale: Player.dimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    if (this.tier === 9) return Decimal.pow10(this.costScale.calculateCostDecimal(Decimal.floor(this.bought.div(10)).add(this.costBumps)));
    return this.costScale.calculateCostDecimal(Decimal.floor(this.bought.div(10)).add(this.costBumps));
  }

  /** @returns {number} */
  get costBumps() { return this.data.costBumps; }
  /** @param {number} value */
  set costBumps(value) { this.data.costBumps = value; }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return Decimal.modulo(this.bought, 10).toNumber();
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return 10 - this.boughtBefore10;
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    if (this.tier === 9) return this.cost.pow(this.boughtBefore10 + this.howManyCanBuy);
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    let ratio = this.currencyAmount.dividedBy(this.cost);
    if (this.tier === 9) {
      if (!Slabdrill.isCursed && true) ratio = this.currencyAmount.gte(this.cost) ? DC.D1.sub(this.bought) : DC.D0;
      else ratio = this.currencyAmount.max(1).log10().div(this.cost.max(1).log10());
    }
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 10 - this.boughtBefore10), 0)).toNumber();
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 9 ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return DC.D0;
    }

    if (tier === 8 && !(player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed)) return DC.D0;

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = AntimatterDimension(tier + 2).productionPerSecond;
    } else {
      toGain = AntimatterDimension(tier + 1).productionPerSecond;
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    const tier = this.tier;
    if ((Slabdrill.isCursed && tier > (Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 10), 2) - 1)) ||
      (EternityChallenge(3).isRunning && tier > 4) ||
      (NormalChallenge(10).isRunning && tier > 6) ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? AntimatterDimension(this.tier - 2).amount
      : Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    if (this.tier >= 3 && NormalChallenge(6).isRunning) AntimatterDimension(this.tier - 2).amount = value;
    else Currency.antimatter.value = value;
  }

  /**
   * @returns {number}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) return DC.D0;
    // Nameless limits dim 8 purchases to 1 only
    // Continuum should be no different
    if (this.tier === 8 && Enslaved.isRunning) return DC.D1;
    // It's safe to use dimension.currencyAmount because this is
    // a dimension-only method (so don't just copy it over to tickspeed).
    // We need to use dimension.currencyAmount here because of different costs in NC6.
    return this.costScale.getContinuumValue(this.currencyAmount, 10).times(Laitela.matterExtraPurchaseFactor);
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    if (!Laitela.continuumActive || this.tier === 9) return DC.D0;
    return Decimal.floor(this.continuumValue.times(10));
  }

  /**
   * Continuum doesn't continually update dimension amount because that would require making the code
   * significantly messier to handle it properly. Instead an effective amount is calculated here, which
   * is only used for production and checking for boost/galaxy. Doesn't affect achievements.
   * Taking the max is kind of a hack but it seems to work in all cases. Obviously it works if
   * continuum isn't unlocked. If the dimension is being produced and the continuum is unlocked,
   * the dimension will be being produced in large numbers (since the save is endgame), so the amount
   * will be larger than the continuum and so the continuum is insignificant, which is fine.
   * If the dimension isn't being produced, the continuum will be at least the amount, so
   * the continuum will be used and that's fine. Note that when continuum is first unlocked,
   * both 8d amount and 8d continuum will be nonzero until the next infinity, so taking the sum
   * doesn't work.
   * @param {Decimal} value
   */
  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  /**
    * @returns {boolean}
    */
  get isAffordable() {
    if (Laitela.continuumActive && this.tier !== 9) return false;
    if (!player.break && this.cost.gt(DC.NUMMAX)) return false;
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(DC.NUMMAX)) return false;
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (!EternityMilestone.unlockAllND.isReached && this.tier > DimBoost.totalBoosts.plus(4).toNumber()) return false;
    const hasPrevTier = this.tier === 1 || AntimatterDimension(this.tier - 1).totalAmount.gt(0);
    if (!EternityMilestone.unlockAllND.isReached && !hasPrevTier) return false;
    if (Slabdrill.isCursed) return this.tier < Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 10), 2);
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  reset() {
    this.amount = DC.D0;
    this.bought = DC.D0;
    this.costBumps = DC.D0;
  }

  resetAmount() {
    this.amount = DC.D0;
  }

  challengeCostBump() {
    if (InfinityChallenge(5).isRunning && !Slabdrill.isCursed) this.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) this.multiplySameCosts();
  }

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (dimension.cost.max(1).log10().floor().eq(this.cost.max(1).log10().floor())) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
    if (Tickspeed.cost.max(1).log10().floor().eq(this.cost.max(1).log10().floor())) player.chall9TickspeedCostBumps = player.chall9TickspeedCostBumps.add(1);
  }

  multiplyIC5Costs() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (this.tier <= 4 && dimension.cost.lt(this.cost)) {
        dimension.costBumps = dimension.costBumps.add(1);
      } else if (this.tier >= 5 && dimension.cost.gt(this.cost)) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
  }

  get multiplier() {
    return GameCache.antimatterDimensionFinalMultipliers[this.tier].value;
  }

  get cappedProductionInNormalChallenges() {
    if (Alpha.isRunning && Alpha.currentStage < 3) return DC.E300;
    const postBreak = (player.break && !NormalChallenge.isRunning) ||
      InfinityChallenge.isRunning ||
      Enslaved.isRunning;
    const trueHardcap = player.break2 ? (Pelle.isDoomed ? DC.ENUMMAX : LHC.breakingPoint) : DC.E9E15;
    return postBreak ? trueHardcap : DC.E315;
  }

  get productionPerSecond() {
    const tier = this.tier;
    if (Laitela.isRunning && tier > Laitela.maxAllowedDimension) return DC.D0;
    let amount = this.totalAmount;
    if (NormalChallenge(12).isRunning) {
      if (tier === 2) amount = amount.pow(1.6);
      if (tier === 4) amount = amount.pow(1.4);
      if (tier === 6) amount = amount.pow(1.2);
    }
    if (Slabdrill.coreActive) return amount.times(this.multiplier);
    let production = tier === 1 ? CMilestones.antimatterEqualizer(amount.times(this.multiplier), Tickspeed.perSecond) : amount.times(this.multiplier).times(tier === 9 ? 1 : Tickspeed.perSecond);
    if (NormalChallenge(2).isRunning) {
      production = production.times(player.chall2Pow);
    }
    if (tier === 1 && !player.compression.active) {
      if (NormalChallenge(3).isRunning) {
        production = production.times(player.chall3Pow);
      }
      if (production.gt(1)) {
        production = production.pow(Accelerators.potency.effectValue1);
      }
      if (production.gt(1)) {
        production = production.powEffectOf(ResurgenceUpgrade.synergy5);
      }
      if (production.gt(10)) {
        const log10 = production.log10();
        const eg = Currency.endgames.value;
        const endgameMult = Pelle.isDoomed ? 1 + (Math.log10(Math.min(eg, 1e6) * Math.max(Math.log2(eg + 1) - Math.log2(5e5), 1) + 1) / 80) : 1 + (Math.log10(Math.min(eg, 1e6) * Math.max(Math.log2(eg + 1) - Math.log2(5e5), 1) + 1) / 200);
        const endgameMultValue = (EndgameMilestone.endgameAntimatter.isReached && !player.disablePostReality) ? endgameMult : 1;
        const pelleOnly = Pelle.isDoomed ? DivineDimensions.conversionFormula2 * Accelerators.cosmic.effectValue2 * EndgameMastery(222).effectOrDefault(1) * SingularityMilestone.singAMDoomDilation.effectOrDefault(1) * EndgameMastery(301).effectOrDefault(DC.D1).toNumber() : 1;
        production = Decimal.pow10(Decimal.pow(log10, getAdjustedGlyphEffect("effarigantimatter") * Effects.product(EndgameMastery(101), EndgameUpgrade(15), SingularityMilestone.antimatterExponentPower, Achievement(233)) * endgameMultValue * EtherealStars.black.reward.toNumber() * pelleOnly));
      }
      if (production.gt(Decimal.pow10(1e150)) && Pelle.isDoomed && player.celestials.pelle.divinities < 1) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10.div(1e150), 0.5).times(1e150));
      }
      if (production.gt(Decimal.pow10(1e225)) && Pelle.isDoomed && player.celestials.pelle.divinities < 1) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10.div(1e225), 0.1).times(1e225));
      }
      if (production.gt(Decimal.pow10(9e15)) && Pelle.isDoomed && player.celestials.pelle.divinities >= 1) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10.div(9e15), 0.16 / Math.pow(2, player.celestials.pelle.divinities)).times(9e15));
      }
      if (production.gt(1e10) && Pelle.isDoomed) {
        const log10 = production.log10().log10();
        production = Decimal.pow10(Decimal.pow10(Decimal.pow(log10, DivinityUpgrade.divineL1U4.effectOrDefault(1) * Accelerators.cosmic.effectValue3)));
      }
      if (ResurgenceUpgrade.ipSurge.isBought && !player.disablePostReality) {
        production = production.times(gainedInfinityPoints().max(1));
      }
      if (ResurgenceUpgrade.epSurge.isBought && !player.disablePostReality) {
        production = production.times(gainedEternityPoints().max(1));
      }
      if (production.gt(Decimal.pow10(1e200)) && !Pelle.isDoomed && !player.endgame.overcharge.isRunning && !Slabdrill.isCursed) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10.div(1e200), 1 / Accelerators.emptiness.effectValue3).times(1e200));
      }
      if (production.gt(Decimal.pow10(1e260)) && !Pelle.isDoomed && !player.endgame.overcharge.isRunning && !Slabdrill.isCursed) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10.div(1e260), 0.01).times(1e260));
      }
      if (production.gt(10) && LHC.nullifiedVoidRunning) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10, 0.01));
      }
      if (production.gt(Decimal.pow10(2e99)) && Slabdrill.isCursed) {
        const log10 = production.log10();
        production = Decimal.pow10(Decimal.pow(log10.div(2e99), 0.1).times(2e99));
      }
      if (production.gt(1) && player.endgame.overcharge.isRunning) {
        const slog = production.slog();
        production = Decimal.tetrate(10, slog.times(0.75).toNumber());
      }
      if (production.gt(1) && player.endgame.overcharge.isRunning) {
        if (DivinityMilestone.powerBurst.isReached) production = production.pow(Time.thisEndgameRealTime.totalSeconds.max(1).log10().pow(0.5).div(10).add(1));
      }
      if (production.gt(1) && player.universes.current === 1) {
        const slog = production.slog();
        production = Decimal.tetrate(10, slog.times(0.9).toNumber());
      }
      if (production.gt(1) && player.universes.current === 2) {
        const slog = production.slog();
        production = Decimal.tetrate(10, slog.times(0.5).add(1).add(Currency.molecularMass.value.max(1).slog().div(2).sub(1).max(0)).toNumber());
      }
    }
    if (tier !== 1 && NormalChallenge(12).isCharged && ((player.break && !NormalChallenge.isRunning) || InfinityChallenge.isRunning || Enslaved.isRunning)) production = production.min(amount.times(this.multiplier).times(NormalChallenge(2).isRunning ? player.chall2Pow : 1));
    else production = production.min(this.cappedProductionInNormalChallenges);
    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
export const AntimatterDimension = AntimatterDimensionState.createAccessor();

export const AntimatterDimensions = {
  /**
   * @type {AntimatterDimensionState[]}
   */
  all: AntimatterDimension.index.compact(),

  reset() {
    for (const dimension of AntimatterDimensions.all) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },

  resetUpToNine() {
    for (const dimension of AntimatterDimensions.all.slice(0, 8)) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },

  resetAmountUpToTier(maxTier) {
    for (const dimension of AntimatterDimensions.all.slice(0, maxTier)) {
      dimension.resetAmount();
    }
  },

  get buyTenMultiplier() {
    if (Slabdrill.isCursed && NormalChallenge(7).isRunning) return DimBoost.totalBoosts.min(5).add(1).times(5);
    if (NormalChallenge(7).isRunning) return DC.D2.min(DimBoost.totalBoosts.div(5).add(1));

    let mult = DC.D2.plusEffectsOf(
      Achievement(141).effects.buyTenMult,
      EternityChallenge(3).reward
    );

    mult = mult.timesEffectsOf(
      InfinityUpgrade.buy10Mult,
      Achievement(58)
    ).times(getAdjustedGlyphEffect("powerbuy10"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigforgotten")).powEffectOf(InfinityUpgrade.buy10Mult.chargedEffect);
    mult = mult.pow(ImaginaryUpgrade(14).effectOrDefault(1));
    mult = mult.pow(SingularityMilestone.perPurchaseDimMult.effectOrDefault(1));

    if (Slabdrill.isCursed) mult = mult.times(20);
    if (Slabdrill.isCursed && BreakInfinityUpgrade.galaxyBoost.isBought) mult = mult.times(2);

    return mult;
  },

  get buyOoMPower() {
    return this.buyTenMultiplier.max(10).log10().log10().div(100).times(NormalChallenge(7).chargedEffect);
  },

  tick(diff, realDiff) {
    // Stop producing antimatter at Big Crunch goal because all the game elements
    // are hidden when pre-break Big Crunch button is on screen.
    const hasBigCrunchGoal = !player.break || Player.isInAntimatterChallenge;
    let pendAmount = AntimatterDimension(1).productionPerSecond;
    let amountLost = Decimal.pow(pendAmount, 0.01);
    let amountGained = amountLost.eq(0) ? DC.D0 : pendAmount.div(amountLost);
    let conversionToNull = Decimal.log10(amountLost.max(1)).pow(Decimal.log10(Decimal.log10(amountLost.max(1)).max(1)));
    if (LHC.voidRunning) {
      Currency.nullMatter.add(conversionToNull.times(diff).div(1000));
    }
    if (hasBigCrunchGoal && Currency.antimatter.gte(Player.infinityGoal)) return;

    let maxTierProduced = EternityChallenge(3).isRunning ? 3 :
      ((player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed) ? 8 : 7);
    let nextTierOffset = 1;
    if (NormalChallenge(12).isRunning) {
      maxTierProduced--;
      nextTierOffset++;
    }
    for (let tier = maxTierProduced; tier >= 1; --tier) {
      AntimatterDimension(tier + nextTierOffset).produceDimensions(
        AntimatterDimension(tier), (tier + nextTierOffset === 9) ? new Decimal(realDiff).div(10) : new Decimal(diff).div(10));
    }
    if (AntimatterDimension(1).amount.gt(0)) {
      player.requirementChecks.eternity.noAD1 = false;
    }
    if (AntimatterDimension(8).amount.gt(0) || AntimatterDimension(8).continuumAmount.gt(0)) {
      player.requirementChecks.endgame.onlyLowDims = false;
    }
    if (!LHC.voidRunning) {
      AntimatterDimension(1).produceCurrency(Currency.antimatter, diff);
    }
    if (LHC.voidRunning) {
      Currency.antimatter.add(amountGained.times(diff).div(1000));
    }
    if (NormalChallenge(12).isRunning) {
      AntimatterDimension(2).produceCurrency(Currency.antimatter, diff);
    }
    // Production may overshoot the goal on the final tick of the challenge
    if (hasBigCrunchGoal) Currency.antimatter.dropTo(Player.infinityGoal);
  }
};
