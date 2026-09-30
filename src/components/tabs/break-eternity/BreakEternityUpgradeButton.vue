<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";

export default {
  name: "BreakEternityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      isAffordable: false,
      isAvailable: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-break-eternity-upgrade": true,
        "o-break-eternity-upgrade--bought": this.isBought,
        "o-break-eternity-upgrade--available": !this.isBought && this.isAffordable && this.isAvailable,
        "o-break-eternity-upgrade--unavailable": !this.isBought && !this.isAffordable || !this.isBought && !this.isAvailable
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.isAffordable = upgrade.isAffordable && upgrade.isAvailable;
      this.isAvailable = upgrade.isAvailable;
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      v-if="isAvailable"
      :class="classObject"
      class="l-break-eternity-upgrade-btn"
      @click="upgrade.purchase()"
    >
      <HintText
        type="breakEternityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ upgrade.name }}
      </HintText>
      <DescriptionDisplay :config="upgrade.config" />
      <EffectDisplay :config="upgrade.config" />
      <CostDisplay
        v-if="!isBought"
        :config="upgrade.config"
        name="Antimatter"
      />
    </button>
    <button
      v-else
      :class="classObject"
      class="l-break-eternity-upgrade-btn"
    >
      <HintText
        type="breakEternityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ upgrade.name }}
      </HintText>
      <DescriptionDisplay :config="upgrade.config" />
      <EffectDisplay :config="upgrade.config" />
      <CostDisplay
        v-if="!isBought"
        :config="upgrade.config"
        name="Antimatter"
      />
    </button>
  </div>
</template>

<style scoped>

</style>
