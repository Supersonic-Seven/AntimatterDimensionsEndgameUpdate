<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import TimeStudyButton from "./TimeStudyButton";

export default {
  name: "DilationTimeStudy",
  components: {
    DescriptionDisplay,
    TimeStudyButton
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
      maxTT: new Decimal(),
      currTT: new Decimal(),
      ttGen: new Decimal(),
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    requirement() {
      if (this.id === 1) {
        if (this.maxTT.gte(1e9)) return `Requirement: ${formatInt(5)} EC11 and EC12 completions
          and ${format(this.maxTT, 2, 2)}/${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)}
          total Time Theorems`;
        return `Requirement: ${formatInt(5)} EC11 and EC12 completions
          and ${formatHybridSmall(this.maxTT, 3)}/${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)}
          total Time Theorems`;
      }
      if (this.id === 6) {
        const achRows = Perk.firstPerk.isBought ? "" : ` and ${formatInt(13)} rows of Achievements`;
        return `Requirement: ${format("1e4000")} Eternity Points${achRows}`;
      }
      return "";
    },
    theoremTimeEstimate() {
      if (this.study.isBought || !this.study.cost || this.ttGen.eq(0)) return null;
      const time = Decimal.sub(this.study.cost, this.currTT).dividedBy(this.ttGen);
      return time.gt(0) ? `Enough TT in ${TimeSpan.fromSeconds(time).toStringShort()}` : null;
    }
  },
  methods: {
    update() {
      if (this.id === 1) {
        this.maxTT.copyFrom(Currency.timeTheorems.max);
        this.showRequirement = !this.study.isBought && (!Perk.bypassECDilation.canBeApplied || player.disablePostReality);
      }
      if (this.id === 6) {
        this.showRequirement = !Pelle.isDoomed;
      }
      this.currTT.copyFrom(Currency.timeTheorems.value);
      this.ttGen.copyFrom(getTTPerSecond().times(Alpha.isRunning || Slabdrill.isCursed ? 1 : getGameSpeedupFactor()));
    },
    clickHandler() {
      switch (this.id) {
        case 1:
          return () => Tab.eternity.dilation.show();
        case 2:
        case 3:
        case 4:
        case 5:
          return () => Tab.dimensions.time.show();
        case 6:
          return () => Tab.reality.glyphs.show();
        default:
          throw new Error("Unrecognized Dilation study was clicked");
      }
    }
  }
};
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    :ach-tooltip="theoremTimeEstimate"
    :special-click="clickHandler()"
  >
    <DescriptionDisplay :config="study.config" />
    <template v-if="showRequirement">
      <br>
      <span>{{ requirement }}</span>
    </template>
  </TimeStudyButton>
</template>

<style scoped>

</style>
