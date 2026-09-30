<script>
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "GalacticPowerRow",
  components: {
    EffectDisplay
  },
  props: {
    getPower: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false
    };
  },
  computed: {
    power() {
      return this.getPower();
    },
    config() {
      return this.power.config;
    },
    description() {
      const description = this.config.reward;
      return typeof description === "function" ? description() : description;
    },
    reward() {
      const reward = this.config.effect;
      return typeof reward === "function" ? reward() : reward;
    },
    title() {
      return `Galactic Power ${this.config.id}:`;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.power.isUnlocked;
    }
  }
};
</script>

<template>
  <div v-show="isUnlocked">
    <div class="c-galactic-power-text">
      {{ title }} {{ description }}.
    </div>
    <div class="c-galactic-power-text">
      <EffectDisplay
        :config="config"
      />
    </div>
  </div>
</template>

<style scoped>
.c-galactic-power-text {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(
    var(--color-pelle--secondary), var(--color-pelle--base),
    var(--color-pelle--secondary), var(--color-pelle--base)
  );
  background-size: 100% 300%;
  background-clip: text;
  animation: a-galactic-power-text-cycle 5s linear infinite;

  -webkit-text-fill-color: transparent;
}

@keyframes a-galactic-power-text-cycle {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 50% 100%;
  }
}
</style>
