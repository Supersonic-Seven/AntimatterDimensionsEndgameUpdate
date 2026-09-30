<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ReplaceGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    targetSlot: {
      type: Number,
      required: true
    },
    inventoryIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      target: 0,
      idx: 0,
      isDoomed: false,
      isCursed: false
    };
  },
  computed: {
    resetTerm() {
      if (this.isCursed) return "perform a Core Jump";
      return this.isDoomed ? "restart this Armageddon" : "restart this Reality";
    },
  },
  methods: {
    update() {
      this.target = this.targetSlot;
      this.idx = this.inventoryIndex;
      this.glyph = Glyphs.findByInventoryIndex(this.idx);
      this.isDoomed = Pelle.isDoomed;
      this.isCursed = Slabdrill.isCursed;
    },
    handleYesClick() {
      Glyphs.swapIntoActive(this.glyph, this.targetSlot);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphReplace"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to replace a Glyph
    </template>
    Replacing a Glyph will {{ resetTerm }}.
  </ModalWrapperChoice>
</template>
