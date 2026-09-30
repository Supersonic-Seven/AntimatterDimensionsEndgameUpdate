<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitTheCurseModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return `You really thought you could escape from me? Think again. This was all part of my plan, after all. You cannot
      escape. You will remain here as my eternal prisoner. Accept your fate.`;
    },
    entranceLabel() {
      return `The Illusion of Free Will`;
    }
  },
  methods: {
    handleYesClick() {
      player.celestials.slabdrill.isGoodbye = true;
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <template #confirm-text>
      I am stronger than you
    </template>
  </ModalWrapperChoice>
</template>
