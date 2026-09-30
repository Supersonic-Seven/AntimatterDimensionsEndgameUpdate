<script>
import DualityUpgradeButton from "./DualityUpgradeButton";

export default {
  name: "DualityUpgradesTab",
  components: {
    DualityUpgradeButton
  },
  data() {
    return {
      baseIMCap: new Decimal(),
      capIM: new Decimal(),
      scaleTime: 0,
      capStr: "",
      showingRows: 5
    };
  },
  computed: {
    upgrades: () => DualityUpgrades.all,
    lockTooltip: () => `Requirement locks only prevent manual and automated actions. Any related upgrades
      will not be disabled and may still cause requirements to be failed.`,
  },
  methods: {
    update() {
      this.baseIMCap.copyFrom(MachineHandler.baseIMHardcap);
      this.capIM.copyFrom(MachineHandler.hardcapIM);
      this.scaleTime = MachineHandler.scaleTimeForDM;
      this.capStr = formatMachines(MachineHandler.hardcapRM, MachineHandler.currentIMCap, MachineHandler.currentDMCap);
      this.showingRows = Slabdrill.isDestroyed ? 6 : 5;
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-cap-text">
      Your Machine cap is <span class="c-reality-tab__reality-machines">{{ capStr }}</span>.
    </div>
    <div class="c-info-text">
      You have reached the limits of Reality and cannot hold more than {{ format(capIM) }} Imaginary Machines.
      <br>
      Machines gained in excess of {{ format(baseIMCap) }} will raise the maximum amount of Dual Machines
      you can have.
      <br>
      Dual Machines are gained passively over time up to the cap, but gain slows down exponentially
      as you approach the cap.
      <br>
      Every {{ formatInt(scaleTime) }} seconds the difference in jM between your current amount and the cap
      will be cut in half.
      <br>
      <br>
      The first two rows of upgrades can be purchased endlessly and the rest of the upgrades are one-time upgrades
      with requirements.
      <br>
      Upgrades here have the same gameplay and visual behavior as Imaginary Upgrades, but cost Dual Machines instead.
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
    </div>
    <div
      v-for="row in showingRows"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <DualityUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-cap-text {
  color: var(--color-text);
  font-size: 1.5rem;
}

.c-info-text {
  color: var(--color-text);
  margin: 1.5rem;
}
</style>
