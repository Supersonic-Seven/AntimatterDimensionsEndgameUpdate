import { accelerators } from "./accelerators";
import { ascensions } from "./ascensions";
import { breakEternityUpgrades } from "./break-eternity-upgrades";
import { compressionUpgrades } from "./compression-upgrades";
import { endgameMasteries } from "./endgame-masteries";
import { permanentEndgameMasteries } from "./permanent-endgame-masteries";
import { endgameMilestones } from "./endgame-milestones";
import { endgameUpgrades } from "./endgame-upgrades";
import { galacticPowerRewards } from "./galactic-power";
import { expansionPacks } from "./expansion-packs";
import { stars } from "./stars";
import { celestialInfinityUpgrades } from "./celestial-dimension-expansion/celestial-infinity-upgrades";
import { celestialBreakInfinityUpgrades } from "./celestial-dimension-expansion/celestial-break-infinity-upgrades";
import { celestialEternityUpgrades } from "./celestial-dimension-expansion/celestial-eternity-upgrades";
import { celestialEternityPlusUpgrades } from "./celestial-dimension-expansion/celestial-eternity-plus-upgrades";
import { nullUpgrades } from "./null-upgrades";

export const endgame = {
  breakUpgrades: breakEternityUpgrades,
  masteries: endgameMasteries,
  permanentMasteries: permanentEndgameMasteries,
  milestones: endgameMilestones,
  upgrades: endgameUpgrades,
  galacticPowers: galacticPowerRewards,
  packs: expansionPacks,
  stars: stars,
  celDimExpansion: {
    celestialInfinityUpgrades: celestialInfinityUpgrades,
    celestialBreakUpgrades: celestialBreakInfinityUpgrades,
    celestialEternityUpgrades: celestialEternityUpgrades,
    celestialEternityPlusUpgrades: celestialEternityPlusUpgrades
  },
  accelerators: accelerators,
  nullUpgrades: nullUpgrades,
  ascensions: ascensions,
  compression: compressionUpgrades
};
