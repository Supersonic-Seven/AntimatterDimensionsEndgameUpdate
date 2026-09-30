<script>
import ResurgenceUpgradeButton from "./ResurgenceUpgradeButton";

export default {
  name: "ResurgenceUpgradesTab",
  components: {
    ResurgenceUpgradeButton
  },
  computed: {
    grid() {
      let g = [
        [
          ResurgenceUpgrade.ipSurge,
          ResurgenceUpgrade.epSurge,
          ResurgenceUpgrade.realSurge,
          ResurgenceUpgrade.rmSurge,
          ResurgenceUpgrade.imSurge,
        ],
        [
          ResurgenceUpgrade.repSurge,
          ResurgenceUpgrade.achSurge,
          ResurgenceUpgrade.curr1Surge,
          ResurgenceUpgrade.curr2Surge,
          ResurgenceUpgrade.glyphSurge,
        ],
        [
          ResurgenceUpgrade.ethSurge,
          ResurgenceUpgrade.machineSurge,
          ResurgenceUpgrade.rsSurge,
          ResurgenceUpgrade.memSurge,
          ResurgenceUpgrade.entropySurge,
        ],
        [
          ResurgenceUpgrade.synergy1,
          ResurgenceUpgrade.synergy2,
          ResurgenceUpgrade.synergy3,
          ResurgenceUpgrade.synergy4,
          ResurgenceUpgrade.synergy5,
        ]
      ];
      if (Slabdrill.isDestroyed) g.push([
        ResurgenceUpgrade.synergy6,
        ResurgenceUpgrade.unl1,
        ResurgenceUpgrade.unl2,
        ResurgenceUpgrade.unl3,
        ResurgenceUpgrade.unl4,
      ]);
      return g;
    }
  },
};
</script>

<template>
  <div class="l-resurgence-upgrade-grid">
    <div
      v-for="(column, columnId) in grid"
      :key="columnId"
      class="l-resurgence-upgrade-grid__row"
    >
      <ResurgenceUpgradeButton
        v-for="upgrade in column"
        :key="upgrade.id"
        :upgrade="upgrade"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
