import { DimensionState } from "./dimension";

export function divineDimensionCommonMultiplier() {
  let mult = DC.D1;
  mult = mult.timesEffectsOf(DivinityUpgrade.divineL1U3, DivinityUpgrade.divineL1U6, DivinityUpgrade.divineL2U1,
    DivinityUpgrade.divineL2U9, EndgameMastery(192));
  mult = mult.times(DivinityMilestone.hadronEmpowerment.isReached ? 77 : 1);
  mult = mult.times(Accelerators.potency.effectValue3);
  mult = mult.times(Decimal.pow(7, Decimal.log10(player.celestials.pelle.divinity.divineStars.add(1).min(DC.NUMMAX))).powEffectOf(
    DivinityUpgrade.divineL3U3));
  return mult;
}

export function toggleAllDivDims() {
  const areEnabled = Autobuyer.divineDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.divineDimension(i).isActive = !areEnabled;
  }
}

class DivineDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.divine, tier);
    const COST_MULTS = [null, 1e3, 1e6, 1e10, 1e15, 1e21, 1e28, 1e36, 1e45, 1e55];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 10, 1e3, 1e6, 1e10, 1e15, 1e21, 1e28, 1e36, DC.BEMAX];
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

  get isAvailableForPurchase() {
    return DivineDimensions.canBuy() && this.isAffordable;
  }

  get isAffordable() {
    return Currency.divineMatter.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = DivineDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get productionPerSecond() {
    let production = this.amount;
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    let mult = GameCache.divineDimensionCommonMultiplier.value;
    mult = mult.times(Decimal.pow(this.powerMultiplier, Decimal.floor(this.baseAmount)));
    if (DivinityMilestone.pelleQoL.isReached && !player.disablePostReality) mult = mult.pow(1.05);
    mult = mult.pow(Accelerators.emptiness._milestones[1].effectOrDefault(1));
    mult = mult.powEffectsOf(DivinityUpgrade.divineL2U7, DivinityUpgrade.divineL3U5, DivinityUpgrade.divineL4U1.effects.matter,
      DivinityUpgrade.divineL4U3, DivinityUpgrade.divineL5U3, EndgameMastery(211), SingularityMilestone.singDivDimPower,
      DualityUpgrade(26), EndgameMastery(303));
    if (DivinityMilestone.finalRebirth.isReached && !player.disablePostReality) mult = mult.pow(1.05);
    mult = mult.pow(Achievements.powerConv(EndgameMastery(192).effectOrDefault(1)));
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
    return new Decimal(DivinityUpgrade.divineL2U8.isBought ? 17 : this._powerMultiplier).timesEffectOf(DivinityUpgrade.divineL3U2);
  }

  get purchases() {
    return this.data.baseAmount;
  }

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this.baseCost,
      baseIncrease: this.costMultiplier,
      costScale: Player.divineDimensionMultDecrease,
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
  }

  // Only ever called from manual actions
  buySingle() {
    const dimension = DivineDimension(this.tier);
    if (!this.isAvailableForPurchase) return false;

    Currency.divineMatter.purchase(this.cost);
    this.amount = this.amount.plus(1);
    this.baseAmount = this.baseAmount.plus(1);

    return true;
  }

  buyMax() {
    const dimension = DivineDimension(this.tier);
    if (!this.isAvailableForPurchase) return false;

    const maxBought = dimension.costScale.getMaxBoughtDecimal(
      Decimal.floor(dimension.baseAmount), Currency.divineMatter.value, 1
    );
    if (maxBought === null) {
      return;
    }
    let buying = maxBought.quantity;
    const bulkLeft = Infinity;
    if (buying.gt(bulkLeft)) buying = new Decimal(bulkLeft);
    if (Currency.divineMatter.gte(Decimal.pow10(maxBought.logPrice))) {
      dimension.amount = dimension.amount.plus(buying).round();
      dimension.baseAmount = dimension.baseAmount.plus(buying).round();
      if (dimension.cost.lt(DC.E9E15)) Currency.divineMatter.purchase(Decimal.pow10(maxBought.logPrice));
    }
  }
}

/**
 * @function
 * @param {number} tier
 * @return {DivineDimensionState}
 */
export const DivineDimension = DivineDimensionState.createAccessor();

export const DivineDimensions = {
  /**
   * @type {DivineDimensionState[]}
   */
  all: DivineDimension.index.compact(),

  get HARDCAP() {
    return DivinityUpgrade.divineL4U5.isBought ? new Decimal(Infinity) :
      DC.NUMMAX.pow(Decimal.log10(player.celestials.pelle.divinity.divineStars.min(DC.NUMMAX).add(1)).add(1));
  },

  get energyPerSecond() {
    const divineEnergyMults = DC.D1.timesEffectsOf(
      DivinityUpgrade.divineL1U7, DivinityUpgrade.divineL2U2, DivinityUpgrade.divineL4U1.effects.energy, EndgameMastery(221)).times(
      DivinityMilestone.hadronEmpowerment.isReached ? 77 : 1).times(Accelerators.potency.effectValue3);
    const baseEffect = DivinityUpgrade.divineL2U4.isBought ? player.records.totalDivineMatter :
      DivineDimension(1).productionPerSecond.max(1);
    return Decimal.pow(100, Decimal.log10(baseEffect).div(100).sub(1)).times(divineEnergyMults);
  },

  resetAmount() {
    Currency.divineMatter.reset();
    for (const dimension of DivineDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of DivineDimensions.all) {
      dimension.fullReset();
    }
  },

  canBuy() {
    return true;
  },

  canAutobuy() {
    return this.canBuy();
  },

  tick(realDiff) {
    if (!player.celestials.pelle.divinity.isProducingEnergy || DivinityUpgrade.divineL1U9.isBought ||
      DivinityUpgrade.divineL2U10.isBought) {
      for (let tier = 8; tier > 1; tier--) {
        DivineDimension(tier).produceDimensions(DivineDimension(tier - 1), realDiff / 10);
      }
      if (!player.celestials.pelle.divinity.isProducingEnergy || DivinityUpgrade.divineL2U10.isBought) {
        DivineDimension(1).produceCurrency(Currency.divineMatter, realDiff);
      }
    }
    if (player.celestials.pelle.divinity.isProducingEnergy || DivinityUpgrade.divineL1U8.isBought ||
      DivinityUpgrade.divineL2U10.isBought) {
      player.celestials.pelle.divinity.divineEnergy = player.celestials.pelle.divinity.divineEnergy.add(
        this.energyPerSecond.times(realDiff).div(1000).div(
        (player.celestials.pelle.divinity.isProducingEnergy || DivinityUpgrade.divineL2U10.isBought) ? 1 : 10));
    }
    player.celestials.pelle.divinity.divineMatter = player.celestials.pelle.divinity.divineMatter.min(this.HARDCAP);
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to buy single from the highest affordable new dimensions
    this.all.slice().reverse().forEach(dimension => {
      if (dimension.purchases.eq(0)) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    this.all.forEach(dimension => dimension.buyMax(false));
  },

  get conversionFormula1() {
    if (player.disablePostReality) return DC.D1;
    let logD = Decimal.log10(Decimal.log10(DivinityUpgrade.divineL2U10.isBought
      ? player.records.totalDivineMatter : Currency.divineMatter.value.max(10)));
    return Decimal.pow(Decimal.pow(logD.add(1), 1.5), Decimal.pow(logD.add(1), 1.5));
  },

  get conversionFormula2() {
    if (player.disablePostReality) return 1;
    let logD = Decimal.log10(Decimal.log10(DivinityUpgrade.divineL2U10.isBought
      ? player.records.totalDivineMatter : Currency.divineMatter.value.max(10)));
    return logD.div(10).add(1).toNumber();
  },

  get conversionFormula3() {
    if (player.disablePostReality) return 0;
    let logD = Decimal.log10(Decimal.log10(DivinityUpgrade.divineL2U10.isBought
      ? player.records.totalDivineMatter : Currency.divineMatter.value.max(10)));
    return DC.D1.sub(Decimal.pow(0.8, logD)).toNumber();
  }
};

function giveCondenseRewards(auto) {
  player.records.bestCondense.time =
    Decimal.min(player.records.bestCondense.time, player.records.thisCondense.time);
  player.records.bestCondense.realTime =
    Math.clamp(player.records.bestCondense.realTime, 1, player.records.thisCondense.realTime);

  Currency.divineStars.add(gainedDivineStars());

  const newCondenses = gainedCondenses();

  Currency.condenses.add(newCondenses);

  addCondenseTime(
    player.records.thisCondense.time,
    player.records.thisCondense.realTime,
    gainedDivineStars(),
    newCondenses
  );

  player.records.thisSupernova.bestCondensesPerMs = player.records.thisSupernova.bestCondensesPerMs.clampMin(
    newCondenses.div(Math.clampMin(33, player.records.thisCondense.realTime))
  );
  player.records.bestCondense.bestVSminSupernova =
    player.records.bestCondense.bestVSminSupernova.max(player.records.thisCondense.bestVSmin);
  player.records.thisCondense.bestVSmin = DC.D0;
}

export function resetForDivineStars(nova = false) {
  if (Slabdrill.isCursed) return;
  if (GameEnd.creditsEverClosed) return;
  if (Currency.divineMatter.lt(DC.NUMMAX) && !nova) return;
  EventHub.dispatch(GAME_EVENT.CONDENSE_RESET_BEFORE);
  if (!nova) giveCondenseRewards();
  Endgame.resetNoReward();
  if (!DivinityUpgrade.divineL2U5.isBought || nova) {
    let upgR = [];
    let min = DivinityUpgrade.divineL5U2.isBought ? 4 :
      (DivinityUpgrade.divineL4U4.isBought ? 3 : (DivinityUpgrade.divineL4U2.isBought ? 2 : 1));
    for (let upgL = 0; upgL < DivinityUpgrades.all.filter(u => u.layer > (nova ? 3 : 1) || u.layer < min).length; upgL++) {
      if (DivinityUpgrades.all.filter(u => u.layer > (nova ? 3 : 1) || u.layer < min)[upgL].isBought) {
        upgR.push(DivinityUpgrades.all.filter(u => u.layer > (nova ? 3 : 1) || u.layer < min)[upgL].id);
      }
    }
    if (!upgR.includes("divineL1U5")) upgR.push("divineL1U5");
    if (DivinityUpgrade.divineL4U2.isBought && !DivinityUpgrade.divineL4U4.isBought && nova) {
      upgR.push("divineL2U1");
      upgR.push("divineL2U2");
      upgR.push("divineL2U3");
      upgR.push("divineL2U4");
      upgR.push("divineL2U5");
    }
    player.celestials.pelle.divinityUpgrades = new Set(upgR);
    if (!DivinityUpgrade.divineL5U2.isBought && nova) player.celestials.pelle.divinityRebuyables = [0, 0, 0, 0];
  }
  DivineDimensions.fullReset();
  player.records.thisCondense.maxVM = DC.E1;
  Currency.divineMatter.reset();
  player.records.thisCondense.time = DC.D0;
  player.records.thisCondense.realTime = 0;
  player.records.totalCondenseDivineMatter = DC.E1;
  EventHub.dispatch(GAME_EVENT.CONDENSE_RESET_AFTER);
};

export function preProductionGenerateVS(diff) {
  Currency.divineStars.add(DivinityUpgrade.divineL3U4.effectOrDefault(DC.D0).times(diff).div(60000));
}

function giveSupernovaRewards(auto) {
  player.records.bestSupernova.time = Decimal.min(player.records.thisSupernova.time, player.records.bestSupernova.time);
  Currency.nebulae.add(gainedNebulae());

  const newSupernovae = gainedSupernovae();

  Currency.supernovae.add(newSupernovae);

  addSupernovaTime(
    player.records.thisSupernova.time,
    player.records.thisSupernova.realTime,
    gainedNebulae(),
    newSupernovae
  );

  player.records.bestSupernova.time =
    Decimal.min(player.records.bestSupernova.time, player.records.thisSupernova.time);
  player.records.bestSupernova.realTime =
    Math.clamp(player.records.bestSupernova.realTime, 1, player.records.thisSupernova.realTime);

  player.records.bestSupernova.bestSupernovaePerMs = player.records.bestSupernova.bestSupernovaePerMs.clampMin(
    newSupernovae.div(Math.clampMin(33, player.records.thisSupernova.realTime))
  );
  player.records.bestSupernova.bestNebminTotal =
    player.records.bestSupernova.bestNebminTotal.max(player.records.thisSupernova.bestNebmin);
}

export function supernovaResetRequest() {
  if (player.celestials.pelle.divinity.divineStars.lt(DC.NUMMAX)) return;
  if (Slabdrill.isCursed) return;
  if (GameEnd.creditsEverClosed) return;
  supernova();
}

export function supernova(force, auto, specialConditions = {}) {
  if (!force) {
    if (player.celestials.pelle.divinity.divineStars.lt(DC.NUMMAX)) return false;
    EventHub.dispatch(GAME_EVENT.SUPERNOVA_RESET_BEFORE);
    giveSupernovaRewards(auto);
  }

  resetCondenseRuns();

  Currency.divineStars.reset();
  player.records.thisCondense.bestVSmin = DC.D0;
  player.records.bestCondense.bestVSminSupernova = DC.D0;
  player.records.thisSupernova.bestNebmin = DC.D0;
  player.records.thisSupernova.bestCondensesPerMs = DC.D0;
  resetForDivineStars(true);
  Currency.divineEnergy.reset();
  player.records.thisCondense.maxVM = DC.E1;
  player.records.thisSupernova.maxVM = DC.E1;

  initializeResourcesAfterSupernova();

  EventHub.dispatch(GAME_EVENT.SUPERNOVA_RESET_AFTER);
  return true;
}

export function initializeResourcesAfterSupernova() {
  Currency.condenses.reset();
  player.records.bestCondense.time = new Decimal(999999999999);
  player.records.bestCondense.realTime = 999999999999;
  player.records.thisCondense.time = DC.D0;
  player.records.thisCondense.realTime = 0;
  player.records.thisSupernova.time = DC.D0;
  player.records.thisSupernova.realTime = 0;
  player.records.totalCondenseDivineMatter = DC.E1;
  player.records.totalSupernovaDivineMatter = DC.E1;
}

export function gainedSupernovae() {
  return DC.D1;
}
