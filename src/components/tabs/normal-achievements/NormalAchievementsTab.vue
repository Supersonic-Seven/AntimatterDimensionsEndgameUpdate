<script>
import NormalAchievementRow from "./NormalAchievementRow";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SwapAchievementImagesButton from "./SwapAchievementImagesButton";

export default {
  name: "NormalAchievementsTab",
  components: {
    SwapAchievementImagesButton,
    NormalAchievementRow,
    PrimaryToggleButton
  },
  data() {
    return {
      achievementPower: new Decimal(0),
      achTPEffect: new Decimal(0),
      achCDEffect: new Decimal(0),
      achVDEffect: new Decimal(0),
      achEnEffect: new Decimal(0),
      achCountdown: new Decimal(0),
      totalCountdown: new Decimal(0),
      missingAchievements: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      hideCompletedRows: false,
      achMultBreak: false,
      achMultToIDS: false,
      achMultToTDS: false,
      achMultToCDS: false,
      achMultToVDS: false,
      achMultToBH: false,
      achMultToTP: false,
      achMultToTT: false,
      achMultToEnt: false,
      renderedRowIndices: [],
      showPowers: false,
      achPowers: 0,
      achPowToTP: 0,
      achPowToCD: 0,
      achPowToVD: 0,
      achPowToEn: 0,
      isFlipped: false
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    isDestroyed: () => PelleDestructionUpgrade.achievementMultiplier.canBeApplied,
    rows: () => Achievements.allRows,
    renderedRows() {
      return this.rows.filter((_, i) => this.renderedRowIndices.includes(i));
    },
    boostText() {
      const achievementPower = formatX(this.achievementPower, 2, 3);
      const achTPEffect = formatX(this.achTPEffect, 2, 3);
      const achCDEffect = formatX(this.achCDEffect, 2, 3);
      const achVDEffect = formatX(this.achVDEffect, 2, 3);
      const achEnEffect = formatX(this.achEnEffect, 2, 3);

      const boostList = [];

      const dimMultList = [];
      if (!this.isFlipped) dimMultList.push("Antimatter");
      if (this.isFlipped) dimMultList.push("Matter");
      if (this.achMultToIDS) dimMultList.push("Infinity");
      if (this.achMultToTDS) dimMultList.push("Time");
      boostList.push(`${makeEnumeration(dimMultList)} Dimensions: ${achievementPower}`);
      if (this.achMultToCDS) boostList.push(`Celestial Dimensions: ${achCDEffect}`);
      if (this.achMultToVDS) boostList.push(`Divine Dimensions: ${achVDEffect}`);

      if (this.achMultToTP) boostList.push(`Tachyon Particles: ${achTPEffect}`);
      if (this.achMultToBH) boostList.push(`Black Hole Power: ${achievementPower}`);
      if (this.achMultToTT) boostList.push(`Time Theorem production: ${achievementPower}`);
      if (this.achMultToEnt) boostList.push(`Entropy Generation: ${achEnEffect}`);
      return `${boostList.join("<br>")}`;
    },
    megaBoostText() {
      const achievementPowers = formatPow(this.achPowers, 2, 3);
      const achTPPow = formatPow(this.achPowToTP, 2, 3);
      const achCDPow = formatPow(this.achPowToCD, 2, 3);
      const achVDPow = formatPow(this.achPowToVD, 2, 3);
      const achEnPow = formatPow(this.achPowToEn, 2, 3);

      const powersList = [];

      const dimPowList = [];
      if (!this.isFlipped) dimPowList.push("Antimatter");
      if (this.isFlipped) dimPowList.push("Matter");
      if (this.achMultToIDS) dimPowList.push("Infinity");
      if (this.achMultToTDS) dimPowList.push("Time");
      powersList.push(`${makeEnumeration(dimPowList)} Dimensions: ${achievementPowers}`);
      if (this.achMultToCDS) powersList.push(`Celestial Dimensions: ${achCDPow}`);
      if (this.achMultToVDS) powersList.push(`Divine Dimensions: ${achVDPow}`);

      if (this.achMultToTP) powersList.push(`Tachyon Particles: ${achTPPow}`);
      if (this.achMultToBH) powersList.push(`Black Hole Power: ${achievementPowers}`);
      if (this.achMultToTT) powersList.push(`Time Theorem production: ${achievementPowers}`);
      if (this.achMultToEnt) powersList.push(`Entropy Generation: ${achEnPow}`);
      return `${powersList.join("<br>")}`;
    },
  },
  watch: {
    isAutoAchieveActive(newValue) {
      player.reality.autoAchieve = newValue;
    },
    hideCompletedRows(newValue) {
      player.options.hideCompletedAchievementRows = newValue;
      this.startRowRendering();
    }
  },
  created() {
    this.startRowRendering();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  methods: {
    update() {
      const gameSpeedupFactor = getGameSpeedupFactor();
      this.achievementPower.copyFrom(Achievements.power);
      this.achTPEffect.copyFrom(RealityUpgrade(8).config.effect());
      this.achCDEffect.copyFrom(EndgameMastery(191).effectOrDefault(DC.D1));
      this.achVDEffect.copyFrom(EndgameMastery(192).effectOrDefault(DC.D1));
      this.achEnEffect.copyFrom(EndgameMastery(201).effectOrDefault(DC.D1));
      this.achCountdown.copyFrom(new Decimal(Achievements.timeToNextAutoAchieve).div(gameSpeedupFactor));
      this.totalCountdown.copyFrom(new Decimal(Achievements.preReality.countWhere(a => !a.isUnlocked) - 1).times(Achievements.period).plus(
        Achievements.timeToNextAutoAchieve).div(gameSpeedupFactor));
      this.missingAchievements = Achievements.preReality.countWhere(a => !a.isUnlocked);
      this.showAutoAchieve = PlayerProgress.realityUnlocked() && !Perk.achievementGroup5.isBought;
      this.isAutoAchieveActive = player.reality.autoAchieve;
      this.hideCompletedRows = player.options.hideCompletedAchievementRows;
      this.achMultBreak = BreakInfinityUpgrade.achievementMult.canBeApplied;
      this.achMultToIDS = Achievement(75).isUnlocked;
      this.achMultToTDS = EternityUpgrade.tdMultAchs.isBought;
      this.achMultToCDS = EndgameMastery(191).isBought;
      this.achMultToVDS = EndgameMastery(192).isBought;
      this.achMultToTP = RealityUpgrade(8).isBought && (!Pelle.isDoomed || PelleRealityUpgrade.paradoxicallyAttain.canBeApplied) && !player.disablePostReality;
      this.achMultToBH = VUnlocks.achievementBH.canBeApplied || PelleCelestialUpgrade.vMilestones3.canBeApplied;
      this.achMultToTT = Ra.unlocks.achievementTTMult.canBeApplied;
      this.achMultToEnt = EndgameMastery(201).isBought;
      this.showPowers = ResurgenceUpgrade.achSurge.isBought && !player.disablePostReality;
      this.achPowers = Achievements.powerConv(Achievements.power);
      this.achPowToTP = Achievements.powerConv(RealityUpgrade(8).config.effect());
      this.achPowToCD = Achievements.powerConv(EndgameMastery(191).effectOrDefault(DC.D1));
      this.achPowToVD = Achievements.powerConv(EndgameMastery(192).effectOrDefault(DC.D1));
      this.achPowToEn = Achievements.powerConv(EndgameMastery(201).effectOrDefault(DC.D1));
      this.isFlipped = player.universes.current === 2;
    },
    startRowRendering() {
      const unlockedRows = [];
      const lockedRows = [];
      for (let i = 0; i < this.rows.length; i++) {
        const targetArray = this.rows[i].every(a => a.isUnlocked) ? unlockedRows : lockedRows;
        targetArray.push(i);
      }
      const renderedLockedRows = lockedRows.filter(row => this.renderedRowIndices.includes(row));
      const nonRenderedLockedRows = lockedRows.filter(row => !this.renderedRowIndices.includes(row));
      let rowsToRender;
      if (player.options.hideCompletedAchievementRows) {
        this.renderedRowIndices = unlockedRows.concat(renderedLockedRows);
        rowsToRender = nonRenderedLockedRows;
      } else {
        this.renderedRowIndices = renderedLockedRows;
        rowsToRender = unlockedRows.concat(nonRenderedLockedRows);
      }
      const stepThroughRendering = () => {
        const ROWS_PER_FRAME = 2;
        for (let i = 0; i < ROWS_PER_FRAME; i++) {
          if (rowsToRender.length === 0) {
            return;
          }
          this.renderedRowIndices.push(rowsToRender.shift());
        }
        this.renderAnimationId = requestAnimationFrame(stepThroughRendering);
      };
      stepThroughRendering();
    },
    isRendered(row) {
      return this.renderedRowIndices.includes(row);
    },
    isObscured(row) {
      if (player.celestials.slabdrill.hasBoughtNinthDimension && player.endgame.creditsTick > 0 && !player.endgame.credits) {
        return row >= 30;
      }
      if (Slabdrill.isCursed || Slabdrill.isDestroyed) {
        return row >= 25;
      }
      if (ImaginaryUpgrade(30).isBought) {
        return row >= 24;
      }
      if (PlayerProgress.endgameUnlocked()) {
        return row >= 20;
      }
      if (this.isDoomed && !PlayerProgress.endgameUnlocked()) {
        return row >= 18;
      }
      else {
        return row >= 17;
      }
    },
    timeDisplay,
    timeDisplayNoDecimals,
  }
};
</script>

<template>
  <div class="l-achievements-tab">
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="hideCompletedRows"
        class="o-primary-btn--subtab-option"
        label="Hide completed rows:"
      />
      <PrimaryToggleButton
        v-if="showAutoAchieve"
        v-model="isAutoAchieveActive"
        class="o-primary-btn--subtab-option"
        label="Auto Achievements:"
      />
    </div>
    <div class="c-achievements-tab__header c-achievements-tab__header--multipliers">
      <span v-if="isDoomed && !isDestroyed">
        All Achievement multipliers have been disabled<SwapAchievementImagesButton />
      </span>
      <span v-else>
        Achievements provide a multiplier to<SwapAchievementImagesButton />
        <div v-html="boostText" />
      </span>
      <span v-if="showPowers">
        Achievements also provide powers to<SwapAchievementImagesButton />
        <div v-html="megaBoostText" />
      </span>
    </div>
    <div class="c-achievements-tab__header">
      Achievements with a <i class="fas fa-star" /> icon also give an additional reward.
    </div>
    <div
      v-if="showAutoAchieve"
      class="c-achievements-tab__header"
    >
      <div v-if="achCountdown.gt(0)">
        Automatically gain the next missing Achievement in
        {{ timeDisplayNoDecimals(achCountdown) }}<span v-if="!isAutoAchieveActive"> once Auto is turned on</span>.
        (left-to-right, top-to-bottom)
      </div>
      <div v-else-if="missingAchievements !== 0">
        Automatically gain the next missing Achievement as soon as you enable Auto Achievements.
        (left-to-right, top-to-bottom)
      </div>
      <div v-if="totalCountdown.gt(0)">
        You will regain all remaining achievements after {{ timeDisplayNoDecimals(totalCountdown) }} if Auto
        Achievement <span v-if="isAutoAchieveActive">stays enabled</span><span v-else>is turned on</span>.
      </div>
      <br>
    </div>
    <div class="l-achievement-grid">
      <NormalAchievementRow
        v-for="(row, i) in renderedRows"
        :key="i"
        :row="row"
        :is-obscured="isObscured(i)"
      />
    </div>
  </div>
</template>
