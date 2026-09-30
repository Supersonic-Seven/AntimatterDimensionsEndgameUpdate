export const endgameMilestones = {
  riftFill: {
    endgames: 1,
    reward: () => {
      return `Rift Fill is ${formatPercents(0.05)} faster per Endgame, capping at ${formatPercents(Alpha.isDestroyed ? 0.9 : 0.45)} after ${formatInt(9)} Endgames ` + 
        (player.disablePostReality ? "(Destroyed)" : (player.endgames >= 1
         ? (player.endgames >= 9 ? "(Capped: " : "(Currently: ") + `+${formatPercents(Math.min(0.45, player.endgames * 0.05) + (Alpha.isDestroyed ? 0.45 : 0))})`
         : "(You have not yet reached this milestone)"));
    }
  },
  galGenAnimation: {
    endgames: 2,
    reward: () => {
      return `Galaxy Generator Animations are ${formatX(1.2, 0, 1)} faster every ${formatInt(2)} Endgames, capping after ${formatInt(40)} Endgames ` + 
        (player.disablePostReality ? "(Destroyed)" : (player.endgames >= 2
         ? (player.endgames >= 40 && !Alpha.isDestroyed ? "(Capped: " : "(Currently: ") + (Alpha.isDestroyed ? "Instant)" : `${formatX(Math.pow(1.2, Math.floor(Math.min(Currency.endgames.value, 40) / 2)), 2, 2)})`)
         : "(You have not yet reached this milestone)"));
    }
  },
  vReduction: {
    endgames: 3,
    reward: () => {
      return `Reduce the Realities requirement for unlocking V's Reality to ${formatInt(100)}`;
    }
  },
  fasterGalaxies: {
    endgames: 5,
    reward: "Unlock a new Galaxy Generator Upgrade"
  },
  achievementKeep: {
    endgames: 7,
    reward: "Keep Achievements on Endgame"
  },
  startRa: {
    endgames: 10,
    reward: () => {
      return `Start Endgames with all Ra Level ${formatInt(1)} Rewards`;
    }
  },
  celestialEarlyUnlock: {
    endgames: 15,
    reward: () => {
      return `Start Endgames with the first ${formatInt(6)} Celestials unlocked`;
    }
  },
  keepPerks: {
    endgames: 25,
    reward: "Keep Perk Tree on Endgame"
  },
  gameSpeedUncap: {
    endgames: 35,
    reward: () => {
      return `Remove the ${format(1e300, 2, 2)} Game Speed Hardcap`;
    }
  },
  bhAutos: {
    endgames: 50,
    reward: "Start with both Black Holes permanent"
  },
  startSac: {
    endgames: 100,
    reward: () => {
      return `Start with ${format(1e100, 2, 2)} Glyph Sacrifice of all types`;
    }
  },
  moreFasterGalaxies: {
    endgames: 200,
    reward: () => {
      return "Endgames boost Galaxy Production in Pelle " + 
        (player.disablePostReality ? "(Destroyed)" : (player.endgames >= 200
         ? `(Currently: ${formatX(Decimal.pow(10, Math.min(Currency.endgames.value / 200, 50)).times(Decimal.pow(10, Math.max((Math.log10(Currency.endgames.value + 1) - 4) * 50, 0))), 2, 2)})`
         : "(You have not yet reached this milestone)"));
    }
  },
  autobuyerEndgame: {
    endgames: 400,
    reward: "Unlock autobuyer for Endgames"
  },
  endgameAntimatter: {
    endgames: 1000,
    reward: () => {
      return `Gain a power to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Production based on Endgames, which is stronger in Pelle ` + 
        (player.disablePostReality ? "(Destroyed)" : (player.endgames >= 1000
         ? `(Currently: ${formatPow(Pelle.isDoomed ? 1 + (Math.log10(Math.min(Currency.endgames.value, 1e6) * Math.max(Math.log2(Currency.endgames.value + 1) - Math.log2(5e5), 1) + 1) / 80) : 1 + (Math.log10(Math.min(Currency.endgames.value, 1e6) * Math.max(Math.log2(Currency.endgames.value + 1) - Math.log2(5e5), 1) + 1) / 200), 2, 3)})`
         : "(You have not yet reached this milestone)"));
    }
  },
  instabilityReduction: {
    endgames: 1000000,
    reward: () => {
      return "Endgames decrease the Galaxy Generator Instability Magnitude " + 
        (player.disablePostReality ? "(Destroyed)" : (player.endgames >= 1000000
         ? `(Currently: ${formatPow(Math.pow(1 / Math.log10(Currency.endgames.value + 1), 0.1), 2, 3)})`
         : "(You have not yet reached this milestone)"));
    }
  }
};
