<script>
export default {
  name: "HadronsPane",
  data() {
    return {
      totalHadrons: 0,
      lightHadrons: 0,
      darkHadrons: 0,
      exoticHadrons: 0,
      totalLightHadrons: 0,
      totalDarkHadrons: 0,
      totalExoticHadrons: 0,
      basePercentageCap: 0,
      percentageCap: 0,
      hadronTimer: new Decimal(0),
      effect1: new Decimal(1),
      effect2: new Decimal(1),
      effect3: new Decimal(0),
      effect4: new Decimal(1),
      effect5: new Decimal(1),
      hasEffect1: false,
      hasEffect2: false,
      hasEffect3: false,
      hasEffect4: false,
      hasDark: false,
      hasExotic: false,
      showWarning: false,
      isFlipped: false
    };
  },
  computed: {
    effect1Time() {
      return new Decimal(0.25).div(Hadrons.speedFactor).times(this.percentageCap).sub(this.hadronTimer);
    },
    effect2Time() {
      return new Decimal(0.5).div(Hadrons.speedFactor).times(this.percentageCap).sub(this.hadronTimer);
    },
    effect3Time() {
      return new Decimal(1).div(Hadrons.speedFactor).times(this.percentageCap).sub(this.hadronTimer);
    },
    effect4Time() {
      return new Decimal(2).div(Hadrons.speedFactor).times(this.percentageCap).sub(this.hadronTimer);
    },
    effect5Time() {
      return new Decimal(5).div(Hadrons.speedFactor).times(this.percentageCap).sub(this.hadronTimer);
    },
    effect1Percent() {
      let fac = this.hadronTimer.times(100).times(4).times(Hadrons.speedFactor);
      let per = fac.gte(100) ? fac.sub(100).sqrt().add(100) : fac;
      return per.div(100).min(this.basePercentageCap / 100);
    },
    effect2Percent() {
      let fac = this.hadronTimer.times(100).times(2).times(Hadrons.speedFactor);
      let per = fac.gte(100) ? fac.sub(100).sqrt().add(100) : fac;
      return per.div(100).min(this.basePercentageCap / 100);
    },
    effect3Percent() {
      let fac = this.hadronTimer.times(100).times(Hadrons.speedFactor);
      let per = fac.gte(100) ? fac.sub(100).sqrt().add(100) : fac;
      return per.div(100).min(this.basePercentageCap / 100);
    },
    effect4Percent() {
      let fac = this.hadronTimer.times(100).div(2).times(Hadrons.speedFactor);
      let per = fac.gte(100) ? fac.sub(100).sqrt().add(100) : fac;
      return per.div(100).min(this.basePercentageCap / 100);
    },
    effect5Percent() {
      let fac = this.hadronTimer.times(100).div(5).times(Hadrons.speedFactor);
      let per = fac.gte(100) ? fac.sub(100).sqrt().add(100) : fac;
      return per.div(100).min(this.basePercentageCap / 100);
    },
    effect1Text() {
      if (this.effect1Time.lte(0)) return `Effect is capped`;
      return `Time to cap: ${TimeSpan.fromHours(this.effect1Time).toStringShort()}`;
    },
    effect2Text() {
      if (this.effect2Time.lte(0)) return `Effect is capped`;
      return `Time to cap: ${TimeSpan.fromHours(this.effect2Time).toStringShort()}`;
    },
    effect3Text() {
      if (this.effect3Time.lte(0)) return `Effect is capped`;
      return `Time to cap: ${TimeSpan.fromHours(this.effect3Time).toStringShort()}`;
    },
    effect4Text() {
      if (this.effect4Time.lte(0)) return `Effect is capped`;
      return `Time to cap: ${TimeSpan.fromHours(this.effect4Time).toStringShort()}`;
    },
    effect5Text() {
      if (this.effect5Time.lte(0)) return `Effect is capped`;
      return `Time to cap: ${TimeSpan.fromHours(this.effect5Time).toStringShort()}`;
    },
    hadronTime() {
      return TimeSpan.fromHours(this.hadronTimer).toStringShort();
    },
    buttonText1() {
      if (this.hasExotic) return `Convert a Hadron and a Dark Hadron into an Exotic Hadron`;
      return `Convert a Hadron into a Dark Hadron`;
    },
    buttonText2() {
      if (this.hasExotic) return `Convert an Exotic Hadron into a Hadron and a Dark Hadron`;
      return `Convert a Dark Hadron into a Hadron`;
    },
    buttonText3() {
      if (this.hasExotic) return `Convert all Hadrons and all Dark Hadrons into Exotic Hadrons`;
      return `Convert all Hadrons into Dark Hadrons`;
    },
    buttonText4() {
      if (this.hasExotic) return `Convert all Exotic Hadrons into Hadrons and Dark Hadrons`;
      return `Convert all Dark Hadrons into Hadrons`;
    },
    extraH1Text() {
      if (SingularityMilestone.hadronEffect1Improvement.isReached) {
        return ` and ${formatPow(SingularityMilestone.hadronEffect1Improvement.effectOrDefault(1), 2, 3)}`;
      }
      return "";
    }
  },
  methods: {
    update() {
      const hadrons = player.celestials.laitela.hadrons;
      this.totalHadrons = hadrons.trueTotal;
      this.lightHadrons = hadrons.light;
      this.darkHadrons = hadrons.dark;
      this.exoticHadrons = hadrons.exotic;
      this.totalLightHadrons = hadrons.totalLight;
      this.totalDarkHadrons = hadrons.totalDark;
      this.totalExoticHadrons = hadrons.totalExotic;
      this.basePercentageCap = (100 * Accelerators.emptiness.effectValue2 + EndgameMastery(251).effectOrDefault(0)) *
        (DivinityMilestone.serpentPower.isReached ? 2 : 1);
      this.percentageCap = (Math.pow(this.basePercentageCap - 100, 2) + 100) / 100;
      this.hadronTimer.copyFrom(Hadrons.timeFactor.div(100));
      this.effect1.copyFrom(Hadrons.singularityMultiplier);
      this.effect2.copyFrom(Hadrons.darkMatterCapMultiplier);
      this.effect3.copyFrom(Hadrons.darkEnergyAscensionBoost);
      this.effect4.copyFrom(Hadrons.entropyFormulaBoost);
      this.effect5.copyFrom(Hadrons.continuumMultiplier);
      this.hasEffect1 = DualityUpgrade(15).isBought;
      this.hasEffect2 = DualityUpgrade(16).isBought;
      this.hasEffect3 = DualityUpgrade(17).isBought;
      this.hasEffect4 = DualityUpgrade(18).isBought;
      this.hasDark = DualityUpgrade(19).isBought;
      this.hasExotic = DivinityMilestone.hadronEmpowerment.isReached;
      this.showWarning = Accelerators.emptiness.effectValue2 > 1;
      this.isFlipped = player.universes.current === 2;
    },
    assignOne() {
      if (this.hasExotic) {
        if (Slabdrill.isCursed) return;
        if (this.lightHadrons <= 0) return;
        Laitela.reset();
        Endgame.resetNoReward();
        player.celestials.laitela.hadrons.light -= 1;
        player.celestials.laitela.hadrons.dark -= 1;
        player.celestials.laitela.hadrons.exotic += 1;
      } else {
        if (this.lightHadrons <= 0) return;
        Laitela.reset();
        finishProcessReality({ reset: true });
        player.celestials.laitela.hadrons.light -= 1;
        player.celestials.laitela.hadrons.dark += 1;
      }
    },
    unassignOne() {
      if (this.hasExotic) {
        if (Slabdrill.isCursed) return;
        if (this.exoticHadrons <= 0) return;
        Laitela.reset();
        Endgame.resetNoReward();
        player.celestials.laitela.hadrons.light += 1;
        player.celestials.laitela.hadrons.dark += 1;
        player.celestials.laitela.hadrons.exotic -= 1;
      } else {
        if (this.darkHadrons <= 0) return;
        Laitela.reset();
        finishProcessReality({ reset: true });
        player.celestials.laitela.hadrons.light += 1;
        player.celestials.laitela.hadrons.dark -= 1;
      }
    },
    assignAll() {
      if (this.hasExotic) {
        if (Slabdrill.isCursed) return;
        if (this.lightHadrons <= 0) return;
        Laitela.reset();
        Endgame.resetNoReward();
        player.celestials.laitela.hadrons.light = 0;
        player.celestials.laitela.hadrons.dark = 0;
        player.celestials.laitela.hadrons.exotic = player.celestials.laitela.hadrons.total;
      } else {
        if (this.lightHadrons <= 0) return;
        Laitela.reset();
        finishProcessReality({ reset: true });
        player.celestials.laitela.hadrons.light = 0;
        player.celestials.laitela.hadrons.dark = player.celestials.laitela.hadrons.total;
      }
    },
    unassignAll() {
      if (this.hasExotic) {
        if (Slabdrill.isCursed) return;
        if (this.exoticHadrons <= 0) return;
        Laitela.reset();
        Endgame.resetNoReward();
        player.celestials.laitela.hadrons.light = player.celestials.laitela.hadrons.total;
        player.celestials.laitela.hadrons.dark = player.celestials.laitela.hadrons.total;
        player.celestials.laitela.hadrons.exotic = 0;
      } else {
        if (this.darkHadrons <= 0) return;
        Laitela.reset();
        finishProcessReality({ reset: true });
        player.celestials.laitela.hadrons.light = player.celestials.laitela.hadrons.total;
        player.celestials.laitela.hadrons.dark = 0;
      }
    }
  }
};
</script>

<template>
  <div class="c-laitela-hadrons-container">
    <div class="c-laitela-hadrons-row">
      <h2>
        You have
        {{ formatHybridSmall(lightHadrons, 3) }}<span v-if="totalLightHadrons > lightHadrons">(+{{ formatHybridSmall(totalLightHadrons - lightHadrons, 3) }})</span>
        {{ pluralize("Light Hadron", totalLightHadrons) }}
      </h2>
      <h2 v-if="hasDark">
        You have
        {{ formatHybridSmall(darkHadrons, 3) }}<span v-if="totalDarkHadrons > darkHadrons">(+{{ formatHybridSmall(totalDarkHadrons - darkHadrons, 3) }})</span>
        {{ pluralize("Dark Hadron", totalDarkHadrons) }}
      </h2>
      <h2 v-if="hasExotic">
        You have
        {{ formatHybridSmall(exoticHadrons, 3) }}<span v-if="totalExoticHadrons > exoticHadrons">(+{{ formatHybridSmall(totalExoticHadrons - exoticHadrons, 3) }})</span>
        {{ pluralize("Exotic Hadron", totalExoticHadrons) }}
      </h2>
      <br>
      <h2>
        You have spent {{ hadronTime }} in your current Endgame
      </h2>
    </div>
    <div
      v-if="hasEffect1"
      class="c-laitela-hadrons-row"
    >
      <div>
        Hadron Effect 1:
      </div>
      <div>
        Increase Singularities by {{ formatX(effect1, 2, 2) }}{{ extraH1Text }}
      </div>
      <div>
        {{ effect1Text }}
      </div>
      <div>
        Effectiveness: {{ formatDecimalPercents(effect1Percent, 2, 2) }}
      </div>
    </div>
    <div
      v-if="hasEffect2"
      class="c-laitela-hadrons-row"
    >
      <div>
        Hadron Effect 2:
      </div>
      <div>
        Multiply Dark Matter cap by {{ format(effect2, 2, 2) }}
      </div>
      <div>
        {{ effect2Text }}
      </div>
      <div>
        Effectiveness: {{ formatDecimalPercents(effect2Percent, 2, 2) }}
      </div>
    </div>
    <div
      v-if="hasEffect3"
      class="c-laitela-hadrons-row"
    >
      <div>
        Hadron Effect 3:
      </div>
      <div>
        Increase Dark Energy Multiplier on Ascension by {{ format(effect3, 2, 2) }}
      </div>
      <div>
        {{ effect3Text }}
      </div>
      <div>
        Effectiveness: {{ formatDecimalPercents(effect3Percent, 2, 2) }}
      </div>
    </div>
    <div
      v-if="hasEffect4"
      class="c-laitela-hadrons-row"
    >
      <div>
        Hadron Effect 4:
      </div>
      <div>
        {{ isFlipped ? "Matter" : "Antimatter" }} generates {{ formatX(effect4, 2, 2) }} more Entropy
      </div>
      <div>
        {{ effect4Text }}
      </div>
      <div>
        Effectiveness: {{ formatDecimalPercents(effect4Percent, 2, 2) }}
      </div>
    </div>
    <div
      v-if="hasDark"
      class="c-laitela-hadrons-row"
    >
      <div>
        Dark Hadron Effect:
      </div>
      <div>
        Multiply Continuum Purchases by {{ format(effect5, 2, 2) }}
      </div>
      <div>
        {{ effect5Text }}
      </div>
      <div>
        Effectiveness: {{ formatDecimalPercents(effect5Percent, 2, 2) }}
      </div>
    </div>
    <div
      v-if="hasDark"
      class="c-laitela-hadrons-row"
    >
      <button
        class="c-laitela-hadrons-assign"
        :class="{ 'c-laitela-hadrons-assign--available' : lightHadrons > 0 }"
        @click="assignOne"
      >
        {{ buttonText1 }}
      </button>
      <button
        class="c-laitela-hadrons-assign"
        :class="{ 'c-laitela-hadrons-assign--available' : (hasExotic ? exoticHadrons > 0 : darkHadrons > 0) }"
        @click="unassignOne"
      >
        {{ buttonText2 }}
      </button>
      <button
        class="c-laitela-hadrons-assign"
        :class="{ 'c-laitela-hadrons-assign--available' : lightHadrons > 0 }"
        @click="assignAll"
      >
        {{ buttonText3 }}
      </button>
      <button
        class="c-laitela-hadrons-assign"
        :class="{ 'c-laitela-hadrons-assign--available' : (hasExotic ? exoticHadrons > 0 : darkHadrons > 0) }"
        @click="unassignAll"
      >
        {{ buttonText4 }}
      </button>
    </div>
    <div
      v-if="showWarning"
      class="c-laitela-warning"
    >
      Hadron effectiveness will increase much slower above {{ formatPercents(1) }}
    </div>
  </div>
</template>

<style scoped>
.c-laitela-hadrons-assign {
  margin: 0 0.3rem 1rem;
}

.c-laitela-warning {
  color: red;
}
</style>
