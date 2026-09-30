<script>
import { sha512_256 } from "js-sha512";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";
import MasteryStringLine from "@/components/modals/MasteryStringLine";

import MasteryStringPreview from "./endgame-mastery-modal-preview/MasteryStringPreview";
import MasteryTreeInfo from "./MasteryTreeInfo";

let savedImportString = "";

export default {
  name: "MasteryStringModal",
  components: {
    ModalWrapperChoice,
    MasteryStringLine,
    PrimaryButton,
    MasteryStringPreview,
    MasteryTreeInfo
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    deleting: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      input: "",
      name: "",
      respecAndLoad: false,
      canEndgame: false
    };
  },
  computed: {
    // This modal is used by both mastery importing and preset editing, but is given an id of -1 when importing
    isImporting() {
      return this.id === -1;
    },
    // This represents the state reached from importing into an empty tree
    importedTree() {
      if (!this.inputIsValidTree) return {};
      const importedTree = new EndgameMasteryTree(this.truncatedInput);
      const newMasteriesArray = importedTree.purchasedMasteries.map(s => this.masteryString(s));
      const entanglement = EndgameMastery.timeCompression.isBought ? makeEnumeration(importedTree.entanglementPaths) : null;
      return {
        endgameSkills: importedTree.spentSkills[0],
        newMasteries: makeEnumeration(newMasteriesArray),
        newMasteriesArray,
        invalidMasteries: importedTree.invalidMasteries,
        firstPaths: makeEnumeration(importedTree.compressionPaths),
        secondPaths: makeEnumeration(importedTree.currencyPaths),
        thirdPaths: entanglement,
        hasInfo: makeEnumeration(importedTree.compressionPaths),
      };
    },
    // This is only shown when importing; when modifying a preset we assume that generally the current state of the
    // tree is irrelevant because if it mattered then the player would simply import instead
    combinedTree() {
      if (!this.inputIsValidTree) return {};
      const currentMasteryTree = GameCache.currentMasteryTree.value;
      const combinedTree = this.combinedTreeObject;
      const newMasteriesArray = combinedTree.purchasedMasteries
        .filter(m => !currentMasteryTree.purchasedMasteries.includes(m)).map(m => this.masteryString(m));
      const entanglement = EndgameMastery.timeCompression.isBought ? makeEnumeration(combinedTree.entanglementPaths) : null;
      return {
        endgameSkills: combinedTree.spentSkills[0] - currentMasteryTree.spentSkills[0],
        newMasteries: makeEnumeration(newMasteriesArray),
        newMasteriesArray,
        firstPaths: makeEnumeration(combinedTree.compressionPaths),
        secondPaths: makeEnumeration(combinedTree.currencyPaths),
        thirdPaths: entanglement,
        hasInfo: makeEnumeration(combinedTree.compressionPaths),
      };
    },
    combinedTreeObject() {
      const combinedTree = new EndgameMasteryTree();
      combinedTree.attemptBuyArray(EndgameMasteryTree.currentMasteries, false);
      combinedTree.attemptBuyArray(combinedTree.parseMasteryImport(this.truncatedInput), true);
      return combinedTree;
    },
    modalTitle() {
      if (this.deleting) return `Deleting Mastery Preset "${this.name}"`;
      return this.isImporting ? "Input your tree" : `Editing Mastery Preset "${this.name}"`;
    },
    invalidMessage() {
      if (!this.inputIsValidTree || this.importedTree.invalidMasteries.length === 0) return null;
      // Pad the input with non-digits which we remove later in order to not cause erroneous extra matches within IDs
      // and limit the string length to stop excessive UI stretch
      let coloredString = `#${this.truncatedInput}#`;
      if (coloredString.length > 300) coloredString = `${coloredString.slice(0, 297)}...`;

      for (const mastery of this.importedTree.invalidMasteries) {
        const id = `${mastery}`.match(/(EC)?(\d+)/u);
        const num = parseInt(id[2], 10);
        switch (id[1]) {
          default:
            coloredString = coloredString.replaceAll(new RegExp(`(\\D)(${num})(\\D)`, "gu"),
              `$1<span style="color: var(--color-bad);">$2</span>$3`);
            break;
        }
      }
      return `Your import string has invalid mastery IDs: ${coloredString.replaceAll("#", "").replaceAll(",", ", ")}
        <br><br>`;
    },
    truncatedInput() {
      return EndgameMasteryTree.truncateInput(this.input);
    },
    hasInput() {
      return this.truncatedInput !== "";
    },
    inputIsValid() {
      return this.inputIsValidTree || this.inputIsSecret;
    },
    inputIsValidTree() {
      return EndgameMasteryTree.isValidImportString(this.truncatedInput);
    },
    inputIsSecret() {
      // The button to open the modal and the actual modal itself display two different strings;
      // we should allow either to unlock the secret achievement
      const secretStrings = [
        "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608",
        "bb450c2a3869bae412ed0b4304dc229521fc69f0fdcc95b3b61460aaf5658fc4"
      ];
      return secretStrings.includes(sha512_256(this.input.toLowerCase()));
    },
    confirmText() {
      if (this.deleting) return "Delete";
      return this.isImporting ? "Import" : "Save";
    }
  },
  watch: {
    input(newInput) {
      savedImportString = newInput;
    }
  },
  // Needs to be assigned in created() or else they will end up being undefined when importing
  created() {
    const preset = player.endgameMasteries.presets[this.id];
    this.input = preset ? preset.masteries : savedImportString;
    this.name = preset ? preset.name : "";
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    update() {
      this.canEndgame = isEndgameAvailable();
    },
    confirm() {
      if (this.deleting) {
        this.deletePreset();
      } else if (this.isImporting) {
        if (this.respecAndLoad && this.canEndgame) {
          player.endgame.respec = true;
          const tree = new EndgameMasteryTree(this.truncatedInput);
          animateAndEndgame(() => EndgameMasteryTree.commitToGameState(tree.purchasedMasteries, false));
          return;
        }
        this.importTree();
      } else {
        this.savePreset();
      }
    },
    convertInputShorthands() {
      this.input = EndgameMasteryTree.formatMasteryList(this.input);
    },
    importTree() {
      if (!this.inputIsValid) return;
      if (this.inputIsSecret) SecretAchievement(37).unlock();
      savedImportString = "";
      this.emitClose();
      // We need to use a combined tree for committing to the game state, or else it won't buy masteries in the imported
      // tree are only reachable if the current tree is already bought
      EndgameMasteryTree.commitToGameState(this.combinedTreeObject.purchasedMasteries, false);
    },
    savePreset() {
      if (this.inputIsValid) {
        player.endgameMasteries.presets[this.id].masteries = this.input;
        GameUI.notify.endgame(`Mastery Tree ${this.name} successfully edited.`);
        this.emitClose();
      }
    },
    deletePreset() {
      const name = player.endgameMasteries.presets[this.id].name;
      const presetName = name ? `Mastery preset "${name}"` : "Mastery preset";
      player.endgameMasteries.presets[this.id].masteries = "";
      player.endgameMasteries.presets[this.id].name = "";
      GameUI.notify.endgame(`${presetName} deleted from slot ${this.id + 1}`);
    },
    masteryString(mastery) {
      return `${mastery.id}`;
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="inputIsValid"
    class="c-modal-import-tree"
    @confirm="confirm"
  >
    <template #header>
      {{ modalTitle }}
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      maxlength="1500"
      class="c-modal-input c-modal-import-tree__input"
      :class="{ 'l-delete-input' : deleting }"
      :disabled="deleting"
      @keyup.enter="confirm"
      @keyup.esc="emitClose"
    >
    <div class="c-two-column">
      <div class="c-mastery-info l-modal-import-tree__tree-info">
        <div v-if="inputIsSecret">
          ???
        </div>
        <template v-else-if="inputIsValidTree">
          <div
            v-if="invalidMessage"
            class="l-modal-import-tree__tree-info-line"
            v-html="invalidMessage"
          />
          <MasteryStringLine
            v-if="isImporting"
            :tree="combinedTree"
            :into-empty="false"
          />
          <MasteryStringLine
            :tree="importedTree"
            :into-empty="true"
          />
          <MasteryTreeInfo
            v-if="deleting && importedTree.hasInfo"
            header-text="Mastery Preset contains:"
            :tree-status="importedTree"
          />
          <MasteryTreeInfo
            v-if="!deleting && !isImporting && importedTree.hasInfo"
            header-text="Status after loading with <b>no masteries</b>:"
            :tree-status="importedTree"
          />
          <MasteryTreeInfo
            v-if="!deleting && combinedTree.hasInfo"
            header-text="Status after loading with <b>current tree</b>:"
            :tree-status="combinedTree"
          />
        </template>
        <div v-if="!deleting && !inputIsValidTree && hasInput">
          Not a valid tree
        </div>
      </div>
      <div class="c-mastery-preview">
        <MasteryStringPreview
          :show-preview="inputIsValidTree"
          :new-masteries="!isImporting || (canEndgame && respecAndLoad) ? importedTree.newMasteriesArray
            : combinedTree.newMasteriesArray"
          :disregard-current-masteries="!isImporting || (canEndgame && respecAndLoad)"
        />
      </div>
    </div>
    <div v-if="!isImporting && inputIsValidTree">
      <br>
      <PrimaryButton
        v-if="!deleting"
        v-tooltip="'This will format the mastery preset text, for example, changing \'a,b,c|d\' to \'a, b, c | d\'.'"
        @click="convertInputShorthands"
      >
        Format Preset Text
      </PrimaryButton>
    </div>
    <span v-if="isImporting">
      <br>
      <div
        v-tooltip="canEndgame ? '' : 'You are currently unable to endgame, so this will only do a normal load.'"
        class="c-modal__confirmation-toggle"
        @click="respecAndLoad = !respecAndLoad"
      >
        <div
          :class="{
            'c-modal__confirmation-toggle__checkbox': true,
            'c-modal__confirmation-toggle__checkbox--active': respecAndLoad,
          }"
        >
          <span
            v-if="respecAndLoad"
            class="fas fa-check"
          />
        </div>
        <span class="c-modal__confirmation-toggle__text">
          Also respec tree and endgame
          <span
            v-if="!canEndgame"
            class="c-modal__confirmation-toggle__warning"
          >
            !
          </span>
        </span>
      </div>
    </span>
    <template #confirm-text>
      {{ confirmText }}
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-two-column {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.c-mastery-info {
  width: 30rem;
  padding: 0 2rem;
}

.c-mastery-preview {
  height: 100%;
  margin-right: 3rem;
}

.l-delete-input {
  color: var(--color-text);
  background-color: var(--color-disabled);
  pointer-events: none;
  user-select: none;
}

.c-modal__confirmation-toggle__text {
  opacity: 1;
}

.c-modal__confirmation-toggle__warning {
  display: inline-flex;
  /* stylelint-disable-next-line unit-allowed-list */
  width: 1em;
  /* stylelint-disable-next-line unit-allowed-list */
  height: 1em;
  justify-content: center;
  align-items: center;
  color: #332222;
  background: var(--color-bad);
  border-radius: 100%;
  margin-left: 0.3rem;
}
</style>
