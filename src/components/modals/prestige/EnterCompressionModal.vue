<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterCompressionModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return `Compressing time will start a new Endgame, in which the first three Dimension types' multiplier's exponents and
        tickspeed multiplier's exponent will be reduced to a power based on Antimatter and time spent in Compression. If you
        can reach Infinity while Compressed, your Hawking Radiation will be increased to a value based on your highest
        antimatter and any Hawking Radiation multipliers you have.`;
    },
    entranceLabel() {
      return `You are about to enter Compression`;
    }
  },
  methods: {
    handleYesClick() {
      if (player.compression.active) return;
      Endgame.resetNoReward();
      clearCelestialRuns();
      player.compression.active = true;
      recalculateAllGlyphs();
      Tab.dimensions.antimatter.show(false);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="compression"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <template #confirm-text>
      Enter
    </template>
  </ModalWrapperChoice>
</template>
