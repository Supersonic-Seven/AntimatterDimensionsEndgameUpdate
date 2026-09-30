<script>
import NewTimeDimensionRow from "./ModernTimeDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "NewTimeDimensionsTab",
  components: {
    PrimaryButton,
    NewTimeDimensionRow
  },
  data() {
    return {
      totalUpgrades: new Decimal(0),
      multPerTickspeed: 0,
      tickspeedSoftcap: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
      isEndgameUnlocked: false,
      timeDimCompressionMagnitude: 0,
      timeDimOverflow: 0,
      timeDimStart: new Decimal(0),
      timeDimCompressionMagnitude2: 0,
      timeDimOverflow2: 0,
      timeDimStart2: new Decimal(0),
      hasSecond: false,
      hasCap: true
    };
  },
  computed: {
    costIncreases: () => TimeDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !TimeDimension(8).isUnlocked && player.realities.gte(1);
      this.totalUpgrades.copyFrom(player.totalTickGained);
      this.multPerTickspeed = FreeTickspeed.multToNext;
      this.tickspeedSoftcap = FreeTickspeed.softcap;
      this.timeShards.copyFrom(Currency.timeShards);
      this.upgradeThreshold.copyFrom(FreeTickspeed.fromShards(Currency.timeShards.value).nextShards);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Eighth Infinity Dimensions" : "Time Shards";
      this.areAutobuyersUnlocked = Autobuyer.timeDimension(1).isUnlocked;
      this.isEndgameUnlocked = PlayerProgress.endgameUnlocked();
      this.timeDimCompressionMagnitude = TimeDimensions.compressionMagnitude;
      this.timeDimOverflow = 1 / this.timeDimCompressionMagnitude;
      this.timeDimStart = TimeDimensions.OVERFLOW;
      this.timeDimCompressionMagnitude2 = TimeDimensions.compressionMag2;
      this.timeDimOverflow2 = 1 / this.timeDimCompressionMagnitude2;
      this.timeDimStart2 = TimeDimensions.OVERFLOW_SQUARED;
      this.hasSecond = Currency.timeShards.gte(DC.ENUMMAX);
      this.hasCap = Alpha.currentStage < 11 || player.disablePostReality;
    },
    maxAll() {
      tryUnlockTimeDimensions();
      maxAllTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    }
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have gained
        <span class="c-time-dim-description__accent">{{ formatHybridLarge(totalUpgrades, 3) }}</span> Tickspeed upgrades from
        <span class="c-time-dim-description__accent">{{ format(timeShards, 2, 1) }}</span> Time Shards.
      </p>
      <p>
        Next Tickspeed upgrade at
        <span class="c-time-dim-description__accent">{{ format(upgradeThreshold, 2, 1) }}</span>, increasing by
        <span class="c-time-dim-description__accent">{{ formatX(multPerTickspeed, 2, 2) }}</span> per
        Tickspeed upgrade gained.
      </p>
    </div>
    <div>
      <p>
        <span v-if="isEndgameUnlocked">
          Your Time Dimension Compression Magnitude is
          <span class="c-time-dim-compression-description__accent">{{ format(timeDimCompressionMagnitude, 2, 3) }}</span>,
          which raises all Time Dimension Multipliers' Exponents to the power of
          <span class="c-time-dim-compression-description__accent">{{ format(timeDimOverflow, 2, 3) }}</span>
          while above
          <span>{{ formatPostBreak(timeDimStart, 2, 1) }}</span>.
        </span>
      </p>
    </div>
    <div>
      <p>
        <span v-if="hasSecond">
          Your Time Dimension Compression^2 Magnitude is
          <span class="c-time-dim-compression-description__accent">{{ format(timeDimCompressionMagnitude2, 2, 3) }}</span>,
          which raises all Time Dimension Multipliers' Exponents to the power of
          <span class="c-time-dim-compression-description__accent">{{ format(timeDimOverflow2, 2, 3) }}</span>
          while above
          <span>{{ formatPostBreak(timeDimStart2, 2, 1) }}</span>.
        </span>
      </p>
    </div>
    <div>
      The amount each additional upgrade requires will start
      increasing above {{ formatHybridLarge(tickspeedSoftcap, 3) }} Tickspeed upgrades.
    </div>
    <div>You are getting {{ format(shardsPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <div class="l-dimensions-container">
      <NewTimeDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      Time Dimension costs jump at {{ format(costIncreases[0], 2, 2) }} and
      {{ format(costIncreases[1]) }} Eternity Points,
      <br>
      and costs increase much faster after {{ format(costIncreases[2]) }} Eternity Points.
      <br>
      <div v-if="showLockedDimCostNote">
        Hold shift to see the Eternity Point cost for locked Time Dimensions.
      </div>
      <div v-if="hasCap">
        Any 8th Time Dimensions purchased above {{ format(1e8) }} will not further increase the multiplier.
      </div>
    </div>
  </div>
</template>
