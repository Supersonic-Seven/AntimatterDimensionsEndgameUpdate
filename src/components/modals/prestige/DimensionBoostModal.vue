<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DimensionBoostModal",
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
      isFlipped: false
    };
  },
  computed: {
    topLabel() {
      return `You are about to do a Dimension Boost Reset`;
    },
    message() {
      const keepDimensions = (Perk.antimatterNoReset.canBeApplied || Achievement(111).canBeApplied ||
        PelleUpgrade.dimBoostResetsNothing.isBought || PelleAchievementUpgrade.achievement111.canBeApplied)
        && (!player.disablePostReality || (LHC.voidRunning && player.endgame.largeHadronCollider.void.nullified)
        || (Alpha.isRunning && Alpha.currentStage >= 12) || (LHC.voidRunning && NullUpgrade.limerick1.isBought)
        || SlabdrillUnlocks.eternityChallengeTen.isUnlocked)
        ? `not actually reset anything due to an upgrade you have which prevents
          ${this.isFlipped ? "Matter" : "Antimatter"} and ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions
          from being reset in this situation. You will still gain the multiplier from the Boost, as usual.`
        : `reset your ${this.isFlipped ? "Matter" : "Antimatter"} and ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions.
          Are you sure you want to do this?`;

      return `This will ${keepDimensions}`;
    },
  },
  methods: {
    update() {
      this.isFlipped = player.universes.current === 2;
    },
    handleYesClick() {
      requestDimensionBoost(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dimensionBoost"
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
