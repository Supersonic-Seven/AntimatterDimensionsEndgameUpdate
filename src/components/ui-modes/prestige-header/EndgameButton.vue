<script>
export default {
  name: "EndgameButton",
  data() {
    return {
      canEndgame: false,
      showPelleGlow: false,
      gainedCP: 0,
      gainedDP: 0,
      isFlipped: false
    };
  },
  computed: {
    formatCPGain() {
      return `Celestial Points gained: ${format(this.gainedCP, 2)}`;
    },
    formatDPGain() {
      return `Doomed Particles gained: ${format(this.gainedDP, 2)}`;
    },
    classObject() {
      return {
        "c-endgame-button--unlocked": this.canEndgame,
        "c-endgame-button--locked": !this.canEndgame,
        "c-endgame-button--special": this.showPelleGlow,
      };
    }
  },
  methods: {
    update() {
      this.canEndgame = isEndgameAvailable();
      this.showPelleGlow = true;
      if (!this.canEndgame) {
        this.gainedCP = 0;
        this.gainedDP = 0;
        return;
      }
      this.gainedCP = gainedCelestialPoints();
      this.gainedDP = gainedDoomedParticles();
      this.isFlipped = player.universes.current === 2;
    },
    handleClick() {
      if (this.canEndgame) {
        Endgame.newEndgame();
      }
    }
  }
};
</script>

<template>
  <div class="l-endgame-button">
    <button
      class="c-endgame-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-endgame-button__contents">
        <template v-if="canEndgame">
          <div class="c-endgame-button__header">
            Enter the Endgame
          </div>
          <div>{{ formatCPGain }}</div>
          <div>{{ formatDPGain }}</div>
        </template>
        <template v-else>
          <div>
            Reach {{ format("e9e15", 2, 2) }} {{ isFlipped ? "Matter" : "Antimatter" }} to unlock the ability to Enter the Endgame
          </div>
        </template>
        <div
          v-if="canEndgame"
          class="infotooltiptext"
        >
          <div>Another End, and a New Beginning...</div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
