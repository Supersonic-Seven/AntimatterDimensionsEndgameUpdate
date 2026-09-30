<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import SlabdrillStrike from "./SlabdrillStrike";

export default {
  name: "SlabdrillTab",
  components: {
    CelestialQuoteHistory,
    SlabdrillStrike
  },
  data() {
    return {
      stage: Math.random(),
      quote: "",
      isCursed: false,
      power: new Decimal(),
      powerPerSecond: new Decimal(),
      powerCap: new Decimal(),
      isDestroyed: false,
      isCoreActive: false,
      cores: 0,
      powers: []
    };
  },
  computed: {
    cursedCoreButtonText() {
      if (this.isCoreActive) {
        return "Exit the Cursed Core.";
      }
      return "Enter the Cursed Core.";
    },
    cursedCoreClassObject() {
      return {
        "o-cursed-core-button": true,
        "o-cursed-core-button__running": this.isCoreActive
      };
    },
    unlocks() {
      return Slabdrill.isCursed ? SlabdrillUnlocks.all.filter(u => u.isUnlocked) : SlabdrillUnlocks.all;
    },
    rows() {
      return Math.ceil(this.unlocks.length / 3);
    },
    nextLayer() {
      return Slabdrill.nextLayer;
    },
    halveText() {
      return TimeSpan.fromSeconds(new Decimal(666)).toStringShort();
    },
    serpentinePowerRewardText() {
      let text = [];
      const effects = ["Antimatter Dimension multiplier", "Dimension Boost strength multiplier", "Galaxy strength multiplier",
        "Antimatter Dimension power", "Infinity Point multiplier", "Infinity Dimension multiplier", "Replicanti Speed multiplier",
        "Time Dimension multiplier", "Eternity Point multiplier", "Infinity multiplier", "Dilated Time multiplier",
        "Chaos Core find chance multiplier"];
      text.push("Serpentine Power currently provides the following effects:");
      for (let t = 0; t < Slabdrill.currentStage + 1; t++) {
        text.push(
          `${effects[t]}: ${t === 3
            ? formatPow(this.powers[t], 2, 3)
            : formatX(this.powers[t], 2, 2)}`
        );
      }
      return text;
    }
  },
  methods: {
    update() {
      this.stage = Slabdrill.currentStage;
      this.quote = Slabdrill.quote;
      this.isCursed = Slabdrill.isCursed;
      this.power.copyFrom(Slabdrill.power);
      this.powerPerSecond.copyFrom(Slabdrill.powerPerSecond(1000));
      this.powerCap.copyFrom(Slabdrill.powerCap);
      this.isDestroyed = Slabdrill.isDestroyed;
      this.isCoreActive = Slabdrill.coreActive;
      this.cores = Slabdrill.cores;
      let x = [];
      for (let s = 0; s < 12; s++) {
        x.push(Slabdrill.slabPowers[Object.keys(Slabdrill.slabPowers)[s]]());
      }
      this.powers = x;
    },
    toggleCore() {
      if (this.isCoreActive) {
        if (player.options.confirmations.cursedCore) return Modal.exitCursedCore.show();
        return Slabdrill.exitCore();
      }
      if (player.options.confirmations.cursedCore) return Modal.enterCursedCore.show();
      return Slabdrill.enterCore();
    },
    showModal() {
      Modal.slabdrillEffects.show();
    },
    getUnlock(row, column) {
      return () => this.unlocks[(row - 1) * 3 + column - 1];
    }
  }
};
</script>

<template>
  <div class="l-slabdrill-celestial-tab">
    <CelestialQuoteHistory celestial="slabdrill" />
    <div
      v-if="!isDestroyed"
      class="button-container"
    >
      <button
        class="o-slabdrill-button"
        @click="showModal"
      >
        Show effects in Cursed Reality
      </button>
    </div>
    <br>
    <span class="l-cursed-header">You have {{ quantifyInt("Chaos Core", cores) }}.</span>
    <br>
    <div v-if="isDestroyed">
      <span class="l-slabdrill-header">Since Slabdrill has been defeated, the following Strikes have no effect except for the last.</span>
      <br>
    </div>
    <span class="l-slabdrill-header">You have {{ format(power, 2, 3) }} Serpentine Power. +{{ format(powerPerSecond, 2, 3) }}/s</span>
    <span class="l-slabdrill-header">
      Your Chaos Cores are currently giving Serpentine Power a cap of {{ format(powerCap, 2, 2) }}.
    </span>
    <span class="l-slabdrill-header">
      The distance between your current Serpentine Power and the Serpentine Power cap decreases by half every {{ halveText }}.
    </span>
    <br>
    <div
      v-for="(reward, rewardKey) in serpentinePowerRewardText"
      :key="rewardKey + 100"
      class="l-slabdrill-header"
    >
      {{ reward }}
    </div>
    <br>
    <div
      v-for="row in rows"
      :key="row"
      class="l-slabdrill-unlocks__row"
    >
      <SlabdrillStrike
        v-for="column in 3"
        :key="row * 3 + column"
        :get-unlock="getUnlock(row, column)"
      />
    </div>
    <br>
    <span
      v-if="isCursed"
      class="l-slabdrill-header"
    >
      The next Strike will be encountered when you {{ nextLayer }}.
    </span>
    <br>
    <br>
    <button
      v-if="isCursed"
      :class="cursedCoreClassObject"
      @click="toggleCore"
    >
      {{ cursedCoreButtonText }}
    </button>
  </div>
</template>

<style scoped>
.l-slabdrill-celestial-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.l-slabdrill-header {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-slabdrill--base);
  margin: 1rem;
}

.l-cursed-header {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem;
  background: linear-gradient(#800000, var(--color-slabdrill--base));
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.l-slabdrill-unlocks__row {
  display: flex;
  flex-direction: row;
}

.o-slabdrill-button {
  font-family: Typewriter;
  color: var(--color-text);
  background: var(--color-text-inverted);
  border: 0.1rem solid var(--color-slabdrill--base);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1rem;
  padding: 1rem;
  transition-duration: 0.12s;
  cursor: pointer;
}

.o-slabdrill-button:hover {
  box-shadow: 0.1rem 0.1rem 0.3rem var(--color-slabdrill--base);
}

.o-cursed-core-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 30rem;
  height: 30rem;
  margin: 1rem 1rem;
  font-family: Typewriter, serif;
  font-size: 1.5rem;
  font-weight: bold;
  transition-duration: 0.2s;
  cursor: pointer;
  border: none;
  background-color: black;
  clip-path: polygon(10% 50%, 17% 35%, 7% 26%, 19% 32%, 25% 27%, 28% 31%, 35% 18%, 29% 21%, 17% 14%, 33% 2%, 42% 8%, 44% 15%,
    48% 3%, 55% 3%, 56% 0%, 58% 4%, 62% 21%, 65% 9%, 72% 20%, 75% 21%, 80% 25%, 85% 27%, 88% 36%, 81% 38%, 95% 41%, 100% 43%,
    99% 49%, 96% 51%, 100% 53%, 91% 56%, 94% 60%, 88% 65%, 74% 57%, 72% 65%, 75% 61%, 80% 75%, 71% 71%, 59% 75%, 69% 77%,
    64% 93%, 63% 91%, 61% 99%, 59% 100%, 56% 98%, 59% 89%, 54% 82%, 51% 96%, 47% 91%, 40% 89%, 39% 72%, 35% 80%, 31% 92%,
    24% 89%, 23% 95%, 20% 91%, 18% 96%, 14% 77%, 21% 76%, 13% 68%, 12% 71%, 9% 58%, 6% 67%, 4% 60%, 0% 59%, 6% 53%, 1% 51%);
  animation: a-cursed-core-text-cycle 10s infinite;
}

.o-cursed-core-button:hover {
  background-color: #400000;
  animation: a-cursed-core-text-cycle 10s infinite;
}

.o-cursed-core-button__running {
  animation: a-cursed-core__running-text-cycle 10s infinite;
}

@keyframes a-cursed-core-text-cycle {
  0% {
    color: #800000;
    box-shadow: inset 0 0 10rem red;
  }
  50% {
    color: #ff0000;
    box-shadow: inset 0 0 10rem var(--color-slabdrill--base);
  }
  100% {
    color: #800000;
    box-shadow: inset 0 0 10rem red;
  }
}

@keyframes a-cursed-core__running-text-cycle {
  0% {
    color: #800000;
    background-color: #200000;
    box-shadow: inset 0 0 10rem var(--color-slabdrill--base);
  }
  50% {
    color: var(--color-slabdrill--base);
    background-color: #400020;
    box-shadow: inset 0 0 10rem red;
  }
  100% {
    color: #800000;
    background-color: #200000;
    box-shadow: inset 0 0 10rem var(--color-slabdrill--base);
  }
}
</style>
