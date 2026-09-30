<script>
export default {
  name: "RestartEndgameUpdateDisplay",
  data() {
    return {
      opacity: 0,
      visible: false,
      currentCompletions: 0,
      performingAction: false
    };
  },
  computed: {
    formattedCompletion() {
      if (Math.floor((this.currentCompletions % 100) / 10) === 1) return `${this.currentCompletions}th`;
      else if ((this.currentCompletions % 10) === 1) return `${this.currentCompletions}st`;
      else if ((this.currentCompletions % 10) === 2) return `${this.currentCompletions}nd`;
      else if ((this.currentCompletions % 10) === 3) return `${this.currentCompletions}rd`;
      else return `${this.currentCompletions}th`;
    },
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = player.endgame.creditsTick > 13005000 && player.endgame.creditsTick < 13017500;
      this.opacity = Math.min((player.endgame.creditsTick - 13005000) / 5000, (13017500 - player.endgame.creditsTick) / 2500);
      this.currentCompletions = player.endgame.fullCompletions + 1;
    },
    restartGame() {
      if (this.performingAction) return;
      this.performingAction = true;
      GameStorage.export();
      NewGame.restartGame();
    },
    keepGoing() {
      if (this.performingAction) return;
      this.performingAction = true;
      GameStorage.export();
      player.endgame.creditsTick = 13015000;
    }
  }
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h2>
      Congratulations! You have completed the entire game! You have two options going forward.
    </h2>
    <h3>
      Option 1: Restart the game from the beginning. This is your {{ formattedCompletion }} completion of the game,
      so currently you will gain a permanent {{ formatX(currentCompletions) }} multiplier to the primary currency
      of the next update. You can improve this by getting more game completions. Before the game restarts, your savefile
      will be exported to your clipboard. It is recommended that you hold on to this savefile in case something happens.
    </h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        :class="{ 'c-new-game-button--unclickable': performingAction }"
        @click="restartGame"
      >
        Restart the Game
      </button>
    </div>
    <br>
    <h3>
      Option 2: Continue playing the game. Currently, there is not a lot of playable content beyond this point. You may keep
      going if you wish, but the options for how to progress beyond this point are limited. You also will not gain any
      additional boosts to the next update if you keep going from this point. Your savefile will also be exported if you
      choose this option so that you may go back if you change your mind.
    </h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        :class="{ 'c-new-game-button--unclickable': performingAction }"
        @click="keepGoing"
      >
        Keep Going
      </button>
    </div>
  </div>
</template>

<style scoped>
.c-new-game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-game-container {
  color: white;
}

.c-new-game-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-game-button {
  font-family: Typewriter;
  background: grey;
  border: black;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}

.c-new-game-button--unclickable {
  cursor: default;
}
</style>
