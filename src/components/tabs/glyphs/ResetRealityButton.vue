<script>
export default {
  name: "ResetRealityButton",
  data() {
    return {
      canReality: false,
      resetCelestial: false,
      isInCelestialReality: false,
      isDoomed: false,
      isCursed: false
    };
  },
  computed: {
    resetText() {
      if (this.isCursed) return "Perform a Core Jump";
      if (this.isDoomed) return "Start this Armageddon over";
      if (this.isInCelestialReality && !this.resetCelestial) return "Exit this Celestial early";
      if (this.isInCelestialReality && this.resetCelestial) return "Restart this Celestial";
      return "Start this Reality over";
    },
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought && player.records.thisReality.maxEP.add(1).log10().gte(4000);
      this.resetCelestial = player.options.retryCelestial;
      this.isInCelestialReality = isInCelestialReality();
      this.isDoomed = Pelle.isDoomed;
      this.isCursed = Slabdrill.isCursed;
    },
    resetReality() {
      const confirms = player.options.confirmations;
      if (GameEnd.creditsClosed) return;
      if (this.isCursed) {
        Slabdrill.enterCore();
        Slabdrill.exitCore();
        return;
      }
      if (this.isInCelestialReality) {
        if (confirms.exitChallenge) Modal.exitChallenge.show({
          challengeName: "a Celestial Reality",
          normalName: "Reality",
          hasHigherLayers: false,
          exitFn: () => Alpha.isRunning ? Alpha.escapeTheMatrix() : beginProcessReality(getRealityProps(true))
        });
        else Alpha.isRunning ? Alpha.escapeTheMatrix() : beginProcessReality(getRealityProps(true));
      } else if (confirms.resetReality) Modal.resetReality.show();
      else beginProcessReality(getRealityProps(true));
    },
  }
};
</script>

<template>
  <button
    :class="['l-reset-reality-button',
             'c-reset-reality-button',
             {'c-reset-reality-button-celestial': isInCelestialReality}]"
    @click="resetReality"
  >
    <div class="l-reality-button__contents">
      {{ resetText }}
    </div>
  </button>
</template>

<style scoped>

</style>
