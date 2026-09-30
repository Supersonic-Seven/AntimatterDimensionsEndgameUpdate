export const GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class Galaxy {
  static get baseRemoteStart() {
    return RealityUpgrade(21).effectOrDefault(800);
  }
  
  static get remoteStart() {
    const extraDelay = GalacticPowers.remoteGalaxyScale.isUnlocked ? GalacticPowers.remoteGalaxyScale.reward : 0;
    return (this.baseRemoteStart + Effects.sum(BreakEternityUpgrade.galaxyScaleDelay) + extraDelay) *
      (player.disablePostReality ? 1 : AlphaUnlocks.powerGalaxies.effects.buff.effectOrDefault(1));
  }

  static get remoteGalaxyStrength() {
    const reduction = GalacticPowers.remoteGalaxyPower.isUnlocked ? GalacticPowers.remoteGalaxyPower.reward : 1;
    return 1 + (0.002 * reduction);
  }

  static get requirement() {
    return this.requirementAt(player.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency, currGal = player.galaxies) {
    const pow = GlyphAlteration.isAdded("power") ? getSecondaryGlyphEffect("powerpow") : 1;
    const distantStart = Galaxy.costScalingStart;
    const scale = Galaxy.costMult;
    let base = Galaxy.baseCost.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) base = base.sub(1);

    const firstScale = Decimal.min(Galaxy.costScalingStart, Galaxy.remoteStart);

    if (currency.lt(Galaxy.requirementAt(firstScale).amount)) {
      return Decimal.max(currency.sub(base).div(scale).floor().add(1), currGal);
    }

    if (currency.lt(Galaxy.requirementAt(Galaxy.remoteStart).amount)) {
      const a = new Decimal(1);
      const b = new Decimal(scale).add(1).sub(distantStart * 2);
      const c = base.add(new Decimal(Math.pow(distantStart, 2) - distantStart - scale)).sub(currency.div(pow));
      const quad = decimalQuadraticSolution(a, b, c).floor();
      return Decimal.max(quad, currGal);
    }

    if (Galaxy.requirementAt(Galaxy.remoteStart).amount.lt(currency)) {
      let estimate = new Decimal(Decimal.log(currency.div(Galaxy.requirementAt(Galaxy.remoteStart).amount), Galaxy.remoteGalaxyStrength))
        .add(Galaxy.remoteStart).floor();
      if (Galaxy.requirementAt(estimate).amount.lte(currency) && Galaxy.requirementAt(estimate.add(1)).amount.gt(currency)) {
        return Decimal.max(estimate.add(1), currGal);
      }
      let n = 0;
      while (n < 20 && !(Galaxy.requirementAt(estimate).amount.lte(currency) && Galaxy.requirementAt(estimate.add(1)).amount.gt(currency))) {
        estimate = estimate.add(new Decimal(Decimal.log(currency.div(Galaxy.requirementAt(estimate).amount), Galaxy.remoteGalaxyStrength)));
        n++;
      }
      let x = 0;
      if (Galaxy.requirementAt(estimate).amount.lte(currency) && Galaxy.requirementAt(estimate.add(1)).amount.gt(currency)) return Decimal.max(estimate.add(1), currGal);
      if (Galaxy.requirementAt(estimate.add(1)).amount.lte(currency)) {
        while (x < 50) {
          estimate = estimate.add(1);
          x++;
        }
        return Decimal.max(estimate.add(1), currGal);
      }
      if (Galaxy.requirementAt(estimate).amount.gt(currency)) {
        while (x < 50) {
          estimate = estimate.sub(1);
          x++;
        }
        return Decimal.max(estimate.add(1), currGal);
      }
      throw new Error("A finite value for Galaxy bulk was not found.");
    }

    return new Decimal(bulkBuyBinarySearch(new Decimal(currency), {
      costFunction: x => this.requirementAt(x).amount,
      cumulative: false,
    }, player.galaxies.toNumber())).floor().add(1).max(currGal);
  }

  static requirementAt(galaxies) {
    const equivGal = Decimal.min(Galaxy.remoteStart, galaxies);
    let amount = Galaxy.baseCost.add((equivGal.times(Galaxy.costMult)));
    const type = Galaxy.typeAt(galaxies);

    if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesAfterDistant = Decimal.clampMin(equivGal.sub(galaxyCostScalingStart).add(1), 0);
      amount = amount.add(Decimal.pow(galaxiesAfterDistant, 2).add(galaxiesAfterDistant));
    }

    if (type === GALAXY_TYPE.REMOTE) {
      amount = amount.times(Decimal.pow(Galaxy.remoteGalaxyStrength, new Decimal(galaxies).sub(Galaxy.remoteStart - 1)));
    }

    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);

    if (GlyphAlteration.isAdded("power")) amount = amount.mul(getSecondaryGlyphEffect("powerpow"));

    amount = Decimal.floor(amount);
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  }

  static get costMult() {
    return Effects.min(NormalChallenge(10).isRunning ? 90 : 60, TimeStudy(42)) *
      (GalacticPowers.galaxyScaling.isUnlocked ? GalacticPowers.galaxyScaling.reward : 1) * (Slabdrill.isCursed ? 7.5 : 1);
  }

  static get baseCost() {
    return Slabdrill.isCursed ? new Decimal(650) : (NormalChallenge(10).isRunning ? new Decimal(99) : new Decimal(80));
  }

  static get requiredTier() {
    return Slabdrill.isCursed
      ? Math.max(Math.min(Math.floor((player.celestials.slabdrill.goodbyeTick - 30000) / 1000), 8), 1)
      : (NormalChallenge(10).isRunning ? 6 : 8);
  }

  static get canBeBought() {
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) return false;
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) return false;
    if ((player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) && (!Alpha.isRunning || player.antimatter.gte(DC.NUMMAX))) return false;
    return true;
  }

  static get lockText() {
    if (this.canBeBought) return null;
    if (EternityChallenge(6).isRunning) return "Locked (Eternity Challenge 6)";
    if (InfinityChallenge(7).isRunning) return "Locked (Infinity Challenge 7)";
    if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
    if (NormalChallenge(8).isRunning) return `Locked (8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension
      Autobuyer Challenge)`;
    return null;
  }

  static get costScalingStart() {
    if (SlabdrillUnlocks.galaxy.isUnlocked) return GlyphSacrifice.power.effectValue.toNumber() +
      BreakEternityUpgrade.galaxyScaleDelay.effectOrDefault(0);
    const extraDelay = Alpha.isRunning ? 0 : BreakEternityUpgrade.galaxyScaleDelay.effectOrDefault(0);
    return ((Alpha.isRunning ? AlphaUnlocks.powerGalaxies.effects.nerf.effectOrDefault(100) : 100) +
      TimeStudy(302).effectOrDefault(0) + GlyphSacrifice.power.effectValue.toNumber() + Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward,
    ) + extraDelay) * (player.disablePostReality ? 1 : AlphaUnlocks.powerGalaxies.effects.buff.effectOrDefault(1));
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (new Decimal(galaxies).gte(Galaxy.remoteStart)) {
      return GALAXY_TYPE.REMOTE;
    }
    if (EternityChallenge(5).isRunning || new Decimal(galaxies).gte(this.costScalingStart)) {
      return GALAXY_TYPE.DISTANT;
    }
    return GALAXY_TYPE.NORMAL;
  }
}

function galaxyReset() {
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);
  player.galaxies = player.galaxies.add(1);
  if ((!Achievement(143).isUnlocked || ((Pelle.isDoomed && !PelleAchievementUpgrade.achievement143.canBeApplied) &&
    !PelleUpgrade.galaxyNoResetDimboost.canBeApplied)) || (player.disablePostReality && !(Alpha.isRunning && Alpha.currentStage >= 20) &&
    !(LHC.voidRunning && NullUpgrade.limerick2.isBought))) {
    player.dimensionBoosts = new Decimal(0);
  }
  softReset(0);
  if (Notations.current === Notation.emoji) player.requirementChecks.permanent.emojiGalaxies++;
  // This is specifically reset here because the check is actually per-galaxy and not per-infinity
  player.requirementChecks.infinity.noSacrifice = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

export function manualRequestGalaxyReset(bulk) {
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return;
  if (GameEnd.creditsEverClosed) return;
  if (RealityUpgrade(7).isLockingMechanics && player.galaxies.gt(0)) {
    RealityUpgrade(7).tryShowWarningModal();
    return;
  }
  if (player.options.confirmations.antimatterGalaxy) {
    Modal.antimatterGalaxy.show({ bulk: bulk && EternityMilestone.autobuyMaxGalaxies.isReached });
    return;
  }
  requestGalaxyReset(bulk);
}

// All galaxy reset requests, both automatic and manual, eventually go through this function; therefore it suffices
// to restrict galaxy count for RUPG7's requirement here and nowhere else
export function requestGalaxyReset(bulk, limit = DC.BEMAX) {
  if (Alpha.isRunning && player.galaxies.eq(0) && Alpha.currentStage < 2) return;
  const restrictedLimit = RealityUpgrade(7).isLockingMechanics ? new Decimal(1) : limit;
  if (EternityMilestone.autobuyMaxGalaxies.isReached && bulk) return maxBuyGalaxies(restrictedLimit);
  if (player.galaxies.gte(restrictedLimit) || !Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  galaxyReset();
  if (Alpha.isRunning && player.galaxies.gte(1) && Alpha.currentStage === 2) {
    Alpha.advanceLayer();
    Alpha.quotes.galaxy.show();
  }
  if (Slabdrill.isCursed && player.celestials.slabdrill.stage === 1) {
    player.reality.glyphs.sac.power = DC.D0;
    player.reality.glyphs.sac.infinity = DC.D0;
    player.reality.glyphs.sac.replication = DC.D0;
    player.reality.glyphs.sac.time = DC.D0;
    player.reality.glyphs.sac.dilation = DC.D0;
    player.reality.glyphs.sac.effarig = DC.D0;
    player.reality.glyphs.sac.reality = DC.D0;
    Slabdrill.advanceLayer();
    Slabdrill.quotes.galaxy.show();
  }
  return true;
}

function maxBuyGalaxies(limit = DC.BEMAX) {
  if (player.galaxies.gte(limit) || !Galaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const dim = AntimatterDimension(req.tier);
  const newGalaxies = Decimal.clampMax(
    Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount)),
    limit);
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies += newGalaxies.sub(player.galaxies).toNumber();
  }
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.galaxies = newGalaxies.sub(1);
  galaxyReset();
  if (Enslaved.isRunning && player.galaxies.gt(1)) EnslavedProgress.c10.giveProgress();
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  return true;
}
