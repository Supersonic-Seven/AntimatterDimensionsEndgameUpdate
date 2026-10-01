<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "StoredTimeTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      storedTime: 0,
      fluxUnlocked: false,
      fluxLevel: 1,
      fluxTime: 0,
      maxFlux: 2
    };
  },
  computed: {
    timeDisplay() {
      return TimeSpan.fromSeconds(new Decimal(this.storedTime)).toStringShort();
    },
    fluxTimeDisplay() {
      return TimeSpan.fromSeconds(new Decimal(this.fluxTime)).toStringShort();
    },
    oneMinuteDisp() {
      return `Spend ${TimeSpan.fromMinutes(1).toStringShort()} of Stored Time`;
    },
    tenMinutesDisp() {
      return `Spend ${TimeSpan.fromMinutes(10).toStringShort()} of Stored Time`;
    },
    oneHourDisp() {
      return `Spend ${TimeSpan.fromHours(1).toStringShort()} of Stored Time`;
    },
    fiveHoursDisp() {
      return `Spend ${TimeSpan.fromHours(5).toStringShort()} of Stored Time`;
    },
    allDisp() {
      return `Spend all Stored Time`;
    },
    fluxUnlockDisp() {
      return `Spend ${TimeSpan.fromHours(5).toStringShort()} of Stored Time to unlock Flux`;
    },
    fluxIncrementDisp() {
      return `Spend ${TimeSpan.fromHours(5).toStringShort()} of Stored Time to increase
        the maximum Flux Level to ${format(Math.ceil(this.maxFlux * 1.1))}.`;
    },
    oneMinuteFlux() {
      return `Pour ${TimeSpan.fromMinutes(1).toStringShort()} of Stored Time into Flux`;
    },
    tenMinutesFlux() {
      return `Pour ${TimeSpan.fromMinutes(10).toStringShort()} of Stored Time into Flux`;
    },
    oneHourFlux() {
      return `Pour ${TimeSpan.fromHours(1).toStringShort()} of Stored Time into Flux`;
    },
    fiveHoursFlux() {
      return `Pour ${TimeSpan.fromHours(5).toStringShort()} of Stored Time into Flux`;
    },
    allFlux() {
      return `Pour all Stored Time into Flux`;
    },
    classObj1() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.storedTime < 60
      };
    },
    classObj2() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.storedTime < 600
      };
    },
    classObj3() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.storedTime < 3600
      };
    },
    classObj4() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.storedTime < 18000
      };
    },
    classObj5() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.storedTime <= 0
      };
    },
    classObj6() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.fluxLevel <= 1
      };
    },
    classObj7() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.fluxLevel >= this.maxFlux
      };
    },
    classObj8() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.fluxLevel <= 10
      };
    },
    classObj9() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.fluxLevel >= this.maxFlux - 9
      };
    },
    classObj10() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.fluxLevel <= 100
      };
    },
    classObj11() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": this.fluxLevel >= this.maxFlux - 99
      };
    },
  },
  methods: {
    update() {
      this.storedTime = Slabdrill.isCursed ? 0 : player.storedTime;
      this.fluxUnlocked = player.flux.isUnlocked;
      this.fluxLevel = player.flux.level;
      this.fluxTime = player.flux.fluxTime;
      this.maxFlux = player.flux.maxUnlockedFlux;
    },
    spendOneMin() {
      if (this.storedTime >= 60) {
        player.storedTime -= 60;
        simulateTime(60);
      }
    },
    spendTenMins() {
      if (this.storedTime >= 600) {
        player.storedTime -= 600;
        simulateTime(600);
      }
    },
    spendOneHour() {
      if (this.storedTime >= 3600) {
        player.storedTime -= 3600;
        simulateTime(3600);
      }
    },
    spendFiveHours() {
      if (this.storedTime >= 18000) {
        player.storedTime -= 18000;
        simulateTime(18000);
      }
    },
    spendAll() {
      if (this.storedTime >= 0) {
        simulateTime(player.storedTime);
        player.storedTime = 0;
      }
    },
    unlockFlux() {
      if (this.storedTime >= 18000) {
        player.storedTime -= 18000;
        player.flux.isUnlocked = true;
      }
    },
    incrementMaxFlux() {
      if (this.storedTime >= 18000) {
        player.storedTime -= 18000;
        player.flux.maxUnlockedFlux = Math.ceil(player.flux.maxUnlockedFlux * 1.1);
      }
    },
    decreaseFlux() {
      player.flux.level = Math.max(player.flux.level - 1, 1);
    },
    increaseFlux() {
      player.flux.level = Math.min(player.flux.level + 1, player.flux.maxUnlockedFlux);
    },
    decreaseFlux10() {
      player.flux.level = Math.max(player.flux.level - 10, 1);
    },
    increaseFlux10() {
      player.flux.level = Math.min(player.flux.level + 10, player.flux.maxUnlockedFlux);
    },
    decreaseFlux100() {
      player.flux.level = Math.max(player.flux.level - 100, 1);
    },
    increaseFlux100() {
      player.flux.level = Math.min(player.flux.level + 100, player.flux.maxUnlockedFlux);
    },
    minimizeFlux() {
      player.flux.level = 1;
    },
    maximizeFlux() {
      player.flux.level = player.flux.maxUnlockedFlux;
    },
    fluxOneMin() {
      if (player.flux.level === 1) return;
      if (this.storedTime >= 60) {
        player.storedTime -= 60;
        player.flux.fluxTime += 60;
      }
    },
    fluxTenMins() {
      if (player.flux.level === 1) return;
      if (this.storedTime >= 600) {
        player.storedTime -= 600;
        player.flux.fluxTime += 600;
      }
    },
    fluxOneHour() {
      if (player.flux.level === 1) return;
      if (this.storedTime >= 3600) {
        player.storedTime -= 3600;
        player.flux.fluxTime += 3600;
      }
    },
    fluxFiveHours() {
      if (player.flux.level === 1) return;
      if (this.storedTime >= 18000) {
        player.storedTime -= 18000;
        player.flux.fluxTime += 18000;
      }
    },
    fluxAll() {
      if (player.flux.level === 1) return;
      if (this.storedTime >= 0) {
        player.flux.fluxTime += player.storedTime;
        player.storedTime = 0;
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="normal-text">
      <br>
      <span>You have </span><span class="special-text">{{ timeDisplay }}</span><span> of Stored Time.</span>
    </div>
    <div class="c-subtab-option-container">
      <PrimaryButton
        :class="classObj1"
        @click="spendOneMin"
      >
        {{ oneMinuteDisp }}
      </PrimaryButton>
      <PrimaryButton
        :class="classObj2"
        @click="spendTenMins"
      >
        {{ tenMinutesDisp }}
      </PrimaryButton>
      <PrimaryButton
        :class="classObj3"
        @click="spendOneHour"
      >
        {{ oneHourDisp }}
      </PrimaryButton>
      <PrimaryButton
        :class="classObj4"
        @click="spendFiveHours"
      >
        {{ fiveHoursDisp }}
      </PrimaryButton>
      <PrimaryButton
        :class="classObj5"
        @click="spendAll"
      >
        {{ allDisp }}
      </PrimaryButton>
    </div>
    <br>
    <br>
    <div v-if="!fluxUnlocked">
      <PrimaryButton
        :class="classObj4"
        @click="unlockFlux"
      >
        {{ fluxUnlockDisp }}
      </PrimaryButton>
    </div>
    <div v-if="fluxUnlocked">
      <PrimaryButton
        :class="classObj4"
        @click="incrementMaxFlux"
      >
        {{ fluxIncrementDisp }}
      </PrimaryButton>
    </div>
    <br>
    <br>
    <div
      v-if="fluxUnlocked"
      class="normal-text"
    >
      <span>Your current Flux level is </span><span class="special-text">{{ fluxLevel }}</span><span>.</span>
      <br>
      <span>You have </span><span class="special-text">{{ fluxTimeDisplay }}</span><span> of Flux Time.</span>
      <br>
      <span v-if="fluxLevel === 1">
        You cannot spend Flux Time at Flux level {{ formatInt(1) }}.
      </span>
      <span v-if="fluxLevel !== 1">
        Flux will consume
        <span class="special-text">{{ format(fluxLevel - 1) }}</span>
        {{ pluralize("second", fluxLevel - 1) }} of Flux Time per real second to provide a
        <span class="special-text">{{ formatX(fluxLevel) }}</span>
        multiplier to real time.
      </span>
      <br>
      <br>
      <div class="c-subtab-option-container">
        <PrimaryButton
          :class="classObj6"
          @click="minimizeFlux"
        >
          Minimize Flux Level
        </PrimaryButton>
        <PrimaryButton
          v-if="maxFlux > 200"
          :class="classObj10"
          @click="decreaseFlux100"
        >
          Decrease Flux Level by {{ formatInt(100) }}
        </PrimaryButton>
        <PrimaryButton
          v-if="maxFlux > 20"
          :class="classObj8"
          @click="decreaseFlux10"
        >
          Decrease Flux Level by {{ formatInt(10) }}
        </PrimaryButton>
        <PrimaryButton
          :class="classObj6"
          @click="decreaseFlux"
        >
          Decrease Flux Level
        </PrimaryButton>
        <PrimaryButton
          :class="classObj7"
          @click="increaseFlux"
        >
          Increase Flux Level
        </PrimaryButton>
        <PrimaryButton
          v-if="maxFlux > 20"
          :class="classObj9"
          @click="increaseFlux10"
        >
          Increase Flux Level by {{ formatInt(10) }}
        </PrimaryButton>
        <PrimaryButton
          v-if="maxFlux > 200"
          :class="classObj11"
          @click="increaseFlux100"
        >
          Increase Flux Level by {{ formatInt(100) }}
        </PrimaryButton>
        <PrimaryButton
          :class="classObj7"
          @click="maximizeFlux"
        >
          Maximize Flux Level
        </PrimaryButton>
      </div>
      <br>
      <br>
      <div class="c-subtab-option-container">
        <PrimaryButton
          :class="classObj1"
          @click="fluxOneMin"
        >
          {{ oneMinuteFlux }}
        </PrimaryButton>
        <PrimaryButton
          :class="classObj2"
          @click="fluxTenMins"
        >
          {{ tenMinutesFlux }}
        </PrimaryButton>
        <PrimaryButton
          :class="classObj3"
          @click="fluxOneHour"
        >
          {{ oneHourFlux }}
        </PrimaryButton>
        <PrimaryButton
          :class="classObj4"
          @click="fluxFiveHours"
        >
          {{ fiveHoursFlux }}
        </PrimaryButton>
        <PrimaryButton
          :class="classObj5"
          @click="fluxAll"
        >
          {{ allFlux }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.normal-text {
  font-size: 1rem;
  color: #ffffff;
}

.special-text {
  font-size: 2.5rem;
  color: var(--color-dilation);
}
</style>
