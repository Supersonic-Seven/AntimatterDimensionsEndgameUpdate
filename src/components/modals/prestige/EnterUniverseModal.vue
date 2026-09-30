<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterUniverseModal",
  components: {
    ModalWrapperChoice,
  },
  props: {
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    topLabel() {
      return `${this.name} Universe`;
    },
    message() {
      return `Perform a Endgame reset and enter the ${this.name} Universe.`;
    },
    description() {
      switch (this.number) {
        case 1:
          return `Inside the Transient Universe, Tickspeed and Time Dimensions are disabled. Game Speed is fixed
          at ${format(0.001, 3, 3)}. You gain severely less Tachyon Particles and Dilated Time
          (exponent^${format(0.1, 1, 1)}). The tetration of your Antimatter generation is multiplied
          by ${format(0.9, 1, 1)}. Antimatter and Infinity Dimensions are dilated by ${format(0.1, 1, 1)} which
          can be reduced via Relativistic Particles. Relativistic Particles are gained inside the Transient
          Universe based on Antimatter and time spent inside this Universe.`;
        case 2:
          return `Inside the Tangible Universe, Antimatter Dimensions are translated into Matter Dimensions.
          All other Dimension types are disabled. Lai’tela as a whole is disabled. Game Speed is fixed
          at ${format(0.001, 3, 3)}. The tetration of Matter is halved then increased by ${formatInt(1)}.
          Matter generates Molecular Mass based on time spent inside this Universe, and Molecular Mass adds to
          the final tetration of Matter gain.`;
        case 3:
          return ``;
        case 4:
          return ``;
        case 5:
          return ``;
        case 6:
          return ``;
        case 7:
          return ``;
        case 8:
          return ``;
        default: throw new Error(`Attempted to start an Unknown Universe in Universe Modal Confirmation.`);
      }
    },
    reward() {
      switch (this.number) {
        case 1:
          return `Existing the Transient Universe will give Ephemeral Light based on highest Antimatter reached,
          which empowers Galaxy Generation inside Doom and Tachyon Particles and Dilated Time gain outside Pelle.`;
        case 2:
          return `Existing the Tangible Universe will give Stellar Augmenters based on highest Matter reached,
          which boosts the strength of Gray Stars.`;
        case 3:
          return ``;
        case 4:
          return ``;
        case 5:
          return ``;
        case 6:
          return ``;
        case 7:
          return ``;
        case 8:
          return ``;
        default: throw new Error(`Could not find Universe reward in Universe Modal Confirmation.`);
      }
    },
    highestAntimatter() {
      switch (this.number) {
        case 1:
          return player.universes.highestTransientAntimatter;
        case 2:
          return player.universes.highestTangibleMatter;
        case 3:
          return new Decimal();
        case 4:
          return new Decimal();
        case 5:
          return new Decimal();
        case 6:
          return new Decimal();
        case 7:
          return new Decimal();
        case 8:
          return new Decimal();
        default: throw new Error(`Could not find highest Antimatter in Universe Modal Confirmation.`);
      }
    }
  },
  methods: {
    handleYesClick() {
      enterUniverse(this.number);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ topLabel }}
    </template>
    <div>
      {{ message }}
      <br>
      <br>
      <div
        v-if="description"
        class="universe-description"
      >
        <br><br>
        {{ description }}
      </div>
      <br><br>
      <div>
        {{ reward }}
      </div>
      <br>
      <div>
        Reach {{ format(highestAntimatter, 2, 1) }} Antimatter to gain rewards from the {{ name }} Universe.
      </div>
    </div>
    <template #confirm-text>
      Begin
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.universe-description {
  padding: 0 2rem;
}
</style>
