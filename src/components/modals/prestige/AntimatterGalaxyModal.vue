<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "AntimatterGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      newGalaxies: new Decimal(0),
      keepAntimatter: false,
      perkANRBought: false,
      keepDimBoost: false,
      isFlipped: false
    };
  },
  computed: {
    topLabel() {
      if (this.bulk && this.isFlipped) return `You are about to purchase ${quantifyInt("Matter Galaxy", this.newGalaxies)}`;
      if (this.bulk) return `You are about to purchase ${quantifyInt("Antimatter Galaxy", this.newGalaxies)}`;
      return `You are about to purchase ${this.isFlipped ? "a Matter" : "an Antimatter"} Galaxy`;
    },
    message() {
      const resetResouces = [];
      if (Pelle.isDoomed) resetResouces.push("Antimatter", "Antimatter Dimensions", "Tickspeed");
      if (!this.perkANRBought && this.isFlipped) resetResouces.push("Antimatter Dimensions", "Tickspeed");
      if (!this.perkANRBought && !this.isFlipped) resetResouces.push("Matter Dimensions", "Tickspeed");
      if (!this.keepDimBoost) resetResouces.push("Dimension Boosts");
      if (!this.keepAntimatter && !this.perkANRBought && this.isFlipped) resetResouces.push("Matter");
      if (!this.keepAntimatter && !this.perkANRBought && !this.isFlipped) resetResouces.push("Antimatter");
      const resetList = makeEnumeration(resetResouces);
      let tickspeedFixed = "";
      if (InfinityChallenge(3).isRunning) {
        tickspeedFixed = `Infinity Challenge ${InfinityChallenge(3).id}`;
      } else if (Ra.isRunning) {
        tickspeedFixed = `${Ra.displayName}'s Reality`;
      }
      const tickspeedInfo = (tickspeedFixed === "")
        ? "you will receive a small boost to Tickspeed Upgrades."
        : `you will not receive a boost to Tickspeed Upgrades, because you are in ${tickspeedFixed}.`;
      const message = (resetList === "")
        ? `This will reset nothing, and ${tickspeedInfo}`
        : `This will reset your ${resetList}. However, ${tickspeedInfo}`;

      if (this.bulk && this.isFlipped) return `Are you sure you want to purchase
        ${quantifyInt("Matter Galaxy", this.newGalaxies)}? ${message}`;
      if (this.bulk) return `Are you sure you want to purchase
        ${quantifyInt("Antimatter Galaxy", this.newGalaxies)}? ${message}`;
      return `Are you sure you want to purchase ${this.isFlipped ? "a Matter" : "an Antimatter"} Galaxy? ${message}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, () =>
      (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought ? undefined : this.emitClose()));
  },
  methods: {
    update() {
      if (this.bulk) {
        const req = Galaxy.requirement;
        const dim = AntimatterDimension(req.tier);
        const bulk = Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount.toNumber())).gt(player.galaxies);
        if (bulk) {
          this.newGalaxies = Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount.toNumber())).sub(player.galaxies);
        }
      }
      this.keepAntimatter = Achievement(111).isUnlocked && (!player.disablePostReality || (Alpha.isRunning && Alpha.currentStage >= 12) ||
        (LHC.voidRunning && NullUpgrade.limerick1.isBought) || SlabdrillUnlocks.eternityChallengeTen.isUnlocked);
      this.perkANRBought = (Perk.antimatterNoReset.canBeApplied &&
        (!player.disablePostReality || (LHC.voidRunning && player.endgame.largeHadronCollider.void.nullified)));
      this.keepDimBoost = ((Achievement(143).isUnlocked && (!Pelle.isDoomed || PelleAchievementUpgrade.achievement143.canBeApplied)) ||
        PelleUpgrade.galaxyNoResetDimboost.canBeApplied) && (!player.disablePostReality || (Alpha.isRunning && Alpha.currentStage >= 20) ||
        (LHC.voidRunning && NullUpgrade.limerick2.isBought));
      this.isFlipped = player.universes.current === 2;
    },
    handleYesClick() {
      requestGalaxyReset(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="antimatterGalaxy"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>

    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
