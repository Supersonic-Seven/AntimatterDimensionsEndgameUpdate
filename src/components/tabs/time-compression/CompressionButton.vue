<script>
export default {
  name: "CompressionButton",
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(),
      canInfinity: false,
      infinityGoal: new Decimal(),
      hawkingRadiationGain: new Decimal(),
      creditsClosed: false,
      gainSpaces: 0
    };
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.compressionUnlocked();
      this.isRunning = player.compression.active;
      if (!this.isRunning) return;
      this.canInfinity = Player.canCrunch;
      // This lets this.hasGain be true even before infinity.
      this.hasGain = getHawkingRadiationGain(false).gt(0);
      if (this.canInfinity && this.hasGain) {
        this.hawkingRadiationGain.copyFrom(getHawkingRadiationGain(true));
      } else if (this.canInfinity) {
        this.requiredForGain.copyFrom(getHawkingRadiationReq());
      } else {
        this.infinityGoal.copyFrom(Player.infinityGoal);
      }
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.gainSpaces = this.hawkingRadiationGain.lt(1) ? 3 : (this.hawkingRadiationGain.lt(10) ? 2 : 1);
    },
    compress() {
      if (this.creditsClosed) return;
      startCompressionRequest();
    }
  }
};
</script>

<template>
  <button
    class="o-compression-btn"
    :class="isUnlocked ? 'o-compression-btn--unlocked' : 'o-compression-btn--locked'"
    @click="compress()"
  >
    <span v-if="!isUnlocked">Purchase the Compression Study to unlock.</span>
    <span v-else-if="!isRunning">
      Compress time.
    </span>
    <span v-else-if="canInfinity && hasGain">
      Disable Compression.
      <br>
      Gain {{ quantify("Hawking Radiation", hawkingRadiationGain, 2, gainSpaces) }}.
    </span>
    <span v-else-if="canInfinity">
      Disable Compression.
      <br>
      Reach {{ format(requiredForGain, 2, 1) }} antimatter to gain more Hawking Radiation.
    </span>
    <span v-else>
      Disable Compression.
      <br>
      Reach {{ quantify("Antimatter", infinityGoal, 1, 0) }} to gain Hawking Radiation.
    </span>
  </button>
</template>

<style scoped>

</style>
