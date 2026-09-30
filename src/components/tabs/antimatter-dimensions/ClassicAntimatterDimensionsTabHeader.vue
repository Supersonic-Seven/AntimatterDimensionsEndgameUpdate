<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicAntimatterDimensionsTabHeader",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      currentPower: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      nextPower: new Decimal(0),
      disabledCondition: "",
      isFlipped: false
    };
  },
  computed: {
    sacText() {
      if (Ascensions.sacA.isUnlocked) return `Dimensional Sacrifice (+${formatPow(this.sacrificeBoost, 2, 3)})`;
      return `Dimensional Sacrifice (${formatX(this.sacrificeBoost, 2, 2)})`;
    },
    sacrificeTooltip() {
      return `Boosts 8th ${this.isFlipped ? "Matter" : "Antimatter"} Dimension by +${formatPow(this.nextPower, 2, 3)}`;
      return `Boosts 8th ${this.isFlipped ? "Matter" : "Antimatter"} Dimension by ${formatX(this.sacrificeBoost, 2, 2)}`;
    },
  },
  methods: {
    update() {
      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.currentPower.copyFrom(Sacrifice.totalPower);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.nextPower.copyFrom(Sacrifice.nextPower);
      this.disabledCondition = Sacrifice.disabledCondition;
      this.isFlipped = player.universes.current === 2;
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    maxAll() {
      maxAll();
    }
  }
};
</script>

<template>
  <div class="l-antimatter-dim-tab__header">
    <PrimaryButton
      v-show="isSacrificeUnlocked"
      v-tooltip="sacrificeTooltip"
      :enabled="isSacrificeAffordable"
      class="o-primary-btn--sacrifice"
      @click="sacrifice"
    >
      <span v-if="isSacrificeAffordable">
        {{ sacText }}
      </span>
      <span v-else>
        Dimensional Sacrifice Disabled ({{ disabledCondition }})
      </span>
    </PrimaryButton>
    <PrimaryButton
      class="o-primary-btn--buy-max"
      @click="maxAll"
    >
      Max all (M)
    </PrimaryButton>
  </div>
</template>
