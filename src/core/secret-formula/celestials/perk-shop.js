function rebuyableCost(initialCost, increment, id) {
  return initialCost * Math.pow(increment, player.celestials.teresa.perkShop[id]);
}
function rebuyable(config) {
  const { id, otherReq, cap, costCap, description, preChargedEffect, chargedEffect, formatEffect, formatCost, showEffectAfterCharge } = config;
  return {
    id,
    cost: () => (config.cost ? config.cost() : rebuyableCost(config.initialCost, config.increment, config.id)),
    otherReq,
    cap,
    costCap,
    description,
    preChargedEffect: () => config.preChargedEffect(player.celestials.teresa.perkShop[config.id]),
    chargedEffect: () => config.chargedEffect(player.celestials.teresa.perkShop[config.id]),
    effect: () => config.effect(player.celestials.teresa.perkShop[config.id]),
    formatEffect,
    formatCost,
    rebuyable: true,
    showEffectAfterCharge
  };
}

export const perkShop = {
  glyphLevel: rebuyable({
    id: 0,
    initialCost: 1,
    increment: 2,
    description: () => PerkShopUpgrade.glyphLevel.viewCharge ? `Multiply pre-instability Glyph level based on highest-ever
      Glyph level` : `Increase pre-instability Glyph levels by ${formatPercents(0.05)}`,
    effect: () => player.disablePostReality ? 1 : (PerkShopUpgrade.glyphLevel.isCharged
      ? PerkShopUpgrade.glyphLevel.chargedEffect()
      : PerkShopUpgrade.glyphLevel.preChargedEffect()),
    preChargedEffect: bought => Math.pow(1.05, bought),
    chargedEffect: () => Decimal.pow(player.records.bestEndgame.glyphLevel, 0.2).toNumber(),
    formatEffect: value => formatX(value, 2, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    cap: () => PerkShopUpgrade.glyphLevel.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? Math.pow(1.05, 20) : Math.pow(1.05, 11)),
    showEffectAfterCharge: true
  }),
  rmMult: rebuyable({
    id: 1,
    initialCost: 1,
    increment: 2,
    description: () => PerkShopUpgrade.rmMult.viewCharge ? `Multiply Reality Machine gain and cap based on
      ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount` : `Double Reality Machine gain`,
    effect: () => player.disablePostReality ? DC.D1 : (PerkShopUpgrade.rmMult.isCharged
      ? PerkShopUpgrade.rmMult.chargedEffect()
      : PerkShopUpgrade.rmMult.preChargedEffect()),
    preChargedEffect: bought => Decimal.pow(2, bought),
    chargedEffect: () => Decimal.log10(player.antimatter.add(10)),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    cap: () => PerkShopUpgrade.rmMult.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    showEffectAfterCharge: true
  }),
  bulkDilation: rebuyable({
    id: 2,
    initialCost: 100,
    increment: 2,
    description: () => PerkShopUpgrade.bulkDilation.viewCharge ? `Dilation Autobuyers always buy max.` : `Dilation
      autobuyers buy twice as many Dilation Upgrades at once.`,
    effect: () => player.disablePostReality ? 1 : (PerkShopUpgrade.bulkDilation.isCharged
      ? PerkShopUpgrade.bulkDilation.chargedEffect()
      : PerkShopUpgrade.bulkDilation.preChargedEffect()),
    preChargedEffect: bought => Math.pow(2, bought),
    chargedEffect: () => Math.pow(10, 300),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1638400 : 1600),
    cap: () => PerkShopUpgrade.bulkDilation.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? 16384 : 16),
    showEffectAfterCharge: false
  }),
  autoSpeed: rebuyable({
    id: 3,
    initialCost: 1000,
    increment: 2,
    description: () => PerkShopUpgrade.autoSpeed.viewCharge ? `Infinity Dimension, Time Dimension, Dilation, and Replicanti autobuyer
      intervals are Instant.` : `Infinity Dimension, Time Dimension, Dilation, and Replicanti autobuyers are ${formatX(2)} faster.`,
    effect: () => player.disablePostReality ? 1 : (PerkShopUpgrade.autoSpeed.isCharged
      ? PerkShopUpgrade.autoSpeed.chargedEffect()
      : PerkShopUpgrade.autoSpeed.preChargedEffect()),
    preChargedEffect: bought => Math.pow(2, bought),
    chargedEffect: () => Math.pow(10, 300),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 64000 : 4000),
    cap: () => PerkShopUpgrade.autoSpeed.isCharged
      ? Number.MAX_VALUE
      : (Ra.unlocks.perkShopIncrease.canBeApplied ? 64 : 4),
    showEffectAfterCharge: false
  }),
  musicGlyph: rebuyable({
    id: 4,
    description: () => PerkShopUpgrade.musicGlyph.viewCharge ? `Unlock an Autobuyer to automatically purchase and purge Music
      Glyphs.` : `Receive a Music Glyph of a random type that is ${formatPercents(0.8)} of your highest level. (Try clicking it!)`,
    cost: () => 1,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE,
    showEffectAfterCharge: false
  }),
  // Only appears with the perk shop increase upgrade
  fillMusicGlyph: rebuyable({
    id: 5,
    description: () => `Fill all empty slots in your inventory with Music Glyphs`,
    cost: () => Math.clampMin(GameCache.glyphInventorySpace.value, 1),
    otherReq: () => GameCache.glyphInventorySpace.value > 0,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE,
    showEffectAfterCharge: false
  }),
  // My bored ass having to do this shit smh also ditto to the above but for Teresa Expansion Pack
  addCharges: rebuyable({
    id: 6,
    initialCost: 1e10,
    increment: 1e10,
    description: () => `Unlock a new Charged Perk Upgrade`,
    effect: bought => Math.floor(bought),
    formatEffect: value => formatInt(value),
    formatCost: value => format(value, 2),
    costCap: () => 1e60,
    cap: () => 5,
    showEffectAfterCharge: false
  }),
};
