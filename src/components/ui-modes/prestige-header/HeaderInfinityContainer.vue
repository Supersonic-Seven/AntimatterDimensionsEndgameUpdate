<script>
import BigCrunchButton from "./BigCrunchButton";
import CelestialCrunchButton from "./CelestialCrunchButton";

export default {
  name: "HeaderInfinityContainer",
  components: {
    BigCrunchButton,
    CelestialCrunchButton
  },
  data() {
    return {
      showContainer: false,
      infinityPoints: new Decimal(0),
      isTesseractUnlocked: false,
      tesseractCost: new Decimal(0),
      tesseractText: "",
      hasCelestial: false,
      celInfinityPoints: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.showContainer = player.break || PlayerProgress.infinityUnlocked();
      this.infinityPoints.copyFrom(Currency.infinityPoints.value.floor());
      this.isTesseractUnlocked = Enslaved.isCompleted && !player.disablePostReality;
      this.tesseractCost = Tesseracts.nextCost;
      this.tesseractText = this.tesseractProgress();
      this.hasCelestial = PlayerProgress.celestialInfinityUnlocked() && !Slabdrill.isCursed;
      this.celInfinityPoints.copyFrom(Currency.celestialInfinityPoints.value.floor());
    },
    tesseractProgress() {
      const progress = this.infinityPoints.add(1).log10().div(this.tesseractCost.log10()).toNumber();
      if (progress > 1) return `<b>(${formatPercents(1)})</b>`;
      return `(${formatPercents(progress, 2, 2)})`;
    },
  },
};
</script>

<template>
  <div>
    <div
      v-if="showContainer"
      class="c-prestige-button-container"
    >
      <div class="c-infinity-points">
        You have
        <span class="c-game-header__ip-amount">{{ format(infinityPoints, 2) }}</span>
        {{ pluralize("Infinity Point", infinityPoints) }}.
        <span
          v-if="isTesseractUnlocked"
          v-html="tesseractText"
        />
      </div>
      <BigCrunchButton />
    </div>
    <div
      v-if="showContainer && hasCelestial"
      class="c-prestige-button-container"
    >
      <div class="c-infinity-points">
        You have
        <span class="c-game-header__cip-amount">{{ format(celInfinityPoints, 2) }}</span>
        {{ pluralize("Celestial Infinity Point", celInfinityPoints) }}.
      </div>
      <CelestialCrunchButton />
    </div>
  </div>
</template>

<style scoped>
.c-infinity-points {
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
}
</style>
