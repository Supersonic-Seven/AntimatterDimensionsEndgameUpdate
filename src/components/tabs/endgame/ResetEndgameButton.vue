<script>
export default {
  name: "ResetEndgameButton",
  data() {
    return {
      canEndgame: false,
      isDoomed: false,
      isCursed: false
    };
  },
  computed: {
    resetText() {
      return "Start this Endgame over";
    },
  },
  methods: {
    update() {
      this.canEndgame = player.celestials.pelle.records.totalEndgameAntimatter.add(1).log10().gte(9e15);
      this.isDoomed = Pelle.isDoomed;
      this.isCursed = Slabdrill.isCursed;
    },
    resetEndgame() {
      const confirms = player.options.confirmations;
      if (GameEnd.creditsClosed) return;
      if (this.isCursed) {
        if (confirms.resetEndgame) Modal.resetEndgame.show({
          endgameState: "in a Cursed Reality",
          suggestion: "don't even try, it won't work"
        });
        else Endgame.resetNoReward();
      } else if (this.canEndgame) {
        if (confirms.resetEndgame) Modal.resetEndgame.show({
          endgameState: "able to Endgame",
          suggestion: "just Endgame with rewards rather than with nothing"
        });
        else Endgame.resetNoReward();
      } else if (this.isDoomed) {
        if (confirms.resetEndgame) Modal.resetEndgame.show({
          endgameState: "in a Doomed Reality",
          suggestion: "just wait it out"
        });
        else Endgame.resetNoReward();
      } else if (confirms.resetEndgame) Modal.resetEndgame.show({
        endgameState: "outside Doom",
        suggestion: "reset if you really want to"
      });
      else Endgame.resetNoReward();
    },
  }
};
</script>

<template>
  <button
    :class="['l-reset-endgame-button',
             'c-reset-endgame-button',
             {'c-reset-endgame-button-doom': isDoomed}]"
    @click="resetEndgame"
  >
    <div class="l-endgame-button__contents">
      {{ resetText }}
    </div>
  </button>
</template>

<style scoped>

</style>
