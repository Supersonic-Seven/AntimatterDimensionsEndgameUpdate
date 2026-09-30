<script>
import wordShift from "@/core/word-shift";

import AcceleratorsPanel from "./AcceleratorsPanel";
import NullUpgradesTabComponent from "./NullUpgradesTabComponent";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "LargeHadronColliderTab",
  components: {
    AcceleratorsPanel,
    NullUpgradesTabComponent,
    PrimaryButton
  },
  data() {
    return {
      hasAccelerator: false,
      canSeeEntropy1: false,
      canSeeEntropy2: false,
      entropyCorrupted: false,
      textShift: [],
      hadronSpeed: 0,
      accelPower: 1,
      amSoftcap: new Decimal(),
      amSoftcap2: new Decimal(),
      amHardcap: new Decimal(),
      isRunning: false,
      highestAntimatter: new Decimal(),
      nullMatter: new Decimal(),
      nullPerSecond: new Decimal(),
      nullified: false,
      voidMode: 0,
      nullParticles: new Decimal(),
      nullParticlesPerSecond: new Decimal(),
      nullParticleEffect: new Decimal(),
      hasC: false,
      c: 0,
      milestonesReached: 0,
      nextAt: 0,
      tessEqual: 0,
      antiEqual: new Decimal(),
      tickEqual: new Decimal(),
      bh1Improve: new Decimal(),
      bh2Improve: new Decimal(),
      potencyImprove: new Decimal(),
      isFlipped: false
    };
  },
  computed: {
    hadronSpeedText() {
      if (this.hadronSpeed === 0) return `Your Hadrons are stationary`;
      if (this.hadronSpeed >= 149896229) return `Your Hadrons are moving
        at ${formatHybridLarge(this.hadronSpeed, 3)} m/s (${format(this.c, 5, 5)}C)`;
      if (this.hadronSpeed >= 1000) return `Your Hadrons are moving at ${formatHybridLarge(this.hadronSpeed, 3)} m/s`;
      return `Your Hadrons are moving at ${format(this.hadronSpeed, 3, 3)} m/s`;
    },
    modeDisplay() {
      return this.voidMode === 0
        ? "Void Mode: Normal"
        : "Void Mode: Nullified";
    },
    voidText() {
      return this.isRunning ? "[Exit the Void.]" : "[Enter the Void.]";
    },
    runButtonOuterClass() {
      return {
        "l-void-run-button": true,
        "c-void-run-button": true,
        "c-void-run-button--running": this.isRunning,
        "c-void-run-button--not-running": !this.isRunning,
      };
    },
    nextDisplay() {
      return this.milestonesReached >= 5 ? "There are no more milestones to be reached!" :
        `Next C Milestone at ${format(this.nextAt, 2, 2)}C.`;
    }
  },
  methods: {
    update() {
      this.hasAccelerator = Accelerators.all.some(a => a.isUnlocked);
      this.canSeeEntropy1 = player.records.totalAntimatterOutsideDoom.gte(Decimal.pow10(1e200)) && !Slabdrill.isCursed;
      this.canSeeEntropy2 = player.records.totalAntimatterOutsideDoom.gte(Decimal.pow10(1e260)) && !Pelle.isDoomed && !Slabdrill.isCursed;
      this.entropyCorrupted = Slabdrill.isCursed;
      this.textShift = ["Glitched", "Corrupted", "Disrupted"];
      this.hadronSpeed = LHC.hadronSpeed;
      this.accelPower = LHC.acceleratorSpeed * 100000;
      this.amSoftcap.copyFrom(Pelle.isDoomed ? DC.E9E15 : Decimal.pow10(1e200));
      this.amSoftcap2.copyFrom(Decimal.pow10(1e260));
      this.amHardcap.copyFrom(Pelle.isDoomed ? DC.ENUMMAX : LHC.breakingPoint);
      this.isRunning = LHC.voidRunning || LHC.nullifiedVoidRunning;
      this.highestAntimatter.copyFrom(player.endgame.largeHadronCollider.void.highestAntimatter);
      this.nullMatter.copyFrom(player.endgame.largeHadronCollider.void.nullMatter);
      this.nullPerSecond.copyFrom(!LHC.voidRunning ? DC.D0 :
        Decimal.log10(Decimal.pow(AntimatterDimension(1).productionPerSecond, 0.01).max(1)).pow(
        Decimal.log10(Decimal.log10(Decimal.pow(AntimatterDimension(1).productionPerSecond, 0.01).max(1)).max(1))));
      this.nullified = player.endgame.largeHadronCollider.void.nullified;
      this.voidMode = player.endgame.largeHadronCollider.void.mode;
      this.nullParticles.copyFrom(player.endgame.largeHadronCollider.void.nullParticles);
      this.nullParticlesPerSecond.copyFrom(!LHC.nullifiedVoidRunning ? DC.D0 : getNullParticleGainPerSecond());
      this.nullParticleEffect.copyFrom(Currency.nullParticles.value.max(1).log10().div(5).add(1).pow(5));
      this.hasC = LHC.hadronC >= 0.5;
      this.c = LHC.hadronC;
      this.milestonesReached = CMilestones.reachedMilestones;
      this.nextAt = CMilestones.nextMilestoneAt;
      this.tessEqual = CMilestones.tesseractEqualizer(Tesseracts.bought, Tesseracts.extra);
      this.antiEqual.copyFrom(CMilestones.antimatterEqualizer(
        (Laitela.continuumActive ? AntimatterDimension(1).continuumAmount : AntimatterDimension(1).amount).times(
        AntimatterDimension(1).multiplier), Tickspeed.perSecond));
      this.tickEqual.copyFrom(CMilestones.tickspeedEqualizer(
        Laitela.continuumActive ? Tickspeed.continuumValue : player.totalTickBought, player.totalTickGained));
      this.bh1Improve.copyFrom(CMilestones.bhImprovement(BlackHole(1).power));
      this.bh2Improve.copyFrom(CMilestones.bhImprovement(BlackHole(2).power));
      this.potencyImprove.copyFrom(CMilestones.potencyImprovement(Accelerators.potency.effectValue3));
      this.isFlipped = player.universes.current === 2;
    },
    formatNullAmount(amount) {
      return amount.gte(DC.NUMMAX) && !DualityUpgrade(26).isBought ? Notations.current.infinite : format(amount, 2, 2);
    },
    glitchAnim() {
      let flux = Math.random() / (this.voidMode === 1 ? 2 : 4);
      let negFlux = -flux;
      return {
        "text-shadow": `${negFlux}rem 0 red, ${flux}rem 0 blue`,
      };
    },
    corruptionText() {
      return `WARNING: The ${player.universes.current === 2 ? "Matter" : "Antimatter"} Hardcap has become ${wordShift.wordCycle(this.textShift)}.`;
    },
    startRun() {
      if (this.voidMode === 1) {
        if (this.isRunning) exitNullifiedVoid();
        else enterNullifiedVoid();
      }
      else {
        if (this.isRunning) exitTheVoid();
        else enterTheVoid();
      }
    },
    changeMode() {
      if (this.isRunning) return;
      player.endgame.largeHadronCollider.void.mode = (player.endgame.largeHadronCollider.void.mode + 1) % 2;
    }
  }
};
</script>

<template>
  <div class="l-large-hadron-collider-tab">
    <div class="l-large-hadron-collider-all-content-container">
      <div
        v-if="hasAccelerator"
        class="c-large-hadron-collider-description"
      >
        {{ hadronSpeedText }}
        <br>
        The Large Hadron Collider is currently consuming {{ formatInt(accelPower) }} GWh of power
        <div
          v-if="hasC"
          class="c-large-hadron-collider-text"
        >
          <br>
          <div v-if="milestonesReached >= 1">
            C Milestone {{ formatInt(1) }}: Tesseract Equalizer.
            Effective Tesseracts are slowly shifting from (bought + free) into (bought * free).
            This shift is {{ formatPercents(Math.clamp((c - 0.5) * 2, 0, 1), 3, 3) }} complete, making the current
            number of Effective Tesseracts equal to {{ format(tessEqual, 2, 2) }}.
          </div>
          <div v-if="milestonesReached >= 2">
            <br>
            C Milestone {{ formatInt(2) }}: {{ isFlipped ? "Matter" : "Antimatter" }} Equalizer.
            {{ isFlipped ? "Matter" : "Antimatter" }} production is slowly shifting from
            ({{ isFlipped ? "MDMults" : "ADMults" }} * Tickspeed) into
            ({{ isFlipped ? "MDMults" : "ADMults" }}^log10(max(Tickspeed, 1))).
            This shift is {{ formatPercents(Math.clamp((c - 0.7) * 10/3, 0, 1), 3, 3) }} complete, making current
            {{ isFlipped ? "Matter" : "Antimatter" }} production equal to {{ format(antiEqual, 2, 2) }}.
          </div>
          <div v-if="milestonesReached >= 3">
            <br>
            C Milestone {{ formatInt(3) }}: Tickspeed Equalizer.
            Effective Tickspeed Upgrades are slowly shifting from (bought + free) into (bought * free).
            This shift is {{ formatPercents(Math.clamp((c - 0.85) * 20/3, 0, 1), 3, 3) }} complete, making the current
            number of Effective Tickspeed Upgrades equal to {{ format(tickEqual, 2, 2) }}.
          </div>
          <div v-if="milestonesReached >= 4">
            <br>
            C Milestone {{ formatInt(4) }}: Black Hole and Potency Improvement.
            Black Holes now also apply a power effect which is increasing from 1 to log10(log10(max(BHMult, 10))) + 1.
            Furthermore, the Divine Matter/Energy multiplier from the Potency Accelerator now also applies a power effect
            which is increasing from 1 to (max(log10(max(PotencyMult, 1)) - 18.5, 0) / 3) + 1.
            These shifts are {{ formatPercents(Math.clamp((c - 0.95) * 20, 0, 1), 3, 3) }} complete, making the current
            Black Hole {{ formatInt(1) }} boost equal to {{ formatPow(bh1Improve, 2, 3) }}, the current
            Black Hole {{ formatInt(2) }} boost equal to {{ formatPow(bh2Improve, 2, 3) }}, and the current
            Divine Matter/Energy boost from the Potency Accelerator equal to {{ formatPow(potencyImprove, 2, 3) }}.
          </div>
          <div v-if="milestonesReached >= 5">
            <br>
            C Milestone {{ formatInt(5) }}: Light unlock.
            You have reached {{ formatInt(1) }}C and can now generate Light (coming soon).
          </div>
          <br>
          <div>
            {{ nextDisplay }}
          </div>
        </div>
      </div>
      <AcceleratorsPanel v-if="hasAccelerator" />
      <div
        v-if="!hasAccelerator"
        class="c-large-hadron-collider-description"
      >
        Reach {{ format(Decimal.pow10(1e200), 2, 2) }} {{ isFlipped ? "Matter" : "Antimatter" }}
      </div>
      <div
        class="c-large-hadron-collider-entropy"
        v-if="canSeeEntropy1"
      >
        Excess Entropy in the universe has caused your {{ isFlipped ? "Matter" : "Antimatter" }} to
        decay past {{ format(amSoftcap, 2, 2) }}, and has restricted it from exceeding {{ format(amHardcap, 2, 2) }}.
      </div>
      <div
        class="c-large-hadron-collider-entropy"
        v-if="canSeeEntropy2"
      >
        The {{ isFlipped ? "Matter" : "Antimatter" }} decay is significantly stronger past {{ format(amSoftcap2, 2, 2) }}.
      </div>
      <div
        class="c-large-hadron-collider-entropy"
        v-if="entropyCorrupted"
      >
        {{ corruptionText() }}
      </div>
    </div>
    <br>
    <br>
    <div v-if="highestAntimatter.gt(10)">
      <span class="c-void-antimatter-amount">
        [Your highest {{ isFlipped ? "Matter" : "Antimatter" }} inside The Void is {{ format(highestAntimatter, 2, 1) }}.]
      </span>
      <br>
      <span class="c-null">[You have {{ formatNullAmount(nullMatter) }} Null Matter. +{{ formatNullAmount(nullPerSecond) }}/s]</span>
    </div>
    <div v-if="nullified">
      <span class="c-null">[You have {{ format(nullParticles, 2, 2) }} Null Particles. +{{ format(nullParticlesPerSecond, 2, 2) }}/s]</span>
    </div>
    <div class="l-void-run">
      <div
        :class="runButtonOuterClass"
        @click="startRun"
      >
        <div
          :button-symbol="voidText"
          :style="glitchAnim()"
        >
          {{ voidText }}
        </div>
      </div>
    </div>
    <PrimaryButton
      v-if="nullified"
      class="o-primary-btn--subtab-option"
      @click="changeMode"
    >
      {{ modeDisplay }}
    </PrimaryButton>
    <div v-if="voidMode === 0">
      Entering The Void will force an Endgame reset and disable all Reality and beyond mechanics.
      <br>
      Your {{ isFlipped ? "Matter" : "Antimatter" }} will slowly decay and you will gain Null Matter from the decayed {{ isFlipped ? "Matter" : "Antimatter" }}.
      <span v-if="nullified">
        <br>
        Since you Nullified the Multiverse, the ANR Perk and Passive EP Generation are reenabled inside The Void.
      </span>
    </div>
    <div v-if="voidMode === 1">
      Entering The Void in Nullified Mode will force an Endgame reset and Dilate your {{ isFlipped ? "Matter" : "Antimatter" }} by {{ format(0.01, 2, 2) }}.
      <br>
      You will generate Null Particles based on your {{ isFlipped ? "Matter" : "Antimatter" }}, which empower
      {{ isFlipped ? "Matter" : "Antimatter" }} Dimensions while inside The Void in normal mode (Currently: {{ formatPow(nullParticleEffect, 2, 3) }}).
    </div>
    <NullUpgradesTabComponent />
  </div>
</template>

<style scoped>
.l-large-hadron-collider-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.l-large-hadron-collider-all-content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.c-large-hadron-collider-description {
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-alpha--base);
}

.c-large-hadron-collider-text {
  margin-left: 5rem;
  margin-right: 5rem;
  position: relative;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-alpha--base);
}

.c-large-hadron-collider-entropy {
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  color: red;
}

.c-void-antimatter-amount {
  position: relative;
  font-size: 1rem;
  color: red;
}

.c-null {
  position: relative;
  font-size: 2rem;
  color: black;
  text-shadow: 0 0 0.2rem white;
}
</style>
