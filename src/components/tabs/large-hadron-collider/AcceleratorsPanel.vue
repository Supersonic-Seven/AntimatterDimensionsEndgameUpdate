<script>
import Accelerator from "./Accelerator";
import PowerCoreButton from "./PowerCoreButton";

export default {
  name: "AcceleratorsPanel",
  components: {
    Accelerator,
    PowerCoreButton
  },
  data() {
    return {
      decayRate: 0,
      time: 0,
      nextAcceleratorReq: new Decimal(),
      nextAcceleratorCurrency: ""
    };
  },
  computed: {
    accelerators() {
      return Accelerators.all;
    }
  },
  methods: {
    update() {
      this.decayRate = LHC.acceleratorSpeed;
      this.time = Date.now();
      this.nextAcceleratorReq.copyFrom(LHC.nextAccelerator ? LHC.nextAccelerator.config.unlockReq() : Decimal.pow10("1e1000"));
      this.nextAcceleratorCurrency = LHC.nextAccelerator ? LHC.nextAccelerator.config.drainResource : (player.universes.current === 2 ? "Matter" : "Antimatter");
    }
  }
};
</script>

<template>
  <div class="l-accelerator-panel-container">
    <div class="c-accelerator-panel-title">
      Accelerators
    </div>
    <div
      class="l-accelerator-content-container"
    >
      Accelerators can be activated by clicking on their bars.
      <span>You cannot activate more than one Accelerator at once.</span>
      When active, Accelerators fill at a rate of {{ formatPercents(decayRate, 3) }} per second.
      <br>
      Accelerator effects apply even when not activated, and are based on the current fill percentage.
      <div class="c-accelerator-bar-container">
        <Accelerator
          v-for="accelerator in accelerators"
          :key="accelerator.config.id"
          :accelerator="accelerator"
        />
      </div>
    </div>
    <PowerCoreButton />
    <div class="c-accelerator-panel-description">
      The next Accelerator will unlock at {{ format(nextAcceleratorReq, 2, 2) }} {{ nextAcceleratorCurrency }}
    </div>
  </div>
</template>

<style scoped>
.c-accelerator-panel-title {
  position: relative;
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-alpha--base);
}

.l-accelerator-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.l-accelerator-panel-container {
  width: 98rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-alpha--base);
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 1rem;
  padding: 1rem;
  -webkit-user-select: none;
  user-select: none;
}

.c-accelerator-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-accelerator-panel-description {
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-alpha--base);
}
</style>
