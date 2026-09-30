import { GameMechanicState } from "../../game-mechanics";

import { deepmergeAll } from "@/utility/deepmerge";

class SingularityMilestoneState extends GameMechanicState {
  constructor(config) {
    const effect = config.effect;
    const configCopy = deepmergeAll([{}, config]);
    configCopy.effect = () => effect(this.completions);
    super(configCopy);
    this._rawEffect = effect;
  }

  get start() {
    return this.config.start;
  }

  get repeat() {
    return this.config.repeat;
  }

  get limit() {
    return this.config.limit;
  }

  get isUnique() {
    return this.repeat.eq(0);
  }

  get isUnlocked() {
    return (!ResurgenceUpgrade.unl2.isBought && this.start.gt(DC.E1000)) ? false : Currency.singularities.gte(this.start);
  }

  get increaseThreshold() {
    return this.config.increaseThreshold;
  }

  get majorIncreaseThreshold() {
    return this.config.majorIncreaseThreshold;
  }

  nerfCompletions(completions) {
    const softcap = this.increaseThreshold;
    const bigSoftcap = this.majorIncreaseThreshold;
    if (!softcap || (completions.lt(softcap))) return completions;
    if (!bigSoftcap || ((completions.sub(softcap)).div(3).add(softcap).lt(bigSoftcap))) return (completions.sub(softcap)).div(3).add(softcap);
    return ((completions.sub(softcap)).div(3).add(softcap).sub(bigSoftcap)).cbrt().add(bigSoftcap);
  }

  unnerfCompletions(completions) {
    const softcap = this.increaseThreshold;
    const bigSoftcap = this.majorIncreaseThreshold;
    if (!softcap || (completions.lt(softcap))) return completions;
    if (!bigSoftcap || ((completions.sub(softcap)).mul(3).add(softcap).lt(bigSoftcap))) return (completions.sub(softcap)).mul(3).add(softcap);
    return ((completions.sub(bigSoftcap)).cube().add(bigSoftcap).sub(softcap)).mul(3).add(softcap);
  }

  get previousGoal() {
    if (this.isUnique) return new Decimal(1);
    if (!this.isUnlocked) return new Decimal(0);
    return Decimal.pow(this.repeat, this.unnerfCompletions(this.completions).sub(1)).times(this.start);
  }

  get nextGoal() {
    if (this.isUnique) return new Decimal(this.start);
    return Decimal.pow(this.repeat, this.unnerfCompletions(this.completions.plus(1)).sub(1)).times(this.start);
  }

  get rawCompletions() {
    if (this.isUnique) return this.isUnlocked ? new Decimal(1) : new Decimal(0);
    if (!this.isUnlocked) return new Decimal(0);
    return (new Decimal(Decimal.log10(Currency.singularities.value)).sub(Decimal.log10(this.start))).div(Decimal.log10(this.repeat)).add(1);
  }

  get completions() {
    return Decimal.min(Decimal.floor(this.nerfCompletions(this.rawCompletions)), this.limit);
  }

  get remainingSingularities() {
    return this.nextGoal.sub(Currency.singularities.value);
  }

  get progressToNext() {
    const prog = (Currency.singularities.value.sub(this.previousGoal)).div(this.nextGoal);
    return formatDecimalPercents(Decimal.clampMax(prog, 1));
  }

  get isMaxed() {
    return (this.isUnique && this.isUnlocked) || (this.completions.gte(this.limit));
  }

  get effectDisplay() {
    if (Number.isFinite) return this.config.effectFormat(this.effectValue);
    return "N/A";
  }

  get nextEffectDisplay() {
    return this.config.effectFormat(this._rawEffect(this.completions.add(1)));
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description() : this.config.description;
  }

  get canBeApplied() {
    return this.isUnlocked && (!Pelle.isDisabled("singularity") || PelleDestructionUpgrade.singularityMilestones.canBeApplied)
      && !player.disablePostReality && player.universes.current !== 2;
  }
}

export const SingularityMilestone = mapGameDataToObject(
  GameDatabase.celestials.singularityMilestones,
  config => new SingularityMilestoneState(config)
);

export const SingularityMilestones = {
  get all() {
    return player.celestials.pelle.resurgenceUpgrades.has("unl2")
      ? SingularityMilestone.all : SingularityMilestone.all.filter(m => m.start.lte(DC.E1000));
  },
  lastNotified: player.celestials.laitela.lastCheckedMilestones,

  get sorted() {
    return this.all.sort((a, b) => Decimal.compare(a.remainingSingularities, b.remainingSingularities));
  },

  sortedForCompletions(moveNewToTop) {
    const options = player.celestials.laitela.singularitySorting;

    // Sorting functions for singularity milestones, values are generally around 0 to 2ish. Should generally attempt
    // to return unique values for all milestones for the sake of stable sorting
    let sortFn;
    switch (options.sortResource) {
      case SINGULARITY_MILESTONE_SORT.SINGULARITIES_TO_NEXT:
        sortFn = m => {
          // If it's maxed, we order based on the final goal value - higher goals are sorted later
          if (m.isMaxed) return new Decimal(Decimal.log10(m.isUnique ? m.nextGoal : m.previousGoal)).div(1000).add(1);
          return new Decimal(Decimal.log10(m.remainingSingularities)).div(100);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.CURRENT_COMPLETIONS:
        // Also counts partial completion on the current step
        sortFn = m => {
          // For never-completed repeatable milestones, this is zero and will cause NaN bugs if we don't set it to 1
          const prev = Decimal.clampMin(m.previousGoal, 1);
          const part = Decimal.clamp(new Decimal(Decimal.log10(Currency.singularities.value.div(prev))).div(Decimal.log10(m.nextGoal.div(prev))), 0, 1);
          return m.completions.add(part).div(20);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.PERCENT_COMPLETIONS:
        // Orders infinite milestones based on completion count, putting them after all limited ones even if
        // they're completed
        sortFn = m => {
          const limit = Number.isFinite(m.limit) ? m.limit : 100;
          const currComp = new Decimal(Decimal.log10(Currency.singularities.value.div(m.previousGoal))).div(
            Decimal.log10(m.nextGoal.div(m.previousGoal)));
          return Decimal.clampMax((m.completions.add(currComp)).div(limit), 1).add(Number.isFinite(m.limit) ? 0 : 1);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.FINAL_COMPLETION:
        // Sorts infinite milestones as if they end at 50 steps; for any given number of completions, this
        // treats infinite milestones with larger steps as if they complete at a higher value
        sortFn = m => {
          const limit = Number.isFinite(m.limit) ? m.limit : 50;
          return new Decimal(Decimal.log10(m.config.start.times(Decimal.pow(m.config.repeat, limit - 1)))).div(100);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.MOST_RECENT:
        sortFn = m => {
          if (!m.isUnlocked) return new Decimal(Decimal.log10(m.start)).div(1000).add(1);
          // For unique milestones, previousGoal is actually 1 and nextGoal contains the completion amount
          return new Decimal(Decimal.log10(m.isUnique ? m.nextGoal : m.previousGoal)).div(100);
        };
        break;
      default:
        throw new Error("Unrecognized Singularity Milestone sorting option (order)");
    }

    // Shift the fully completed milestones to the front or back with a constant offset which should be larger
    // than the value that the sort function should ever evaluate to
    let completedVal;
    switch (options.showCompleted) {
      case COMPLETED_MILESTONES.FIRST:
        completedVal = 10;
        break;
      case COMPLETED_MILESTONES.LAST:
        completedVal = -10;
        break;
      case COMPLETED_MILESTONES.IGNORED:
        completedVal = 0;
        break;
      default:
        throw new Error("Unrecognized Singularity Milestone sorting option (completed milestones)");
    }

    // Compose the functions together; possibly reverse the final order and bring new milestones to the top
    const isNew = m => ((m.previousGoal.gt(player.celestials.laitela.lastCheckedMilestones) && moveNewToTop) ? 20 : 0);
    const compFn = m => Decimal.add(options.sortOrder ? sortFn(m).neg() : sortFn(m), isNew(m) + (m.isMaxed ? completedVal : 0));
    return this.sorted.sort((a, b) => Decimal.compare(compFn(a), compFn(b)));
  },

  get nextMilestoneGroup() {
    return this.sortedForCompletions(false).filter(m => !m.isMaxed).slice(0, 6);
  },

  get unseenMilestones() {
    const laitela = player.celestials.laitela;
    return SingularityMilestoneThresholds
      .filter(s => laitela.lastCheckedMilestones.lt(s) && Currency.singularities.gte(s));
  },

  get unnotifiedMilestones() {
    return SingularityMilestoneThresholds.filter(s => new Decimal(s).gt(new Decimal(this.lastNotified)) && Currency.singularities.gte(s));
  }
};

// Sorted list of all the values where a singularity milestone exists, used for "new milestone" styling
const SingularityMilestoneThresholds = (function() {
  return SingularityMilestones.all
    .map(m => Array.range(0, Math.min(50, m.limit))
      .filter(r => !m.increaseThreshold || new Decimal(r).lte(m.increaseThreshold) ||
        (new Decimal(r).gt(m.increaseThreshold) && ((new Decimal(r).sub(m.increaseThreshold)).toNumber() % 3) === 2))
      .map(r => m.start.times(Decimal.pow(m.repeat, r))))
    .flat(Infinity)
    .filter(n => new Decimal(n).lt(1e100))
    .sort((a, b) => Decimal.compare(new Decimal(a), new Decimal(b)));
}());

export const Singularity = {
  get cap() {
    return Decimal.pow(10, player.celestials.laitela.singularityCapIncreases).times(200);
  },

  get gainPerCapIncrease() {
    return SingularityMilestone.improvedSingularityCap.effectOrDefault(new Decimal(11)).plusEffectsOf(
      EndgameMastery(161), SingularityMilestone.singCostStepIncrease);
  },

  get singularitiesGained() {
    const entropicCondensing = (EndgameMastery(131).isBought && !player.disablePostReality)
      ? Decimal.pow(new Decimal(ImaginaryUpgrade(10).effectOrDefault(1)).add(1), Decimal.max(new Decimal(ImaginaryUpgrade(10).effectOrDefault(1)), 1))
      : new Decimal(ImaginaryUpgrade(10).effectOrDefault(0)).add(1);
    return Decimal.floor(Decimal.pow(this.gainPerCapIncrease, player.celestials.laitela.singularityCapIncreases).times(
      SingularityMilestone.singularityMult.effectOrDefault(new Decimal(1)).times(entropicCondensing).times(
      DualityUpgrade(10).effectOrDefault(1)))).times(Hadrons.singularityMultiplier).powEffectsOf(
      SingularityMilestone.divinitySingPower, SingularityMilestone.hadronEffect1Improvement, Achievement(277)).pow(
      DivinityMilestone.powerBurst.isReached ? player.records.bestEndgame.galaxies.max(10).log10().log10().sub(4).max(0).div(5).add(1).pow(3) : 1).pow(
      DivinityMilestone.serpentPower.isReached ? 2 : 1);
  },

  // Time (in seconds) to go from 0 DE to the condensing requirement
  get timePerCondense() {
    return this.cap.div(Currency.darkEnergy.productionPerSecond);
  },

  // Time (in seconds) to reach the condensing requirement from *current* DE
  get timeUntilCap() {
    return (this.cap.sub(Currency.darkEnergy.value)).div(Currency.darkEnergy.productionPerSecond);
  },

  // Total additional time auto-condense will wait after reaching the condensing requirement
  get timeDelayFromAuto() {
    return this.timePerCondense.times(SingularityMilestone.autoCondense.effectOrDefault(Infinity) - 1);
  },

  get capIsReached() {
    return DivinityMilestone.hadronEmpowerment.isReached ? true : Currency.darkEnergy.gte(this.cap);
  },

  increaseCap() {
    if (player.celestials.laitela.singularityCapIncreases.gt(5e11)) {
      player.celestial.laitela.singularityCapIncreases
        .add(Decimal.pow10(new Decimal(player.celestial.laitela.singularityCapIncreases.log(10)).sub(10).floor()));
    }
    player.celestials.laitela.singularityCapIncreases = player.celestials.laitela.singularityCapIncreases.add(1);
  },

  decreaseCap() {
    if (player.celestials.laitela.singularityCapIncreases.eq(0)) return;
    if (player.celestials.laitela.singularityCapIncreases.gt(5e11)) {
      player.celestial.laitela.singularityCapIncreases
        .sub(Decimal.pow10(new Decimal(player.celestial.laitela.singularityCapIncreases.log(10)).sub(10).floor()));
    }
    player.celestials.laitela.singularityCapIncreases = player.celestials.laitela.singularityCapIncreases.sub(1);
  },

  perform() {
    if (!this.capIsReached || (Pelle.isDoomed && !PelleDestructionUpgrade.singularityMilestones.canBeApplied)) return;

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_BEFORE);

    if (!DivinityMilestone.hadronEmpowerment.isReached) Currency.darkEnergy.reset();
    Currency.singularities.add(this.singularitiesGained);

    /*for (const quote of Laitela.quotes.all) {
      if (quote.requirement) {
        quote.show();
      }
    }*/

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_AFTER);
  }
};

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => SingularityMilestones.lastNotified = Currency.singularities.value);

EventHub.logic.on(GAME_EVENT.SINGULARITY_RESET_AFTER, () => {
  const newMilestones = SingularityMilestones.unnotifiedMilestones.length;
  if (newMilestones === 0) return;
  if (newMilestones === 1) GameUI.notify.blackHole(`You reached a Singularity milestone!`);
  else if (newMilestones > 100) GameUI.notify.blackHole(`You reached over 100 Singularity milestones!`);
  else GameUI.notify.blackHole(`You reached ${formatInt(newMilestones)} Singularity milestones!`);
  SingularityMilestones.lastNotified = Currency.singularities.value;
});
