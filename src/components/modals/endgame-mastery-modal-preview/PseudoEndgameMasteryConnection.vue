<script>
import { ForceBoughtState } from "./MasteryStringPreview";

export default {
  name: "PseudoEndgameMasteryConnection",
  props: {
    setup: {
      type: Object,
      required: true
    },
    forceIsBought: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      isOverridden: false,
      isBought: false
    };
  },
  computed: {
    classObject() {
      const classObject = {
        "o-endgame-mastery-connection": true,
        "o-endgame-mastery-connection--bought": this.isBought,
      };
      let pathClass;
      const connection = this.setup.connection;
      const from = connection.from;
      const to = connection.to;
      function pathClassOf(mastery) {
        switch (mastery.path) {
          case ENDGAME_MASTERY_PATH.ANTIMATTER_DIM_COMPRESSION: return "o-endgame-mastery-connection--antimatter-dim-compression";
          case ENDGAME_MASTERY_PATH.INFINITY_DIM_COMPRESSION: return "o-endgame-mastery-connection--infinity-dim-compression";
          case ENDGAME_MASTERY_PATH.TIME_DIM_COMPRESSION: return "o-endgame-mastery-connection--time-dim-compression";
          case ENDGAME_MASTERY_PATH.CELESTIAL_DIM_COMPRESSION: return "o-endgame-mastery-connection--celestial-dim-compression";
          case ENDGAME_MASTERY_PATH.INFINITY_POINTS: return "o-endgame-mastery-connection--infinity-points";
          case ENDGAME_MASTERY_PATH.ETERNITY_POINTS: return "o-endgame-mastery-connection--eternity-points";
          case ENDGAME_MASTERY_PATH.REALITY_MACHINES: return "o-endgame-mastery-connection--reality-machines";
          case ENDGAME_MASTERY_PATH.IMAGINARY_MACHINES: return "o-endgame-mastery-connection--imaginary-machines";
          case ENDGAME_MASTERY_PATH.ENDGAME_ENTANGLEMENT: return "o-endgame-mastery-connection--endgame-entanglement";
          case ENDGAME_MASTERY_PATH.CELESTIAL_ENTANGLEMENT: return "o-endgame-mastery-connection--celestial-entanglement";
          case ENDGAME_MASTERY_PATH.DIVINE_ENTANGLEMENT: return "o-endgame-mastery-connection--divine-entanglement";
          default: return undefined;
        }
      }
      switch (to.type) {
        case ENDGAME_MASTERY_TYPE.NORMAL:
          pathClass = pathClassOf(to) || pathClassOf(from);
          break;
        case ENDGAME_MASTERY_TYPE.PERMANENT:
          pathClass = "o-endgame-mastery-connection--permanent";
          break;
      }

      if (pathClass !== undefined) {
        classObject[pathClass] = true;
      }
      return classObject;
    }
  },
  methods: {
    update() {
      this.isOverridden = this.setup.connection.isOverridden;
      this.isBought = ForceBoughtState.getState(this.forceIsBought, this.setup.isBought);
    },
    percents(value) {
      return `${value * 100}%`;
    }
  }
};
</script>

<template>
  <line
    v-if="!isOverridden"
    :x1="percents(setup.x1)"
    :y1="percents(setup.y1)"
    :x2="percents(setup.x2)"
    :y2="percents(setup.y2)"
    :class="classObject"
  />
</template>

<style scoped>
.o-endgame-mastery-connection {
  /* This one should be px, because it rem svg behaves weirdly under scale */
  stroke-width: 2px;
}
</style>
