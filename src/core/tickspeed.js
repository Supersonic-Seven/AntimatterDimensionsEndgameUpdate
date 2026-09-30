export function effectiveBaseGalaxies() {
  let alternation = Decimal.max(0, Replicanti.amount.add(1).log10().div(1e6)).times(AlchemyResource.alternation.effectValue).add(1);
  let galaxies = player.galaxies;
  if (Slabdrill.isCursed && SlabdrillUnlocks.timeStudy181.isUnlocked) {
    galaxies = galaxies.min(100).add(galaxies.sub(100).max(0).div(10));
  }
  if (!player.disablePostReality && Alpha.currentStage >= 3) galaxies = galaxies.times(alternation);
  let generatedGalaxies = GalaxyGenerator.galaxies;
  if (!player.disablePostReality && Alpha.currentStage >= 3) generatedGalaxies = generatedGalaxies.times(alternation);
  // Note that this already includes the "50% more" active path effect
  let replicantiGalaxies = Replicanti.galaxies.bought;
  if (Slabdrill.isCursed && SlabdrillUnlocks.timeStudy181.isUnlocked) {
    replicantiGalaxies = replicantiGalaxies.min(100).add(replicantiGalaxies.sub(100).max(0).div(10));
  }
  replicantiGalaxies = replicantiGalaxies.times(1 + Effects.sum(
    TimeStudy(132),
    TimeStudy(133)
  ));
  // "extra" galaxies unaffected by the passive/idle boosts come from studies 225/226 and Effarig Infinity
  replicantiGalaxies = replicantiGalaxies.add(Replicanti.galaxies.extra);
  const nonActivePathReplicantiGalaxies = Decimal.min(Replicanti.galaxies.bought,
    ReplicantiUpgrade.galaxies.value);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies = replicantiGalaxies.add(nonActivePathReplicantiGalaxies.times(Effects.sum(EternityChallenge(8).reward)));
  if (!player.disablePostReality && Alpha.currentStage >= 3) replicantiGalaxies = replicantiGalaxies.times(alternation);
  let freeGalaxies = player.dilation.totalTachyonGalaxies;
  if (Slabdrill.isCursed && SlabdrillUnlocks.timeStudy181.isUnlocked) {
    freeGalaxies = freeGalaxies.min(100).add(freeGalaxies.sub(100).max(0).div(10));
  }
  freeGalaxies = freeGalaxies.times(alternation);
  let extraGalaxies = GalacticPower.freeGalaxies;
  if (!player.disablePostReality && Alpha.currentStage >= 3) extraGalaxies = extraGalaxies.times(alternation);
  return GalacticPowers.galacticAscension.isUnlocked ?
    Decimal.max(galaxies.max(1).times(generatedGalaxies.max(1)).times(replicantiGalaxies.max(1)).times(
    freeGalaxies.max(1)).times(extraGalaxies.max(1)), 0).div(galacticInstability()) : Decimal.max(
      galaxies.add(generatedGalaxies).add(replicantiGalaxies).add(freeGalaxies).add(extraGalaxies), 0).div(
      galacticInstability());
}

export function actualBaseGalaxiesBeforeOverflow() {
  return GalacticPowers.galacticAscension.isUnlocked
    ? Replicanti.galaxies.total.max(1).times(player.galaxies.max(1)).times(player.dilation.totalTachyonGalaxies.max(1)).times(
      GalaxyGenerator.galaxies.max(1)).times(GalacticPower.freeGalaxies.max(1))
    : Replicanti.galaxies.total.add(player.galaxies).add(player.dilation.totalTachyonGalaxies).add(GalaxyGenerator.galaxies).add(
      GalacticPower.freeGalaxies);
}

export function galacticInstability() {
  const withoutGeneration = GalacticPowers.galacticAscension.isUnlocked
    ? Replicanti.galaxies.total.max(1).times(player.galaxies.max(1)).times(player.dilation.totalTachyonGalaxies.max(1)).times(
      GalacticPower.freeGalaxies.max(1))
    : Replicanti.galaxies.total.add(player.galaxies).add(player.dilation.totalTachyonGalaxies).add(GalacticPower.freeGalaxies);
  return withoutGeneration.div(DC.NUMMAX).max(1).pow(2/3);
}

export function actualBaseGalaxies() {
  return actualBaseGalaxiesBeforeOverflow().div(galacticInstability());
}

export function actualBaseGalaxiesWithoutGeneration() {
  return GalacticPowers.galacticAscension.isUnlocked
    ? actualBaseGalaxies().div(GalaxyGenerator.galaxies.max(1))
    : actualBaseGalaxies().sub(GalaxyGenerator.galaxies);
}

export function getTickSpeedMultiplier() {
  if (InfinityChallenge(3).isRunning) return DC.D1;
  if (Ra.isRunning) return DC.C1D1_1245;
  let galaxies = effectiveBaseGalaxies();
  const effects = DC.D1.timesEffectsOf(
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.galaxyBoost.chargedEffect,
    BreakInfinityUpgrade.galaxyBoost,
    TimeStudy(212),
    TimeStudy(232),
    Achievement(86),
    Achievement(178),
    Achievement(193),
    EndgameMastery(52),
    InfinityChallenge(5).reward,
    PelleUpgrade.galaxyPower,
    PelleRifts.decay.milestones[1],
    BreakInfinityUpgrade.galaxyBoost.chargedEffect
  );
  if (galaxies.lt(3)) {
    // Magic numbers are to retain balancing from before while displaying
    // them now as positive multipliers rather than negative percentages
    let baseMultiplier = DC.D1.div(1.1245);
    if (player.galaxies.eq(1)) baseMultiplier = DC.D1.div(1.11888888);
    if (player.galaxies.eq(2)) baseMultiplier = DC.D1.div(1.11267177);
    if (NormalChallenge(5).isRunning) {
      baseMultiplier = DC.D1.div(1.08);
      if (player.galaxies.eq(1)) baseMultiplier = DC.D1.div(1.07632);
      if (player.galaxies.eq(2)) baseMultiplier = DC.D1.div(1.072);
    }
    const perGalaxy = new Decimal(0.02).times(effects);
    if (Pelle.isDoomed && !PelleDestructionUpgrade.disableGalaxyNerf.canBeApplied) galaxies = galaxies.times(0.5);
    if (Slabdrill.isCursed) galaxies = galaxies.times(0.5);
    if (SlabdrillUnlocks.galaxy.isUnlocked) galaxies = galaxies.times(Slabdrill.slabPowers.galMult());

    galaxies = galaxies.times(Pelle.specialGlyphEffect.power);
    return DC.D0_01.clampMin(baseMultiplier.sub(galaxies.times(perGalaxy)));
  }
  let baseMultiplier = new Decimal(0.8);
  if (NormalChallenge(5).isRunning) baseMultiplier = new Decimal(0.83);
  galaxies = galaxies.sub(2);
  galaxies = galaxies.times(effects);
  galaxies = galaxies.times(getAdjustedGlyphEffect("cursedgalaxies"));
  galaxies = galaxies.times(getAdjustedGlyphEffect("realitygalaxies"));
  galaxies = galaxies.times(1 + ImaginaryUpgrade(9).effectOrDefault(0));
  if (Pelle.isDoomed && !PelleDestructionUpgrade.disableGalaxyNerf.canBeApplied) galaxies = galaxies.times(0.5);
  if (Pelle.isDoomed) galaxies = galaxies.timesEffectOf(EndgameMastery(51));
  if (GalacticPowers.galaxyStrength.isUnlocked) galaxies = galaxies.times(GalacticPowers.galaxyStrength.reward);
  galaxies = galaxies.timesEffectsOf(DualityUpgrade(9), DualityUpgrade(23), DualityUpgrade(24));
  if (LHC.voidRunning) galaxies = galaxies.timesEffectOf(Accelerators.cosmic._milestones[0]);
  galaxies = galaxies.timesEffectOf(ResurgenceUpgrade.synergy4);
  galaxies = galaxies.times(Pelle.specialGlyphEffect.power);
  if (Alpha.isRunning) galaxies = galaxies.times(AlphaUnlocks.firstGalaxy.effects.nerf.effectOrDefault(1));
  if (Alpha.isRunning && Alpha.currentStage >= 6) galaxies = galaxies.times(2);
  if (Slabdrill.isCursed) galaxies = galaxies.times(0.5);
  if (SlabdrillUnlocks.galaxy.isUnlocked) galaxies = galaxies.times(Slabdrill.slabPowers.galMult());
  if (Slabdrill.isCursed) galaxies = galaxies.timesEffectOf(EternityChallenge(5).reward);
  if (Slabdrill.isCursed) galaxies = galaxies.timesEffectsOf(TimeStudy(223), TimeStudy(224));
  galaxies = galaxies.times(NormalChallenge(5).chargedEffect);
  const perGalaxy = DC.D0_965;
  return perGalaxy.pow(galaxies.sub(2)).times(baseMultiplier);
}

export function buyTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return false;

  if (NormalChallenge(9).isRunning) {
    Tickspeed.multiplySameCosts();
  }
  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  Currency.antimatter.subtract(Tickspeed.cost);
  player.totalTickBought = player.totalTickBought.add(1);
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  player.requirementChecks.permanent.singleTickspeed++;
  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  GameUI.update();
  return true;
}

export function buyMaxTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return;
  let boughtTickspeed = false;

  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  if (NormalChallenge(9).isRunning) {
    const goal = Player.infinityGoal;
    let cost = Tickspeed.cost;
    while (Currency.antimatter.gt(cost) && cost.lt(goal)) {
      Tickspeed.multiplySameCosts();
      Currency.antimatter.subtract(cost);
      player.totalTickBought = player.totalTickBought.add(1);
      boughtTickspeed = true;
      cost = Tickspeed.cost;
    }
  } else {
    const purchases = Tickspeed.costScale.getMaxBoughtDecimal(player.totalTickBought, Currency.antimatter.value, 1);
    if (purchases === null) {
      return;
    }
    Currency.antimatter.subtract(Decimal.pow10(purchases.logPrice));
    player.totalTickBought = player.totalTickBought.add(purchases.quantity);
    boughtTickspeed = true;
  }

  if (boughtTickspeed) {
    player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
    if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  }
}

export function resetTickspeed() {
  player.totalTickBought = DC.D0;
  player.chall9TickspeedCostBumps = DC.D0;
}

export const Tickspeed = {

  get isUnlocked() {
    return (AntimatterDimension(2).bought.gt(0) || EternityMilestone.unlockAllND.isReached ||
      PlayerProgress.realityUnlocked() || Slabdrill.isCursed) && !Slabdrill.coreActive;
  },

  get isAvailableForPurchase() {
    return this.isUnlocked &&
      !EternityChallenge(9).isRunning &&
      player.universes.current !== 1 &&
      !Laitela.continuumActive &&
      (player.break || this.cost.lt(DC.NUMMAX));
  },

  get isAffordable() {
    return Currency.antimatter.gte(this.cost);
  },

  get multiplier() {
    return getTickSpeedMultiplier();
  },

  get current() {
    let tickspeed = Effarig.isRunning
      ? Effarig.tickspeed
      : this.baseValue.powEffectOf(DilationUpgrade.tickspeedPower);
    if (SlabdrillUnlocks.infinity.isUnlocked) tickspeed = tickspeed.pow(0.42);
    if (SlabdrillUnlocks.replicanti.isUnlocked) tickspeed = tickspeed.pow(0.42);
    tickspeed = (player.dilation.active || (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed())) ? dilatedValueOf(tickspeed) : tickspeed;
    tickspeed = player.compression.active ? compressedMultiplier(tickspeed) : tickspeed;
    if (player.endgame.overcharge.isRunning) {
      tickspeed = dilateMultiplier(tickspeed, Ascension.overchargePenalty);
    }
    return tickspeed;
  },

  get cost() {
    return this.costScale.calculateCostDecimal(player.totalTickBought.add(player.chall9TickspeedCostBumps));
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: 1000,
      baseIncrease: Slabdrill.isCursed ? (InfinityChallenge(5).isRunning ? 1000 : 2) : 10,
      costScale: Player.tickSpeedMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  },

  get continuumValue() {
    if (!this.isUnlocked || player.universes.current === 1) return DC.D0;
    return this.costScale.getContinuumValue(Currency.antimatter.value, 1).times(Laitela.matterExtraPurchaseFactor);
  },

  get baseValue() {
    return DC.E3.timesEffectsOf(
      Achievement(36),
      Achievement(45),
      Achievement(66),
      Achievement(83)
    )
      .times(getTickSpeedMultiplier().pow(this.totalUpgrades).powEffectOf(Ra.unlocks.tickspeedPower));
  },

  get totalUpgrades() {
    let boughtTickspeed;
    if (Laitela.continuumActive) boughtTickspeed = this.continuumValue;
    else boughtTickspeed = player.totalTickBought;
    return CMilestones.tickspeedEqualizer(boughtTickspeed, player.totalTickGained);
  },

  get perSecond() {
    return Decimal.divide(1000, this.current);
  },

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all) {
      if (dimension.cost.max(1).log10().floor().eq(this.cost.max(1).log10().floor())) dimension.costBumps = dimension.costBumps.add(1);
    }
  }
};


export const FreeTickspeed = {
  BASE_SOFTCAP: 300000,
  GROWTH_RATE: 6e-6,
  GROWTH_EXP: 2,
  multToNext: 1.33,

  get amount() {
    return player.totalTickGained;
  },

  get softcap() {
    let softcap = FreeTickspeed.BASE_SOFTCAP;
    if (Enslaved.has(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP) && !player.disablePostReality) {
      softcap += 100000;
    }
    if (SlabdrillUnlocks.eternityChallengeTen.isUnlocked) softcap /= 10;
    return softcap;
  },

  fromShards(shards) {
    const alphaMult = Alpha.isRunning ? AlphaUnlocks.ec11Bulk.effects.nerfB.effectOrDefault(1.33) : 1.33;
    const tickmult = Decimal.min(Effects.min(1.33, TimeStudy(171)), alphaMult).sub(1).times(
      Decimal.max(getAdjustedGlyphEffect("cursedtickspeed"), 1)).add(1);
    const logTickmult = Decimal.ln(tickmult);
    const logShards = Decimal.max(1, shards).ln();
    const uncapped = Decimal.max(0, logShards.div(logTickmult));
    const exponentIncrease = new Decimal(FreeTickspeed.GROWTH_EXP).pow(Penteracts.softcapReduction());
    if (uncapped.lte(FreeTickspeed.softcap)) {
      this.multToNext = tickmult;
      return {
        newAmount: Decimal.ceil(uncapped),
        nextShards: Decimal.pow(tickmult, Decimal.ceil(uncapped))
      };
    }
    // Log of (cost - cost up to softcap)
    const priceToCap = new Decimal(FreeTickspeed.softcap).times(logTickmult);
    // In the following we're implicitly applying the function (ln(x) - priceToCap) / logTickmult to all costs,
    // so, for example, if the cost is 1 that means it's actually exp(priceToCap) * tickmult.
    const desiredCost = logShards.sub(priceToCap).div(logTickmult);
    const costFormulaCoefficient = new Decimal(FreeTickspeed.GROWTH_RATE).div(exponentIncrease).div(logTickmult).times(
      Decimal.pow(Effects.product(EndgameMastery(103)), 2)).times(Decimal.pow(
      SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 10 : 1, 2));
    // In the following we're implicitly subtracting softcap from bought,
    // so, for example, if bought is 1 that means it's actually softcap + 1.
    // The first term (the big one) is the asymptotically more important term (since FreeTickspeed.GROWTH_EXP > 1),
    // but is small initially. The second term allows us to continue the pre-cap free tickspeed upgrade scaling
    // of tickmult per upgrade.
    const boughtToCost = bought => costFormulaCoefficient.times(Decimal.pow(
      Decimal.max(bought, 0), exponentIncrease)).add(bought);
    const derivativeOfBoughtToCost = x => new Decimal(exponentIncrease).times(costFormulaCoefficient).times(Decimal.pow(
      Decimal.max(x, 0), exponentIncrease.sub(1))).add(1);
    const newtonsMethod = bought => bought.sub(boughtToCost(bought).sub(desiredCost).div(derivativeOfBoughtToCost(bought)));
    let oldApproximation;
    let approximation = Decimal.min(
      desiredCost,
      Decimal.pow(desiredCost.div(costFormulaCoefficient), DC.D1.div(exponentIncrease))
    );
    let counter = 0;
    // The bought formula is concave upwards. We start with an over-estimate; when using newton's method,
    // this means that successive iterations are also over-etimates. Thus, we can just check for continued
    // progress with the approximation < oldApproximation check. The counter is a fallback.
    do {
      oldApproximation = approximation;
      approximation = newtonsMethod(approximation);
    } while (approximation.lt(oldApproximation) && ++counter < 100);
    const purchases = Decimal.floor(approximation);
    // This undoes the function we're implicitly applying to costs (the "+ 1") is because we want
    // the cost of the next upgrade.
    const next = Decimal.exp(priceToCap.add(boughtToCost(purchases.add(1)).times(logTickmult)));
    this.multToNext = Decimal.exp(boughtToCost(purchases.add(1)).sub(boughtToCost(purchases)).times(logTickmult));
    return {
      newAmount: purchases.add(FreeTickspeed.softcap),
      nextShards: next,
    };
  }

};
