<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EndgameMasteryButton from "./EndgameMasteryButton";

export default {
  name: "PermanentEndgameMastery",
  components: {
    DescriptionDisplay,
    EndgameMasteryButton
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showRequirement: false,
      maxES: new Decimal(),
      currES: new Decimal(),
    };
  },
  computed: {
    mastery() {
      return this.setup.mastery;
    },
    id() {
      return this.mastery.id;
    },
    requirement() {
      if (this.id === 1) {
        return `${formatInt(this.maxES)}/${formatInt(EndgameMastery.endgameUpgrades.totalEndgameSkillRequirement)}
          total Endgame Skills`;
      }
      if (this.id === 2) {
        return `${formatInt(this.maxES)}/${formatInt(EndgameMastery.permaMasteries.totalEndgameSkillRequirement)}
          total Endgame Skills`;
      }
      if (this.id === 3) {
        return `${formatInt(this.maxES)}/${formatInt(EndgameMastery.timeCompression.totalEndgameSkillRequirement)}
          total Endgame Skills`;
      }
      if (this.id === 4) {
        return "Have all previous Endgame Masteries purchased";
      }
      return "";
    },
  },
  methods: {
    update() {
      if (this.id <= 3) {
        this.maxES.copyFrom(Currency.endgameSkills.max);
      }
      this.showRequirement = !this.mastery.isBought;
      this.currES.copyFrom(Currency.endgameSkills.value);
    },
    clickHandler() {
      switch (this.id) {
        case 1:
          return () => Tab.endgame.upgrades.show();
        case 2:
          return () => Tab.endgame.masteries.show();
        case 3:
          return () => Tab.endgame.compression.show();
        case 4:
          return () => Tab.dimensions.celestial.show();
        default:
          throw new Error("Unrecognized Permanent Mastery was clicked");
      }
    }
  }
};
</script>

<template>
  <EndgameMasteryButton
    :setup="setup"
    :special-click="clickHandler()"
  >
    <DescriptionDisplay :config="mastery.config" />
    <template v-if="showRequirement">
      <br>
      <span>{{ requirement }}</span>
    </template>
  </EndgameMasteryButton>
</template>

<style scoped>

</style>
