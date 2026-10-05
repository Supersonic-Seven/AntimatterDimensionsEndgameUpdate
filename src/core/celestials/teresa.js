import { BitUpgradeState, RebuyableMechanicState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const Teresa = {
  timePoured: new Decimal(0),
  lastTick: 0,
  isPouring: false,
  pourAccumulator: 0,
  pourTime: 0,
  setPour(on) {
    const target = Boolean(on);
    if (this.isPouring === target) return;
    this.isPouring = target;
    if (target) {
      this.lastTick = Date.now();
    } else {
      this.pourTime = 0;
      this.timePoured = new Decimal(0);
    }
  },
  tickPour() {
    if (!this.isPouring) return;
    if (typeof EndgameUpgrade !== "undefined" && EndgameUpgrade(10).isLockingMechanics) {
      this.setPour(false);
      return;
    }
    if (this.pouredAmount.gte(this.pouredAmountCap) || Currency.realityMachines.value.lte(0)) {
      this.setPour(false);
      return;
    }

    const now = Date.now();
    if (!this.lastTick) this.lastTick = now;
    const diff = Math.clamp((now - this.lastTick) / 1000, 0, 0.1);
    this.lastTick = now;
    if (diff <= 0) return;

    this.pourTime += diff;
    this.timePoured = new Decimal(this.pourTime);

    this.pourRM(diff);
  },
  lastUnlock: "effarig",
  get pouredAmountCap() {
    return (ExpansionPack.teresaPack.isBought && !player.disablePostReality) ? DC.BEMAX : new Decimal(1e24);
  },
  displayName: "Teresa",
  possessiveName: "Teresa's",
  get isUnlocked() {
    if (EndgameMilestone.celestialEarlyUnlock.isReached) return true;
    return Achievement(147).isUnlocked;
  },
  pourRM(diff, auto = false) {
    if (this.pouredAmount.gte(Teresa.pouredAmountCap)) return;
    if (auto) {
      const autoPouredRM = Currency.realityMachines.value.div(1000);
      this.pouredAmount = this.pouredAmount.add(autoPouredRM);
      Currency.realityMachines.subtract(autoPouredRM);
      this.checkForUnlocks();
      return;
    }
    this.timePoured = this.timePoured.add(diff);
    const rm = Currency.realityMachines.value;
    const rmPoured = Decimal.min((this.pouredAmount.plus(1e6)).times(0.01).times(Decimal.pow(this.timePoured, 2)), rm);
    const leftToCap = this.pouredAmount.gte(1e100) ? Teresa.pouredAmountCap.sub(this.pouredAmount) : new Decimal(Teresa.pouredAmountCap.toNumber() - this.pouredAmount.toNumber());
    this.pouredAmount = this.pouredAmount.add(Decimal.min(rmPoured, leftToCap));
    Currency.realityMachines.subtract(rmPoured);
    this.checkForUnlocks();
  },
  checkForUnlocks() {
    for (const info of TeresaUnlocks.all) {
      info.unlock();
    }
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.teresa.run = true;
  },
  rewardMultiplier(antimatter) {
    return Decimal.max(Decimal.pow(antimatter.plus(1).log10().div(1.5e8), 12), 1);
  },
  get pouredAmount() {
    return player.celestials.teresa.pouredAmount;
  },
  set pouredAmount(amount) {
    player.celestials.teresa.pouredAmount = amount;
  },
  get fill() {
    return Decimal.min(Decimal.log10(this.pouredAmount.add(1)).div(24), 1).toNumber();
  },
  get possibleFill() {
    return Decimal.min(Currency.realityMachines.value.plus(this.pouredAmount).add(1).log10().div(24), 1).toNumber();
  },
  get rmMultiplier() {
    return Decimal.max(new Decimal(250).times(Decimal.pow(this.pouredAmount.div(1e24), 0.1)), 1);
  },
  get runRewardMultiplier() {
    return this.rewardMultiplier(player.celestials.teresa.bestRunAM);
  },
  get isRunning() {
    return player.celestials.teresa.run;
  },
  get runCompleted() {
    return player.celestials.teresa.bestRunAM.gt(1);
  },
  get totalCharges() {
    return PerkShopUpgrade.addCharges.effectOrDefault(0);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.teresa.charged.size;
  },
  get chargeModeOn() {
    return player.celestials.teresa.chargeMode;
  },
  quotes: Quotes.teresa,
  symbol: "Ϟ"
};

class PerkShopUpgradeState extends RebuyableMechanicState {
  constructor(config) {
    super(config);
    this.costCap = config.costCap;
    this.showEffectAfterCharge = config.showEffectAfterCharge;
    this.chargedEffect = config.chargedEffect;
    this.preChargedEffect = config.preChargedEffect;
    this.effect = config.effect;
  }

  get chargedValue() {
    return this.viewCharge ? this.chargedEffect : this.effect;
  }

  get displayEffect() {
    return !this.viewCharge || this.showEffectAfterCharge;
  }

  get currency() {
    return this.id === 6 ? Currency.celestialPoints : Currency.perkPoints;
  }

  get boughtAmount() {
    return player.celestials.teresa.perkShop[this.id];
  }

  set boughtAmount(value) {
    player.celestials.teresa.perkShop[this.id] = value;
  }

  get isCapped() {
    return this.id === 6 ? new Decimal(this.cost).gte(this.costCap(this.bought)) : this.cost >= this.costCap(this.bought);
  }

  get isAvailableForPurchase() {
    const otherReq = this.config.otherReq ? this.config.otherReq() : true;
    return new Decimal(this.cost).lte(new Decimal(this.currency.value)) && otherReq;
  }

  onPurchased() {
    if (this.id === 0) {
      GameCache.staticGlyphWeights.invalidate();
    }
    if (this.id === 1) {
      Autobuyer.reality.bumpAmount(2);
    }
    // Give a single music glyph
    if (this.id === 4 && (!Pelle.isDoomed || PelleDestructionUpgrade.teresaShop.canBeApplied)) {
      if (GameCache.glyphInventorySpace.value === 0) {
        // Refund the perk point if they didn't actually get a glyph
        Currency.perkPoints.add(1);
        GameUI.notify.error("You have no empty inventory space!");
      } else {
        Glyphs.addToInventory(GlyphGenerator.musicGlyph());
        GameUI.notify.success("Created a Music Glyph");
      }
    }
    // Fill the inventory with music glyphs
    if (this.id === 5 && (!Pelle.isDoomed || PelleDestructionUpgrade.teresaShop.canBeApplied)) {
      const toCreate = GameCache.glyphInventorySpace.value;
      for (let count = 0; count < toCreate; count++) Glyphs.addToInventory(GlyphGenerator.musicGlyph());
      if (!PerkShopUpgrade.musicGlyph.isCharged) GameUI.notify.success(`Created ${quantifyInt("Music Glyph", toCreate)}`);
    }
  }

  get viewCharge() {
    return (Teresa.chargeModeOn || this.isCharged || ui.view.shiftDown) && this.ableToCharge && ExpansionPack.teresaPack.isBought && !player.disablePostReality;
  }

  get ableToCharge() {
    return this.id <= 4;
  }

  get isCharged() {
    return player.celestials.teresa.charged.has(this.id);
  }

  get canCharge() {
    return !this.isCharged && Teresa.chargesLeft !== 0 && this.ableToCharge && this.boughtAmount >= [20, 20, 14, 6, 0, Infinity, Infinity][this.id];
  }

  charge() {
    player.celestials.teresa.charged.add(this.id);
    if (this.id === 0) {
      GameCache.staticGlyphWeights.invalidate();
    }
  }

  disCharge() {
    player.celestials.teresa.charged.delete(this.id);
    if (this.id === 0) {
      GameCache.staticGlyphWeights.invalidate();
    }
  }
}

export function tryChargeAllPerkUpgrades() {
  if (Teresa.chargesLeft < 5) return;
  const upgrades = [
    PerkShopUpgrade.glyphLevel,
    PerkShopUpgrade.rmMult,
    PerkShopUpgrade.bulkDilation,
    PerkShopUpgrade.autoSpeed,
    PerkShopUpgrade.musicGlyph
  ];
  for (const upgrade of upgrades) {
    if (upgrade.canCharge) {
      upgrade.charge();
    }
  }
}

export function disChargeAllPerkUpgrades() {
  const upgrades = [
    PerkShopUpgrade.glyphLevel,
    PerkShopUpgrade.rmMult,
    PerkShopUpgrade.bulkDilation,
    PerkShopUpgrade.autoSpeed,
    PerkShopUpgrade.musicGlyph
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.celestials.teresa.disCharge = false;
}

class TeresaUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.teresa.unlockBits; }
  set bits(value) { player.celestials.teresa.unlockBits = value; }

  get price() {
    return this.config.price;
  }

  get pelleDisabled() {
    return Pelle.isDoomed && this.isDisabledInDoomed;
  }

  get isDisabledInDoomed() {
    return this.config.isDisabledInDoomed ? this.config.isDisabledInDoomed() : false;
  }

  get isEffectActive() {
    return !this.pelleDisabled && !player.disablePostReality;
  }

  get canBeUnlocked() {
    return !this.isUnlocked && Teresa.pouredAmount.gte(new Decimal(this.price));
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description() : this.config.description;
  }

  onUnlock() {
    this.config.onUnlock?.();
  }
}

export const TeresaUnlocks = mapGameDataToObject(
  GameDatabase.celestials.teresa.unlocks,
  config => new TeresaUnlockState(config)
);

export const PerkShopUpgrade = mapGameDataToObject(
  GameDatabase.celestials.perkShop,
  config => new PerkShopUpgradeState(config)
);

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.teresa.isOpen) Teresa.quotes.initial.show();
});

EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => Teresa.tickPour());