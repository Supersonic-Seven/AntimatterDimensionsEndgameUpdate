export const expansionPacks = {
  teresaPack: {
    name: "Teresa's Expansion Pack",
    id: "teresaPack",
    symbol: "Ϟ",
    get description() {
      return ` Uncap Teresa's Canister.
        Teresa's Canister now affects the Reality Machine cap as well as Reality Machine gain.
        Keep Perk Shop on Endgame.
        Unlock Charged Perk Upgrades in the Teresa Tab.
        Automatically pour RM into Teresa.`
    },
    cost: Decimal.pow(10, 1e30),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  effarigPack: {
    name: "Effarig's Expansion Pack",
    id: "effarigPack",
    symbol: "Ϙ",
    get description() {
      return ` Multiply Relic Shard gain by the logarithm of your ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount (Currently ${formatX(player.antimatter.max(10).log10(), 2)}).
        The Effarig Level ${formatInt(10)} reward in Ra is improved so that Effarig Glyphs are always generated with ${formatInt(7)} effects.
        Increase Glyph Alchemy caps to a base of one-third of your all-time maximum Glyph Level (Currently ${formatHybridLarge(player.records.bestEndgame.glyphLevel.div(3), 3)}).
        Alchemy resources are kept on Endgame, and making a Reality Glyph no longer spends Reality resources.
        Effarig's Shop starts completed.
        Layers of Effarig's Reality will automatically complete themselves ten times faster than the time of your fastest Endgame (Currently ${TimeSpan.fromMilliseconds(new Decimal(player.records.bestEndgame.realTime).div(10)).toStringShort()} per layer)`
    },
    cost: Decimal.pow(10, 1e50),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  enslavedPack: {
    name: "The Nameless Ones' Expansion Pack",
    id: "enslavedPack",
    symbol: "\uf0c1",
    get description() {
      return ` Charging your Black Hole always only takes ${formatPercents(0.99)} of your total Game Speed.
        Unlock optimizers for adjusting the amount of your stored time you desire to discharge as well as the interval at which you want to discharge your Stored Time.
        Double the strength of all Effective Tesseracts.
        Tesseracts multiply Endgames as well as reducing the Infinity Dimension Compression Magnitude slightly (Currently ${formatX(Math.floor(1 + Math.pow(Math.log10(Math.min(Tesseracts.effectiveCount, 1000) * Math.max(Math.log10(Tesseracts.effectiveCount) - 2, 1) + 1), Math.log10(player.endgames + 1))), 2, 2)}, ${formatX(Math.pow(1 / Math.log10(Tesseracts.effectiveCount + 1), 0.2), 2, 3)}).
        Start Endgames with the Nameless Ones completed.
        Unlock an autobuyer for Tesseracts.`
    },
    cost: Decimal.pow(10, 1e70),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  vPack: {
    name: "V's Expansion Pack",
    id: "vPack",
    symbol: "⌬",
    get description() {
      return ` Start with V's Reality unlocked.
        Automatically unlock one V-Achievement (includes Hard V-Achievements) every ${TimeSpan.fromSeconds(new Decimal(60))}, which can be reduced by spending Celestial Points.
        Double all gained Space Theorems.`
    },
    cost: Decimal.pow(10, 1e90),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  raPack: {
    name: "Ra's Expansion Pack",
    id: "raPack",
    symbol: "\uf185",
    get description() {
      return ` Ra is kept on Endgame.
        Raise the level cap of all Celestials to the double-logarithm of your record ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount (Currently ${formatHybridLarge(Decimal.max(Decimal.floor(player.records.bestAntimatterExponentOutsideDoom.max(1).log10()), 25), 3)}).
        Unlock ${formatInt(7)} new effects for each Celestial which can be obtained by increasing the level of each Celestial.
        Multiply Memory and Memory Chunk gain by ${formatX(10)}.`
    },
    cost: Decimal.pow(10, 1e110),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  laitelaPack: {
    name: "Lai'tela's Expansion Pack",
    id: "laitelaPack",
    symbol: "ᛝ",
    get description() {
      return ` Unlock an autobuyer that will increase/decrease the bulk Singularity level based on an inputted time for each.
        While in Lai'tela's Reality, Game Speed returns to normal twice as fast.
        Square the Annihilation to ${formatInt(8)}th DMD multiplier if Annihilation multiplier currently affects the ${formatInt(8)}th DMD.
        Reduce the DMD Interval increase on Ascension by ${formatInt(200)}.
        Multiply Dark Matter gain by the double-logarithm of your ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount or the logarithm of your Imaginary Machine amount, whichever is bigger (Currently ${formatX(Decimal.max(player.antimatter.max(1e10).log10().log10(), player.reality.imaginaryMachines.max(10).log10()), 2, 2)}).
        Start Endgames with ${formatInt(10)} Singularities.
        Multiply Dark Energy gain by the logarithm of your Singularity amount squared (Currently ${formatX(player.celestials.laitela.singularities.max(10).log10().pow(2), 2, 2)}).
        Raise the Annihilation effect to a power based on Dark Matter (Currently ${formatPow(Decimal.pow((Decimal.log10(Decimal.log10(Currency.darkMatter.value.add(1)).add(1)).add(1)).div(2), 2).add(1), 2, 3)}).
        Improve the Annihilation autobuyer.
        Unlock the ability to Hadronize Lai'tela's Reality.
        The reward for destabilizing Lai'tela's Reality now affects the Dark Matter Cap as well.
        The maximum gain of Entropy per second is multiplied by ${formatInt(10)}.`
    },
    cost: Decimal.pow(10, 1e130),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  pellePack: {
    name: "Pelle's Expansion Pack",
    id: "pellePack",
    symbol: "♅",
    get description() {
      return ` Reduce the Galaxy Generator Instability Magnitude by ${formatInt(1)}.
        Raise the first three types of Dimensions to a power based on your all-time record Galaxy amount (Currently ${formatPow(Decimal.pow(Decimal.log10(player.records.bestEndgame.galaxies).div(100), 1.5).add(1), 2, 3)}).
        Unlock autobuyers for the repeatable Galaxy Generator upgrades.`
    },
    cost: Decimal.pow(10, 1e150),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  alphaPack: {
    name: "Alpha's Expansion Pack",
    id: "alphaPack",
    symbol: "α",
    get description() {
      return ` Unlock the Large Hadron Collider, which can accelerate your Hadrons to exponentially gain more ${player.universes.current === 2 ? "Matter" : "Antimatter"}.
        Unlock The Void, which is a feature that functions similarly to Time Dilation and boosts Accelerator production.`
    },
    cost: Decimal.pow(10, 1e200),
    formatCost: value => formatPostBreak(value, 2, 0)
  },
  slabPack: {
    name: "Slabdrill's Expansion Pack",
    id: "slabPack",
    symbol: "⁹δ",
    get description() {
      return ` Allow Serpentine Power to be collected outside the Cursed Reality.
        Reunlock the Cursed Core, and boost Chaos Core find chance and interval by Celestial Points, Celestial Reality Machines and Celestial Runes rather than Slabdrill Strikes.
        Refactor all Serpentine Power effects.`
    },
    cost: Decimal.pow(10, 1e275),
    formatCost: value => formatPostBreak(value, 2, 0)
  }
};
