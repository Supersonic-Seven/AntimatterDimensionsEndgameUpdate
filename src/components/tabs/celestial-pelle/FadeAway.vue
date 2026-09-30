<script>
export default {
  name: "FadeAway",
  data() {
    return {
      opacity: 0,
      warping: false,
      goodbye: false,
      isDarker: false,
      hasSeenIntro: false,
      forceStars: false,
      forceDark: false,
      newCredits: false
    };
  },
  computed: {
    classObject() {
      return {
        "c-background-overlay": !this.forceStars && !this.forceDark && !this.isDarker,
        "c-background-overlay--force-stars": this.forceStars,
        "c-background-overlay--force-dark": this.forceDark || this.isDarker
      };
    }
  },
  methods: {
    update() {
      this.isDarker = Alpha.isRunning;
      this.warping = player.celestials.slabdrill.isWarping;
      this.goodbye = player.celestials.slabdrill.isGoodbye;
      this.hasSeenIntro = player.hasSeenIntro;
      this.opacity = (!this.hasSeenIntro || this.newCredits) ? 1.1 :
        (this.goodbye ? ((-Math.abs(Math.min(player.celestials.slabdrill.goodbyeTick, 4000) / 2000 - 1) * 2) + 2) :
        (this.warping ? ((-Math.abs(player.celestials.slabdrill.warpTick / 2500 - 1) * 1.25) + 1.25) :
        (this.isDarker ? (player.options.brightAlpha ? 0.2 : 0.5) : (GameEnd.endState - END_STATE_MARKERS.FADE_AWAY) / 2)));
      this.forceStars = player.introTick > 35000 && player.introTick <= 45000;
      this.forceDark = player.introTick > 45000 && player.introTick <= 60000;
      this.newCredits = player.endgame.credits;
    }
  }
};
</script>

<template>
  <div
    :class="classObject"
    :style="{
      opacity,
      pointerEvents: opacity > 1 ? 'auto' : 'none'
    }"
  />
</template>

<style scoped>
.c-background-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  background-color: #ffffff;
}

.t-dark .c-background-overlay,
.t-dark-metro .c-background-overlay {
  background-image: url("../../../../public/images/dark-bg.png");
  background-position: center;
}

.t-inverted .c-background-overlay,
.t-inverted-metro .c-background-overlay,
.t-amoled .c-background-overlay,
.t-amoled-metro .c-background-overlay,
.t-s11 .c-background-overlay {
  background-color: black;
}

.t-s1 .c-background-overlay {
  background: url("../../../../public/images/s1-bg.svg") no-repeat;
  background-attachment: fixed;
  background-color: #d72621;
  background-position: center bottom;
  background-size: 100%;
}

.t-s1 .c-background-overlay::before {
  content: "";
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url("../../../../public/images/snow1.png"),
  url("../../../../public/images/snow2.png"),
  url("../../../../public/images/snow3.png");
  animation: a-snow 10s linear infinite, a-snow-fade 10s cubic-bezier(0, 0.3, 1, 0.7) infinite;
}

.t-s2 .c-background-overlay {
  background: url("../../../../public/images/s2-bg.svg") no-repeat;
  background-color: white;
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 50%;
}

.t-s4 .c-background-overlay {
  background: #ff00ff;
  border-radius: 0 !important;
}

.t-s4 .c-background-overlay::after {
  content: "";
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #0fff0f;
  border-radius: 40%;
}

.t-s5 .c-background-overlay {
  background: url("../../../../public/images/s5-bg.jpg");
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 150%;
}

.t-s6 .c-background-overlay,
.t-s10 .c-background-overlay {
  background: black;
  background-image: url("../../../../public/images/stars-bg.png");
  background-position: center;
  background-size: 100%;
}

.t-s8 .c-background-overlay {
  background: url("../../../../public/images/s8-bg.jpg") no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.t-s12 .c-background-overlay {
  background: url("../../../../public/images/s12-bg.jpg") no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(0.5);
}

.t-s13 .c-background-overlay {
  background: url("../../../../public/images/s13-bg.jpg");
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 150%;
}

.c-background-overlay--force-stars {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  background-color: #ffffff;
  background: black;
  background-image: url("../../../../public/images/stars-bg.png");
  background-position: center;
  background-size: 100%;
}

.c-background-overlay--force-dark {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
  background-color: black;
}
</style>
