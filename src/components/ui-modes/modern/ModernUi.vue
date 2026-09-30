<script>
import BigCrunchButton from "../BigCrunchButton";
import CursedHeader from "../CursedHeader";
import DivinityButton from "../DivinityButton";
import HeaderBlackHole from "../HeaderBlackHole";
import HeaderChallengeDisplay from "../HeaderChallengeDisplay";
import HeaderChallengeEffects from "../HeaderChallengeEffects";
import HeaderPrestigeGroup from "../HeaderPrestigeGroup";
import NewsTicker from "../NewsTicker";
import NullifyButton from "../NullifyButton";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";
import CursedBackground from "@/components/ui-modes/CursedBackground";


export default {
  name: "ModernUi",
  components: {
    BigCrunchButton,
    CursedHeader,
    DivinityButton,
    NullifyButton,
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    NewsTicker,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
    CursedBackground
  },
  data() {
    return {
      bigCrunch: false,
      divine: false,
      nullified: false,
      hasReality: false,
      newGameKey: "",
      inCursedCore: false
    };
  },
  computed: {
    news() {
      return this.$viewModel.news && !this.inCursedCore;
    },
    topMargin() {
      return this.$viewModel.news || this.inCursedCore ? "" : "margin-top: 3.9rem";
    },
    bottomBorder() {
      return this.inCursedCore ? "" : "border-bottom: 0.1rem solid var(--color-good)";
    }
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      const divinityVisible = Pelle.isDoomed && player.antimatter.gte(DC.ENUMMAX);
      const nullifyVisible = player.endgame.largeHadronCollider.void.nullMatter.gte(DC.NUMMAX) &&
        !player.endgame.largeHadronCollider.void.nullified;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes.gt(1);
      this.divine = divinityVisible;
      this.nullified = nullifyVisible;
      this.hasReality = PlayerProgress.realityUnlocked();
      // This only exists to force a key-swap after pressing the button to start a new game; the news ticker can break
      // if it isn't redrawn
      this.newGameKey = Pelle.isDoomed;
      this.inCursedCore = player.celestials.slabdrill.core.isActive;
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) manualBigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  },
};
</script>

<template>
  <div id="page">
    <link
      rel="stylesheet"
      type="text/css"
      href="stylesheets/new-ui-styles.css"
    >
    <div
      :key="newGameKey"
      class="game-container"
      :style="topMargin"
    >
      <NewsTicker
        v-if="news"
      />
      <BigCrunchButton v-if="!inCursedCore" />
      <DivinityButton v-if="!inCursedCore" />
      <NullifyButton v-if="!inCursedCore" />
      <CursedBackground v-if="inCursedCore" />
      <div
        v-if="!bigCrunch && !divine && !nullified"
        class="tab-container"
      >
        <HeaderPrestigeGroup />
        <div
          class="information-header"
          :style="bottomBorder"
        >
          <HeaderChallengeDisplay v-if="!inCursedCore" />
          <HeaderChallengeEffects v-if="!inCursedCore" />
          <GameSpeedDisplay v-if="hasReality && !inCursedCore" />
          <br v-if="hasReality && !inCursedCore">
          <HeaderBlackHole v-if="!inCursedCore" />
          <CursedHeader v-if="inCursedCore" />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
