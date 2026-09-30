import { BitUpgradeState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const ENSLAVED_UNLOCKS = {
  FREE_TICKSPEED_SOFTCAP: {
    id: 0,
    price: TimeSpan.fromYears(new Decimal(1e35)).totalMilliseconds,
    secondaryRequirement: () => true,
    description: () => `Increase the softcap to Tickspeed upgrades from Time Dimensions by ${formatInt(1e5)}`,
  },
  RUN: {
    id: 1,
    price: TimeSpan.fromYears(new Decimal(1e40)).totalMilliseconds,
    secondaryRequirement() {
      const hasLevelRequirement = player.records.bestReality.glyphLevel.gte(5000);
      const hasRarityRequirement = strengthToRarity(player.records.bestReality.glyphStrength) >= 100;
      return hasLevelRequirement && hasRarityRequirement;
    },
    description() {
      const hasLevelRequirement = player.records.bestReality.glyphLevel.gte(5000);
      const hasRarityRequirement = strengthToRarity(player.records.bestReality.glyphStrength) >= 100;
      return `Unlock The Nameless Ones' Reality (requires ${hasLevelRequirement ? "[✓]" : "[✗]"} a level
      ${formatInt(5000)} Glyph and ${hasRarityRequirement ? "[✓]" : "[✗]"} a ${formatRarity(100)} rarity Glyph)`;
    }
  }
};

export const Enslaved = {
  displayName: "The Nameless Ones",
  possessiveName: "The Nameless Ones'",
  boostReality: false,
  BROKEN_CHALLENGES: [2, 3, 4, 5, 7, 8, 10, 11, 12],
  nextTickDiff: new Decimal(50),
  isReleaseTick: false,
  autoReleaseTick: 0,
  autoReleaseSpeed: new Decimal(0),
  glyphLevelMin: 5000,
  currentBlackHoleStoreAmountPerMs: new Decimal(0),
  tachyonNerf: 0.3,
  toggleStoreBlackHole() {
    if (!this.canModifyGameTimeStorage) return;
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring;
    player.celestials.enslaved.isStoringReal = false;
  },
  toggleStoreReal() {
    if (!this.canModifyRealTimeStorage && !this.isStoredRealTimeCapped) return;
    player.celestials.enslaved.isStoringReal = !player.celestials.enslaved.isStoringReal;
    player.celestials.enslaved.isStoring = false;
  },
  toggleAutoStoreReal() {
    if (!this.canModifyRealTimeStorage) return;
    player.celestials.enslaved.autoStoreReal = !player.celestials.enslaved.autoStoreReal;
  },
  get timeCap() {
    if (EndgameMilestone.gameSpeedUncap.isReached && !player.disablePostReality) return DC.BEMAX;
    return new Decimal(1e300);
  },
  get canModifyGameTimeStorage() {
    return Enslaved.isUnlocked && (!Pelle.isDoomed || PelleDestructionUpgrade.blackHole.canBeApplied) &&
      !BlackHoles.arePaused && !EternityChallenge(12).isRunning && !Enslaved.isRunning && !Laitela.isRunning &&
      !player.endgame.overcharge.isRunning && !player.compression.active &&
      !(player.universes.current >= 1 && (player.universes.current === 1 || player.universes.current % 2 === 0));
  },
  get canModifyRealTimeStorage() {
    return Enslaved.isUnlocked && (!Pelle.isDoomed || PelleDestructionUpgrade.blackHole.canBeApplied);
  },
  get isStoredRealTimeCapped() {
    return player.celestials.enslaved.storedReal < this.storedRealTimeCap;
  },
  // We assume that the situations where you can't modify time storage settings (of either type) are exactly the cases
  // where they have also been explicitly disabled via other game mechanics. This also reduces UI boilerplate code.
  // Note that we force time storage when auto-releasing, as not doing so caused a lot of poor usability issues
  get isStoringGameTime() {
    return this.canModifyGameTimeStorage && (this.isAutoReleasing || player.celestials.enslaved.isStoring);
  },
  get isStoringRealTime() {
    return this.canModifyRealTimeStorage && player.celestials.enslaved.isStoringReal;
  },
  get storedRealTimeEfficiency() {
    return 0.7;
  },
  get storedRealTimeCap() {
    const addedCap = Ra.unlocks.improvedStoredTime.effects.realTimeCap.effectOrDefault(0);
    return 1000 * 3600 * 8 + addedCap;
  },
  get isAutoReleasing() {
    return player.celestials.enslaved.isAutoReleasing && !BlackHoles.areNegative && (!Pelle.isDoomed || PelleCelestialUpgrade.raNameless3.canBeApplied);
  },
  storeRealTime() {
    if (Pelle.isDoomed && !PelleDestructionUpgrade.blackHole.canBeApplied) return;
    const thisUpdate = Date.now();
    const diff = Math.max(thisUpdate - player.lastUpdate, 0);
    const efficiency = this.storedRealTimeEfficiency;
    const maxTime = this.storedRealTimeCap;
    player.celestials.enslaved.storedReal += diff * efficiency;
    if (player.celestials.enslaved.storedReal > maxTime) {
      player.celestials.enslaved.isStoringReal = false;
      player.celestials.enslaved.storedReal = maxTime;
    }
    // More than 24 hours in milliseconds
    if (player.celestials.enslaved.storedReal > (24 * 60 * 60 * 1000)) SecretAchievement(46).unlock();
    player.lastUpdate = thisUpdate;
  },
  autoStoreRealTime(diffMs) {
    const maxGain = this.storedRealTimeCap - player.celestials.enslaved.storedReal;
    const used = Math.min(diffMs, Math.max(0, maxGain / this.storedRealTimeEfficiency));
    player.celestials.enslaved.storedReal += used * this.storedRealTimeEfficiency;
    player.lastUpdate += used;
    return diffMs - used;
  },
  canRelease(auto) {
    return !Enslaved.isStoringRealTime && !EternityChallenge(12).isRunning && !Laitela.isRunning && !player.endgame.overcharge.isRunning &&
      !player.compression.active && !(player.universes.current >= 1 && (player.universes.current === 1 || player.universes.current % 2 === 0)) &&
      !(Enslaved.isRunning && auto) && (!Pelle.isDoomed || PelleDestructionUpgrade.blackHole.canBeApplied);
  },
  // "autoRelease" should only be true when called with the Ra upgrade
  useStoredTime(autoRelease) {
    if (!this.canRelease(autoRelease)) return;
    const maxInversion = player.requirementChecks.reality.slowestBH <= 1e-300;
    if (ImaginaryUpgrade(24).isLockingMechanics && Ra.isRunning && maxInversion) {
      if (!autoRelease) ImaginaryUpgrade(24).tryShowWarningModal("discharge your Black Hole");
      return;
    }
    player.requirementChecks.reality.slowestBH = 1;
    let release = player.celestials.enslaved.stored;
    if (Enslaved.isRunning) {
      release = Enslaved.storedTimeInsideEnslaved(release);
      if (Time.thisReality.totalYears.add(TimeSpan.fromMilliseconds(new Decimal(release)).totalYears.gt(1))) {
        EnslavedProgress.storedTime.giveProgress();
      }
    }
    if (autoRelease) release = release.times(player.celestials.enslaved.pulseAmount);
    this.nextTickDiff = Decimal.clampMax(release, this.timeCap);
    this.isReleaseTick = true;
    // Effective gamespeed from stored time assumes a "default" 50 ms update rate for consistency
    const effectiveGamespeed = release.div(50);
    player.celestials.ra.peakGamespeed = Decimal.max(player.celestials.ra.peakGamespeed, effectiveGamespeed);
    this.autoReleaseSpeed = (release.div(player.options.updateRate)).div(player.celestials.enslaved.pulseTime);
    player.celestials.enslaved.stored = player.celestials.enslaved.stored.times(autoRelease ? 1 - player.celestials.enslaved.pulseAmount : 0);
  },
  has(info) {
    return player.celestials.enslaved.unlocks.includes(info.id);
  },
  canBuy(info) {
    return player.celestials.enslaved.stored.gte(info.price) && info.secondaryRequirement() && !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuy(info)) return false;
    if (info.id === ENSLAVED_UNLOCKS.RUN.id) this.quotes.unlockRun.show();
    player.celestials.enslaved.stored = player.celestials.enslaved.stored.sub(info.price);
    player.celestials.enslaved.unlocks.push(info.id);
    return true;
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.enslaved.run = true;
    player.celestials.enslaved.hasSecretStudy = false;
    this.feltEternity = false;

    // Re-validation needs to be done here because this code gets called after the automator attempts to start.
    // This is a special case for Nameless because it's one of the only two cases where a command becomes locked
    // again (the other being Pelle entry, which just force-stops the automator entirely).
    AutomatorData.recalculateErrors();
    if (AutomatorBackend.state.mode === AUTOMATOR_MODE.RUN && AutomatorData.currentErrors().length) {
      AutomatorBackend.stop();
      GameUI.notify.error("This Reality forbids Black Holes! (Automator stopped)");
    }

    this.quotes.startRun.show();
  },
  get isRunning() {
    return player.celestials.enslaved.run;
  },
  completeRun() {
    player.celestials.enslaved.completed = true;
    this.quotes.completeReality.show();
  },
  get isCompleted() {
    return player.celestials.enslaved.completed;
  },
  get canTickHintTimer() {
    return !EnslavedProgress.hintsUnlocked.hasProgress && Enslaved.has(ENSLAVED_UNLOCKS.RUN) && !Enslaved.isCompleted;
  },
  get isUnlocked() {
    return EffarigUnlock.eternity.isUnlocked || EndgameMilestone.celestialEarlyUnlock.isReached;
  },
  get realityBoostRatio() {
    return Math.max(1, Math.floor(player.celestials.enslaved.storedReal /
      Math.max(1000, Time.thisRealityRealTime.totalMilliseconds.toNumber())));
  },
  get canAmplify() {
    return this.realityBoostRatio > 1 && !Pelle.isDoomed && !isInCelestialReality();
  },
  storedTimeInsideEnslaved(stored) {
    if (stored.lte(1e3)) return stored;
    return Decimal.pow(10, Decimal.pow(Decimal.log10(stored.div(1e3)), 0.55)).times(1e3);
  },
  feelEternity() {
    if (this.feltEternity) {
      Modal.message.show(`You have already exposed this crack in the Reality. Time in this Eternity is being multiplied
        by your Eternity count, up to a maximum of ${formatX(1e66)}.`,
      { closeEvent: GAME_EVENT.REALITY_RESET_AFTER }, 1);
    } else {
      EnslavedProgress.feelEternity.giveProgress();
      this.feltEternity = true;
      Modal.message.show(`Time in this Eternity will be multiplied by your Eternity count,
        up to a maximum of ${formatX(1e66)}.`, { closeEvent: GAME_EVENT.REALITY_RESET_AFTER }, 1);
    }
  },
  get feltEternity() {
    return player.celestials.enslaved.feltEternity;
  },
  set feltEternity(value) {
    player.celestials.enslaved.feltEternity = value;
  },
  get nextHintCost() {
    return TimeSpan.fromYears(new Decimal(1e40 * Math.pow(3, this.hintCostIncreases))).totalMilliseconds;
  },
  get hintCostIncreases() {
    const hintTime = player.celestials.enslaved.zeroHintTime - Date.now();
    return Math.clampMin(hintTime / TimeSpan.fromDays(new Decimal(1)).totalMilliseconds.toNumber(), 0);
  },
  spendTimeForHint() {
    if (player.celestials.enslaved.stored.lt(this.nextHintCost)) return false;
    player.celestials.enslaved.stored.subtract(this.nextHintCost);
    if (Enslaved.hintCostIncreases === 0) {
      player.celestials.enslaved.zeroHintTime = Date.now() + TimeSpan.fromDays(new Decimal(1)).totalMilliseconds.toNumber();
    } else {
      player.celestials.enslaved.zeroHintTime += TimeSpan.fromDays(new Decimal(1)).totalMilliseconds.toNumber();
    }
    return true;
  },
  quotes: Quotes.enslaved,
  // Unicode f0c1.
  symbol: "\uf0c1"
};

class EnslavedProgressState extends BitUpgradeState {
  get bits() { return player.celestials.enslaved.hintBits; }
  set bits(value) { player.celestials.enslaved.hintBits = value; }

  get hasProgress() {
    return Boolean(player.celestials.enslaved.progressBits & (1 << this.id));
  }

  get hasHint() {
    return this.hasProgress || this.isUnlocked;
  }

  get hintInfo() {
    return typeof this.config.hint === "function" ? this.config.hint() : this.config.hint;
  }

  get completedInfo() {
    return typeof this.config.condition === "function" ? this.config.condition() : this.config.condition;
  }

  giveProgress() {
    // Bump the last hint time appropriately if the player found the hint
    if (this.hasHint && !this.hasProgress) {
      player.celestials.enslaved.zeroHintTime -= Math.log(2) / Math.log(3) * TimeSpan.fromDays(new Decimal(1)).totalMilliseconds.toNumber();
      GameUI.notify.success("You found a crack in The Nameless Ones' Reality!", 10000);
    }
    player.celestials.enslaved.progressBits |= (1 << this.id);
  }
}

export const EnslavedProgress = mapGameDataToObject(
  GameDatabase.celestials.enslaved.progress,
  config => new EnslavedProgressState(config)
);

export const Tesseracts = {
  get bought() {
    return player.celestials.enslaved.tesseracts;
  },

  get canBeBoughtRaw() {
    const estimate = Currency.infinityPoints.value.gt(Decimal.pow10(6e7)) ? Decimal.round(Decimal.exp(Decimal.lambertw(Decimal.ln(Decimal.pow(Decimal.log10(Currency.infinityPoints.value.add(1)).div(6e7), 2).div(Math.E)).div(Math.E))).times(Math.E).sub(1).div(2).add(3)) : Decimal.floor(Currency.infinityPoints.value.add(1).log10().div(2e7));
    const costValue = Decimal.pow10(new Decimal(2e7).times(Decimal.min(estimate, 3)).times(Decimal.max(estimate.sub(3), 1).factorial()).times(Decimal.pow(2, Decimal.max(estimate.sub(3), 0))));
    if (Currency.infinityPoints.value.gte(costValue)) return estimate;
    return estimate.sub(1);
  },

  get amountNeeded() {
    return this.canBeBoughtRaw.sub(this.bought);
  },

  get rawExtra() {
    return (this.bought * (SingularityMilestone.tesseractMultFromSingularities.effectOrDefault(1) - 1)) + Effects.sum(EndgameMastery(53));
  },

  get freeSoftcapStart() {
    return (50 * EndgameUpgrade(23).effectOrDefault(1)) * Ra.unlocks.freeTesseractIncrease.effectOrDefault(1);
  },

  get extra() {
    return Math.max(Math.max((this.rawExtra - this.freeSoftcapStart) * (1 / (1 + ((this.rawExtra - this.freeSoftcapStart) / this.freeSoftcapStart))), 0) + Math.min(this.rawExtra, this.freeSoftcapStart), Alpha.isDestroyed ? (Math.min(this.rawExtra, this.freeSoftcapStart) * (Math.log10(Math.max(this.rawExtra - this.freeSoftcapStart, 1)) + 1)) : 0);
  },

  get totalMult() {
    if (player.disablePostReality) return 1;
    return 1 * Effects.product(BreakEternityUpgrade.tesseractMultiplier);
  },

  get effectiveCount() {
    return CMilestones.tesseractEqualizer(this.bought, this.extra) * this.totalMult;
  },

  buyTesseract() {
    if (!this.canBuyTesseract) return;
    if (GameEnd.creditsEverClosed) return;
    player.celestials.enslaved.tesseracts++;
  },

  buyMaxTesseract() {
    if (!this.canBuyTesseract) return;
    if (GameEnd.creditsEverClosed) return;
    player.celestials.enslaved.tesseracts += this.amountNeeded.toNumber();
  },

  costs(index) {
    index = index + 1;
    return Decimal.pow10(new Decimal(2e7).times(Decimal.min(index, 3)).times(Decimal.max(index - 3, 1).factorial()).times(Decimal.pow(2, Decimal.max(index - 3, 0))));
  },

  get nextCost() {
    return this.costs(this.bought);
  },

  get canBuyTesseract() {
    return Enslaved.isCompleted && Currency.infinityPoints.gte(Tesseracts.nextCost) && !player.disablePostReality;
  },

  capIncrease(count = this.bought, extra = this.extra, mult = this.totalMult) {
    const totalCount = (count + extra) * mult;
    const base = totalCount < 1 ? DC.D0 : Decimal.pow(Decimal.pow(2, Octeracts.cubeBoost()), totalCount).times(250e3);
    return base.times(AlchemyResource.boundless.effectValue + 1).times((ExpansionPack.enslavedPack.isBought && !player.disablePostReality) ? 2 : 1);
  },

  get nextTesseractIncrease() {
    return this.capIncrease(this.bought + 1).sub(this.capIncrease(this.bought));
  },
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.enslaved.isOpen) Enslaved.quotes.initial.show();
});
