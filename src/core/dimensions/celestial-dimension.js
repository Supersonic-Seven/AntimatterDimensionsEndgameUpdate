import { GameMechanicState, RebuyableMechanicState, SetPurchasableMechanicState } from "../game-mechanics";
import { DimensionState } from "./dimension";

export function celestialDimensionCommonMultiplier() {
  let mult = DC.D1;
  mult = mult.timesEffectsOf(EndgameUpgrade(11), CelestialEternityUpgrade.largeCDMult, EndgameMastery(191));
  mult = mult.times(Ethereal.sectorBoost);
  return mult;
}

export function toggleCelestialMatter() {
  if (DualityUpgrade(24).isLockingMechanics && !player.endgame.celestialMatterMultiplier.isActive) {
    DualityUpgrade(24).tryShowWarningModal();
    return;
  }
  const isEnabled = player.endgame.celestialMatterMultiplier.isActive;
  player.endgame.celestialMatterMultiplier.isActive = !isEnabled;
}

export function toggleAllCelDims() {
  const areEnabled = Autobuyer.celestialDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.celestialDimension(i).isActive = !areEnabled;
  }
}

class CelestialDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.celestial, tier);
    const UNLOCK_REQUIREMENTS = [
      undefined,
      DC.D1,
      DC.E1,
      DC.E2,
      DC.E4,
      DC.E10,
      DC.E30,
      DC.E100,
      DC.E300,
      DC.BEMAX
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
    const COST_MULTS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15, 1e100];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 1, 10, 100, 1e4, 1e10, 1e30, 1e100, 1e300, DC.E1000];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
  }

  get cost() {
    return this.costScale.calculateCostDecimal(Decimal.floor(this.baseAmount));
  }

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

  get cpRequirement() {
    return this._unlockRequirement;
  }

  get celestialPointRequirementReached() {
    return player.endgame.celestialPoints.gte(this.cpRequirement);
  }

  get canUnlock() {
    return this.celestialPointRequirementReached;
  }

  get isAvailableForPurchase() {
    return CelestialDimensions.canBuy() && this.isUnlocked && this.isAffordable && !this.isCapped;
  }

  get isAffordable() {
    return Currency.celestialPoints.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = CelestialDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get productionPerSecond() {
    let production = this.amount;
    return production.times(this.multiplier).times(CelestialTickspeed.baseValue);
  }

  get multiplier() {
    const tier = this.tier;
    if (SlabdrillUnlocks.dimboost.isUnlocked) return Slabdrill.power.times(
      SlabdrillUnlocks.replicanti.isUnlocked ? Ethereal.sectorBoost : 1);
    if (Slabdrill.isCursed) return DC.D1;
    let mult = GameCache.celestialDimensionCommonMultiplier.value;
    mult = mult.times(Decimal.pow(this.powerMultiplier, Decimal.floor(this.baseAmount)));
    mult = mult.powEffectsOf(SingularityMilestone.dimensionPow, Ra.unlocks.celestialDimensionPower);
    mult = mult.pow(CelestialDimensions.alphaDecayRemnant);
    mult = mult.times(CelestialDimBoost.multiplierToCDTier());
    mult = mult.timesEffectOf(CelestialInfinityUpgrade.antimatterCelestialDimBuff);
    mult = mult.powEffectsOf(ResurgenceUpgrade.synergy2, EndgameMastery(302));
    mult = mult.pow(Achievements.powerConv(EndgameMastery(191).effectOrDefault(1)));
    return mult;
  }

  get isProducing() {
    const tier = this.tier;
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    const costMult = this._costMultiplier;
    return costMult;
  }

  get powerMultiplier() {
    return new Decimal(CelestialInfinityUpgrade.celDimPurchaseBoost.effectOrDefault(this._powerMultiplier)).timesEffectOf(
      CelestialBreakInfinityUpgrade.celDimPurchaseBuff).pow(SingularityMilestone.perPurchaseDimMult.effectOrDefault(1));
  }

  get purchases() {
    return this.data.baseAmount;
  }

  get purchaseCap() {
    return player.endgame.celDimExpansion.isBroken ? new Decimal(Infinity) : DC.C2P1024;
  }

  get isCapped() {
    return this.cost.gte(this.purchaseCap);
  }

  get hardcapCPAmount() {
    return this.purchaseCap;
  }

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this.baseCost,
      baseIncrease: this.costMultiplier,
      costScale: Player.celestialDimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.amount = DC.D0;
    this.bought = DC.D0;
    this.baseAmount = DC.D0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.CELESTIAL_DIMENSION_UNLOCKED, this.tier);
    if (this.tier === 1) {
      Tab.dimensions.celestial.show();
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    const dimension = CelestialDimension(this.tier);
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;

    Currency.celestialPoints.purchase(this.cost);
    this.amount = this.amount.plus(1);
    this.baseAmount = this.baseAmount.plus(1);

    return true;
  }

  buyMax() {
    const dimension = CelestialDimension(this.tier);
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;

    let purchasesUntilHardcap = this.purchaseCap.sub(this.purchases);

    const maxBought = dimension.costScale.getMaxBoughtDecimal(
      Decimal.floor(dimension.baseAmount), Currency.celestialPoints.value, 1
    );
    if (maxBought === null) {
      return;
    }
    let buying = maxBought.quantity;
    const bulkLeft = player.endgame.celDimExpansion.isBroken ? Infinity : dimension.baseAmount.sub(dimension.costScale._purchasesBeforeScaling).max(0);
    if (buying.gt(bulkLeft)) buying = new Decimal(bulkLeft);
    if (Currency.celestialPoints.gte(Decimal.pow10(maxBought.logPrice))) {
      dimension.amount = dimension.amount.plus(buying).round();
      dimension.baseAmount = dimension.baseAmount.plus(buying).round();
      if (dimension.cost.lt(DC.E9E15)) Currency.celestialPoints.purchase(Decimal.pow10(maxBought.logPrice));
    }
  }
}

/**
 * @function
 * @param {number} tier
 * @return {CelestialDimensionState}
 */
export const CelestialDimension = CelestialDimensionState.createAccessor();

export const CelestialDimensions = {
  /**
   * @type {CelestialDimensionState[]}
   */
  all: CelestialDimension.index.compact(),
  get HARDCAP_PURCHASES() {
    return player.endgame.celDimExpansion.isBroken ? new Decimal(Infinity) : DC.C2P1024;
  },

  get SOFTCAP() {
    const base = DC.E100.timesEffectsOf(EndgameMastery(94), EndgameUpgrade(5)).times(Ethereal.sectorBoost).pow(CelestialDimensions.alphaDecayRemnant);
    return Decimal.min(base, DC.NUMMAX).times(Decimal.pow(base.div(DC.NUMMAX).max(1), 1 / CelestialDimensions.OVERFLOW_MAG)).min(DC.E9E15);
  },

  get OVERFLOW() {
    return DC.NUMMAX.timesEffectOf(DivinityUpgrade.divineL1U1);
  },

  get OVERFLOW_MAG() {
    return DC.E1.sub(Decimal.pow(player.records.totalCelMatter.add(1).log10().add(1).log10().sub(3).max(0).add(1), 1.25).sub(1)).max(1).toNumber();
  },

  get MASS_OVERFLOW() {
    return DC.E2E7;
  },

  get MASS_OVERFLOW_MAG() {
    if (DivinityMilestone.celestialSurge.isReached && !player.disablePostReality) return DC.E2.pow(Hepteracts.softcapReduction()).toNumber();
    return DC.E2.toNumber();
  },

  get softcapPow() {
    const reduction = Effects.product(EndgameMastery(84), Achievement(225));
    const extraReduction = DivinityMilestone.firstDivine.isReached && !player.disablePostReality ? 0.9 : 1;
    const moreExtraReduction = DivinityMilestone.pelleQoL.isReached && !player.disablePostReality ? 0.8 : 1;
    return Decimal.pow(10 * reduction * extraReduction * moreExtraReduction, Hepteracts.softcapReduction()).toNumber();
  },

  unlockNext() {
    if (CelestialDimension(8).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (CelestialDimension(8).isUnlocked)
      throw "All Celestial Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.unnerfedCelestialMatter.reset();
    Currency.celestialMatter.reset();
    for (const dimension of CelestialDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of CelestialDimensions.all) {
      dimension.fullReset();
    }
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES;
  },

  canBuy() {
    return true;
  },

  canAutobuy() {
    return this.canBuy();
  },

  tick(realDiff) {
    for (let tier = 8; tier > 1; tier--) {
      CelestialDimension(tier).produceDimensions(CelestialDimension(tier - 1), realDiff / 10);
    }
    CelestialDimension(1).produceCurrency(Currency.unnerfedCelestialMatter, realDiff);
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter(dimension => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions.slice().reverse().forEach(dimension => {
      if (dimension.purchases.eq(0)) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach(dimension => dimension.buyMax(false));
  },

  get alphaDecaySpeed() {
    if (player.disablePostReality) return DC.D1;
    return new Decimal(1 - DivineDimensions.conversionFormula3).times(DivinityMilestone.divineDimensions.isReached ? 0.8 : 1).timesEffectOf(
      DivinityUpgrade.divineL1U2).times(DivinityMilestone.pelleQoL.isReached ? 0.5 : 1).times(DivinityMilestone.finalRebirth.isReached ? 0.75 : 1).times(
      DivinityMilestone.ascendedSurge.isReached ? 0.5 : 1).dividedByEffectOf(Achievement(247));
  },

  get alphaDecayRemnant() {
    return Alpha.isDestroyed ? Time.thisCelestialInfinityRealTime.totalHours.plusEffectOf(CelestialInfinityUpgrade.alphaDecayStartBoost).div(
      this.alphaDecaySpeed).min(5).div(5) : DC.D1;
  },

  get conversionExponent() {
    if (SlabdrillUnlocks.dimboost.isUnlocked && !Slabdrill.coreActive) return (Slabdrill.currentStage / 100) * Effects.product(EndgameMastery(104));
    if (Slabdrill.isCursed) return 0;
    if (player.disablePostReality && !Alpha.isRunning) return 0;
    let base = CelestialInfinityUpgrade.celestialMatterConversionBuff.effectOrDefault(2);
    if (Pelle.isDoomed) base /= 10;
    let exponent = 1;
    if (base > 1) exponent *= Effects.product(EndgameMastery(104), Ra.unlocks.celestialDimensionConversionPower, EndgameMastery(261));
    base *= Effects.product(Achievement(208), Achievement(224), CelestialEternityUpgrade.conversionFormulaImprovement);
    base *= EtherealStars.yellow.reward.toNumber();
    return Math.pow(base, exponent) * (Alpha.isRunning ? Alpha.celestialMatterConversionNerf : 1);
  }
};

export function getCelestialTickSpeedMultiplier() {
  const base = new Decimal(1.05);
  const eachGalaxy = new Decimal(CelestialInfinityUpgrade.celGalaxyBuff.effectOrDefault(1.02)).sub(1).timesEffectOf(
    CelestialBreakInfinityUpgrade.celGalaxyBuff).times(
    GalacticPowers.celestialGalaxyEmpowerment.isUnlocked ? GalacticPowers.celestialGalaxyEmpowerment.reward : 1).add(1);
  const galaxies = player.endgame.celDimExpansion.galaxies;
  return base.times(eachGalaxy.pow(galaxies));
}

export function buyCelestialTickSpeed() {
  if (!CelestialTickspeed.isAvailableForPurchase || !CelestialTickspeed.isAffordable) return false;
  Currency.unnerfedCelestialMatter.subtract(CelestialTickspeed.cost);
  player.endgame.celDimExpansion.totalTickBought = player.endgame.celDimExpansion.totalTickBought.add(1);
  GameUI.update();
  return true;
}

export function buyMaxCelestialTickSpeed() {
  if (!CelestialTickspeed.isAvailableForPurchase || !CelestialTickspeed.isAffordable) return;
  let boughtTickspeed = false;

  const purchases = CelestialTickspeed.costScale.getMaxBoughtDecimal(
    player.endgame.celDimExpansion.totalTickBought, Currency.celestialMatter.value, 1);
  if (purchases === null) {
    return;
  }
  Currency.unnerfedCelestialMatter.subtract(Decimal.pow10(purchases.logPrice));
  player.endgame.celDimExpansion.totalTickBought = player.endgame.celDimExpansion.totalTickBought.add(purchases.quantity);
  boughtTickspeed = true;
}

export function resetCelestialTickspeed() {
  player.endgame.celDimExpansion.totalTickBought = DC.D0;
}

export const CelestialTickspeed = {
  get isUnlocked() {
    return Achievement(221).isUnlocked && !player.disablePostReality;
  },

  get isAvailableForPurchase() {
    return this.isUnlocked &&
      (player.endgame.celDimExpansion.isBroken || this.cost.lt(DC.NUMMAX));
  },

  get isAffordable() {
    return Currency.celestialMatter.gte(this.cost);
  },

  get multiplier() {
    return getCelestialTickSpeedMultiplier();
  },

  get current() {
    return this.baseValue;
  },

  get cost() {
    return this.costScale.calculateCostDecimal(player.endgame.celDimExpansion.totalTickBought);
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: 1000,
      baseIncrease: 10,
      costScale: Player.celestialDimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  },

  get baseValue() {
    return DC.D1.times(getCelestialTickSpeedMultiplier().pow(this.totalUpgrades));
  },

  get totalUpgrades() {
    let boughtTickspeed = player.endgame.celDimExpansion.totalTickBought;
    return new Decimal(boughtTickspeed);
  }
};

class CelestialDimBoostRequirement {
  constructor(amount) {
    this.amount = amount;
  }

  get isSatisfied() {
    const matter = Currency.celestialMatter.value;
    return matter.gte(this.amount);
  }
}

export class CelestialDimBoost {
  static get power() {
    return new Decimal(CelestialInfinityUpgrade.celDimBoostBuff.effectOrDefault(10)).timesEffectOf(
      CelestialBreakInfinityUpgrade.celDimboostBuff);
  }

  static multiplierToCDTier() {
    return CelestialDimBoost.power.pow(this.purchasedBoosts).clampMin(1);
  }

  static get maxBoosts() {
    return DC.BEMAX;
  }

  static get canBeBought() {
    if (player.disablePostReality) return false;
    if (CelestialDimBoost.purchasedBoosts.gte(this.maxBoosts)) return false;
    if (player.endgame.celestialMatter.gt(DC.NUMMAX) && !player.endgame.celDimExpansion.isBroken) return false;
    return true;
  }

  static get lockText() {
    if (CelestialDimBoost.purchasedBoosts.gte(this.maxBoosts)) {
      return null;
    }
    return null;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    const targetResets = CelestialDimBoost.purchasedBoosts.add(bulk);
    let amount = DC.E30;
    amount = amount.mul(DC.E30.pow(targetResets.sub(1)).round());
    amount = Decimal.pow10(amount.max(1).log10().times(amount.max(1).log10().div(3e13).max(1)));

    amount = Decimal.round(amount);

    return new CelestialDimBoostRequirement(amount);
  }

  static get unlockedByBoost() {
    if (CelestialDimBoost.lockText !== null) return CelestialDimBoost.lockText;

    const boostEffects = `give a ${formatX(CelestialDimBoost.power, 2, 1)} multiplier to all Dimensions`;

    const areDimensionsKept = false;
    if (areDimensionsKept) return boostEffects[0].toUpperCase() + boostEffects.substring(1);
    return `Reset your Dimensions to ${boostEffects}`;
  }

  static get purchasedBoosts() {
    return Decimal.fromDecimal(player.endgame.celDimExpansion.dimBoosts.floor());
  }

  static get totalBoosts() {
    return Decimal.floor(this.purchasedBoosts);
  }

  static get startingDimensionBoosts() {
    return DC.D0;
  }
}

// eslint-disable-next-line max-params
export function softCelestialReset(tempBulk, forcedCDReset = false, forcedCMReset = false) {
  if (Currency.celestialMatter.gt(DC.NUMMAX) && !player.endgame.celDimExpansion.isBroken) return;
  const bulk = Decimal.min(tempBulk, CelestialDimBoost.maxBoosts.sub(player.endgame.celDimExpansion.dimBoosts));
  EventHub.dispatch(GAME_EVENT.CELESTIAL_DIMBOOST_BEFORE, bulk);
  player.endgame.celDimExpansion.dimBoosts = (Decimal.max(DC.D0, player.endgame.celDimExpansion.dimBoosts.add(bulk)));
  const canKeepDimensions = CelestialEternityUpgrade.freeDimBoost.isBought;
  if (forcedCDReset || !canKeepDimensions) {
    CelestialDimensions.resetAmount();
    resetCelestialTickspeed();
  }
  const canKeepCelMatter = CelestialEternityUpgrade.freeDimBoost.isBought;
  if (!forcedCMReset && canKeepCelMatter) {
    Currency.unnerfedCelestialMatter.bumpTo(Currency.unnerfedCelestialMatter.startingValue);
    Currency.celestialMatter.bumpTo(Currency.unnerfedCelestialMatter.startingValue);
  } else {
    Currency.unnerfedCelestialMatter.reset();
    Currency.celestialMatter.reset();
  }
  EventHub.dispatch(GAME_EVENT.CELESTIAL_DIMBOOST_AFTER, bulk);
}

export function manualRequestCelestialDimensionBoost(bulk) {
  if ((Currency.celestialMatter.value.gt(DC.NUMMAX) && !player.endgame.celDimExpansion.isBroken) || !CelestialDimBoost.requirement.isSatisfied) return;
  if (!CelestialDimBoost.canBeBought) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.celestialDimensionBoost) {
    Modal.celestialDimensionBoost.show({ bulk });
    return;
  }
  requestCelestialDimensionBoost(bulk);
}

export function requestCelestialDimensionBoost(bulk) {
  if ((Currency.celestialMatter.value.gt(DC.NUMMAX) && !player.endgame.celDimExpansion.isBroken) || !CelestialDimBoost.requirement.isSatisfied) return;
  if (!CelestialDimBoost.canBeBought) return;
  if (CelestialBreakInfinityUpgrade.bulkCelDimBoosts.isBought && bulk) maxBuyCelestialDimBoosts();
  else softCelestialReset(1);
}

function maxBuyCelestialDimBoosts() {
  const req1 = CelestialDimBoost.bulkRequirement(1);
  if (!req1.isSatisfied) return;
  const req2 = CelestialDimBoost.bulkRequirement(2);
  if (!req2.isSatisfied) {
    softCelestialReset(1);
    return;
  }

  let amount = DC.E30;
  let multiplierPerDB = DC.E30;

  const cm = Currency.celestialMatter.value;
  let calcBoosts;
  calcBoosts = cm.max(1).div(amount).log(multiplierPerDB);
  calcBoosts = calcBoosts.min(DC.E12).times(calcBoosts.div(DC.E12).max(1).pow(0.5));
  
  // Add one cause (x-b)/i is off by one otherwise
  if (calcBoosts.floor().add(1).lte(CelestialDimBoost.purchasedBoosts)) return;
  calcBoosts = calcBoosts.sub(CelestialDimBoost.purchasedBoosts);
  const minBoosts = Decimal.min(DC.BEMAX, calcBoosts.floor().add(1));
  softCelestialReset(minBoosts);
}

class CelestialGalaxyRequirement {
  constructor(amount) {
    this.amount = amount;
  }

  get isSatisfied() {
    const matter = Currency.celestialMatter.value;
    return matter.gte(this.amount);
  }
}

export const CELESTIAL_GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2
};

export class CelestialGalaxy {
  static get baseRemoteStart() {
    return 800;
  }
  
  static get remoteStart() {
    return this.baseRemoteStart;
  }

  static get remoteGalaxyStrength() {
    return 1.002;
  }

  static get requirement() {
    return this.requirementAt(player.endgame.celDimExpansion.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency, currGal = player.endgame.celDimExpansion.galaxies) {
    const distantStart = CelestialGalaxy.costScalingStart;
    const scale = CelestialGalaxy.costMult;
    let base = CelestialGalaxy.baseCost;

    const firstScale = Decimal.min(CelestialGalaxy.costScalingStart, CelestialGalaxy.remoteStart);

    if (currency.lt(CelestialGalaxy.requirementAt(firstScale).amount)) {
      return Decimal.max(currency.add(1).log10().sub(base).div(scale).floor().add(1), currGal);
    }

    if (currency.lt(CelestialGalaxy.requirementAt(CelestialGalaxy.remoteStart).amount)) {
      const a = new Decimal(1);
      const b = new Decimal(scale).add(1).sub(distantStart * 2);
      const c = base.add(Decimal.pow(distantStart, 2).sub(distantStart).sub(scale)).sub(currency.add(1).log10());
      const quad = decimalQuadraticSolution(a, b, c).floor();
      return Decimal.max(quad, currGal);
    }

    if (CelestialGalaxy.requirementAt(CelestialGalaxy.remoteStart).amount.lt(currency)) {
      let estimate = new Decimal(Decimal.log(currency.add(1).log10().div(CelestialGalaxy.requirementAt(CelestialGalaxy.remoteStart).amount.add(1).log10()), CelestialGalaxy.remoteGalaxyStrength))
        .add(CelestialGalaxy.remoteStart).floor();
      if (CelestialGalaxy.requirementAt(estimate).amount.lte(currency) && CelestialGalaxy.requirementAt(estimate.add(1)).amount.gt(currency)) {
        return Decimal.max(estimate.add(1), currGal);
      }
      let n = 0;
      while (n < 20 && !(CelestialGalaxy.requirementAt(estimate).amount.lte(currency) && CelestialGalaxy.requirementAt(estimate.add(1)).amount.gt(currency))) {
        estimate = estimate.add(new Decimal(Decimal.log(currency.add(1).log10().div(CelestialGalaxy.requirementAt(estimate).amount), CelestialGalaxy.remoteGalaxyStrength)));
        n++;
      }
      let x = 0;
      if (CelestialGalaxy.requirementAt(estimate).amount.lte(currency) && CelestialGalaxy.requirementAt(estimate.add(1)).amount.gt(currency)) return Decimal.max(estimate.add(1), currGal);
      if (CelestialGalaxy.requirementAt(estimate.add(1)).amount.lte(currency)) {
        while (x < 50) {
          estimate = estimate.add(1);
          x++;
        }
        return Decimal.max(estimate.add(1), currGal);
      }
      if (CelestialGalaxy.requirementAt(estimate).amount.gt(currency)) {
        while (x < 50) {
          estimate = estimate.sub(1);
          x++;
        }
        return Decimal.max(estimate.add(1), currGal);
      }
      throw new Error("A finite value for Celestial Galaxy bulk was not found.");
    }

    return new Decimal(bulkBuyBinarySearch(new Decimal(currency.add(1).log10()), {
      costFunction: x => this.requirementAt(x).amount,
      cumulative: false,
    }, player.endgame.celDimExpansion.galaxies.toNumber())).floor().add(1).max(currGal);
  }

  static requirementAt(galaxies) {
    const equivGal = Decimal.min(CelestialGalaxy.remoteStart, galaxies);
    let amount = CelestialGalaxy.baseCost.add((equivGal.times(CelestialGalaxy.costMult)));
    const type = CelestialGalaxy.typeAt(galaxies);

    if (type === CELESTIAL_GALAXY_TYPE.DISTANT || type === CELESTIAL_GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesAfterDistant = Decimal.clampMin(equivGal.sub(galaxyCostScalingStart).add(1), 0);
      amount = amount.add(Decimal.pow(galaxiesAfterDistant, 2).add(galaxiesAfterDistant));
    }

    if (type === CELESTIAL_GALAXY_TYPE.REMOTE) {
      amount = amount.times(Decimal.pow(CelestialGalaxy.remoteGalaxyStrength, new Decimal(galaxies).sub(CelestialGalaxy.remoteStart - 1)));
    }

    amount = Decimal.pow10(amount);
    return new CelestialGalaxyRequirement(amount);
  }

  static get costMult() {
    return DC.D60;
  }

  static get baseCost() {
    return DC.D60;
  }

  static get canBeBought() {
    if (player.disablePostReality) return false;
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) return false;
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) return false;
    if (Currency.celestialMatter.value.gt(DC.NUMMAX) && !player.endgame.celDimExpansion.isBroken) return false;
    return true;
  }

  static get lockText() {
    if (this.canBeBought) return null;
    return null;
  }

  static get costScalingStart() {
    return 100;
  }

  static get type() {
    return this.typeAt(player.endgame.celDimExpansion.galaxies);
  }

  static typeAt(galaxies) {
    if (new Decimal(galaxies).gte(CelestialGalaxy.remoteStart)) {
      return CELESTIAL_GALAXY_TYPE.REMOTE;
    }
    if (new Decimal(galaxies).gte(this.costScalingStart)) {
      return CELESTIAL_GALAXY_TYPE.DISTANT;
    }
    return CELESTIAL_GALAXY_TYPE.NORMAL;
  }
}

function celestialGalaxyReset() {
  EventHub.dispatch(GAME_EVENT.CELESTIAL_GALAXY_RESET_BEFORE);
  player.endgame.celDimExpansion.galaxies = player.endgame.celDimExpansion.galaxies.add(1);
  if (!CelestialEternityUpgrade.freeDimBoost.isBought) {
    player.endgame.celDimExpansion.dimBoosts = new Decimal(CelestialInfinityUpgrade.buffedStart.effectOrDefault(0));
  }
  softCelestialReset(0);
  EventHub.dispatch(GAME_EVENT.CELESTIAL_GALAXY_RESET_AFTER);
}

export function manualRequestCelestialGalaxyReset(bulk) {
  if (!CelestialGalaxy.canBeBought || !CelestialGalaxy.requirement.isSatisfied) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.celestialGalaxy) {
    Modal.celestialGalaxy.show({ bulk: CelestialEternityUpgrade.bulkCelGalaxies.isBought && bulk });
    return;
  }
  requestCelestialGalaxyReset(bulk);
}

// All galaxy reset requests, both automatic and manual, eventually go through this function; therefore it suffices
// to restrict galaxy count for RUPG7's requirement here and nowhere else
export function requestCelestialGalaxyReset(bulk, limit = DC.BEMAX) {
  const restrictedLimit = limit;
  if (CelestialEternityUpgrade.bulkCelGalaxies.isBought && bulk) return maxBuyCelestialGalaxies(restrictedLimit);
  if (player.endgame.celDimExpansion.galaxies.gte(restrictedLimit) || !CelestialGalaxy.canBeBought ||
    !CelestialGalaxy.requirement.isSatisfied) return false;
  celestialGalaxyReset();
  return true;
}

function maxBuyCelestialGalaxies(limit = DC.BEMAX) {
  if (player.endgame.celDimExpansion.galaxies.gte(limit) || !CelestialGalaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = CelestialGalaxy.requirement;
  if (!req.isSatisfied) return false;
  const matter = Currency.celestialMatter.value;
  const newGalaxies = Decimal.clampMax(
    CelestialGalaxy.buyableGalaxies(matter),
    limit);
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.endgame.celDimExpansion.galaxies = newGalaxies.sub(1);
  celestialGalaxyReset();
  return true;
}

export function manualCelestialCrunchResetRequest() {
  if (Currency.celestialMatter.value.lt(DC.NUMMAX)) return;
  if (GameEnd.creditsEverClosed) return;
  // We show the modal under two conditions - on the first ever celestial infinity (to explain the mechanic) and
  // post-break (to show total CIP and celInfinities gained)
  if (player.options.confirmations.celestialCrunch && (player.endgame.celDimExpansion.celestialInfinities.lt(1) || player.endgame.celDimExpansion.isBroken)) {
    Modal.celestialCrunch.show();
  } else {
    celestialCrunchResetRequest();
  }
}

export function celestialCrunchResetRequest() {
  if (Currency.celestialMatter.lt(DC.NUMMAX)) return;
  if (Slabdrill.isCursed) return;
  celestialCrunchReset();
}

export function celestialCrunchReset(forced = false) {
  if (!forced && !Currency.celestialMatter.gte(DC.NUMMAX)) return;

  if (Currency.celestialMatter.gte(DC.NUMMAX)) {
    EventHub.dispatch(GAME_EVENT.CELESTIAL_CRUNCH_BEFORE);
    celestialCrunchGiveRewards();
  }

  secondSoftCelestialReset();
  EventHub.dispatch(GAME_EVENT.CELESTIAL_CRUNCH_AFTER);
}

function celestialCrunchGiveRewards() {
  celestialCrunchUpdateStatistics();

  const celestialInfinityPoints = gainedCelestialInfinityPoints();
  Currency.celestialInfinityPoints.add(celestialInfinityPoints);
  Currency.celestialInfinities.add(gainedCelestialInfinities().round());

  celestialCrunchTabChange(player.endgame.celDimExpansion.celestialInfinities.lt(1));
}

function celestialCrunchUpdateStatistics() {
  player.records.bestCelestialInfinity.bestCIPminCelestialEternity =
    player.records.bestCelestialInfinity.bestCIPminCelestialEternity.clampMin(player.records.thisCelestialInfinity.bestCIPmin);
  player.records.thisCelestialInfinity.bestCIPmin = DC.D0;

  player.records.thisCelestialEternity.bestCelestialInfinitiesPerMs = player.records.thisCelestialEternity.bestCelestialInfinitiesPerMs.clampMin(
    gainedCelestialInfinities().round().dividedBy(Math.clampMin(33, player.records.thisCelestialInfinity.realTime))
  );

  const celestialInfinityPoints = gainedCelestialInfinityPoints();

  addCelestialInfinityTime(
    player.records.thisCelestialInfinity.time,
    player.records.thisCelestialInfinity.realTime,
    celestialInfinityPoints,
    gainedCelestialInfinities().round()
  );

  player.records.bestCelestialInfinity.time =
    Decimal.min(player.records.bestCelestialInfinity.time, player.records.thisCelestialInfinity.time);
  player.records.bestCelestialInfinity.realTime =
    Math.clamp(player.records.bestCelestialInfinity.realTime, 1, player.records.thisCelestialInfinity.realTime);
}

function celestialCrunchTabChange(firstCelestialInfinity) {
  const earlyGame = player.records.bestCelestialInfinity.time.gt(60000) && !player.endgame.celDimExpansion.isBroken;

  if (firstCelestialInfinity) {
    Tab.endgame.celestialInfinityUpgrades.show();
  } else if (earlyGame) {
    Tab.dimensions.celestial.show();
  }
}

export function secondSoftCelestialReset() {
  Endgame.resetNoReward();
  player.endgame.celDimExpansion.dimBoosts = new Decimal(CelestialInfinityUpgrade.buffedStart.effectOrDefault(0));
  player.endgame.celDimExpansion.galaxies = CelestialInfinityUpgrade.buffedStart.isBought ? DC.D2 : DC.D0;
  player.records.thisCelestialInfinity.maxCM = DC.D0;
  Currency.unnerfedCelestialMatter.reset();
  Currency.celestialMatter.reset();
  softCelestialReset(0, true, true);
  player.records.thisCelestialInfinity.time = DC.D0;
  player.records.thisCelestialInfinity.realTime = 0;
  player.records.totalCelestialInfinityCelMatter = DC.E1;
}

export function preProductionGenerateCIP(diff) {
  if (CelestialInfinityUpgrade.cipGen.isBought) {
    const genPeriod = Time.bestCelestialInfinityRealTime.totalMilliseconds.clampMin(1e-100).times(10);
    let genCount;
    if (new Decimal(diff).gte(DC.E100)) {
      genCount = Decimal.div(diff, genPeriod);
    } else {
      // Partial progress (fractions from 0 to 1) are stored in player.endgame.celDimExpansion.partCelestialInfinityPoint
      const diffnum = Decimal.clamp(new Decimal(diff), 1e-300, 1e300);
      player.endgame.celDimExpansion.partCelestialInfinityPoint = player.endgame.celDimExpansion.partCelestialInfinityPoint.add(diffnum.div(genPeriod.clampMax(1e300)));
      genCount = Decimal.floor(player.endgame.celDimExpansion.partCelestialInfinityPoint);
      player.endgame.celDimExpansion.partCelestialInfinityPoint = player.endgame.celDimExpansion.partCelestialInfinityPoint.sub(genCount);
    }
    let gainedPerGen = player.records.bestCelestialInfinity.realTime >= 999999999999 ? DC.D0 : GameCache.totalCIPMult.value;
    const gainedThisTick = new Decimal(genCount).times(gainedPerGen);
    if (Decimal.isFinite(gainedThisTick)) Currency.celestialInfinityPoints.add(gainedThisTick);
  }
  Currency.celestialInfinityPoints.add(CelestialBreakInfinityUpgrade.cipGen.effectOrDefault(DC.D0).times(diff).div(60000));
}

export function totalCIPMult() {
  let cipMult = DC.D1
    .timesEffectsOf(
      CelestialInfinityUpgrade.cipMult
    );
  return cipMult;
}

class CelestialInfinityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.celestialInfinityPoints;
  }

  get set() {
    return player.endgame.celDimExpansion.celestialInfinityUpgrades;
  }

  get isEffectActive() {
    return !player.disablePostReality && this.isBought;
  }
}

class CIPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.endgame.celDimExpansion.cipMultUpgrades));
    this.cachedEffectValue = new Lazy(() => Decimal.round(DC.D2.pow(player.endgame.celDimExpansion.cipMultUpgrades)));
  }

  get isAffordable() {
    return Currency.celestialInfinityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.endgame.celDimExpansion.cipMultUpgrades;
  }

  set boughtAmount(value) {
    const diff = Decimal.clampMin(value.sub(player.endgame.celDimExpansion.cipMultUpgrades), 0);
    player.endgame.celDimExpansion.cipMultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.celestialInfinityPoints.subtract(this.cost);
    this.boughtAmount = this.boughtAmount.add(1);
    return true;
  }

  costInv() {
    let cur = Currency.celestialInfinityPoints.value.max(1);
    return Decimal.floor(cur.div(10).max(1 / 10).log10().add(1));
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    let bulk = Decimal.floor(this.costInv());
    if (bulk.lt(1)) return false;
    const price = this.costAfterCount(bulk.sub(1));
    bulk = Decimal.max(bulk.sub(this.boughtAmount), 0);
    if (bulk.eq(0)) return false;
    Currency.celestialInfinityPoints.subtract(price);
    this.boughtAmount = this.boughtAmount.add(bulk);
    let i = 0;
    while (Currency.celestialInfinityPoints.gt(this.costAfterCount(this.boughtAmount)) &&
    i < 50 && this.boughtAmount.lte(9e15)) {
      this.boughtAmount = this.boughtAmount.add(1);
      Currency.celestialInfinityPoints.subtract(this.costAfterCount(this.boughtAmount.sub(1)));
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = DC.D0;
  }

  costAfterCount(count) {
    return Decimal.pow10(count).times(10);
  }
}

export const CelestialInfinityUpgrade = mapGameDataToObject(
  GameDatabase.endgame.celDimExpansion.celestialInfinityUpgrades,
  config => new CelestialInfinityUpgradeState(config)
);

CelestialInfinityUpgrade.cipMult = new CIPMultiplierState();

export class CelestialBreakInfinityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.celestialInfinityPoints;
  }

  get set() {
    return player.endgame.celDimExpansion.celestialInfinityUpgrades;
  }

  get isEffectActive() {
    return !player.disablePostReality && this.isBought;
  }
}

class RebuyableCelestialBreakInfinityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.celestialInfinityPoints;
  }

  get boughtAmount() {
    return player.endgame.celDimExpansion.celestialInfinityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.endgame.celDimExpansion.celestialInfinityRebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount === this.config.maxUpgrades;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

export const CelestialBreakInfinityUpgrade = mapGameDataToObject(
  GameDatabase.endgame.celDimExpansion.celestialBreakUpgrades,
  config => (config.rebuyable
    ? new RebuyableCelestialBreakInfinityUpgradeState(config)
    : new CelestialBreakInfinityUpgradeState(config))
);

function giveCelestialEternityRewards(auto) {
  player.records.bestCelestialEternity.time = Decimal.min(player.records.thisCelestialEternity.time, player.records.bestCelestialEternity.time);
  Currency.celestialEternityPoints.add(gainedCelestialEternityPoints());

  const newCelestialEternities = gainedCelestialEternities();

  Currency.celestialEternities.add(newCelestialEternities);

  addCelestialEternityTime(
    player.records.thisCelestialEternity.time,
    player.records.thisCelestialEternity.realTime,
    gainedCelestialEternityPoints(),
    newCelestialEternities
  );

  player.records.bestCelestialEternity.time =
    Decimal.min(player.records.bestCelestialEternity.time, player.records.thisCelestialEternity.time);
  player.records.bestCelestialEternity.realTime =
    Math.clamp(player.records.bestCelestialEternity.realTime, 1, player.records.thisCelestialEternity.realTime);

  player.records.thisCelestialReality.bestCelestialEternitiesPerMs = player.records.thisCelestialReality.bestCelestialEternitiesPerMs.clampMin(
    newCelestialEternities.div(Math.clampMin(33, player.records.thisCelestialEternity.realTime))
  );
  player.records.bestCelestialEternity.bestCEPminCelestialReality =
    player.records.bestCelestialEternity.bestCEPminCelestialReality.max(player.records.thisCelestialEternity.bestCEPmin);
}

export function celestialEternityResetRequest() {
  if (player.endgame.celDimExpansion.celestialInfinityPoints.lt(DC.NUMMAX)) return;
  if (Slabdrill.isCursed) return;
  if (GameEnd.creditsEverClosed) return;
  askCelestialEternityConfirmation();
}

export function celestialEternity(force, auto, specialConditions = {}) {
  if (!force) {
    if (player.endgame.celDimExpansion.celestialInfinityPoints.lt(DC.NUMMAX)) return false;
    EventHub.dispatch(GAME_EVENT.CELESTIAL_ETERNITY_RESET_BEFORE);
    giveCelestialEternityRewards(auto);
  }

  initializeResourcesAfterCelestialEternity();

  if (!CelestialEternityUpgrade.startBreak.isBought) {
    player.endgame.celDimExpansion.isBroken = false;
    player.endgame.celDimExpansion.isBreakUnlocked = false;
  }

  resetCelestialInfinityRuns();

  Currency.celestialInfinityPoints.reset();
  player.records.thisCelestialInfinity.bestCIPmin = DC.D0;
  player.records.bestCelestialInfinity.bestCIPminCelestialEternity = DC.D0;
  player.records.thisCelestialEternity.bestCEPmin = DC.D0;
  player.records.thisCelestialEternity.bestCelestialInfinitiesPerMs = DC.D0;
  resetCelestialTickspeed();
  playerCelestialInfinityUpgradesOnReset();
  secondSoftCelestialReset();
  player.records.thisCelestialInfinity.maxCM = DC.D0;
  player.records.thisCelestialEternity.maxCM = DC.D0;

  EventHub.dispatch(GAME_EVENT.CELESTIAL_ETERNITY_RESET_AFTER);
  return true;
}

export function initializeResourcesAfterCelestialEternity() {
  Currency.celestialInfinities.reset();
  player.records.bestCelestialInfinity.time = new Decimal(999999999999);
  player.records.bestCelestialInfinity.realTime = 999999999999;
  player.records.thisCelestialInfinity.time = DC.D0;
  player.records.thisCelestialInfinity.realTime = 0;
  player.endgame.celDimExpansion.dimensionBoosts = (false) ? DC.D4 : DC.D0;
  player.endgame.celDimExpansion.galaxies = (false) ? DC.D2 : DC.D0;
  player.endgame.celDimExpansion.partCelestialInfinityPoint = DC.D0;
  player.endgame.celDimExpansion.partCelestialInfinitied = 0;
  player.endgame.celDimExpansion.cipMultUpgrades = DC.D0;
  player.records.thisCelestialEternity.time = DC.D0;
  player.records.thisCelestialEternity.realTime = 0;
  player.records.totalCelestialInfinityCelMatter = DC.D0;
  player.records.totalCelestialEternityCelMatter = DC.D0;
}

function askCelestialEternityConfirmation() {
  if (player.options.confirmations.celestialEternity) {
    Modal.celestialEternity.show();
  } else {
    celestialEternity();
  }
}

export function gainedCelestialEternities() {
  return DC.D1;
}

class CelestialEternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.celestialEternityPoints;
  }

  get set() {
    return player.endgame.celDimExpansion.celestialEternityUpgrades;
  }

  get isEffectActive() {
    return !player.disablePostReality && this.isBought;
  }
}

class RebuyableCelestialEternityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.celestialEternityPoints;
  }

  get boughtAmount() {
    return player.endgame.celDimExpansion.celestialEternityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.endgame.celDimExpansion.celestialEternityRebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount === this.config.maxUpgrades;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

class CEPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.endgame.celDimExpansion.cepMultUpgrades));
    this.cachedEffectValue = new Lazy(() => DC.D5.pow(player.endgame.celDimExpansion.cepMultUpgrades));
  }

  get isAffordable() {
    return Currency.celestialEternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.endgame.celDimExpansion.cepMultUpgrades;
  }

  set boughtAmount(value) {
    const diff = Decimal.clampMin(value.sub(player.endgame.celDimExpansion.cepMultUpgrades), 0);
    player.endgame.celDimExpansion.cepMultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.celestialEternityPoints.subtract(this.cost);
    this.boughtAmount = this.boughtAmount.add(1);
    return true;
  }

  costInv() {
    let cur = Currency.celestialEternityPoints.value.max(1);
    return Decimal.floor(cur.div(500).max(1).log(50).add(1));
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    let bulk = Decimal.floor(this.costInv());
    if (bulk.lt(1)) return false;
    const price = this.costAfterCount(bulk.sub(1));
    bulk = Decimal.max(bulk.sub(this.boughtAmount), 0);
    if (bulk.eq(0)) return false;
    Currency.celestialEternityPoints.subtract(price);
    this.boughtAmount = this.boughtAmount.add(bulk);
    let i = 0;
    while (Currency.celestialEternityPoints.gt(this.costAfterCount(this.boughtAmount)) &&
    i < 50 && this.boughtAmount.lte(9e15)) {
      this.boughtAmount = this.boughtAmount.add(1);
      Currency.celestialEternityPoints.subtract(this.costAfterCount(this.boughtAmount.sub(1)));
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = DC.D0;
  }

  costAfterCount(count) {
    return Decimal.pow(50, count).times(500);
  }
}

export const CelestialEternityUpgrade = mapGameDataToObject(
  GameDatabase.endgame.celDimExpansion.celestialEternityUpgrades,
  config => (config.rebuyable
    ? new RebuyableCelestialEternityUpgradeState(config)
    : new CelestialEternityUpgradeState(config))
);

CelestialEternityUpgrade.cepMult = new CEPMultiplierState();

class CelestialEternityPlusUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.celestialEternityPoints;
  }

  get set() {
    return player.endgame.celDimExpansion.celestialEternityPlusUpgrades;
  }

  get isEffectActive() {
    return !player.disablePostReality && this.isBought;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

export const CelestialEternityPlusUpgrade = mapGameDataToObject(
  GameDatabase.endgame.celDimExpansion.celestialEternityPlusUpgrades,
  config => (config.rebuyable
    ? new CelestialEternityPlusUpgradeState(config)
    : new CelestialEternityPlusUpgradeState(config))
);
