<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitCursedCoreModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    update() {
      if (!player.celestials.slabdrill.core.isActive) this.emitClose();
    },
    handleYesClick() {
      if (!player.celestials.slabdrill.core.isActive) return;
      Slabdrill.exitCore();
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
      <span>
        You are about to exit Hell
      </span>
    </template>
    <div class="c-modal-message__text">
      <span>
        If you exit Hell you will not be able to gain any more Chaos Cores.
      </span>
      <br>
      Are you sure you want to proceed?
    </div>
    <template #confirm-text>
      Get me out
    </template>
  </ModalWrapperChoice>
</template>
