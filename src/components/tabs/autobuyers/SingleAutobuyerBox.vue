<script>
import AutobuyerInput from "./AutobuyerInput";
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel";
import AutobuyerSingleToggleLabel from "./AutobuyerSingleToggleLabel";

// This component contains a single "special" autobuyer toggle (eg. sacrifice, annihilation, 2xIP etc.)
export default {
  name: "SingleAutobuyerBox",
  components: {
    AutobuyerSingleToggleLabel,
    AutobuyerIntervalLabel,
    AutobuyerInput
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      // Used to hide the input box if the game is auto-sacrificing every tick without resource resets
      isHiddenSacrifice: false,
      annihilationMode: 0,
    };
  },
  computed: {
    name() {
      return this.autobuyer.name;
    },
    isSacrifice() {
      return this.name === "Dimensional Sacrifice";
    },
    isAnnihilation() {
      return this.name === "Annihilation" && (ExpansionPack.laitelaPack.isBought && !player.disablePostReality);
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.autobuyer.isUnlocked;
      this.isHiddenSacrifice = this.isSacrifice && Achievement(118).canBeApplied &&
        (!player.disablePostReality || (Alpha.isRunning && Alpha.currentStage >= 12) ||
        (LHC.voidRunning && NullUpgrade.limerick1.isBought) || SlabdrillUnlocks.eternityChallengeTen.isUnlocked);
      this.annihilationMode = player.auto.annihilation.mode;
    },
    modeToggle() {
      player.auto.annihilation.mode = (player.auto.annihilation.mode + 1) % 2;
    },
  }
};
</script>

<template>
  <span
    v-if="isUnlocked"
    class="c-autobuyer-box-row"
  >
    <AutobuyerSingleToggleLabel :autobuyer="autobuyer" />
    <div>
      {{ name }}
      <AutobuyerIntervalLabel :autobuyer="autobuyer" />

      <b
        v-if="isHiddenSacrifice"
        class="c-autobuyer-box__small-text"
      >
        Automatic (Achievement 118)
      </b>
      <span
        v-else-if="autobuyer.hasInput"
        class="c-autobuyer-box__small-text"
      >
        Multiplier:
        <button
          v-if="isAnnihilation"
          class="c-annihilation-autobuyer-mode-button"
          @click="modeToggle"
        >
          <label class="l-annihilation-autobuyer-mode-button">
            <span>{{ annihilationMode === 0 ? "+" : "×" }}</span>
          </label>
        </button>
        <AutobuyerInput
          class="c-small-autobuyer-input"
          :autobuyer="autobuyer"
          :type="autobuyer.inputType"
          :property="autobuyer.inputEntry"
        />
      </span>
    </div>
  </span>
</template>

<style scoped>
.c-annihilation-autobuyer-mode-button {
  width: 2rem;
  height: 2rem;
  background: var(--color-laitela--base);
  border: var(--var-border-width, 0.2rem) solid var(--color-laitela--accent);
  color: var(--color-laitela--accent);
  transition-duration: 0.3s;
  cursor: pointer;
  margin: 0.3rem 0.3rem 0 0;
}

.c-annihilation-autobuyer-mode-button:hover {
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
}

.l-annihilation-autobuyer-mode-button {
  display: flex;
  align-content: center;
  justify-content: center;
  cursor: pointer;
}
</style>
