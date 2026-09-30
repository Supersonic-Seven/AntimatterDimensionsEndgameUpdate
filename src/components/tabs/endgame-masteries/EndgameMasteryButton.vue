<script>
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "EndgameMasteryButton",
  components: {
    CostDisplay
  },
  props: {
    setup: {
      type: Object,
      required: true
    },
    showCost: {
      type: Boolean,
      required: false,
      default: true
    },
    specialClick: {
      type: Function,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      isBought: false,
      isAvailableForPurchase: false,
    };
  },
  computed: {
    mastery() {
      return this.setup.mastery;
    },
    styleObject() {
      return {
        top: `${this.setup.top}rem`,
        left: `${this.setup.left}rem`
      };
    },
    classObject() {
      return {
        "o-endgame-mastery": true,
        "l-endgame-mastery": true,
        "o-endgame-mastery--small": this.setup.isSmall,
        "o-endgame-mastery--unavailable": !this.isAvailableForPurchase && !this.isBought,
        "o-endgame-mastery--available": this.isAvailableForPurchase && !this.isBought,
        "o-endgame-mastery--bought": this.isBought,
      };
    },
    pathClass() {
      switch (this.mastery.type) {
        case ENDGAME_MASTERY_TYPE.NORMAL:
          switch (this.setup.path) {
            case ENDGAME_MASTERY_PATH.ANTIMATTER_DIM_COMPRESSION: return "o-endgame-mastery-antimatter-dim-compression";
            case ENDGAME_MASTERY_PATH.INFINITY_DIM_COMPRESSION: return "o-endgame-mastery-infinity-dim-compression";
            case ENDGAME_MASTERY_PATH.TIME_DIM_COMPRESSION: return "o-endgame-mastery-time-dim-compression";
            case ENDGAME_MASTERY_PATH.CELESTIAL_DIM_COMPRESSION: return "o-endgame-mastery-celestial-dim-compression";
            case ENDGAME_MASTERY_PATH.INFINITY_POINTS: return "o-endgame-mastery-infinity-points";
            case ENDGAME_MASTERY_PATH.ETERNITY_POINTS: return "o-endgame-mastery-eternity-points";
            case ENDGAME_MASTERY_PATH.REALITY_MACHINES: return "o-endgame-mastery-reality-machines";
            case ENDGAME_MASTERY_PATH.IMAGINARY_MACHINES: return "o-endgame-mastery-imaginary-machines";
            case ENDGAME_MASTERY_PATH.ENDGAME_ENTANGLEMENT: return "o-endgame-mastery-endgame-entanglement";
            case ENDGAME_MASTERY_PATH.CELESTIAL_ENTANGLEMENT: return "o-endgame-mastery-celestial-entanglement";
            case ENDGAME_MASTERY_PATH.DIVINE_ENTANGLEMENT: return "o-endgame-mastery-divine-entanglement";
            default: return "o-endgame-mastery-normal";
          }
        case ENDGAME_MASTERY_TYPE.PERMANENT:
          if (this.mastery.id === 4) return "o-endgame-mastery-celestial-reality";
          else if (this.mastery.id === 3) return "o-endgame-mastery-time-compression";
          return "o-endgame-mastery-permanent";
      }
      return "";
    },
    masteryClass() {
      if (this.isUseless) return "";
      let pathClasses = "";
      if (!this.isAvailableForPurchase && !this.isBought) {
        pathClasses += `${this.pathClass}--unavailable`;
      }
      if (this.isAvailableForPurchase && !this.isBought) {
        pathClasses += `${this.pathClass}--available`;
      }
      if (this.isBought) {
        pathClasses += `${this.pathClass}--bought`;
      }
      return pathClasses;
    },
    config() {
      return { ...this.mastery.config, formatCost: value => (value >= 1e6 ? format(value) : formatInt(value)) };
    },
    showDefaultCostDisplay() {
      const showCostOverride = !EndgameMastery.permaMasteries.isBought || (this.mastery.id >= 180);
      const costCond = this.showCost && showCostOverride;
      return !this.setup.isSmall && costCond;
    },
    customCostStr() {
      const showCostOverride = !EndgameMastery.permaMasteries.isBought || (this.mastery.id >= 180);
      const esStr = this.setup.isSmall
        ? `${formatInt(this.config.cost)} ES`
        : quantifyInt("Endgame Skill", this.config.cost);

      const costs = [];
      if (this.config.cost) costs.push(esStr);
      return showCostOverride ? "Free" : costs.join(" + ");
    },
  },
  methods: {
    update() {
      const mastery = this.mastery;
      this.isBought = mastery.isBought;
      if (!this.isBought) {
        this.isAvailableForPurchase = mastery.canBeBought && mastery.isAffordable;
      }
    },
    handleClick() {
      if (this.specialClick === null || !this.mastery.isBought) this.mastery.purchase();
      else this.specialClick();
    },
    shiftClick() {
      if (this.mastery.purchaseUntil) this.mastery.purchaseUntil();
    }
  }
};

export class EndgameMasterySetup {
  constructor(props) {
    this.mastery = props.mastery;
    this.row = props.row;
    this.column = props.column;
  }

  setPosition(layout) {
    this.top = layout.itemPosition(this.row);
    const row = layout.rows[this.row];
    this.left = row.itemPosition(this.column, layout);
    this.width = row.layout.itemWidth;
    this.height = row.layout.itemHeight;
  }

  get path() {
    return this.mastery.path;
  }
}
</script>

<template>
  <button
    :class="[classObject, masteryClass]"
    :style="styleObject"
    @click.exact="handleClick"
    @click.shift.exact="shiftClick"
  >
    <slot />
    <CostDisplay
      v-if="showDefaultCostDisplay"
      br
      :config="config"
      name="Endgame Skill"
    />
    <div v-else>
      Cost: {{ customCostStr }}
    </div>
  </button>
</template>

<style scoped>

</style>
