<script>
export default {
  name: "ModernDimensionBoostRow",
  data() {
    return {
      requirement: {
        tier: 1,
        amount: new Decimal(0)
      },
      isBuyable: false,
      purchasedBoosts: new Decimal(0),
      imaginaryBoosts: new Decimal(0),
      lockText: null,
      unlockedByBoost: null,
      creditsClosed: false,
      requirementText: null,
      hasTutorial: false,
      hasSurge: false,
      isFlipped: false
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    dimName() {
      return AntimatterDimension(this.requirement.tier).shortDisplayName;
    },
    boostCountText() {
      if (this.requirementText) return this.requirementText;
      const parts = [this.purchasedBoosts];
      if (this.imaginaryBoosts.neq(0) && !Ascensions.dbA.isUnlocked) {
        parts.push(this.imaginaryBoosts);
      }
      const sum = parts.map(formatDimboostParts).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${formatHybridLarge(parts.decimalSum(), 3)}`;
      }
      return sum;
    },
    classObject() {
      return {
        "o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset": true,
        "tutorial--glow": this.isBuyable && this.hasTutorial,
        "o-primary-btn--disabled": !this.isBuyable,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    },
    dimBoostName() {
      if (this.hasSurge) return "Dimension Surge";
      return "Dimension Boost";
    },
    imaginaryText() {
      return `(${formatHybridLarge(this.imaginaryBoosts, 3)} free Dimension Boosts, which do not provide a power effect)`;
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount.copyFrom(requirement.amount);
      this.isBuyable = requirement.isSatisfied && DimBoost.canBeBought;
      this.purchasedBoosts.copyFrom(DimBoost.purchasedBoosts);
      this.imaginaryBoosts.copyFrom(DimBoost.imaginaryBoosts);
      this.lockText = DimBoost.lockText;
      this.unlockedByBoost = DimBoost.unlockedByBoost;
      this.creditsClosed = GameEnd.creditsEverClosed;
      if (this.isDoomed) this.requirementText = formatHybridLarge(this.purchasedBoosts, 3);
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.DIMBOOST);
      this.hasSurge = Ascensions.dbA.isUnlocked;
      this.isFlipped = player.universes.current === 2;
    },
    dimensionBoost(bulk) {
      if (!DimBoost.requirement.isSatisfied || !DimBoost.canBeBought) return;
      manualRequestDimensionBoost(bulk);
    }
  }
};
</script>

<template>
  <div class="reset-container dimboost">
    <h4>{{ dimBoostName }} ({{ boostCountText }})</h4>
    <span>Requires: {{ formatHybridLarge(requirement.amount, 3) }} {{ dimName }} {{ isFlipped ? "Matter" : "Antimatter" }} D</span>
    <span v-if="hasSurge">{{ imaginaryText }}</span>
    <button
      :class="classObject"
      @click.exact="dimensionBoost(true)"
      @click.shift.exact="dimensionBoost(false)"
    >
      {{ unlockedByBoost }}
      <div
        v-if="hasTutorial"
        class="fas fa-circle-exclamation l-notification-icon"
      />
    </button>
  </div>
</template>
