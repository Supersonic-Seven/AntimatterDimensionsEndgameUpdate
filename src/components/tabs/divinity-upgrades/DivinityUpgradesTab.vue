<script>
import DivinityUpgradeButton from "./DivinityUpgradeButton";

export default {
  name: "DivinityUpgradesTab",
  components: {
    DivinityUpgradeButton
  },
  data() {
    return {
      has1: false,
      has2: false,
      has3: false,
      has4: false,
      has5: false,
      hasBonus: false,
      bonus1: new Decimal(),
      bonus2: new Decimal(),
      bonus3: new Decimal()
    };
  },
  computed: {
    grid1() {
      return [
        [
          DivinityUpgrade.divineL1U1,
          DivinityUpgrade.divineL1U2,
          DivinityUpgrade.divineL1U3,
          DivinityUpgrade.divineL1U4,
          DivinityUpgrade.divineL1U5,
        ],
        [
          DivinityUpgrade.divineL1U6,
          DivinityUpgrade.divineL1U7,
          DivinityUpgrade.divineL1U8,
          DivinityUpgrade.divineL1U9,
          DivinityUpgrade.divineL1U10,
        ]
      ];
    },
    grid2() {
      return [
        [
          DivinityUpgrade.divineL2U1,
          DivinityUpgrade.divineL2U2,
          DivinityUpgrade.divineL2U3,
          DivinityUpgrade.divineL2U4,
          DivinityUpgrade.divineL2U5,
        ],
        [
          DivinityUpgrade.divineL2U6,
          DivinityUpgrade.divineL2U7,
          DivinityUpgrade.divineL2U8,
          DivinityUpgrade.divineL2U9,
          DivinityUpgrade.divineL2U10,
        ]
      ];
    },
    grid3() {
      return [
        [
          DivinityUpgrade.divineL3U1,
          DivinityUpgrade.divineL3U2,
          DivinityUpgrade.divineL3U3,
          DivinityUpgrade.divineL3U4,
          DivinityUpgrade.divineL3U5,
        ]
      ];
    },
    grid4() {
      return [
        [
          DivinityUpgrade.divineL4U1,
          DivinityUpgrade.divineL4U2,
          DivinityUpgrade.divineL4U3,
          DivinityUpgrade.divineL4U4,
          DivinityUpgrade.divineL4U5,
        ]
      ];
    },
    grid5() {
      return [
        [
          DivinityUpgrade.divineL5U1,
          DivinityUpgrade.divineL5U2,
          DivinityUpgrade.divineL5U3,
          DivinityUpgrade.divineL5U4,
          DivinityUpgrade.divineL5U5,
        ]
      ];
    }
  },
  methods: {
    update() {
      this.has1 = DivinityMilestone.divineDimensions.isReached;
      this.has2 = PlayerProgress.condenseUnlocked();
      this.has3 = (DivinityUpgrades.all.filter(u => u.layer === 2 && u.isBought).length === DivinityUpgrades.all.filter(u => u.layer === 2).length) || PlayerProgress.supernovaUnlocked();
      this.has4 = PlayerProgress.supernovaUnlocked();
      this.has5 = (DivinityUpgrades.all.filter(u => u.layer === 4 && u.isBought).length === DivinityUpgrades.all.filter(u => u.layer === 4).length) && Slabdrill.isDestroyed;
      this.hasBonus = DivinityUpgrade.divineL4U1.isBought;
      this.bonus1.copyFrom(DivinityUpgrade.divineL4U1.effects.energy.effectOrDefault(DC.D1));
      this.bonus2.copyFrom(DivinityUpgrade.divineL4U1.effects.matter.effectOrDefault(DC.D1));
      this.bonus3.copyFrom(DivinityUpgrade.divineL4U1.effects.stars.effectOrDefault(DC.D1));
    }
  }
};
</script>

<template>
  <div class="l-divinity-upgrade-grid">
    <div v-if="hasBonus">
      Power Grab is currently providing
      a <span class="c-divinity-effects">{{ formatX(bonus1, 2) }}</span> to Divine Energy,
      a <span class="c-divinity-effects">{{ formatPow(bonus2, 2, 3) }}</span> to all Divine Dimensions,
      and a <span class="c-divinity-effects">{{ formatX(bonus3, 2) }}</span> to Divine Stars.
    </div>
    <div v-if="has1">
      <div class="c-divinity-header">
        Layer One Upgrades
      </div>
      <div
        v-for="(column, columnId) in grid1"
        :key="columnId"
        class="l-divinity-upgrade-grid__row"
      >
        <DivinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
      </div>
    </div>
    <div v-if="has2">
      <div class="c-divinity-header">
        Layer Two Upgrades
      </div>
      <div
        v-for="(column, columnId) in grid2"
        :key="columnId"
        class="l-divinity-upgrade-grid__row"
      >
        <DivinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
      </div>
    </div>
    <div v-if="has3">
      <div class="c-divinity-header">
        Layer Three Upgrades
      </div>
      <div
        v-for="(column, columnId) in grid3"
        :key="columnId"
        class="l-divinity-upgrade-grid__row"
      >
        <DivinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
      </div>
    </div>
    <div v-if="has4">
      <div class="c-divinity-header">
        Layer Four Upgrades
      </div>
      <div
        v-for="(column, columnId) in grid4"
        :key="columnId"
        class="l-divinity-upgrade-grid__row"
      >
        <DivinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
      </div>
    </div>
    <div v-if="has5">
      <div class="c-divinity-header">
        Layer Five Upgrades
      </div>
      <div
        v-for="(column, columnId) in grid5"
        :key="columnId"
        class="l-divinity-upgrade-grid__row"
      >
        <DivinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-divinity-header {
  position: relative;
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-pelle--base);
}

.c-divinity-effects {
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-pelle--base);
}
</style>
