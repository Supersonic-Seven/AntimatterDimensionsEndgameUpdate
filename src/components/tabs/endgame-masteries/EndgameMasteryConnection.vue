<script>
export default {
  name: "EndgameMasteryConnection",
  props: {
    setup: {
      type: Object,
      required: true
    }
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
          if (this.setup.connection.to.id === 4) pathClass = "o-endgame-mastery-connection--celestial-reality";
          else if (this.setup.connection.to.id === 3) pathClass = "o-endgame-mastery-connection--time-compression";
          else pathClass = "o-endgame-mastery-connection--permanent";
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
      this.isBought = this.setup.isBought;
    },
    percents(value) {
      return `${value * 100}%`;
    }
  }
};

export class EndgameMasteryConnectionSetup {
  constructor(connection) {
    this.connection = connection;
  }

  get from() {
    return this.connection.from;
  }

  get to() {
    return this.connection.to;
  }

  /**
   * @param {EndgameMasterySetup[]} masteries
   */
  setPosition(masteries, width, height) {
    const from = masteries.find(mastery => mastery.mastery === this.from);
    const to = masteries.find(mastery => mastery.mastery === this.to);
    this.x1 = (from.left + from.width / 2) / width;
    this.y1 = (from.top + from.height / 2) / height;
    this.x2 = (to.left + to.width / 2) / width;
    this.y2 = (to.top + to.height / 2) / height;
  }

  get isBought() {
    return this.from.isBought && this.to.isBought;
  }
}
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

</style>
