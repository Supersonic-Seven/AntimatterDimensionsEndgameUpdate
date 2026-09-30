/**
 * @abstract
 */
class MathOperations {
  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  add(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  subtract(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  multiply(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  divide(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  max(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  min(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  eq(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gte(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lte(left, right) { throw new NotImplementedError(); }
}

MathOperations.number = new class NumberMathOperations extends MathOperations {
  add(left, right) { return left + right; }
  subtract(left, right) { return left - right; }
  multiply(left, right) { return left * right; }
  divide(left, right) { return left / right; }
  max(left, right) { return Math.max(left, right); }
  min(left, right) { return Math.min(left, right); }
  eq(left, right) { return left === right; }
  gt(left, right) { return left > right; }
  gte(left, right) { return left >= right; }
  lt(left, right) { return left < right; }
  lte(left, right) { return left <= right; }
}();

MathOperations.decimal = new class DecimalMathOperations extends MathOperations {
  add(left, right) { return Decimal.add(left, right); }
  subtract(left, right) { return Decimal.subtract(left, right); }
  multiply(left, right) { return Decimal.multiply(left, right); }
  divide(left, right) { return Decimal.divide(left, right); }
  max(left, right) { return Decimal.max(left, right); }
  min(left, right) { return Decimal.min(left, right); }
  eq(left, right) { return Decimal.eq(left, right); }
  gt(left, right) { return Decimal.gt(left, right); }
  gte(left, right) { return Decimal.gte(left, right); }
  lt(left, right) { return Decimal.lt(left, right); }
  lte(left, right) { return Decimal.lte(left, right); }
}();

/**
 * @abstract
 */
export class Currency {
  /**
   * @abstract
   */
  get value() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set value(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   * @type {MathOperations}
   */
  get operations() { throw new NotImplementedError(); }

  add(amount) {
    this.value = this.operations.add(this.value, amount);
  }

  subtract(amount) {
    if (player.DEV && new Decimal(amount).gt(this.value)) console.log("Subtract command attempted to make currency negative, resetting currency and breaking loop");
    if (DC.E9E15.lt(this.value) || DC.E9E15.lt(amount)) return;
    switch (new Decimal(amount).cmp(this.value)) {
      case -1: // amount < value
        this.value = this.operations.max(this.operations.subtract(this.value, amount), 0);
        break;
      case 0: // amount == value
        this.value = (this.value instanceof DecimalCurrency || this.value instanceof Decimal) ? Decimal.floor(this.value.div(1e15)) : Math.floor(this.value / 1e15);
        break;
      default: // amount > value
        this.value = (this.value instanceof DecimalCurrency || this.value instanceof Decimal) ? Decimal.floor(this.value.div(1e15)) : Math.floor(this.value / 1e15);
    }
  }

  multiply(amount) {
    this.value = this.operations.multiply(this.value, amount);
  }

  divide(amount) {
    this.value = this.operations.divide(this.value, amount);
  }

  eq(amount) {
    return this.operations.eq(this.value, amount);
  }

  gt(amount) {
    return this.operations.gt(this.value, amount);
  }

  gte(amount) {
    return this.operations.gte(this.value, amount);
  }

  lt(amount) {
    return this.operations.lt(this.value, amount);
  }

  lte(amount) {
    return this.operations.lte(this.value, amount);
  }

  purchase(cost) {
    if (!this.gte(cost)) return false;
    if (new Decimal(cost).gte(DC.E9E15)) return true;
    this.subtract(cost);
    return true;
  }

  bumpTo(value) {
    this.value = this.operations.max(this.value, value);
  }

  dropTo(value) {
    this.value = this.operations.min(this.value, value);
  }

  get startingValue() { throw new NotImplementedError(); }

  reset() {
    this.value = this.startingValue;
  }
}

/**
 * @abstract
 */
class NumberCurrency extends Currency {
  get operations() { return MathOperations.number; }
  get startingValue() { return 0; }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  get operations() { return MathOperations.decimal; }
  get sign() { return this.value.sign; }
  get mag() { return this.value.mag; }
  get layer() { return this.value.layer; }
  get startingValue() { return DC.D0; }
}
window.DecimalCurrency = DecimalCurrency;

Currency.antimatter = new class extends DecimalCurrency {
  get value() { return player.antimatter; }

  set value(value) {
    if (InfinityChallenges.nextIC) InfinityChallenges.notifyICUnlock(value);
    if (GameCache.cheapestAntimatterAutobuyer.value && value.gte(GameCache.cheapestAntimatterAutobuyer.value)) {
      // Clicking into the automation tab clears the trigger and prevents it from retriggering as long as the player
      // stays on the tab; leaving the tab with an available autobuyer will immediately force it to trigger again
      TabNotification.newAutobuyer.clearTrigger();
      TabNotification.newAutobuyer.tryTrigger();
    }
    player.antimatter = value;
    player.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM.max(value);
    player.records.thisEternity.maxAM = player.records.thisEternity.maxAM.max(value);
    player.records.thisReality.maxAM = player.records.thisReality.maxAM.max(value);

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalAntimatter = player.celestials.pelle.records.totalAntimatter.max(value);
      player.records.bestDoomedAntimatterThisDivinity = player.records.bestDoomedAntimatterThisDivinity.max(value);
      player.celestials.pelle.records.totalEndgameAntimatter = player.celestials.pelle.records.totalEndgameAntimatter.max(value);
    }

    if (!Pelle.isDoomed) {
      player.records.totalAntimatterOutsideDoom = player.records.totalAntimatterOutsideDoom.max(value);
    }
    if (LHC.voidRunning) {
      player.endgame.largeHadronCollider.void.highestAntimatter = player.endgame.largeHadronCollider.void.highestAntimatter.max(value);
    }
    if (player.universes.current === 1) {
      player.universes.highestTransientAntimatter = player.universes.highestTransientAntimatter.max(value);
    }
    if (player.universes.current === 2) {
      player.universes.highestTangibleMatter = player.universes.highestTangibleMatter.max(value);
    }
  }

  add(amount) {
    super.add(amount);
    if (amount.gt(0)) {
      player.records.totalAntimatter = player.records.totalAntimatter.add(amount);
      player.records.totalEndgameAntimatter = player.records.totalEndgameAntimatter.add(amount);
      player.records.totalRealityAntimatter = player.records.totalRealityAntimatter.add(amount);
      player.records.totalEternityAntimatter = player.records.totalEternityAntimatter.add(amount);
      player.records.totalInfinityAntimatter = player.records.totalInfinityAntimatter.add(amount);
      player.requirementChecks.reality.noAM = false;
    }
  }

  get productionPerSecond() {
    return NormalChallenge(12).isRunning
      ? AntimatterDimension(1).productionPerRealSecond.plus(AntimatterDimension(2).productionPerRealSecond)
      : AntimatterDimension(1).productionPerRealSecond;
  }

  get startingValue() {
    if (player.disablePostReality) {
      return Effects.max(
        10,
        Achievement(21),
        Achievement(37),
        Achievement(54),
        Achievement(55),
        Achievement(78)
      ).toDecimal();
    }
    if (Pelle.isDoomed) {
      if (PellePerkUpgrade.perkSAM.canBeApplied) return Effects.max(10, Perk.startAM).toDecimal();
      if (PelleAchievementUpgrade.achievement78.canBeApplied) return Effects.max(10, Achievement(78)).toDecimal();
      if (PelleAchievementUpgrade.achievement55.canBeApplied) return Effects.max(10, Achievement(55)).toDecimal();
      if (PelleAchievementUpgrade.achievement54.canBeApplied) return Effects.max(10, Achievement(54)).toDecimal();
      if (PelleAchievementUpgrade.achievement37.canBeApplied) return Effects.max(10, Achievement(37)).toDecimal();
      return Effects.max(10, Achievement(21)).toDecimal();
    }
    return Effects.max(
      10,
      Perk.startAM,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78)
    ).toDecimal();
  }
}();

Currency.matter = new class extends DecimalCurrency {
  get value() { return player.matter; }
  set value(value) {
    player.matter = Decimal.min(value, DC.BEMAX);
  }
}();

Currency.infinities = new class extends DecimalCurrency {
  get value() { return player.infinities; }
  set value(value) { player.infinities = value; }
}();

Currency.infinitiesBanked = new class extends DecimalCurrency {
  get value() { return player.infinitiesBanked; }
  set value(value) { player.infinitiesBanked = value; }
}();

Currency.infinitiesTotal = new class extends DecimalCurrency {
  get value() { return player.infinities.plus(player.infinitiesBanked); }
  set value(value) { player.infinities = value; }
}();

Currency.infinityPoints = new class extends DecimalCurrency {
  get value() { return player.infinityPoints; }
  set value(value) {
    player.infinityPoints = value;
    player.records.thisEternity.maxIP = player.records.thisEternity.maxIP.max(value);
    player.records.thisReality.maxIP = player.records.thisReality.maxIP.max(value);

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalInfinityPoints =
        player.celestials.pelle.records.totalInfinityPoints.max(value);
    }
  }

  get startingValue() {
    if (player.disablePostReality) {
      return Effects.max(
        0,
        Achievement(104)
      ).toDecimal();
    }
    if (Pelle.isDisabled()) {
      if (PellePerkUpgrade.perkSIP2.canBeApplied) return Effects.max(0, Perk.startIP2).toDecimal();
      if (PellePerkUpgrade.perkSIP1.canBeApplied) return Effects.max(0, Perk.startIP1).toDecimal();
      if (PelleAchievementUpgrade.achievement104.canBeApplied) return Effects.max(0, Achievement(104)).toDecimal();
      return new Decimal(0);
    }
    return Effects.max(
      0,
      Perk.startIP1,
      Perk.startIP2,
      Achievement(104)
    ).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisEternity.maxIP = this.startingValue;
  }
}();

Currency.infinityPower = new class extends DecimalCurrency {
  get value() { return player.infinityPower; }
  set value(value) { player.infinityPower = value; }
}();

Currency.eternities = new class extends DecimalCurrency {
  get value() { return player.eternities; }
  set value(value) { player.eternities = value; }

  get startingValue() {
    if (LHC.voidRunning && NullUpgrade.eterMiles.isBought) return new Decimal(100);
    if (Pelle.isDoomed) {
      if (PelleRealityUpgrade.existentiallyProlong.canBeApplied) return Effects.max(0, RealityUpgrade(10)).toDecimal();
      return new Decimal(0);
    }
    return Effects.max(
      0,
      RealityUpgrade(10)
    ).toDecimal();
  }
}();

Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) {
    player.eternityPoints = value;
    player.records.thisReality.maxEP = player.records.thisReality.maxEP.max(value);
    if (player.records.bestReality.bestEP.lt(value)) {
      player.records.bestReality.bestEP = value;
      player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalEternityPoints =
        player.celestials.pelle.records.totalEternityPoints.max(value);
    }
  }

  get startingValue() {
    if (player.disablePostReality) return DC.D0;
    if (Pelle.isDisabled()) {
      if (PellePerkUpgrade.perkSEP3.canBeApplied) return Effects.max(0, Perk.startEP3).toDecimal();
      if (PellePerkUpgrade.perkSEP2.canBeApplied) return Effects.max(0, Perk.startEP2).toDecimal();
      if (PellePerkUpgrade.perkSEP1.canBeApplied) return Effects.max(0, Perk.startEP1).toDecimal();
      return new Decimal(0);
    }
    return Effects.max(
      0,
      Perk.startEP1,
      Perk.startEP2,
      Perk.startEP3
    ).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisReality.maxEP = this.startingValue;
  }
}();

Currency.timeShards = new class extends DecimalCurrency {
  get value() { return player.timeShards; }
  set value(value) { player.timeShards = value; }
}();

Currency.timeTheorems = new class extends DecimalCurrency {
  get value() { return player.timestudy.theorem; }
  set value(value) {
    player.timestudy.theorem = value;
    player.timestudy.maxTheorem = value.plus(TimeTheorems.calculateTimeStudiesCost());
  }

  get max() { return player.timestudy.maxTheorem; }

  add(amount) {
    super.add(amount);
    player.timestudy.maxTheorem = player.timestudy.maxTheorem.plus(amount);
  }

  reset() {
    respecTimeStudies(true);
    super.reset();
    TimeTheoremPurchaseType.am.reset();
    TimeTheoremPurchaseType.ip.reset();
    TimeTheoremPurchaseType.ep.reset();
    player.timestudy.maxTheorem = this.startingValue;
  }
}();

Currency.tachyonParticles = new class extends DecimalCurrency {
  get value() { return player.dilation.tachyonParticles; }
  set value(value) { player.dilation.tachyonParticles = value; }
}();

Currency.dilatedTime = new class extends DecimalCurrency {
  get value() { return player.dilation.dilatedTime; }
  set value(value) {
    player.dilation.dilatedTime = value;
    player.records.thisReality.maxDT = player.records.thisReality.maxDT.max(value);
  }
}();

Currency.realities = new class extends DecimalCurrency {
  get value() { return player.realities; }
  set value(value) {
    const newValue = new Decimal(value);
    player.realities = newValue;
  }

  get startingValue() {
    if (EndgameUpgrade(6).isBought && !player.disablePostReality) {
      return 1000;
    }
    return Effects.max(
      0,
      EndgameMastery(31)
    );
  }
}();

Currency.realityMachines = new class extends DecimalCurrency {
  get value() { return player.reality.realityMachines; }
  set value(value) {
    const newValue = Decimal.min(value, MachineHandler.hardcapRM);
    const addedThisReality = newValue.minus(player.reality.realityMachines);
    player.reality.realityMachines = newValue;
    player.reality.maxRM = Decimal.max(player.reality.maxRM, newValue);
    if (player.records.bestReality.RM.lt(addedThisReality)) {
      player.records.bestReality.RM = addedThisReality;
      player.records.bestReality.RMSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }
  }

  get startingValue() {
    return Effects.max(
      0,
      EndgameMastery(32)
    ).toDecimal();
  }
}();

Currency.perkPoints = new class extends DecimalCurrency {
  get value() { return player.reality.perkPoints; }
  set value(value) {
    const newValue = new Decimal(value);
    player.reality.perkPoints = newValue;
  }
}();

Currency.relicShards = new class extends DecimalCurrency {
  get value() { return player.celestials.effarig.relicShards; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.effarig.relicShards = newValue;
  }
}();

Currency.imaginaryMachines = new class extends DecimalCurrency {
  get value() { return player.reality.imaginaryMachines; }
  set value(value) {
    const newValue = new Decimal(value);
    player.reality.imaginaryMachines = Decimal.clampMax(newValue, MachineHandler.currentIMCap);
  }
}();

Currency.unnerfedDarkMatter = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.unnerfedDarkMatter; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.laitela.unnerfedDarkMatter = newValue;
  }
}();

Currency.darkMatter = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.darkMatter; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.laitela.darkMatter = newValue;
    player.celestials.laitela.maxDarkMatter = player.celestials.laitela.maxDarkMatter.max(newValue);
  }

  get max() { return player.celestials.laitela.maxDarkMatter; }
  set max(value) { player.celestials.laitela.maxDarkMatter = value; }
}();

Currency.darkEnergy = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.darkEnergy; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.laitela.darkEnergy = newValue;
  }

  get productionPerSecond() {
    if (SingularityMilestone.dmdMultBooster.isUnlocked) return DarkMatterDimensions.totalPowerDE;
    return DarkMatterDimensions.all
      .map(d => d.productionPerSecond)
      .decimalSum();
  }
}();

Currency.singularities = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.singularities; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.laitela.singularities = newValue;
  }
}();

Currency.remnants = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.remnants; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.pelle.remnants = newValue;
  }
}();

Currency.realityShards = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.realityShards; }
  set value(value) { player.celestials.pelle.realityShards = value; }
}();

Currency.replicanti = new class extends DecimalCurrency {
  get value() { return player.replicanti.amount; }
  set value(value) { player.replicanti.amount = value; }
}();

Currency.galaxyGeneratorGalaxies = new class extends DecimalCurrency {
  get value() {
    return player.galaxies.add(GalaxyGenerator.galaxies);
  }

  set value(value) {
    const spent = player.galaxies.add(GalaxyGenerator.galaxies).sub(value);
    player.celestials.pelle.galaxyGenerator.spentGalaxies = player.celestials.pelle.galaxyGenerator.spentGalaxies.add(spent);
  }
}();

Currency.endgames = new class extends NumberCurrency {
  get value() { return player.endgames; }
  set value(value) { player.endgames = value; }
}();

Currency.celestialPoints = new class extends DecimalCurrency {
  get value() { return player.endgame.celestialPoints; }
  set value(value) {
    const newValue = new Decimal(value);
    player.endgame.celestialPoints = newValue;
  }
}();

Currency.unnerfedCelestialMatter = new class extends DecimalCurrency {
  get value() { return player.endgame.unnerfedCelestialMatter; }
  set value(value) {
    const newValue = new Decimal(value);
    player.endgame.unnerfedCelestialMatter = newValue;
  }

  get productionPerSecond() {
    return AntimatterDimension(1).productionPerRealSecond;
  }

  get startingValue() {
    return Effects.max(CelestialEternityUpgrade.startingBoosts.effectOrDefault(0)).toDecimal();
  }
}();

Currency.celestialMatter = new class extends DecimalCurrency {
  get value() { return player.endgame.celestialMatter; }
  set value(value) {
    const newValue = player.endgame.celDimExpansion.isBroken ? new Decimal(value) : Decimal.min(value, DC.NUMMAX);
    player.endgame.celestialMatter = newValue;
  }

  get startingValue() {
    return Effects.max(CelestialEternityUpgrade.startingBoosts.effectOrDefault(0)).toDecimal();
  }
}();

Currency.doomedParticles = new class extends DecimalCurrency {
  get value() { return player.endgame.doomedParticles; }
  set value(value) {
    const newValue = Alpha.isDestroyed ? new Decimal(value) : Decimal.min(value, DC.E100);
    player.endgame.doomedParticles = newValue;
  }
}();

Currency.endgameSkills = new class extends DecimalCurrency {
  get value() { return player.endgameMasteries.skills; }
  set value(value) {
    player.endgameMasteries.skills = value;
    player.endgameMasteries.maxSkills = value.plus(EndgameSkills.calculateEndgameMasteriesCost());
  }

  get max() { return player.endgameMasteries.maxSkills; }

  add(amount) {
    super.add(amount);
    player.endgameMasteries.maxSkills = player.endgameMasteries.maxSkills.plus(amount);
    player.endgameMasteries.maxSkills = player.endgameMasteries.skills.plus(EndgameSkills.calculateEndgameMasteriesCost());
  }

  reset() {
    respecEndgameMasteries(true);
    super.reset();
    EndgameSkillPurchaseType.gg.reset();
    EndgameSkillPurchaseType.cp.reset();
    EndgameSkillPurchaseType.dp.reset();
    player.endgameMasteries.maxSkills = this.startingValue;
  }
}();

Currency.galacticPower = new class extends DecimalCurrency {
  get value() { return player.endgame.galacticPower; }
  set value(value) {
    const newValue = Alpha.isDestroyed ? new Decimal(value) : Decimal.min(value, DC.NUMMAX);
    player.endgame.galacticPower = newValue;
  }
}();

Currency.etherealPower = new class extends DecimalCurrency {
  get value() { return player.endgame.ethereal.power; }
  set value(value) {
    const newValue = new Decimal(value);
    player.endgame.ethereal.power = newValue;
  }
}();

Currency.dualMachines = new class extends DecimalCurrency {
  get value() { return player.reality.dualMachines; }
  set value(value) {
    const newValue = new Decimal(value);
    player.reality.dualMachines = Decimal.clampMax(newValue, MachineHandler.currentDMCap);
  }
}();

Currency.celestialInfinities = new class extends DecimalCurrency {
  get value() { return player.endgame.celDimExpansion.celestialInfinities; }
  set value(value) { player.endgame.celDimExpansion.celestialInfinities = value; }
}();

Currency.celestialInfinityPoints = new class extends DecimalCurrency {
  get value() { return player.endgame.celDimExpansion.celestialInfinityPoints; }
  set value(value) {
    player.endgame.celDimExpansion.celestialInfinityPoints = value;
    player.records.thisCelestialEternity.maxCIP = player.records.thisCelestialEternity.maxCIP.max(value);
    player.records.thisCelestialReality.maxCIP = player.records.thisCelestialReality.maxCIP.max(value);
  }

  get startingValue() {
    return Effects.max(CelestialEternityUpgrade.startingBoosts.effectOrDefault(0)).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisCelestialEternity.maxCIP = this.startingValue;
  }
}();

Currency.celestialEternities = new class extends DecimalCurrency {
  get value() { return player.endgame.celDimExpansion.celestialEternities; }
  set value(value) { player.endgame.celDimExpansion.celestialEternities = value; }
}();

Currency.celestialEternityPoints = new class extends DecimalCurrency {
  get value() { return player.endgame.celDimExpansion.celestialEternityPoints; }
  set value(value) {
    player.endgame.celDimExpansion.celestialEternityPoints = value;
    player.records.thisCelestialReality.maxCEP = player.records.thisCelestialReality.maxCEP.max(value);
  }

  get startingValue() {
    return Effects.max(0).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisCelestialReality.maxCEP = this.startingValue;
  }
}();

Currency.divinities = new class extends NumberCurrency {
  get value() { return player.celestials.pelle.divinities; }
  set value(value) { player.celestials.pelle.divinities = value; }
}();

Currency.divineMatter = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.divinity.divineMatter; }
  set value(value) {
    const newValue = Decimal.min(value, DivineDimensions.HARDCAP);
    player.celestials.pelle.divinity.divineMatter = newValue;
    player.records.thisCondense.maxVM = player.records.thisCondense.maxVM.max(newValue);
    player.records.thisSupernova.maxVM = player.records.thisSupernova.maxVM.max(newValue);
    player.records.totalDivineMatter = player.records.totalDivineMatter.max(newValue);
    player.records.totalCondenseDivineMatter = player.records.totalCondenseDivineMatter.max(newValue);
    player.records.totalSupernovaDivineMatter = player.records.totalSupernovaDivineMatter.max(newValue);
  }

  get startingValue() {
    return Effects.max(10, DivinityUpgrade.divineL2U6).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisCondense.maxVM = this.startingValue;
    player.records.thisSupernova.maxVM = this.startingValue;
  }
}();

Currency.divineEnergy = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.divinity.divineEnergy; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.pelle.divinity.divineEnergy = newValue;
  }
}();

Currency.nullMatter = new class extends DecimalCurrency {
  get value() { return player.endgame.largeHadronCollider.void.nullMatter; }
  set value(value) {
    const newValue = DualityUpgrade(26).isBought ? new Decimal(value) : Decimal.min(value, DC.NUMMAX);
    player.endgame.largeHadronCollider.void.nullMatter = newValue;
  }
}();

Currency.condenses = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.divinity.condenses; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.pelle.divinity.condenses = newValue;
  }
}();

Currency.divineStars = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.divinity.divineStars; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.pelle.divinity.divineStars = newValue;
    player.records.thisSupernova.maxVS = player.records.thisSupernova.maxVS.max(value);
  }

  get startingValue() {
    return Effects.max(0).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisSupernova.maxVS = this.startingValue;
  }
}();

Currency.starPower = new class extends DecimalCurrency {
  get value() { return player.endgame.ethereal.starPower; }
  set value(value) {
    const newValue = new Decimal(value);
    player.endgame.ethereal.starPower = newValue;
  }
}();

Currency.nullParticles = new class extends DecimalCurrency {
  get value() { return player.endgame.largeHadronCollider.void.nullParticles; }
  set value(value) {
    const newValue = new Decimal(value);
    player.endgame.largeHadronCollider.void.nullParticles = newValue;
  }
}();

Currency.supernovae = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.divinity.supernovae; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.pelle.divinity.supernovae = newValue;
  }
}();

Currency.nebulae = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.divinity.nebulae; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.pelle.divinity.nebulae = newValue;
    player.records.bestSupernova.maxNeb = player.records.bestSupernova.maxNeb.max(value);
  }

  add(amount) {
    super.add(amount);
    player.records.bestSupernova.totalNeb = player.records.bestSupernova.totalNeb.plus(amount);
  }

  get startingValue() {
    return Effects.max(0).toDecimal();
  }

  reset() {
    super.reset();
    player.records.bestSupernova.maxNeb = this.startingValue;
  }
}();

Currency.serpentinePower = new class extends DecimalCurrency {
  get value() { return player.celestials.slabdrill.serpentinePower; }
  set value(value) {
    const newValue = new Decimal(value);
    player.celestials.slabdrill.serpentinePower = newValue;
  }
}();

Currency.thermalRadiation = new class extends DecimalCurrency {
  get value() { return player.compression.thermalRadiation; }
  set value(value) {
    const newValue = new Decimal(value);
    player.compression.thermalRadiation = newValue;
  }
}();

Currency.hawkingRadiation = new class extends DecimalCurrency {
  get value() { return player.compression.hawkingRadiation; }
  set value(value) {
    const newValue = new Decimal(value);
    player.compression.hawkingRadiation = newValue;
  }
}();

Currency.relativisticParticles = new class extends DecimalCurrency {
  get value() { return player.universes.relativisticParticles; }
  set value(value) {
    const newValue = new Decimal(value);
    player.universes.relativisticParticles = newValue;
  }
}();

Currency.ephemeralLight = new class extends DecimalCurrency {
  get value() { return player.universes.ephemeralLight; }
  set value(value) {
    const newValue = new Decimal(value);
    player.universes.ephemeralLight = newValue;
  }
}();

Currency.molecularMass = new class extends DecimalCurrency {
  get value() { return player.universes.molecularMass; }
  set value(value) {
    const newValue = new Decimal(value);
    player.universes.molecularMass = newValue;
  }
}();

Currency.stellarAugmenters = new class extends DecimalCurrency {
  get value() { return player.universes.stellarAugmenters; }
  set value(value) {
    const newValue = new Decimal(value);
    player.universes.stellarAugmenters = newValue;
  }
}();
