<script>
import { ForceBoughtState } from "./MasteryStringPreview";

export default {
  name: "PseudoEndgameMasteryButton",
  props: {
    setup: {
      type: Object,
      required: true
    },
    forceIsBought: {
      type: Number,
      default: 1
    },
    isNewFromImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isBought: false,
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
        "o-pseudo-endgame-mastery": true,
        "l-endgame-mastery": true,
        "o-pseudo-endgame-mastery--small": this.setup.isSmall,
        "o-endgame-mastery--unavailable": !this.isBought,
        "o-endgame-mastery--bought": this.isBought,
        "o-endgame-mastery--new-import": this.isNewFromImport && !this.isBought
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
          return "o-endgame-mastery-permanent";
      }
      return "";
    },
    masteryClass() {
      return `${this.pathClass}--${this.isBought ? "bought" : "unavailable"}`;
    },
    masteryString() {
      switch (this.mastery.type) {
        case ENDGAME_MASTERY_TYPE.NORMAL: return `${this.mastery.id}`;
      }
      return "";
    }
  },
  methods: {
    update() {
      const mastery = this.mastery;
      this.isBought = ForceBoughtState.getState(this.forceIsBought, mastery.isBought);
    },
  }
};
</script>

<template>
  <button
    :class="[classObject, masteryClass]"
    :style="styleObject"
  >
    {{ masteryString }}
  </button>
</template>

<style scoped>
.o-pseudo-endgame-mastery {
  width: 2.7rem;
  height: 1.5rem;
  font-family: Typewriter, serif;
  font-size: 0.85rem;
  color: black;
  border: 0.15rem solid;
  border-radius: var(--var-border-radius, 0.2rem);
  padding: 0;
  transition-duration: 0.2s;
  pointer-events: none;
}

.o-pseudo-endgame-mastery--small {
  width: 1.8rem;
}

.o-endgame-mastery--new-import::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 214, 11, 0.8);
  border-radius: var(--var-border-radius, inherit);
  animation: a-new-import 3s infinite;
}

@keyframes a-new-import {
  0% { opacity: 0; }
  50% { opacity: 0.7; }
  100% { opacity: 0; }
}
</style>
