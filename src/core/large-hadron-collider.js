import { GameMechanicState, RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";

class AcceleratorMilestoneState extends GameMechanicState {

  lastChecked = false;

  get requirement() {
    return this.config.requirement;
  }

  get resource() {
    return this.config.resource;
  }

  checkMilestoneState() {
    if (this.lastChecked !== this.isUnlocked) {
      this.config.onStateChange?.();
    }
    this.lastChecked = this.isUnlocked;
  }

  get isUnlocked() {
    return this.requirement <= Accelerators[this.resource].percentage;
  }

  get isEffectActive() {
    return this.isUnlocked;
  }

  get description() {
    const d = this.config.description;
    return typeof d === "function" ? d() : d;
  }

  get formattedEffect() {
    if (this.canBeApplied && this.config.formatEffect) return this.config.formatEffect(this.effectValue);
    return false;
  }
}

class AcceleratorState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._milestones = this.config.milestones.map(x => new AcceleratorMilestoneState(x));
  }

  get fillCurrency() {
    return this.config.currency();
  }

  get canBeApplied() {
    return this.isUnlocked;
  }

  get isUnlocked() {
    return (this.fillCurrency.value.gte(this.config.unlockReq()) || this.percentage > 0) &&
      (Accelerators.all[this.config.id - 2] ? Accelerators.all[this.config.id - 2].isUnlocked : true);
  }

  get name() {
    return this.config.name;
  }

  get accelerator() {
    return player.endgame.largeHadronCollider.accelerators[this.config.key];
  }

  get totalFill() {
    return this.config.percentageToFill(this.accelerator.fill);
  }

  get amountFilled() {
    return this.accelerator.fill;
  }

  set amountFilled(value) {
    this.accelerator.fill = value;
  }

  get isActive() {
    return this.accelerator.active;
  }

  get realPercentage() {
    return this.amountFilled;
  }

  get percentage() {
    return this.realPercentage;
  }

  get milestones() {
    return this._milestones;
  }

  get description() {
    return this.config.description;
  }

  get drainResource() {
    return typeof this.config.drainResource === "function" ? this.config.drainResource() : this.config.drainResource;
  }

  get totalEffects() {
    const base1 = this.config.baseEffect1(this.effectValue1);
    const base2 = this.config.baseEffect2(this.effectValue2);
    const base3 = this.config.baseEffect3(this.effectValue3);
    return [base1, base2, base3];
  }

  get isCustomEffect() { return true; }

  get effectValue1() {
    return this.config.effects.alpha(this.percentage * 100);
  }

  get effectValue2() {
    return this.config.effects.beta(this.percentage * 100);
  }

  get effectValue3() {
    return this.config.effects.gamma(this.percentage * 100);
  }

  get maxValue() {
    return this.config.percentageToFill(1);
  }

  get isMaxed() {
    return this.percentage >= 1;
  }

  toggle() {
    const active = Accelerators.all.filter(a => a.isActive).length;
    if (!this.isActive && active === 1) GameUI.notify.error(`You can only have 1 Accelerator active at the same time!`);
    else this.accelerator.active = !this.accelerator.active;
  }

  checkMilestoneStates() {
    this.milestones.forEach(x => x.checkMilestoneState());
  }

  fill(diff) {
    // The UI removes the fill button after 100%, so we need to turn it off here
    if (this.isActive && this.isMaxed) {
      this.accelerator.active = false;
      return;
    }
    if (!this.isActive || this.isMaxed) return;
    if ((Pelle.isDoomed || Slabdrill.isCursed) && this.name === "Potency Accelerator") return;

    // Don't drain resources if you only have 1 of it.
    if (this.fillCurrency.value.lte(1)) return;
    const maxFill = LHC.acceleratorSpeed * diff / 1000;
    const pendFill = Math.min(this.amountFilled + maxFill, 1);
    const maxValue = this.config.percentage(this.fillCurrency.value);
    this.amountFilled = Math.min(pendFill, Math.max(this.amountFilled, maxValue));
    this.checkMilestoneStates();
  }
}

export const Accelerators = mapGameDataToObject(
  GameDatabase.endgame.accelerators,
  config => new AcceleratorState(config)
);

Accelerators.totalMilestones = () => Accelerators.all.flatMap(x => x.milestones).countWhere(x => x.canBeApplied);

export const LHC = {
  get hadronSpeed() {
    let firstThreeAcceleratorPercentagesSum = 0;
    let sumArray = [];
    for (let sum = 0; sum < Accelerators.all.length; sum++) {
      sumArray.push(Accelerators.all[sum].percentage * 100);
    }
    firstThreeAcceleratorPercentagesSum = sumArray.reduce(Number.sumReducer, 0);
    return 299792458 / (27000000 / Math.pow(firstThreeAcceleratorPercentagesSum, 3));
  },

  get hadronC() {
    return this.hadronSpeed / 299792458;
  },

  get acceleratorSpeed() {
    return 0.00001 * player.endgame.largeHadronCollider.powerCores;
  },

  get nextAccelerator() {
    if (!Accelerators.all.find(a => !a.isUnlocked)) return;
    return Accelerators.all.first(a => !a.isUnlocked);
  },

  get breakingPoint() {
    if (Slabdrill.isCursed) return DC.ENUMMAX;
    return Decimal.pow10(Decimal.pow10(225 + Accelerators.potency._milestones[1].effectOrDefault(0) +
      Accelerators.emptiness._milestones[2].effectOrDefault(0) + Accelerators.cosmic._milestones[2].effectOrDefault(0)));
  },

  get voidRunning() {
    return player.endgame.largeHadronCollider.void.isRunning && player.endgame.largeHadronCollider.void.mode === 0;
  },

  get nullifiedVoidRunning() {
    return player.endgame.largeHadronCollider.void.isRunning && player.endgame.largeHadronCollider.void.mode === 1;
  },

  gameLoop(diff) {
    Accelerators.all.forEach(a => a.fill(diff));
  }
};

export const CMilestones = {
  get c() {
    return LHC.hadronC;
  },

  get reachedMilestones() {
    return Math.clamp(5 - Math.ceil(Math.pow((1 - this.c) * 40 + 0.25, 0.5) - 0.5), 0, 5);
  },

  get nextMilestoneAt() {
    return 1 - (Math.pow((4 - this.reachedMilestones) + 0.5, 2) - 0.25) / 40;
  },

  tesseractEqualizer(bought, free) {
    const effectiveC = Math.clamp((this.c - 0.5) * 2, 0, 1);
    return Math.pow((Math.max(bought, 1) * Math.max(free, 1)) / Math.max(bought + free, 1), effectiveC) * (bought + free);
  },

  antimatterEqualizer(mults, tick) {
    const effectiveC = Math.clamp((this.c - 0.7) * 10/3, 0, 1);
    if (mults.times(tick).lte(0)) return DC.D0;
    return Decimal.pow(dilateMultiplier(
      Decimal.pow(mults, tick.max(1).log10()).root(
      mults.times(tick).max(1).log10()), effectiveC).max(10), mults.times(tick).log10());
  },

  tickspeedEqualizer(bought, free) {
    const effectiveC = Math.clamp((this.c - 0.85) * 20/3, 0, 1);
    return Decimal.pow(bought.max(1).times(free.max(1)).div(bought.add(free).max(1)), effectiveC).times(bought.add(free));
  },

  bhImprovement(mult) {
    const effectiveC = Math.clamp((this.c - 0.95) * 20, 0, 1);
    return mult.max(10).log10().log10().times(effectiveC).add(1);
  },

  potencyImprovement(effect) {
    const effectiveC = Math.clamp((this.c - 0.95) * 20, 0, 1);
    return effect.max(1).log10().sub(18.5).max(0).times(effectiveC).div(3).add(1);
  }
};

class PowerCoreState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.endgame.largeHadronCollider.powerCores));
    this.cachedEffectValue = new Lazy(() => player.endgame.largeHadronCollider.powerCores);
  }

  get isAffordable() {
    return player.celestials.laitela.hadrons.trueTotal >= this.cost;
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.endgame.largeHadronCollider.powerCores;
  }

  set boughtAmount(value) {
    const diff = Math.clampMin(value - player.endgame.largeHadronCollider.powerCores, 0);
    player.endgame.largeHadronCollider.powerCores = value;
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
    this.boughtAmount = this.boughtAmount + 1;
    return true;
  }

  costInv() {
    let cur = player.celestials.laitela.hadrons.trueTotal;
    return Math.floor(cur / 5 - 14);
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    let bulk = Math.floor(this.costInv());
    if (bulk < 1) return false;
    const price = this.costAfterCount(bulk - 1);
    bulk = Math.max(bulk - this.boughtAmount, 0);
    if (bulk === 0) return false;
    this.boughtAmount = this.boughtAmount + bulk;
    let i = 0;
    while (player.celestials.laitela.hadrons.trueTotal > this.costAfterCount(this.boughtAmount) &&
    i < 50 && this.boughtAmount < 9e15) {
      this.boughtAmount = this.boughtAmount + 1;
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = 1;
  }

  costAfterCount(count) {
    return 5 * count + 75;
  }
}

LHC.powerCores = new PowerCoreState();

export function enterTheVoid() {
  if (Slabdrill.isCursed || player.endgame.overcharge.isRunning || player.compression.active || player.universes.current !== 0) return;
  if (GameEnd.creditsEverClosed) return;
  player.disablePostReality = true;
  Endgame.resetNoReward();
  disChargeAllPerkUpgrades();
  disChargeAll();
  disChargeAllBreakUpgrades();
  disChargeAllEternityUpgrades();
  player.endgame.overcharge.allowComplex = false;
  AutomatorBackend.stop();
  clearCelestialRuns();
  player.endgame.largeHadronCollider.void.isRunning = true;
  recalculateAllGlyphs();
  Tab.dimensions.antimatter.show(false);
  if (NullUpgrade.ncComp.isBought) NormalChallenges.completeAll();
  if (NullUpgrade.alwaysBroken.isBought) player.break = true;
  if (NullUpgrade.icComp.isBought) InfinityChallenges.completeAll();
  if (NullUpgrade.repUnl.isBought) Replicanti.unlock(true);
  if (NullUpgrade.eterMiles.isBought) Currency.eternities.bumpTo(100);
  if (NullUpgrade.limerick3.isBought) {
    player.eternityChalls = {
      eterc1: 5,
      eterc2: 5,
      eterc3: 5,
      eterc4: 5,
      eterc5: 5,
      eterc6: 5,
      eterc7: 5,
      eterc8: 5,
      eterc9: 5,
      eterc10: 5,
      eterc11: 5,
      eterc12: 5
    };
  }
  if (NullUpgrade.limerick4.isBought) {
    if (!player.dilation.studies.includes(1)) player.dilation.studies.push(1);
  }
};

export function exitTheVoid() {
  if (Slabdrill.isCursed || player.endgame.overcharge.isRunning || player.compression.active || player.universes.current !== 0) return;
  if (GameEnd.creditsEverClosed) return;
  player.disablePostReality = false;
  Endgame.resetNoReward();
  player.endgame.overcharge.allowComplex = true;
  player.endgame.largeHadronCollider.void.isRunning = false;
};

export function enterNullifiedVoid() {
  if (Slabdrill.isCursed) return;
  if (GameEnd.creditsEverClosed) return;
  Endgame.resetNoReward();
  player.endgame.largeHadronCollider.void.isRunning = true;
};

export function exitNullifiedVoid() {
  if (Slabdrill.isCursed) return;
  if (GameEnd.creditsEverClosed) return;
  Endgame.resetNoReward();
  player.endgame.largeHadronCollider.void.isRunning = false;
};

export class NullUpgradeState extends SetPurchasableMechanicState {
  get name() {
    return this.config.name;
  }
  
  get currency() {
    return Currency.nullMatter;
  }

  get set() {
    return player.endgame.largeHadronCollider.void.upgrades;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

class RebuyableNullUpgradeState extends RebuyableMechanicState {
  get name() {
    return this.config.name;
  }
  
  get currency() {
    return Currency.nullMatter;
  }

  get boughtAmount() {
    return player.endgame.largeHadronCollider.void.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.endgame.largeHadronCollider.void.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount === this.config.maxUpgrades;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

export const NullUpgrade = mapGameDataToObject(
  GameDatabase.endgame.nullUpgrades,
  config => (config.rebuyable
    ? new RebuyableNullUpgradeState(config)
    : new NullUpgradeState(config))
);

export function getNullParticleGainPerSecond() {
  return player.antimatter.max(1).log10().div(1e15).add(1).pow(10);
}
