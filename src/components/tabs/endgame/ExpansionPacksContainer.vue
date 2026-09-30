<script>
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "ExpansionPacksContainer",
  components: {
    CostDisplay
  },
  props: {
    pack: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      isUnlocked: false,
      symbol: ""
    };
  },
  computed: {
    descriptionLines() {
      return this.pack.config.description.split("\n").map(x => x.trim());
    },
    isLarge() {
      return this.descriptionLines.length >= 10;
    },
    classObject() {
      return {
        "o-expansion-pack": true,
        "o-expansion-pack--teresa": this.pack.config.id === "teresaPack" && !this.isBought,
        "o-expansion-pack--effarig": this.pack.config.id === "effarigPack" && !this.isBought,
        "o-expansion-pack--enslaved": this.pack.config.id === "enslavedPack" && !this.isBought,
        "o-expansion-pack--v": this.pack.config.id === "vPack" && !this.isBought,
        "o-expansion-pack--ra": this.pack.config.id === "raPack" && !this.isBought,
        "o-expansion-pack--laitela": this.pack.config.id === "laitelaPack" && !this.isBought,
        "o-expansion-pack--pelle": this.pack.config.id === "pellePack" && !this.isBought,
        "o-expansion-pack--alpha": this.pack.config.id === "alphaPack" && !this.isBought,
        "o-expansion-pack--slabdrill": this.pack.config.id === "slabPack" && !this.isBought,
        "o-expansion-pack--teresa--bought": this.pack.config.id === "teresaPack" && this.isBought,
        "o-expansion-pack--effarig--bought": this.pack.config.id === "effarigPack" && this.isBought,
        "o-expansion-pack--enslaved--bought": this.pack.config.id === "enslavedPack" && this.isBought,
        "o-expansion-pack--v--bought": this.pack.config.id === "vPack" && this.isBought,
        "o-expansion-pack--ra--bought": this.pack.config.id === "raPack" && this.isBought,
        "o-expansion-pack--laitela--bought": this.pack.config.id === "laitelaPack" && this.isBought,
        "o-expansion-pack--pelle--bought": this.pack.config.id === "pellePack" && this.isBought,
        "o-expansion-pack--alpha--bought": this.pack.config.id === "alphaPack" && this.isBought,
        "o-expansion-pack--slabdrill--bought": this.pack.config.id === "slabPack" && this.isBought
      };
    },
    textClassObject() {
      return {
        "o-expansion-pack-text": true,
        "o-expansion-pack-text__small": this.isLarge
      };
    }
  },
  methods: {
    update() {
      const pack = this.pack;
      this.isBought = pack.isBought;
      this.isUnlocked = pack.isUnlocked;
      this.symbol = pack.symbol;
    }
  }
};
</script>

<template>
  <div v-show="isUnlocked">
    <button
      :class="classObject"
      @click="pack.purchase()"
    >
      <div class="c-expansion-packs-container">
        <div class="o-symbol">
          {{ symbol }}
        </div>
        <div>
          <div
            v-for="(description, descriptionKey) in descriptionLines"
            :key="descriptionKey"
            :class="textClassObject"
          >
            {{ description }}
          </div>
          <CostDisplay
            v-if="!isBought"
            br
            :config="pack.config"
            name="Antimatter"
          />
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.c-expansion-packs-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  align-self: center;
}

.o-symbol {
  position: absolute;
  left: 2rem;
  font-size: 15rem;
  font-weight: bold;
}

.o-expansion-pack-text {
  margin-left: 18rem;
  font-size: 1.4rem;
}

.o-expansion-pack-text__small {
  font-size: 1.1rem;
}
</style>
