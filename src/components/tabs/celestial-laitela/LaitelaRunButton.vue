<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "LaitelaRunButton",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: new Decimal(1),
      singularitiesUnlocked: false,
      bestSet: [],
      tierNotCompleted: true,
      hadronizeUnlocked: false,
      darkEnergyBoost: new Decimal(0),
      hasHadronizes: false,
      hadronizes: 0,
    };
  },
  computed: {
    completionTime() {
      if (this.tierNotCompleted) return "Not completed at this tier";
      return `Fastest Completion: ${TimeSpan.fromSeconds(new Decimal(this.realityTime)).toStringShort()}`;
    },
    runEffects() {
      return GameDatabase.celestials.descriptions[5].effects().split("\n");
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description();
    },
    isDoomed: () => Pelle.isDoomed || Slabdrill.isCursed,
  },
  methods: {
    update() {
      this.realityTime = player.celestials.laitela.fastestCompletion;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward.copyFrom(Laitela.realityReward);
      this.isRunning = Laitela.isRunning;
      this.singularitiesUnlocked = Currency.singularities.gt(0);
      this.bestSet = cloneDeep(Glyphs.copyForRecords(player.records.bestReality.laitelaSet));
      this.tierNotCompleted = this.realityTime === 3600 || (this.realityTime === 300 && this.maxDimTier < 8);
      this.hadronizeUnlocked = ExpansionPack.laitelaPack.isBought && !player.disablePostReality;
      this.darkEnergyBoost.copyFrom(Laitela.realityRewardDE);
      this.hasHadronizes = this.hadronizes > 0;
      this.hadronizes = Laitela.hadronizes;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Lai'tela's", number: 5 });
    },
    classObject() {
      return {
        "o-laitela-run-button": true,
        "o-laitela-run-button--large": !this.singularitiesUnlocked,
        "o-laitela-run-button--larger": this.hadronizeUnlocked
      };
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    hadronize() {
      Laitela.hadronize();
    }
  }
};
</script>

<template>
  <button :class="classObject()">
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <b>Start Lai'tela's Reality</b>
    </span>
    <div
      :class="runButtonClassObject()"
      @click="startRun"
    />
    <div v-if="realityReward.gt(1)">
      <b>
        All Dark Matter multipliers are {{ formatX(realityReward, 2, 2) }} higher.
      </b>
      <br>
      <span v-if="maxDimTier === 0 || hasHadronizes">
        <b>
          You also gain an additional {{ formatX(darkEnergyBoost) }} Dark Energy.
        </b>
      </span>
      <span v-if="hasHadronizes">
        <b>
          You have Hadronized Lai'tela's Reality {{ formatHybridSmall(hadronizes, 3) }} times.
        </b>
      </span>
      <span v-if="maxDimTier > 0">
        <br><br>
        {{ completionTime }}
        <br>
        <span v-if="maxDimTier <= 7">
          <b>Highest active dimension: {{ formatInt(maxDimTier) }}</b>
        </span>
        <br><br>
        Glyph Set:
        <GlyphSetPreview
          text="Fastest Destabilization Glyph Set"
          :text-hidden="true"
          :force-name-color="false"
          :glyphs="bestSet"
        />
      </span>
      <span v-else>
        <br><br>
        Lai'tela's Reality has been fully destabilized and cannot have its reward further improved.
      </span>
      <br>
    </div>
    <div
      v-for="(line, lineId) in runEffects"
      :key="lineId + '-laitela-run-desc' + maxDimTier"
    >
      {{ line }} <br>
    </div>
    <br>
    <div>{{ runDescription }}</div>
    <br>
    <div v-if="hadronizeUnlocked">
      <button
        class="l-laitela-hadronize-button c-laitela-hadronize-button"
        @click="hadronize"
      >
        <b>Hadronize Laitela's Reality</b>
      </button>
      <br>
      <br>
      Hadronizing Lai'tela's Reality will restabilize all {{ formatInt(8) }} Dimensions, so you can use them again.
      Rewards for completing Lai'tela's Reality from previous Hadronizes will persist, and you will be able to gain
      more rewards for destabilizing Lai'tela's Reality again. Each Hadronization, the reward for destabilizing
      Lai'tela's Reality will be multiplied by {{ formatInt(8) }}.
    </div>
  </button>
</template>
