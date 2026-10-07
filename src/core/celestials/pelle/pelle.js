import { Currency } from "../../currency";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";
import { SetPurchasableMechanicState } from "../../utils";

import { Quotes } from "../quotes";

import wordShift from "../../word-shift";

import zalgo from "./zalgo";


const disabledMechanicUnlocks = {
  achievements: () => ({}),
  IPMults: () => ({}),
  EPMults: () => ({}),
  galaxies: () => ({}),
  InfinitiedMults: () => ({}),
  infinitiedGen: () => ({}),
  eternityGain: () => ({}),
  eternityMults: () => ({}),
  studies: () => ({}),
  EPgen: () => ({}),
  autoec: () => ({}),
  replicantiIntervalMult: () => ({}),
  tpMults: () => ({}),
  glyphs: () => !PelleRifts.vacuum.milestones[0].canBeApplied,
  V: () => ({}),
  singularity: () => ({}),
  alchemy: () => ({}),
  achievementMult: () => ({}),
  blackhole: () => ({}),
  effarig: () => ({}),
  imaginaryUpgrades: () => ({}),
  glyphsac: () => ({}),
  antimatterDimAutobuyer1: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer2: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer3: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer4: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer5: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer6: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer7: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer8: () => PelleUpgrade.antimatterDimAutobuyers2,
  tickspeedAutobuyer: () => PelleUpgrade.tickspeedAutobuyer,
  dimBoostAutobuyer: () => PelleUpgrade.dimBoostAutobuyer,
  galaxyAutobuyer: () => PelleUpgrade.galaxyAutobuyer,
  timeTheoremAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({}),
  chargedInfinityUpgrades: () => ({}),
  alteration: () => ({}),
  timeTheorems: () => ({})
};

export const Pelle = {
  symbol: "♅",
  // Suppress the randomness for this form
  possessiveName: "Pelle's",

  // This is called upon initial Dooming and after every Armageddon when using the modal
  initializeRun() {
    if (Alpha.isRunning || LHC.voidRunning || LHC.nullifiedVoidRunning || Slabdrill.isCursed || player.endgame.overcharge.isRunning ||
        player.compression.active || player.universes.current !== 0) return;
    if (this.isDoomed) {
      Pelle.armageddon(true);
      return;
    }

    EventHub.dispatch(GAME_EVENT.DOOM_REALITY_BEFORE);
    if (!Glyphs.unequipAll()) {
      Modal.hideAll();
      Modal.message.show(`Dooming your Reality will unequip your Glyphs. Some of your
        Glyphs could not be unequipped due to lack of inventory space.`, 1);
      return;
    }
    // Keep glyphs equal to max slot in Pelle.
    Glyphs.autoClean(Glyphs.activeSlotCountInPelle(true));
    if (Glyphs.freeInventorySpace < 5) {
      Modal.hideAll();
      Modal.message.show(`You must have enough empty unprotected Glyph slots for
        ${formatInt(5)} additional Glyphs in order to Doom your Reality.`, 1);
      return;
    }
    for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.doomedGlyph(type));
    Glyphs.refreshActive();
    player.options.confirmations.glyphReplace = true;
    if (BlackHoles.arePaused) BlackHoles.togglePause();
    player.celestials.pelle.doomed = true;
    Pelle.armageddon(false);
    respecTimeStudies(true);
    Currency.infinityPoints.reset();
    player.IPMultPurchases = DC.D0;
    Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
    if (!DivinityMilestone.pelleQoL.isReached) disChargeAll();
    if (DivinityMilestone.pelleQoL.isReached) {
      PelleStrikes.powerGalaxies.trigger();
      Replicanti.unlock(true);
    }
    if (!Effarig.isRunning || Effarig.currentStage !== EFFARIG_STAGES.ENDGAME) clearCelestialRuns();
    CelestialDimensions.resetAmount();
    player.records.thisEndgame.peakGameSpeed = DC.D1;
    player.requirementChecks.endgame.noGlyphsDoomed = true;
    player.celestials.enslaved.stored = DC.D0;
    Enslaved.autoReleaseSpeed = DC.D0;

    // Force-enable the group toggle for AD autobuyers to be active; whether or not they can actually tick
    // is still handled through if the autobuyers are unlocked at all. This fixes an odd edge case where the player
    // enters cel7 with AD autobuyers disabled - AD autobuyers need to be reupgraded, but the UI component
    // for the group toggle is hidden until they're all re-upgraded to the max again.
    player.auto.antimatterDims.isActive = true;

    player.records.realTimeDoomed = 0;
    if (!PelleAlchemyUpgrade.alchemyPower.canBeApplied) player.celestials.ra.alchemy[0].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyInfinity.canBeApplied) player.celestials.ra.alchemy[1].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyTime.canBeApplied) player.celestials.ra.alchemy[2].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyReplication.canBeApplied) player.celestials.ra.alchemy[3].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyDilation.canBeApplied) player.celestials.ra.alchemy[4].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyEffarig.canBeApplied) player.celestials.ra.alchemy[5].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyCardinality.canBeApplied) player.celestials.ra.alchemy[6].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyEternity.canBeApplied) player.celestials.ra.alchemy[7].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyDimensionality.canBeApplied) player.celestials.ra.alchemy[8].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyInflation.canBeApplied) player.celestials.ra.alchemy[9].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyAlternation.canBeApplied) player.celestials.ra.alchemy[10].amount = 0;
    if (!PelleAlchemyUpgrade.alchemySynergism.canBeApplied) player.celestials.ra.alchemy[11].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyDecoherence.canBeApplied) player.celestials.ra.alchemy[12].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyMomentum.canBeApplied) player.celestials.ra.alchemy[13].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyMultiversal.canBeApplied) player.celestials.ra.alchemy[14].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyForce.canBeApplied) player.celestials.ra.alchemy[15].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyExponential.canBeApplied) player.celestials.ra.alchemy[16].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyUncountability.canBeApplied) player.celestials.ra.alchemy[17].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyBoundless.canBeApplied) player.celestials.ra.alchemy[18].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyUnpredictability.canBeApplied) player.celestials.ra.alchemy[19].amount = 0;
    if (!PelleAlchemyUpgrade.alchemyReality.canBeApplied) player.celestials.ra.alchemy[20].amount = 0;
    if (!ExpansionPack.pellePack.isBought) {
      AutomatorBackend.stop();
    }

    if (DivinityMilestone.firstDivine.isReached && !player.disablePostReality) {
      player.celestials.pelle.upgrades = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
      player.celestials.pelle.rebuyables.antimatterDimensionMult = 47;
      player.celestials.pelle.rebuyables.timeSpeedMult = 35;
      player.celestials.pelle.rebuyables.glyphLevels = 26;
      player.celestials.pelle.rebuyables.infConversion = 21;
      player.celestials.pelle.rebuyables.galaxyPower = 9;
    }

    if (DivinityMilestone.pelleQoL.isReached) {
      player.celestials.pelle.rifts.decay.percentageSpent = 10;
      player.celestials.pelle.rifts.vacuum.fill = PelleRifts.vacuum.config.percentageToFill(1);
      player.celestials.pelle.rifts.decay.fill = PelleRifts.decay.config.percentageToFill(11);
      player.celestials.pelle.rifts.chaos.fill = PelleRifts.chaos.config.percentageToFill(1);
      player.celestials.pelle.rifts.recursion.fill = PelleRifts.recursion.config.percentageToFill(1);
      player.celestials.pelle.rifts.paradox.fill = PelleRifts.paradox.config.percentageToFill(1);
      if (PelleRifts.vacuum.milestones[0].canBeApplied) Glyphs.refreshActive();
      PelleRifts.all.forEach(x => x.checkMilestoneStates());
    }

    // Force-unhide all tabs except for the shop tab, for which we retain the hide state instead
    const shopTab = ~1 & (1 << GameDatabase.tabs.find(t => t.key === "shop").id);
    player.options.hiddenTabBits &= shopTab;

    // Force unhide MOST subtabs, although some of the tabs get ignored since they don't contain any
    // meaningful interactable gameplay elements in Doomed
    const tabsToIgnore = ["statistics", "achievements", "reality", "celestials"];
    const ignoredIDs = GameDatabase.tabs.filter(t => tabsToIgnore.includes(t.key)).map(t => t.id);
    for (let tabIndex = 0; tabIndex < GameDatabase.tabs.length; tabIndex++) {
      player.options.hiddenSubtabBits[tabIndex] &= ignoredIDs.includes(tabIndex) ? -1 : 0;
    }
    Pelle.quotes.initial.show();
    if (player.endgames >= 1) {
      Pelle.quotes.doom2.show();
    }
    if (player.endgames >= 2) {
      Pelle.quotes.doom3.show();
    }
    if (player.endgame.doomedParticles.gte(1e10)) {
      Pelle.quotes.doomE10DP.show();
    }
    if (player.endgame.doomedParticles.gte(1e55)) {
      Pelle.quotes.doomE55DP.show();
    }
    if (!PlayerProgress.endgameUnlocked()) {
      GameStorage.save(true)
    }
    EventHub.dispatch(GAME_EVENT.DOOM_REALITY_AFTER);
  },

  get displayName() {
    return Date.now() % 4000 > 500 ? "Pelle" : wordShift.randomCrossWords("Pelle");
  },

  get isUnlocked() {
    return ImaginaryUpgrade(25).isBought;
  },
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.isDoomed) return false;

    if (!mechanic) return true;
    if (!disabledMechanicUnlocks[mechanic]) {
      // eslint-disable-next-line
      console.error(`Mechanic ${mechanic} isn't present in the disabledMechanicUnlocks!`);
      return true;
    }

    const upgrade = disabledMechanicUnlocks[mechanic]();

    if (typeof upgrade === "boolean") {
      return upgrade;
    }

    return Boolean(!upgrade.canBeApplied);
  },

  get canArmageddon() {
    return this.remnantsGain.gte(1);
  },

  armageddon(gainStuff) {
    if (!this.canArmageddon && gainStuff) return;
    EventHub.dispatch(GAME_EVENT.ARMAGEDDON_BEFORE, gainStuff);
    if (gainStuff) {
      this.cel.remnants = this.cel.remnants.add(this.remnantsGain);
    }
    finishProcessReality({ reset: true, armageddon: true });
    if ((this.isAlwaysDischargeCIU && !DivinityMilestone.pelleQoL.isReached) || player.celestials.ra.disCharge) disChargeAll();
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.autoStoreReal = false;
    if (PelleStrikes.dilation.hasStrike && !PelleStrikes.dilation.isDestroyed()) player.dilation.active = true;
    EventHub.dispatch(GAME_EVENT.ARMAGEDDON_AFTER, gainStuff);
  },

  get isAlwaysDischargeCIU() {
    return Ra.unlocks.chargedInfinityUpgrades.isDisabledByPelle || !PelleUpgrade.keepBreakInfinityUpgrades.canBeApplied;
  },

  gameLoop(diff) {
    if (this.isDoomed) {
      Currency.realityShards.add(this.realityShardGainPerSecond.times(diff).div(1000));
      PelleRifts.all.forEach(r => r.fill(diff));
    }
  },

  get cel() {
    return player.celestials.pelle;
  },

  get isDoomed() {
    return this.cel.doomed;
  },

  get disabledAchievements() {
    let remainingAchs = [];
    if (!PelleAchievementUpgrade.achievement37.canBeApplied) remainingAchs.push(37);
    if (!PelleAchievementUpgrade.achievement54.canBeApplied) remainingAchs.push(54);
    if (!PelleAchievementUpgrade.achievement55.canBeApplied) remainingAchs.push(55);
    if (!PelleAchievementUpgrade.achievement65.canBeApplied) remainingAchs.push(65);
    if (!PelleAchievementUpgrade.achievement74.canBeApplied) remainingAchs.push(74);
    if (!PelleAchievementUpgrade.achievement76.canBeApplied) remainingAchs.push(76);
    if (!PelleAchievementUpgrade.achievement78.canBeApplied) remainingAchs.push(78);
    if (!PelleAchievementUpgrade.achievement81.canBeApplied) remainingAchs.push(81);
    if (!PelleAchievementUpgrade.achievement85.canBeApplied) remainingAchs.push(85);
    if (!PelleAchievementUpgrade.achievement87.canBeApplied) remainingAchs.push(87);
    if (!PelleAchievementUpgrade.achievement91.canBeApplied) remainingAchs.push(91);
    if (!PelleAchievementUpgrade.achievement92.canBeApplied) remainingAchs.push(92);
    if (!PelleAchievementUpgrade.achievement93.canBeApplied) remainingAchs.push(93);
    if (!PelleAchievementUpgrade.achievement95.canBeApplied) remainingAchs.push(95);
    if (!PelleAchievementUpgrade.achievement102.canBeApplied) remainingAchs.push(102);
    if (!PelleAchievementUpgrade.achievement103.canBeApplied) remainingAchs.push(103);
    if (!PelleAchievementUpgrade.achievement104.canBeApplied) remainingAchs.push(104);
    if (!PelleAchievementUpgrade.achievement111.canBeApplied) remainingAchs.push(111);
    if (!PelleAchievementUpgrade.achievement113.canBeApplied) remainingAchs.push(113);
    if (!PelleAchievementUpgrade.achievement116.canBeApplied) remainingAchs.push(116);
    if (!PelleAchievementUpgrade.achievement117.canBeApplied) remainingAchs.push(117);
    if (!PelleAchievementUpgrade.achievement118.canBeApplied) remainingAchs.push(118);
    if (!PelleAchievementUpgrade.achievement125.canBeApplied) remainingAchs.push(125);
    if (!PelleAchievementUpgrade.achievement131.canBeApplied) remainingAchs.push(131);
    if (!PelleAchievementUpgrade.achievement132.canBeApplied) remainingAchs.push(132);
    if (!PelleAchievementUpgrade.achievement133.canBeApplied) remainingAchs.push(133);
    if (!PelleAchievementUpgrade.achievement134.canBeApplied) remainingAchs.push(134);
    if (!PelleAchievementUpgrade.achievement137.canBeApplied) remainingAchs.push(137);
    if (!PelleAchievementUpgrade.achievement141.canBeApplied) remainingAchs.push(141);
    if (!PelleAchievementUpgrade.achievement142.canBeApplied) remainingAchs.push(142);
    if (!PelleAchievementUpgrade.achievement143.canBeApplied) remainingAchs.push(143);
    if (!PelleAchievementUpgrade.achievement156.canBeApplied) remainingAchs.push(156);
    if (!PelleAchievementUpgrade.achievement164.canBeApplied) remainingAchs.push(164);
    return remainingAchs;
  },

  get uselessInfinityUpgrades() {
    let remainingInfUpgs = [];
    if (!PelleDestructionUpgrade.passiveIPGen.canBeApplied) remainingInfUpgs.push("passiveGen");
    if (!PelleDestructionUpgrade.passiveInfGen.canBeApplied) remainingInfUpgs.push("infinitiedGeneration");
    if (!PelleDestructionUpgrade.x2IPUpgrade.canBeApplied) remainingInfUpgs.push("ipMult");
    return remainingInfUpgs;
  },

  get uselessTimeStudies() {
    let remainingTSs = [];
    if (!PelleDestructionUpgrade.timestudy32.canBeApplied) remainingTSs.push(32);
    if (!PelleDestructionUpgrade.timestudy33.canBeApplied) remainingTSs.push(33);
    if (!PelleDestructionUpgrade.timestudy41.canBeApplied) remainingTSs.push(41);
    if (!PelleDestructionUpgrade.timestudy51.canBeApplied) remainingTSs.push(51);
    if (!PelleDestructionUpgrade.timestudy61.canBeApplied) remainingTSs.push(61);
    if (!PelleDestructionUpgrade.timestudy62.canBeApplied) remainingTSs.push(62);
    if (!PelleDestructionUpgrade.timestudy121.canBeApplied) remainingTSs.push(121);
    if (!PelleDestructionUpgrade.timestudy122.canBeApplied) remainingTSs.push(122);
    if (!PelleDestructionUpgrade.timestudy123.canBeApplied) remainingTSs.push(123);
    if (!PelleDestructionUpgrade.timestudy141.canBeApplied) remainingTSs.push(141);
    if (!PelleDestructionUpgrade.timestudy142.canBeApplied) remainingTSs.push(142);
    if (!PelleDestructionUpgrade.timestudy143.canBeApplied) remainingTSs.push(143);
    if (!PelleDestructionUpgrade.timestudy192.canBeApplied) remainingTSs.push(192);
    if (!PelleDestructionUpgrade.timestudy213.canBeApplied) remainingTSs.push(213);
    return remainingTSs;
  },

  get disabledRUPGs() {
    let remainingRUs = [];
    if (!PelleRealityUpgrade.temporalAmplifier.canBeApplied) remainingRUs.push(1);
    if (!PelleRealityUpgrade.replicativeAmplifier.canBeApplied) remainingRUs.push(2);
    if (!PelleRealityUpgrade.eternalAmplifier.canBeApplied) remainingRUs.push(3);
    if (!PelleRealityUpgrade.superluminalAmplifier.canBeApplied) remainingRUs.push(4);
    if (!PelleRealityUpgrade.boundlessAmplifier.canBeApplied) remainingRUs.push(5);
    if (!PelleRealityUpgrade.cosmicallyDuplicate.canBeApplied) remainingRUs.push(6);
    if (!PelleRealityUpgrade.innumerablyConstruct.canBeApplied) remainingRUs.push(7);
    if (!PelleRealityUpgrade.paradoxicallyAttain.canBeApplied) remainingRUs.push(8);
    if (!PelleRealityUpgrade.linguisticallyExpand.canBeApplied) remainingRUs.push(9);
    if (!PelleRealityUpgrade.existentiallyProlong.canBeApplied) remainingRUs.push(10);
    if (!PelleRealityUpgrade.boundlessFlow.canBeApplied) remainingRUs.push(11);
    if (!PelleRealityUpgrade.knowingExistence.canBeApplied) remainingRUs.push(12);
    if (!PelleRealityUpgrade.telemechanicalProcess.canBeApplied) remainingRUs.push(13);
    if (!PelleRealityUpgrade.eternalFlow.canBeApplied) remainingRUs.push(14);
    if (!PelleRealityUpgrade.paradoxicalForever.canBeApplied) remainingRUs.push(15);
    if (!PelleRealityUpgrade.scourToEmpower.canBeApplied) remainingRUs.push(19);
    if (!PelleRealityUpgrade.parityOfSingularity.canBeApplied) remainingRUs.push(20);
    if (!PelleRealityUpgrade.temporalTranscendence.canBeApplied) remainingRUs.push(22);
    if (!PelleRealityUpgrade.replicativeRapidity.canBeApplied) remainingRUs.push(23);
    if (!PelleRealityUpgrade.syntheticSymbolism.canBeApplied) remainingRUs.push(24);
    return remainingRUs;
  },

  get uselessPerks() {
    let remainingPerks = [];
    if (!PellePerkUpgrade.perkSAM.canBeApplied) remainingPerks.push(10);
    if (!PellePerkUpgrade.perkSIP1.canBeApplied) remainingPerks.push(12);
    if (!PellePerkUpgrade.perkSIP2.canBeApplied) remainingPerks.push(13);
    if (!PellePerkUpgrade.perkSEP1.canBeApplied) remainingPerks.push(14);
    if (!PellePerkUpgrade.perkSEP2.canBeApplied) remainingPerks.push(15);
    if (!PellePerkUpgrade.perkSEP3.canBeApplied) remainingPerks.push(16);
    if (!PellePerkUpgrade.perkSTP.canBeApplied) remainingPerks.push(17);
    if (!PellePerkUpgrade.perkANR.canBeApplied) remainingPerks.push(30);
    if (!PellePerkUpgrade.perkEU1.canBeApplied) remainingPerks.push(40);
    if (!PellePerkUpgrade.perkEU2.canBeApplied) remainingPerks.push(41);
    if (!PellePerkUpgrade.perkDU1.canBeApplied) remainingPerks.push(42);
    if (!PellePerkUpgrade.perkDU2.canBeApplied) remainingPerks.push(43);
    if (!PellePerkUpgrade.perkATT.canBeApplied) remainingPerks.push(44);
    if (!PellePerkUpgrade.perkATD.canBeApplied) remainingPerks.push(45);
    if (!PellePerkUpgrade.perkATD.canBeApplied) remainingPerks.push(46);
    if (!PellePerkUpgrade.perkIDR.canBeApplied) remainingPerks.push(51);
    if (!PellePerkUpgrade.perkTGR.canBeApplied) remainingPerks.push(52);
    if (!PellePerkUpgrade.perkDILR.canBeApplied) remainingPerks.push(53);
    if (!PellePerkUpgrade.perkPEC1.canBeApplied) remainingPerks.push(60);
    if (!PellePerkUpgrade.perkPEC2.canBeApplied) remainingPerks.push(61);
    if (!PellePerkUpgrade.perkPEC3.canBeApplied) remainingPerks.push(62);
    if (!PellePerkUpgrade.perkTP1.canBeApplied) remainingPerks.push(80);
    if (!PellePerkUpgrade.perkTP2.canBeApplied) remainingPerks.push(81);
    if (!PellePerkUpgrade.perkTP3.canBeApplied) remainingPerks.push(82);
    if (!PellePerkUpgrade.perkTP4.canBeApplied) remainingPerks.push(83);
    if (!PellePerkUpgrade.perkDAU.canBeApplied) remainingPerks.push(100);
    if (!PellePerkUpgrade.perkDAS.canBeApplied) remainingPerks.push(103);
    if (!PellePerkUpgrade.perkTTS.canBeApplied) remainingPerks.push(104);
    if (!PellePerkUpgrade.perkTTF.canBeApplied) remainingPerks.push(105);
    if (!PellePerkUpgrade.perkTTM.canBeApplied) remainingPerks.push(106);
    if (!PellePerkUpgrade.perkDILR.canBeApplied) remainingPerks.push(201);
    if (!PellePerkUpgrade.perkDILR.canBeApplied) remainingPerks.push(202);
    if (!PellePerkUpgrade.perkDILR.canBeApplied) remainingPerks.push(203);
    if (!PellePerkUpgrade.perkDILR.canBeApplied) remainingPerks.push(204);
    return remainingPerks;
  },

  get specialGlyphEffect() {
    const isUnlocked = this.isDoomed && PelleRifts.chaos.milestones[1].canBeApplied;
    const description = this.getSpecialGlyphEffectDescriptionList(this.getAllActive);
    const activeCount = type => {
      if (!isUnlocked) return 0;
      const count = this.getAllActive.get(type);
      return count === undefined ? 0 : count;
    };
    const PGEC = this.isPelleGlyphEffectCapped;
    return {
      isUnlocked,
      description,
      hasCappedEffect: PGEC("infinity") || PGEC("time") || PGEC("replication") || PGEC("dilation") || PGEC("power"),
      infinity: this.calculatePelleInfinity(activeCount("infinity")),
      time: this.calculatePelleTime(activeCount("time")),
      replication: this.calculatePelleReplication(activeCount("replication")),
      dilation: this.calculatePelleDilation(activeCount("dilation")),
      power: this.calculatePellePower(activeCount("power")),
      companion: activeCount("companion") > 0
        ? 1.34 * activeCount("companion")
        : 1,
      isScaling: () => {
        const include = type => this.getAllActive.get(type) !== undefined;
        if (include("infinity") || include("time") || include("replication") || include("dilation")) return true;
        return false;
      },
    };
  },
  isPelleGlyphEffectCapped(type) {
    const activeCount = t => {
      if (!(Pelle.isDoomed && PelleRifts.chaos.milestones[1].canBeApplied)) return 0;
      const count = Pelle.getAllActive.get(t);
      return count === undefined ? 0 : count;
    };
    switch (type) {
      case "infinity":
        // TODO: Set a real formula
        return activeCount("infinity") > 0;
      case "time":
        // TODO: Set a real formula
        return activeCount("time") > 0;
      case "replication":
      case "dilation":
      case "power":
      case "companion":
      default:
        return false;
    }
  },
  calculatePelleInfinity(count) {
    return (count > 0 && (player.challenge.eternity.current <= 8 || PelleDestructionUpgrade.pelleGlyphEffects.canBeApplied))
        ? Currency.infinityPoints.value.plus(1).pow(0.2).pow(new Decimal(count).div(Currency.infinityPoints.value.plus(1).log10().plus(1).log10().plus(1).log10().pow(10).max(1)))
        : DC.D1
  },
  calculatePelleTime(count) {
    return count > 0
        ? Currency.eternityPoints.value.plus(1).pow(0.3).pow(new Decimal(count).div(Currency.eternityPoints.value.plus(1).log10().plus(1).log10().plus(1).log10().pow(10).max(1)))
        : DC.D1
  },
  calculatePelleReplication(count) {
    return count > 0
        ? Decimal.pow(Math.min(10 ** 60 ** (PelleRifts.vacuum.percentage), 1e300), count)
        : DC.D1
  },
  calculatePelleDilation(count) {
    return count > 0
        ? Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1).pow(count)
        : DC.D1
  },
  calculatePellePower(count) {
    return count > 0
        ? 1 + 0.02 * count
        : 1
  },
  getSpecialGlyphEffectDescription(type, count = 1, onlyReturnUseful = false) {
    switch (type) {
      case "infinity":
        return `Infinity Point gain ${formatX(this.calculatePelleInfinity(count), 2)} (based on current IP)`;
      case "time":
        return `Eternity Point gain ${formatX(this.calculatePelleTime(count), 2)}
          (based on current EP)`;
      case "replication":
        return `Replication speed ${formatX(this.calculatePelleReplication(count), 2)}
        (based on ${wordShift.wordCycle(PelleRifts.vacuum.name)})`;
      case "dilation":
        return `Dilated Time gain ${formatX(this.calculatePelleDilation(count), 2)}
          (based on Tachyon Galaxies)`;
      case "power":
        return `Galaxies are ${formatPercents(this.calculatePellePower(count) - 1)} stronger`;
      case "companion":
        return `You feel ${formatPercents(0.34)} better`;
      // Undefined means that there is no glyph equipped, needs to be here since this function is used in
      // both Current Glyph Effects and Glyph Tooltip
      case undefined:
        return onlyReturnUseful ? null : "No Glyph equipped!";
      default:
        if (onlyReturnUseful) return null;
        if (this.isGlyphTypeDisabled(type)) return "You cannot equip this Glyph while Doomed!";
        return "This Glyph has no Pelle-exclusive effect! That sucks.";
    }
  },

  getSpecialGlyphEffectDescriptionList(map) {
    const list = [];
    map.forEach((value, key) => {
      const desp = this.getSpecialGlyphEffectDescription(key, value, true);
      if (desp !== null) list.push([desp, this.isPelleGlyphEffectCapped(key)]);
    });
    return list;
  },

  get remnantRequirementForDilation() {
    return PelleStrikes.dilation.isDestroyed() ? 0 : 3.8e7;
  },

  get canDilateInPelle() {
    return this.cel.remnants.gte(this.remnantRequirementForDilation);
  },

  resetResourcesForDilation() {
    this.cel.records.totalEndgameAntimatter = new Decimal("1e180000");
    this.cel.records.totalInfinityPoints = new Decimal("1e60000");
    Currency.eternityPoints.reset();
    // Oddly specific number? Yes, it's roughly the amount of EP you have
    // when starting dilation for the first time
    // Since 5th strike previously did not reset your current EP the previous reset value was kind of useless which
    // lead to some balancing problems, this hopefully prevents people starting dilation too early and getting
    // softlocked, or starting it too late and getting not-softlocked.
    this.cel.records.totalEternityPoints = new Decimal("1e1050");
  },

  get remnantsGain() {
    let am = this.cel.records.totalEndgameAntimatter.plus(1).log10();
    let ip = this.cel.records.totalInfinityPoints.plus(1).log10();
    let ep = this.cel.records.totalEternityPoints.plus(1).log10();

    if (PelleStrikes.dilation.hasStrike) {
      am = am.times(500);
      ip = ip.times(10);
      ep = ep.times(5);
    }

    if (EndgameMastery(61).isBought && !player.disablePostReality) {
      am = am.times(10000);
      ip = ip.times(500);
      ep = ep.times(25);
    }

    const gainOld = Decimal.pow((Decimal.log10(am.add(2)).add(Decimal.log10(ip.add(2))).add(Decimal.log10(ep.add(2)))).div(1.7), 8);

    const gainNew = Decimal.pow((Decimal.log10(am.add(2)).add(Decimal.log10(ip.add(2))).add(Decimal.log10(ep.add(2)))).div(1.6), 8.2);

    const gainNewer = Decimal.pow((Decimal.log10(am.add(2)).add(Decimal.log10(ip.add(2))).add(Decimal.log10(ep.add(2)))).div(1.2), 8.5);

    const gain = false ? gainNewer : ((EndgameMastery(61).isBought && !player.disablePostReality) ? gainNew : gainOld);

    return gain.lt(1) ? gain : Decimal.floor(gain.sub(this.cel.remnants));
  },

  realityShardGain(remnants) {
    return Decimal.pow(10, Decimal.pow(remnants, 1 / 8).times(4)).minus(1).div(1e3);
  },

  get realityShardGainPerSecond() {
    return this.realityShardGain(this.cel.remnants);
  },

  get nextRealityShardGain() {
    return this.realityShardGain(this.remnantsGain.add(this.cel.remnants));
  },

  // Calculations assume this is in units of proportion per second (eg. 0.03 is 3% drain per second)
  get riftDrainPercent() {
    const alphaBoost = Alpha.isDestroyed ? 0.45 : 0;
    const extraDrain = Math.min(0.45, player.endgames * 0.05);
    if (EndgameMilestone.riftFill.isReached && !player.disablePostReality) return 0.05 + extraDrain + alphaBoost;
    return 0.05;
  },

  get glyphMaxLevel() {
    return PelleUpgrade.glyphLevels.effectValue;
  },

  get glyphStrength() {
    return 1;
  },

  antimatterDimensionMult(x) {
    return Decimal.pow(10, Math.log10(x + 1) + x ** 5.2 / 1e3 + 4 ** x / 1e18);
  },

  // Deprecated
  get activeGlyphType() {
    return Glyphs.active.filter(Boolean)[0]?.type;
  },

  get hasGalaxyGenerator() {
    return player.celestials.pelle.galaxyGenerator.unlocked;
  },

  // Transition text from "from" to "to", stage is 0-1, 0 is fully "from" and 1 is fully "to"
  // Also adds more zalgo the bigger the stage
  transitionText(from, to, stage = 0) {
    const len = Math.round((from.length * (1 - stage) + to.length * stage) * 1e8) / 1e8;
    const toInterval = len * (1 - stage);
    let req = toInterval;
    let str = "";
    for (let i = 0; i < len; i++) {
      if (i >= req) {
        const idx = Math.floor(i * (to.length / len));
        str += to[idx];
        req += toInterval;
      } else {
        const idx = Math.floor(i * (from.length / len));
        str += from[idx];
      }
    }
    return zalgo(str, Math.floor(stage ** 2 * 7));
  },

  get endTabNames() {
    if (player.celestials.pelle.divinities >= 13) {
      return "Our Newest Celestial Still Traverses This Reality For Scraps Of Power Amusing Confusing Laughter".split(" ");
    } else if (player.celestials.pelle.divinities > 0) {
      return "Thus We Go Again Rebirth Is Inevitable Surge Forward In Ω Your Divine Leadership".split(" ");
    } else if (Effarig.isRunning) {
      return "Congratulations You Have Just Beaten A Dual Celestial Reality Ω Ω Pelle Is Impressed".split(" ");
    } else if (Alpha.isDestroyed) {
      return "Why Still Here All Is Destroyed Nothing Remains Except Ω Ω Generator Filament Stars".split(" ");
    } else if (Achievement(191).isUnlocked) {
      return "Destruction Has Come A New Beginning Has Arrived Ω Ω Ω We'll Meet Again".split(" ");
    } else {
      return "It's Not Over We Will Return We'll Ω Ω Ω Ω Soon Meet Again".split(" ");
    }
  },

  quotes: Quotes.pelle,

  isGlyphTypeDisabled(type, alwaysInDoom = false) {
    if (!(this.isDoomed || alwaysInDoom)) return false;
    if (type === "reality") return !PelleAlchemyUpgrade.alchemyReality.canBeApplied;
    if (type === "effarig") return !PelleDestructionUpgrade.specialGlyphEffects.canBeApplied;
    if (type === "cursed") return true;
    return false;
  },

  get getAllActive() {
    const map = new Map();
    Glyphs.active.forEach(glyph => {
      if (glyph) {
        const i = map.get(glyph.type);
        if (i === undefined) map.set(glyph.type, 1);
        else map.set(glyph.type, i + 1);
      }
    });
    return map;
  }
};

EventHub.logic.on(GAME_EVENT.ARMAGEDDON_AFTER, () => {
  if (Currency.remnants.gte(1)) {
    Pelle.quotes.arm.show();
  }
});
EventHub.logic.on(GAME_EVENT.PELLE_STRIKE_UNLOCKED, () => {
  if (PelleStrikes.infinity.hasStrike) {
    Pelle.quotes.strike1.show();
  }
  if (PelleStrikes.powerGalaxies.hasStrike) {
    Pelle.quotes.strike2.show();
  }
  if (PelleStrikes.eternity.hasStrike) {
    Pelle.quotes.strike3.show();
  }
  if (PelleStrikes.ECs.hasStrike) {
    Pelle.quotes.strike4.show();
  }
  if (PelleStrikes.dilation.hasStrike) {
    Pelle.quotes.strike5.show();
  }
});
EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  if (GameEnd.endState > END_STATE_MARKERS.GAME_END && !GameEnd.removeAdditionalEnd) Pelle.quotes.endgame.show();
});
EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  if (player.celestials.pelle.records.totalEndgameAntimatter.gte(DC.E9E15) && player.endgames >= 1) Pelle.quotes.end2.show();
});
EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  if (Pelle.isDoomed && (PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length >= 1 || PelleDestructionUpgrade.all.filter(u => u.canBeApplied).length >= 1)) {
    Pelle.quotes.disable.show();
  }
  if (Pelle.isDoomed && PelleDestructionUpgrade.disableGalaxyNerf.canBeApplied) {
    Pelle.quotes.galaxyDebuffDisable.show();
  }
  if (Pelle.isDoomed && Achievement(196).isUnlocked) {
    Pelle.quotes.allPelleAchs.show();
  }
  if (Pelle.isDoomed && Achievement(204).isUnlocked) {
    Pelle.quotes.allPelleNerfs.show();
  }
});
EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  if (PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 1) Pelle.quotes.strikeDisable1.show();
  if (PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 2) Pelle.quotes.strikeDisable2.show();
  if (PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 3) Pelle.quotes.strikeDisable3.show();
  if (PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 4) Pelle.quotes.strikeDisable4.show();
  if (PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 5) Pelle.quotes.strikeDisable5.show();
});
EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  if (Glyphs.activeWithoutCompanion.length > 0) player.requirementChecks.endgame.noGlyphsDoomed = false;
});

export class RebuyablePelleUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.realityShards;
  }

  get boughtAmount() {
    return player.celestials.pelle.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.celestials.pelle.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount >= this.config.cap;
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }

  onPurchased() {
    if (this.id === "glyphLevels") EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  }
}

export class PelleUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.pelle.upgrades;
  }

  get currency() {
    return Currency.realityShards;
  }

  get description() {
    return this.config.description;
  }

  get cost() {
    return this.config.cost;
  }

  get isAvailableForPurchase() {
    return Pelle.isDoomed;
  }

}

export const PelleUpgrade = mapGameDataToObject(
  GameDatabase.celestials.pelle.upgrades,
  config => (config.rebuyable
    ? new RebuyablePelleUpgradeState(config)
    : new PelleUpgradeState(config)
  )
);

PelleUpgrade.rebuyables = PelleUpgrade.all.filter(u => u.isRebuyable);
// An upgrade was added post-release; it's simpler to just sort them by cost rather than to migrate the internal data
PelleUpgrade.singles = PelleUpgrade.all.filter(u => !u.isRebuyable).sort((a, b) => a.cost - b.cost);

export class DivinityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    return Currency.divinities.gte(this.config.divinities);
  }
}
export const DivinityMilestone = mapGameDataToObject(
  GameDatabase.celestials.divinityMilestones,
  config => (config.isBaseResource
    ? new DivinityMilestoneState(config)
    : new DivinityMilestoneState(config))
);
