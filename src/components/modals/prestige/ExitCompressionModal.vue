<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitCompressionModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      hawkingRadiationGain: new Decimal(0)
    };
  },
  computed: {
    gainText() {
      if (this.hawkingRadiationGain.lte(0)) return `not gain anything`;
      return `gain ${quantify("Hawking Radiation", this.hawkingRadiationGain, 2, 1)}`;
    }
  },
  methods: {
    update() {
      if (!player.compression.active) this.emitClose();
      this.hawkingRadiationGain.copyFrom(getHawkingRadiationGain(true));
    },
    handleYesClick() {
      if (!player.compression.active) return;
      rewardHR();
      Endgame.resetNoReward();
      player.compression.active = false;
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
      <span>
        You are about to exit Compression
      </span>
    </template>
    <div class="c-modal-message__text">
      <span>
        If you exit Compression now, you will {{ gainText }}.
      </span>
      <br>
      Are you sure you want to proceed?
    </div>
    <template #confirm-text>
      Exit
    </template>
  </ModalWrapperChoice>
</template>
