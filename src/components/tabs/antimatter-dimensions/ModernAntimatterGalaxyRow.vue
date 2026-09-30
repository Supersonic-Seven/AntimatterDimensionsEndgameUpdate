<script>
export default {
  name: "ModernAntimatterGalaxyRow",
  data() {
    return {
      type: GALAXY_TYPE.NORMAL,
      galaxies: {
        normal: new Decimal(),
        replicanti: new Decimal(),
        dilation: new Decimal(),
        free: new Decimal(),
        unstable: new Decimal()
      },
      requirement: {
        tier: 1,
        amount: 0
      },
      canBeBought: false,
      distantStart: 0,
      remoteStart: 0,
      lockText: null,
      canBulkBuy: false,
      creditsClosed: false,
      scalingText: {
        distant: null,
        remote: null,
      },
      hasTutorial: false,
      isFlipped: false
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    dimName() {
      return AntimatterDimension(this.requirement.tier).shortDisplayName;
    },
    buttonText() {
      if (this.lockText !== null) return this.lockText;
      const reset = [];
      if (!Achievement(111).isUnlocked ||
        (player.disablePostReality && !(Alpha.isRunning && Alpha.currentStage >= 12) &&
        !(LHC.voidRunning && NullUpgrade.limerick1.isBought) &&
        !SlabdrillUnlocks.eternityChallengeTen.isUnlocked)) reset.push("Dimensions");
      if (!Achievement(143).isUnlocked ||
        (player.disablePostReality && !(Alpha.isRunning && Alpha.currentStage >= 20) &&
        !(LHC.voidRunning && NullUpgrade.limerick2.isBought))) reset.push("Dimension Boosts");
      return reset.length === 0
        ? `Increase the power of Tickspeed upgrades`
        : `Reset your ${makeEnumeration(reset)} to increase the power of Tickspeed upgrades`;
    },
    sumText() {
      const parts = [Decimal.max(this.galaxies.normal, GalacticPowers.galacticAscension.isUnlocked ? 1 : 0)];
      if (this.galaxies.replicanti.gt(0)) parts.push(this.galaxies.replicanti);
      if (this.galaxies.dilation.gt(0)) parts.push(this.galaxies.dilation);
      if (this.galaxies.free.gt(0)) parts.push(this.galaxies.free);
      let sum;
      if (GalacticPowers.galacticAscension.isUnlocked) sum = parts.map(this.formatGalaxies).join(" × ");
      if (!GalacticPowers.galacticAscension.isUnlocked) sum = parts.map(this.formatGalaxies).join(" + ");
      let all;
      if (parts.length >= 2) {
        if (GalacticPowers.galacticAscension.isUnlocked) {
          all = ` = ${this.formatGalaxies(parts.reduce(Decimal.prodReducer).div(this.galaxies.unstable))}`;
        }
        else all = ` = ${this.formatGalaxies(parts.decimalSum().div(this.galaxies.unstable))}`;
      }
      else all = "";
      const instability = this.galaxies.unstable.gt(1) ? ` / ${this.formatGalaxies(this.galaxies.unstable)}` : "";
      return `${sum}<span style="color: red">${instability}</span>${all}`;
    },
    typeName() {
      switch (this.type) {
        case GALAXY_TYPE.NORMAL: return `${this.isFlipped ? "Matter" : "Antimatter"} Galaxies`;
        case GALAXY_TYPE.DISTANT: return `Distant ${this.isFlipped ? "Matter" : "Antimatter"} Galaxies`;
        case GALAXY_TYPE.REMOTE: return `Remote ${this.isFlipped ? "Matter" : "Antimatter"} Galaxies`;
      }
      return undefined;
    },
    hasIncreasedScaling() {
      return this.type !== GALAXY_TYPE.NORMAL;
    },
    costScalingText() {
      switch (this.type) {
        case GALAXY_TYPE.DISTANT:
          return `Each Galaxy is more expensive past ${quantifyHybridLarge("Galaxy", this.distantStart)}`;
        case GALAXY_TYPE.REMOTE: {
          const scalings = [
            { type: "distant", function: "quadratic", amount: this.distantStart },
            { type: "remote", function: "exponential", amount: this.remoteStart }
          ];
          return `Increased Galaxy cost scaling: ${scalings.sort((a, b) => a.amount - b.amount)
            .map(scaling => `${scaling.function} scaling past ${this.formatGalaxies(scaling.amount)} (${scaling.type})`)
            .join(", ").capitalize()}`;
        }
      }
      return undefined;
    },
    classObject() {
      return {
        "o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset": true,
        "tutorial--glow": this.canBeBought && this.hasTutorial,
        "o-primary-btn--disabled": !this.canBeBought,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    }
  },
  methods: {
    update() {
      this.type = Galaxy.type;
      this.galaxies.normal.copyFrom(player.galaxies.add(GalaxyGenerator.galaxies));
      this.galaxies.replicanti.copyFrom(Replicanti.galaxies.total);
      this.galaxies.dilation.copyFrom(player.dilation.totalTachyonGalaxies);
      this.galaxies.free.copyFrom(GalacticPower.freeGalaxies);
      this.galaxies.unstable.copyFrom(galacticInstability());
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.canBeBought = requirement.isSatisfied && Galaxy.canBeBought;
      this.distantStart = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart;
      this.remoteStart = Galaxy.remoteStart;
      this.lockText = Galaxy.lockText;
      this.canBulkBuy = EternityMilestone.autobuyMaxGalaxies.isReached;
      this.creditsClosed = GameEnd.creditsEverClosed;
      if (this.isDoomed) {
        this.scalingText = {
          distant: this.formatGalaxies(this.distantStart),
          remote: this.formatGalaxies(Galaxy.remoteStart),
        };
      }
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.GALAXY);
      this.isFlipped = player.universes.current === 2;
    },
    buyGalaxy(bulk) {
      if (!this.canBeBought) return;
      manualRequestGalaxyReset(this.canBulkBuy && bulk);
    },
    formatGalaxies(num) {
      return new Decimal(num).gt(1e8) ? format(num, 2) : formatInt(num);
    },
  }
};
</script>

<template>
  <div class="reset-container galaxy">
    <h4>{{ typeName }} (<span v-html="sumText" />)</h4>
    <span>Requires: {{ formatHybridLarge(requirement.amount, 3) }} {{ dimName }} {{ isFlipped ? "Matter" : "Antimatter" }} D</span>
    <span v-if="hasIncreasedScaling">{{ costScalingText }}</span>
    <button
      :class="classObject"
      @click.exact="buyGalaxy(true)"
      @click.shift.exact="buyGalaxy(false)"
    >
      {{ buttonText }}
      <div
        v-if="hasTutorial"
        class="fas fa-circle-exclamation l-notification-icon"
      />
    </button>
  </div>
</template>
