<script>
import CostDisplay from "@/components/CostDisplay";
import CustomizeableTooltip from "@/components/CustomizeableTooltip";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "CompressionUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    CustomizeableTooltip
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    isRebuyable: {
      type: Boolean,
      required: false,
      default: false
    },
    showTooltip: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      isCapped: false,
      isAffordable: false,
      boughtAmount: 0,
      currentTR: new Decimal(0),
      currentTRGain: new Decimal(0),
      timeEstimate: "",
      isHovering: false,
      hideEstimate: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-compression-upgrade": true,
        "o-compression-upgrade--rebuyable": this.isRebuyable,
        "o-compression-upgrade--available": !this.isBought && !this.isCapped && this.isAffordable,
        "o-compression-upgrade--unavailable": !this.isBought && !this.isCapped && !this.isAffordable,
        "o-compression-upgrade--bought": this.isBought,
        "o-compression-upgrade--capped": this.isCapped,
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.currentTR.copyFrom(Currency.thermalRadiation.value);
      this.currentTRGain.copyFrom(getThermalRadiationGainPerSecond());
      this.hideEstimate = this.isAffordable || this.isCapped || this.upgrade.isBought;
      this.timeEstimate = this.hideEstimate ? null : getThermalRadiationTimeEstimate(this.upgrade.cost);
      if (this.isRebuyable) {
        this.isAffordable = upgrade.isAffordable;
        this.isCapped = upgrade.isCapped;
        this.boughtAmount = upgrade.boughtAmount;
        return;
      }
      this.isBought = upgrade.isBought;
      if (!this.isBought) {
        this.isAffordable = upgrade.isAffordable;
      }
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :ach-tooltip="timeEstimate"
      :class="classObject"
      @click="upgrade.purchase()"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <CustomizeableTooltip
        v-if="timeEstimate"
        :show="showTooltip && !isHovering && !hideEstimate"
        left="50%"
        top="0"
      >
        <template #tooltipContent>
          {{ timeEstimate }}
        </template>
      </CustomizeableTooltip>
      <span>
        <DescriptionDisplay
          :config="upgrade.config"
          :length="70"
          name="o-compression-upgrade__description"
        />
        <EffectDisplay
          :key="boughtAmount"
          br
          :config="upgrade.config"
        />
      </span>
      <CostDisplay
        v-if="!isBought && !isCapped"
        br
        :config="upgrade.config"
        name="Thermal Radiation"
      />
    </button>
  </div>
</template>

<style scoped>
.o-compression-upgrade {
  width: 19rem;
  height: 9rem;
  font-family: Typewriter, serif;
  font-size: 1rem;
  font-weight: bold;
  background: black;
  border: 0.1rem solid;
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
}

.o-compression-upgrade--available {
  color: #64ddad;
  border-color: #64ddad;
  animation: a-compression-btn-glow 10s infinite;
  cursor: pointer;
}

.o-compression-upgrade--rebuyable.o-compression-upgrade--available {
  color: blue;
  border-color: blue;
}

.o-compression-upgrade--available:hover {
  background-color: white;
}

.o-compression-upgrade--bought,
.o-compression-upgrade--capped {
  color: black;
  background-color: #64ddad;
  border-color: black;
}

.o-compression-upgrade--unavailable {
  color: #181818;
  background-color: #5f5f5f;
  border-color: #3e8a0f;
}

.o-compression-upgrade--rebuyable.o-compression-upgrade--unavailable {
  border-color: blue;
}

.o-compression-upgrade--unavailable:hover {
  color: #1d1d1d;
  background-color: #660000;
}

.o-compression-upgrade__description--small-text {
  font-size: 0.95rem;
}

.s-base--metro .o-compression-upgrade--unavailable,
.t-s1 .o-compression-upgrade--unavailable {
  color: black;
  background-color: #9e9e9e;
  border: none;
  box-shadow: 0.1rem 0.1rem 0.1rem 0 black;
}

.s-base--metro .o-compression-upgrade--unavailable:hover {
  background-color: #ef5350;
}

.t-s1 .o-compression-upgrade--unavailable:hover {
  background-color: #d72621;
}

.t-dark .o-compression-upgrade--available:hover,
.t-s6 .o-compression-upgrade--available:hover,
.t-s10 .o-compression-upgrade--available:hover {
  color: #64ddad;
  background-color: white;
}

.t-dark .o-compression-upgrade--rebuyable.o-dilation-upgrade--available:hover,
.t-s6 .o-compression-upgrade--rebuyable.o-dilation-upgrade--available:hover,
.t-s10 .o-compression-upgrade--rebuyable.o-dilation-upgrade--available:hover {
  color: blue;
}

.t-dark .o-compression-upgrade--bought,
.t-dark .o-compression-upgrade--capped {
  background-color: #64ddad;
}

.t-s6 .o-compression-upgrade--unavailable,
.t-s10 .o-compression-upgrade--unavailable {
  color: gray;
  background-color: black;
}

.t-dark .o-compression-upgrade--unavailable {
  color: black;
  background-color: #23292a;
}

.t-dark .o-compression-upgrade--unavailable:hover,
.t-s6 .o-compression-upgrade--unavailable:hover,
.t-s10 .o-compression-upgrade--unavailable:hover {
  color: black;
  background-color: var(--color-bad);
  border-color: var(--color-bad);
}

.t-s4 .o-compression-upgrade--available {
  animation: a-compression-btn-glow--cancer 10s infinite;
}

.t-s6 .o-compression-upgrade--bought,
.t-s6 .o-compression-upgrade--capped,
.t-s10 .o-compression-upgrade--bought,
.t-s10 .o-compression-upgrade--capped {
  background: #64ddad;
}
</style>
