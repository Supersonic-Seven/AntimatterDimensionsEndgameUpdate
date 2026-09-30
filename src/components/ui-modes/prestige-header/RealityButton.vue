<script>
export default {
  name: "RealityButton",
  data() {
    return {
      canReality: false,
      showSpecialEffect: false,
      beatingAlpha: false,
      readyToWarp: false,
      isWarping: false,
      cursed: false,
      trapped: false,
      overridden: false,
      destroyed: false,
      hasRealityStudy: false,
      machinesGained: new Decimal(),
      projectedRM: new Decimal(),
      newIMCap: new Decimal(),
      newDMCap: new Decimal(),
      realityTime: 0,
      glyphLevel: new Decimal(),
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: new Decimal(0),
      currentShardsRate: new Decimal(0),
      bestShardRate: new Decimal(0),
      bestShardRateVal: new Decimal(0),
      ppGained: 0,
      celestialRunText: ["", "", "", "", ""]
    };
  },
  computed: {
    formatMachinesGained() {
      if (this.machinesGained.gt(0)) return `Machines gained: ${format(this.machinesGained, 2)}`;
      return "No Machines gained";
    },
    formatMachineStats() {
      if (!PlayerProgress.realityUnlocked() && this.nextMachineEP.gt("1e8000")) {
        return `(Capped this Reality!)`;
      }
      if (this.machinesGained.gt(0) && this.machinesGained.lt(100)) {
        return `(Next at ${format(this.nextMachineEP, 2)} EP)`;
      }
      if (this.machinesGained.eq(0) && this.newIMCap.eq(0)) {
        return `(Projected: ${format(this.projectedRM, 2)} RM)`;
      }
      if (this.newIMCap.neq(0) && this.newDMCap.eq(0)) {
        return `(iM Cap: ${formatMachines(0, this.newIMCap, 0)})`;
      }
      if (this.newDMCap.neq(0)) {
        return `(jM Cap: ${formatMachines(0, 0, this.newDMCap)})`;
      }
      if (this.machinesGained.lt(Number.MAX_VALUE)) {
        return `(${format(this.machinesGained.divide(this.realityTime), 2, 2)} RM/min)`;
      }
      return "";
    },
    formatGlyphLevel() {
      if (this.glyphLevel.gte(10000)) return `Glyph level: ${formatHybridLarge(this.glyphLevel, 3)}`;
      return `Glyph level: ${formatHybridLarge(this.glyphLevel, 3)} (${this.nextGlyphPercent} to next)`;
    },
    showsRate() {
      return this.currentsRate;
    },
    shardsGainedText() {
      return quantify("Relic Shard", this.shardsGained, 2);
    },
    warpMessage() {
      return this.isWarping ? "Curse Your Reality" : "Enter Pelle's Domain";
    },
    classObject() {
      return {
        "c-reality-button--unlocked": this.canReality || (this.readyToWarp && !this.destroyed),
        "c-reality-button--locked": !this.canReality && (!this.readyToWarp || this.destroyed),
        "c-reality-button--special": this.showSpecialEffect,
        "c-reality-button--alpha": this.beatingAlpha,
        "c-reality-button--warp": this.readyToWarp && !this.cursed && !this.destroyed,
        "c-reality-button--cursed": this.cursed && (!this.canReality || this.trapped) && !this.overridden,
        "c-reality-button--escape": this.cursed && this.canReality && (!this.trapped || this.overridden)
      };
    }
  },
  methods: {
    percentToNextGlyphLevelText() {
      const glyphState = getGlyphLevelInputs();
      let level = glyphState.actualLevel;
      const decimalPoints = this.glyphLevel.gt(1000) ? 0 : 1;
      return `${formatDecimalPercents(Decimal.min(((level.sub(Decimal.floor(level)))), 0.999), decimalPoints)}`;
    },
    update() {
      this.hasRealityStudy = TimeStudy.reality.isBought;
      this.canReality = isRealityAvailable();
      this.showSpecialEffect = this.hasSpecialReward();
      this.beatingAlpha = Alpha.isRunning && Currency.eternityPoints.value.add(1).log10().gt(4000);
      this.readyToWarp = CelestialEternityPlusUpgrade.oldStoneSlabAndSteelDrill.isBought;
      this.isWarping = player.celestials.slabdrill.isWarping;
      this.cursed = Slabdrill.isCursed;
      this.trapped = player.celestials.slabdrill.goodbyeTick >= 3000;
      this.overridden = player.records.totalRealityAntimatter.gte(DC.ENUMMAX);
      this.destroyed = Slabdrill.isDestroyed;
      if (!this.canReality) {
        this.sGained = new Decimal(0);
        return;
      }
      function EPforRM(rm) {
        const adjusted = Decimal.divide(rm, MachineHandler.realityMachineMultiplier);
        if (adjusted.lte(1)) return Decimal.pow10(4000);
        if (adjusted.lte(10)) return Decimal.pow10(4000 / 27 * (adjusted.toNumber() + 26));
        let result = Decimal.pow10((adjusted.log10().div(3).add(1)).times(4000));
        if (!PlayerProgress.realityUnlocked() && result.gte("1e6000")) {
          result = result.div("1e6000").pow(4).times("1e6000");
        }
        return result;
      }

      const multiplier = simulatedRealityCount(false) + 1;
      this.projectedRM = MachineHandler.gainedRealityMachines.times(multiplier)
        .clampMax(MachineHandler.hardcapRM);
      this.newIMCap.copyFrom(MachineHandler.projectedIMCap);
      this.newDMCap.copyFrom(MachineHandler.projectedDMCap);
      this.machinesGained = this.projectedRM.clampMax(MachineHandler.distanceToRMCap);
      this.realityTime = Time.thisRealityRealTime.totalMinutes.toNumber();
      this.glyphLevel.copyFrom(gainedGlyphLevel().actualLevel);
      this.nextGlyphPercent = this.percentToNextGlyphLevelText();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.ppGained = multiplier;
      this.shardsGained.copyFrom(Effarig.shardsGained.times(multiplier));
      this.currentShardsRate.copyFrom(this.shardsGained.div(Time.thisRealityRealTime.totalMinutes));
      this.bestShardRate.copyFrom(player.records.thisReality.bestRSmin.times(multiplier));
      this.bestShardRateVal.copyFrom(player.records.thisReality.bestRSminVal.times(multiplier));

      const teresaReward = this.formatScalingMultiplierText(
        "Glyph Sacrifice",
        Teresa.runRewardMultiplier,
        Decimal.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(Currency.antimatter.value)));
      const teresaThreshold = this.formatThresholdText(
        Teresa.rewardMultiplier(Currency.antimatter.value).gt(Teresa.runRewardMultiplier),
        player.celestials.teresa.bestRunAM,
        "antimatter");
      this.celestialRunText = [
        [Teresa.isRunning, teresaReward, teresaThreshold]];
    },
    handleClick() {
      if (this.cursed && this.canReality && this.overridden) {
        Modal.trueEscape.show();
      }
      else if (this.cursed && this.canReality && !this.trapped) {
        Modal.exitCurse.show();
      }
      else if (this.readyToWarp && !this.isWarping && !this.cursed && !this.destroyed) {
        requestRealityWarp();
      }
      else if (this.canReality && (!this.trapped || this.destroyed)) {
        requestManualReality();
      }
    },
    formatScalingMultiplierText(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    },
    formatThresholdText(condition, threshold, resourceName) {
      if (condition) return "";
      return `(${format(threshold, 2, 2)} ${resourceName} to improve)`;
    },
    // Make the button have a visual animation if Realitying will give a reward
    hasSpecialReward() {
      if (Teresa.isRunning && Teresa.rewardMultiplier(Currency.antimatter.value).gt(Teresa.runRewardMultiplier)) {
        return true;
      }
      return Currency.eternityPoints.value.add(1).log10().gt(4000) &&
        ((Effarig.isRunning && !EffarigUnlock.reality.isUnlocked) || (Enslaved.isRunning && !Enslaved.isCompleted));
    }
  }
};
</script>

<template>
  <div class="l-reality-button">
    <button
      class="c-reality-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-reality-button__contents">
        <template v-if="cursed && canReality && overridden">
          <div>ESCAPE</div>
        </template>
        <template v-else-if="cursed && (!canReality || trapped) && !overridden">
          <div>You cannot escape a Cursed Reality</div>
        </template>
        <template v-else-if="cursed && canReality && !trapped">
          <div>Escape the Cursed Reality...</div>
        </template>
        <template v-else-if="readyToWarp && !cursed && !destroyed">
          <div>{{ warpMessage }}</div>
        </template>
        <template v-else-if="canReality">
          <div class="c-reality-button__header">
            Make a new Reality
          </div>
          <div>{{ formatMachinesGained }} {{ formatMachineStats }}</div>
          <div>{{ formatGlyphLevel }}</div>
        </template>
        <template v-else-if="hasRealityStudy">
          <div>Get {{ format("1e4000") }} Eternity Points to unlock a new Reality</div>
        </template>
        <template v-else>
          <div>Purchase the study in the Eternity tab to unlock a new Reality</div>
        </template>
        <div
          v-if="canReality && (!readyToWarp || destroyed)"
          class="infotooltiptext"
        >
          <div>Other resources gained:</div>
          <div>{{ quantifyHybridLarge("Perk Point", ppGained) }}</div>
          <div v-if="shardsGained.neq(0)">
            {{ shardsGainedText }} ({{ format(currentShardsRate, 2) }}/min)
            <br>
            Peak: {{ format(bestShardRate, 2) }}/min at {{ format(bestShardRateVal, 2) }} RS
          </div>
          <div
            v-for="(celestialInfo, i) in celestialRunText"
            :key="i"
          >
            <span v-if="celestialInfo[0]">
              {{ celestialInfo[1] }}
              <br>
              {{ celestialInfo[2] }}
            </span>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
