export const permanentEndgameMasteries = [
  {
    id: 1,
    description: "Unlock Endgame Upgrades",
    cost: 20,
    requirement: () => {
      const esRequirement = Currency.endgameSkills.max.gte(EndgameMastery.endgameUpgrades.totalEndgameSkillRequirement);
      const emRequirement = [171].some(id => EndgameMastery(id).isBought);
      return emRequirement && esRequirement;
    }
  },
  {
    id: 2,
    description: "Make all above non-permanent Endgame Masteries free",
    cost: 100,
    requirement: () => {
      const esRequirement = Currency.endgameSkills.max.gte(EndgameMastery.permaMasteries.totalEndgameSkillRequirement);
      const emRequirement = EndgameMastery.endgameUpgrades.isBought;
      return emRequirement && esRequirement;
    }
  },
  {
    id: 3,
    description: "Unlock Time Compression",
    cost: 12000000,
    requirement: () => {
      const esRequirement = Currency.endgameSkills.max.gte(EndgameMastery.timeCompression.totalEndgameSkillRequirement);
      const emRequirement = [271, 272, 273, 274].every(id => EndgameMastery(id).isBought);
      return emRequirement && esRequirement;
    }
  },
  {
    id: 4,
    description: "Unlock Celestial Reality",
    cost: 1e15,
    requirement: () => EndgameMasteryState.all.every(u => u.isBought)
  }
];
