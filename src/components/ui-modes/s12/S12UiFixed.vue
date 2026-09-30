<script>
import CelestialQuoteHistoryDisplay from "@/components/modals/celestial-quotes/CelestialQuoteHistoryDisplay";
import CelestialQuoteModal from "@/components/modals/celestial-quotes/CelestialQuoteModal";
import CreditsContainer from "@/components/tabs/celestial-pelle/CreditsContainer";
import EndgameCreditsDisplay from "@/components/EndgameCreditsDisplay";
import FadeAway from "@/components/tabs/celestial-pelle/FadeAway";
import ModalProgressBar from "@/components/modals/ModalProgressBar";
import NewGame from "@/components/tabs/celestial-pelle/NewGame";
import PopupModal from "@/components/modals/PopupModal";
import Prologue from "@/components/ui-modes/Prologue";
import RestartEndgameUpdateDisplay from "@/components/RestartEndgameUpdateDisplay";
import ScreenOverlay from "@/components/ui-modes/ScreenOverlay";
import SpectateGame from "@/components/SpectateGame";

import S12Taskbar from "./S12Taskbar";

export default {
  name: "S12UiFixed",
  components: {
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
    RestartEndgameUpdateDisplay,
    S12Taskbar,
  },
  data() {
    return {
      ending: false,
      dark: false,
      intro: false,
      warping: false,
      goodbye: false,
      newCredits: false
    };
  },
  computed: {
    view() {
      return this.$viewModel;
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
    }
  }
};
</script>


<template>
  <span>
    <div class="c-game-ui--fixed">
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
      <FadeAway v-if="ending || dark || intro || warping || goodbye || newCredits" />
      <ScreenOverlay />
      <Prologue />
      <CreditsContainer v-if="ending" />
      <EndgameCreditsDisplay v-if="newCredits" />
      <NewGame v-if="ending" />
      <SpectateGame />
      <RestartEndgameUpdateDisplay v-if="newCredits" />
    </div>
    <S12Taskbar />
  </span>
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
</style>
