<script>
import ArmageddonButton from "../../tabs/celestial-pelle/ArmageddonButton";
import RealityCurrencyHeader from "../../RealityCurrencyHeader";

import HeaderTickspeedInfo from "../HeaderTickspeedInfo";

import RealityButton from "./RealityButton";

import EndgameButton from "./EndgameButton";

import DivinityContainer from "./DivinityContainer";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export default {
  name: "HeaderCenterContainer",
  components: {
    HeaderTickspeedInfo,
    RealityCurrencyHeader,
    RealityButton,
    ArmageddonButton,
    EndgameButton,
    DivinityContainer
  },
  data() {
    return {
      shouldDisplay: true,
      isModern: false,
      hasRealityButton: false,
      isDoomed: false,
      hasGalaxyGenerator: false,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
      celestialPoints: new Decimal(0),
      doomedParticles: new Decimal(0),
      showEndgame: false,
      showDivine: false,
      inCursedCore: false,
      isFlipped: false
    };
  },
  methods: {
    update() {
      this.shouldDisplay = player.break || !Player.canCrunch;
      if (!this.shouldDisplay) return;

      this.isModern = player.options.newUI;
      this.isDoomed = Pelle.isDoomed;
      this.hasGalaxyGenerator = PelleRifts.recursion.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies.gt(0);
      this.antimatter.copyFrom(Currency.antimatter);
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      if (!this.hasRealityButton) this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
      this.celestialPoints.copyFrom(Currency.celestialPoints);
      this.doomedParticles.copyFrom(Currency.doomedParticles);
      this.showEndgame = PlayerProgress.endgameUnlocked();
      this.showDivine = DivinityMilestone.divineDimensions.isReached && !Slabdrill.isCursed;
      this.inCursedCore = player.celestials.slabdrill.core.isActive;
      this.isFlipped = player.universes.current === 2;
    }
  },
};
</script>

<template>
  <div
    v-if="shouldDisplay"
    class="c-prestige-button-container"
  >
    <div
      v-if="showEndgame && !inCursedCore"
    >
      You have <span class="cp-text">{{ format(celestialPoints, 2) }}</span> {{ pluralize("Celestial Point", celestialPoints) }}.
      You have <span class="dp-text">{{ format(doomedParticles, 2) }}</span> {{ pluralize("Doomed Particle", doomedParticles) }}.
    <br>
    </div>
    <span>
      You have
      <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span>
      {{ isFlipped ? "matter" : "antimatter" }}.
    </span>
    <div
      v-if="hasRealityButton && !inCursedCore"
      class="c-reality-container"
    >
      <RealityCurrencyHeader />
      <ArmageddonButton
        v-if="isDoomed && !hasGalaxyGenerator || !showEndgame && isDoomed"
        :is-header="true"
      />
      <EndgameButton
        v-if="hasGalaxyGenerator && showEndgame"
        :is-header="true"
      />
      <RealityButton
        v-if="!isDoomed"
        :is-header="true"
      />
    </div>
    <div v-else-if="!inCursedCore">
      You are getting {{ format(antimatterPerSec, 2) }} {{ isFlipped ? "matter" : "antimatter" }} per second.
      <br>
      <HeaderTickspeedInfo />
    </div>
    <div v-if="showDivine && !inCursedCore">
      <DivinityContainer />
    </div>
  </div>
</template>

<style scoped>
.c-reality-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.cp-text {
  color: var(--color-endgame);
}
.dp-text {
  color: var(--color-pelle--base);
}
</style>
