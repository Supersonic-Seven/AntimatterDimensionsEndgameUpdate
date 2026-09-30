<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BreakEternityModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isFlipped: false
    };
  },
  computed: {
    message() {
      return `Breaking Eternity will allow you to gain ${this.isFlipped ? "matter" : "antimatter"} past ${format(DC.E9E15, 2, 2)}. You will gain additional Celestial Points and Doomed Particles on Endgame based on ${this.isFlipped ? "matter" : "antimatter"} produced over 1e9e15 while inside the Doomed Reality. It will also unlock Break Eternity Upgrades and other features.`.split("\n");
    },
  },
  methods: {
    update() {
      this.isFlipped = player.universes.current === 2;
    },
    handleYesClick() {
      breakEternity();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      You are Breaking Eternity
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      >
        {{ line }} <br>
      </span>
    </div>
    <template #confirm-text>
      Break
    </template>
  </ModalWrapperChoice>
</template>
