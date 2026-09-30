<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SacrificeModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      currentMultiplier: new Decimal(),
      nextMultiplier: new Decimal(),
      currentPower: new Decimal(),
      nextPower: new Decimal(),
      isFlipped: false
    };
  },
  computed: {
    message() {
      if (Achievement(118).isUnlocked && !Pelle.isDoomed && (!player.disablePostReality || (Alpha.isRunning && Alpha.currentStage >= 12) ||
        (LHC.voidRunning && NullUpgrade.limerick1.isBought) || SlabdrillUnlocks.eternityChallengeTen.isUnlocked)) {
        return `Dimensional Sacrifice will give you a boost to the 8th ${this.isFlipped ? "Matter" : "Antimatter"} Dimension based on the amount of
          1st ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions you had at the time of Sacrificing.`;
      }
      return `Dimensional Sacrifice will remove all of your 1st through 7th ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions
        (with the cost and multiplier unchanged), for a boost to the 8th ${this.isFlipped ? "Matter" : "Antimatter"} Dimension based on the total
        amount of 1st ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions sacrificed. It will take time to regain production.`;
    },
    multiplierText() {
      if (Ascensions.sacA.isUnlocked) return `Power is currently ${formatPow(this.currentPower, 2, 3)} and will increase to
        ${formatPow(this.nextPower, 2, 3)} on Dimensional Sacrifice.`;
      return `Multiplier is currently ${formatX(this.currentMultiplier, 2, 2)} and will increase to
        ${formatX(this.nextMultiplier, 2, 2)} on Dimensional Sacrifice.`;
    },
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(Sacrifice.totalBoost);
      this.nextMultiplier.copyFrom(Sacrifice.nextBoost.times(Sacrifice.totalBoost));
      this.currentPower.copyFrom(Sacrifice.totalPower);
      this.nextPower.copyFrom(Sacrifice.nextPower.add(Sacrifice.totalPower));
      this.isFlipped = player.universes.current === 2;
    },
    handleYesClick() {
      sacrificeReset();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrifice"
    @confirm="handleYesClick"
  >
    <template #header>
      Dimensional Sacrifice
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ multiplierText }}
      <br>
    </div>
  </ModalWrapperChoice>
</template>
