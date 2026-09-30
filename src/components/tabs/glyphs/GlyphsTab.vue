<script>
import CurrentGlyphEffects from "./CurrentGlyphEffects";
import EquippedGlyphs from "./EquippedGlyphs";
import ExpandingControlBox from "@/components/ExpandingControlBox";
import GlyphInventory from "./GlyphInventory";
import GlyphLevelsAndWeights from "./GlyphLevelsAndWeights";
import GlyphPeek from "./GlyphPeek";
import GlyphTabSidebar from "./sidebar/GlyphTabSidebar";
import RealityAmplifyButton from "./RealityAmplifyButton";
import RealityReminder from "./RealityReminder";
import ResetRealityButton from "./ResetRealityButton";
import SacrificedGlyphs from "./SacrificedGlyphs";
import SingleGlyphCustomzationPanel from "./SingleGlyphCustomzationPanel";

export default {
  name: "GlyphsTab",
  components: {
    ExpandingControlBox,
    GlyphTabSidebar,
    GlyphPeek,
    RealityAmplifyButton,
    GlyphInventory,
    SacrificedGlyphs,
    CurrentGlyphEffects,
    EquippedGlyphs,
    GlyphLevelsAndWeights,
    ResetRealityButton,
    RealityReminder,
    SingleGlyphCustomzationPanel
  },
  data() {
    return {
      enslavedHint: "",
      showInstability: false,
      showHigherInstability: false,
      showMoreHigherInstability: false,
      showEvenMoreHigherInstability: false,
      showStillEvenMoreHigherInstability: false,
      showHighestInstability: false,
      instabilityThreshold: new Decimal(),
      hyperInstabilityThreshold: new Decimal(),
      extremeInstabilityThreshold: new Decimal(),
      immenseInstabilityThreshold: new Decimal(),
      extensiveInstabilityThreshold: new Decimal(),
      prodigiousInstabilityThreshold: new Decimal(),
      ultimateInstabilityThreshold: new Decimal(),
      isInCelestialReality: false,
      canAmplify: false,
      glyphTextColors: true,
      autoRestartCelestialRuns: false,
      sacrificeUnlocked: false,
      sacrificeDisplayed: false,
      resetRealityDisplayed: false,
    };
  },
  computed: {
    showEnslavedHint() {
      return this.enslavedHint !== "";
    },
    glyphColorState() {
      return {
        "o-glyph-color-checkbox": true,
        "o-glyph-color-checkbox--active": this.glyphTextColors,
        "o-glyph-color-checkbox--inactive": !this.glyphTextColors,
      };
    },
  },
  methods: {
    update() {
      this.resetRealityDisplayed = PlayerProgress.realityUnlocked();
      this.showInstability = player.records.bestReality.glyphLevel.gt(800) || player.records.bestEndgame.glyphLevel.gt(800);
      this.showHigherInstability = player.records.bestEndgame.glyphLevel.gt(60000);
      this.showMoreHigherInstability = player.records.bestEndgame.glyphLevel.gt(160000);
      this.showEvenMoreHigherInstability = player.records.bestEndgame.glyphLevel.gt(800000);
      this.showStillEvenMoreHigherInstability = player.records.bestEndgame.glyphLevel.gt(2000000);
      this.showHighestInstability = player.records.bestEndgame.glyphLevel.gt(8000000);
      this.instabilityThreshold.copyFrom(Decimal.floor(Glyphs.instabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.hyperInstabilityThreshold.copyFrom(Decimal.floor(Glyphs.hyperInstabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.extremeInstabilityThreshold.copyFrom(Decimal.floor(Glyphs.extremeInstabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.immenseInstabilityThreshold.copyFrom(Decimal.floor(Glyphs.immenseInstabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.extensiveInstabilityThreshold.copyFrom(Decimal.floor(Glyphs.extensiveInstabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.prodigiousInstabilityThreshold.copyFrom(Decimal.floor(Glyphs.prodigiousInstabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.ultimateInstabilityThreshold.copyFrom(Decimal.floor(Glyphs.ultimateInstabilityThreshold.times(Effects.product(EndgameUpgrade(25), Ra.unlocks.glyphLevelBuff))));
      this.isInCelestialReality = isInCelestialReality();
      this.canAmplify = Enslaved.isUnlocked && !this.isInCelestialReality;
      this.autoRestartCelestialRuns = player.options.retryCelestial;
      this.glyphTextColors = player.options.glyphTextColors;
      this.enslavedHint = "";
      this.sacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.sacrificeDisplayed = player.reality.showGlyphSacrifice;
      if (!Enslaved.isRunning) return;
      const haveBoost = Glyphs.activeWithoutCompanion.find(e => e.level.lt(Enslaved.glyphLevelMin)) !== undefined;
      if (haveBoost) {
        this.enslavedHint = "done... what little... I can... with Glyphs...";
      }
    },
    toggleAutoRestartCelestial() {
      player.options.retryCelestial = !player.options.retryCelestial;
    },
    toggleGlyphTextColors() {
      player.options.glyphTextColors = !player.options.glyphTextColors;
    },
    glyphInfoClass(isSacrificeOption) {
      return {
        "l-glyph-info-button": true,
        "c-glyph-info-button": true,
        "c-glyph-info-button--active": isSacrificeOption,
        "c-glyph-info-button--inactive": !isSacrificeOption
      };
    },
    setInfoState(state) {
      player.reality.showGlyphSacrifice = state;
    },
    glyphColorPosition() {
      return this.sacrificeUnlocked ? "l-glyph-color-position__low" : "l-glyph-color-position__top";
    },
    glyphInfoBorderClass() {
      return {
        "c-current-glyph-effects-with-top-border": !this.sacrificeUnlocked
      };
    },
    buttonGroupClass() {
      return {
        "l-half-width": this.canAmplify
      };
    }
  }
};
</script>

<template>
  <div>
    <div class="l-glyphs-tab">
      <div class="l-reality-button-column">
        <GlyphPeek />

        <div
          v-if="resetRealityDisplayed"
          class="l-reality-button-group"
        >
          <RealityAmplifyButton
            v-if="!isInCelestialReality"
            :class="buttonGroupClass()"
          />
          <ResetRealityButton :class="buttonGroupClass()" />
        </div>

        <div
          v-if="isInCelestialReality"
          class="l-celestial-auto-restart-checkbox"
        >
          <input
            id="autoRestart"
            v-model="autoRestartCelestialRuns"
            type="checkbox"
            :value="autoRestartCelestialRuns"
            class="o-clickable"
            @input="toggleAutoRestartCelestial()"
          >
          <label
            for="autoRestart"
            class="o-clickable"
          >
            Repeat this Celestial's Reality
          </label>
        </div>

        <br>

        <RealityReminder />

        <div v-if="showInstability">
          <br>
          Glyphs are becoming unstable.
          <br>
          Glyph levels higher than {{ formatInt(instabilityThreshold) }} are harder to reach.
          <br>
          This effect is even stronger above level {{ formatInt(hyperInstabilityThreshold) }}.
          <br>
          <div v-if="showHigherInstability">
            Above level {{ formatInt(extremeInstabilityThreshold) }}, higher Glyph levels are nearly impossible to reach.
          </div>
          <div v-if="showMoreHigherInstability">
            Past level {{ formatInt(immenseInstabilityThreshold) }}, higher Glyph levels become not much more than a dream.
          </div>
          <div v-if="showEvenMoreHigherInstability">
            Beyond level {{ formatInt(extensiveInstabilityThreshold) }}, just pretend higher Glyph levels don't exist.
          </div>
          <div v-if="showStillEvenMoreHigherInstability">
            Upon exceeding level {{ formatInt(prodigiousInstabilityThreshold) }}, your Glyph Levels just die.
          </div>
          <div v-if="showHighestInstability">
            After surpassing level {{ formatInt(ultimateInstabilityThreshold) }}, your Glyph Level increase reaches an abrupt end.
          </div>
        </div>
        <SingleGlyphCustomzationPanel />
        <ExpandingControlBox
          width-source="content"
          label="Glyph Level Factors"
          container-class="c-glyph-level-factors-dropdown-header"
          class="l-glyph-level-factors"
        >
          <template #dropdown>
            <GlyphLevelsAndWeights />
          </template>
        </ExpandingControlBox>
        <GlyphTabSidebar />
      </div>
      <div class="l-player-glyphs-column">
        <div
          v-if="showEnslavedHint"
          class="o-teresa-quotes"
          v-html="enslavedHint"
        />
        <div class="l-equipped-glyphs-and-effects-container">
          <EquippedGlyphs />
          <div class="l-glyph-info-wrapper">
            <span
              class="l-glyph-color-box"
              @click="toggleGlyphTextColors"
            >
              <div :class="glyphColorPosition()">
                <label
                  :class="glyphColorState"
                >
                  <span class="fas fa-palette" />
                </label>
              </div>
            </span>
            <div
              v-if="sacrificeUnlocked"
              class="c-glyph-info-options"
            >
              <button
                :class="glyphInfoClass(!sacrificeDisplayed)"
                @click="setInfoState(false)"
              >
                Current Glyph effects
              </button>
              <button
                :class="glyphInfoClass(sacrificeDisplayed)"
                @click="setInfoState(true)"
              >
                Glyph Sacrifice totals
              </button>
            </div>
            <SacrificedGlyphs v-if="sacrificeUnlocked && sacrificeDisplayed" />
            <CurrentGlyphEffects
              v-else
              :class="glyphInfoBorderClass()"
            />
          </div>
        </div>
        <GlyphInventory />
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-glyph-level-factors {
  margin: 2rem;
}

.o-clickable {
  cursor: pointer;
}

.l-celestial-auto-restart-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
}

.l-half-width {
  width: 50%;
}
</style>
