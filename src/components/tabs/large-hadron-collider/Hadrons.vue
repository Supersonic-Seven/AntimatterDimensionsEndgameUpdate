<script>
import Hadron from "./Hadron";

export default {
  name: "Hadrons",
  components: {
    Hadron
  },
  data() {
    return {
      lcount: 0,
      dcount: 0,
      ecount: 0,
      initialized: false,
      bounds: {
        x: 0,
        y: 0
      },
      isBlob: false,
    };
  },
  mounted() {
    this.$nextTick(this.updateSize);
    window.addEventListener("resize", this.updateSize);
    this.initialized = true;
  },
  destroyed() {
    window.removeEventListener("resize", this.updateSize);
  },
  methods: {
    update() {
      this.lcount = Math.min(Math.floor(Math.min(player.celestials.laitela.hadrons.totalLight, 100) *
        Math.max(Math.log10(player.celestials.laitela.hadrons.light) / 2, 1)), 500);
      this.dcount = Math.min(Math.floor(Math.min(player.celestials.laitela.hadrons.totalDark, 100) *
        Math.max(Math.log10(player.celestials.laitela.hadrons.dark) / 2, 1)), 500);
      this.ecount = Math.min(Math.floor(Math.min(player.celestials.laitela.hadrons.totalExotic, 100) *
        Math.max(Math.log10(player.celestials.laitela.hadrons.exotic) / 2, 1)), 500);
      this.isBlob = Theme.currentName() === "S11";
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  }
};
</script>

<template>
  <svg
    v-if="initialized"
    class="c-tachyon-particle-container"
  >
    <Hadron
      v-for="i in lcount"
      :key="i"
      :bounds="bounds"
      :is-blob="isBlob"
      :type="0"
    />
    <Hadron
      v-for="j in dcount"
      :key="j + 500"
      :bounds="bounds"
      :is-blob="isBlob"
      :type="1"
    />
    <Hadron
      v-for="k in ecount"
      :key="k + 1000"
      :bounds="bounds"
      :is-blob="isBlob"
      :type="2"
    />
  </svg>
</template>

<style scoped>

</style>
