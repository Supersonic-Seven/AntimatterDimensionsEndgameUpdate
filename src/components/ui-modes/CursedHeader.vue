<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CursedHeader",
  components: {
    PrimaryButton
  },
  data() {
    return {
      findChance: 0,
      findInterval: 0,
      now: Date.now(),
      lastFound: 0,
      canHunt: false,
      cores: 0
    };
  },
  computed: {
    classObj() {
      return {
        "o-primary-btn": true,
        "o-primary-btn--disabled": !this.canHunt
      };
    },
    huntText() {
      if (this.canHunt) return "Hunt for Chaos Cores";
      return `Wait ${TimeSpan.fromMilliseconds(new Decimal(this.findInterval).sub(this.now - this.lastFound)).toStringShort()}`;
    },
    intervalText() {
      return `${TimeSpan.fromMilliseconds(new Decimal(this.findInterval)).toStringShort()}`;
    }
  },
  methods: {
    update() {
      this.findChance = Slabdrill.huntChance;
      this.findInterval = Slabdrill.huntInterval;
      this.now = Date.now();
      this.lastFound = player.celestials.slabdrill.core.lastFound;
      this.canHunt = this.now - this.lastFound >= this.findInterval;
      this.cores = player.celestials.slabdrill.core.chaosCores;
    },
    hunt() {
      if (!this.canHunt) return;
      if (Math.random() <= this.findChance) player.celestials.slabdrill.core.chaosCores++;
      player.celestials.slabdrill.core.lastFound = Date.now();
    },
    changeTabs() {
      if (ui.view.subtab === "antimatter") Tab.celestials.slabdrill.show(true);
      else Tab.dimensions.antimatter.show(true);
    }
  }
};
</script>

<template>
  <span class="c-cursed-header">
    <span>
      You currently have {{ quantifyInt("Chaos Core", cores) }}.
      You have a {{ formatPercents(findChance, 2, 2) }} chance of finding one every time you hunt.
      You can currently hunt every {{ intervalText }}.
    </span>
    <br>
    <br>
    <span class="o-cursed-btn-row">
      <PrimaryButton
        class="o-cursed-btn"
        :class="classObj"
        @click="hunt"
      >
        {{ huntText }}
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn o-cursed-btn"
        @click="changeTabs"
      >
        Change Tabs
      </PrimaryButton>
    </span>
  </span>
</template>

<style scoped>
.c-cursed-header {
  font-weight: bold;
  color: red;
}

.o-cursed-btn-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.o-cursed-btn {
  width: 20rem;
  font-size: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
