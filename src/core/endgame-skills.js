/**
 * @abstract
 */
export class EndgameSkillPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount += amount; }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0).toNumber();
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying CP/DP without the
  // perk that makes them free, this will be incorrect, but the CP/DP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount - 1));
  }

  purchase(bulk) {
    if (!this.canAfford) return false;
    let purchased = false;
    const amount = this.bulkPossible;
    const buyFn = cost => this.currency.purchase(cost);
    // This will sometimes buy one too few for CP/DP, so we just have to buy 1 after.
    if (bulk && buyFn(this.bulkCost(amount - 1))) {
      Currency.endgameSkills.add(amount - 1);
      this.add(amount - 1);
      purchased = true;
    }
    if (buyFn(this.cost)) {
      Currency.endgameSkills.add(1);
      this.add(1);
      purchased = true;
    }
    return purchased;
  }

  get canAfford() {
    return this.currency.gte(this.cost) && player.endgames > 0;
  }

  reset() {
    this.amount = 0;
  }
}

EndgameSkillPurchaseType.gg = new class extends EndgameSkillPurchaseType {
  get amount() { return player.endgameMasteries.ggBought; }
  set amount(value) { player.endgameMasteries.ggBought = value; }

  get currency() { return Currency.galaxyGeneratorGalaxies; }
  get costBase() { return DC.E10; }
  get costIncrement() { return DualityUpgrade(27).isBought ? new Decimal(1.1) : DC.E2; }

  bulkCost(amount) {
    return this.costIncrement.pow(amount + this.amount).subtract(this.cost);
  }
}();

EndgameSkillPurchaseType.cp = new class extends EndgameSkillPurchaseType {
  get amount() { return player.endgameMasteries.cpBought; }
  set amount(value) { player.endgameMasteries.cpBought = value; }

  get currency() { return Currency.celestialPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E1; }

  bulkCost(amount) {
    return this.costIncrement.pow(amount + this.amount).subtract(this.cost);
  }
}();

EndgameSkillPurchaseType.dp = new class extends EndgameSkillPurchaseType {
  get amount() { return player.endgameMasteries.dpBought; }
  set amount(value) { player.endgameMasteries.dpBought = value; }

  get currency() { return Currency.doomedParticles; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E1; }

  bulkCost(amount) {
    return this.costIncrement.pow(amount + this.amount).subtract(this.cost);
  }
}();

export const EndgameSkills = {
  checkForBuying(auto) {
    if (CelestialDimension(1).baseAmount.gt(0)) return true;
    if (!auto) Modal.message.show(`You need to buy at least ${formatInt(1)} Celestial Dimension before you can purchase
      Endgame Skills. You also need to be outside Doom to prevent
      ${player.universes.current === 2 ? "M" : "AM"} overflow.`, { closeEvent: GAME_EVENT.ENDGAME_RESET_AFTER });
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return 0;
    if (!EndgameSkillPurchaseType[type].purchase(false)) return 0;
    return 1;
  },

  // This is only called via automation and there's no manual use-case, so we assume auto is true and simplify a bit
  buyOneOfEach() {
    if (!this.checkForBuying(true)) return 0;
    const esGG = this.buyOne(true, "gg");
    const esCP = this.buyOne(true, "cp");
    const esDP = this.buyOne(true, "dp");
    return esGG + esCP + esDP;
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return 0;
    const esGG = EndgameSkillPurchaseType.gg.purchase(true);
    const esCP = EndgameSkillPurchaseType.cp.purchase(true);
    const esDP = EndgameSkillPurchaseType.dp.purchase(true);
    return esGG + esCP + esDP;
  },

  totalPurchased() {
    return EndgameSkillPurchaseType.gg.amount +
          EndgameSkillPurchaseType.cp.amount +
          EndgameSkillPurchaseType.dp.amount;
  },

  calculateEndgameMasteriesCost() {
    let list = EndgameMastery.permaMasteries.isBought
      ? EndgameMastery.boughtEM().filter(m => m.id >= 180 && m.id < 280)
      : EndgameMastery.boughtEM().filter(m => m.id < 280);
    let totalCost = list.map(em => em.cost).reduce(Number.sumReducer, 0);
    totalCost += masteryIncrease.entanglementCost();
    return totalCost;
  }
};
