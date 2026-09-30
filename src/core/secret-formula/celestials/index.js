import { finalSigil } from "./navigation-sigils/final-sigil";
import { galaxyIcon } from "./navigation-sigils/galaxy-icon";
import { alchemyResources } from "./alchemy";
import { alphaUnlocks } from "./alpha";
import { divinityMilestones } from "./divinity-milestones";
import { divinityUpgrades } from "./divinity-upgrades";
import { effarigUnlocks } from "./effarig";
import { enslaved } from "./enslaved";
import { pelleGalaxyGeneratorUpgrades } from "./galaxy-generator";
import { celestialNavigation } from "./navigation";
import { pelleUpgrades } from "./pelle-upgrades";
import { pelleAchievementEnabling } from "./pelle-destruction-upgrades";
import { pelleDestructionUpgrades } from "./pelle-destruction-upgrades";
import { pelleRealityUpgradeEnabling } from "./pelle-destruction-upgrades";
import { pelleImaginaryUpgradeEnabling } from "./pelle-destruction-upgrades";
import { pelleCelestialRewardEnabling } from "./pelle-destruction-upgrades";
import { pellePerkEnabling } from "./pelle-destruction-upgrades";
import { pelleAlchemyEnabling } from "./pelle-destruction-upgrades";
import { pelleStrikeDisabling } from "./pelle-destruction-upgrades";
import { perkShop } from "./perk-shop";
import { ra } from "./ra";
import { resurgenceUpgrades } from "./resurgence-upgrades";
import { pelleRifts } from "./rifts";
import { singularityMilestones } from "./singularity-milestones";
import { slabdrillUnlocks } from "./slabdrill";
import { pelleStrikes } from "./strikes";
import { teresa } from "./teresa";
import { quotes } from "./quotes";
import { v } from "./v";
import { vUpgrades } from "./v";

export const celestials = {
  effarig: {
    unlocks: effarigUnlocks
  },
  alchemy: {
    resources: alchemyResources
  },
  alpha: {
    unlocks: alphaUnlocks
  },
  pelle: {
    galaxyGeneratorUpgrades: pelleGalaxyGeneratorUpgrades,
    strikes: pelleStrikes,
    upgrades: pelleUpgrades,
    rifts: pelleRifts
  },
  pelleDestruction: {
    upgrades: pelleDestructionUpgrades,
    achievements: pelleAchievementEnabling,
    realityUpgrades: pelleRealityUpgradeEnabling,
    imaginaryUpgrades: pelleImaginaryUpgradeEnabling,
    celestials: pelleCelestialRewardEnabling,
    perks: pellePerkEnabling,
    alchemy: pelleAlchemyEnabling,
    strikes: pelleStrikeDisabling
  },
  divinityMilestones,
  divinityUpgrades,
  descriptions: {},
  enslaved,
  navigation: celestialNavigation,
  navSigils: {
    ...galaxyIcon,
    ...finalSigil
  },
  perkShop,
  ra,
  resurgenceUpgrades,
  singularityMilestones,
  slabdrill: {
    unlocks: slabdrillUnlocks
  },
  teresa,
  quotes,
  v,
  vUpgrades
};
