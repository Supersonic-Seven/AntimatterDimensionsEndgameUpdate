<script>
export default {
  name: "TickspeedRow",
  data() {
    return {
      purchasedTickspeed: new Decimal(0),
      freeTickspeed: new Decimal(0),
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      gameSpeedMult: new Decimal(1),
      galaxyCount: new Decimal(0),
      isContinuumActive: false,
      continuumValue: new Decimal(0),
      hasTutorial: false,
      hasRealityButton: false,
      isEC9: false,
      isTransient: false,
      isFlipped: false
    };
  },
  computed: {
    classObject() {
      return {
        "l-tickspeed-container": true,
        "l-tickspeed-container--hidden": !this.isVisible
      };
    },
    multiplierDisplay() {
      if (InfinityChallenge(3).isRunning) return `Multiply all ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions by
        ${formatX(this.galaxyCount.times(0.005).add(1.05), 3, 3)}`;
      const tickmult = this.mult;
      return `${formatX(tickmult.reciprocal(), 2, 3)} faster / upgrade.`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    continuumString() {
      return formatHybridFloat(this.continuumValue, 2);
    },
    upgradeCount() {
      const purchased = this.purchasedTickspeed;
      if (!this.freeTickspeed) return quantifyHybridLarge("Purchased Upgrade", purchased);
      if (purchased.eq(0) || this.isContinuumActive) return `${formatHybridLarge(this.freeTickspeed, 3)} Free Upgrades`;
      return `${formatHybridLarge(purchased, 3)} Purchased + ${formatHybridLarge(this.freeTickspeed, 3)} Free`;
    }
  },
  methods: {
    update() {
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.purchasedTickspeed.copyFrom(player.totalTickBought);
      this.freeTickspeed.copyFrom(FreeTickspeed.amount);
      this.isEC9 = EternityChallenge(9).isRunning;
      this.isTransient = player.universes.current === 1;
      this.isVisible = Tickspeed.isUnlocked || this.isEC9 || this.isTransient;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(Tickspeed.cost);
      this.isAffordable = Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable;
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.gameSpeedMult.copyFrom(getGameSpeedupForDisplay());
      this.galaxyCount.copyFrom(player.galaxies);
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue.copyFrom(Tickspeed.continuumValue);
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.TICKSPEED);
      this.isFlipped = player.universes.current === 2;
    },
    buttonClass() {
      return {
        "o-primary-btn": true,
        "tickspeed-btn": true,
        "o-primary-btn--disabled": !this.isAffordable && !this.isContinuumActive,
        "o-non-clickable o-continuum": this.isContinuumActive,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
  }
};
</script>

<template>
  <div :class="classObject">
    <div class="tickspeed-buttons">
      <button
        v-tooltip="upgradeCount"
        :class="buttonClass()"
        onclick="buyTickSpeed()"
      >
        <span v-if="isContinuumActive">
          Tickspeed Continuum: {{ continuumString }}
        </span>
        <span v-else-if="isEC9">
          Tickspeed Unpurchasable (EC 9)
        </span>
        <span v-else-if="isTransient">
          Tickspeed Does Not Exist (Transient Universe)
        </span>
        <span v-else>
          Tickspeed Cost: {{ format(cost) }}
        </span>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </button>
      <button
        v-if="!isContinuumActive"
        class="o-primary-btn tickspeed-max-btn"
        :class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }"
        onclick="buyMaxTickSpeed()"
      >
        Buy Max
      </button>
    </div>
    <div
      v-if="hasRealityButton"
      class="tickspeed-labels"
    >
      {{ tickspeedDisplay }} | {{ multiplierDisplay }}
    </div>
  </div>
</template>

<style scoped>
.o-primary-btn {
  position: relative;
  vertical-align: middle;
}

.tickspeed-btn {
  position: relative;
  width: 30rem;
  height: 2.5rem;
  padding: 0.25rem;
}

.tickspeed-labels {
  color: var(--color-text);
  padding: 0.25rem;
}

.l-tickspeed-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0.5rem;
}

.l-tickspeed-container--hidden {
  visibility: hidden;
}

.tickspeed-max-btn {
  margin-left: 0.5rem;
  width: 10rem;
  height: 2.5rem;
  padding: 0.25rem;
}

.o-non-clickable {
  cursor: auto;
}

.o-continuum {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--accent);
  background: var(--color-laitela--base);
}

.o-continuum:hover {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
}
</style>
