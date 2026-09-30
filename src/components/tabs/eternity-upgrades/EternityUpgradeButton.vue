<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "EternityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chargePossible: false,
      canBeCharged: false,
      isBought: false,
      isAffordable: false,
      isCharged: false,
      showingCharged: false,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    showChargedEffect() {
      return this.chargePossible && (this.isCharged || this.showingCharged || this.shiftDown);
    },
    config() {
      const config = this.upgrade.config;
      return this.showChargedEffect
        ? config.charged
        : config;
    },
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--bought": this.isBought && !this.charged &&
          !(this.chargePossible && (this.showingCharged || this.shiftDown)),
        "o-eternity-upgrade--available": !this.isBought && this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isBought && !this.isAffordable,
        "o-eternity-upgrade--chargeable": !this.isCharged && this.chargePossible &&
          (this.showingCharged || this.shiftDown),
        "o-eternity-upgrade--charged": this.isCharged
      };
    },
    hasEU2() {
      return Perk.autounlockEU2.canBeApplied && !player.disablePostReality;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.chargePossible = Ascensions.oc2A.isUnlocked && upgrade.hasChargeEffect;
      this.isAffordable = upgrade.isAffordable;
      this.canBeCharged = upgrade.canCharge;
      this.isCharged = upgrade.isCharged;
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @mouseenter="showingCharged = canBeCharged"
    @mouseleave="showingCharged = false"
    @click="upgrade.purchase()"
  >
    <DescriptionDisplay :config="config" />
    <EffectDisplay
      br
      :config="config"
    />
    <div v-if="!isBought && hasEU2">
      Auto: {{ format(config.cost / 1e10) }} Eternity Points
    </div>
    <CostDisplay
      v-else-if="!isBought"
      br
      :config="config"
      name="Eternity Point"
    />
  </button>
</template>

<style scoped>

</style>
