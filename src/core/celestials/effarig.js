import { BitUpgradeState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const EFFARIG_STAGES = {
  INFINITY: 1,
  ETERNITY: 2,
  REALITY: 3,
  ENDGAME: 4,
  COMPLETED: 5
};

export const Effarig = {
  displayName: "Effarig",
  possessiveName: "Effarig's",
  initializeRun() {
    if (!EffarigUnlock.endgame.isUnlocked && EffarigUnlock.extendRun.isUnlocked) {
      player.disablePostReality = true;
      Endgame.resetNoReward();
      player.disablePostReality = true;
      disChargeAllPerkUpgrades();
      disChargeAll();
      disChargeAllBreakUpgrades();
      disChargeAllEternityUpgrades();
      player.endgame.overcharge.allowComplex = false;
      AutomatorBackend.stop();
    }
    clearCelestialRuns();
    player.celestials.effarig.run = true;
    recalculateAllGlyphs();
    Tab.reality.glyphs.show(false);
    if (!EffarigUnlock.endgame.isUnlocked && EffarigUnlock.extendRun.isUnlocked) {
      for (let slots = 0; slots < Glyphs.activeSlotCount; slots++) {
        for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.omniGlyph(type));
        Glyphs.addToInventory(GlyphGenerator.omniGlyph("effarig"));
      }
      if (ImaginaryUpgrade(25).isBought) {
        player.reality.imaginaryUpgradeBits -= Math.pow(2, 25);
      }
    }
  },
  get isRunning() {
    return player.celestials.effarig.run;
  },
  get currentStage() {
    if (!EffarigUnlock.infinity.isUnlocked) {
      return EFFARIG_STAGES.INFINITY;
    }
    if (!EffarigUnlock.eternity.isUnlocked) {
      return EFFARIG_STAGES.ETERNITY;
    }
    if (!EffarigUnlock.reality.isUnlocked) {
      return EFFARIG_STAGES.REALITY;
    }
    if (!EffarigUnlock.endgame.isUnlocked && EffarigUnlock.extendRun.isUnlocked) {
      return EFFARIG_STAGES.ENDGAME;
    }
    return EFFARIG_STAGES.COMPLETED;
  },
  get currentStageName() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return "Infinity";
      case EFFARIG_STAGES.ETERNITY:
        return "Eternity";
      case EFFARIG_STAGES.REALITY:
        return "Reality";
      case EFFARIG_STAGES.ENDGAME:
        return "Endgame";
      default:
        return EffarigUnlock.extendRun.isUnlocked ? "Endgame" : "Reality";
    }
  },
  get eternityCap() {
    return this.isRunning && this.currentStage === EFFARIG_STAGES.ETERNITY ? DC.E50 : undefined;
  },
  get glyphLevelCap() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return new Decimal(100);
      case EFFARIG_STAGES.ETERNITY:
        return new Decimal(1500);
      case EFFARIG_STAGES.REALITY:
        return new Decimal(2000);
      case EFFARIG_STAGES.ENDGAME:
        return Decimal.floor(Time.thisEndgameRealTime.totalMilliseconds).times(Decimal.pow(2, Time.thisEndgameRealTime.totalHours));
      default:
        return EffarigUnlock.extendRun.isUnlocked
          ? Decimal.floor(Time.thisEndgameRealTime.totalMilliseconds).times(Decimal.pow(2, Time.thisEndgameRealTime.totalHours))
          : new Decimal(2000);
    }
  },
  get glyphEffectAmount() {
    const genEffectBitmask = Glyphs.activeWithoutCompanion
      .filter(g => generatedTypes.includes(g.type))
      .reduce((prev, curr) => prev | curr.effects, 0);
    const nongenEffectBitmask = Glyphs.activeWithoutCompanion
      .filter(g => !generatedTypes.includes(g.type))
      .reduce((prev, curr) => prev | curr.effects, 0);
    return countValuesFromBitmask(genEffectBitmask) + countValuesFromBitmask(nongenEffectBitmask);
  },
  get fullGlyphEffectAmount() {
    let glyphEff = [];
    let filterInv = Glyphs.inventoryList.filter(g => g.type !== "companion");
    for (let inv = 0; inv < 120; inv++) {
      if (filterInv[inv]) glyphEff.push(filterInv[inv]);
    }
    for (let act = 0; act < 20; act++) {
      if (Glyphs.activeWithoutCompanion[act]) glyphEff.push(Glyphs.activeWithoutCompanion[act])
    }
    const genEffectBitmaskTotal = glyphEff
      .filter(g => generatedTypes.includes(g.type))
      .reduce((prev, curr) => prev | curr.effects, 0);
    const nongenEffectBitmaskTotal = glyphEff
      .filter(g => !generatedTypes.includes(g.type))
      .reduce((prev, curr) => prev | curr.effects, 0);
    return countValuesFromBitmask(genEffectBitmaskTotal) + countValuesFromBitmask(nongenEffectBitmaskTotal);
  },
  get shardsGained() {
    const effectAmount = ResurgenceUpgrade.rsSurge.isBought ? this.fullGlyphEffectAmount : this.glyphEffectAmount;
    const extraBoost = (ExpansionPack.effarigPack.isBought && !player.disablePostReality) ? Decimal.log10(player.antimatter.add(10)) : DC.D1;
    if (!TeresaUnlocks.effarig.canBeApplied && !EndgameMilestone.celestialEarlyUnlock.isReached) return new Decimal(0);
    return Decimal.floor(Decimal.pow(Currency.eternityPoints.value.add(1).log10().div(7500), effectAmount)).times(
      AlchemyResource.effarig.effectValue).times(extraBoost).timesEffectOf(Ra.unlocks.relicShardBoost);
  },
  get maxRarityBoost() {
    return 15 * (Decimal.pow(Decimal.log10(Decimal.log10(Currency.relicShards.value.plus(10))).add(1), 1.5).sub(1)).toNumber();
  },
  get rarityCapIncrease() {
    return EffarigUnlock.maxRarityBoost.isUnlocked && !player.disablePostReality
      ? Decimal.pow(Decimal.log10(Decimal.log10(Currency.relicShards.value.plus(10))).add(1), 1.5).sub(1).times(15).div(100).pow(3).sub(2.5).times(40).max(0).toNumber()
      : 0;
  },
  nerfFactor(power) {
    let c;
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        c = 1500;
        break;
      case EFFARIG_STAGES.ETERNITY:
        c = 29.29;
        break;
      case EFFARIG_STAGES.REALITY:
        c = 25;
        break;
      case EFFARIG_STAGES.ENDGAME:
        c = 0;
        break;
      default:
        c = EffarigUnlock.extendRun.isUnlocked ? 0 : 25;
        break;
    }
    return (DC.D1.sub(new Decimal(c).div(Decimal.sqrt(power.add(1).pLog10().max(1)).add(c)))).times(3).toNumber();
  },
  get tickDilation() {
    return 0.7 + 0.1 * this.nerfFactor(Currency.timeShards.value);
  },
  get multDilation() {
    return 0.25 + 0.25 * this.nerfFactor(Currency.infinityPower.value);
  },
  get tickspeed() {
    const base = Tickspeed.baseValue.reciprocal().log10().add(3);
    return Decimal.pow10(Decimal.pow(base, this.tickDilation)).reciprocal();
  },
  multiplier(mult) {
    const base = new Decimal(mult).max(1).pLog10();
    return Decimal.pow10(Decimal.pow(base, this.multDilation));
  },
  get bonusRG() {
    if (Pelle.isDoomed && !PelleCelestialUpgrade.maxRGIncrease.canBeApplied) return 0;
    // Will return 0 if Effarig Infinity is uncompleted
    return Decimal.floor(replicantiCap().pLog10().div(LOG10_MAX_VALUE).sub(1)).toNumber();
  },
  quotes: Quotes.effarig,
  symbol: "Ϙ"
};

class EffarigUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.effarig.unlockBits; }
  set bits(value) { player.celestials.effarig.unlockBits = value; }

  get cost() {
    return this.config.cost;
  }

  get isEffectActive() {
    const hasAllEffarigRewards = (PelleCelestialUpgrade.replicantiCapIncrease.canBeApplied &&
      PelleCelestialUpgrade.maxRGIncrease.canBeApplied && PelleCelestialUpgrade.effarigRewards.canBeApplied);
    return (!Pelle.isDisabled("effarig") || hasAllEffarigRewards) && !player.disablePostReality;
  }

  purchase() {
    if (this.isUnlocked || !Currency.relicShards.purchase(this.cost)) return;
    this.unlock();
    this.config.onPurchased?.();
  }
}

export const EffarigUnlock = mapGameDataToObject(
  GameDatabase.celestials.effarig.unlocks,
  config => new EffarigUnlockState(config)
);

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.effarig.isOpen) Effarig.quotes.initial.show();
});

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.completeInfinity.show();
});

EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.completeEternity.show();
});
