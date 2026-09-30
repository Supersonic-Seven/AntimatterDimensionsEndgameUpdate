<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PreferredMasteryTreeModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      compressionPath: null,
      currencyPath: null,
      entanglementPath: null
    };
  },
  computed: {
    compressionOptions() {
      return {
        "AD Compression": ENDGAME_MASTERY_PATH.ANTIMATTER_DIM_COMPRESSION,
        "ID Compression": ENDGAME_MASTERY_PATH.INFINITY_DIM_COMPRESSION,
        "TD Compression": ENDGAME_MASTERY_PATH.TIME_DIM_COMPRESSION,
        "CD Compression": ENDGAME_MASTERY_PATH.CELESTIAL_DIM_COMPRESSION,
      };
    },
    currencyOptions() {
      return {
        "IP": ENDGAME_MASTERY_PATH.INFINITY_POINTS,
        "EP": ENDGAME_MASTERY_PATH.ETERNITY_POINTS,
        "RM": ENDGAME_MASTERY_PATH.REALITY_MACHINES,
        "iM": ENDGAME_MASTERY_PATH.IMAGINARY_MACHINES
      };
    },
    entanglementOptions() {
      return {
        "Endgame Entanglement": ENDGAME_MASTERY_PATH.ENDGAME_ENTANGLEMENT,
        "Celestial Entanglement": ENDGAME_MASTERY_PATH.CELESTIAL_ENTANGLEMENT,
        "Divine Entanglement": ENDGAME_MASTERY_PATH.DIVINE_ENTANGLEMENT
      };
    },
    usePriority() {
      return EndgameMastery.preferredPaths.compression.usePriority;
    },
    useOtherPriority() {
      return EndgameMastery.preferredPaths.currency.usePriority;
    },
    useThirdPriority() {
      return EndgameMastery.preferredPaths.entanglement.usePriority;
    },
  },
  created() {
    this.compressionPath = [...EndgameMastery.preferredPaths.compression.path];
    this.currencyPath = [...EndgameMastery.preferredPaths.currency.path];
    this.entanglementPath = [...EndgameMastery.preferredPaths.entanglement.path];
  },
  methods: {
    isPreferred(name) {
      return this.compressionPath.indexOf(this.compressionOptions[name]) + 1 ||
        this.currencyPath.indexOf(this.currencyOptions[name]) + 1 ||
        this.entanglementPath.indexOf(this.entanglementOptions[name]) + 1;
    },
    select(name) {
      if (this.compressionOptions[name]) {
        if (!this.usePriority || this.compressionPath.length > 1) this.compressionPath.shift();
        if (!this.compressionPath.includes(this.compressionOptions[name]))
          this.compressionPath.push(this.compressionOptions[name]);
      }
      if (this.currencyOptions[name]) {
        if (!this.useOtherPriority || this.currencyPath.length > 1) this.currencyPath.shift();
        if (!this.currencyPath.includes(this.currencyOptions[name]))
          this.currencyPath.push(this.currencyOptions[name]);
      }
      if (this.entanglementOptions[name]) {
        if (!this.useThirdPriority || this.entanglementPath.length > 1) this.entanglementPath.shift();
        if (!this.entanglementPath.includes(this.entanglementOptions[name]))
          this.entanglementPath.push(this.entanglementOptions[name]);
      }
    },
    confirmPrefs() {
      EndgameMastery.preferredPaths.compression.path = this.compressionPath;
      EndgameMastery.preferredPaths.currency.path = this.currencyPath;
      EndgameMastery.preferredPaths.entanglement.path = this.entanglementPath;
    },
    classList(name) {
      const pref = this.isPreferred(name);
      const types = {
        "AD Compression": "antimatter-dim-compression",
        "ID Compression": "infinity-dim-compression",
        "TD Compression": "time-dim-compression",
        "CD Compression": "celestial-dim-compression",
        "IP": "infinity-points",
        "EP": "eternity-points",
        "RM": "reality-machines",
        "iM": "imaginary-machines",
        "Endgame Entanglement": "endgame-entanglement",
        "Celestial Entanglement": "celestial-entanglement",
        "Divine Entanglement": "divine-entanglement"
      };
      return [
        "o-endgame-mastery-selection-btn",
        `o-endgame-mastery-${types[name]}--${pref ? "bought" : "available"}`,
        `o-endgame-mastery--${pref ? "bought" : "available"}`
      ];
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="confirmPrefs">
    <h2>Compression Split Preference</h2>
    <div class="l-modal-split-preferences">
      <button
        v-for="(id, name) in compressionOptions"
        :key="name"
        :class="classList(name)"
        @click="select(name)"
      >
        <div
          v-if="isPreferred(name)"
          class="l-dim-path-priority o-dim-path-priority"
        >
          {{ isPreferred(name) }}
        </div>
        <div>
          {{ name }}
        </div>
      </button>
    </div>
    <br>
    <h2>Currency Split Preference</h2>
    <div class="l-modal-split-preferences">
      <button
        v-for="(id, name) in currencyOptions"
        :key="name"
        :class="classList(name)"
        @click="select(name)"
      >
        <div
          v-if="isPreferred(name)"
          class="l-dim-path-priority o-dim-path-priority"
        >
          {{ isPreferred(name) }}
        </div>
        <div>
          {{ name }}
        </div>
      </button>
    </div>
    <br>
    <h2>Entanglement Split Preference</h2>
    <div class="l-modal-split-preferences">
      <button
        v-for="(id, name) in entanglementOptions"
        :key="name"
        :class="classList(name)"
        @click="select(name)"
      >
        <div
          v-if="isPreferred(name)"
          class="l-dim-path-priority o-dim-path-priority"
        >
          {{ isPreferred(name) }}
        </div>
        <div>
          {{ name }}
        </div>
      </button>
    </div>
  </ModalWrapperChoice>
</template>
