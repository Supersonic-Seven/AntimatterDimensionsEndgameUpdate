export const divinityMilestones = {
  firstDivine: {
    divinities: 1,
    get reward() {
      return ` The ${format(Decimal.pow10(1e150))} and ${format(Decimal.pow10(1e225))} ${player.universes.current === 2 ? "Matter" : "Antimatter"} softcaps are replaced with a softcap that applies at ${format(DC.E9E15)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} and will get stronger with each Divinity
        Unlock a new Galaxy Generator Upgrade
        All Galaxy Generator Upgrade rewards are squared
        Achievement 207 uses an adjusted formula which improves based on Divinities
        Each Divinity squares the gain of Celestial Points and Doomed Particles
        Start Doom with all Pelle Upgrades purchased
        Reduce the Celestial Matter Softcap by ${formatPercents(0.05)}
        Reduce the Hadron Effect cap time for all Hadron/Dark Hadron effects by ${formatPercents(0.2)}
        Gain ${formatX(10)} more Endgames
        Power Dual Machines by ${format(1.1, 1, 1)}
        The log10 of your highest-ever Galaxy amount multiplies Entropy gain`;
    }
  },
  divineDimensions: {
    divinities: 2,
    get reward() {
      return ` Unlock Divine Dimensions
        Unlock Divinity Upgrades
        Unlock a new Galaxy Generator Upgrade
        Pending Remnants are gained immediately without Armageddon required
        Reduce the Hadron Effect cap time for all Hadron/Dark Hadron effects by ${formatPercents(0.2)}
        Reduce the time for Remnants of Alpha Decay to cap by ${formatPercents(0.2)}
        Galaxy Generator Upgrade Autobuyers buy max`;
    }
  },
  hadronEmpowerment: {
    divinities: 3,
    get reward() {
      return ` Automatically destabilize Lai'tela's Reality if your ${player.universes.current === 2 ? "Matter" : "Antimatter"} exceeds the amount required to disable it in less than ${formatInt(30)} seconds (which is boosted by Entropy generation), rooted by ${formatInt(8)} divided by the number of Dimensions left intact
        Automatically hadronize Lai'tela's Reality if all ${formatInt(8)} Dimensions are disabled
        Hadrons and Dark Hadrons are now equal, and you can instead merge them into Exotic Hadrons which reduce the time it takes for Hadron effects to cap
        Forming Singularities no longer resets anything
        The ${formatInt(8)}th Galaxy Generator Upgrade is stronger
        Multiply all Divine Dimensions and Divine Energy production by ${formatX(77)}
        Dark Matter Annihilation no longer resets anything
        Ethereal Power generation is multiplied by ${formatInt(10)}
        Unlock Alpha's Expansion Pack`;
    }
  },
  pelleQoL: {
    divinities: 4,
    get reward() {
      return ` Start Pelle with Infinity/Break Upgrades purchased/charged
        Upon entering Pelle, rifts automatically reach ${formatPercents(1)} fill
        After uncapping the Galaxy Generator, rifts fill ${formatX(10)} faster
        Divine Dimensions are raised ${formatPow(1.05, 2, 2)}
        Reduce the time for Remnants of Alpha Decay to cap by ${formatPercents(0.5)}
        Reduce the Celestial Matter Softcap by ${formatPercents(0.2)}
        Improve the effect of Exotic Hadrons`;
    }
  },
  celestialSurge: {
    divinities: 5,
    get reward() {
      return ` The Hepteract effect now also affects the Celestial Matter Corruption Magnitude
        While inside The Void, ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers are squared
        After uncapping the Galaxy Generator, rifts fill an additional ${formatX(10)} faster
        Unlock a new Galaxy Generator Upgrade
        Reduce the time for Hadrons to cap by ${formatPercents(0.75)}
        Multiply Ethereal Power Generation by ${formatInt(1000)}
        Effarig Level ${formatInt(40)} applies to the first ${formatInt(5)} levels of Glyph Instability instead of the first ${formatInt(3)}`;
    }
  },
  finalRebirth: {
    divinities: 7,
    get reward() {
      return ` The sixth Glyph Instability threshold is weaker
        While inside The Void, ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension are powered based on real-time spent this Endgame
        After uncapping the Galaxy Generator, rifts fill an additional ${formatX(100)} faster
        Divine Dimensions are raised ${formatPow(1.05, 2, 2)}
        Reduce the time for Hadrons to cap by ${formatPercents(0.5)}
        Reduce the time for Remnants of Alpha Decay to cap by ${formatPercents(0.25)}
        Gain a multiplier to Entropy based on real-time spent this Endgame
        Exotic Hadrons are slightly stronger once again`;
    }
  },
  ascendedSurge: {
    divinities: 10,
    get reward() {
      return ` Delay the sixth Instability threshold by ${formatPercents(0.1)}
        After uncapping the Galaxy Generator, rifts fill an additional ${formatX(1000)} faster
        Reduce the time for Hadrons to cap by ${formatPercents(0.75)}
        Reduce the time for Remnants of Alpha Decay to cap by ${formatPercents(0.5)}
        Game Speed affects Ethereal Power generation at a severely reduced rate
        You can now Ascend Cosmic Sectors in bulk
        Unlock Autobuyers for Endgame Upgrades`;
    }
  },
  universes: {
    divinities: 13,
    get reward() {
      return ` Unlock the Transient Universe`;
    }
  },
  powerBurst: {
    divinities: 17,
    get reward() {
      return ` Empower Singularities based on highest Galaxies
        While inside the Overcharge, ${player.universes.current === 2 ? "Matter" : "Antimatter"} production gains a power effect applying after the tetration nerf based on real time spent inside the Overcharge
        Gain ${formatX(10)} more Hawking Radiation
        Gain ${formatX(1000)} more Stars of all types`;
    }
  },
  serpentPower: {
    divinities: 22,
    get reward() {
      return ` Square Singularity Gain
        Double the maximum Hadron effectiveness
        Gain ${formatX(10)} more Hawking Radiation
        Gain ${formatX(10)} more Thermal Radiation
        Gain ${formatX(10)} more generated Endgame Skills
        Unlock Slabdrill’s Expansion Pack`;
    }
  }
};
