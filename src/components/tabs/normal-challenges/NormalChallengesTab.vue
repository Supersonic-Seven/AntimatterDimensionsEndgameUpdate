<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import NormalChallengeBox from "./NormalChallengeBox";

export default {
  name: "NormalChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    NormalChallengeBox
  },
  data() {
    return {
      showCharge: false,
      charges: 0,
      isFlipped: false
    };
  },
  computed: {
    challenges() {
      return NormalChallenges.all;
    }
  },
  methods: {
    update() {
      this.showCharge = Ascensions.oc3A.isUnlocked && player.endgame.overcharge.allowComplex;
      this.charges = Math.min(player.endgame.overcharge.completions.chall, 12);
      this.isFlipped = player.universes.current === 2;
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      Some Normal Challenges have requirements to be able to run that challenge.
    </div>
    <div>
      If you have an active Big Crunch Autobuyer, it will attempt to Crunch
      as soon as possible when reaching Infinite {{ isFlipped ? "matter" : "antimatter" }}.
    </div>
    <div v-if="showCharge">
      <br>
      {{ formatInt(charges) }}/{{ formatInt(12) }} Normal Challenges have been charged.
      You are not able to pick which Normal Challenges get charged. Instead, they will be charged
      sequentially using the first {{ formatInt(12) }} Complex Energy.
      <br>
      You can hold shift to see the effects of all Normal Challenges after they are charged.
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
    >
      <NormalChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
