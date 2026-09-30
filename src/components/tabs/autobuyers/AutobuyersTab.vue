<script>
import AutobuyerToggles from "./AutobuyerToggles";
import BigCrunchAutobuyerBox from "./BigCrunchAutobuyerBox";
import BulkSingularityAutobuyerBox from "./BulkSingularityAutobuyerBox";
import CelestialCrunchAutobuyerBox from "./CelestialCrunchAutobuyerBox";
import CelestialDimensionBoostAutobuyerBox from "./CelestialDimensionBoostAutobuyerBox";
import CelestialEternityAutobuyerBox from "./CelestialEternityAutobuyerBox";
import CelestialGalaxyAutobuyerBox from "./CelestialGalaxyAutobuyerBox";
import CelestialTickspeedAutobuyerBox from "./CelestialTickspeedAutobuyerBox";
import DimensionAutobuyerBox from "./DimensionAutobuyerBox";
import DimensionBoostAutobuyerBox from "./DimensionBoostAutobuyerBox";
import EndgameAutobuyerBox from "./EndgameAutobuyerBox";
import EternityAutobuyerBox from "./EternityAutobuyerBox";
import GalaxyAutobuyerBox from "./GalaxyAutobuyerBox";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import RealityAutobuyerBox from "./RealityAutobuyerBox";
import SimpleAutobuyersMultiBox from "./SimpleAutobuyersMultiBox";
import TickspeedAutobuyerBox from "./TickspeedAutobuyerBox";

export default {
  name: "AutobuyersTab",
  components: {
    AutobuyerToggles,
    OpenModalHotkeysButton,
    EndgameAutobuyerBox,
    RealityAutobuyerBox,
    CelestialEternityAutobuyerBox,
    EternityAutobuyerBox,
    CelestialCrunchAutobuyerBox,
    BigCrunchAutobuyerBox,
    CelestialGalaxyAutobuyerBox,
    GalaxyAutobuyerBox,
    CelestialDimensionBoostAutobuyerBox,
    DimensionBoostAutobuyerBox,
    BulkSingularityAutobuyerBox,
    CelestialTickspeedAutobuyerBox,
    TickspeedAutobuyerBox,
    DimensionAutobuyerBox,
    SimpleAutobuyersMultiBox
  },
  data() {
    return {
      hasInfinity: false,
      tickBought: false,
      hasContinuum: false,
      displayADAutobuyersIndividually: false,
      hasInstant: false,
      isFlipped: false
    };
  },
  computed: {
    // It only makes sense to show this if the player has seen gamespeed-altering effects, but we should keep it there
    // permanently as soon as they have
    hasSeenGamespeedAlteringEffects() {
      return PlayerProgress.seenAlteredSpeed();
    },
    gameTickLength() {
      return `${formatInt(player.options.updateRate)} ms`;
    }
  },
  methods: {
    update() {
      this.hasInfinity = PlayerProgress.infinityUnlocked();
      this.tickBought = Autobuyer.tickspeed.isBought;
      this.hasContinuum = Laitela.continuumActive;
      this.isFlipped = player.universes.current === 2;
      this.checkADAutoStatus();
    },
    checkADAutoStatus() {
      const ad = Autobuyer.antimatterDimension;
      // Since you don't need to buy autobuyers in Doomed and unbought ones are hidden, we can check if only the
      // autobuyers you can see (ie, have unlocked) have been maxed.
      if (Pelle.isDoomed) {
        this.displayADAutobuyersIndividually = !ad.zeroIndexed.filter(x => x.isUnlocked)
          .every(x => x.hasUnlimitedBulk && x.hasMaxedInterval);
        return;
      }
      this.hasInstant = ad.hasInstant;
      this.displayADAutobuyersIndividually = !ad.collapseDisplay;
    },
  }
};
</script>

<template>
  <div class="l-autobuyers-tab">
    <AutobuyerToggles />
    <OpenModalHotkeysButton />
    <div v-if="hasSeenGamespeedAlteringEffects">
      Autobuyer intervals and time-based settings are always <b>real time</b> and therefore
      <br>
      unaffected by anything which may alter how fast the game itself is running.
      <br>
      <br>
    </div>
    <div v-if="!hasInfinity">
      Challenges for upgrading autobuyers are unlocked by reaching Infinity.
    </div>
    <b>Autobuyers with no displayed bulk have unlimited bulk by default.</b>
    <b>
      {{ isFlipped ? "Matter" : "Antimatter" }} Dimension Autobuyers can have their bulk upgraded once interval is below {{ formatInt(100) }} ms.
    </b>
    <b v-if="hasInstant">Autobuyers with "Instant" interval will trigger every game tick ({{ gameTickLength }}).</b>
    <EndgameAutobuyerBox class="c-endgame-pos" />
    <RealityAutobuyerBox class="c-reality-pos" />
    <CelestialEternityAutobuyerBox class="c-celestial-eternity-pos" />
    <EternityAutobuyerBox class="c-eternity-pos" />
    <CelestialCrunchAutobuyerBox class="c-celestial-infinity-pos" />
    <BigCrunchAutobuyerBox class="c-infinity-pos" />
    <CelestialGalaxyAutobuyerBox />
    <GalaxyAutobuyerBox />
    <CelestialDimensionBoostAutobuyerBox />
    <DimensionBoostAutobuyerBox />
    <BulkSingularityAutobuyerBox />
    <CelestialTickspeedAutobuyerBox />
    <TickspeedAutobuyerBox v-if="!hasContinuum || !tickBought" />
    <template v-if="displayADAutobuyersIndividually">
      <DimensionAutobuyerBox
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </template>
    <SimpleAutobuyersMultiBox />
  </div>
</template>

<style scoped>
/* This is necessary for the ExpandingControlBox within these components to render in the right stacking order
when they're open. It looks slightly hacky but actually can't be done any other way; each AutobuyerBox creates
its own stacking context, which means that all z-indices specified within are essentially scoped and the
AutobuyerBox components will always render in page order regardless of internal z-indices without these. */
.c-endgame-pos {
  z-index: 6;
}
  
.c-reality-pos {
  z-index: 5;
}

.c-celestial-eternity-pos {
  z-index: 4;
}

.c-eternity-pos {
  z-index: 3;
}

.c-celestial-infinity-pos {
  z-index: 2;
}

.c-infinity-pos {
  z-index: 1;
}
</style>
