<script>
import EPMultiplierButton from "./EPMultiplierButton";
import EternityUpgradeButton from "./EternityUpgradeButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EternityUpgradesTab",
  components: {
    PrimaryButton,
    EternityUpgradeButton,
    EPMultiplierButton
  },
  data() {
    return {
      areSoftcapsApplicable: false,
      hasSeenFinalSoftcap: false,
      chargeUnlocked: false,
      totalCharges: 0,
      chargesUsed: 0,
      disCharge: false
    };
  },
  computed: {
    grid() {
      return [
        [
          EternityUpgrade.idMultEP,
          EternityUpgrade.idMultEternities,
          EternityUpgrade.idMultICRecords
        ],
        [
          EternityUpgrade.tdMultAchs,
          EternityUpgrade.tdMultTheorems,
          EternityUpgrade.tdMultRealTime,
        ]
      ];
    },
    disChargeClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--charged-respec-active": this.disCharge
      };
    },
    costIncreases: () => EternityUpgrade.epMult.costIncreaseThresholds.map(x => new Decimal(x))
  },
  watch: {
    disCharge(newValue) {
      player.endgame.overcharge.discharge.eternal = newValue;
    }
  },
  methods: {
    update() {
      this.areSoftcapsApplicable = !Ascensions.epA.isUnlocked;
      this.hasSeenFinalSoftcap = player.eternityPoints.gte("e1e125") && !Ascensions.epA.isUnlocked;
      this.chargeUnlocked = Ascensions.oc2A.isUnlocked;
      this.totalCharges = player.endgame.overcharge.completions.eter;
      this.chargesUsed = player.endgame.overcharge.completions.eter - player.endgame.overcharge.chargesLeft.eternal;
      this.disCharge = player.endgame.overcharge.discharge.eternal;
    },
    formatPostBreak
  }
};
</script>

<template>
  <div class="l-eternity-upgrades-grid">
    <div
      v-if="chargeUnlocked"
      class="c-subtab-option-container"
    >
      <PrimaryButton
        :class="disChargeClassObject"
        @click="disCharge = !disCharge"
      >
        Respec Charged Eternity Upgrades on next Endgame
      </PrimaryButton>
    </div>
    <div v-if="chargeUnlocked">
      You have charged {{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} Eternity Upgrades.
      Charged Eternity Upgrades have their effect altered.
      <br>
      Hold shift to show Charged Eternity Upgrades.
      <span> You can freely respec your choices on Endgame.</span>
    </div>
    <div
      v-for="(row, i) in grid"
      :key="i"
      class="l-eternity-upgrades-grid__row"
    >
      <EternityUpgradeButton
        v-for="upgrade in row"
        :key="upgrade.id"
        :upgrade="upgrade"
        class="l-eternity-upgrades-grid__cell"
      />
    </div>
    <EPMultiplierButton />
    <div v-if="areSoftcapsApplicable">
      The cost for the {{ formatX(5) }} multiplier jumps at {{ format(costIncreases[0]) }},
      {{ formatPostBreak(costIncreases[1], 2) }}, and {{ formatPostBreak(costIncreases[2]) }} Eternity Points.
      <br>
      The cost increases super-exponentially after {{ formatPostBreak(costIncreases[3]) }} Eternity Points.
    </div>
    <div v-if="hasSeenFinalSoftcap">
      <br>
      The cost increases greatly beyond {{ formatPostBreak(costIncreases[4]) }} Eternity Points.
    </div>
  </div>
</template>

<style scoped>
.l-eternity-upgrades-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.l-eternity-upgrades-grid__row {
  display: flex;
  flex-direction: row;
}

.l-eternity-upgrades-grid__cell {
  margin: 0.5rem 0.8rem;
}
</style>
