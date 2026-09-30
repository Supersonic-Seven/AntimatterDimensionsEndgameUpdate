<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import EndgameMasterySaveLoadButton from "./EndgameMasterySaveLoadButton";
import EndgameSkillBuyButton from "./EndgameSkillBuyButton";

export default {
  name: "EndgameSkillShop",
  components: {
    PrimaryToggleButton,
    EndgameSkillBuyButton,
    EndgameMasterySaveLoadButton
  },
  data() {
    return {
      skillAmount: new Decimal(0),
      skillGeneration: new Decimal(0),
      totalEndgameSkills: new Decimal(0),
      shopMinimized: false,
      minimizeAvailable: false,
      budget: {
        gg: new Decimal(0),
        cp: new Decimal(0),
        dp: new Decimal(0)
      },
      costs: {
        gg: new Decimal(0),
        cp: new Decimal(0),
        dp: new Decimal(0)
      },
      hasESGen: false,
      showESGen: false,
      invertESgenDisplay: false,
    };
  },
  computed: {
    minimized() {
      return this.minimizeAvailable && this.shopMinimized;
    },
    formatEndgameSkillType() {
      if (this.skillAmount.gte(1e6)) {
        return format;
      }
      return formatInt;
    },
    ESgenRateText() {
      if (this.skillGeneration.lt(1 / 3600)) {
        return `one ES every ${TimeSpan.fromSeconds(
          this.skillGeneration.reciprocal()).toStringShort(false)}`;
      }
      if (this.skillGeneration.lt(0.1)) {
        return `${format(this.skillGeneration.times(3600), 2, 2)} ES/hour`;
      }
      return `${format(this.skillGeneration, 2, 2)} ES/sec`;
    },
    totalEndgameSkillText() {
      return `${quantify("total Endgame Skill", this.totalEndgameSkills, 2, 2, this.formatEndgameSkillType)}`;
    },
    minimizeArrowStyle() {
      return {
        transform: this.minimized ? "rotate(-180deg)" : "",
        transition: "all 0.25s ease-out"
      };
    },
    saveLoadText() {
      return this.$viewModel.shiftDown ? "Save:" : "Load:";
    },
    shopBottomRowHeightStyle() {
      return {
        height: this.hasTTAutobuyer ? "6.7rem" : "4.4rem",
      };
    }
  },
  watch: {
    invertESgenDisplay(newValue) {
      player.options.invertESgenDisplay = newValue;
    },
  },
  methods: {
    minimize() {
      player.endgameMasteries.shopMinimized = !player.endgameMasteries.shopMinimized;
    },
    formatGG(gg) {
      return `${format(gg, 2, 0)} Galaxies`;
    },
    buyWithGG() {
      EndgameSkills.buyOne(false, "gg");
    },
    formatCP(cp) {
      return `${format(cp, 2, 0)} CP`;
    },
    buyWithCP() {
      EndgameSkills.buyOne(false, "cp");
    },
    formatDP(dp) {
      return `${format(dp, 2, 0)} DP`;
    },
    buyWithDP() {
      EndgameSkills.buyOne(false, "dp");
    },
    buyMaxSkills() {
      EndgameSkills.buyMax(false);
    },
    update() {
      this.skillAmount.copyFrom(Currency.endgameSkills);
      this.skillGeneration.copyFrom(getESPerSecond());
      this.totalEndgameSkills.copyFrom(Currency.endgameSkills.max);
      this.shopMinimized = player.endgameMasteries.shopMinimized;
      this.minimizeAvailable = Currency.doomedParticles.gte(1e100);
      const budget = this.budget;
      budget.gg.copyFrom(EndgameSkillPurchaseType.gg.currency);
      budget.cp.copyFrom(EndgameSkillPurchaseType.cp.currency);
      budget.dp.copyFrom(EndgameSkillPurchaseType.dp.currency);
      const costs = this.costs;
      costs.gg.copyFrom(EndgameSkillPurchaseType.gg.cost);
      costs.cp.copyFrom(EndgameSkillPurchaseType.cp.cost);
      costs.dp.copyFrom(EndgameSkillPurchaseType.dp.cost);
      this.hasESGen = this.skillGeneration.gt(0);
      this.showESGen = this.hasESGen && (ui.view.shiftDown === this.invertESgenDisplay);
      this.invertESgenDisplay = player.options.invertESgenDisplay;
    },
    toggleESgen() {
      this.invertESgenDisplay = !this.invertESgenDisplay;
    }
  },
};
</script>

<template>
  <div class="endgame-skill-buttons">
    <div class="esshop-container esshop-background">
      <div
        data-role="page"
        class="esbuttons-row esbuttons-top-row"
      >
        <button
          class="l-es-save-load-btn c-es-buy-button c-es-buy-button--unlocked"
          onClick="Modal.preferredMasteryTree.show()"
        >
          <i class="fas fa-cog" />
        </button>
        <p class="endgameskills">
          <span class="c-es-amount">
            {{ quantify("Endgame Skill", skillAmount, 2, 0, formatEndgameSkillType) }}
          </span>
        </p>
        <div class="l-load-tree-area">
          <div class="l-tree-load-button-wrapper">
            <span class="c-esshop__save-load-text">{{ saveLoadText }}</span>
            <EndgameMasterySaveLoadButton
              v-for="saveslot in 6"
              :key="saveslot"
              :saveslot="saveslot"
            />
          </div>
          <div class="es-gen-container">
            <span
              v-if="hasESGen"
              class="checkbox-margin"
              ach-tooltip="This shows ES generation by default and total ES if you hold shift.
                Check this box to swap this behavior."
            >
              <input
                v-model="invertESgenDisplay"
                type="checkbox"
                :value="invertESgenDisplay"
                class="o-clickable"
                @input="toggleESgen()"
              >
            </span>
            <span v-if="showESGen">
              You are gaining {{ ESgenRateText }}.
            </span>
            <span v-else>
              You have {{ totalEndgameSkillText }}.
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="!minimized"
        class="esbuttons-row"
        :style="shopBottomRowHeightStyle"
      >
        <EndgameSkillBuyButton
          :budget="budget.gg"
          :cost="costs.gg"
          :format-cost="formatGG"
          :action="buyWithGG"
        />
        <EndgameSkillBuyButton
          :budget="budget.cp"
          :cost="costs.cp"
          :format-cost="formatCP"
          :action="buyWithCP"
        />
        <EndgameSkillBuyButton
          :budget="budget.dp"
          :cost="costs.dp"
          :format-cost="formatDP"
          :action="buyWithDP"
        />
        <div class="l-es-buy-max-vbox">
          <button
            v-if="!minimized"
            class="o-es-top-row-button c-es-buy-button c-es-buy-button--unlocked"
            @click="buyMaxSkills"
          >
            Buy max
          </button>
        </div>
      </div>
      <div
        v-else
        class="esbuttons-row esbuttons-bottom-row-hide"
      />
    </div>
    <button
      v-if="minimizeAvailable"
      class="esshop-minimize-btn esshop-background"
      @click="minimize"
    >
      <span
        class="minimize-arrow"
        :style="minimizeArrowStyle"
      >▼</span>
    </button>
  </div>
</template>

<style scoped>
.l-load-tree-area {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: left;
}

.l-tree-load-button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.esbuttons-bottom-row-hide {
  height: 0;
}

.es-gen-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.checkbox-margin {
  margin: 0 0.4rem;
}
</style>
