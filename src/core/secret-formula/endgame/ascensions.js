export const ascensions = {
  ipA: {
    id: 0,
    name: "IP Multiplier Ascension",
    zeroIndex: new Decimal("1e30000"),
    description: () => `Refactor the rebuyable IP Multiplier Upgrade into a rebuyable IP Power Upgrade`,
    onUnlock: () => {
      player.IPMultPurchases = DC.D0;
    }
  },
  epA: {
    id: 1,
    name: "EP Multiplier Ascension",
    zeroIndex: new Decimal("1e40000"),
    description: () => `Refactor the rebuyable EP Multiplier Upgrade into a rebuyable EP Power Upgrade`,
    onUnlock: () => {
      player.epmultUpgrades = DC.D0;
    }
  },
  dbA: {
    id: 2,
    name: "Dimension Boost Ascension",
    zeroIndex: new Decimal("1e60000"),
    description: () => `Refactor Dimension Boosts into Dimension Surges, which provide a power effect to all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions`,
    onUnlock: () => {
      player.dimensionBoosts = DC.D0;
    }
  },
  b10mA: {
    id: 3,
    name: "Buy 10 Multiplier Ascension",
    zeroIndex: new Decimal("1e100000"),
    description: () => `Refactor the Buy 10 Multiplier for ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions into a Buy OoM Power`
  },
  sacA: {
    id: 4,
    name: "Dimensional Sacrifice Ascension",
    zeroIndex: new Decimal("1e200000"),
    description: () => `Refactor the Dimensional Sacrifice Multiplier into a Dimensional Sacrifice Power`
  },
  ocA: {
    id: 5,
    name: "Overcharge Ascension",
    zeroIndex: new Decimal("1e400000"),
    description: () => `Unlock the Overcharge`
  },
  oc2A: {
    id: 6,
    name: "Overcharge Ascension Type 2",
    zeroIndex: new Decimal("1e2500000"),
    description: () => `Unlock the Overcharge Level 2`
  },
  oc3A: {
    id: 7,
    name: "Overcharge Ascension Type 3",
    zeroIndex: new Decimal("1e6250000"),
    description: () => `Unlock the Overcharge Level 3`
  },
  oc4A: {
    id: 8,
    name: "Overcharge Ascension Type 4",
    zeroIndex: new Decimal("1e50000000"),
    description: () => `Unlock the Overcharge Level 4`
  }
};
