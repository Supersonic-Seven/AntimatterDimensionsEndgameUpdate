import { SetPurchasableMechanicState } from "./game-mechanics";

class ExpansionPackState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.antimatter;
  }

  get set() {
    return player.endgame.expansionPacks.boughtPacks;
  }

  get unlockAM() {
    return this.config.cost;
  }

  get symbol() {
    return this.config.symbol;
  }

  get isUnlocked() {
    return this.isBought || (Currency.antimatter.gte(this.unlockAM) && (this.config.id !== "alphaPack" || !Pelle.isDoomed) &&
      (this.config.id !== "alphaPack" || DivinityMilestone.hadronEmpowerment.isReached) &&
      (this.config.id !== "slabPack" || !Pelle.isDoomed || !Slabdrill.isCursed) &&
      (this.config.id !== "slabPack" || DivinityMilestone.serpentPower.isReached));
  }

  onPurchased() {
    if (this.config.id === "slabPack") Modal.message.show(`This feature is not yet implemented. Please wait for updates.`, {}, 3);
  }
}

export const ExpansionPack = mapGameDataToObject(
  GameDatabase.endgame.packs,
  config => new ExpansionPackState(config)
);

export const ExpansionPacks = {
  get areUnlocked() {
    return player.endgame.expansionPacks.areUnlocked;
  },
  get nextPack() {
    return ExpansionPack.all.find(x => !x.isUnlocked);
  },
  get nextPackUnlockAM() {
    return this.nextPack?.unlockAM;
  },
  unlock() {
    const cost = Math.pow(2, 64);
    if (player.endgame.expansionPacks.areUnlocked) return;
    if (Currency.galaxyGeneratorGalaxies.gte(cost)) {
      Currency.galaxyGeneratorGalaxies.subtract(cost);
      player.endgame.expansionPacks.areUnlocked = true;
      Quotes.teresa.expansionPacks.show();
      Quotes.effarig.expansionPacks.show();
      Quotes.enslaved.expansionPacks.show();
      Quotes.v.expansionPacks.show();
      Quotes.ra.expansionPacks.show();
      Quotes.laitela.expansionPacks.show();
      Quotes.pelle.expansionPacks.show();
    }
  }
}
