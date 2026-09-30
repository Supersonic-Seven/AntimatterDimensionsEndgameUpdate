<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphSetRecordsTab",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      recordGlyphInfo: [],
      isFlipped: false
    };
  },
  methods: {
    update() {
      const bestReality = player.records.bestReality;
      const laitelaDim = 8 - Laitela.difficultyTier;
      this.isFlipped = player.universes.current === 2;
      this.recordGlyphInfo = [
        [true, cloneDeep(Glyphs.copyForRecords(bestReality.RMSet)), "Best Reality Machines gained",
          `${format(bestReality.RM, 2, 2)} RM`],
        [true, cloneDeep(Glyphs.copyForRecords(bestReality.RMminSet)), "Best Reality Machines per minute",
          `${format(bestReality.RMmin, 2, 2)} RM/min`],
        [true, cloneDeep(Glyphs.copyForRecords(bestReality.glyphLevelSet)), "Best Glyph Level",
          `Level ${formatHybridLarge(bestReality.glyphLevel, 3)}`],
        [true, cloneDeep(Glyphs.copyForRecords(bestReality.bestEPSet)), "Highest Eternity Points",
          `${format(bestReality.bestEP, 2, 2)} EP`],
        [true, cloneDeep(Glyphs.copyForRecords(bestReality.speedSet)), "Fastest Reality (real time)",
          `${TimeSpan.fromMilliseconds(new Decimal(bestReality.realTime)).toStringShort()}`],
        [player.celestials.teresa.bestRunAM.gt(1), cloneDeep(Glyphs.copyForRecords(player.celestials.teresa.bestAMSet)),
          `Highest ${this.isFlipped ? "Matter" : "Antimatter"} in ${Teresa.possessiveName} Reality`,
          `${format(player.celestials.teresa.bestRunAM, 2, 2)} ${this.isFlipped ? "Matter" : "Antimatter"}`],
        [Currency.imaginaryMachines.gt(0), cloneDeep(Glyphs.copyForRecords(bestReality.iMCapSet)),
          "Highest Imaginary Machine cap",
          `${format(MachineHandler.currentIMCap, 2, 2)} iM`],
        [Laitela.isUnlocked, cloneDeep(Glyphs.copyForRecords(bestReality.laitelaSet)),
          `Best ${Laitela.displayName} Destabilization`,
          `${TimeSpan.fromSeconds(new Decimal(player.celestials.laitela.fastestCompletion)).toStringShort()},
          ${laitelaDim} ${pluralize("Dimension", laitelaDim)} (${formatX(Laitela.realityReward, 2, 2)} DM)`],
      ];
    },
  }
};
</script>

<template>
  <div class="l-glyph-set-tab">
    <div
      v-for="(set, idx) in recordGlyphInfo"
      :key="idx"
    >
      <div
        v-if="set[0]"
        class="l-glyph-set-entry"
      >
        {{ set[2] }}:
        <GlyphSetPreview
          v-if="set[0]"
          :key="idx"
          :glyphs="set[1]"
          :text="set[2]"
          :text-hidden="true"
        />
        {{ set[3] }}
        <br>
      </div>
    </div>
  </div>
</template>
