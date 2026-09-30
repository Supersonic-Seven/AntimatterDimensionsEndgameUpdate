<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterCursedCoreModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return `Entering Hell will destroy everything except Antimatter.
        You will maintain your Antimatter Dimension and can generate Antimatter
        for an improved chance at collecting Chaos Cores.`;
    },
    entranceLabel() {
      return `You are about to enter Hell`;
    }
  },
  methods: {
    handleYesClick() {
      if (player.celestials.slabdrill.core.isActive) return;
      Slabdrill.enterCore();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="cursedCore"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <template #confirm-text>
      I concede
    </template>
  </ModalWrapperChoice>
</template>
