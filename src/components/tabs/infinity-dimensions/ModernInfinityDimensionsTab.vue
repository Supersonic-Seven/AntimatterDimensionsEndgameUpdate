<script>
import wordShift from "@/core/word-shift";

import InfinityDimensionRow from "./ModernInfinityDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModernInfinityDimensionsTab",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    InfinityDimensionRow
  },
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isEC9Running: false,
      isEnslavedRunning: false,
      isAnyAutobuyerUnlocked: false,
      conversionRate: 0,
      nextDimCapIncrease: new Decimal(0),
      tesseractCost: new Decimal(0),
      totalDimCap: new Decimal(0),
      canBuyTesseract: false,
      enslavedCompleted: false,
      boughtTesseracts: 0,
      extraTesseracts: 0,
      tesseractMult: 0,
      creditsClosed: false,
      showLockedDimCostNote: true,
      isEndgameUnlocked: false,
      infinityDimCompressionMagnitude: 0,
      infinityDimOverflow: 0,
      infinityDimStart: new Decimal(0),
      infinityDimCompressionMagnitude2: 0,
      infinityDimOverflow2: 0,
      infinityDimStart2: new Decimal(0),
      hasSecond: false,
      freeTesseractSoftcap: 0,
      freeTesseractHardcap: 0,
      isAutoUnlocked: false,
      isAutoActive: false,
      isAlphaDestroyed: false,
      tesseractMultText: "",
      additiveTesseractString: "",
      multiplicativeTesseractString: "",
      tesseractStringArray: [],
      isFlipped: false
    };
  },
  computed: {
    tesseractCountString() {
      if (LHC.hadronC >= 1) return this.multiplicativeTesseractString;
      if (LHC.hadronC >= 0.5) return `${wordShift.wordCycle(this.tesseractStringArray, true)}`;
      return this.additiveTesseractString;
    },
    autobuyer() {
      return Autobuyer.tesseract;
    },
    autobuyerTextDisplay() {
      const auto = this.isAutoActive;
      return `Auto Tesseract ${auto ? "ON" : "OFF"}`;
    },
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !InfinityDimension(8).isUnlocked;
      this.isEC9Running = EternityChallenge(9).isRunning;
      this.infinityPower.copyFrom(Currency.infinityPower);
      this.conversionRate = InfinityDimensions.powerConversionRate;
      if (this.isEC9Running) {
        this.dimMultiplier.copyFrom(Decimal.pow(Decimal.max(this.infinityPower.add(1).log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(this.infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Seventh Dimensions" : "Infinity Power";
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.nextDimCapIncrease.copyFrom(Tesseracts.nextTesseractIncrease);
      this.tesseractCost.copyFrom(Tesseracts.nextCost);
      this.totalDimCap.copyFrom(InfinityDimensions.totalDimCap);
      this.canBuyTesseract = Tesseracts.canBuyTesseract;
      this.enslavedCompleted = Enslaved.isCompleted && !player.disablePostReality;
      this.boughtTesseracts = Tesseracts.bought;
      this.extraTesseracts = Tesseracts.extra;
      this.tesseractMult = Tesseracts.totalMult;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.isEndgameUnlocked = PlayerProgress.endgameUnlocked();
      this.infinityDimCompressionMagnitude = InfinityDimensions.compressionMagnitude;
      this.infinityDimOverflow = 1 / this.infinityDimCompressionMagnitude;
      this.infinityDimStart = InfinityDimensions.OVERFLOW;
      this.infinityDimCompressionMagnitude2 = InfinityDimensions.compressionMag2;
      this.infinityDimOverflow2 = 1 / this.infinityDimCompressionMagnitude2;
      this.infinityDimStart2 = InfinityDimensions.OVERFLOW_SQUARED;
      this.hasSecond = Currency.infinityPower.gte(DC.ENUMMAX);
      this.freeTesseractSoftcap = Tesseracts.freeSoftcapStart;
      this.freeTesseractHardcap = this.freeTesseractSoftcap * 2;
      const auto = Autobuyer.tesseract;
      this.isAutoUnlocked = auto.isUnlocked;
      this.isAutoActive = auto.isActive;
      this.isAlphaDestroyed = Alpha.isDestroyed;
      this.tesseractMultText = this.tesseractMult !== 1 ? ` × ${format(this.tesseractMult, 2, 2)}` : "";
      this.additiveTesseractString = `${formatHybridSmall(this.boughtTesseracts, 3)}${this.tesseractMultText}${this.extraTesseracts > 0
        ? ` + ${format(this.extraTesseracts, 2, 2)}${this.tesseractMultText}` : ""}`;
      this.multiplicativeTesseractString = `${formatHybridSmall(this.boughtTesseracts, 3)}${this.extraTesseracts > 0
        ? ` × ${format(this.extraTesseracts, 2, 2)}${this.tesseractMultText}` : ""}`;
      this.tesseractStringArray = [this.multiplicativeTesseractString, this.additiveTesseractString];
      this.isFlipped = player.universes.current === 2;
    },
    maxAll() {
      InfinityDimensions.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Tesseracts.buyTesseract();
    },
    handleAutoToggle(value) {
      Autobuyer.tesseract.isActive = value;
      this.update();
    }
  }
};
</script>

<template>
  <div class="l-infinity-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        v-if="!isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked && !isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have
        <span class="c-infinity-dim-description__accent">{{ format(infinityPower, 2, 1) }}</span>
        Infinity Power,
        <br>
        <span v-if="!isEC9Running">
          increased by
          <span class="c-infinity-dim-description__accent">{{ formatPow(conversionRate, 2, 3) }}</span>
        </span>
        <span v-else>
          translated
        </span>
        to a
        <span class="c-infinity-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
        multiplier on all
        <span v-if="!isEC9Running">{{ isFlipped ? "Matter" : "Antimatter" }} Dimensions.</span>
        <span v-else>Time Dimensions due to Eternity Challenge 9.</span>
      </p>
    </div>
    <div>
      <p>
        <span v-if="isEndgameUnlocked">
          Your Infinity Dimension Compression Magnitude is
          <span class="c-infinity-dim-compression-description__accent">{{ format(infinityDimCompressionMagnitude, 2, 3) }}</span>,
          which raises all Infinity Dimension Multipliers' Exponents to the power of
          <span class="c-infinity-dim-compression-description__accent">{{ format(infinityDimOverflow, 2, 3) }}</span>
          while above
          <span>{{ formatPostBreak(infinityDimStart, 2, 1) }}</span>.
        </span>
      </p>
    </div>
    <div>
      <p>
        <span v-if="hasSecond">
          Your Infinity Dimension Compression^2 Magnitude is
          <span class="c-infinity-dim-compression-description__accent">{{ format(infinityDimCompressionMagnitude2, 2, 3) }}</span>,
          which raises all Infinity Dimension Multipliers' Exponents to the power of
          <span class="c-infinity-dim-compression-description__accent">{{ format(infinityDimOverflow2, 2, 3) }}</span>
          while above
          <span>{{ formatPostBreak(infinityDimStart2, 2, 1) }}</span>.
        </span>
      </p>
    </div>
    <div
      v-if="enslavedCompleted"
      class="l-infinity-dim-tab__enslaved-reward-container"
    >
      <button
        class="c-infinity-dim-tab__tesseract-button"
        :class="{
          'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract,
          'o-pelle-disabled-pointer': creditsClosed
        }"
        @click="buyTesseract"
      >
        <p>
          Buy a Tesseract ({{ tesseractCountString }})
        </p>
        <p>Increase dimension caps by {{ format(nextDimCapIncrease, 2) }}</p>
        <p><b>Costs: {{ format(tesseractCost) }} IP</b></p>
      </button>
      <br>
      <PrimaryToggleButton
        v-if="isAutoUnlocked"
        :value="isAutoActive"
        :on="autobuyerTextDisplay"
        :off="autobuyerTextDisplay"
        class="l--spoon-btn-group__little-spoon o-primary-btn--tesseract-toggle"
        @input="handleAutoToggle"
      />
    </div>
    <div>
      Free Tesseracts are softcapped past {{ format(freeTesseractSoftcap, 2, 2) }}.
      <div v-if="!isAlphaDestroyed">
        <br>
        This softcap causes Tesseracts past {{ format(freeTesseractSoftcap, 2, 2) }} to eternally approach
        a hardcap of {{ format(freeTesseractHardcap, 2, 2) }} without ever actually reaching it.
      </div>
    </div>
    <div v-if="isEnslavedRunning">
      All Infinity Dimensions are limited to a single purchase.
    </div>
    <div v-else>
      All Infinity Dimensions except for the 8th are limited to a maximum of {{ format(totalDimCap, 2) }}
      purchases each.
    </div>
    <div>You are getting {{ format(powerPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <b
      v-if="isEC8Running"
      class="l-infinity-dim-tab__ec8-purchases"
    >
      You have {{ quantifyInt("purchase", EC8PurchasesLeft) }} left within Eternity Challenge 8.
    </b>
    <div class="l-dimensions-container">
      <InfinityDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      Hold shift to see the Infinity Point cost for locked Infinity Dimensions.
    </div>
  </div>
</template>
