<script>
export default {
  name: "TransientUniverseTab",
  data() {
    return {
      isRunning: false,
      highestAntimatter: new Decimal(),
      relativisticParticles: new Decimal(),
      particlesPerSecond: new Decimal(),
      particleBoost: new Decimal(),
      ephemeralLight: new Decimal(),
      pendingLight: new Decimal(),
      formula1: new Decimal(),
      formula2: new Decimal()
    };
  },
  computed: {
    transientUniverseButtonText() {
      if (this.isRunning && this.pendingLight.lte(0)) {
        return `Exit the Transient Universe. Reach ${format(this.highestAntimatter, 2, 1)} Antimatter to gain more Ephemeral Light.`;
      }
      if (this.isRunning) {
        return `Exit the Transient Universe. Gain ${format(this.pendingLight, 2, 2)} Ephemeral Light.`;
      }
      return "Enter the Transient Universe.";
    }
  },
  methods: {
    update() {
      this.isRunning = player.universes.current === 1;
      this.highestAntimatter.copyFrom(player.universes.highestTransientAntimatter);
      this.relativisticParticles.copyFrom(player.universes.relativisticParticles);
      this.particlesPerSecond.copyFrom(getRelativisticParticlesPerSecond());
      this.particleBoost.copyFrom(DC.D1.sub(Decimal.pow(0.9, Currency.relativisticParticles.value.max(10).log10().log10().pow(2))));
      this.ephemeralLight.copyFrom(player.universes.ephemeralLight);
      this.pendingLight.copyFrom(player.universes.highestTransientAntimatter.max(1e10).log10().log10().pow(3).sub(
        player.universes.ephemeralLight).max(0));
      this.formula1.copyFrom(Universes.ephemeralLightToGalGen);
      this.formula2.copyFrom(Universes.ephemeralLightToDilation);
    },
    enterUniverse() {
      if (this.isRunning) return exitUniverse(1);
      return tryEnterUniverse(1);
    }
  }
};
</script>

<template>
  <div class="l-universe-tab-container">
    <div>
      <br>
      <div class="c-ephemeral-text">
        You have <span class="c-universes-text--header">{{ format(ephemeralLight, 2, 2) }}</span> Ephemeral Light.
        <br>
        Ephemeral Light is currently providing a
        <span class="c-universes-text--header">{{ formatPow(formula1, 2, 3) }}</span>
        to Galaxy Generator production, and a
        <span class="c-universes-text--header">{{ formatPow(formula2, 2, 3) }}</span>
        to Tachyon Particles, Dilated Time, and Game Speed while outside Doom.
      </div>
      <br>
      <div class="c-transient-universe-text">
        Your highest Antimatter reached in the Transient Universe is
        <span class="c-universes-text--header">{{ format(highestAntimatter, 2, 1) }}</span>.
      </div>
      <br>
      <div class="c-transient-universe-text">
        You have
        <span class="c-universes-text--header">{{ format(relativisticParticles, 2, 2) }}</span>
        Relativistic Particles.
        <span class="c-universes-text--header">+{{ format(particlesPerSecond, 2, 2) }}/s</span>
        <br>
        Relativistic Particles are currently weaking the negative Dilation effects of Antimatter and Infinity Dimensions by
        <span class="c-universes-text--header">{{ formatDecimalPercents(particleBoost, 2, 2) }}</span>
        while inside the Transient Universe.
        <br>
        Relativistic Particles reset on exiting the Transient Universe.
      </div>
    </div>
    <br>
    <br>
    <button
      class="o-transient-universe-btn"
      @click="enterUniverse"
    >
      {{ transientUniverseButtonText }}
    </button>
  </div>
</template>

<style scoped>
.c-transient-universe-text {
  font-size: 2rem;
  animation: a-transience-cycle 10s linear infinite;
}

.c-ephemeral-text {
  font-size: 2rem;
  animation: a-ephemeral-cycle 10s linear infinite;
}

.c-universes-text--header {
  font-size: 3rem;
  font-weight: bold;
}

@keyframes a-ephemeral-cycle {
  0% { color: #ffe0a0; }
  33% { color: white; }
  67% { color: #a0e0ff; }
  100% { color: #ffe0a0; }
}

@keyframes a-transience-cycle {
  0% { color: #64dd17; }
  50% { color: #64ddad; }
  100% { color: #64dd17; }
}

.l-universe-tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.o-transient-universe-btn {
  width: 30rem;
  height: 15rem;
  font-family: Typewriter, serif;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: black;
  border: var(--var-border-width, 0.2rem) solid var(--color-dilation);
  border-radius: var(--var-border-radius, 0.4rem);
  cursor: pointer;
  padding: 1rem;
  transition-duration: 0.3s;
  animation: a-transience-button-cycle 5s infinite;
}

.o-transient-universe-btn:hover {
  background-color: white;
}

@keyframes a-transience-button-cycle {
  0% {
    color: #64dd17;
    box-shadow: inset 0 0 1rem;
  }
  50% {
    color: #64ddad;
    box-shadow: inset 0 0 3rem;
  }
  100% {
    color: #64dd17;
    box-shadow: inset 0 0 1rem;
  }
}
</style>
