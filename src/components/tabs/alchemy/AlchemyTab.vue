<script>
import { AlchemyCircleLayout } from "./alchemy-circle-layout";
import AlchemyCircleNode from "./AlchemyCircleNode";
import AlchemyResourceInfo from "./AlchemyResourceInfo";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AlchemyTab",
  components: {
    PrimaryButton,
    AlchemyCircleNode,
    AlchemyResourceInfo
  },
  data() {
    return {
      infoResourceId: 0,
      focusedResourceId: -1,
      reactionsAvailable: false,
      realityCreationVisible: false,
      animationTimer: 0,
      alchemyCap: 0,
      capFactor: 0,
      createdRealityGlyph: false,
      allReactionsDisabled: false,
      // Used to force a re-render of reaction lines when reality glyphs are created
      realityAmount: 0,
    };
  },
  computed: {
    resources: () => AlchemyResources.all,
    layout: () => new AlchemyCircleLayout(),
    sizeMultiplier: () => 5,
    infoResource() {
      return this.resources[this.infoResourceId];
    },
    circleStyle() {
      const size = this.layout.size * this.sizeMultiplier;
      return {
        width: `${size}rem`,
        height: `${size}rem`,
        opacity: this.isDoomed ? 0.8 : 1
      };
    },
    orbitClass() {
      return (this.focusedResourceId === -1 || this.isDoomed) ? undefined : "o-alchemy-orbit--unfocused";
    },
    realityGlyphCreationClass() {
      return {
        "o-primary-btn--subtab-option": true,
        "tutorial--glow": !this.createdRealityGlyph
      };
    },
    reactions() {
      return AlchemyReactions.all.compact().filter(r => r.product.isUnlocked);
    },
    isDoomed() {
      return Pelle.isDoomed;
    },
    pelleSymbol() {
      return Pelle.symbol;
    },
    shouldDisplayPelle() {
      return this.PelleStage() !== -1;
    },
    PelleClass() {
      return {
        "c-pelle-symbol-overlay": true,
        "c-pelle-symbol-overlay-tier0": this.PelleStage() === 0,
        "c-pelle-symbol-overlay-tier1": this.PelleStage() === 1,
        "c-pelle-symbol-overlay-tier2": this.PelleStage() === 2,
        "c-pelle-symbol-overlay-tier3": this.PelleStage() === 3,
        "c-pelle-symbol-overlay-tier4": this.PelleStage() === 4,
      };
    }
  },
  methods: {
    update() {
      this.reactionsAvailable = AlchemyResources.all.filter(res => !res.isBaseResource && res.isUnlocked).length !== 0;
      this.realityCreationVisible = Ra.pets.effarig.level >= 25;
      this.animationTimer += 35;
      this.alchemyCap = Ra.alchemyResourceCap;
      this.capFactor = 1 / GlyphSacrificeHandler.glyphRefinementEfficiency;
      this.createdRealityGlyph = player.reality.glyphs.createdRealityGlyph;
      this.allReactionsDisabled = this.reactions.every(reaction => !reaction.isActive);
      this.realityAmount = AlchemyResource.reality.amount;
    },
    orbitSize(orbit) {
      const maxRadius = this.layout.orbits.map(o => o.radius).max();
      return `${(orbit.radius / maxRadius * 50)}%`;
    },
    handleMouseEnter(node) {
      this.infoResourceId = node.resource.id;
      if (node.resource.isUnlocked) {
        this.focusedResourceId = node.resource.id;
      }
    },
    handleMouseLeave() {
      this.focusedResourceId = -1;
    },
    handleClick(node) {
      const resource = node.resource;
      if (!resource.isUnlocked) return;
      if (this.infoResourceId !== resource.id) {
        this.infoResourceId = resource.id;
        this.focusedResourceId = resource.id;
        return;
      }
      if (resource.isBaseResource) return;
      resource.reaction.isActive = !resource.reaction.isActive;
      GameUI.update();
    },
    isUnlocked(reactionArrow) {
      return reactionArrow.product.resource.isUnlocked && reactionArrow.reagent.resource.isUnlocked;
    },
    isCapped(reactionArrow) {
      const inRes = reactionArrow.reagent.resource;
      const outRes = reactionArrow.product.resource;
      // We render the reaction as capped if it won't trigger; this can happen under two conditions - either the
      // output is higher than this particular input amount, or it's at its cap due to a different input
      return (outRes.amount > 0 && outRes.amount >= inRes.amount) || outRes.amount >= outRes.cap;
    },
    isLessThanRequired(reactionArrow) {
      return reactionArrow.product.resource.amount > 0 &&
        reactionArrow.reagent.cost < reactionArrow.reagent.resource.cap;
    },
    isActiveReaction(reactionArrow) {
      return reactionArrow.reaction.isActive && !this.isDoomed;
    },
    isFocusedReaction(reactionArrow) {
      if (this.isDoomed) return false;
      return this.isUnlocked(reactionArrow) && (reactionArrow.product.resource.id === this.focusedResourceId ||
        reactionArrow.reagent.resource.id === this.focusedResourceId);
    },
    isDisplayed(reactionArrow) {
      return this.isUnlocked(reactionArrow) &&
        (this.isActiveReaction(reactionArrow) || this.isFocusedReaction(reactionArrow));
    },
    isFocusedNode(node) {
      if (this.focusedResourceId === -1 || this.isDoomed) return true;
      const focusedResource = this.resources[this.focusedResourceId];
      if (focusedResource === node.resource) return true;
      return focusedResource.reaction?.reagents.some(r => r.resource === node.resource) ||
        node.resource.reaction?.reagents.some(r => r.resource === focusedResource);
    },
    reactionArrowPositions(reactionArrow) {
      if (!this.isDisplayed(reactionArrow) || this.isCapped(reactionArrow)) return undefined;
      const xStart = reactionArrow.reagent.x;
      const yStart = reactionArrow.reagent.y;
      const xEnd = reactionArrow.product.x;
      const yEnd = reactionArrow.product.y;
      const pathLength = Math.sqrt(Math.pow(xEnd - xStart, 2) + Math.pow(yEnd - yStart, 2));
      const animationTime = pathLength * 40;
      const reactionProgress = (this.animationTimer % animationTime) / animationTime;
      const leadPoint = Math.max(0, reactionProgress + 2 / pathLength);
      const trailPoint = Math.min(1, reactionProgress - 2 / pathLength);
      return {
        x1: `${xStart * (1 - leadPoint) + xEnd * leadPoint}%`,
        y1: `${yStart * (1 - leadPoint) + yEnd * leadPoint}%`,
        x2: `${xStart * (1 - trailPoint) + xEnd * trailPoint}%`,
        y2: `${yStart * (1 - trailPoint) + yEnd * trailPoint}%`,
      };
    },
    reactionArrowPaths(reactionArrow) {
      return {
        x1: `${reactionArrow.reagent.x}%`,
        y1: `${reactionArrow.reagent.y}%`,
        x2: `${reactionArrow.product.x}%`,
        y2: `${reactionArrow.product.y}%`,
      };
    },
    reactionPathClass(reactionArrow) {
      return {
        "o-alchemy-reaction-path": this.isUnlocked(reactionArrow),
        "o-alchemy-reaction-path--capped": this.isCapped(reactionArrow) && this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-path--less-than-required": this.isLessThanRequired(reactionArrow) &&
          this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-path--focused": !this.isCapped(reactionArrow) && this.isFocusedReaction(reactionArrow),
        "o-alchemy-reaction-path--not-focused": !this.isFocusedReaction(reactionArrow) && this.focusedResourceId !== -1,
        "o-alchemy-reaction-path--doomed": this.isDoomed
      };
    },
    reactionArrowClass(reactionArrow) {
      return {
        "o-alchemy-reaction-arrow": !this.isCapped(reactionArrow) && this.isDisplayed(reactionArrow),
        "o-alchemy-reaction-arrow--focused": this.isFocusedReaction(reactionArrow),
      };
    },
    showAlchemyHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Glyph Alchemy")[0];
      Modal.h2p.show();
    },
    toggleAllReactions() {
      AlchemyResources.setAllReactions(this.allReactionsDisabled);
    },
    resetAlchemy() {
      AlchemyResources.reset();
    },
    createRealityGlyph() {
      if (ExpansionPack.effarigPack.isBought && !player.disablePostReality) {
        AlchemyResources.createRealityGlyph();
      } else {
        Modal.realityGlyph.show();
      }
    },
    nodeClass(node) {
      const resource = node.resource;
      return {
        "o-clickable": resource.isUnlocked && !resource.isBaseResource && !this.isDoomed
      };
    },
    PelleStage() {
      if (!this.isDoomed) return -1;
      if (AlchemyResource.power.isDestroyed || AlchemyResource.infinity.isDestroyed || AlchemyResource.time.isDestroyed ||
        AlchemyResource.replication.isDestroyed || AlchemyResource.dilation.isDestroyed || AlchemyResource.effarig.isDestroyed) return 0;
      if (AlchemyResource.cardinality.isDestroyed || AlchemyResource.eternity.isDestroyed || AlchemyResource.dimensionality.isDestroyed ||
        AlchemyResource.inflation.isDestroyed || AlchemyResource.alternation.isDestroyed) return 1;
      if (AlchemyResource.synergism.isDestroyed || AlchemyResource.momentum.isDestroyed || AlchemyResource.decoherence.isDestroyed) return 2;
      if (AlchemyResource.exponential.isDestroyed || AlchemyResource.force.isDestroyed || AlchemyResource.uncountability.isDestroyed ||
        AlchemyResource.boundless.isDestroyed || AlchemyResource.multiversal.isDestroyed || AlchemyResource.unpredictability.isDestroyed) return 3;
      if (AlchemyResource.reality.isDestroyed) return 4;
      return -1;
    }
  }
};
</script>

<template>
  <div class="l-ra-alchemy-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="showAlchemyHowTo"
      >
        Click for alchemy info
      </PrimaryButton>
      <PrimaryButton
        v-if="!isDoomed"
        class="o-primary-btn--subtab-option"
        @click="toggleAllReactions"
      >
        {{ allReactionsDisabled ? "Enable" : "Disable" }} all reactions
      </PrimaryButton>
      <PrimaryButton
        v-if="realityCreationVisible"
        :class="realityGlyphCreationClass"
        @click="createRealityGlyph"
      >
        View Reality Glyph creation
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="resetAlchemy"
      >
        Force-reset all Alchemy resources
      </PrimaryButton>
    </div>
    <AlchemyResourceInfo
      :key="infoResourceId"
      :resource="infoResource"
    />
    <br>
    Glyphs can now be refined using your Glyph filter in the Glyphs tab.
    <br>
    When refining a Glyph, it will only give you resources up to a cap
    of {{ formatX(capFactor) }} its highest refinement value.
    <span v-if="reactionsAvailable">
      Reactions trigger once every time you Reality, unaffected by amplification from stored real time.
    </span>
    <div
      class="l-alchemy-circle"
      :style="circleStyle"
    >
      <span
        v-if="shouldDisplayPelle"
        :class="PelleClass"
        v-html="pelleSymbol"
      />
      <svg class="l-alchemy-orbit-canvas">
        <circle
          v-for="(orbit, i) in layout.orbits"
          :key="i"
          cx="50%"
          cy="50%"
          class="o-alchemy-orbit"
          :r="orbitSize(orbit)"
          :class="orbitClass"
        />
      </svg>
      <AlchemyCircleNode
        v-for="(node, i) in layout.nodes"
        :key="i"
        :node="node"
        :is-focused="isFocusedNode(node)"
        :class="nodeClass(node)"
        @mouseenter="handleMouseEnter(node)"
        @mouseleave="handleMouseLeave"
        @click="handleClick(node)"
      />
      <svg class="l-alchemy-arrow-canvas">
        <line
          v-for="(reactionArrow, idx) in layout.reactionArrows"
          :key="'arrow-' + idx + realityAmount"
          v-bind="reactionArrowPaths(reactionArrow)"
          :class="reactionPathClass(reactionArrow)"
        />
        <line
          v-for="(reactionArrow, idx) in layout.reactionArrows"
          :key="'arrow2-' + idx + realityAmount"
          v-bind="reactionArrowPositions(reactionArrow)"
          :class="reactionArrowClass(reactionArrow)"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.o-clickable {
  cursor: pointer;
}

.c-pelle-symbol-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  justify-content: center;
  align-items: center;
  color: var(--color-pelle--base);
  text-shadow: 0 0 3rem;
  pointer-events: none;
  user-select: none;
  opacity: 0.8;
  z-index: 2;
}

.c-pelle-symbol-overlay-tier0 {
  font-size: 60rem;
  top: -1.5rem;
}
.c-pelle-symbol-overlay-tier1 {
  font-size: 45rem;
  top: -1.125rem;
}
.c-pelle-symbol-overlay-tier2 {
  font-size: 30rem;
}
.c-pelle-symbol-overlay-tier3 {
  font-size: 20rem;
  top: -0.5rem;
}
.c-pelle-symbol-overlay-tier4 {
  font-size: 5rem;
}
</style>
