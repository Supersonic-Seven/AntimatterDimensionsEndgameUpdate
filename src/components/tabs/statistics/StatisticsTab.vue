<script>
import { MatterScale } from "./matter-scale";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realTimeDoomed: TimeSpan.zero,
      totalAntimatter: new Decimal(0),
      totalAntimatterOutsideDoom: new Decimal(0),
      bestDoomedAntimatterThisDivinity: new Decimal(0),
      totalCelMatter: new Decimal(0),
      totalDivineMatter: new Decimal(0),
      hasSeenDivineDims: false,
      realTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      isFlipped: false,
      infinity: {
        isUnlocked: false,
        count: new Decimal(0),
        banked: new Decimal(0),
        projectedBanked: new Decimal(0),
        bankRate: new Decimal(0),
        totalInfinityAntimatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      eternity: {
        isUnlocked: false,
        count: new Decimal(0),
        totalEternityAntimatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      reality: {
        isUnlocked: false,
        count: new Decimal(0),
        totalRealityAntimatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
        bestRarity: 0,
      },
      endgame: {
        isUnlocked: false,
        count: 0,
        totalEndgameAntimatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRateCP: new Decimal(0),
        bestRateDP: new Decimal(0),
      },
      celestialInfinity: {
        isUnlocked: false,
        count: new Decimal(0),
        totalCelestialInfinityCelMatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      celestialEternity: {
        isUnlocked: false,
        count: new Decimal(0),
        totalCelestialEternityCelMatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      divinity: {
        isUnlocked: false,
        count: 0
      },
      condense: {
        isUnlocked: false,
        count: new Decimal(0),
        totalCondenseDivineMatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      supernova: {
        isUnlocked: false,
        count: new Decimal(0),
        totalSupernovaDivineMatter: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      matterScale: [],
      lastMatterTime: 0,
      paperclips: 0,
      fullTimePlayed: 0,
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Infinity", num.floor())}`
        : "no Infinities";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Eternity", num.floor())}`
        : "no Eternities";
    },
    realityCountString() {
      const num = new Decimal(this.reality.count);
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Reality", num.floor())}`
        : "no Realities";
    },
    endgameCountString() {
      const num = new Decimal(this.endgame.count);
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Endgame", num.floor())}`
        : "no Endgames";
    },
    celestialInfinityCountString() {
      const num = this.celestialInfinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Celestial Infinity", num.floor())}`
        : "no Celestial Infinities";
    },
    celestialEternityCountString() {
      const num = this.celestialEternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Celestial Eternity", num.floor())}`
        : "no Celestial Eternities";
    },
    divinityCountString() {
      const num = new Decimal(this.divinity.count);
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Divinity", num.floor())}`
        : "no Divinities";
    },
    condenseCountString() {
      const num = this.condense.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Condense", num.floor())}`
        : "no Condenses";
    },
    supernovaCountString() {
      const num = this.supernova.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Supernova", num.floor())}`
        : "no Supernovae";
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return Time.toDateTimeString(player.records.gameCreatedTime);
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(new Decimal(this.timeSinceCreation));
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.totalAntimatterOutsideDoom.copyFrom(player.records.totalAntimatterOutsideDoom);
      this.bestDoomedAntimatterThisDivinity.copyFrom(player.records.bestDoomedAntimatterThisDivinity);
      this.totalCelMatter.copyFrom(records.totalCelMatter);
      this.totalDivineMatter.copyFrom(records.totalDivineMatter);
      this.hasSeenDivineDims = DivinityMilestone.divineDimensions.isReached;
      this.realTimePlayed.setFrom(new Decimal(records.realTimePlayed));
      this.fullTimePlayed = TimeSpan.fromMilliseconds(
        new Decimal(records.previousRunRealTime + records.realTimePlayed));
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;
      this.isFlipped = player.universes.current === 2;

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new Decimal(0).plusEffectsOf(
          Achievement(131).effects.bankedInfinitiesGain,
          TimeStudy(191).effects.bankedInfinitiesGain,
        );
        infinity.bankRate = infinity.projectedBanked.div(Decimal.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.totalInfinityAntimatter.copyFrom(records.totalInfinityAntimatter);
        infinity.hasBest = bestInfinity.time.lt(999999999999);
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.totalEternityAntimatter.copyFrom(records.totalEternityAntimatter);
        eternity.hasBest = bestEternity.time.lt(999999999999);
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;

      if (isRealityUnlocked) {
        reality.count.copyFrom(Decimal.floor(Currency.realities.value));
        reality.totalRealityAntimatter.copyFrom(records.totalRealityAntimatter);
        reality.hasBest = bestReality.time.lt(999999999999);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(new Decimal(bestReality.realTime));
        reality.this.setFrom(records.thisReality.time);
        reality.totalTimePlayed.setFrom(records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(new Decimal(records.thisInfinity.realTime));
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.realTime)).times(60000);
        eternity.thisReal.setFrom(new Decimal(records.thisEternity.realTime));
        reality.thisReal.setFrom(new Decimal(records.thisReality.realTime));
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(bestReality.glyphStrength), 0);
      }

      const isEndgameUnlocked = progress.isEndgameUnlocked;
      const endgame = this.endgame;
      const bestEndgame = records.bestEndgame;
      endgame.isUnlocked = isEndgameUnlocked;
      
      if (isEndgameUnlocked) {
        endgame.count = Math.floor(player.endgames);
        endgame.totalEndgameAntimatter.copyFrom(records.totalEndgameAntimatter);
        endgame.hasBest = bestEndgame.realTime < 999999999999;
        endgame.best.setFrom(bestEndgame.time);
        endgame.bestReal.setFrom(new Decimal(bestEndgame.realTime));
        endgame.this.setFrom(records.thisEndgame.time);
        endgame.thisReal.setFrom(new Decimal(records.thisEndgame.realTime));
        endgame.bestRateCP.copyFrom(bestEndgame.bestCPmin);
        endgame.bestRateDP.copyFrom(bestEndgame.bestDPmin);
      }

      const isCelestialInfinityUnlocked = progress.isCelestialInfinityUnlocked;
      const celestialInfinity = this.celestialInfinity;
      const bestCelestialInfinity = records.bestCelestialInfinity;
      celestialInfinity.isUnlocked = isCelestialInfinityUnlocked;
      if (isCelestialInfinityUnlocked) {
        celestialInfinity.count.copyFrom(Currency.celestialInfinities);
        celestialInfinity.totalCelestialInfinityCelMatter.copyFrom(records.totalCelestialInfinityCelMatter);
        celestialInfinity.hasBest = bestCelestialInfinity.realTime < 999999999999;
        celestialInfinity.best.setFrom(bestCelestialInfinity.time);
        celestialInfinity.bestReal.setFrom(new Decimal(bestCelestialInfinity.realTime));
        celestialInfinity.this.setFrom(records.thisCelestialInfinity.time);
        celestialInfinity.thisReal.setFrom(new Decimal(records.thisCelestialInfinity.realTime));
        celestialInfinity.bestRate.copyFrom(bestCelestialInfinity.bestCIPminCelestialEternity);
      }

      const isCelestialEternityUnlocked = progress.isCelestialEternityUnlocked;
      const celestialEternity = this.celestialEternity;
      const bestCelestialEternity = records.bestCelestialEternity;
      celestialEternity.isUnlocked = isCelestialEternityUnlocked;
      if (isCelestialEternityUnlocked) {
        celestialEternity.count.copyFrom(Currency.celestialEternities);
        celestialEternity.totalCelestialEternityCelMatter.copyFrom(records.totalCelestialEternityCelMatter);
        celestialEternity.hasBest = bestCelestialEternity.realTime < 999999999999;
        celestialEternity.best.setFrom(bestCelestialEternity.time);
        celestialEternity.bestReal.setFrom(new Decimal(bestCelestialEternity.realTime));
        celestialEternity.this.setFrom(records.thisCelestialEternity.time);
        celestialEternity.thisReal.setFrom(new Decimal(records.thisCelestialEternity.realTime));
        celestialEternity.bestRate.copyFrom(bestCelestialEternity.bestCEPminCelestialReality);
      }

      const isDivinityUnlocked = progress.isDivinityUnlocked;
      const divinity = this.divinity;
      divinity.isUnlocked = isDivinityUnlocked;
      if (isDivinityUnlocked) {
        divinity.count = Math.floor(player.celestials.pelle.divinities);
      }

      const isCondenseUnlocked = progress.isCondenseUnlocked;
      const condense = this.condense;
      const bestCondense = records.bestCondense;
      condense.isUnlocked = isCondenseUnlocked;
      if (isCondenseUnlocked) {
        condense.count.copyFrom(Currency.condenses);
        condense.totalCondenseDivineMatter.copyFrom(records.totalCondenseDivineMatter);
        condense.hasBest = bestCondense.realTime < 999999999999;
        condense.best.setFrom(bestCondense.time);
        condense.bestReal.setFrom(new Decimal(bestCondense.realTime));
        condense.this.setFrom(records.thisCondense.time);
        condense.thisReal.setFrom(new Decimal(records.thisCondense.realTime));
        condense.bestRate.copyFrom(bestCondense.bestVSminSupernova);
      }

      const isSupernovaUnlocked = progress.isSupernovaUnlocked;
      const supernova = this.supernova;
      const bestSupernova = records.bestSupernova;
      supernova.isUnlocked = isSupernovaUnlocked;
      if (isSupernovaUnlocked) {
        supernova.count.copyFrom(Currency.supernovae);
        supernova.totalSupernovaDivineMatter.copyFrom(records.totalSupernovaDivineMatter);
        supernova.hasBest = bestSupernova.realTime < 999999999999;
        supernova.best.setFrom(bestSupernova.time);
        supernova.bestReal.setFrom(new Decimal(bestSupernova.realTime));
        supernova.this.setFrom(records.thisSupernova.time);
        supernova.thisReal.setFrom(new Decimal(records.thisSupernova.realTime));
        supernova.bestRate.copyFrom(bestSupernova.bestNebminTotal);
      }
      this.updateMatterScale();

      this.isDoomed = Pelle.isDoomed;
      this.realTimeDoomed.setFrom(new Decimal(player.records.realTimeDoomed));
      this.paperclips = player.news.specialTickerData.paperclips;
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    },
    // Only updates once per second to reduce jitter
    updateMatterScale() {
      if (Date.now() - this.lastMatterTime > 1000) {
        this.matterScale = MatterScale.estimate(Currency.antimatter.value);
        this.lastMatterTime = Date.now();
      }
    },
    realityClassObject() {
      return {
        "c-stats-tab-title": true,
        "c-stats-tab-reality": !this.isDoomed,
        "c-stats-tab-doomed": this.isDoomed,
      };
    }
  },
};
</script>

<template>
  <div class="c-stats-tab">
    <div>
      <PrimaryButton onclick="Modal.catchup.show(0)">
        View Content Summary
      </PrimaryButton>
      <div class="c-stats-tab-title c-stats-tab-general">
        General
      </div>
      <div class="c-stats-tab-general">
        <div>You have made a total of {{ format(totalAntimatter, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}.</div>
        <div v-if="divinity.isUnlocked">
          You have made a total of {{ format(bestDoomedAntimatterThisDivinity, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}
          in Doom this Divinity.
        </div>
        <div v-if="endgame.isUnlocked">
          You have made a total of {{ format(totalAntimatterOutsideDoom, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}
          outside Doom.
        </div>
        <div v-if="endgame.isUnlocked">
          You have made a total of {{ format(endgame.totalEndgameAntimatter, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}
          this Endgame.
        </div>
        <div v-if="reality.isUnlocked" :class="{ 'c-stats-tab-doomed' : isDoomed }">
          You have made a total of {{ format(reality.totalRealityAntimatter, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}
          this {{ isDoomed ? "Armageddon" : "Reality" }}.
        </div>
        <div v-if="eternity.isUnlocked">
          You have made a total of {{ format(eternity.totalEternityAntimatter, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}
          this Eternity.
        </div>
        <div v-if="infinity.isUnlocked">
          You have made a total of {{ format(infinity.totalInfinityAntimatter, 2, 1) }} {{ isFlipped ? "matter" : "antimatter" }}
          this Infinity.
        </div>
        <div v-if="endgame.isUnlocked" class="c-stats-tab-celestials">
          You have made a total of {{ format(totalCelMatter, 2, 1) }} Celestial Matter.
        </div>
        <div v-if="celestialEternity.isUnlocked" class="c-stats-tab-celestials">
          You have made a total of {{ format(celestialEternity.totalCelestialEternityCelMatter, 2, 1) }} Celestial Matter
          this Celestial Eternity.
        </div>
        <div v-if="celestialInfinity.isUnlocked" class="c-stats-tab-celestials">
          You have made a total of {{ format(celestialInfinity.totalCelestialInfinityCelMatter, 2, 1) }} Celestial Matter
          this Celestial Infinity.
        </div>
        <div v-if="hasSeenDivineDims" class="c-stats-tab-divinity">
          You have made a total of {{ format(totalDivineMatter, 2, 1) }} Divine Matter.
        </div>
        <div v-if="supernova.isUnlocked" class="c-stats-tab-divinity">
          You have made a total of {{ format(supernova.totalSupernovaDivineMatter, 2, 1) }} Divine Matter this Supernova.
        </div>
        <div v-if="condense.isUnlocked" class="c-stats-tab-divinity">
          You have made a total of {{ format(condense.totalCondenseDivineMatter, 2, 1) }} Divine Matter this Condense.
        </div>
        <div>You have played for {{ realTimePlayed }}. (real time)</div>
        <div v-if="reality.isUnlocked">
          Your existence has spanned {{ reality.totalTimePlayed }} of time. (game time)
        </div>
        <div>
          Your save was created on {{ startDate }} ({{ saveAge }} ago)
        </div>
        <br>
        <div>
          You have seen {{ quantifyHybridSmall("news message", totalNews) }} in total.
        </div>
        <div>
          You have seen {{ quantifyInt("unique news message", uniqueNews) }}.
        </div>
        <div>
          You have unlocked {{ quantifyInt("Secret Achievement", secretAchievementCount) }}.
        </div>
        <div v-if="paperclips">
          You have {{ quantifyInt("useless paperclip", paperclips) }}.
        </div>
        <div v-if="fullGameCompletions">
          <br>
          <b>
            You have completed the entire game {{ quantifyInt("time", fullGameCompletions) }}.
            <br>
            You have played for {{ fullTimePlayed }} across all playthroughs.
          </b>
        </div>
      </div>
      <div>
        <br>
        <div class="c-matter-scale-container c-stats-tab-general">
          <div
            v-for="(line, i) in matterScale"
            :key="i"
          >
            {{ line }}
          </div>
          <br v-if="matterScale.length < 2">
          <br v-if="matterScale.length < 3">
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="infinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-infinity">
        Infinity
      </div>
      <div>
        You have {{ infinityCountString }}<span v-if="eternity.isUnlocked"> this Eternity</span>.
      </div>
      <div v-if="infinity.banked.gt(0)">
        You have {{ formatDecimalAmount(infinity.banked.floor()) }}
        {{ pluralize("Banked Infinity", infinity.banked.floor()) }}.
      </div>
      <div v-if="infinity.hasBest">
        Your fastest Infinity was {{ infinity.best.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.
      </div>
      <div>
        You have spent {{ infinity.this.toStringShort() }} in this Infinity.
        <span v-if="reality.isUnlocked">
          ({{ infinity.thisReal.toStringShort() }} real time)
        </span>
      </div>
      <div>
        Your best Infinity Points per minute
        <span v-if="eternity.count.gt(0)">this Eternity </span>
        is {{ format(infinity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="eternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-eternity">
        Eternity
      </div>
      <div>
        You have {{ eternityCountString }}<span v-if="reality.isUnlocked"> this
        <span :class="{ 'c-stats-tab-doomed' : isDoomed }">{{ isDoomed ? "Armageddon" : "Reality" }}</span></span>.
      </div>
      <div v-if="infinity.projectedBanked.gt(0)">
        You will gain {{ formatDecimalAmount(infinity.projectedBanked.floor()) }}
        {{ pluralize("Banked Infinity", infinity.projectedBanked.floor()) }} on Eternity
        ({{ formatDecimalAmount(infinity.bankRate) }} per minute).
      </div>
      <div v-else-if="infinity.banked.gt(0)">
        You will gain no Banked Infinities on Eternity.
      </div>
      <div v-if="eternity.hasBest">
        Your fastest Eternity was {{ eternity.best.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Eternity<span v-if="reality.isUnlocked"> this
        <span :class="{ 'c-stats-tab-doomed' : isDoomed }">{{ isDoomed ? "Armageddon" : "Reality" }}</span></span>.
      </div>
      <div>
        You have spent {{ eternity.this.toStringShort() }} in this Eternity.
        <span v-if="reality.isUnlocked">
          ({{ eternity.thisReal.toStringShort() }} real time)
        </span>
      </div>
      <div>
        Your best Eternity Points per minute
        <span v-if="reality.isUnlocked">this
        <span :class="{ 'c-stats-tab-doomed' : isDoomed }">{{ isDoomed ? "Armageddon" : "Reality" }}</span>
        </span>
        is {{ format(eternity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="reality.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div :class="realityClassObject()">
        {{ isDoomed ? "Doomed Reality" : "Reality" }}
      </div>
      <div>
        You have {{ realityCountString }}<span v-if="endgame.isUnlocked"> this Endgame</span>.
      </div>
      <div v-if="reality.hasBest">
        Your fastest game-time Reality was {{ reality.best.toStringShort() }}.
        Your fastest real-time Reality was {{ reality.bestReal.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Reality<span v-if="endgame.isUnlocked"> this Endgame</span>.
      </div>
      <div :class="{ 'c-stats-tab-doomed' : isDoomed }">
        You have spent {{ reality.this.toStringShort() }}
        in this {{ isDoomed ? "Armageddon" : "Reality" }}.
        ({{ reality.thisReal.toStringShort() }} real time)
      </div>
      <div
        v-if="isDoomed"
        class="c-stats-tab-doomed"
      >
        You have been Doomed for {{ realTimeDoomed.toStringShort() }}, real time.
      </div>
      <div>
        Your best Reality Machines per minute 
        <span v-if="endgame.isUnlocked">this Endgame </span>
        is {{ format(reality.bestRate, 2, 2) }}.
      </div>
      <div>
        Your best Glyph rarity
        <span v-if="endgame.isUnlocked">this Endgame </span>
        is {{ formatRarity(reality.bestRarity) }}.</div>
      <br>
    </div>
    <div
      v-if="endgame.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-endgame">
        Endgame
      </div>
      <div>
        You have {{ endgameCountString }}.
      </div>
      <div v-if="endgame.hasBest">
        Your fastest game-time Endgame was {{ endgame.best.toStringShort() }}.
        Your fastest real-time Endgame was {{ endgame.bestReal.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Endgame.
      </div>
      <div>
        You have spent {{ endgame.this.toStringShort() }}
        in this Endgame.
        ({{ endgame.thisReal.toStringShort() }} real time)
      </div>
      <div>
        Your best Celestial Points per minute 
        is {{ format(endgame.bestRateCP, 2, 2) }}.
      </div>
      <div>
        Your best Doomed Particles per minute 
        is {{ format(endgame.bestRateDP, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="celestialInfinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-celestial-infinity">
        Celestial Infinity
      </div>
      <div>
        You have {{ celestialInfinityCountString }}<span v-if="celestialEternity.isUnlocked"> this Celestial Eternity</span>.
      </div>
      <div v-if="celestialInfinity.hasBest">
        Your fastest game-time Celestial Infinity was {{ celestialInfinity.best.toStringShort() }}.
        Your fastest real-time Celestial Infinity was {{ celestialInfinity.bestReal.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Celestial Infinity<span v-if="celestialEternity.isUnlocked"> this Celestial Eternity</span>.
      </div>
      <div>
        You have spent {{ celestialInfinity.this.toStringShort() }} in this Celestial Infinity.
        ({{ celestialInfinity.thisReal.toStringShort() }} real time)
      </div>
      <div>
        Your best Celestial Infinity Points per minute<span v-if="celestialEternity.isUnlocked"> this Celestial Eternity</span>
        is {{ format(celestialInfinity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="celestialEternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-celestial-eternity">
        Celestial Eternity
      </div>
      <div>
        You have {{ celestialEternityCountString }}.
      </div>
      <div v-if="celestialEternity.hasBest">
        Your fastest game-time Celestial Eternity was {{ celestialEternity.best.toStringShort() }}.
        Your fastest real-time Celestial Eternity was {{ celestialEternity.bestReal.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Celestial Eternity.
      </div>
      <div>
        You have spent {{ celestialEternity.this.toStringShort() }} in this Celestial Eternity.
        ({{ celestialEternity.thisReal.toStringShort() }} real time)
      </div>
      <div>
        Your best Celestial Eternity Points per minute
        is {{ format(celestialEternity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="divinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-divinity">
        Divinity
      </div>
      <div>
        You have {{ divinityCountString }}.
      </div>
      <br>
    </div>
    <div
      v-if="condense.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-condense">
        Condense
      </div>
      <div>
        You have {{ condenseCountString }}<span v-if="supernova.isUnlocked"> this Supernova</span>.
      </div>
      <div v-if="condense.hasBest">
        Your fastest game-time Condense was {{ condense.best.toStringShort() }}.
        Your fastest real-time Condense was {{ condense.bestReal.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Condense<span v-if="supernova.isUnlocked"> this Supernova</span>.
      </div>
      <div>
        You have spent {{ condense.this.toStringShort() }} in this Condense.
        ({{ condense.thisReal.toStringShort() }} real time)
      </div>
      <div>
        Your best Divine Stars per minute<span v-if="supernova.isUnlocked"> this Supernova</span>
        is {{ format(condense.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="supernova.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-supernova">
        Supernova
      </div>
      <div>
        You have {{ supernovaCountString }}.
      </div>
      <div v-if="supernova.hasBest">
        Your fastest game-time Supernova was {{ supernova.best.toStringShort() }}.
        Your fastest real-time Supernova was {{ supernova.bestReal.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Supernova.
      </div>
      <div>
        You have spent {{ supernova.this.toStringShort() }} in this Supernova.
        ({{ supernova.thisReal.toStringShort() }} real time)
      </div>
      <div>
        Your best Nebulae per minute
        is {{ format(supernova.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
  </div>
</template>

<style scoped>
.c-matter-scale-container {
  height: 5rem;
}

.c-stats-tab-general {
  color: var(--color-text);
}

.c-stats-tab-title {
  font-size: 2rem;
  font-weight: bold;
}

.c-stats-tab-subheader {
  height: 15rem;
}

.c-stats-tab-infinity {
  color: var(--color-infinity);
}

.c-stats-tab-eternity {
  color: var(--color-eternity);
}

.c-stats-tab-reality {
  color: var(--color-reality);
}

.c-stats-tab-doomed {
  color: var(--color-pelle--base);
}

.c-stats-tab-endgame {
  color: var(--color-endgame);
}

.c-stats-tab-celestials {
  color: var(--color-celestials);
}

.c-stats-tab-celestial-infinity {
  background: linear-gradient(var(--color-infinity), var(--color-celestials));
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.c-stats-tab-celestial-eternity {
  background: linear-gradient(var(--color-eternity), var(--color-celestials));
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.c-stats-tab-divinity {
  color: var(--color-pelle--base);
}

.c-stats-tab-condense {
  background: linear-gradient(red, yellow, cyan);
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.c-stats-tab-supernova {
  background: linear-gradient(cyan, blue, indigo, purple);
  background-clip: text;

  -webkit-text-fill-color: transparent;
}
</style>
