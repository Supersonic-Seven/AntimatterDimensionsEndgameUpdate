import wordShift from "../../word-shift";

export const slabdrillUnlocks = {
  dimboost: {
    id: 0,
    requirement: 1,
    name: "First Dimension Boost",
    nerfDescription: () => `The Dimension Boost base multiplier is reduced to ${format(1.01, 2, 2)}, all base Dimension Boost multiplier improvements are adjusted accordingly`,
    buffDescription: () => `Serpentine Power now affects the Dimension Boost multiplier at a reduced rate, and recreate Celestial Dimensions but they will be severely nerfed`
  },
  galaxy: {
    id: 1,
    requirement: 2,
    name: "First Galaxy",
    nerfDescription: () => `Distant Galaxy Cost Scaling starts at ${formatInt(0)} Galaxies`,
    buffDescription: () => `Serpentine Power now affects Galaxy strength at a reduced rate, and recreate one Glyph Sacrifice effect every ${formatInt(2)} Slabdrill stages, but they will be severely nerfed`
  },
  infinity: {
    id: 2,
    requirement: 3,
    name: "Infinity",
    nerfDescription: () => `The Tickspeed multiplier is raised to the power of ${format(0.42, 2, 2)}`,
    buffDescription: () => `Serpentine Power now empowers your Antimatter Dimension at a severely reduced rate, and recreate Break Eternity Upgrades but their costs and effects will be refactored`
  },
  breakInfinity: {
    id: 3,
    requirement: 4,
    name: "Break Infinity",
    nerfDescription: () => `Dimensions/Tickspeed Post-Infinity Cost Scaling start at ${formatX(25)} and non-rebuyable Break Infinity Upgrades are ${formatX(1000)} more expensive`,
    buffDescription: () => `The Dimension/Tickspeed Post-Infinity Cost Scale Reduction upgrade cost scalings are reduced (Tickspeed ${formatX(5)} ➜ ${formatX(2)}, ADs ${formatX(5000)} ➜ ${formatX(5)}), the first three Infinity Dimension unlocks are cheaper, Serpentine Power now affects Infinity Points at a reduced rate, and recreate a Glyph slot but Glyph effects are weaker`
  },
  infinityChallengeFour: {
    id: 4,
    requirement: 5,
    name: "Infinity Challenge 4",
    nerfDescription: () => `All Infinity Dimension multipliers are raised to the power of ${format(0.75, 2, 2)}`,
    buffDescription: () => `Serpentine Power now affects Infinity Dimensions at a reduced rate, raise the Infinity Power Conversion Rate to ${formatPow(1.5, 1, 1)}, and recreate extra Continuum purchases but they are significantly nerfed`
  },
  replicanti: {
    id: 5,
    requirement: 6,
    name: "Replicanti",
    nerfDescription: () => `The Replicanti Interval is ${formatX(10)} longer, Replicate Chance is divided by ${formatInt(1000)}, the Replicanti interval is ${formatX(2)} per ${format(DC.NUMMAX, 2, 2)} Replicanti instead of ${format(1.2, 1, 1)} past ${format(DC.NUMMAX, 2, 2)} Replicanti, and Tickspeed is again raised ${formatPow(0.42, 2, 2)}`,
    buffDescription: () => `Serpentine Power now affects Replicanti Speed at a reduced rate and recreate the Ethereal but Ethereal Power generation and effects are weaker`
  },
  eternity: {
    id: 6,
    requirement: 7,
    name: "Eternity",
    nerfDescription: () => `All Infinity Dimension multipliers are raised to the power of ${format(0.75, 2, 2)}`,
    buffDescription: () => `Serpentine Power now affects Time Dimensions at a reduced rate, and recreate a second Glyph slot and Endgame Masteries ${formatInt(101)} to ${formatInt(104)}`
  },
  timeStudy181: {
    id: 7,
    requirement: 8,
    name: "Time Study 181",
    nerfDescription: () => `Infinity Point and Eternity Point gain from all sources is raised to the power of ${format(0.9, 1, 1)}, raise Time Dimensions to the power of ${formatPow(0.75, 2, 2)}, Infinity Dimension purchases now cap at ${formatInt(5000)}, and any Galaxy type that exceeds ${formatInt(100)} is ${formatX(10)} weaker thereafter`,
    buffDescription: () => `Serpentine Power now affects Eternity Points at a reduced rate, recreate a third Glyph slot, and recreate Relic Shards but they only have the Glyph Sacrifice Power effect and the gain and effect is weaker`
  },
  eternityChallengeTen: {
    id: 8,
    requirement: 9,
    name: "Eternity Challenge 10",
    nerfDescription: () => `Infinities from all sources are divided by ${format(1e20)}, your Antimatter Dimension and all Infinity Dimensions are raised ${formatPow(0.75, 2, 2)}, the Free Tickspeed Threshold softcap starts ${formatX(10)} sooner and it is ${formatX(10)} stronger`,
    buffDescription: () => `Serpentine Power now affects Infinities at a reduced rate, recreate a fourth Glyph slot, and recreate all destroyed rewards from the first ${formatInt(13)} rows of Achievements`
  },
  dilation: {
    id: 9,
    requirement: 10,
    name: "Time Dilation",
    nerfDescription: () => `Dilated Time and Tachyon Particle gains are raised to the power of ${format(0.25, 2, 2)} and Serpentine Power does nothing while Dilated`,
    buffDescription: () => `Serpentine Power now affects Dilated Time production at a severely reduced rate, gain a ${formatX(16)} multiplier to Chaos Core find chance, recreate a fifth Glyph slot, and recreate the first six Alchemy resources but reduce their caps`
  },
  reality: {
    id: 10,
    requirement: 11,
    name: "Reality",
    nerfDescription: () => Slabdrill.isCursed ? `You are here ${wordShift.wordCycle(["Infinite", "Forever", "Eternal"])}` : "None",
    buffDescription: () => Slabdrill.isCursed ? `${wordShift.randomCrossWords("Goodbye")}` : "Unlock the 9th Dimension"
  }
};
