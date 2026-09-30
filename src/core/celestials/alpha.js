import { BitUpgradeState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const Alpha = {
  displayName: "Alpha",
  possessiveName: "Alpha's",
  get isUnlocked() {
    return ImaginaryUpgrade(30).isBought;
  },
  get isDestroyed() {
    return this.currentStage >= 28 && !player.disablePostReality;
  },
  get isDestroyedForDisplay() {
    return this.currentStage >= 28;
  },
  initializeRun() {
    player.disablePostReality = true;
    Endgame.resetNoReward();
    disChargeAllPerkUpgrades();
    disChargeAll();
    disChargeAllBreakUpgrades();
    disChargeAllEternityUpgrades();
    player.endgame.overcharge.allowComplex = false;
    AutomatorBackend.stop();
    clearCelestialRuns();
    player.celestials.alpha.run = true;
    recalculateAllGlyphs();
    Tab.dimensions.antimatter.show(false);
    if (this.currentStage === 0) Alpha.quotes.enter.show();
    if (player.celestials.alpha.records.records.totalEndgameAntimatter.gt(DC.E1)) {
      player.antimatter = player.celestials.alpha.records.antimatter;
      player.dimensions.antimatter[0].bought = player.celestials.alpha.records.dimensions.antimatter[0].bought;
      player.dimensions.antimatter[0].costBumps = player.celestials.alpha.records.dimensions.antimatter[0].costBumps;
      player.dimensions.antimatter[0].amount = player.celestials.alpha.records.dimensions.antimatter[0].amount;
      player.dimensions.antimatter[1].bought = player.celestials.alpha.records.dimensions.antimatter[1].bought;
      player.dimensions.antimatter[1].costBumps = player.celestials.alpha.records.dimensions.antimatter[1].costBumps;
      player.dimensions.antimatter[1].amount = player.celestials.alpha.records.dimensions.antimatter[1].amount;
      player.dimensions.antimatter[2].bought = player.celestials.alpha.records.dimensions.antimatter[2].bought;
      player.dimensions.antimatter[2].costBumps = player.celestials.alpha.records.dimensions.antimatter[2].costBumps;
      player.dimensions.antimatter[2].amount = player.celestials.alpha.records.dimensions.antimatter[2].amount;
      player.dimensions.antimatter[3].bought = player.celestials.alpha.records.dimensions.antimatter[3].bought;
      player.dimensions.antimatter[3].costBumps = player.celestials.alpha.records.dimensions.antimatter[3].costBumps;
      player.dimensions.antimatter[3].amount = player.celestials.alpha.records.dimensions.antimatter[3].amount;
      player.dimensions.antimatter[4].bought = player.celestials.alpha.records.dimensions.antimatter[4].bought;
      player.dimensions.antimatter[4].costBumps = player.celestials.alpha.records.dimensions.antimatter[4].costBumps;
      player.dimensions.antimatter[4].amount = player.celestials.alpha.records.dimensions.antimatter[4].amount;
      player.dimensions.antimatter[5].bought = player.celestials.alpha.records.dimensions.antimatter[5].bought;
      player.dimensions.antimatter[5].costBumps = player.celestials.alpha.records.dimensions.antimatter[5].costBumps;
      player.dimensions.antimatter[5].amount = player.celestials.alpha.records.dimensions.antimatter[5].amount;
      player.dimensions.antimatter[6].bought = player.celestials.alpha.records.dimensions.antimatter[6].bought;
      player.dimensions.antimatter[6].costBumps = player.celestials.alpha.records.dimensions.antimatter[6].costBumps;
      player.dimensions.antimatter[6].amount = player.celestials.alpha.records.dimensions.antimatter[6].amount;
      player.dimensions.antimatter[7].bought = player.celestials.alpha.records.dimensions.antimatter[7].bought;
      player.dimensions.antimatter[7].costBumps = player.celestials.alpha.records.dimensions.antimatter[7].costBumps;
      player.dimensions.antimatter[7].amount = player.celestials.alpha.records.dimensions.antimatter[7].amount;
      player.dimensions.infinity[0].isUnlocked = player.celestials.alpha.records.dimensions.infinity[0].isUnlocked;
      player.dimensions.infinity[0].bought = player.celestials.alpha.records.dimensions.infinity[0].bought;
      player.dimensions.infinity[0].amount = player.celestials.alpha.records.dimensions.infinity[0].amount;
      player.dimensions.infinity[0].cost = player.celestials.alpha.records.dimensions.infinity[0].cost;
      player.dimensions.infinity[0].baseAmount = player.celestials.alpha.records.dimensions.infinity[0].baseAmount;
      player.dimensions.infinity[1].isUnlocked = player.celestials.alpha.records.dimensions.infinity[1].isUnlocked;
      player.dimensions.infinity[1].bought = player.celestials.alpha.records.dimensions.infinity[1].bought;
      player.dimensions.infinity[1].amount = player.celestials.alpha.records.dimensions.infinity[1].amount;
      player.dimensions.infinity[1].cost = player.celestials.alpha.records.dimensions.infinity[1].cost;
      player.dimensions.infinity[1].baseAmount = player.celestials.alpha.records.dimensions.infinity[1].baseAmount;
      player.dimensions.infinity[2].isUnlocked = player.celestials.alpha.records.dimensions.infinity[2].isUnlocked;
      player.dimensions.infinity[2].bought = player.celestials.alpha.records.dimensions.infinity[2].bought;
      player.dimensions.infinity[2].amount = player.celestials.alpha.records.dimensions.infinity[2].amount;
      player.dimensions.infinity[2].cost = player.celestials.alpha.records.dimensions.infinity[2].cost;
      player.dimensions.infinity[2].baseAmount = player.celestials.alpha.records.dimensions.infinity[2].baseAmount;
      player.dimensions.infinity[3].isUnlocked = player.celestials.alpha.records.dimensions.infinity[3].isUnlocked;
      player.dimensions.infinity[3].bought = player.celestials.alpha.records.dimensions.infinity[3].bought;
      player.dimensions.infinity[3].amount = player.celestials.alpha.records.dimensions.infinity[3].amount;
      player.dimensions.infinity[3].cost = player.celestials.alpha.records.dimensions.infinity[3].cost;
      player.dimensions.infinity[3].baseAmount = player.celestials.alpha.records.dimensions.infinity[3].baseAmount;
      player.dimensions.infinity[4].isUnlocked = player.celestials.alpha.records.dimensions.infinity[4].isUnlocked;
      player.dimensions.infinity[4].bought = player.celestials.alpha.records.dimensions.infinity[4].bought;
      player.dimensions.infinity[4].amount = player.celestials.alpha.records.dimensions.infinity[4].amount;
      player.dimensions.infinity[4].cost = player.celestials.alpha.records.dimensions.infinity[4].cost;
      player.dimensions.infinity[4].baseAmount = player.celestials.alpha.records.dimensions.infinity[4].baseAmount;
      player.dimensions.infinity[5].isUnlocked = player.celestials.alpha.records.dimensions.infinity[5].isUnlocked;
      player.dimensions.infinity[5].bought = player.celestials.alpha.records.dimensions.infinity[5].bought;
      player.dimensions.infinity[5].amount = player.celestials.alpha.records.dimensions.infinity[5].amount;
      player.dimensions.infinity[5].cost = player.celestials.alpha.records.dimensions.infinity[5].cost;
      player.dimensions.infinity[5].baseAmount = player.celestials.alpha.records.dimensions.infinity[5].baseAmount;
      player.dimensions.infinity[6].isUnlocked = player.celestials.alpha.records.dimensions.infinity[6].isUnlocked;
      player.dimensions.infinity[6].bought = player.celestials.alpha.records.dimensions.infinity[6].bought;
      player.dimensions.infinity[6].amount = player.celestials.alpha.records.dimensions.infinity[6].amount;
      player.dimensions.infinity[6].cost = player.celestials.alpha.records.dimensions.infinity[6].cost;
      player.dimensions.infinity[6].baseAmount = player.celestials.alpha.records.dimensions.infinity[6].baseAmount;
      player.dimensions.infinity[7].isUnlocked = player.celestials.alpha.records.dimensions.infinity[7].isUnlocked;
      player.dimensions.infinity[7].bought = player.celestials.alpha.records.dimensions.infinity[7].bought;
      player.dimensions.infinity[7].amount = player.celestials.alpha.records.dimensions.infinity[7].amount;
      player.dimensions.infinity[7].cost = player.celestials.alpha.records.dimensions.infinity[7].cost;
      player.dimensions.infinity[7].baseAmount = player.celestials.alpha.records.dimensions.infinity[7].baseAmount;
      player.dimensions.time[0].cost = player.celestials.alpha.records.dimensions.time[0].cost;
      player.dimensions.time[0].amount = player.celestials.alpha.records.dimensions.time[0].amount;
      player.dimensions.time[0].bought = player.celestials.alpha.records.dimensions.time[0].bought;
      player.dimensions.time[1].cost = player.celestials.alpha.records.dimensions.time[1].cost;
      player.dimensions.time[1].amount = player.celestials.alpha.records.dimensions.time[1].amount;
      player.dimensions.time[1].bought = player.celestials.alpha.records.dimensions.time[1].bought;
      player.dimensions.time[2].cost = player.celestials.alpha.records.dimensions.time[2].cost;
      player.dimensions.time[2].amount = player.celestials.alpha.records.dimensions.time[2].amount;
      player.dimensions.time[2].bought = player.celestials.alpha.records.dimensions.time[2].bought;
      player.dimensions.time[3].cost = player.celestials.alpha.records.dimensions.time[3].cost;
      player.dimensions.time[3].amount = player.celestials.alpha.records.dimensions.time[3].amount;
      player.dimensions.time[3].bought = player.celestials.alpha.records.dimensions.time[3].bought;
      player.dimensions.time[4].cost = player.celestials.alpha.records.dimensions.time[4].cost;
      player.dimensions.time[4].amount = player.celestials.alpha.records.dimensions.time[4].amount;
      player.dimensions.time[4].bought = player.celestials.alpha.records.dimensions.time[4].bought;
      player.dimensions.time[5].cost = player.celestials.alpha.records.dimensions.time[5].cost;
      player.dimensions.time[5].amount = player.celestials.alpha.records.dimensions.time[5].amount;
      player.dimensions.time[5].bought = player.celestials.alpha.records.dimensions.time[5].bought;
      player.dimensions.time[6].cost = player.celestials.alpha.records.dimensions.time[6].cost;
      player.dimensions.time[6].amount = player.celestials.alpha.records.dimensions.time[6].amount;
      player.dimensions.time[6].bought = player.celestials.alpha.records.dimensions.time[6].bought;
      player.dimensions.time[7].cost = player.celestials.alpha.records.dimensions.time[7].cost;
      player.dimensions.time[7].amount = player.celestials.alpha.records.dimensions.time[7].amount;
      player.dimensions.time[7].bought = player.celestials.alpha.records.dimensions.time[7].bought;
      player.buyUntil10 = player.celestials.alpha.records.buyUntil10;
      player.sacrificed = player.celestials.alpha.records.sacrificed;
      player.infinityUpgrades = new Set(player.celestials.alpha.records.infinityUpgrades);
      player.infinityRebuyables[0] = player.celestials.alpha.records.infinityRebuyables[0];
      player.infinityRebuyables[1] = player.celestials.alpha.records.infinityRebuyables[1];
      player.infinityRebuyables[2] = player.celestials.alpha.records.infinityRebuyables[2];
      player.challenge.normal.current = player.celestials.alpha.records.challenge.normal.current;
      player.challenge.normal.bestTimes[0] = player.celestials.alpha.records.challenge.normal.bestTimes[0];
      player.challenge.normal.bestTimes[1] = player.celestials.alpha.records.challenge.normal.bestTimes[1];
      player.challenge.normal.bestTimes[2] = player.celestials.alpha.records.challenge.normal.bestTimes[2];
      player.challenge.normal.bestTimes[3] = player.celestials.alpha.records.challenge.normal.bestTimes[3];
      player.challenge.normal.bestTimes[4] = player.celestials.alpha.records.challenge.normal.bestTimes[4];
      player.challenge.normal.bestTimes[5] = player.celestials.alpha.records.challenge.normal.bestTimes[5];
      player.challenge.normal.bestTimes[6] = player.celestials.alpha.records.challenge.normal.bestTimes[6];
      player.challenge.normal.bestTimes[7] = player.celestials.alpha.records.challenge.normal.bestTimes[7];
      player.challenge.normal.bestTimes[8] = player.celestials.alpha.records.challenge.normal.bestTimes[8];
      player.challenge.normal.bestTimes[9] = player.celestials.alpha.records.challenge.normal.bestTimes[9];
      player.challenge.normal.bestTimes[10] = player.celestials.alpha.records.challenge.normal.bestTimes[10];
      player.challenge.normal.completedBits = player.celestials.alpha.records.challenge.normal.completedBits;
      player.challenge.infinity.current = player.celestials.alpha.records.challenge.infinity.current;
      player.challenge.infinity.bestTimes[0] = player.celestials.alpha.records.challenge.infinity.bestTimes[0];
      player.challenge.infinity.bestTimes[1] = player.celestials.alpha.records.challenge.infinity.bestTimes[1];
      player.challenge.infinity.bestTimes[2] = player.celestials.alpha.records.challenge.infinity.bestTimes[2];
      player.challenge.infinity.bestTimes[3] = player.celestials.alpha.records.challenge.infinity.bestTimes[3];
      player.challenge.infinity.bestTimes[4] = player.celestials.alpha.records.challenge.infinity.bestTimes[4];
      player.challenge.infinity.bestTimes[5] = player.celestials.alpha.records.challenge.infinity.bestTimes[5];
      player.challenge.infinity.bestTimes[6] = player.celestials.alpha.records.challenge.infinity.bestTimes[6];
      player.challenge.infinity.bestTimes[7] = player.celestials.alpha.records.challenge.infinity.bestTimes[7];
      player.challenge.infinity.completedBits = player.celestials.alpha.records.challenge.infinity.completedBits;
      player.challenge.eternity.current = player.celestials.alpha.records.challenge.eternity.current;
      player.challenge.eternity.unlocked = player.celestials.alpha.records.challenge.eternity.unlocked;
      player.challenge.eternity.requirementBits = player.celestials.alpha.records.challenge.eternity.requirementBits;
      player.infinity.upgradeBits = player.celestials.alpha.records.infinity.upgradeBits;
      player.auto.autobuyersOn = player.celestials.alpha.records.auto.autobuyersOn;
      player.auto.disableContinuum = player.celestials.alpha.records.auto.disableContinuum;
      player.auto.eternity.amount = player.celestials.alpha.records.auto.eternity.amount;
      player.auto.eternity.increaseWithMult = player.celestials.alpha.records.auto.eternity.increaseWithMult;
      player.auto.eternity.time = player.celestials.alpha.records.auto.eternity.time;
      player.auto.eternity.xHighest = player.celestials.alpha.records.auto.eternity.xHighest;
      player.auto.eternity.isActive = player.celestials.alpha.records.auto.eternity.isActive;
      player.auto.bigCrunch.cost = player.celestials.alpha.records.auto.bigCrunch.cost;
      player.auto.bigCrunch.interval = player.celestials.alpha.records.auto.bigCrunch.interval;
      player.auto.bigCrunch.mode = player.celestials.alpha.records.auto.bigCrunch.mode;
      player.auto.bigCrunch.amount = player.celestials.alpha.records.auto.bigCrunch.amount;
      player.auto.bigCrunch.increaseWithMult = player.celestials.alpha.records.auto.bigCrunch.increaseWithMult;
      player.auto.bigCrunch.time = player.celestials.alpha.records.auto.bigCrunch.time;
      player.auto.bigCrunch.xHighest = player.celestials.alpha.records.auto.bigCrunch.xHighest;
      player.auto.bigCrunch.isActive = player.celestials.alpha.records.auto.bigCrunch.isActive;
      player.auto.bigCrunch.lastTick = player.celestials.alpha.records.auto.bigCrunch.lastTick;
      player.auto.galaxy.cost = player.celestials.alpha.records.auto.galaxy.cost;
      player.auto.galaxy.interval = player.celestials.alpha.records.auto.galaxy.interval;
      player.auto.galaxy.limitGalaxies = player.celestials.alpha.records.auto.galaxy.limitGalaxies;
      player.auto.galaxy.maxGalaxies = player.celestials.alpha.records.auto.galaxy.maxGalaxies;
      player.auto.galaxy.buyMax = player.celestials.alpha.records.auto.galaxy.buyMax;
      player.auto.galaxy.buyMaxInterval = player.celestials.alpha.records.auto.galaxy.buyMaxInterval;
      player.auto.galaxy.isActive = player.celestials.alpha.records.auto.galaxy.isActive;
      player.auto.galaxy.lastTick = player.celestials.alpha.records.auto.galaxy.lastTick;
      player.auto.dimBoost.cost = player.celestials.alpha.records.auto.dimBoost.cost;
      player.auto.dimBoost.interval = player.celestials.alpha.records.auto.dimBoost.interval;
      player.auto.dimBoost.limitDimBoosts = player.celestials.alpha.records.auto.dimBoost.limitDimBoosts;
      player.auto.dimBoost.maxDimBoosts = player.celestials.alpha.records.auto.dimBoost.maxDimBoosts;
      player.auto.dimBoost.limitUntilGalaxies = player.celestials.alpha.records.auto.dimBoost.limitUntilGalaxies;
      player.auto.dimBoost.galaxies = player.celestials.alpha.records.auto.dimBoost.galaxies;
      player.auto.dimBoost.buyMaxInterval = player.celestials.alpha.records.auto.dimBoost.buyMaxInterval;
      player.auto.dimBoost.isActive = player.celestials.alpha.records.auto.dimBoost.isActive;
      player.auto.dimBoost.lastTick = player.celestials.alpha.records.auto.dimBoost.lastTick;
      player.auto.tickspeed.isUnlocked = player.celestials.alpha.records.auto.tickspeed.isUnlocked;
      player.auto.tickspeed.cost = player.celestials.alpha.records.auto.tickspeed.cost;
      player.auto.tickspeed.interval = player.celestials.alpha.records.auto.tickspeed.interval;
      player.auto.tickspeed.mode = player.celestials.alpha.records.auto.tickspeed.mode;
      player.auto.tickspeed.isActive = player.celestials.alpha.records.auto.tickspeed.isActive;
      player.auto.tickspeed.lastTick = player.celestials.alpha.records.auto.tickspeed.lastTick;
      player.auto.tickspeed.isBought = player.celestials.alpha.records.auto.tickspeed.isBought;
      player.auto.sacrifice.multiplier = player.celestials.alpha.records.auto.sacrifice.multiplier;
      player.auto.sacrifice.isActive = player.celestials.alpha.records.auto.sacrifice.isActive;
      if (player.auto.antimatterDims.all[0].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(1).cost);
        Autobuyer.antimatterDimension(1).purchase();
      }
      player.auto.antimatterDims.all[0].cost = player.celestials.alpha.records.auto.antimatterDims.all[0].cost;
      player.auto.antimatterDims.all[0].interval = player.celestials.alpha.records.auto.antimatterDims.all[0].interval;
      player.auto.antimatterDims.all[0].bulk = player.celestials.alpha.records.auto.antimatterDims.all[0].bulk;
      player.auto.antimatterDims.all[0].mode = player.celestials.alpha.records.auto.antimatterDims.all[0].mode;
      player.auto.antimatterDims.all[0].isActive = player.celestials.alpha.records.auto.antimatterDims.all[0].isActive;
      player.auto.antimatterDims.all[0].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[0].lastTick;
      player.auto.antimatterDims.all[0].isBought = player.celestials.alpha.records.auto.antimatterDims.all[0].isBought;
      if (player.auto.antimatterDims.all[1].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(2).cost);
        Autobuyer.antimatterDimension(2).purchase();
      }
      player.auto.antimatterDims.all[1].cost = player.celestials.alpha.records.auto.antimatterDims.all[1].cost;
      player.auto.antimatterDims.all[1].interval = player.celestials.alpha.records.auto.antimatterDims.all[1].interval;
      player.auto.antimatterDims.all[1].bulk = player.celestials.alpha.records.auto.antimatterDims.all[1].bulk;
      player.auto.antimatterDims.all[1].mode = player.celestials.alpha.records.auto.antimatterDims.all[1].mode;
      player.auto.antimatterDims.all[1].isActive = player.celestials.alpha.records.auto.antimatterDims.all[1].isActive;
      player.auto.antimatterDims.all[1].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[1].lastTick;
      player.auto.antimatterDims.all[1].isBought = player.celestials.alpha.records.auto.antimatterDims.all[1].isBought;
      if (player.auto.antimatterDims.all[2].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(3).cost);
        Autobuyer.antimatterDimension(3).purchase();
      }
      player.auto.antimatterDims.all[2].cost = player.celestials.alpha.records.auto.antimatterDims.all[2].cost;
      player.auto.antimatterDims.all[2].interval = player.celestials.alpha.records.auto.antimatterDims.all[2].interval;
      player.auto.antimatterDims.all[2].bulk = player.celestials.alpha.records.auto.antimatterDims.all[2].bulk;
      player.auto.antimatterDims.all[2].mode = player.celestials.alpha.records.auto.antimatterDims.all[2].mode;
      player.auto.antimatterDims.all[2].isActive = player.celestials.alpha.records.auto.antimatterDims.all[2].isActive;
      player.auto.antimatterDims.all[2].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[2].lastTick;
      player.auto.antimatterDims.all[2].isBought = player.celestials.alpha.records.auto.antimatterDims.all[2].isBought;
      if (player.auto.antimatterDims.all[3].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(4).cost);
        Autobuyer.antimatterDimension(4).purchase();
      }
      player.auto.antimatterDims.all[3].cost = player.celestials.alpha.records.auto.antimatterDims.all[3].cost;
      player.auto.antimatterDims.all[3].interval = player.celestials.alpha.records.auto.antimatterDims.all[3].interval;
      player.auto.antimatterDims.all[3].bulk = player.celestials.alpha.records.auto.antimatterDims.all[3].bulk;
      player.auto.antimatterDims.all[3].mode = player.celestials.alpha.records.auto.antimatterDims.all[3].mode;
      player.auto.antimatterDims.all[3].isActive = player.celestials.alpha.records.auto.antimatterDims.all[3].isActive;
      player.auto.antimatterDims.all[3].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[3].lastTick;
      player.auto.antimatterDims.all[3].isBought = player.celestials.alpha.records.auto.antimatterDims.all[3].isBought;
      if (player.auto.antimatterDims.all[4].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(5).cost);
        Autobuyer.antimatterDimension(5).purchase();
      }
      player.auto.antimatterDims.all[4].cost = player.celestials.alpha.records.auto.antimatterDims.all[4].cost;
      player.auto.antimatterDims.all[4].interval = player.celestials.alpha.records.auto.antimatterDims.all[4].interval;
      player.auto.antimatterDims.all[4].bulk = player.celestials.alpha.records.auto.antimatterDims.all[4].bulk;
      player.auto.antimatterDims.all[4].mode = player.celestials.alpha.records.auto.antimatterDims.all[4].mode;
      player.auto.antimatterDims.all[4].isActive = player.celestials.alpha.records.auto.antimatterDims.all[4].isActive;
      player.auto.antimatterDims.all[4].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[4].lastTick;
      player.auto.antimatterDims.all[4].isBought = player.celestials.alpha.records.auto.antimatterDims.all[4].isBought;
      if (player.auto.antimatterDims.all[5].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(6).cost);
        Autobuyer.antimatterDimension(6).purchase();
      }
      player.auto.antimatterDims.all[5].cost = player.celestials.alpha.records.auto.antimatterDims.all[5].cost;
      player.auto.antimatterDims.all[5].interval = player.celestials.alpha.records.auto.antimatterDims.all[5].interval;
      player.auto.antimatterDims.all[5].bulk = player.celestials.alpha.records.auto.antimatterDims.all[5].bulk;
      player.auto.antimatterDims.all[5].mode = player.celestials.alpha.records.auto.antimatterDims.all[5].mode;
      player.auto.antimatterDims.all[5].isActive = player.celestials.alpha.records.auto.antimatterDims.all[5].isActive;
      player.auto.antimatterDims.all[5].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[5].lastTick;
      player.auto.antimatterDims.all[5].isBought = player.celestials.alpha.records.auto.antimatterDims.all[5].isBought;
      if (player.auto.antimatterDims.all[6].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(7).cost);
        Autobuyer.antimatterDimension(7).purchase();
      }
      player.auto.antimatterDims.all[6].cost = player.celestials.alpha.records.auto.antimatterDims.all[6].cost;
      player.auto.antimatterDims.all[6].interval = player.celestials.alpha.records.auto.antimatterDims.all[6].interval;
      player.auto.antimatterDims.all[6].bulk = player.celestials.alpha.records.auto.antimatterDims.all[6].bulk;
      player.auto.antimatterDims.all[6].mode = player.celestials.alpha.records.auto.antimatterDims.all[6].mode;
      player.auto.antimatterDims.all[6].isActive = player.celestials.alpha.records.auto.antimatterDims.all[6].isActive;
      player.auto.antimatterDims.all[6].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[6].lastTick;
      player.auto.antimatterDims.all[6].isBought = player.celestials.alpha.records.auto.antimatterDims.all[6].isBought;
      if (player.auto.antimatterDims.all[7].isUnlocked) {
        Currency.antimatter.add(Autobuyer.antimatterDimension(8).cost);
        Autobuyer.antimatterDimension(8).purchase();
      }
      player.auto.antimatterDims.all[7].cost = player.celestials.alpha.records.auto.antimatterDims.all[7].cost;
      player.auto.antimatterDims.all[7].interval = player.celestials.alpha.records.auto.antimatterDims.all[7].interval;
      player.auto.antimatterDims.all[7].bulk = player.celestials.alpha.records.auto.antimatterDims.all[7].bulk;
      player.auto.antimatterDims.all[7].mode = player.celestials.alpha.records.auto.antimatterDims.all[7].mode;
      player.auto.antimatterDims.all[7].isActive = player.celestials.alpha.records.auto.antimatterDims.all[7].isActive;
      player.auto.antimatterDims.all[7].lastTick = player.celestials.alpha.records.auto.antimatterDims.all[7].lastTick;
      player.auto.antimatterDims.all[7].isBought = player.celestials.alpha.records.auto.antimatterDims.all[7].isBought;
      player.auto.antimatterDims.isActive = player.celestials.alpha.records.auto.antimatterDims.isActive;
      player.auto.infinityDims.all[0].isActive = player.celestials.alpha.records.auto.infinityDims.all[0].isActive;
      player.auto.infinityDims.all[0].lastTick = player.celestials.alpha.records.auto.infinityDims.all[0].lastTick;
      player.auto.infinityDims.all[1].isActive = player.celestials.alpha.records.auto.infinityDims.all[1].isActive;
      player.auto.infinityDims.all[1].lastTick = player.celestials.alpha.records.auto.infinityDims.all[1].lastTick;
      player.auto.infinityDims.all[2].isActive = player.celestials.alpha.records.auto.infinityDims.all[2].isActive;
      player.auto.infinityDims.all[2].lastTick = player.celestials.alpha.records.auto.infinityDims.all[2].lastTick;
      player.auto.infinityDims.all[3].isActive = player.celestials.alpha.records.auto.infinityDims.all[3].isActive;
      player.auto.infinityDims.all[3].lastTick = player.celestials.alpha.records.auto.infinityDims.all[3].lastTick;
      player.auto.infinityDims.all[4].isActive = player.celestials.alpha.records.auto.infinityDims.all[4].isActive;
      player.auto.infinityDims.all[4].lastTick = player.celestials.alpha.records.auto.infinityDims.all[4].lastTick;
      player.auto.infinityDims.all[5].isActive = player.celestials.alpha.records.auto.infinityDims.all[5].isActive;
      player.auto.infinityDims.all[5].lastTick = player.celestials.alpha.records.auto.infinityDims.all[5].lastTick;
      player.auto.infinityDims.all[6].isActive = player.celestials.alpha.records.auto.infinityDims.all[6].isActive;
      player.auto.infinityDims.all[6].lastTick = player.celestials.alpha.records.auto.infinityDims.all[6].lastTick;
      player.auto.infinityDims.all[7].isActive = player.celestials.alpha.records.auto.infinityDims.all[7].isActive;
      player.auto.infinityDims.all[7].lastTick = player.celestials.alpha.records.auto.infinityDims.all[7].lastTick;
      player.auto.infinityDims.isActive = player.celestials.alpha.records.auto.infinityDims.isActive;
      player.auto.replicantiGalaxies.isActive = player.celestials.alpha.records.auto.replicantiGalaxies.isActive;
      player.auto.replicantiUpgrades.all[0].isActive = player.celestials.alpha.records.auto.replicantiUpgrades.all[0].isActive;
      player.auto.replicantiUpgrades.all[0].lastTick = player.celestials.alpha.records.auto.replicantiUpgrades.all[0].lastTick;
      player.auto.replicantiUpgrades.all[1].isActive = player.celestials.alpha.records.auto.replicantiUpgrades.all[1].isActive;
      player.auto.replicantiUpgrades.all[1].lastTick = player.celestials.alpha.records.auto.replicantiUpgrades.all[1].lastTick;
      player.auto.replicantiUpgrades.all[2].isActive = player.celestials.alpha.records.auto.replicantiUpgrades.all[2].isActive;
      player.auto.replicantiUpgrades.all[2].lastTick = player.celestials.alpha.records.auto.replicantiUpgrades.all[2].lastTick;
      player.auto.replicantiUpgrades.isActive = player.celestials.alpha.records.auto.replicantiUpgrades.isActive;
      player.auto.ipMultBuyer.isActive = player.celestials.alpha.records.auto.ipMultBuyer.isActive;
      player.infinityPoints = player.celestials.alpha.records.infinityPoints;
      player.infinities = player.celestials.alpha.records.infinities;
      player.infinitiesBanked = player.celestials.alpha.records.infinitiesBanked;
      player.dimensionBoosts = player.celestials.alpha.records.dimensionBoosts;
      player.galaxies = player.celestials.alpha.records.galaxies;
      player.chall2Pow = player.celestials.alpha.records.chall2Pow;
      player.chall3Pow = player.celestials.alpha.records.chall3Pow;
      player.matter = player.celestials.alpha.records.matter;
      player.chall9TickspeedCostBumps = player.celestials.alpha.records.chall9TickspeedCostBumps;
      player.chall8TotalSacrifice = player.celestials.alpha.records.chall8TotalSacrifice;
      player.ic2Count = player.celestials.alpha.records.ic2Count;
      player.partInfinityPoint = player.celestials.alpha.records.partInfinityPoint;
      player.partInfinitied = player.celestials.alpha.records.partInfinitied;
      player.break = player.celestials.alpha.records.break;
      player.requirementChecks.infinity.maxAll = player.celestials.alpha.records.requirementChecks.infinity.maxAll;
      player.requirementChecks.infinity.noSacrifice = player.celestials.alpha.records.requirementChecks.infinity.noSacrifice;
      player.requirementChecks.infinity.noAD8 = player.celestials.alpha.records.requirementChecks.infinity.noAD8;
      player.requirementChecks.eternity.onlyAD1 = player.celestials.alpha.records.requirementChecks.eternity.onlyAD1;
      player.requirementChecks.eternity.onlyAD8 = player.celestials.alpha.records.requirementChecks.eternity.onlyAD8;
      player.requirementChecks.eternity.noAD1 = player.celestials.alpha.records.requirementChecks.eternity.noAD1;
      player.requirementChecks.eternity.noRG = player.celestials.alpha.records.requirementChecks.eternity.noRG;
      player.records.totalTimePlayed = player.celestials.alpha.records.records.totalTimePlayed;
      player.records.totalEndgameAntimatter = player.celestials.alpha.records.records.totalEndgameAntimatter;
      player.records.totalRealityAntimatter = player.celestials.alpha.records.records.totalRealityAntimatter;
      player.records.totalEternityAntimatter = player.celestials.alpha.records.records.totalEternityAntimatter;
      player.records.totalInfinityAntimatter = player.celestials.alpha.records.records.totalInfinityAntimatter;
      player.records.recentInfinities[0][0] = player.celestials.alpha.records.records.recentInfinities[0][0];
      player.records.recentInfinities[0][1] = player.celestials.alpha.records.records.recentInfinities[0][1];
      player.records.recentInfinities[0][2] = player.celestials.alpha.records.records.recentInfinities[0][2];
      player.records.recentInfinities[0][3] = player.celestials.alpha.records.records.recentInfinities[0][3];
      player.records.recentInfinities[0][4] = player.celestials.alpha.records.records.recentInfinities[0][4];
      player.records.recentInfinities[1][0] = player.celestials.alpha.records.records.recentInfinities[1][0];
      player.records.recentInfinities[1][1] = player.celestials.alpha.records.records.recentInfinities[1][1];
      player.records.recentInfinities[1][2] = player.celestials.alpha.records.records.recentInfinities[1][2];
      player.records.recentInfinities[1][3] = player.celestials.alpha.records.records.recentInfinities[1][3];
      player.records.recentInfinities[1][4] = player.celestials.alpha.records.records.recentInfinities[1][4];
      player.records.recentInfinities[2][0] = player.celestials.alpha.records.records.recentInfinities[2][0];
      player.records.recentInfinities[2][1] = player.celestials.alpha.records.records.recentInfinities[2][1];
      player.records.recentInfinities[2][2] = player.celestials.alpha.records.records.recentInfinities[2][2];
      player.records.recentInfinities[2][3] = player.celestials.alpha.records.records.recentInfinities[2][3];
      player.records.recentInfinities[2][4] = player.celestials.alpha.records.records.recentInfinities[2][4];
      player.records.recentInfinities[3][0] = player.celestials.alpha.records.records.recentInfinities[3][0];
      player.records.recentInfinities[3][1] = player.celestials.alpha.records.records.recentInfinities[3][1];
      player.records.recentInfinities[3][2] = player.celestials.alpha.records.records.recentInfinities[3][2];
      player.records.recentInfinities[3][3] = player.celestials.alpha.records.records.recentInfinities[3][3];
      player.records.recentInfinities[3][4] = player.celestials.alpha.records.records.recentInfinities[3][4];
      player.records.recentInfinities[4][0] = player.celestials.alpha.records.records.recentInfinities[4][0];
      player.records.recentInfinities[4][1] = player.celestials.alpha.records.records.recentInfinities[4][1];
      player.records.recentInfinities[4][2] = player.celestials.alpha.records.records.recentInfinities[4][2];
      player.records.recentInfinities[4][3] = player.celestials.alpha.records.records.recentInfinities[4][3];
      player.records.recentInfinities[4][4] = player.celestials.alpha.records.records.recentInfinities[4][4];
      player.records.recentInfinities[5][0] = player.celestials.alpha.records.records.recentInfinities[5][0];
      player.records.recentInfinities[5][1] = player.celestials.alpha.records.records.recentInfinities[5][1];
      player.records.recentInfinities[5][2] = player.celestials.alpha.records.records.recentInfinities[5][2];
      player.records.recentInfinities[5][3] = player.celestials.alpha.records.records.recentInfinities[5][3];
      player.records.recentInfinities[5][4] = player.celestials.alpha.records.records.recentInfinities[5][4];
      player.records.recentInfinities[6][0] = player.celestials.alpha.records.records.recentInfinities[6][0];
      player.records.recentInfinities[6][1] = player.celestials.alpha.records.records.recentInfinities[6][1];
      player.records.recentInfinities[6][2] = player.celestials.alpha.records.records.recentInfinities[6][2];
      player.records.recentInfinities[6][3] = player.celestials.alpha.records.records.recentInfinities[6][3];
      player.records.recentInfinities[6][4] = player.celestials.alpha.records.records.recentInfinities[6][4];
      player.records.recentInfinities[7][0] = player.celestials.alpha.records.records.recentInfinities[7][0];
      player.records.recentInfinities[7][1] = player.celestials.alpha.records.records.recentInfinities[7][1];
      player.records.recentInfinities[7][2] = player.celestials.alpha.records.records.recentInfinities[7][2];
      player.records.recentInfinities[7][3] = player.celestials.alpha.records.records.recentInfinities[7][3];
      player.records.recentInfinities[7][4] = player.celestials.alpha.records.records.recentInfinities[7][4];
      player.records.recentInfinities[8][0] = player.celestials.alpha.records.records.recentInfinities[8][0];
      player.records.recentInfinities[8][1] = player.celestials.alpha.records.records.recentInfinities[8][1];
      player.records.recentInfinities[8][2] = player.celestials.alpha.records.records.recentInfinities[8][2];
      player.records.recentInfinities[8][3] = player.celestials.alpha.records.records.recentInfinities[8][3];
      player.records.recentInfinities[8][4] = player.celestials.alpha.records.records.recentInfinities[8][4];
      player.records.recentInfinities[9][0] = player.celestials.alpha.records.records.recentInfinities[9][0];
      player.records.recentInfinities[9][1] = player.celestials.alpha.records.records.recentInfinities[9][1];
      player.records.recentInfinities[9][2] = player.celestials.alpha.records.records.recentInfinities[9][2];
      player.records.recentInfinities[9][3] = player.celestials.alpha.records.records.recentInfinities[9][3];
      player.records.recentInfinities[9][4] = player.celestials.alpha.records.records.recentInfinities[9][4];
      player.records.recentEternities[0][0] = player.celestials.alpha.records.records.recentEternities[0][0];
      player.records.recentEternities[0][1] = player.celestials.alpha.records.records.recentEternities[0][1];
      player.records.recentEternities[0][2] = player.celestials.alpha.records.records.recentEternities[0][2];
      player.records.recentEternities[0][3] = player.celestials.alpha.records.records.recentEternities[0][3];
      player.records.recentEternities[0][4] = player.celestials.alpha.records.records.recentEternities[0][4];
      player.records.recentEternities[0][5] = player.celestials.alpha.records.records.recentEternities[0][5];
      player.records.recentEternities[1][0] = player.celestials.alpha.records.records.recentEternities[1][0];
      player.records.recentEternities[1][1] = player.celestials.alpha.records.records.recentEternities[1][1];
      player.records.recentEternities[1][2] = player.celestials.alpha.records.records.recentEternities[1][2];
      player.records.recentEternities[1][3] = player.celestials.alpha.records.records.recentEternities[1][3];
      player.records.recentEternities[1][4] = player.celestials.alpha.records.records.recentEternities[1][4];
      player.records.recentEternities[1][5] = player.celestials.alpha.records.records.recentEternities[1][5];
      player.records.recentEternities[2][0] = player.celestials.alpha.records.records.recentEternities[2][0];
      player.records.recentEternities[2][1] = player.celestials.alpha.records.records.recentEternities[2][1];
      player.records.recentEternities[2][2] = player.celestials.alpha.records.records.recentEternities[2][2];
      player.records.recentEternities[2][3] = player.celestials.alpha.records.records.recentEternities[2][3];
      player.records.recentEternities[2][4] = player.celestials.alpha.records.records.recentEternities[2][4];
      player.records.recentEternities[2][5] = player.celestials.alpha.records.records.recentEternities[2][5];
      player.records.recentEternities[3][0] = player.celestials.alpha.records.records.recentEternities[3][0];
      player.records.recentEternities[3][1] = player.celestials.alpha.records.records.recentEternities[3][1];
      player.records.recentEternities[3][2] = player.celestials.alpha.records.records.recentEternities[3][2];
      player.records.recentEternities[3][3] = player.celestials.alpha.records.records.recentEternities[3][3];
      player.records.recentEternities[3][4] = player.celestials.alpha.records.records.recentEternities[3][4];
      player.records.recentEternities[3][5] = player.celestials.alpha.records.records.recentEternities[3][5];
      player.records.recentEternities[4][0] = player.celestials.alpha.records.records.recentEternities[4][0];
      player.records.recentEternities[4][1] = player.celestials.alpha.records.records.recentEternities[4][1];
      player.records.recentEternities[4][2] = player.celestials.alpha.records.records.recentEternities[4][2];
      player.records.recentEternities[4][3] = player.celestials.alpha.records.records.recentEternities[4][3];
      player.records.recentEternities[4][4] = player.celestials.alpha.records.records.recentEternities[4][4];
      player.records.recentEternities[4][5] = player.celestials.alpha.records.records.recentEternities[4][5];
      player.records.recentEternities[5][0] = player.celestials.alpha.records.records.recentEternities[5][0];
      player.records.recentEternities[5][1] = player.celestials.alpha.records.records.recentEternities[5][1];
      player.records.recentEternities[5][2] = player.celestials.alpha.records.records.recentEternities[5][2];
      player.records.recentEternities[5][3] = player.celestials.alpha.records.records.recentEternities[5][3];
      player.records.recentEternities[5][4] = player.celestials.alpha.records.records.recentEternities[5][4];
      player.records.recentEternities[5][5] = player.celestials.alpha.records.records.recentEternities[5][5];
      player.records.recentEternities[6][0] = player.celestials.alpha.records.records.recentEternities[6][0];
      player.records.recentEternities[6][1] = player.celestials.alpha.records.records.recentEternities[6][1];
      player.records.recentEternities[6][2] = player.celestials.alpha.records.records.recentEternities[6][2];
      player.records.recentEternities[6][3] = player.celestials.alpha.records.records.recentEternities[6][3];
      player.records.recentEternities[6][4] = player.celestials.alpha.records.records.recentEternities[6][4];
      player.records.recentEternities[6][5] = player.celestials.alpha.records.records.recentEternities[6][5];
      player.records.recentEternities[7][0] = player.celestials.alpha.records.records.recentEternities[7][0];
      player.records.recentEternities[7][1] = player.celestials.alpha.records.records.recentEternities[7][1];
      player.records.recentEternities[7][2] = player.celestials.alpha.records.records.recentEternities[7][2];
      player.records.recentEternities[7][3] = player.celestials.alpha.records.records.recentEternities[7][3];
      player.records.recentEternities[7][4] = player.celestials.alpha.records.records.recentEternities[7][4];
      player.records.recentEternities[7][5] = player.celestials.alpha.records.records.recentEternities[7][5];
      player.records.recentEternities[8][0] = player.celestials.alpha.records.records.recentEternities[8][0];
      player.records.recentEternities[8][1] = player.celestials.alpha.records.records.recentEternities[8][1];
      player.records.recentEternities[8][2] = player.celestials.alpha.records.records.recentEternities[8][2];
      player.records.recentEternities[8][3] = player.celestials.alpha.records.records.recentEternities[8][3];
      player.records.recentEternities[8][4] = player.celestials.alpha.records.records.recentEternities[8][4];
      player.records.recentEternities[8][5] = player.celestials.alpha.records.records.recentEternities[8][5];
      player.records.recentEternities[9][0] = player.celestials.alpha.records.records.recentEternities[9][0];
      player.records.recentEternities[9][1] = player.celestials.alpha.records.records.recentEternities[9][1];
      player.records.recentEternities[9][2] = player.celestials.alpha.records.records.recentEternities[9][2];
      player.records.recentEternities[9][3] = player.celestials.alpha.records.records.recentEternities[9][3];
      player.records.recentEternities[9][4] = player.celestials.alpha.records.records.recentEternities[9][4];
      player.records.recentEternities[9][5] = player.celestials.alpha.records.records.recentEternities[9][5];
      player.records.thisInfinity.time = player.celestials.alpha.records.records.thisInfinity.time;
      player.records.thisInfinity.realTime = player.celestials.alpha.records.records.thisInfinity.realTime;
      player.records.thisInfinity.lastBuyTime = player.celestials.alpha.records.records.thisInfinity.lastBuyTime;
      player.records.thisInfinity.maxAM = player.celestials.alpha.records.records.thisInfinity.maxAM;
      player.records.thisInfinity.bestIPmin = player.celestials.alpha.records.records.thisInfinity.bestIPmin;
      player.records.thisInfinity.bestIPminVal = player.celestials.alpha.records.records.thisInfinity.bestIPminVal;
      player.records.bestInfinity.time = player.celestials.alpha.records.records.bestInfinity.time;
      player.records.bestInfinity.realTime = player.celestials.alpha.records.records.bestInfinity.realTime;
      player.records.bestInfinity.bestIPminEternity = player.celestials.alpha.records.records.bestInfinity.bestIPminEternity;
      player.records.bestInfinity.bestIPminReality = player.celestials.alpha.records.records.bestInfinity.bestIPminReality;
      player.records.thisEternity.time = player.celestials.alpha.records.records.thisEternity.time;
      player.records.thisEternity.realTime = player.celestials.alpha.records.records.thisEternity.realTime;
      player.records.thisEternity.maxAM = player.celestials.alpha.records.records.thisEternity.maxAM;
      player.records.thisEternity.maxIP = player.celestials.alpha.records.records.thisEternity.maxIP;
      player.records.thisEternity.bestIPMsWithoutMaxAll = player.celestials.alpha.records.records.thisEternity.bestIPMsWithoutMaxAll;
      player.records.thisEternity.bestEPmin = player.celestials.alpha.records.records.thisEternity.bestEPmin;
      player.records.thisEternity.bestEPminVal = player.celestials.alpha.records.records.thisEternity.bestEPminVal;
      player.records.thisEternity.bestInfinitiesPerMs = player.celestials.alpha.records.records.thisEternity.bestInfinitiesPerMs;
      player.records.bestEternity.time = player.celestials.alpha.records.records.bestEternity.time;
      player.records.bestEternity.realTime = player.celestials.alpha.records.records.bestEternity.realTime;
      player.records.bestEternity.bestEPminReality = player.celestials.alpha.records.records.bestEternity.bestEPminReality;
      player.records.thisReality.time = player.celestials.alpha.records.records.thisReality.time;
      player.records.thisReality.realTime = player.celestials.alpha.records.records.thisReality.realTime;
      player.records.thisReality.maxAM = player.celestials.alpha.records.records.thisReality.maxAM;
      player.records.thisReality.maxIP = player.celestials.alpha.records.records.thisReality.maxIP;
      player.records.thisReality.maxEP = player.celestials.alpha.records.records.thisReality.maxEP;
      player.records.thisReality.bestEternitiesPerMs = player.celestials.alpha.records.records.thisReality.bestEternitiesPerMs;
      player.records.thisReality.maxReplicanti = player.celestials.alpha.records.records.thisReality.maxReplicanti;
      player.records.thisReality.maxDT = player.celestials.alpha.records.records.thisReality.maxDT;
      player.records.thisReality.bestRSmin = player.celestials.alpha.records.records.thisReality.bestRSmin;
      player.records.thisReality.bestRSminVal = player.celestials.alpha.records.records.thisReality.bestRSminVal;
      player.records.thisReality.galaxies = player.celestials.alpha.records.records.thisReality.galaxies;
      player.IPMultPurchases = player.celestials.alpha.records.IPMultPurchases;
      player.infinityPower = player.celestials.alpha.records.infinityPower;
      player.postC4Tier = player.celestials.alpha.records.postC4Tier;
      player.eternityPoints = player.celestials.alpha.records.eternityPoints;
      player.eternities = player.celestials.alpha.records.eternities;
      player.eternityUpgrades = new Set(player.celestials.alpha.records.eternityUpgrades);
      player.epmultUpgrades = player.celestials.alpha.records.epmultUpgrades;
      player.timeShards = player.celestials.alpha.records.timeShards;
      player.totalTickGained = player.celestials.alpha.records.totalTickGained;
      player.totalTickBought = player.celestials.alpha.records.totalTickBought;
      player.replicanti.unl = player.celestials.alpha.records.replicanti.unl;
      player.replicanti.amount = player.celestials.alpha.records.replicanti.amount;
      player.replicanti.chance = player.celestials.alpha.records.replicanti.chance;
      player.replicanti.chanceCost = player.celestials.alpha.records.replicanti.chanceCost;
      player.replicanti.interval = player.celestials.alpha.records.replicanti.interval;
      player.replicanti.intervalCost = player.celestials.alpha.records.replicanti.intervalCost;
      player.replicanti.boughtGalaxyCap = player.celestials.alpha.records.replicanti.boughtGalaxyCap;
      player.replicanti.galaxies = player.celestials.alpha.records.replicanti.galaxies;
      player.replicanti.galCost = player.celestials.alpha.records.replicanti.galCost;
      player.timestudy.theorem = player.celestials.alpha.records.timestudy.theorem;
      player.timestudy.maxTheorem = player.celestials.alpha.records.timestudy.maxTheorem;
      player.timestudy.amBought = player.celestials.alpha.records.timestudy.amBought;
      player.timestudy.ipBought = player.celestials.alpha.records.timestudy.ipBought;
      player.timestudy.epBought = player.celestials.alpha.records.timestudy.epBought;
      player.eternityChalls.eterc1 = player.celestials.alpha.records.eternityChalls.eterc1;
      player.eternityChalls.eterc2 = player.celestials.alpha.records.eternityChalls.eterc2;
      player.eternityChalls.eterc3 = player.celestials.alpha.records.eternityChalls.eterc3;
      player.eternityChalls.eterc4 = player.celestials.alpha.records.eternityChalls.eterc4;
      player.eternityChalls.eterc5 = player.celestials.alpha.records.eternityChalls.eterc5;
      player.eternityChalls.eterc6 = player.celestials.alpha.records.eternityChalls.eterc6;
      player.eternityChalls.eterc7 = player.celestials.alpha.records.eternityChalls.eterc7;
      player.eternityChalls.eterc8 = player.celestials.alpha.records.eternityChalls.eterc8;
      player.eternityChalls.eterc9 = player.celestials.alpha.records.eternityChalls.eterc9;
      player.eternityChalls.eterc10 = player.celestials.alpha.records.eternityChalls.eterc10;
      player.eternityChalls.eterc11 = player.celestials.alpha.records.eternityChalls.eterc11;
      player.eternityChalls.eterc12 = player.celestials.alpha.records.eternityChalls.eterc12;
      player.respec = player.celestials.alpha.records.respec;
      player.eterc8ids = player.celestials.alpha.records.eterc8ids;
      player.eterc8repl = player.celestials.alpha.records.eterc8repl;
      for (let ts = 0; ts < 305; ts++) {
        if (player.celestials.alpha.records.timestudy.studies.includes(ts)) {
          player.timestudy.studies.push(ts);
          GameCache.timeStudies.invalidate();
          TimeStudyTree.commitToGameState([TimeStudy(ts)]);
        }
      }
      for (let dts = 0; dts < 7; dts++) {
        if (player.celestials.alpha.records.dilation.studies.includes(dts)) {
          player.dilation.studies.push(dts);
        }
      }
      player.dilation.active = player.celestials.alpha.records.dilation.active;
      player.dilation.tachyonParticles = player.celestials.alpha.records.dilation.tachyonParticles;
      player.dilation.dilatedTime = player.celestials.alpha.records.dilation.dilatedTime;
      player.dilation.nextThreshold = player.celestials.alpha.records.dilation.nextThreshold;
      player.dilation.baseTachyonGalaxies = player.celestials.alpha.records.dilation.baseTachyonGalaxies;
      player.dilation.totalTachyonGalaxies = player.celestials.alpha.records.dilation.totalTachyonGalaxies;
      player.dilation.upgrades = new Set(player.celestials.alpha.records.dilation.upgrades);
      player.dilation.rebuyables[1] = player.celestials.alpha.records.dilation.rebuyables[1];
      player.dilation.rebuyables[2] = player.celestials.alpha.records.dilation.rebuyables[2];
      player.dilation.rebuyables[3] = player.celestials.alpha.records.dilation.rebuyables[3];
      player.dilation.rebuyables[11] = player.celestials.alpha.records.dilation.rebuyables[11];
      player.dilation.rebuyables[12] = player.celestials.alpha.records.dilation.rebuyables[12];
      player.dilation.rebuyables[13] = player.celestials.alpha.records.dilation.rebuyables[13];
      player.dilation.lastEP = player.celestials.alpha.records.dilation.lastEP;
      for (let sts = 0; sts < 305; sts++) {
        if (player.celestials.alpha.records.timestudy.studies.includes(sts) && !TimeStudy(sts).isBought) {
          player.timestudy.studies.push(sts);
          GameCache.timeStudies.invalidate();
          TimeStudyTree.commitToGameState([TimeStudy(sts)]);
        }
      }
      for (let sdts = 0; sdts < 7; sdts++) {
        if (player.celestials.alpha.records.dilation.studies.includes(sdts) && !DilationTimeStudyState.studies[sdts].isBought) {
          player.dilation.studies.push(sdts);
        }
      }
      player.celestials.alpha.records.timestudy.studies = [];
      player.celestials.alpha.records.dilation.studies = [];
    }
  },
  escapeTheMatrix() {
    player.celestials.alpha.records.antimatter = player.antimatter;
    player.celestials.alpha.records.dimensions.antimatter[0].bought = player.dimensions.antimatter[0].bought;
    player.celestials.alpha.records.dimensions.antimatter[0].costBumps = player.dimensions.antimatter[0].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[0].amount = player.dimensions.antimatter[0].amount;
    player.celestials.alpha.records.dimensions.antimatter[1].bought = player.dimensions.antimatter[1].bought;
    player.celestials.alpha.records.dimensions.antimatter[1].costBumps = player.dimensions.antimatter[1].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[1].amount = player.dimensions.antimatter[1].amount;
    player.celestials.alpha.records.dimensions.antimatter[2].bought = player.dimensions.antimatter[2].bought;
    player.celestials.alpha.records.dimensions.antimatter[2].costBumps = player.dimensions.antimatter[2].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[2].amount = player.dimensions.antimatter[2].amount;
    player.celestials.alpha.records.dimensions.antimatter[3].bought = player.dimensions.antimatter[3].bought;
    player.celestials.alpha.records.dimensions.antimatter[3].costBumps = player.dimensions.antimatter[3].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[3].amount = player.dimensions.antimatter[3].amount;
    player.celestials.alpha.records.dimensions.antimatter[4].bought = player.dimensions.antimatter[4].bought;
    player.celestials.alpha.records.dimensions.antimatter[4].costBumps = player.dimensions.antimatter[4].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[4].amount = player.dimensions.antimatter[4].amount;
    player.celestials.alpha.records.dimensions.antimatter[5].bought = player.dimensions.antimatter[5].bought;
    player.celestials.alpha.records.dimensions.antimatter[5].costBumps = player.dimensions.antimatter[5].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[5].amount = player.dimensions.antimatter[5].amount;
    player.celestials.alpha.records.dimensions.antimatter[6].bought = player.dimensions.antimatter[6].bought;
    player.celestials.alpha.records.dimensions.antimatter[6].costBumps = player.dimensions.antimatter[6].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[6].amount = player.dimensions.antimatter[6].amount;
    player.celestials.alpha.records.dimensions.antimatter[7].bought = player.dimensions.antimatter[7].bought;
    player.celestials.alpha.records.dimensions.antimatter[7].costBumps = player.dimensions.antimatter[7].costBumps;
    player.celestials.alpha.records.dimensions.antimatter[7].amount = player.dimensions.antimatter[7].amount;
    player.celestials.alpha.records.dimensions.infinity[0].isUnlocked = player.dimensions.infinity[0].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[0].bought = player.dimensions.infinity[0].bought;
    player.celestials.alpha.records.dimensions.infinity[0].amount = player.dimensions.infinity[0].amount;
    player.celestials.alpha.records.dimensions.infinity[0].cost = player.dimensions.infinity[0].cost;
    player.celestials.alpha.records.dimensions.infinity[0].baseAmount = player.dimensions.infinity[0].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[1].isUnlocked = player.dimensions.infinity[1].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[1].bought = player.dimensions.infinity[1].bought;
    player.celestials.alpha.records.dimensions.infinity[1].amount = player.dimensions.infinity[1].amount;
    player.celestials.alpha.records.dimensions.infinity[1].cost = player.dimensions.infinity[1].cost;
    player.celestials.alpha.records.dimensions.infinity[1].baseAmount = player.dimensions.infinity[1].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[2].isUnlocked = player.dimensions.infinity[2].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[2].bought = player.dimensions.infinity[2].bought;
    player.celestials.alpha.records.dimensions.infinity[2].amount = player.dimensions.infinity[2].amount;
    player.celestials.alpha.records.dimensions.infinity[2].cost = player.dimensions.infinity[2].cost;
    player.celestials.alpha.records.dimensions.infinity[2].baseAmount = player.dimensions.infinity[2].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[3].isUnlocked = player.dimensions.infinity[3].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[3].bought = player.dimensions.infinity[3].bought;
    player.celestials.alpha.records.dimensions.infinity[3].amount = player.dimensions.infinity[3].amount;
    player.celestials.alpha.records.dimensions.infinity[3].cost = player.dimensions.infinity[3].cost;
    player.celestials.alpha.records.dimensions.infinity[3].baseAmount = player.dimensions.infinity[3].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[4].isUnlocked = player.dimensions.infinity[4].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[4].bought = player.dimensions.infinity[4].bought;
    player.celestials.alpha.records.dimensions.infinity[4].amount = player.dimensions.infinity[4].amount;
    player.celestials.alpha.records.dimensions.infinity[4].cost = player.dimensions.infinity[4].cost;
    player.celestials.alpha.records.dimensions.infinity[4].baseAmount = player.dimensions.infinity[4].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[5].isUnlocked = player.dimensions.infinity[5].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[5].bought = player.dimensions.infinity[5].bought;
    player.celestials.alpha.records.dimensions.infinity[5].amount = player.dimensions.infinity[5].amount;
    player.celestials.alpha.records.dimensions.infinity[5].cost = player.dimensions.infinity[5].cost;
    player.celestials.alpha.records.dimensions.infinity[5].baseAmount = player.dimensions.infinity[5].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[6].isUnlocked = player.dimensions.infinity[6].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[6].bought = player.dimensions.infinity[6].bought;
    player.celestials.alpha.records.dimensions.infinity[6].amount = player.dimensions.infinity[6].amount;
    player.celestials.alpha.records.dimensions.infinity[6].cost = player.dimensions.infinity[6].cost;
    player.celestials.alpha.records.dimensions.infinity[6].baseAmount = player.dimensions.infinity[6].baseAmount;
    player.celestials.alpha.records.dimensions.infinity[7].isUnlocked = player.dimensions.infinity[7].isUnlocked;
    player.celestials.alpha.records.dimensions.infinity[7].bought = player.dimensions.infinity[7].bought;
    player.celestials.alpha.records.dimensions.infinity[7].amount = player.dimensions.infinity[7].amount;
    player.celestials.alpha.records.dimensions.infinity[7].cost = player.dimensions.infinity[7].cost;
    player.celestials.alpha.records.dimensions.infinity[7].baseAmount = player.dimensions.infinity[7].baseAmount;
    player.celestials.alpha.records.dimensions.time[0].cost = player.dimensions.time[0].cost;
    player.celestials.alpha.records.dimensions.time[0].amount = player.dimensions.time[0].amount;
    player.celestials.alpha.records.dimensions.time[0].bought = player.dimensions.time[0].bought;
    player.celestials.alpha.records.dimensions.time[1].cost = player.dimensions.time[1].cost;
    player.celestials.alpha.records.dimensions.time[1].amount = player.dimensions.time[1].amount;
    player.celestials.alpha.records.dimensions.time[1].bought = player.dimensions.time[1].bought;
    player.celestials.alpha.records.dimensions.time[2].cost = player.dimensions.time[2].cost;
    player.celestials.alpha.records.dimensions.time[2].amount = player.dimensions.time[2].amount;
    player.celestials.alpha.records.dimensions.time[2].bought = player.dimensions.time[2].bought;
    player.celestials.alpha.records.dimensions.time[3].cost = player.dimensions.time[3].cost;
    player.celestials.alpha.records.dimensions.time[3].amount = player.dimensions.time[3].amount;
    player.celestials.alpha.records.dimensions.time[3].bought = player.dimensions.time[3].bought;
    player.celestials.alpha.records.dimensions.time[4].cost = player.dimensions.time[4].cost;
    player.celestials.alpha.records.dimensions.time[4].amount = player.dimensions.time[4].amount;
    player.celestials.alpha.records.dimensions.time[4].bought = player.dimensions.time[4].bought;
    player.celestials.alpha.records.dimensions.time[5].cost = player.dimensions.time[5].cost;
    player.celestials.alpha.records.dimensions.time[5].amount = player.dimensions.time[5].amount;
    player.celestials.alpha.records.dimensions.time[5].bought = player.dimensions.time[5].bought;
    player.celestials.alpha.records.dimensions.time[6].cost = player.dimensions.time[6].cost;
    player.celestials.alpha.records.dimensions.time[6].amount = player.dimensions.time[6].amount;
    player.celestials.alpha.records.dimensions.time[6].bought = player.dimensions.time[6].bought;
    player.celestials.alpha.records.dimensions.time[7].cost = player.dimensions.time[7].cost;
    player.celestials.alpha.records.dimensions.time[7].amount = player.dimensions.time[7].amount;
    player.celestials.alpha.records.dimensions.time[7].bought = player.dimensions.time[7].bought;
    player.celestials.alpha.records.buyUntil10 = player.buyUntil10;
    player.celestials.alpha.records.sacrificed = player.sacrificed;
    player.celestials.alpha.records.infinityUpgrades = new Set(player.infinityUpgrades);
    player.celestials.alpha.records.infinityRebuyables[0] = player.infinityRebuyables[0];
    player.celestials.alpha.records.infinityRebuyables[1] = player.infinityRebuyables[1];
    player.celestials.alpha.records.infinityRebuyables[2] = player.infinityRebuyables[2];
    player.celestials.alpha.records.challenge.normal.current = player.challenge.normal.current;
    player.celestials.alpha.records.challenge.normal.bestTimes[0] = player.challenge.normal.bestTimes[0];
    player.celestials.alpha.records.challenge.normal.bestTimes[1] = player.challenge.normal.bestTimes[1];
    player.celestials.alpha.records.challenge.normal.bestTimes[2] = player.challenge.normal.bestTimes[2];
    player.celestials.alpha.records.challenge.normal.bestTimes[3] = player.challenge.normal.bestTimes[3];
    player.celestials.alpha.records.challenge.normal.bestTimes[4] = player.challenge.normal.bestTimes[4];
    player.celestials.alpha.records.challenge.normal.bestTimes[5] = player.challenge.normal.bestTimes[5];
    player.celestials.alpha.records.challenge.normal.bestTimes[6] = player.challenge.normal.bestTimes[6];
    player.celestials.alpha.records.challenge.normal.bestTimes[7] = player.challenge.normal.bestTimes[7];
    player.celestials.alpha.records.challenge.normal.bestTimes[8] = player.challenge.normal.bestTimes[8];
    player.celestials.alpha.records.challenge.normal.bestTimes[9] = player.challenge.normal.bestTimes[9];
    player.celestials.alpha.records.challenge.normal.bestTimes[10] = player.challenge.normal.bestTimes[10];
    player.celestials.alpha.records.challenge.normal.completedBits = player.challenge.normal.completedBits;
    player.celestials.alpha.records.challenge.infinity.current = player.challenge.infinity.current;
    player.celestials.alpha.records.challenge.infinity.bestTimes[0] = player.challenge.infinity.bestTimes[0];
    player.celestials.alpha.records.challenge.infinity.bestTimes[1] = player.challenge.infinity.bestTimes[1];
    player.celestials.alpha.records.challenge.infinity.bestTimes[2] = player.challenge.infinity.bestTimes[2];
    player.celestials.alpha.records.challenge.infinity.bestTimes[3] = player.challenge.infinity.bestTimes[3];
    player.celestials.alpha.records.challenge.infinity.bestTimes[4] = player.challenge.infinity.bestTimes[4];
    player.celestials.alpha.records.challenge.infinity.bestTimes[5] = player.challenge.infinity.bestTimes[5];
    player.celestials.alpha.records.challenge.infinity.bestTimes[6] = player.challenge.infinity.bestTimes[6];
    player.celestials.alpha.records.challenge.infinity.bestTimes[7] = player.challenge.infinity.bestTimes[7];
    player.celestials.alpha.records.challenge.infinity.completedBits = player.challenge.infinity.completedBits;
    player.celestials.alpha.records.challenge.eternity.current = player.challenge.eternity.current;
    player.celestials.alpha.records.challenge.eternity.unlocked = player.challenge.eternity.unlocked;
    player.celestials.alpha.records.challenge.eternity.requirementBits = player.challenge.eternity.requirementBits;
    player.celestials.alpha.records.infinity.upgradeBits = player.infinity.upgradeBits;
    player.celestials.alpha.records.auto.autobuyersOn = player.auto.autobuyersOn;
    player.celestials.alpha.records.auto.disableContinuum = player.auto.disableContinuum;
    player.celestials.alpha.records.auto.eternity.amount = player.auto.eternity.amount;
    player.celestials.alpha.records.auto.eternity.increaseWithMult = player.auto.eternity.increaseWithMult;
    player.celestials.alpha.records.auto.eternity.time = player.auto.eternity.time;
    player.celestials.alpha.records.auto.eternity.xHighest = player.auto.eternity.xHighest;
    player.celestials.alpha.records.auto.eternity.isActive = player.auto.eternity.isActive;
    player.celestials.alpha.records.auto.bigCrunch.cost = player.auto.bigCrunch.cost;
    player.celestials.alpha.records.auto.bigCrunch.interval = player.auto.bigCrunch.interval;
    player.celestials.alpha.records.auto.bigCrunch.mode = player.auto.bigCrunch.mode;
    player.celestials.alpha.records.auto.bigCrunch.amount = player.auto.bigCrunch.amount;
    player.celestials.alpha.records.auto.bigCrunch.increaseWithMult = player.auto.bigCrunch.increaseWithMult;
    player.celestials.alpha.records.auto.bigCrunch.time = player.auto.bigCrunch.time;
    player.celestials.alpha.records.auto.bigCrunch.xHighest = player.auto.bigCrunch.xHighest;
    player.celestials.alpha.records.auto.bigCrunch.isActive = player.auto.bigCrunch.isActive;
    player.celestials.alpha.records.auto.bigCrunch.lastTick = player.auto.bigCrunch.lastTick;
    player.celestials.alpha.records.auto.galaxy.cost = player.auto.galaxy.cost;
    player.celestials.alpha.records.auto.galaxy.interval = player.auto.galaxy.interval;
    player.celestials.alpha.records.auto.galaxy.limitGalaxies = player.auto.galaxy.limitGalaxies;
    player.celestials.alpha.records.auto.galaxy.maxGalaxies = player.auto.galaxy.maxGalaxies;
    player.celestials.alpha.records.auto.galaxy.buyMax = player.auto.galaxy.buyMax;
    player.celestials.alpha.records.auto.galaxy.buyMaxInterval = player.auto.galaxy.buyMaxInterval;
    player.celestials.alpha.records.auto.galaxy.isActive = player.auto.galaxy.isActive;
    player.celestials.alpha.records.auto.galaxy.lastTick = player.auto.galaxy.lastTick;
    player.celestials.alpha.records.auto.dimBoost.cost = player.auto.dimBoost.cost;
    player.celestials.alpha.records.auto.dimBoost.interval = player.auto.dimBoost.interval;
    player.celestials.alpha.records.auto.dimBoost.limitDimBoosts = player.auto.dimBoost.limitDimBoosts;
    player.celestials.alpha.records.auto.dimBoost.maxDimBoosts = Number(player.auto.dimBoost.maxDimBoosts);
    player.celestials.alpha.records.auto.dimBoost.limitUntilGalaxies = player.auto.dimBoost.limitUntilGalaxies;
    player.celestials.alpha.records.auto.dimBoost.galaxies = player.auto.dimBoost.galaxies;
    player.celestials.alpha.records.auto.dimBoost.buyMaxInterval = player.auto.dimBoost.buyMaxInterval;
    player.celestials.alpha.records.auto.dimBoost.isActive = player.auto.dimBoost.isActive;
    player.celestials.alpha.records.auto.dimBoost.lastTick = player.auto.dimBoost.lastTick;
    player.celestials.alpha.records.auto.tickspeed.isUnlocked = player.auto.tickspeed.isUnlocked;
    player.celestials.alpha.records.auto.tickspeed.cost = player.auto.tickspeed.cost;
    player.celestials.alpha.records.auto.tickspeed.interval = player.auto.tickspeed.interval;
    player.celestials.alpha.records.auto.tickspeed.mode = player.auto.tickspeed.mode;
    player.celestials.alpha.records.auto.tickspeed.isActive = player.auto.tickspeed.isActive;
    player.celestials.alpha.records.auto.tickspeed.lastTick = player.auto.tickspeed.lastTick;
    player.celestials.alpha.records.auto.tickspeed.isBought = player.auto.tickspeed.isBought;
    player.celestials.alpha.records.auto.sacrifice.multiplier = player.auto.sacrifice.multiplier;
    player.celestials.alpha.records.auto.sacrifice.isActive = player.auto.sacrifice.isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[0].isUnlocked = player.auto.antimatterDims.all[0].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[0].cost = player.auto.antimatterDims.all[0].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[0].interval = player.auto.antimatterDims.all[0].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[0].bulk = player.auto.antimatterDims.all[0].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[0].mode = player.auto.antimatterDims.all[0].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[0].isActive = player.auto.antimatterDims.all[0].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[0].lastTick = player.auto.antimatterDims.all[0].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[0].isBought = player.auto.antimatterDims.all[0].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[1].isUnlocked = player.auto.antimatterDims.all[1].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[1].cost = player.auto.antimatterDims.all[1].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[1].interval = player.auto.antimatterDims.all[1].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[1].bulk = player.auto.antimatterDims.all[1].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[1].mode = player.auto.antimatterDims.all[1].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[1].isActive = player.auto.antimatterDims.all[1].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[1].lastTick = player.auto.antimatterDims.all[1].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[1].isBought = player.auto.antimatterDims.all[1].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[2].isUnlocked = player.auto.antimatterDims.all[2].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[2].cost = player.auto.antimatterDims.all[2].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[2].interval = player.auto.antimatterDims.all[2].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[2].bulk = player.auto.antimatterDims.all[2].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[2].mode = player.auto.antimatterDims.all[2].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[2].isActive = player.auto.antimatterDims.all[2].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[2].lastTick = player.auto.antimatterDims.all[2].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[2].isBought = player.auto.antimatterDims.all[2].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[3].isUnlocked = player.auto.antimatterDims.all[3].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[3].cost = player.auto.antimatterDims.all[3].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[3].interval = player.auto.antimatterDims.all[3].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[3].bulk = player.auto.antimatterDims.all[3].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[3].mode = player.auto.antimatterDims.all[3].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[3].isActive = player.auto.antimatterDims.all[3].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[3].lastTick = player.auto.antimatterDims.all[3].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[3].isBought = player.auto.antimatterDims.all[3].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[4].isUnlocked = player.auto.antimatterDims.all[4].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[4].cost = player.auto.antimatterDims.all[4].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[4].interval = player.auto.antimatterDims.all[4].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[4].bulk = player.auto.antimatterDims.all[4].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[4].mode = player.auto.antimatterDims.all[4].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[4].isActive = player.auto.antimatterDims.all[4].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[4].lastTick = player.auto.antimatterDims.all[4].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[4].isBought = player.auto.antimatterDims.all[4].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[5].isUnlocked = player.auto.antimatterDims.all[5].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[5].cost = player.auto.antimatterDims.all[5].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[5].interval = player.auto.antimatterDims.all[5].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[5].bulk = player.auto.antimatterDims.all[5].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[5].mode = player.auto.antimatterDims.all[5].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[5].isActive = player.auto.antimatterDims.all[5].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[5].lastTick = player.auto.antimatterDims.all[5].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[5].isBought = player.auto.antimatterDims.all[5].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[6].isUnlocked = player.auto.antimatterDims.all[6].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[6].cost = player.auto.antimatterDims.all[6].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[6].interval = player.auto.antimatterDims.all[6].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[6].bulk = player.auto.antimatterDims.all[6].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[6].mode = player.auto.antimatterDims.all[6].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[6].isActive = player.auto.antimatterDims.all[6].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[6].lastTick = player.auto.antimatterDims.all[6].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[6].isBought = player.auto.antimatterDims.all[6].isBought;
    player.celestials.alpha.records.auto.antimatterDims.all[7].isUnlocked = player.auto.antimatterDims.all[7].isUnlocked;
    player.celestials.alpha.records.auto.antimatterDims.all[7].cost = player.auto.antimatterDims.all[7].cost;
    player.celestials.alpha.records.auto.antimatterDims.all[7].interval = player.auto.antimatterDims.all[7].interval;
    player.celestials.alpha.records.auto.antimatterDims.all[7].bulk = player.auto.antimatterDims.all[7].bulk;
    player.celestials.alpha.records.auto.antimatterDims.all[7].mode = player.auto.antimatterDims.all[7].mode;
    player.celestials.alpha.records.auto.antimatterDims.all[7].isActive = player.auto.antimatterDims.all[7].isActive;
    player.celestials.alpha.records.auto.antimatterDims.all[7].lastTick = player.auto.antimatterDims.all[7].lastTick;
    player.celestials.alpha.records.auto.antimatterDims.all[7].isBought = player.auto.antimatterDims.all[7].isBought;
    player.celestials.alpha.records.auto.antimatterDims.isActive = player.auto.antimatterDims.isActive;
    player.celestials.alpha.records.auto.infinityDims.all[0].isActive = player.auto.infinityDims.all[0].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[0].lastTick = player.auto.infinityDims.all[0].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[1].isActive = player.auto.infinityDims.all[1].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[1].lastTick = player.auto.infinityDims.all[1].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[2].isActive = player.auto.infinityDims.all[2].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[2].lastTick = player.auto.infinityDims.all[2].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[3].isActive = player.auto.infinityDims.all[3].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[3].lastTick = player.auto.infinityDims.all[3].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[4].isActive = player.auto.infinityDims.all[4].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[4].lastTick = player.auto.infinityDims.all[4].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[5].isActive = player.auto.infinityDims.all[5].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[5].lastTick = player.auto.infinityDims.all[5].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[6].isActive = player.auto.infinityDims.all[6].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[6].lastTick = player.auto.infinityDims.all[6].lastTick;
    player.celestials.alpha.records.auto.infinityDims.all[7].isActive = player.auto.infinityDims.all[7].isActive;
    player.celestials.alpha.records.auto.infinityDims.all[7].lastTick = player.auto.infinityDims.all[7].lastTick;
    player.celestials.alpha.records.auto.infinityDims.isActive = player.auto.infinityDims.isActive;
    player.celestials.alpha.records.auto.replicantiGalaxies.isActive = player.auto.replicantiGalaxies.isActive;
    player.celestials.alpha.records.auto.replicantiUpgrades.all[0].isActive = player.auto.replicantiUpgrades.all[0].isActive;
    player.celestials.alpha.records.auto.replicantiUpgrades.all[0].lastTick = player.auto.replicantiUpgrades.all[0].lastTick;
    player.celestials.alpha.records.auto.replicantiUpgrades.all[1].isActive = player.auto.replicantiUpgrades.all[1].isActive;
    player.celestials.alpha.records.auto.replicantiUpgrades.all[1].lastTick = player.auto.replicantiUpgrades.all[1].lastTick;
    player.celestials.alpha.records.auto.replicantiUpgrades.all[2].isActive = player.auto.replicantiUpgrades.all[2].isActive;
    player.celestials.alpha.records.auto.replicantiUpgrades.all[2].lastTick = player.auto.replicantiUpgrades.all[2].lastTick;
    player.celestials.alpha.records.auto.replicantiUpgrades.isActive = player.auto.replicantiUpgrades.isActive;
    player.celestials.alpha.records.auto.ipMultBuyer.isActive = player.auto.ipMultBuyer.isActive;
    player.celestials.alpha.records.infinityPoints = player.infinityPoints;
    player.celestials.alpha.records.infinities = player.infinities;
    player.celestials.alpha.records.infinitiesBanked = player.infinitiesBanked;
    player.celestials.alpha.records.dimensionBoosts = player.dimensionBoosts;
    player.celestials.alpha.records.galaxies = player.galaxies;
    player.celestials.alpha.records.chall2Pow = player.chall2Pow;
    player.celestials.alpha.records.chall3Pow = player.chall3Pow;
    player.celestials.alpha.records.matter = player.matter;
    player.celestials.alpha.records.chall9TickspeedCostBumps = player.chall9TickspeedCostBumps;
    player.celestials.alpha.records.chall8TotalSacrifice = player.chall8TotalSacrifice;
    player.celestials.alpha.records.ic2Count = player.ic2Count;
    player.celestials.alpha.records.partInfinityPoint = player.partInfinityPoint;
    player.celestials.alpha.records.partInfinitied = player.partInfinitied;
    player.celestials.alpha.records.break = player.break;
    player.celestials.alpha.records.requirementChecks.infinity.maxAll = player.requirementChecks.infinity.maxAll;
    player.celestials.alpha.records.requirementChecks.infinity.noSacrifice = player.requirementChecks.infinity.noSacrifice;
    player.celestials.alpha.records.requirementChecks.infinity.noAD8 = player.requirementChecks.infinity.noAD8;
    player.celestials.alpha.records.requirementChecks.eternity.onlyAD1 = player.requirementChecks.eternity.onlyAD1;
    player.celestials.alpha.records.requirementChecks.eternity.onlyAD8 = player.requirementChecks.eternity.onlyAD8;
    player.celestials.alpha.records.requirementChecks.eternity.noAD1 = player.requirementChecks.eternity.noAD1;
    player.celestials.alpha.records.requirementChecks.eternity.noRG = player.requirementChecks.eternity.noRG;
    player.celestials.alpha.records.records.totalTimePlayed = player.records.totalTimePlayed;
    player.celestials.alpha.records.records.totalEndgameAntimatter = player.records.totalEndgameAntimatter;
    player.celestials.alpha.records.records.totalRealityAntimatter = player.records.totalRealityAntimatter;
    player.celestials.alpha.records.records.totalEternityAntimatter = player.records.totalEternityAntimatter;
    player.celestials.alpha.records.records.totalInfinityAntimatter = player.records.totalInfinityAntimatter;
    player.celestials.alpha.records.records.recentInfinities[0][0] = player.records.recentInfinities[0][0];
    player.celestials.alpha.records.records.recentInfinities[0][1] = player.records.recentInfinities[0][1];
    player.celestials.alpha.records.records.recentInfinities[0][2] = player.records.recentInfinities[0][2];
    player.celestials.alpha.records.records.recentInfinities[0][3] = player.records.recentInfinities[0][3];
    player.celestials.alpha.records.records.recentInfinities[0][4] = player.records.recentInfinities[0][4];
    player.celestials.alpha.records.records.recentInfinities[1][0] = player.records.recentInfinities[1][0];
    player.celestials.alpha.records.records.recentInfinities[1][1] = player.records.recentInfinities[1][1];
    player.celestials.alpha.records.records.recentInfinities[1][2] = player.records.recentInfinities[1][2];
    player.celestials.alpha.records.records.recentInfinities[1][3] = player.records.recentInfinities[1][3];
    player.celestials.alpha.records.records.recentInfinities[1][4] = player.records.recentInfinities[1][4];
    player.celestials.alpha.records.records.recentInfinities[2][0] = player.records.recentInfinities[2][0];
    player.celestials.alpha.records.records.recentInfinities[2][1] = player.records.recentInfinities[2][1];
    player.celestials.alpha.records.records.recentInfinities[2][2] = player.records.recentInfinities[2][2];
    player.celestials.alpha.records.records.recentInfinities[2][3] = player.records.recentInfinities[2][3];
    player.celestials.alpha.records.records.recentInfinities[2][4] = player.records.recentInfinities[2][4];
    player.celestials.alpha.records.records.recentInfinities[3][0] = player.records.recentInfinities[3][0];
    player.celestials.alpha.records.records.recentInfinities[3][1] = player.records.recentInfinities[3][1];
    player.celestials.alpha.records.records.recentInfinities[3][2] = player.records.recentInfinities[3][2];
    player.celestials.alpha.records.records.recentInfinities[3][3] = player.records.recentInfinities[3][3];
    player.celestials.alpha.records.records.recentInfinities[3][4] = player.records.recentInfinities[3][4];
    player.celestials.alpha.records.records.recentInfinities[4][0] = player.records.recentInfinities[4][0];
    player.celestials.alpha.records.records.recentInfinities[4][1] = player.records.recentInfinities[4][1];
    player.celestials.alpha.records.records.recentInfinities[4][2] = player.records.recentInfinities[4][2];
    player.celestials.alpha.records.records.recentInfinities[4][3] = player.records.recentInfinities[4][3];
    player.celestials.alpha.records.records.recentInfinities[4][4] = player.records.recentInfinities[4][4];
    player.celestials.alpha.records.records.recentInfinities[5][0] = player.records.recentInfinities[5][0];
    player.celestials.alpha.records.records.recentInfinities[5][1] = player.records.recentInfinities[5][1];
    player.celestials.alpha.records.records.recentInfinities[5][2] = player.records.recentInfinities[5][2];
    player.celestials.alpha.records.records.recentInfinities[5][3] = player.records.recentInfinities[5][3];
    player.celestials.alpha.records.records.recentInfinities[5][4] = player.records.recentInfinities[5][4];
    player.celestials.alpha.records.records.recentInfinities[6][0] = player.records.recentInfinities[6][0];
    player.celestials.alpha.records.records.recentInfinities[6][1] = player.records.recentInfinities[6][1];
    player.celestials.alpha.records.records.recentInfinities[6][2] = player.records.recentInfinities[6][2];
    player.celestials.alpha.records.records.recentInfinities[6][3] = player.records.recentInfinities[6][3];
    player.celestials.alpha.records.records.recentInfinities[6][4] = player.records.recentInfinities[6][4];
    player.celestials.alpha.records.records.recentInfinities[7][0] = player.records.recentInfinities[7][0];
    player.celestials.alpha.records.records.recentInfinities[7][1] = player.records.recentInfinities[7][1];
    player.celestials.alpha.records.records.recentInfinities[7][2] = player.records.recentInfinities[7][2];
    player.celestials.alpha.records.records.recentInfinities[7][3] = player.records.recentInfinities[7][3];
    player.celestials.alpha.records.records.recentInfinities[7][4] = player.records.recentInfinities[7][4];
    player.celestials.alpha.records.records.recentInfinities[8][0] = player.records.recentInfinities[8][0];
    player.celestials.alpha.records.records.recentInfinities[8][1] = player.records.recentInfinities[8][1];
    player.celestials.alpha.records.records.recentInfinities[8][2] = player.records.recentInfinities[8][2];
    player.celestials.alpha.records.records.recentInfinities[8][3] = player.records.recentInfinities[8][3];
    player.celestials.alpha.records.records.recentInfinities[8][4] = player.records.recentInfinities[8][4];
    player.celestials.alpha.records.records.recentInfinities[9][0] = player.records.recentInfinities[9][0];
    player.celestials.alpha.records.records.recentInfinities[9][1] = player.records.recentInfinities[9][1];
    player.celestials.alpha.records.records.recentInfinities[9][2] = player.records.recentInfinities[9][2];
    player.celestials.alpha.records.records.recentInfinities[9][3] = player.records.recentInfinities[9][3];
    player.celestials.alpha.records.records.recentInfinities[9][4] = player.records.recentInfinities[9][4];
    player.celestials.alpha.records.records.recentEternities[0][0] = player.records.recentEternities[0][0];
    player.celestials.alpha.records.records.recentEternities[0][1] = player.records.recentEternities[0][1];
    player.celestials.alpha.records.records.recentEternities[0][2] = player.records.recentEternities[0][2];
    player.celestials.alpha.records.records.recentEternities[0][3] = player.records.recentEternities[0][3];
    player.celestials.alpha.records.records.recentEternities[0][4] = player.records.recentEternities[0][4];
    player.celestials.alpha.records.records.recentEternities[0][5] = player.records.recentEternities[0][5];
    player.celestials.alpha.records.records.recentEternities[1][0] = player.records.recentEternities[1][0];
    player.celestials.alpha.records.records.recentEternities[1][1] = player.records.recentEternities[1][1];
    player.celestials.alpha.records.records.recentEternities[1][2] = player.records.recentEternities[1][2];
    player.celestials.alpha.records.records.recentEternities[1][3] = player.records.recentEternities[1][3];
    player.celestials.alpha.records.records.recentEternities[1][4] = player.records.recentEternities[1][4];
    player.celestials.alpha.records.records.recentEternities[1][5] = player.records.recentEternities[1][5];
    player.celestials.alpha.records.records.recentEternities[2][0] = player.records.recentEternities[2][0];
    player.celestials.alpha.records.records.recentEternities[2][1] = player.records.recentEternities[2][1];
    player.celestials.alpha.records.records.recentEternities[2][2] = player.records.recentEternities[2][2];
    player.celestials.alpha.records.records.recentEternities[2][3] = player.records.recentEternities[2][3];
    player.celestials.alpha.records.records.recentEternities[2][4] = player.records.recentEternities[2][4];
    player.celestials.alpha.records.records.recentEternities[2][5] = player.records.recentEternities[2][5];
    player.celestials.alpha.records.records.recentEternities[3][0] = player.records.recentEternities[3][0];
    player.celestials.alpha.records.records.recentEternities[3][1] = player.records.recentEternities[3][1];
    player.celestials.alpha.records.records.recentEternities[3][2] = player.records.recentEternities[3][2];
    player.celestials.alpha.records.records.recentEternities[3][3] = player.records.recentEternities[3][3];
    player.celestials.alpha.records.records.recentEternities[3][4] = player.records.recentEternities[3][4];
    player.celestials.alpha.records.records.recentEternities[3][5] = player.records.recentEternities[3][5];
    player.celestials.alpha.records.records.recentEternities[4][0] = player.records.recentEternities[4][0];
    player.celestials.alpha.records.records.recentEternities[4][1] = player.records.recentEternities[4][1];
    player.celestials.alpha.records.records.recentEternities[4][2] = player.records.recentEternities[4][2];
    player.celestials.alpha.records.records.recentEternities[4][3] = player.records.recentEternities[4][3];
    player.celestials.alpha.records.records.recentEternities[4][4] = player.records.recentEternities[4][4];
    player.celestials.alpha.records.records.recentEternities[4][5] = player.records.recentEternities[4][5];
    player.celestials.alpha.records.records.recentEternities[5][0] = player.records.recentEternities[5][0];
    player.celestials.alpha.records.records.recentEternities[5][1] = player.records.recentEternities[5][1];
    player.celestials.alpha.records.records.recentEternities[5][2] = player.records.recentEternities[5][2];
    player.celestials.alpha.records.records.recentEternities[5][3] = player.records.recentEternities[5][3];
    player.celestials.alpha.records.records.recentEternities[5][4] = player.records.recentEternities[5][4];
    player.celestials.alpha.records.records.recentEternities[5][5] = player.records.recentEternities[5][5];
    player.celestials.alpha.records.records.recentEternities[6][0] = player.records.recentEternities[6][0];
    player.celestials.alpha.records.records.recentEternities[6][1] = player.records.recentEternities[6][1];
    player.celestials.alpha.records.records.recentEternities[6][2] = player.records.recentEternities[6][2];
    player.celestials.alpha.records.records.recentEternities[6][3] = player.records.recentEternities[6][3];
    player.celestials.alpha.records.records.recentEternities[6][4] = player.records.recentEternities[6][4];
    player.celestials.alpha.records.records.recentEternities[6][5] = player.records.recentEternities[6][5];
    player.celestials.alpha.records.records.recentEternities[7][0] = player.records.recentEternities[7][0];
    player.celestials.alpha.records.records.recentEternities[7][1] = player.records.recentEternities[7][1];
    player.celestials.alpha.records.records.recentEternities[7][2] = player.records.recentEternities[7][2];
    player.celestials.alpha.records.records.recentEternities[7][3] = player.records.recentEternities[7][3];
    player.celestials.alpha.records.records.recentEternities[7][4] = player.records.recentEternities[7][4];
    player.celestials.alpha.records.records.recentEternities[7][5] = player.records.recentEternities[7][5];
    player.celestials.alpha.records.records.recentEternities[8][0] = player.records.recentEternities[8][0];
    player.celestials.alpha.records.records.recentEternities[8][1] = player.records.recentEternities[8][1];
    player.celestials.alpha.records.records.recentEternities[8][2] = player.records.recentEternities[8][2];
    player.celestials.alpha.records.records.recentEternities[8][3] = player.records.recentEternities[8][3];
    player.celestials.alpha.records.records.recentEternities[8][4] = player.records.recentEternities[8][4];
    player.celestials.alpha.records.records.recentEternities[8][5] = player.records.recentEternities[8][5];
    player.celestials.alpha.records.records.recentEternities[9][0] = player.records.recentEternities[9][0];
    player.celestials.alpha.records.records.recentEternities[9][1] = player.records.recentEternities[9][1];
    player.celestials.alpha.records.records.recentEternities[9][2] = player.records.recentEternities[9][2];
    player.celestials.alpha.records.records.recentEternities[9][3] = player.records.recentEternities[9][3];
    player.celestials.alpha.records.records.recentEternities[9][4] = player.records.recentEternities[9][4];
    player.celestials.alpha.records.records.recentEternities[9][5] = player.records.recentEternities[9][5];
    player.celestials.alpha.records.records.thisInfinity.time = player.records.thisInfinity.time;
    player.celestials.alpha.records.records.thisInfinity.realTime = player.records.thisInfinity.realTime;
    player.celestials.alpha.records.records.thisInfinity.lastBuyTime = player.records.thisInfinity.lastBuyTime;
    player.celestials.alpha.records.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM;
    player.celestials.alpha.records.records.thisInfinity.bestIPmin = player.records.thisInfinity.bestIPmin;
    player.celestials.alpha.records.records.thisInfinity.bestIPminVal = player.records.thisInfinity.bestIPminVal;
    player.celestials.alpha.records.records.bestInfinity.time = player.records.bestInfinity.time;
    player.celestials.alpha.records.records.bestInfinity.realTime = player.records.bestInfinity.realTime;
    player.celestials.alpha.records.records.bestInfinity.bestIPminEternity = player.records.bestInfinity.bestIPminEternity;
    player.celestials.alpha.records.records.bestInfinity.bestIPminReality = player.records.bestInfinity.bestIPminReality;
    player.celestials.alpha.records.records.thisEternity.time = player.records.thisEternity.time;
    player.celestials.alpha.records.records.thisEternity.realTime = player.records.thisEternity.realTime;
    player.celestials.alpha.records.records.thisEternity.maxAM = player.records.thisEternity.maxAM;
    player.celestials.alpha.records.records.thisEternity.maxIP = player.records.thisEternity.maxIP;
    player.celestials.alpha.records.records.thisEternity.bestIPMsWithoutMaxAll = player.records.thisEternity.bestIPMsWithoutMaxAll;
    player.celestials.alpha.records.records.thisEternity.bestEPmin = player.records.thisEternity.bestEPmin;
    player.celestials.alpha.records.records.thisEternity.bestEPminVal = player.records.thisEternity.bestEPminVal;
    player.celestials.alpha.records.records.thisEternity.bestInfinitiesPerMs = player.records.thisEternity.bestInfinitiesPerMs;
    player.celestials.alpha.records.records.bestEternity.time = player.records.bestEternity.time;
    player.celestials.alpha.records.records.bestEternity.realTime = player.records.bestEternity.realTime;
    player.celestials.alpha.records.records.bestEternity.bestEPminReality = player.records.bestEternity.bestEPminReality;
    player.celestials.alpha.records.records.thisReality.time = player.records.thisReality.time;
    player.celestials.alpha.records.records.thisReality.realTime = player.records.thisReality.realTime;
    player.celestials.alpha.records.records.thisReality.maxAM = player.records.thisReality.maxAM;
    player.celestials.alpha.records.records.thisReality.maxIP = player.records.thisReality.maxIP;
    player.celestials.alpha.records.records.thisReality.maxEP = player.records.thisReality.maxEP;
    player.celestials.alpha.records.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs;
    player.celestials.alpha.records.records.thisReality.maxReplicanti = player.records.thisReality.maxReplicanti;
    player.celestials.alpha.records.records.thisReality.maxDT = player.records.thisReality.maxDT;
    player.celestials.alpha.records.records.thisReality.bestRSmin = player.records.thisReality.bestRSmin;
    player.celestials.alpha.records.records.thisReality.bestRSminVal = player.records.thisReality.bestRSminVal;
    player.celestials.alpha.records.records.thisReality.galaxies = player.records.thisReality.galaxies;
    player.celestials.alpha.records.IPMultPurchases = player.IPMultPurchases;
    player.celestials.alpha.records.infinityPower = player.infinityPower;
    player.celestials.alpha.records.postC4Tier = player.postC4Tier;
    player.celestials.alpha.records.eternityPoints = player.eternityPoints;
    player.celestials.alpha.records.eternities = player.eternities;
    player.celestials.alpha.records.eternityUpgrades = new Set(player.eternityUpgrades);
    player.celestials.alpha.records.epmultUpgrades = player.epmultUpgrades;
    player.celestials.alpha.records.timeShards = player.timeShards;
    player.celestials.alpha.records.totalTickGained = player.totalTickGained;
    player.celestials.alpha.records.totalTickBought = player.totalTickBought;
    player.celestials.alpha.records.replicanti.unl = player.replicanti.unl;
    player.celestials.alpha.records.replicanti.amount = player.replicanti.amount;
    player.celestials.alpha.records.replicanti.chance = player.replicanti.chance;
    player.celestials.alpha.records.replicanti.chanceCost = player.replicanti.chanceCost;
    player.celestials.alpha.records.replicanti.interval = player.replicanti.interval;
    player.celestials.alpha.records.replicanti.intervalCost = player.replicanti.intervalCost;
    player.celestials.alpha.records.replicanti.boughtGalaxyCap = player.replicanti.boughtGalaxyCap;
    player.celestials.alpha.records.replicanti.galaxies = player.replicanti.galaxies;
    player.celestials.alpha.records.replicanti.galCost = player.replicanti.galCost;
    player.celestials.alpha.records.timestudy.theorem = player.timestudy.theorem;
    player.celestials.alpha.records.timestudy.maxTheorem = player.timestudy.maxTheorem;
    player.celestials.alpha.records.timestudy.amBought = player.timestudy.amBought;
    player.celestials.alpha.records.timestudy.ipBought = player.timestudy.ipBought;
    player.celestials.alpha.records.timestudy.epBought = player.timestudy.epBought;
    for (let ats = 0; ats < 305; ats++) {
      if (TimeStudy(ats)) {
        if (TimeStudy(ats).isBought) {
          player.celestials.alpha.records.timestudy.studies.push(ats);
        }
      }
    }
    player.celestials.alpha.records.eternityChalls.eterc1 = player.eternityChalls.eterc1 ? player.eternityChalls.eterc1 : 0;
    player.celestials.alpha.records.eternityChalls.eterc2 = player.eternityChalls.eterc2 ? player.eternityChalls.eterc2 : 0;
    player.celestials.alpha.records.eternityChalls.eterc3 = player.eternityChalls.eterc3 ? player.eternityChalls.eterc3 : 0;
    player.celestials.alpha.records.eternityChalls.eterc4 = player.eternityChalls.eterc4 ? player.eternityChalls.eterc4 : 0;
    player.celestials.alpha.records.eternityChalls.eterc5 = player.eternityChalls.eterc5 ? player.eternityChalls.eterc5 : 0;
    player.celestials.alpha.records.eternityChalls.eterc6 = player.eternityChalls.eterc6 ? player.eternityChalls.eterc6 : 0;
    player.celestials.alpha.records.eternityChalls.eterc7 = player.eternityChalls.eterc7 ? player.eternityChalls.eterc7 : 0;
    player.celestials.alpha.records.eternityChalls.eterc8 = player.eternityChalls.eterc8 ? player.eternityChalls.eterc8 : 0;
    player.celestials.alpha.records.eternityChalls.eterc9 = player.eternityChalls.eterc9 ? player.eternityChalls.eterc9 : 0;
    player.celestials.alpha.records.eternityChalls.eterc10 = player.eternityChalls.eterc10 ? player.eternityChalls.eterc10 : 0;
    player.celestials.alpha.records.eternityChalls.eterc11 = player.eternityChalls.eterc11 ? player.eternityChalls.eterc11 : 0;
    player.celestials.alpha.records.eternityChalls.eterc12 = player.eternityChalls.eterc12 ? player.eternityChalls.eterc12 : 0;
    player.celestials.alpha.records.respec = player.respec;
    player.celestials.alpha.records.eterc8ids = player.eterc8ids;
    player.celestials.alpha.records.eterc8repl = player.eterc8repl;
    for (let adts = 0; adts < 7; adts++) {
      if (player.dilation.studies.includes(adts)) {
        player.celestials.alpha.records.dilation.studies.push(adts);
      }
    }
    player.celestials.alpha.records.dilation.active = player.dilation.active;
    player.celestials.alpha.records.dilation.tachyonParticles = player.dilation.tachyonParticles;
    player.celestials.alpha.records.dilation.dilatedTime = player.dilation.dilatedTime;
    player.celestials.alpha.records.dilation.nextThreshold = player.dilation.nextThreshold;
    player.celestials.alpha.records.dilation.baseTachyonGalaxies = player.dilation.baseTachyonGalaxies;
    player.celestials.alpha.records.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies;
    player.celestials.alpha.records.dilation.upgrades = new Set(player.dilation.upgrades);
    player.celestials.alpha.records.dilation.rebuyables[1] = player.dilation.rebuyables[1];
    player.celestials.alpha.records.dilation.rebuyables[2] = player.dilation.rebuyables[2];
    player.celestials.alpha.records.dilation.rebuyables[3] = player.dilation.rebuyables[3];
    player.celestials.alpha.records.dilation.rebuyables[11] = player.dilation.rebuyables[11];
    player.celestials.alpha.records.dilation.rebuyables[12] = player.dilation.rebuyables[12];
    player.celestials.alpha.records.dilation.rebuyables[13] = player.dilation.rebuyables[13];
    player.celestials.alpha.records.dilation.lastEP = player.dilation.lastEP;
    clearCelestialRuns();
    player.disablePostReality = false;
    Endgame.resetNoReward();
    player.endgame.overcharge.allowComplex = true;
    recalculateAllGlyphs();
    Tab.dimensions.antimatter.show(false);
  },
  advanceLayer() {
    player.celestials.alpha.stage++;
    this.escapeTheMatrix();
  },
  get isRunning() {
    return player.celestials.alpha.run;
  },
  get currentStage() {
    return player.celestials.alpha.stage;
  },
  get stageNames() {
    return ["Reach the 4th Dimension Boost", "Reach the 5th Dimension Boost", "Reach the 1st Antimatter Galaxy", "Reach Infinity",
            "Complete Normal Challenge 12", "Break Infinity", "Purchase the 5e11 Break Infinity Upgrade",
            "Purchase All Break Infinity Upgrades", "Complete All Infinity Challenges", "Unlock Replicanti",
            "Purchase the 8th Infinity Dimension", "Reach Eternity", "Purchase Time Study 61", "Purchase the 4th Time Dimension",
            "Purchase the 3rd Eternity Upgrade", "Reach 115 Total Time Theorems", "Complete any Eternity Challenge Once",
            "Complete any Eternity Challenge Five Times", "Purchase Time Study 181", "Complete Eternity Challenge 10 Once",
            "Purchase Time Study 192", "Unlock Eternity Challenge 11", "Complete Eternity Challenge 11", "Unlock Time Dilation",
            "Perform a Dilated Eternity", "Begin Generation of Time Theorems", "Purchase the 8th Time Dimension", "Reach Reality"];
  },
  get shortStageNames() {
    return ["4th Dimboost", "5th Dimboost", "1st Galaxy", "Infinity", "NC12", "Break Infinity", "5e11 BIU", "All BIU", "All ICs",
            "Replicanti", "ID8", "Eternity", "TS61", "TD4", "Eternity Upgrade 3", "115 Total TT", "ECx1", "ECx5", "TS181", "EC10x1",
            "TS192", "EC11", "EC11x5", "Dilation", "Dilated Eternity", "TT Generation", "TD8", "Reality"];
  },
  get currentStageName() {
    return this.stageNames[this.currentStage];
  },
  get currentShortStageName() {
    return this.shortStageNames[this.currentStage];
  },
  get alphaDecay() {
    return 0.01 + (this.currentStage / 200) + Math.max(0, (this.currentStage - 18) / 200) +
      Math.max(0, (this.currentStage - 20) / 100) + Math.max(0, (this.currentStage - 21) / 100) +
      Math.max(0, (this.currentStage - 23) / 50) + Math.max(0, (this.currentStage - 25) / 20);
  },
  get alphaDecayByHour() {
    return 1 - Math.pow(1 - this.alphaDecay, 1 / 4.8);
  },
  get totalSpeedBoost() {
    return Decimal.pow(Decimal.max(Decimal.log10(Currency.etherealPower.value).sub(7), 0).div(7).add(1), 2).timesEffectsOf(
      Achievement(212),
      Achievement(213)
    );
  },
  get cosmicSectorMinBoost() {
    return (1 - Decimal.pow(0.8, Decimal.log10(Currency.etherealPower.value.add(1))).toNumber()) *
      Math.max(1 - (Math.floor(Math.pow(0.8, Alpha.currentStage) * 10) / 10) - Math.max((4 - Alpha.currentStage) / 10, 0), 0) /
      Math.max(5 - Alpha.currentStage, 1);
  },
  get cosmicSectorExtraBoost() {
    return Decimal.pow(Ethereal.cosmicSector, 2).div(100).times(4.8);
  },
  get celestialMatterConversionNerf() {
    return DC.D1.sub(Decimal.pow(1 - this.alphaDecayByHour, Decimal.min(
      TimeSpan.fromMilliseconds(Time.thisEndgameRealTime._ms).totalHours.times(this.totalSpeedBoost).add(
        this.cosmicSectorMinBoost * 24), 24).add(this.cosmicSectorExtraBoost))).toNumber();
  },
  get hoursToMax() {
    return DC.D24.sub(TimeSpan.fromMilliseconds(Time.thisEndgameRealTime._ms).totalHours.times(this.totalSpeedBoost).add(
      this.cosmicSectorMinBoost * 24)).div(this.totalSpeedBoost);
  },
  quotes: Quotes.alpha,
  symbol: "α"
};

class AlphaUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.alpha.unlockBits; }
  set bits(value) { player.celestials.alpha.unlockBits = value; }

  get requirement() {
    return this.config.requirement;
  }

  get nerfDescription() {
    return this.config.nerfDescription;
  }

  get buffDescription() {
    return this.config.buffDescription;
  }

  get isEffectActive() {
    return player.celestials.alpha.stage >= this.requirement;
  }
}

export const AlphaUnlocks = mapGameDataToObject(
  GameDatabase.celestials.alpha.unlocks,
  config => new AlphaUnlockState(config)
);

export const AlphaArrays = {
  get nerfNames() {
    let nerfs = [];
    for (let n = 0; n < 28; n++) {
      nerfs.push(typeof AlphaUnlocks.all.find(x => x.id === n).nerfDescription === "function"
                 ? AlphaUnlocks.all.find(x => x.id === n).nerfDescription()
                 : AlphaUnlocks.all.find(x => x.id === n).nerfDescription);
    }
    return nerfs;
  },
  get buffNames() {
    let buffs = [];
    for (let n = 0; n < 28; n++) {
      buffs.push(typeof AlphaUnlocks.all.find(x => x.id === n).buffDescription === "function"
                 ? AlphaUnlocks.all.find(x => x.id === n).buffDescription()
                 : AlphaUnlocks.all.find(x => x.id === n).buffDescription);
    }
    return buffs;
  }
};

export const AlphaDescriptions = {
  get layerRow() {
    let layers = [];
    if (Alpha.currentStage >= 0) {
      for (let n = 0; n < Math.min(Alpha.currentStage + 1, 28); n++) {
        layers.push(Alpha.shortStageNames[n]);
      }
    }
    if (Alpha.currentStage <= 26) {
      for (let n = Alpha.currentStage + 1; n < 28; n++) {
        layers.push("?");
      }
    }
    return layers;
  },
  get nerfRow() {
    let nerfs = [];
    if (Alpha.currentStage >= 1) {
      for (let n = 0; n < Alpha.currentStage; n++) {
        nerfs.push(AlphaArrays.nerfNames[n]);
      }
    }
    if (Alpha.currentStage <= 27) {
      for (let n = Alpha.currentStage; n < 28; n++) {
        nerfs.push("?");
      }
    }
    return nerfs;
  },
  get buffRow() {
    let buffs = [];
    if (Alpha.currentStage >= 1) {
      for (let n = 0; n < Alpha.currentStage; n++) {
        buffs.push(AlphaArrays.buffNames[n]);
      }
    }
    if (Alpha.currentStage <= 27) {
      for (let n = Alpha.currentStage; n < 28; n++) {
        buffs.push("?");
      }
    }
    return buffs;
  },
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.alpha.isOpen) Alpha.quotes.unlock.show();
});
