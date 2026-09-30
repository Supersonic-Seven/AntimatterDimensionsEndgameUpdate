<script>
import CelestialDimensionBoostRow from "./ModernCelestialDimensionBoostRow";
import CelestialDimensionRow from "./ModernCelestialDimensionRow";
import CelestialGalaxyRow from "./ModernCelestialGalaxyRow";
import CelestialTickspeedRow from "./CelestialTickspeedRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernCelestialDimensionTab",
  components: {
    PrimaryButton,
    CelestialDimensionBoostRow,
    CelestialDimensionRow,
    CelestialGalaxyRow,
    CelestialTickspeedRow
  },
  data() {
    return {
      celestialMatter: new Decimal(0),
      unnerfedCelestialMatter: new Decimal(0),
      dimMultiplier: new Decimal(0),
      matterPerSecond: new Decimal(0),
      incomeType: "",
      conversionExponent: 0,
      nextDimCapIncrease: 0,
      totalDimCap: new Decimal(0),
      creditsClosed: false,
      showLockedDimCostNote: true,
      softcapPow: 0,
      softcap: new Decimal(0),
      unstable: false,
      overflowMag: 0,
      overflow: new Decimal(0),
      isOverflowing: false,
      massOverflowMag: 0,
      massOverflow: new Decimal(0),
      isCorrupted: false,
      isEffectActive: false,
      collapsedInfo: false,
      anySoftcapApplicable: false,
      everSeenSoftcaps: false,
      alphaDecayRemnant: 0,
      hasRemnant: false,
      isExpanded: false,
      canCrunch: false,
      isBroken: false,
      hasInfinities: false,
      infinityPoints: new Decimal(0),
      isAnyAutobuyerUnlocked: false,
      timeToCap: new Decimal(0),
      hasEternities: false,
      eternityPoints: new Decimal(0),
    };
  },
  computed: {
    softcapCollapseDisplay() {
      return this.collapsedInfo
        ? "Show softcap information"
        : "Hide softcap information";
    },
    timeToCapText() {
      return TimeSpan.fromHours(this.timeToCap).toStringShort();
    }
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !CelestialDimension(8).isUnlocked;
      this.celestialMatter.copyFrom(Currency.celestialMatter);
      this.unnerfedCelestialMatter.copyFrom(Currency.unnerfedCelestialMatter);
      this.conversionExponent = CelestialDimensions.conversionExponent;
      this.dimMultiplier.copyFrom(this.celestialMatter.pow(this.conversionExponent).max(1));
      this.matterPerSecond.copyFrom(CelestialDimension(1).productionPerSecond);
      this.incomeType = "Celestial Matter";
      this.totalDimCap.copyFrom(CelestialDimensions.totalDimCap);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.softcapPow = CelestialDimensions.softcapPow;
      this.softcap.copyFrom(CelestialDimensions.SOFTCAP);
      this.unstable = this.celestialMatter.gte(this.softcap);
      this.overflowMag = CelestialDimensions.OVERFLOW_MAG;
      this.overflow.copyFrom(CelestialDimensions.OVERFLOW);
      this.isOverflowing = this.celestialMatter.gt(this.overflow);
      this.massOverflowMag = CelestialDimensions.MASS_OVERFLOW_MAG;
      this.massOverflow.copyFrom(CelestialDimensions.MASS_OVERFLOW);
      this.isCorrupted = this.celestialMatter.gt(this.massOverflow);
      this.isEffectActive = player.endgame.celestialMatterMultiplier.isActive;
      this.collapsedInfo = player.endgame.celDimExpansion.softcapsCollapsed;
      this.anySoftcapApplicable = this.unstable || this.isOverflowing || this.isCorrupted;
      this.everSeenSoftcaps = player.records.totalCelMatter.gte(DC.E100);
      this.alphaDecayRemnant = CelestialDimensions.alphaDecayRemnant;
      this.hasRemnant = Alpha.isDestroyed;
      this.isExpanded = Achievement(221).isUnlocked;
      this.canCrunch = Currency.celestialMatter.value.gte(DC.NUMMAX) && this.isExpanded;
      this.isBroken = player.endgame.celDimExpansion.isBroken;
      this.hasInfinities = PlayerProgress.celestialInfinityUnlocked();
      this.infinityPoints.copyFrom(player.endgame.celDimExpansion.celestialInfinityPoints);
      this.isAnyAutobuyerUnlocked = Autobuyer.celestialDimension(1).isUnlocked;
      this.timeToCap.copyFrom(DC.D5.times(CelestialDimensions.alphaDecaySpeed));
      this.hasEternities = PlayerProgress.celestialEternityUnlocked();
      this.eternityPoints.copyFrom(player.endgame.celDimExpansion.celestialEternityPoints);
    },
    maxAll() {
      CelestialDimensions.buyMax();
    },
    toggleCelestialMatterMultiplier() {
      toggleCelestialMatter();
    },
    toggleAllAutobuyers() {
      toggleAllCelDims();
    },
    instabilityClassObject() {
      return {
        "c-celestial-dim-description__accent": !this.anySoftcapApplicable,
        "c-celestial-dim-description__accent-unstable": this.anySoftcapApplicable,
      };
    },
    toggleSeenSoftcaps() {
      player.endgame.celDimExpansion.softcapsCollapsed = !player.endgame.celDimExpansion.softcapsCollapsed;
    },
    celestialCrunch() {
      if (PlayerProgress.celestialInfinityUnlocked()) celestialCrunchResetRequest();
      else Modal.celestialCrunch.show();
    }
  }
};
</script>

<template>
  <div class="l-celestial-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="toggleCelestialMatterMultiplier"
      >
        Toggle Celestial Matter
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div v-if="!canCrunch || isBroken">
      <div>
        <p>
          <span v-if="hasEternities">
            You have <span class="c-celestial-eternity-text">{{ format(eternityPoints, 2) }}</span>
            {{ pluralize("Celestial Eternity Point", eternityPoints) }}.
          </span>
          <br>
          <span v-if="hasInfinities">
            You have <span class="c-celestial-infinity-text">{{ format(infinityPoints, 2) }}</span>
            {{ pluralize("Celestial Infinity Point", infinityPoints) }}.
          </span>
          <br>
          You have
          <span :class="instabilityClassObject()">{{ format(celestialMatter, 2, 1) }}</span>
          <span v-if="unstable"> Unstable</span><span v-if="isOverflowing"> Overflowing</span>
          <span v-if="isCorrupted"> Corrupted</span> Celestial Matter,
          <br>
          <span>
            increased by
            <span :class="instabilityClassObject()">{{ formatPow(conversionExponent, 2, 3) }}</span>
          </span>
          to a
          <span :class="instabilityClassObject()">
            {{ formatX(dimMultiplier, 2, 1) }}<span v-if="!isEffectActive"> (Disabled)</span>
          </span>
          multiplier to
          <span>Game Speed.</span>
          <div v-if="everSeenSoftcaps">
            <div v-if="!collapsedInfo">
              <div v-if="unstable">
                You <i>would</i> have <span :class="instabilityClassObject()">{{ format(unnerfedCelestialMatter, 2, 1) }}</span>
                Celestial Matter, but you don't.
                <br>
                This is because at <span :class="instabilityClassObject()">{{ format(softcap, 2, 1) }}</span> Celestial Matter, your
                Celestial Matter was softcapped.
                <br>
                Currently, Celestial Matter above this amount is being raised to the power of
                <span :class="instabilityClassObject()">{{ format(1 / softcapPow, 2, 3) }}</span>.
                <br>
                The softcap to Celestial Matter is solely based on your Celestial Matter Softcap Magnitude, which is currently
                <span :class="instabilityClassObject()">{{ format(softcapPow, 2, 3) }}</span>.
              </div>
              <div v-if="isOverflowing">
                After <span :class="instabilityClassObject()">{{ format(overflow, 2, 1) }}</span> Celestial Matter, your
                Celestial Matter was softcapped <i>again</i>.
                <br>
                Currently, Celestial Matter and the Celestial Matter Softcap start above this amount is being raised to the power of
                <span :class="instabilityClassObject()">{{ format(1 / overflowMag, 2, 3) }}</span>.
                <br>
                The Celestial Matter Overflow is solely based on your Celestial Matter Overflow Magnitude, which is currently
                <span :class="instabilityClassObject()">{{ format(overflowMag, 2, 3) }}</span>.
              </div>
              <div v-if="isCorrupted">
                After <span :class="instabilityClassObject()">{{ format(massOverflow, 2, 1) }}</span> Celestial Matter, your
                Celestial Matter was softcapped <i>once again</i>.
                <br>
                Currently, Celestial Matter above this amount is being raised to the power of
                <span :class="instabilityClassObject()">{{ format(1 / massOverflowMag, 2, 3) }}</span>.
                <br>
                The Celestial Matter Corruption is solely based on your Celestial Matter Corruption Magnitude, which is currently
                <span :class="instabilityClassObject()">{{ format(massOverflowMag, 2, 3) }}</span>.
              </div>
            </div>
            <PrimaryButton
              class="o-primary-btn--subtab-option"
              @click="toggleSeenSoftcaps"
            >
              {{ softcapCollapseDisplay }}
            </PrimaryButton>
          </div>
        </p>
      </div>
      <div v-if="hasRemnant">
        Remnants of Alpha Decay are raising all Celestial Dimensions to the power of
        <span class="c-celestial-dim-description__accent-unstable">{{ format(alphaDecayRemnant, 2, 3) }}</span>,
        which increases to a cap of {{ formatInt(1) }} over {{ timeToCapText }} this Celestial Infinity.
      </div>
      <div>
        All Celestial Dimensions can be purchased until {{ format(totalDimCap, 2, 2) }} Celestial Points.
      </div>
      <div>You are getting {{ format(matterPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    </div>
    <div v-if="canCrunch && !isBroken">
      <br>
      <button
        :class="{
          'btn-celestial-crunch': true
        }"
        @click="celestialCrunch"
      >
        Celestial Crunch
      </button>
      <br>
      <br>
    </div>
    <CelestialTickspeedRow v-if="isExpanded"/>
    <div class="l-dimensions-container">
      <CelestialDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div
      v-if="isExpanded"
      class="resets-container"
    >
      <CelestialDimensionBoostRow v-if="isExpanded"/>
      <CelestialGalaxyRow v-if="isExpanded"/>
    </div>
    <div v-if="showLockedDimCostNote">
      Hold shift to see the Celestial Point cost for locked Celestial Dimensions.
    </div>
  </div>
</template>

<style scoped>
.c-celestial-infinity-text {
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(var(--color-infinity), var(--color-celestials));
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.c-celestial-eternity-text {
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(var(--color-eternity), var(--color-celestials));
  background-clip: text;

  -webkit-text-fill-color: transparent;
}
</style>
