<script>
import CelestialQuoteHistoryDisplay from "@/components/modals/celestial-quotes/CelestialQuoteHistoryDisplay";
import CelestialQuoteModal from "@/components/modals/celestial-quotes/CelestialQuoteModal";
import CreditsContainer from "@/components/tabs/celestial-pelle/CreditsContainer";
import EndgameCreditsDisplay from "@/components/EndgameCreditsDisplay";
import EndgameSkillShop from "@/components/tabs/endgame-masteries/es-shop/EndgameSkillShop";
import FadeAway from "@/components/tabs/celestial-pelle/FadeAway";
import HowToPlay from "@/components/HowToPlay";
import ModalProgressBar from "@/components/modals/ModalProgressBar";
import ModernSidebar from "@/components/ui-modes/modern/ModernSidebar";
import NewGame from "@/components/tabs/celestial-pelle/NewGame";
import PopupModal from "@/components/modals/PopupModal";
import Prologue from "@/components/ui-modes/Prologue";
import RestartEndgameUpdateDisplay from "@/components/RestartEndgameUpdateDisplay";
import SaveTimer from "@/components/SaveTimer";
import ScreenOverlay from "@/components/ui-modes/ScreenOverlay";
import SpectateGame from "@/components/SpectateGame";
import SpeedrunStatus from "@/components/SpeedrunStatus";
import TimeTheoremShop from "@/components/tabs/time-studies/tt-shop/TimeTheoremShop";

export default {
  name: "GameUiComponentFixed",
  components: {
    HowToPlay,
    TimeTheoremShop,
    EndgameSkillShop,
    ModernSidebar,
    SaveTimer,
    SpeedrunStatus,
    PopupModal,
    ModalProgressBar,
    CelestialQuoteModal,
    CelestialQuoteHistoryDisplay,
    FadeAway,
    ScreenOverlay,
    Prologue,
    CreditsContainer,
    EndgameCreditsDisplay,
    SpectateGame,
    NewGame,
    RestartEndgameUpdateDisplay
  },
  data() {
    return {
      ending: false,
      dark: false,
      intro: false,
      warping: false,
      goodbye: false,
      newCredits: false,
      isCursedCore: false
    };
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    hideIfMatoFullscreen() {
      return {
        visibility: this.isCursedCore || ui.view.tabs.reality.automator.fullScreen ? "hidden" : "visible"
      };
    }
  },
  methods: {
    update() {
      this.ending = GameEnd.endState >= END_STATE_MARKERS.FADE_AWAY && !GameEnd.creditsClosed;
      this.dark = Alpha.isRunning;
      this.intro = !player.hasSeenIntro;
      this.warping = player.celestials.slabdrill.isWarping;
      this.goodbye = player.celestials.slabdrill.isGoodbye;
      this.newCredits = player.endgame.credits;
      this.isCursedCore = player.celestials.slabdrill.core.isActive;
    }
  }
};
</script>


<template>
  <!-- Hide the button if the automator is in fullscreen mode: Nothing here needs to be visible during fullscreen -->
  <div
    id="ui-fixed"
    class="c-game-ui--fixed"
  >
    <div
      id="notification-container"
      class="l-notification-container"
    />
    <HowToPlay :style="hideIfMatoFullscreen" />
    <TimeTheoremShop
      v-if="view.subtab === 'studies'"
      class="l-time-studies-tab__tt-shop"
    />
    <EndgameSkillShop
      v-if="view.subtab === 'masteries'"
      class="l-endgame-masteries-tab__es-shop"
    />
    <ModernSidebar
      v-if="view.newUI && view.theme !== 'S12'"
      :style="hideIfMatoFullscreen"
    />
    <SaveTimer :style="hideIfMatoFullscreen" />
    <SpeedrunStatus :style="hideIfMatoFullscreen" />
    <template v-if="view.theme !== 'S12'">
      <ModalProgressBar v-if="view.modal.progressBar" />
      <CelestialQuoteModal
        v-else-if="view.quotes.current"
        :quote="view.quotes.current"
      />
      <CelestialQuoteHistoryDisplay
        v-else-if="view.quotes.history"
        :quotes="view.quotes.history"
      />
      <PopupModal
        v-else-if="view.modal.current"
        :modal="view.modal.current"
      />
      <ModalProgressBar v-if="view.modal.progressBar" />
      <ScreenOverlay />
      <Prologue />
      <FadeAway v-if="ending || dark || intro || warping || goodbye || newCredits" />
      <EndgameCreditsDisplay v-if="newCredits" />
      <CreditsContainer v-if="ending" />
      <NewGame v-if="ending" />
      <SpectateGame />
      <RestartEndgameUpdateDisplay v-if="newCredits" />
    </template>
  </div>
</template>

<style scoped>
.c-game-ui--fixed {
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  justify-content: center;
  pointer-events: none;
}

.t-s12 .c-game-ui--fixed {
  position: absolute;
}
</style>
