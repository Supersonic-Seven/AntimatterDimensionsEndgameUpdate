import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";

export function startCompressionRequest() {
  if (!PlayerProgress.compressionUnlocked()) return;
  if (LHC.voidRunning || LHC.nullifiedVoidRunning || player.endgame.overcharge.isRunning || player.universes.current !== 0) return;
  if (player.compression.active) {
    if (player.options.confirmations.compression) {
      Modal.exitCompression.show();
    } else {
      rewardHR();
      Endgame.resetNoReward();
      player.compression.active = false;
    }
  } else if (player.options.confirmations.compression) {
    Modal.enterCompression.show();
  } else {
    Endgame.resetNoReward();
    clearCelestialRuns();
    player.compression.active = true;
    recalculateAllGlyphs();
    Tab.dimensions.antimatter.show(false);
  }
}

const COMP_UPG_NAMES = [
  null, "trGain", "waveThreshold", "hrGain", "doubleWaves", "stMultReplicanti",
  "adMultTR", "adBigMultTR", "entanglementSplit", "compressionPenalty", "esGenerator"
];

export function buyCompressionUpgrade(id, bulk = 1) {
  if (GameEnd.creditsEverClosed) return false;
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = CompressionUpgrade[COMP_UPG_NAMES[id]];
  if (id > 3) {
    if (player.compression.upgrades.has(id)) return false;
    if (!Currency.thermalRadiation.purchase(upgrade.cost)) return false;
    player.compression.upgrades.add(id);
    if (id === 4) player.compression.totalElectromagneticWaves = player.compression.totalElectromagneticWaves.times(2);
  } else {
    const upgAmount = player.compression.rebuyables[id];
    if (Currency.thermalRadiation.lt(upgrade.cost) || upgAmount >= upgrade.config.purchaseCap) return false;

    let buying = Decimal.affordGeometricSeries(Currency.thermalRadiation.value,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount).toNumber();
    buying = Math.clampMax(buying, bulk);
    buying = Math.clampMax(buying, upgrade.purchaseCap - upgAmount);
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.thermalRadiation.subtract(cost);
    player.compression.rebuyables[id] += buying;
    if (id === 2) {
      if (true) Currency.thermalRadiation.reset();
      player.compression.nextThreshold = DC.E3;
      player.compression.baseElectromagneticWaves = DC.D0;
      player.compression.totalElectromagneticWaves = DC.D0;
    }
  }
  return true;
}

export function getElectroWaveMult(thresholdUpgrade) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? CompressionUpgrade.waveThreshold.effectValue : thresholdUpgrade;
  const thresholdMult = Decimal.pow10(upgrade).toNumber();
  return (1 + thresholdMult * 0.9);
}

export function getThermalRadiationGainPerSecond() {
  let trRate = new Decimal(Currency.hawkingRadiation.value)
    .timesEffectsOf(
      CompressionUpgrade.trGain,
      EndgameMastery(281),
      EndgameMastery(282),
      EndgameMastery(283),
      Achievement(276)
    ).times(DivinityMilestone.serpentPower.isReached ? 10 : 1);
  return trRate;
}

export function getNextThermalRadiationGainPerSecond() {
  let trRate = new Decimal(Currency.hawkingRadiation.value.add(getHawkingRadiationGain(true)))
    .timesEffectsOf(
      CompressionUpgrade.trGain,
      EndgameMastery(281),
      EndgameMastery(282),
      EndgameMastery(283),
      Achievement(276)
    ).times(DivinityMilestone.serpentPower.isReached ? 10 : 1);
  return trRate;
}

export function hawkingRadiationMultiplier() {
  return DC.D1.timesEffectsOf(
    CompressionUpgrade.hrGain,
    Achievement(276)
  ).times(DivinityMilestone.powerBurst.isReached ? 10 : 1).times(DivinityMilestone.serpentPower.isReached ? 10 : 1);
}

export function rewardHR() {
  Currency.hawkingRadiation.bumpTo(getHR(player.records.totalEndgameAntimatter, true));
}

// This function exists to apply Teresa-25 in a consistent way; TP multipliers can be very volatile and
// applying the reward only once upon unlock promotes min-maxing the upgrade by unlocking dilation with
// TP multipliers as large as possible. Applying the reward to a base TP value and letting the multipliers
// act dynamically on this fixed base value elsewhere solves that issue
export function getBaseHR(antimatter, requireInfinity) {
  if (!Player.canCrunch && requireInfinity) return DC.D0;
  let baseHR = Decimal.pow10(Decimal.log10(Decimal.log10(antimatter).div(308)).pow(0.5).times(2));
  return baseHR;
}

// Returns the TP that would be gained this run
export function getHR(antimatter, requireInfinity) {
  return getBaseHR(antimatter, requireInfinity).times(hawkingRadiationMultiplier());
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit dilation" button (saying whether you need more antimatter), and in last 10 eternities
export function getHawkingRadiationGain(requireInfinity) {
  return getHR(Currency.antimatter.value, requireInfinity).minus(Currency.hawkingRadiation.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getHawkingRadiationReq() {
  let effectiveHR = Currency.hawkingRadiation.value.dividedBy(hawkingRadiationMultiplier());
  return Decimal.pow10(Decimal.pow10(effectiveHR.max(1).log10().div(2).pow(2)).times(308));
}

export function getThermalRadiationTimeEstimate(goal) {
  const currentTRGain = getThermalRadiationGainPerSecond();
  const nextTRGain = getNextThermalRadiationGainPerSecond();
  const currentTR = Currency.thermalRadiation.value;
  if (currentTRGain.eq(0)) return null;
  let timeString = `${TimeSpan.fromSeconds(Decimal.sub(goal, currentTR)
    .div(currentTRGain).toNumber()).toTimeEstimate()}`;
  if (nextTRGain.gt(currentTRGain) && player.compression.active) timeString += ` ➜ ${TimeSpan.fromSeconds(Decimal.sub(goal, currentTR)
    .div(nextTRGain).toNumber()).toTimeEstimate()}`;
  return timeString;
}

export function compressedMultiplier(value) {
  if (value.lte(0)) return new Decimal(0);
  const log10 = value.log10();
  const antimatterPenalty = player.antimatter.max(10).log10().log10().div(500).min(0.01);
  const timePenalty = Decimal.pow(CompressionUpgrade.compressionPenalty.isBought ? 0.98 : 0.99, Time.thisEndgameRealTime.totalHours.cbrt());
  const compressionPenalty = Decimal.pow(antimatterPenalty, timePenalty);
  return Decimal.pow10(new Decimal(Decimal.sign(log10)).times(Decimal.pow(Decimal.abs(log10), compressionPenalty)));
}

class CompressionUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.thermalRadiation;
  }

  get set() {
    return player.compression.upgrades;
  }

  onPurchased() {
    if (this.id === 4) player.compression.totalElectromagneticWaves = player.compression.totalElectromagneticWaves.times(2);
  }
}

class RebuyableCompressionUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.thermalRadiation;
  }

  get boughtAmount() {
    return player.compression.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.compression.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.config.reachedCap();
  }

  get purchaseCap() {
    return this.config.purchaseCap(player.compression.rebuyables[this.id]);
  }

  purchase(bulk) {
    buyCompressionUpgrade(this.config.id, bulk);
  }
}

export const CompressionUpgrade = mapGameDataToObject(
  GameDatabase.endgame.compression,
  config => (config.rebuyable
    ? new RebuyableCompressionUpgradeState(config)
    : new CompressionUpgradeState(config))
);

export const CompressionUpgrades = {
  rebuyable: [
    CompressionUpgrade.trGain,
    CompressionUpgrade.waveThreshold,
    CompressionUpgrade.hrGain,
  ],
  fromId: id => CompressionUpgrade.all.find(x => x.id === Number(id))
};
