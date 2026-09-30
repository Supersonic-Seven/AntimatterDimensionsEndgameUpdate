export class AscensionState {
  constructor(config) {
    this.config = config;
  }

  get id() {
    return this.config.id;
  }

  get zeroIndex() {
    return this.config.zeroIndex;
  }

  get timeToReach() {
    if (Currency.divineEnergy.value.lte(1)) return new Decimal(Infinity);
    const indexValue = Decimal.log(Currency.divineEnergy.value.max(1).log10().div(this.zeroIndex.log10()), 1.04);
    const indexRaise = Decimal.pow(0.5, indexValue);
    return indexRaise.times(86400000);
  }

  get timeRemaining() {
    return this.timeToReach.sub(player.endgame.ascensionTimer);
  }

  get isUnlocked() {
    return (player.endgame.ascension >= this.id + 1) && !player.disablePostReality;
  }
}

export const Ascensions = mapGameDataToObject(
  GameDatabase.endgame.ascensions,
  config => (config.isBaseResource
    ? new AscensionState(config)
    : new AscensionState(config))
);

export const Ascension = {
  get isUnlocked() {
    return ResurgenceUpgrade.unl4.isBought;
  },
  get nextAscension() {
    return Ascensions.all.find(x => !x.isUnlocked);
  },
  get overchargePenalty() {
    return [1, 0.72, 0.525, 0.375, 0.125][player.endgame.overcharge.level];
  }
};

export function tryAscend() {
  if (!Ascension.nextAscension || player.disablePostReality) return;
  if (Ascension.nextAscension.timeRemaining.gt(0)) return;
  Ascension.nextAscension.config.onUnlock?.();
  player.endgame.ascension++;
  player.endgame.ascensionTimer = 0;
  TabNotification.ascension.clearTrigger();
  TabNotification.ascension.tryTrigger();
};

export function tryEnterOvercharge() {
  if (LHC.voidRunning || LHC.nullifiedVoidRunning || player.compression.active || player.universes.current !== 0) return;
  if (player.options.confirmations.overcharge) {
    Modal.enterOvercharge.show();
  } else {
    enterOvercharge();
  }
}

export function enterOvercharge() {
  Endgame.resetNoReward();
  clearCelestialRuns();
  player.endgame.overcharge.isRunning = true;
  recalculateAllGlyphs();
  Tab.dimensions.antimatter.show(false);
  if (player.endgame.overcharge.level >= 4) {
    Modal.message.show(`The rewards for this feature are not yet implemented. Please wait for updates.`, {}, 3);
  }
};

export function exitOvercharge() {
  Endgame.resetNoReward();
  player.endgame.overcharge.isRunning = false;
};
