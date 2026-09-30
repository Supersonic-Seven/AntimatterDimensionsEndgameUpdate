<script>
import DivineDimensionRow from "./ModernDivineDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernDivineDimensionTab",
  components: {
    PrimaryButton,
    DivineDimensionRow
  },
  data() {
    return {
      divineMatter: new Decimal(0),
      divineEnergy: new Decimal(0),
      matterPerSecond: new Decimal(0),
      energyPerSecond: new Decimal(0),
      incomeType: "",
      dispBoth: false,
      conversionFormula1: new Decimal(0),
      conversionFormula2: 0,
      conversionFormula3: 0,
      hardcap: new Decimal(0),
      creditsClosed: false,
      canProduceEnergy: false,
      isProducingEnergy: false,
      isAnyAutobuyerUnlocked: false,
      isFlipped: false
    };
  },
  computed: {
    changeProdDisplay() {
      return this.isProducingEnergy
        ? "Produce Divine Matter"
        : "Produce Divine Energy";
    },
    currencyProd() {
      return this.isProducingEnergy
        ? `${format(this.energyPerSecond, 2, 2)}`
        : `${format(this.matterPerSecond, 2, 0)}`;
    },
  },
  methods: {
    update() {
      this.divineMatter.copyFrom(Currency.divineMatter);
      this.divineEnergy.copyFrom(Currency.divineEnergy);
      this.matterPerSecond.copyFrom(DivineDimension(1).productionPerSecond);
      this.energyPerSecond.copyFrom(DivineDimensions.energyPerSecond);
      this.incomeType = player.celestials.pelle.divinity.isProducingEnergy ? "Divine Energy" : "Divine Matter";
      this.dispBoth = DivinityUpgrade.divineL2U10.isBought;
      this.conversionFormula1 = DivineDimensions.conversionFormula1;
      this.conversionFormula2 = DivineDimensions.conversionFormula2;
      this.conversionFormula3 = DivineDimensions.conversionFormula3;
      this.hardcap.copyFrom(DivineDimensions.HARDCAP);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.canProduceEnergy = DivinityUpgrade.divineL1U5.isBought;
      this.isProducingEnergy = player.celestials.pelle.divinity.isProducingEnergy;
      this.isAnyAutobuyerUnlocked = Autobuyer.divineDimension(1).isUnlocked;
      this.isFlipped = player.universes.current === 2;
    },
    maxAll() {
      DivineDimensions.buyMax();
    },
    shiftProd() {
      player.celestials.pelle.divinity.isProducingEnergy = !player.celestials.pelle.divinity.isProducingEnergy;
    },
    toggleAllAutobuyers() {
      toggleAllDivDims();
    }
  }
};
</script>

<template>
  <div class="l-divine-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <div v-if="canProduceEnergy">
        You have <span class="c-divine-dim-description__accent">{{ format(divineEnergy, 2, 1) }}</span> Divine Energy.
      </div>
      <div>
        <p>
          You have
          <span class="c-divine-dim-description__accent">{{ format(divineMatter, 2, 1) }}</span>
          Divine Matter,
          <br>
          translated to a
          <span class="c-divine-dim-description__accent">{{ formatX(conversionFormula1, 2, 2) }}</span>
          multiplier to Endgame and Ethereal Power gain, a
          <span class="c-divine-dim-description__accent">{{ formatPow(conversionFormula2, 2, 3) }}</span>
          to {{ isFlipped ? "Matter" : "Antimatter" }} Exponent while Doomed and all Machines, and a
          <span class="c-divine-dim-description__accent">{{ formatPercents(conversionFormula3, 2, 2) }}</span>
          reduction to Hadron and Remnants of Alpha Decay cap times.
        </p>
      </div>
      <div>Divine Matter is capped at {{ format(hardcap, 2, 0) }}.</div>
      <div v-if="!dispBoth">You are getting {{ currencyProd }} {{ incomeType }} per second.</div>
      <div v-if="dispBoth">
        <div>You are getting {{ format(matterPerSecond, 2, 0) }} Divine Matter per second.</div>
        <div>You are getting {{ format(energyPerSecond, 2, 2) }} Divine Energy per second.</div>
      </div>
      <PrimaryButton
        v-if="canProduceEnergy && !dispBoth"
        class="o-primary-btn--subtab-option"
        @click="shiftProd"
      >
        {{ changeProdDisplay }}
      </PrimaryButton>
    </div>
    <div class="l-dimensions-container">
      <DivineDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
