<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";

export default {
  name: "ModernAntimatterDimensionRow",
  components: {
    GenericDimensionRowText
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: new Decimal(0),
      boughtBefore10: 0,
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      buyUntil10: true,
      howManyCanBuy: 0,
      isContinuumActive: false,
      continuumValue: new Decimal(0),
      isShown: false,
      isCostsAD: false,
      amountDisplay: "",
      hasTutorial: false,
      canSeeNine: false,
      isCursedCore: false,
      isFlipped: false
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return `${AntimatterDimension(this.tier).shortDisplayName} ${this.isFlipped ? "Matter" : "Antimatter"} Dimension`;
    },
    costDisplay() {
      return this.buyUntil10 ? format(this.until10Cost) : format(this.singleCost);
    },
    continuumString() {
      return formatHybridFloat(this.continuumValue, 2);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      if (this.tier === 9 && this.isCapped) return `You cannot hold more than ${format(1)} 9th
        ${this.isFlipped ? "Matter" : "Antimatter"} Dimension at this time`;
      if (this.isCapped) return `Nameless prevents the purchase of more than ${format(1)} 8th
        ${this.isFlipped ? "Matter" : "Antimatter"} Dimension`;
      if (this.isContinuumActive && this.tier !== 9) return `Continuum produces all your
        ${this.isFlipped ? "Matter" : "Antimatter"} Dimensions`;
      return `Purchased ${quantifyHybridLarge("time", this.bought)}`;
    },
    costUnit() {
      return `${AntimatterDimension(this.tier - 2).shortDisplayName} ${this.isFlipped ? "MD" : "AD"}`;
    },
    buttonPrefix() {
      if (!this.isUnlocked) return "Locked";
      if (this.tier === 9 && this.isCapped) return "Universal Limitations Reached";
      if (this.isCapped) return "Shattered by Nameless";
      if (this.isContinuumActive && this.tier !== 9) return "Continuum: ";
      return `Buy ${formatInt(this.howManyCanBuy)}`;
    },
    buttonValue() {
      if (this.isCapped) return "";
      if (this.isContinuumActive && this.tier !== 9) return this.continuumString;
      const prefix = this.showCostTitle(this.buyUntil10 ? this.until10Cost : this.singleCost) ? "Cost: " : "";
      const suffix = this.isCostsAD ? this.costUnit : (this.isFlipped ? "M" : "AM");
      return `${prefix}${this.costDisplay} ${suffix}`;
    },
    hasLongText() {
      return this.buttonValue.length > 20;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      this.canSeeNine = player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed;
      this.isFlipped = player.universes.current === 2;
      if (!this.canSeeNine && ((tier > DimBoost.maxDimensionsUnlockable && !this.isDoomed) || tier === 9)) return;
      const dimension = AntimatterDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      const buyUntil10 = player.buyUntil10;
      this.isCapped = (tier === 8 && Enslaved.isRunning && dimension.bought.gte(1)) ||
        (tier === 9 && true && Slabdrill.isDestroyed && dimension.bought.gte(1));
      this.multiplier.copyFrom(AntimatterDimension(tier).multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.howManyCanBuy = (this.tier === 9 && true && Slabdrill.isDestroyed) ? Math.min(dimension.howManyCanBuy, 1) :
        (buyUntil10 ? dimension.howManyCanBuy : Math.min(dimension.howManyCanBuy, 1));
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(this.tier === 9 ? dimension.cost.pow(Math.max(dimension.howManyCanBuy, 1)) :
        dimension.cost.times(Math.max(dimension.howManyCanBuy, 1)));
      if (tier < ((player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed) ? 9 : 8)) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.buyUntil10 = buyUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue.copyFrom(dimension.continuumValue);
      this.isShown = (tier === 9 ? (player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed) :
        ((DimBoost.totalBoosts.gt(0) && DimBoost.totalBoosts.plus(3).toNumber() >= tier) || PlayerProgress.infinityUnlocked()));
      this.isCostsAD = NormalChallenge(6).isRunning && tier > 2 && (!this.isContinuumActive || this.tier === 9);
      this.amountDisplay = (this.tier < ((player.celestials.slabdrill.goodbyeTick >= 40000 || Slabdrill.isDestroyed) ? 9 : 8)) &&
        !Slabdrill.isCursed ? format(this.amount, 2) : formatHybridLarge(this.amount, 3);
      this.hasTutorial = (tier === 1 && Tutorial.isActive(TUTORIAL_STATE.DIM1)) ||
        (tier === 2 && Tutorial.isActive(TUTORIAL_STATE.DIM2));
      this.isCursedCore = player.celestials.slabdrill.core.isActive;
    },
    buy() {
      if (this.isContinuumActive && this.tier !== 9) return;
      if (this.howManyCanBuy === 1) {
        buyOneDimension(this.tier);
      } else {
        buyAsManyAsYouCanBuy(this.tier);
      }
    },
    showCostTitle(value) {
      return value.log10().lt(1000000);
    },
    buttonClass() {
      return {
        "o-primary-btn o-primary-btn--new": true,
        "o-primary-btn--disabled": (!this.isAffordable && (!this.isContinuumActive || this.tier === 9))
          || !this.isUnlocked || this.isCapped,
        "o-non-clickable o-continuum": this.isContinuumActive && this.tier !== 9
      };
    },
    buttonTextClass() {
      return {
        "button-content l-modern-buy-ad-text": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-antimatter-dim c-antimatter-dim-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked, 'l-dimension-single-row': !isCursedCore, 'l-cursed-style': isCursedCore }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount-text="amountDisplay"
      :rate="rateOfChange"
    />
    <div
      v-if="!isCursedCore"
      class="l-dim-row-multi-button-container c-modern-dim-tooltip-container"
    >
      <div class="c-modern-dim-purchase-count-tooltip">
        {{ boughtTooltip }}
      </div>
      <button
        :class="buttonClass()"
        @click="buy"
      >
        <div :class="buttonTextClass()">
          <div>
            {{ buttonPrefix }}
          </div>
          <div :class="{ 'l-dim-row-small-text': hasLongText }">
            {{ buttonValue }}
          </div>
          <div
            v-if="hasTutorial"
            class="fas fa-circle-exclamation l-notification-icon"
          />
        </div>
        <div
          v-if="(!isContinuumActive || tier === 9) && isUnlocked && !isCapped"
          class="fill"
        >
          <div
            class="fill-purchased"
            :style="{ 'width': boughtBefore10*10 + '%' }"
          />
          <div
            class="fill-possible"
            :style="{ 'width': howManyCanBuy*10 + '%' }"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.l-modern-buy-ad-text {
  display: flex;
  flex-direction: column;
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

.l-cursed-style {
  display: flex;
  height: 5.5rem;
}
</style>
