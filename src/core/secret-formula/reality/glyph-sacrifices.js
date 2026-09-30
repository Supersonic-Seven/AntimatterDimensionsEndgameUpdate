export const glyphSacrifice = {
  "power": {
    id: "power",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(0);
      const sac = player.disablePostReality && !SlabdrillUnlocks.galaxy.isUnlocked
        ? DC.D0 : player.reality.glyphs.sac.power.add(added ?? 0);
      const capped = Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = new Decimal(Decimal.log10(capped.add(1))).div(100);
      return Decimal.floor(Decimal.pow(base, 1.2).times(750));
    },
    description: amount => {
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = Decimal.pow(10, Decimal.pow((amount.add(1)).div(750), new Decimal(1 / 1.2)).times(100)).sub(1);
      const nextGalaxyText = amount.lt(750)
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Distant Galaxy scaling starts ${formatHybridLarge(amount, 3)} later${nextGalaxyText}`;
    },
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "infinity": {
    id: "infinity",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(1);
      const sac = player.disablePostReality && !SlabdrillUnlocks.galaxy.isUnlocked
        ? DC.D0 : player.reality.glyphs.sac.infinity.add(added ?? 0);
      const capped = Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      return new Decimal(Decimal.log10(Decimal.pow(capped, 0.2).div(100).add(1))).add(1);
    },
    description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Infinity Dimension`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "time": {
    id: "time",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(1);
      const sac = player.disablePostReality && !SlabdrillUnlocks.galaxy.isUnlocked
        ? DC.D0 : player.reality.glyphs.sac.time.add(added ?? 0);
      const capped = Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      return Decimal.pow(Decimal.pow(capped, 0.2).div(100).add(1), 2);
    },
    description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Time Dimension`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "replication": {
    id: "replication",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(0);
      const sac = player.disablePostReality && !SlabdrillUnlocks.galaxy.isUnlocked
        ? DC.D0 : player.reality.glyphs.sac.replication.add(added ?? 0);
      const capped = Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = new Decimal(Decimal.log10(capped.add(1))).div(100);
      return Decimal.floor(Decimal.pow(base, 1.2).times(1500));
    },
    description: amount => {
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = Decimal.pow(10, Decimal.pow((amount.add(1)).div(1500), new Decimal(1 / 1.2)).times(100)).sub(1);
      const nextGalaxyText = amount.lt(1500)
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Replicanti Galaxy scaling starts ${formatHybridLarge(amount, 3)} later${nextGalaxyText}`;
    },
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "dilation": {
    id: "dilation",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(1);
      const sac = player.disablePostReality && !SlabdrillUnlocks.galaxy.isUnlocked
        ? DC.D0 : player.reality.glyphs.sac.dilation.add(added ?? 0);
      const capped = Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      const exponent = Decimal.pow(new Decimal(Decimal.log10(capped.add(1))).div(100), 0.1).times(0.32);
      return Decimal.pow(Decimal.clampMin(capped, 1), exponent);
    },
    description: amount => `Multiply Tachyon Particle gain by ${formatX(amount, 2, 2)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "effarig": {
    id: "effarig",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(0);
      const sac = player.disablePostReality ? DC.D0 : player.reality.glyphs.sac.effarig.add(added ?? 0);
      // This doesn't use the GlyphSacrificeHandler cap because it hits its cap (+100%) earlier
      const capped = EffarigUnlock.endgame.canBeApplied
        ? Decimal.clampMax(sac, 1e70).times(
          Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects).div(1e70).max(1).log10().div(10000).pow(5).add(1))
        : Decimal.clampMax(sac, 1e70);
      return new Decimal(Decimal.log10(capped.div(1e20).add(1))).times(2);
    },
    description: amount => `+${formatDecimalPercents(amount.div(100), 2)} additional Glyph rarity`,
    cap: () => EffarigUnlock.endgame.canBeApplied ? GlyphSacrificeHandler.maxSacrificeForEffects : new Decimal(1e70)
  },
  "reality": {
    id: "reality",
    effect: added => {
      if (Pelle.isDisabled("glyphsac") && !PelleRealityUpgrade.scourToEmpower.canBeApplied) return new Decimal(0);
      const sac = player.disablePostReality ? DC.D0 : player.reality.glyphs.sac.reality.add(added ?? 0);
      // This cap is only feasibly reached with the imaginary upgrade, but we still want to cap it at a nice number
      return Decimal.clampMax(Decimal.sqrt(sac).div(15).add(1), 100);
    },
    description: amount => `Multiply Memory Chunk gain by ${formatX(amount, 2, 3)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  }
};
