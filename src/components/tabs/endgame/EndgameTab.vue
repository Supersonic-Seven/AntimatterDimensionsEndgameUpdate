<script>
import ResetEndgameButton from "./ResetEndgameButton";
export default {
  name: "EndgameTab",
  components: {
    ResetEndgameButton
  },
  data() {
    return {
      stage: "",
      chapter: 0,
      percentage: 0
    };
  },
  methods: {
    update() {
      this.stage = (Slabdrill.isDestroyed && player.celestials.slabdrill.hasBoughtNinthDimension) ? "Celestial Plus" : "Endgame";
      if (this.stage === "Celestial Plus") {
        this.chapter = 0;
        this.percentage = 0;
      }
      if (this.stage === "Endgame") {
        if (Slabdrill.isCursed || Slabdrill.isDestroyed) this.chapter = 3;
        else if (Alpha.isUnlocked) this.chapter = 2;
        else this.chapter = 1;
      }
      if (this.stage === "Endgame" && this.chapter === 1) {
        this.percentage = Math.max(this.percentage, player.reality.imaginaryMachines.max(1).log10().pow(0.5).div(
          DC.NUMMAX.log10().pow(0.5)).div(2).min(0.5).add(
          player.endgame.doomedParticles.max(1).log10().pow(0.5).div(20).min(0.5)).toNumber());
      }
      if (this.stage === "Endgame" && this.chapter === 2) {
        this.percentage = Math.max(this.percentage, new Decimal(player.celestials.alpha.stage).div(84).min(1/3).add(
          player.endgame.celDimExpansion.celestialInfinityPoints.max(1).log10().pow(0.5).div(
          DC.NUMMAX.log10().pow(0.5)).div(3).min(1/3)).add(
          player.endgame.celDimExpansion.celestialEternityPoints.max(1).log10().pow(0.5).div(
          Decimal.pow(4000, 0.5)).div(3).min(1/3)).toNumber());
      }
      if (this.stage === "Endgame" && this.chapter === 3) {
        this.percentage = Math.max(this.percentage, player.antimatter.max(1).log10().div(DC.NUMMAX.log10()).div(5).min(0.2).add(
        player.infinityPoints.max(1).log10().div(DC.NUMMAX.log10()).div(10/3).min(0.3)).add(
        player.eternityPoints.max(1).log10().div(4000).div(2.5).min(0.4)).add(
        player.records.totalRealityAntimatter.max(1).log10().max(1).log10().div(DC.NUMMAX.log10()).div(10).min(0.1)).toNumber());
      }
    }
  }
};
</script>

<template>
  <div class="l-endgame-tab-container">
    <div class="endgame-text">
      <br>
      <div>
      <b>
        Endgame
      </b>
      </div>
      <br>
      <div>
        You are currently playing Antimatter Dimensions: The {{ stage }} Update, Chapter {{ chapter }}.
        <br>
        Percentage to next chapter: {{ formatPercents(percentage, 2, 2) }}
      </div>
    </div>
    <br>
    <div class="l-endgame-button-column">
      <div>
        <ResetEndgameButton/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.endgame-text {
  font-size: 2rem;
  color: var(--color-endgame);
}

.l-endgame-tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
