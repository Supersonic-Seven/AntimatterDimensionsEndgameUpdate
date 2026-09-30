<script>
import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer";

export default {
  name: "HeaderPrestigeGroup",
  components: {
    HeaderCenterContainer,
    HeaderEternityContainer,
    HeaderInfinityContainer,
  },
  data() {
    return {
      isDestroyed: false,
      isDivine: false,
      hasRealityButton: false,
      amount: new Decimal(0),
      antimatterPerSec: new Decimal(0),
      antimatterPerSecBeforeAlter: new Decimal(0),
      antimatterPerSecAfterAlter: new Decimal(0),
      hasSeenAlterations: false,
      inCursedCore: false,
      isFlipped: false
    };
  },
  computed: {
    alterText() {
      if (!this.hasSeenAlterations) return "before";
      return `before any ${this.isFlipped ? "matter" : "antimatter"} production alterations and`;
    }
  },
  methods: {
    update() {
      this.isDestroyed = Alpha.isDestroyedForDisplay;
      this.isDivine = DivinityMilestone.divineDimensions.isReached;
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.amount = Laitela.continuumActive ? AntimatterDimension(1).continuumAmount : AntimatterDimension(1).amount;
      this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
      this.antimatterPerSecBeforeAlter.copyFrom(
        CMilestones.antimatterEqualizer(this.amount.times(AntimatterDimension(1).multiplier), Tickspeed.perSecond).times(
          NormalChallenge(2).isRunning ? player.chall2Pow : 1).times(NormalChallenge(3).isRunning ? player.chall3Pow : 1)
      );
      this.antimatterPerSecAfterAlter.copyFrom(
        this.locallyDilate(CMilestones.antimatterEqualizer(this.amount.times(AntimatterDimension(1).multiplier), Tickspeed.perSecond)
          .times(NormalChallenge(2).isRunning ? player.chall2Pow : 1).times(NormalChallenge(3).isRunning ? player.chall3Pow : 1).pow(
          Accelerators.potency.effectValue1).powEffectOf(ResurgenceUpgrade.synergy5))
      );
      this.hasSeenAlterations = EffarigUnlock.reality.isUnlocked || PlayerProgress.endgameUnlocked();
      this.inCursedCore = player.celestials.slabdrill.core.isActive;
      this.isFlipped = player.universes.current === 2;
    },
    locallyDilate(multiplier) {
      const log10 = multiplier.log10();
      const eg = Currency.endgames.value;
      const endgameMult = Pelle.isDoomed ? 1 + (Math.log10(Math.min(eg, 1e6) * Math.max(Math.log2(eg + 1) - Math.log2(5e5), 1) + 1) / 80) : 1 + (Math.log10(Math.min(eg, 1e6) * Math.max(Math.log2(eg + 1) - Math.log2(5e5), 1) + 1) / 200);
      const endgameMultValue = (EndgameMilestone.endgameAntimatter.isReached && !player.disablePostReality) ? endgameMult : 1;
      const pelleOnly = Pelle.isDoomed ? DivineDimensions.conversionFormula2 * Accelerators.cosmic.effectValue2 * EndgameMastery(222).effectOrDefault(1) * SingularityMilestone.singAMDoomDilation.effectOrDefault(1) * EndgameMastery(301).effectOrDefault(DC.D1).toNumber() : 1;
      return Decimal.pow10(Decimal.pow(log10, getAdjustedGlyphEffect("effarigantimatter") * Effects.product(EndgameMastery(101), EndgameUpgrade(15), SingularityMilestone.antimatterExponentPower, Achievement(233)) * endgameMultValue * EtherealStars.black.reward.toNumber() * pelleOnly));
    },
    classObject() {
      return {
        "c-prestige-info-blocks": true,
        "c-prestige-info-blocks--tall": this.isDestroyed && !this.isDivine && !this.inCursedCore,
        "c-prestige-info-blocks--taller": this.isDivine && !this.inCursedCore
      };
    }
  }
};
</script>

<template>
  <div>
    <div :class="classObject()">
      <HeaderEternityContainer v-if="!inCursedCore" class="l-game-header__eternity" />
      <HeaderCenterContainer class="l-game-header__center" />
      <HeaderInfinityContainer v-if="!inCursedCore" class="l-game-header__infinity" />
    </div>
    <div
      v-if="hasRealityButton && !inCursedCore"
      class="c-production-text"
    >
      <br>
      You are getting {{ format(antimatterPerSec, 2) }} {{ isFlipped ? "matter" : "antimatter" }} per second.
      <br>
      You are getting {{ format(antimatterPerSecBeforeAlter, 2) }} {{ isFlipped ? "matter" : "antimatter" }}
      per second {{ alterText }} Game Speed effects.
    </div>
    <div
      v-if="hasRealityButton && hasSeenAlterations && !inCursedCore"
      class="c-prevent-overflow"
    >
      You are getting {{ format(antimatterPerSecAfterAlter, 2) }} {{ isFlipped ? "matter" : "antimatter" }} per second
      after positive {{ isFlipped ? "matter" : "antimatter" }} production alterations, and before negative
      {{ isFlipped ? "matter" : "antimatter" }} production alterations, any positive {{ isFlipped ? "matter" : "antimatter" }}
      production alterations that apply after certain negative ones, and Game Speed effects.
    </div>
  </div>
</template>

<style scoped>
.c-prevent-overflow {
  margin-left: 5rem;
  margin-right: 5rem;
  color: var(--color-text);
}

.c-production-text {
  color: var(--color-text);
}

.c-prestige-info-blocks {
  display: flex;
  flex-direction: row;
  height: 14rem;
  width: 100%;
  color: var(--color-text);
}

.c-prestige-info-blocks--tall {
  height: 24rem;
}

.c-prestige-info-blocks--taller {
  height: 30rem;
}

.l-game-header__eternity {
  position: absolute;
  left: calc(25% - 22rem);
  width: 22rem;
}

.l-game-header__center {
  position: absolute;
  right: calc(50% - 25rem);
  width: 50rem;
}

.l-game-header__infinity {
  position: absolute;
  right: calc(25% - 22rem);
  width: 22rem;
}
</style>
