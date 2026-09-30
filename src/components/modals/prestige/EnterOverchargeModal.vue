<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterOverchargeModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      penalty: 1
    };
  },
  computed: {
    message() {
      return `Entering the Overcharge will start a new Endgame. While inside the Overcharge, you will be trapped in
        Eternity Challenge 12, and the tetration of Antimatter Production will be multiplied by ${formatX(0.75, 2, 2)}.
        Furthermore, Tickspeed and all Dimension Multipliers' exponents will be raised to ${formatPow(this.penalty, 2, 4)}, like
        Time Dilation. Higher levels of Overcharge will have a more severe penalty in exchange for unlocking new, better rewards.`;
    },
    entranceLabel() {
      return `You are about to enter the Overcharge`;
    }
  },
  methods: {
    update() {
      this.penalty = Ascension.overchargePenalty;
    },
    handleYesClick() {
      if (player.endgame.overcharge.isRunning) return;
      enterOvercharge();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="overcharge"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <template #confirm-text>
      Bring it on
    </template>
  </ModalWrapperChoice>
</template>
