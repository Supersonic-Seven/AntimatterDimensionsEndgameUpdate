import { GameMechanicState } from "./game-mechanics";

export function updateNormalAndInfinityChallenges(diff) {
  if (NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning) {
    if (Slabdrill.isCursed || AntimatterDimension(2).amount.neq(0)) {
      Currency.matter.bumpTo(1);
      // These caps are values which occur at approximately e308 IP
      const cappedBase = 1.03 + Decimal.clampMax(DimBoost.totalBoosts, 400).toNumber() / 200 +
        Decimal.clampMax(player.galaxies, 100).toNumber() / 100;
      Currency.matter.multiply(Decimal.pow(cappedBase, new Decimal(diff).div(20)));
    }
    if (Currency.matter.gt(Currency.antimatter.value) && NormalChallenge(11).isRunning && !Player.canCrunch) {
      const values = [Currency.antimatter.value, Currency.matter.value];
      softReset(0, true, true);
      Modal.message.show(`Your ${format(values[0], 2, 2)} ${player.universes.current === 2 ? "matter" : "antimatter"}
        was annihilated by ${format(values[1], 2, 2)}
        ${player.universes.current === 2 ? "antimatter" : "matter"}.`, { closeEvent: GAME_EVENT.BIG_CRUNCH_AFTER }, 1);
    }
  }

  if (NormalChallenge(3).isRunning) {
    player.chall3Pow = player.chall3Pow.times(DC.D1_00038.pow(new Decimal(diff).div(100))).clampMax(DC.NUMMAX);
  }

  if (NormalChallenge(2).isRunning || (NormalChallenge(12).isRunning && Slabdrill.isCursed)) {
    player.chall2Pow = Decimal.min(new Decimal(player.chall2Pow).plus(new Decimal(diff).div(100).div(1800)), 1).toNumber();
  }

  if (InfinityChallenge(2).isRunning) {
    if (player.ic2Count >= 400) {
      if (AntimatterDimension(8).amount.gt(0) || Slabdrill.isCursed) {
        sacrificeReset();
        if (Slabdrill.isCursed) {
          softReset(0, true, true);
        }
      }
      player.ic2Count %= 400;
    } else {
      // Do not change to diff, as this may lead to a sacrifice softlock with high gamespeed
      player.ic2Count += Math.clamp(Date.now() - player.lastUpdate, 1, 21600000);
    }
  }
}

class NormalChallengeState extends GameMechanicState {
  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get isRunning() {
    const isPartOfIC1 = this.id !== 9 && this.id !== 12;
    return player.challenge.normal.current === this.id || (isPartOfIC1 && InfinityChallenge(1).isRunning);
  }

  get isOnlyActiveChallenge() {
    return player.challenge.normal.current === this.id;
  }

  get isUnlocked() {
    if (PlayerProgress.eternityUnlocked() && (!Alpha.isRunning || Currency.eternities.gt(0)) &&
      (!Slabdrill.isCursed || Currency.eternities.gt(0))) return true;
    if (this.id === 0) return true;
    const ip = (Alpha.isRunning || Slabdrill.isCursed)
      ? GameDatabase.challenges.normal[this.id - 1].alphaLockedAt : GameDatabase.challenges.normal[this.id - 1].lockedAt;
    return Currency.infinitiesTotal.gte(ip);
  }

  get isCharged() {
    return player.endgame.overcharge.charged.complex.has(this.id) && player.endgame.overcharge.allowComplex;
  }

  get chargedEffect() {
    if (this.isCharged) return this.config.charged.effect();
    return DC.D1;
  }

  tryCharge() {
    if (Math.min(player.endgame.overcharge.completions.chall, 12) >= this.id) {
      player.endgame.overcharge.charged.complex.add(this.id);
    }
  }

  get isDisabled() {
    return Pelle.isDoomed;
  }

  get lockedAt() {
    return (Alpha.isRunning || Slabdrill.isCursed)
      ? GameDatabase.challenges.normal[this.id].alphaLockedAt : GameDatabase.challenges.normal[this.id].lockedAt;
  }

  requestStart() {
    if (!Tab.challenges.isUnlocked) return;
    if (GameEnd.creditsEverClosed) return;
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    Modal.startNormalChallenge.show(this.id);
  }

  start() {
    if (this.id === 1 || this.isOnlyActiveChallenge) return;
    if (!Tab.challenges.isUnlocked) return;
    // Forces big crunch reset but ensures IP gain, if any.
    bigCrunchReset(true, true);
    player.challenge.normal.current = this.id;
    player.challenge.infinity.current = 0;
    if (Enslaved.isRunning && EternityChallenge(6).isRunning && this.id === 10) {
      EnslavedProgress.challengeCombo.giveProgress();
      Enslaved.quotes.ec6C10.show();
    }
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
    if (Slabdrill.isCursed && this.id === 12) player.chall2Pow = 0;
  }

  get isCompleted() {
    return (player.challenge.normal.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    player.challenge.normal.completedBits |= 1 << this.id;
    // Since breaking infinity maxes even autobuyers that aren't unlocked,
    // it's possible to get r52 or r53 from completing a challenge
    // and thus unlocking an autobuyer.
    Achievement(52).tryUnlock();
    Achievement(53).tryUnlock();

    // Completing a challenge unlocks an autobuyer even if not purchased with antimatter, but we still
    // need to clear the notification because otherwise it sticks there forever. Any other methods of
    // unlocking autobuyers (such as Existentially Prolong) should also go through this code path
    TabNotification.newAutobuyer.clearTrigger();
    GameCache.cheapestAntimatterAutobuyer.invalidate();
    if (this.id === 9) {
      Autobuyer.tickspeed.mode = 100;
    }
    if (this.id === 12 && Alpha.isRunning && Alpha.currentStage === 4) {
      Alpha.advanceLayer();
      Alpha.quotes.autoCrunch.show();
    }
  }

  get goal() {
    if (Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(this.id)) {
      return DC.E1E15;
    }
    return DC.NUMMAX;
  }

  updateChallengeTime() {
    const bestTimes = player.challenge.normal.bestTimes;
    if (bestTimes[this.id - 2].lte(player.records.thisInfinity.time)) {
      return;
    }
    player.challenge.normal.bestTimes[this.id - 2] = player.records.thisInfinity.time;
    GameCache.challengeTimeSum.invalidate();
    GameCache.worstChallengeTime.invalidate();
  }

  exit() {
    player.challenge.normal.current = 0;
    bigCrunchReset(true, false);
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

/**
 * @param {number} id
 * @return {NormalChallengeState}
 */
export const NormalChallenge = NormalChallengeState.createAccessor(GameDatabase.challenges.normal);

/**
 * @returns {NormalChallengeState}
 */
Object.defineProperty(NormalChallenge, "current", {
  get: () => (player.challenge.normal.current > 0
    ? NormalChallenge(player.challenge.normal.current)
    : undefined),
});

Object.defineProperty(NormalChallenge, "isRunning", {
  get: () => player.challenge.normal.current !== 0,
});

export const NormalChallenges = {
  /**
   * @type {NormalChallengeState[]}
   */
  all: NormalChallenge.index.compact(),
  completeAll() {
    for (const challenge of NormalChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.normal.completedBits = 0;
  },
  tryChargeAll() {
    for (const challenge of NormalChallenges.all) challenge.tryCharge();
  }
};
