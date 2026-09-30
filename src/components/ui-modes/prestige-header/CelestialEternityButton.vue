<script>
export default {
  name: "CelestialEternityButton",
  data() {
    return {
      isVisible: false,
      type: CEP_BUTTON_DISPLAY_TYPE.FIRST_TIME,
      gainedCEP: new Decimal(0),
      currentCEP: new Decimal(0),
      currentCEPRate: new Decimal(0),
      peakCEPRateVal: new Decimal(0),
      peakCEPRate: new Decimal(0),
      canCelestialEternity: false,
      celestialEternityGoal: new Decimal(0),
      hover: false,
      headerTextColored: true,
      creditsClosed: false,
      showCEPRate: false,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-celestial-eternity-button": true,
        "o-celestial-eternity-button--unavailable": !this.canCelestialEternity,
        "o-pelle-disabled-pointer": this.creditsClosed,
      };
    },
    // Show CEP/min below this threshold, color the CEP number above it
    rateThreshold: () => 1e30,
    amountStyle() {
      if (!this.headerTextColored || this.currentCEP.lt(this.rateThreshold)) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      // Dynamically generate red-text-green based on the CSS entry for text color, returning a raw 6-digit hex color
      // code. stepRGB is an array specifying the three RGB codes, which are then interpolated between in order to
      // generate the final color; only ratios between 0.9-1.1 give a color gradient
      const textHexCode = getComputedStyle(document.body).getPropertyValue("--color-text").split("#")[1];
      const stepRGB = [
        [255, 0, 0],
        [
          parseInt(textHexCode.substring(0, 2), 16),
          parseInt(textHexCode.substring(2, 4), 16),
          parseInt(textHexCode.substring(4), 16)
        ],
        [0, 255, 0]
      ];
      const ratio = this.gainedCEP.log10().div(this.currentCEP.log10());
      const interFn = index => {
        if (ratio.lt(0.9)) return stepRGB[0][index];
        if (ratio.lt(1)) {
          const r = (ratio.sub(0.9)).times(10).toNumber();
          return Math.round(stepRGB[0][index] * (1 - r) + stepRGB[1][index] * r);
        }
        if (ratio.lt(1.1)) {
          const r = (ratio.sub(1)).times(10).toNumber();
          return Math.round(stepRGB[1][index] * (1 - r) + stepRGB[2][index] * r);
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        color: `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s"
      };
    }
  },
  methods: {
    update() {
      this.canCelestialEternity = player.endgame.celDimExpansion.celestialInfinityPoints.gte(DC.NUMMAX);
      this.isVisible = this.canCelestialEternity || player.endgame.celDimExpansion.celestialEternities.gt(0);
      if (!this.isVisible) return;
      this.celestialEternityGoal.copyFrom(DC.NUMMAX);
      this.headerTextColored = player.options.headerTextColored;

      if (!this.canCelestialEternity) {
        this.type = CEP_BUTTON_DISPLAY_TYPE.CANNOT_CELESTIAL_ETERNITY;
        return;
      }

      if (!PlayerProgress.celestialEternityUnlocked()) {
        this.type = CEP_BUTTON_DISPLAY_TYPE.FIRST_TIME;
        return;
      }

      const gainedCEP = gainedCelestialEternityPoints();
      this.currentCEP.copyFrom(Currency.celestialEternityPoints);
      this.gainedCEP.copyFrom(gainedCEP);
      const hasNewContent = Currency.celestialEternityPoints.value.add(1).log10().gte(4000)
        && !Slabdrill.isCursed && !Slabdrill.isDestroyed;

      this.type = hasNewContent
        ? CEP_BUTTON_DISPLAY_TYPE.NORMAL_EXPLORE_NEW_CONTENT
        : CEP_BUTTON_DISPLAY_TYPE.NORMAL;
      this.currentCEPRate.copyFrom(gainedCEP.dividedBy(
        TimeSpan.fromMilliseconds(new Decimal(player.records.thisCelestialEternity.realTime)).totalMinutes));
      this.peakCEPRateVal.copyFrom(player.records.thisCelestialEternity.bestCEPminVal);
      this.peakCEPRate.copyFrom(player.records.thisCelestialEternity.bestCEPmin);
      this.showCEPRate = this.peakCEPRate.lte(this.rateThreshold);
      this.creditsClosed = GameEnd.creditsEverClosed;
    }
  },
};

const CEP_BUTTON_DISPLAY_TYPE = {
  CANNOT_CELESTIAL_ETERNITY: -1,
  FIRST_TIME: 0,
  NORMAL: 1,
  NORMAL_EXPLORE_NEW_CONTENT: 2
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClassObject"
    class="o-prestige-button"
    onclick="celestialEternityResetRequest()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Eternity -->
    <template v-if="type === -1">
      Reach {{ format(celestialEternityGoal, 2, 2) }}
      <br>
      Celestial Infinity Points
    </template>

    <!-- First time -->
    <template v-else-if="type === 0">
      Divine timelines await... I need to become Celestially Eternal
    </template>

    <!-- Normal -->
    <template v-else-if="type === 1">
      <span v-if="showCEPRate">Cel Eternity for </span>
      <span v-else>Celestial Eternity for </span>
      <span :style="amountStyle">{{ format(gainedCEP, 2) }}</span>
      <span v-if="showCEPRate"> CEP</span>
      <span v-else> Celestial Eternity {{ pluralize("Point", gainedCEP) }}</span>
      <br>
      <template v-if="showCEPRate">
        Current: {{ format(currentCEPRate, 2, 2) }} CEP/min
        <br>
        Peak: {{ format(peakCEPRate, 2, 2) }} CEP/min
        <br>
        at {{ format(peakCEPRateVal, 2, 2) }} CEP
      </template>
    </template>

    <!-- New content available -->
    <template v-else-if="type === 2">
      <template>
        Celestial Eternity for <span :style="amountStyle">{{ format(gainedCEP, 2, 2) }}</span> CEP
      </template>
      <br>
      Someone waits for you. Do not keep them waiting.
    </template>
  </button>
</template>

<style scoped>

</style>
