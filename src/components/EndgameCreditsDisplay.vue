<script>
export default {
  name: "EndgameCreditsDisplay",
  data() {
    return {
      currRole: 0,
      currPerson: 0,
      roleOpacity: 0,
      personOpacity: 0,
      playAudio: false,
      isPlaying: false,
      audio: null,
      audio2: null,
      isMuted: false,
    };
  },
  computed: {
    people() { return GameDatabase.endgameCredits.people; },
    roles() { return GameDatabase.endgameCredits.roles; },
    totalRoleCount() { return Object.keys(GameDatabase.endgameCredits.roles).length; },
    muteStyle() {
      return {
        top: "20px",
        left: "20px",
        display: this.playAudio ? "block" : "none"
      };
    },
    muteIconClass() {
      return this.isMuted ? "fa-volume-xmark" : "fa-volume-high";
    }
  },
  created() {
    // Use a hardcoded 33ms in order to make the end credits scroll smoothly; if the player normally plays
    // at a much slower rate, this causes the credits to have a jumpy-looking scroll. Since this is a setting
    // which persists across new games, we want to make sure we still preserve the old value too
    const oldRate = player.options.updateRate;
    player.options.updateRate = 33;
    GameOptions.refreshUpdateRate();
    player.options.updateRate = oldRate;
  },
  methods: {
    update() {
      this.currRole = Math.floor(player.endgame.creditsTick / 1000000);
      this.currPerson = Math.floor((player.endgame.creditsTick % 1000000) / 10000);
      let roleOpac = 0;
      if (this.currRole === 0) {
        roleOpac = Math.min(Math.min(((player.endgame.creditsTick % 1000000) - 10000) / 1000, 1), Math.min((
          20000 - (player.endgame.creditsTick % 1000000)) / 1000, 1));
      }
      if (this.currRole >= 1 && this.currRole <= 10) {
        roleOpac = Math.min(Math.min((player.endgame.creditsTick % 1000000) / 1000, 1), Math.min((((
          GameDatabase.endgameCredits.people.countWhere(x => (typeof x.roles === "number" ? x.roles === Math.floor(
            player.endgame.creditsTick / 1000000) : x.roles.includes(Math.floor(
            player.endgame.creditsTick / 1000000)))) * 10000) - 5500) - (player.endgame.creditsTick % 1000000)) / 1000, 1));
      }
      if (this.currRole === 11) {
        roleOpac = Math.min(Math.min((player.endgame.creditsTick % 1000000) / 1000, 1), Math.min((((
          GameDatabase.endgameCredits.people.countWhere(x => (typeof x.roles === "number" ? x.roles === 11 : x.roles.includes(11)))
          * 10000) - 3000) - (player.endgame.creditsTick % 1000000)) / 1000, 1));
      }
      if (this.currRole === 12) {
        roleOpac = Math.min(Math.min((player.endgame.creditsTick % 1000000) / 1000, 1), Math.min((
          10000 - (player.endgame.creditsTick % 1000000)) / 1000, 1));
      }
      this.roleOpacity = roleOpac;
      let personOpac = 0;
      if (this.currRole === 0 || this.currRole === 12) {
        personOpac = Math.min(Math.min((player.endgame.creditsTick % 10000) / 1000, 1), Math.min((
          10000 - (player.endgame.creditsTick % 10000)) / 1000, 1));
      }
      if (this.currRole >= 1 && this.currRole <= 10) {
        personOpac = Math.min(Math.min((player.endgame.creditsTick % 10000) / 1000, 1), Math.min((
          4500 - (player.endgame.creditsTick % 10000)) / 1000, 1));
      }
      if (this.currRole === 11) {
        personOpac = Math.min(Math.min((player.endgame.creditsTick % 10000) / 1000, 1), Math.min((
          7000 - (player.endgame.creditsTick % 10000)) / 1000, 1));
      }
      this.personOpacity = personOpac;
      this.playAudio = player.endgame.creditsTick > 2000;
      if (this.playAudio && !this.isPlaying) {
        this.audio = new Audio(`audio/endgame-credits.mp3`);
        this.audio2 = new Audio(`audio/endgame-credits-2.mp3`);
        this.audio.play();
        setTimeout(() => this.audio2.play(), 243000);
        this.isPlaying = true;
      }
      if (this.audio) this.audio.volume = this.isMuted ? 0 : 0.3;
      if (this.audio2) this.audio2.volume = this.isMuted ? 0 : 0.3;
    },
    relevantPeople(role) {
      if (role === 11) return this.people.filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)));
      return this.people
        .filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  }
};
</script>

<template>
  <div class="l-credits-container">
    <i
      class="c-mute-button fa-solid"
      :class="muteIconClass"
      :style="muteStyle"
      @click="isMuted = !isMuted"
    />
    <h1
      v-if="currRole === 0 && currPerson === 1"
      class="c-credits-header"
      :style="{ opacity: roleOpacity }"
    >
      Antimatter Dimensions: Endgame
    </h1>

    <div v-if="currRole >= 1 && currRole <= totalRoleCount">
      <h2
        class="c-credits-section"
        :style="{ opacity: roleOpacity }"
      >
        {{ pluralize(roles[currRole], currRole === 11 ? 1 : relevantPeople(currRole).length) }}
      </h2>
      <div>
        <div
          class="c-credit-entry"
          :style="{ opacity: personOpacity }"
        >
          {{ relevantPeople(currRole)[currPerson].name }}
          <span v-if="relevantPeople(currRole)[currPerson].name2">
            ({{ relevantPeople(currRole)[currPerson].name2 }})
          </span>
          <br>
          <br>
          <span v-if="currRole === 11">
            {{ relevantPeople(currRole)[currPerson].thanks }}
          </span>
        </div>
      </div>
    </div>

    <h1
      v-if="currRole === 12"
      class="c-credits-header"
      :style="{ opacity: roleOpacity }"
    >
      Thank you so much for playing!
    </h1>
  </div>
</template>

<style scoped>
.l-credits-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 9;
}

.c-credits-header {
  animation: a-credits-header--glow 10s infinite;
}

@keyframes a-credits-header--glow {
  0% { color: #2196f3; }
  33% { color: #673ab7; }
  66% { color: #00bcd4; }
  100% { color: #2196f3; }
}

.c-credits-section {
  color: var(--color-text);
  text-shadow: 1px 1px 2px turquoise;
}

.c-credit-entry {
  color: var(--color-text);
  font-size: 1.3rem;
  font-weight: bold;
}

.c-mute-button {
  position: fixed;
  left: 2rem;
  font-size: 2rem;
  opacity: 0.5;
  pointer-events: auto;
  cursor: pointer;
}
</style>
