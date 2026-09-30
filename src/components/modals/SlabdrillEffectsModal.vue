<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SlabdrillEffectsModal",
  components: {
    PrimaryButton,
    ModalWrapper,
  },
  computed: {
    nerfs() {
      return [
        `All rewards, effects, upgrades, enhancements, buffs, nerfs, and features unlocked or gained after reaching
          Reality for the first time are disabled`,
        "You only have access to the 1st Antimatter Dimension",
        `1st Antimatter Dimension cost scaling is reduced to ${formatX(100)} and Tickspeed cost scaling is reduced to ${formatX(2)}`,
        `The Buy 10 Antimatter Dimension multiplier is multiplied by ${formatX(20)}`,
        `Dimension Boosts require 1st Antimatter Dimensions, start at ${formatInt(60)}, and have a cost scaling of ${formatInt(20)}`,
        `Antimatter Galaxies require 1st Antimatter Dimensions, start at ${formatInt(650)}, and have a
          cost scaling of ${formatInt(450)}`,
        `Antimatter Galaxies are ${formatPercents(0.5)} weaker`,
        `Dimensional Sacrifice is disabled until completing Infinity Challenge ${formatInt(2)}, after which point it affects
          the 1st Antimatter Dimension`,
        "All Infinity Upgrades that previously affected multiple Dimensions now only affect the 1st Antimatter Dimension",
        `The effects of Normal Challenges ${formatInt(4)}, ${formatInt(6)}, ${formatInt(7)}, ${formatInt(10)} and ${formatInt(12)}
          are changed`,
        `The rewards of the first ${formatInt(9)} Normal Challenges are changed`,
        `All Break Infinity Upgrades that previously effected multiple Dimensions now only affect the 1st Antimatter Dimension,
          and have their effects altered`,
        "The effects of the power Galaxies and faster Autobuyers Break Infinity Upgrades are changed",
        "All Infinity Challenges have their Antimatter unlock and completion requirements changed",
        `The effects of Infinity Challenges ${formatInt(2)}, ${formatInt(4)}, ${formatInt(5)}, ${formatInt(6)} and ${formatInt(8)}
          are changed`,
        `The rewards of all Infinity Challenges except ${formatInt(2)} and ${formatInt(4)} are buffed`,
        `The effects of Time Studies ${formatInt(42)}, ${formatInt(71)}, ${formatInt(214)}, ${formatInt(223)}, ${formatInt(224)}
          and ${formatInt(232)} are changed`,
        `The effect of Time Study ${formatInt(161)} is buffed`,
        `The effects of Time Studies ${formatInt(72)} and ${formatInt(73)} are nerfed`,
        `The effect of Time Study ${formatInt(83)} reaches its cap quicker`,
        `The effects of Eternity Challenges ${formatInt(3)}, ${formatInt(5)} and ${formatInt(7)} are changed`,
        `The reward of Eternity Challenge ${formatInt(5)} is changed`,
        `The rewards of Eternity Challenges ${formatInt(8)} and ${formatInt(9)} are buffed`,
        `The effects of the Replicanti Multiplier to Time Dimensions and the Time Theorem Generation Dilation Upgrades are nerfed`,
        `The effects of the Dilated Time to Antimatter Dimensions and the Dilated Time to Infinity Points Dilation Upgrades are buffed`,
        `The effect of Achievement ${formatInt(105)} is capped at ${formatX(DC.E20000)}`,
        `Universal Entropy is corrupted`
      ];
    }
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      List of disabled and nerfed effects inside the Cursed Reality
    </template>
    <div class="slabdrill-effects-container">
      <p
        v-for="(nerf, idx) in nerfs"
        :key="idx"
      >
        {{ nerf }}
      </p>
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="emitClose"
    >
      Okay
    </PrimaryButton>
  </ModalWrapper>
</template>

<style scoped>
.slabdrill-effects-container {
  overflow-y: scroll;
  height: 40rem;
}

p {
  margin-bottom: 1rem;
}
</style>
