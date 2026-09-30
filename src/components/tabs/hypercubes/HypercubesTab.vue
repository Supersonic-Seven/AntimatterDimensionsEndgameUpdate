<script>
import wordShift from "@/core/word-shift";

import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "HypercubesTab",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
  },
  data() {
    return {
      creditsClosed: false,
      nextInfinityDimCapIncrease: new Decimal(0),
      tesseractCost: new Decimal(0),
      totalInfinityDimCap: new Decimal(0),
      canBuyTesseract: false,
      boughtTesseracts: 0,
      extraTesseracts: 0,
      tesseractMult: 0,
      isTesseractAutoUnlocked: false,
      isTesseractAutoActive: false,
      tesseractMultText: "",
      additiveTesseractString: "",
      multiplicativeTesseractString: "",
      tesseractStringArray: [],
      penteractsUnlocked: false,
      nextFreeTickspeedReduction: new Decimal(0),
      penteractCost: new Decimal(0),
      totalFreeTickspeedReduction: new Decimal(0),
      canBuyPenteract: false,
      boughtPenteracts: 0,
      extraPenteracts: 0,
      isPenteractAutoUnlocked: false,
      isPenteractAutoActive: false,
      hexeractsUnlocked: false,
      nextDarkMatterSoftcapReduction: new Decimal(0),
      hexeractCost: new Decimal(0),
      totalDarkMatterSoftcapReduction: new Decimal(0),
      canBuyHexeract: false,
      boughtHexeracts: 0,
      extraHexeracts: 0,
      isHexeractAutoUnlocked: false,
      isHexeractAutoActive: false,
      hepteractsUnlocked: false,
      nextCelestialDimSoftcapReduction: new Decimal(0),
      hepteractCost: new Decimal(0),
      totalCelestialDimSoftcapReduction: new Decimal(0),
      canBuyHepteract: false,
      boughtHepteracts: 0,
      extraHepteracts: 0,
      isHepteractAutoUnlocked: false,
      isHepteractAutoActive: false,
      octeractsUnlocked: false,
      nextTotalCubeBoost: 0,
      octeractCost: new Decimal(0),
      totalCubeBoost: new Decimal(0),
      canBuyOcteract: false,
      boughtOcteracts: 0,
      extraOcteracts: 0,
      isOcteractAutoUnlocked: false,
      isOcteractAutoActive: false,
      time: 0,
    };
  },
  computed: {
    tesseractCountString() {
      if (LHC.hadronC >= 1) return this.multiplicativeTesseractString;
      if (LHC.hadronC >= 0.5) return `${wordShift.wordCycle(this.tesseractStringArray, true)}`;
      return this.additiveTesseractString;
    },
    tesseractAutobuyer() {
      return Autobuyer.tesseract;
    },
    tesseractAutobuyerTextDisplay() {
      const auto = this.isTesseractAutoActive;
      return `Auto Tesseract ${auto ? "ON" : "OFF"}`;
    },
    penteractCountString() {
      const extra = this.extraPenteracts > 0 ? ` + ${format(this.extraPenteracts, 2, 2)}` : "";
      return `${formatHybridSmall(this.boughtPenteracts, 3)}${extra}`;
    },
    hexeractCountString() {
      const extra = this.extraHexeracts > 0 ? ` + ${format(this.extraHexeracts, 2, 2)}` : "";
      return `${formatHybridSmall(this.boughtHexeracts, 3)}${extra}`;
    },
    hepteractCountString() {
      const extra = this.extraHepteracts > 0 ? ` + ${format(this.extraHepteracts, 2, 2)}` : "";
      return `${formatHybridSmall(this.boughtHepteracts, 3)}${extra}`;
    },
    octeractCountString() {
      const extra = this.extraOcteracts > 0 ? ` + ${format(this.extraOcteracts, 2, 2)}` : "";
      return `${formatHybridSmall(this.boughtOcteracts, 3)}${extra}`;
    },
    penteractLockString() {
      if (this.penteractsUnlocked) return `Buy a Penteract (${this.penteractCountString})`;
      else return `Purchase Duality Upgrade 25 to unlock Penteracts`;
    },
    hexeractLockString() {
      if (this.hexeractsUnlocked) return `Buy a Hexeract (${this.hexeractCountString})`;
      else return `Hadronize Lai'tela ${formatInt(40)} times to unlock Hexeracts`;
    },
    hepteractLockString() {
      if (this.hepteractsUnlocked) return `Buy a Hepteract (${this.hepteractCountString})`;
      else return `Perform a Celestial Eternity to unlock Hepteracts`;
    },
  },
  methods: {
    update() {
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.nextInfinityDimCapIncrease.copyFrom(Tesseracts.nextTesseractIncrease);
      this.tesseractCost.copyFrom(Tesseracts.nextCost);
      this.totalInfinityDimCap.copyFrom(InfinityDimensions.totalDimCap);
      this.canBuyTesseract = Tesseracts.canBuyTesseract;
      this.boughtTesseracts = Tesseracts.bought;
      this.extraTesseracts = Tesseracts.extra;
      this.tesseractMult = Tesseracts.totalMult;
      const tesseractAuto = Autobuyer.tesseract;
      this.isTesseractAutoUnlocked = tesseractAuto.isUnlocked;
      this.isTesseractAutoActive = tesseractAuto.isActive;
      this.tesseractMultText = this.tesseractMult !== 1 ? ` × ${format(this.tesseractMult, 2, 2)}` : "";
      this.additiveTesseractString = `${formatHybridSmall(this.boughtTesseracts, 3)}${this.tesseractMultText}${this.extraTesseracts > 0
        ? ` + ${format(this.extraTesseracts, 2, 2)}${this.tesseractMultText}` : ""}`;
      this.multiplicativeTesseractString = `${formatHybridSmall(this.boughtTesseracts, 3)}${this.extraTesseracts > 0
        ? ` × ${format(this.extraTesseracts, 2, 2)}${this.tesseractMultText}` : ""}`;
      this.tesseractStringArray = [this.multiplicativeTesseractString, this.additiveTesseractString];
      this.penteractsUnlocked = DualityUpgrade(25).isBought;
      this.nextFreeTickspeedReduction.copyFrom(Penteracts.eachPenteractReduction.sub(1));
      this.penteractCost.copyFrom(Penteracts.nextCost);
      this.totalFreeTickspeedReduction.copyFrom(Penteracts.softcapReduction());
      this.canBuyPenteract = Penteracts.canBuyPenteract;
      this.boughtPenteracts = Penteracts.bought;
      this.extraPenteracts = Penteracts.extra;
      this.isPenteractAutoUnlocked = false;
      this.isPenteractAutoActive = false;
      this.hexeractsUnlocked = player.celestials.laitela.hadronizes >= 40;
      this.nextDarkMatterSoftcapReduction.copyFrom(Hexeracts.eachHexeractReduction.sub(1));
      this.hexeractCost.copyFrom(Hexeracts.nextCost);
      this.totalDarkMatterSoftcapReduction.copyFrom(Hexeracts.softcapReduction());
      this.canBuyHexeract = Hexeracts.canBuyHexeract;
      this.boughtHexeracts = Hexeracts.bought;
      this.extraHexeracts = Hexeracts.extra;
      this.isHexeractAutoUnlocked = false;
      this.isHexeractAutoActive = false;
      this.hepteractsUnlocked = PlayerProgress.celestialEternityUnlocked();
      this.nextCelestialDimSoftcapReduction.copyFrom(Hepteracts.eachHepteractReduction.sub(1));
      this.hepteractCost.copyFrom(Hepteracts.nextCost);
      this.totalCelestialDimSoftcapReduction.copyFrom(Hepteracts.softcapReduction());
      this.canBuyHepteract = Hepteracts.canBuyHepteract;
      this.boughtHepteracts = Hepteracts.bought;
      this.extraHepteracts = Hepteracts.extra;
      this.isHepteractAutoUnlocked = false;
      this.isHepteractAutoActive = false;
      this.octeractsUnlocked = false;
      this.nextTotalCubeBoost = Octeracts.eachOcteractBoost - 1;
      this.octeractCost.copyFrom(Octeracts.nextCost);
      this.totalCubeBoost.copyFrom(Octeracts.cubeBoost());
      this.canBuyOcteract = Octeracts.canBuyOcteract;
      this.boughtOcteracts = Octeracts.bought;
      this.extraOcteracts = Octeracts.extra;
      this.isOcteractAutoUnlocked = false;
      this.isOcteractAutoActive = false;
      this.time = Date.now();
    },
    buyTesseract() {
      Tesseracts.buyTesseract();
    },
    buyPenteract() {
      Penteracts.buyPenteract();
    },
    buyHexeract() {
      Hexeracts.buyHexeract();
    },
    buyHepteract() {
      Hepteracts.buyHepteract();
    },
    buyOcteract() {
      Octeracts.buyOcteract();
    },
    handleTesseractAutoToggle(value) {
      Autobuyer.tesseract.isActive = value;
      this.update();
    },
    octeractLockString() {
      if (this.octeractsUnlocked) return `Buy a Octeract (${this.octeractCountString})`;
      //somewhat ugly method to make it continuously update
      else return this.time >= 0 ? `Reach ${wordShift.randomCrossWords("Expanse Transfer")} to unlock Octeracts` : `Reach ${wordShift.randomCrossWords("Expanse Transfer")} to unlock Octeracts`;
    },
    octeractResourceString() {
      if (false) return `Expansial Fragments`;
      else return this.time >= 0 ? `${wordShift.randomCrossWords("Expansial Fragments")}` : `${wordShift.randomCrossWords("Expansial Fragments")}`;
    },
  }
};
</script>

<template>
  <div class="l-hypercubes-tab">
    Penteracts cannot be purchased while Doomed.
    <div class="l-hypercubes-container">
      <div class="l-hypercubes-btn">
        <button
          class="c-infinity-dim-tab__tesseract-button l-hypercubes-button"
          :class="{
            'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract,
            'o-pelle-disabled-pointer': creditsClosed
          }"
          @click="buyTesseract"
        >
          <p>
            Buy a Tesseract ({{ tesseractCountString }})
          </p>
          <p>Increase Infinity Dimension caps by {{ format(nextInfinityDimCapIncrease, 2) }}</p>
          <p><b>Costs: {{ format(tesseractCost) }} IP</b></p>
          <p>Total Tesseract effect: {{ format(totalInfinityDimCap, 2) }}</p>
        </button>
        <br>
        <PrimaryToggleButton
          v-if="isTesseractAutoUnlocked"
          :value="isTesseractAutoActive"
          :on="tesseractAutobuyerTextDisplay"
          :off="tesseractAutobuyerTextDisplay"
          class="l--spoon-btn-group__little-spoon o-primary-btn--tesseract-toggle"
          @input="handleTesseractAutoToggle"
        />
      </div>
      <div class="l-hypercubes-btn">
        <button
          class="c-penteract-button l-hypercubes-button"
          :class="{
            'c-penteract-button--disabled': !canBuyPenteract,
            'o-pelle-disabled-pointer': creditsClosed
          }"
          @click="buyPenteract"
        >
          <p>
            {{ penteractLockString }}
          </p>
          <p>Reduce Time Dimension threshold softcap by {{ formatDecimalPercents(nextFreeTickspeedReduction, 2, 2) }}</p>
          <p><b>Costs: {{ format(penteractCost) }} EP</b></p>
          <p>Total Penteract effect: {{ formatPow(totalFreeTickspeedReduction, 2, 4) }}</p>
        </button>
      </div>
      <div class="l-hypercubes-btn">
        <button
          class="c-hexeract-button l-hypercubes-button"
          :class="{
            'c-hexeract-button--disabled': !canBuyHexeract,
            'o-pelle-disabled-pointer': creditsClosed
          }"
          @click="buyHexeract"
        >
          <p>
            {{ hexeractLockString }}
          </p>
          <p>Reduce Dark Matter Dimension threshold softcaps by {{ formatDecimalPercents(nextDarkMatterSoftcapReduction, 2, 2) }}</p>
          <p><b>Costs: {{ format(hexeractCost) }} DM</b></p>
          <p>Total Hexeract effect: {{ formatPow(totalDarkMatterSoftcapReduction, 2, 4) }}</p>
        </button>
      </div>
    </div>
    <div class="l-hypercubes-container">
      <div class="l-hypercubes-btn">
        <button
          class="c-hepteract-button l-hypercubes-button"
          :class="{
            'c-hepteract-button--disabled': !canBuyHepteract,
            'o-pelle-disabled-pointer': creditsClosed
          }"
          @click="buyHepteract"
        >
          <p>
            {{ hepteractLockString }}
          </p>
          <p>Reduce Celestial Dimension Softcap power by {{ formatDecimalPercents(nextCelestialDimSoftcapReduction, 2, 2) }}</p>
          <p><b>Costs: {{ format(hepteractCost) }} CP</b></p>
          <p>Total Hepteract effect: {{ formatPow(totalCelestialDimSoftcapReduction, 2, 4) }}</p>
        </button>
      </div>
      <div class="l-hypercubes-btn">
        <button
          class="c-octeract-button l-hypercubes-button"
          :class="{
            'c-octeract-button--disabled': !canBuyOcteract,
            'o-pelle-disabled-pointer': creditsClosed
          }"
          @click="buyOcteract"
        >
          <p>
            {{ octeractLockString() }}
          </p>
          <p>Increase the strength of all cubes by {{ formatPercents(nextTotalCubeBoost, 2, 2) }}</p>
          <p><b>Costs: {{ format(octeractCost) }} {{ octeractResourceString() }}</b></p>
          <p>Total Octeract effect: {{ formatX(totalCubeBoost, 2, 2) }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-hypercubes-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.l-hypercubes-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--color-text);
}

.l-hypercubes-btn {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  height: 20rem;
}

.l-hypercubes-button {
  width: 35rem;
  height: 15rem;
}
</style>
