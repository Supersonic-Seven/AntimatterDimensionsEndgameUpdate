// Temporarily aggregate tab components here until GameUI is migrated to SFC
import AlchemyTab from "./alchemy/AlchemyTab";
import AlphaTab from "./celestial-alpha/AlphaTab";
import AntimatterDimensionsTab from "./antimatter-dimensions/AntimatterDimensionsTab";
import AscensionTab from "./ascension/AscensionTab";
import AutobuyersTab from "./autobuyers/AutobuyersTab";
import AutomatorTab from "./automator/AutomatorTab";
import BlackHoleTab from "./black-hole/BlackHoleTab";
import BreakInfinityTab from "./break-infinity/BreakInfinityTab";
import BreakEternityTab from "./break-eternity/BreakEternityTab";
import CelestialBreakInfinityTab from "./celestial-dimension-expansion/CelestialBreakInfinityTab";
import CelestialDimensionsTab from "./celestial-dimensions/CelestialDimensionsTab";
import CelestialEternityPlusUpgradesTab from "./celestial-dimension-expansion/CelestialEternityPlusUpgradesTab";
import CelestialEternityUpgradesTab from "./celestial-dimension-expansion/CelestialEternityUpgradesTab";
import CelestialInfinityUpgradesTab from "./celestial-dimension-expansion/CelestialInfinityUpgradesTab";
import CelestialNavigationTab from "./celestial-navigation/CelestialNavigationTab";
import ChallengeRecordsTab from "./challenge-records/ChallengeRecordsTab";
import DivineDimensionsTab from "./divine-dimensions/DivineDimensionsTab";
import DivinityMilestonesTab from "./divinity-milestones/DivinityMilestonesTab";
import DivinityUpgradesTab from "./divinity-upgrades/DivinityUpgradesTab";
import DualityUpgradesTab from "./duality-upgrades/DualityUpgradesTab";
import EffarigTab from "./celestial-effarig/EffarigTab";
import EndgameTab from "./endgame/EndgameTab";
import EndgameMasteriesTab from "./endgame-masteries/EndgameMasteriesTab";
import EndgameMilestonesTab from "./endgame-milestones/EndgameMilestonesTab";
import EndgameUpgradesTab from "./endgame-upgrades/EndgameUpgradesTab";
import EnslavedTab from "./celestial-enslaved/EnslavedTab";
import EternityChallengesTab from "./eternity-challenges/EternityChallengesTab";
import EternityMilestonesTab from "./eternity-milestones/EternityMilestonesTab";
import EternityUpgradesTab from "./eternity-upgrades/EternityUpgradesTab";
import EtherealTab from "./ethereal/EtherealTab";
import ExpansionPacksTab from "./endgame/ExpansionPacksTab";
import GalacticPowerTab from "./galactic-power/GalacticPowerTab";
import GlyphSetRecordsTab from "./glyph-set-records/GlyphSetRecordsTab";
import GlyphsTab from "./glyphs/GlyphsTab";
import HypercubesTab from "./hypercubes/HypercubesTab";
import ImaginaryUpgradesTab from "./imaginary-upgrades/ImaginaryUpgradesTab";
import InfinityChallengesTab from "./infinity-challenges/InfinityChallengesTab";
import InfinityDimensionsTab from "./infinity-dimensions/InfinityDimensionsTab";
import InfinityUpgradesTab from "./infinity-upgrades/InfinityUpgradesTab";
import LaitelaTab from "./celestial-laitela/LaitelaTab";
import LargeHadronColliderTab from "./large-hadron-collider/LargeHadronColliderTab";
import MultiplierBreakdownTab from "./statistics/MultiplierBreakdownTab";
import NormalAchievementsTab from "./normal-achievements/NormalAchievementsTab";
import NormalChallengesTab from "./normal-challenges/NormalChallengesTab";
import OptionsGameplayTab from "./options-gameplay/OptionsGameplayTab";
import OptionsSavingTab from "./options-saving/OptionsSavingTab";
import OptionsVisualTab from "./options-visual/OptionsVisualTab";
import PastPrestigeRunsTab from "./past-prestige-runs/PastPrestigeRunsTab";
import PelleDestructionTab from "./celestial-pelle/PelleDestructionTab";
import PelleTab from "./celestial-pelle/PelleTab";
import PerksTab from "./perks/PerksTab";
import PreviousSpeedrunTab from "./speedrun-milestones/PreviousSpeedrunTab";
import RaTab from "./celestial-ra/RaTab";
import RealityUpgradesTab from "./reality-upgrades/RealityUpgradesTab";
import ReplicantiTab from "./replicanti/ReplicantiTab";
import ResurgenceUpgradesTab from "./resurgence-upgrades/ResurgenceUpgradesTab";
import SecretAchievementTab from "./secret-achievements/SecretAchievementTab";
import ShopTab from "./shop/ShopTab";
import SlabdrillTab from "./celestial-slabdrill/SlabdrillTab";
import SpeedrunMilestonesTab from "./speedrun-milestones/SpeedrunMilestonesTab";
import StatisticsTab from "./statistics/StatisticsTab";
import StoredTimeTab from "./statistics/StoredTimeTab";
import TangibleUniverseTab from "./tangible-universe/TangibleUniverseTab";
import TeresaTab from "./celestial-teresa/TeresaTab";
import TimeCompressionTab from "./time-compression/TimeCompressionTab";
import TimeDilationTab from "./time-dilation/TimeDilationTab";
import TimeDimensionsTab from "./time-dimensions/TimeDimensionsTab";
import TimeStudiesTab from "./time-studies/TimeStudiesTab";
import TransientUniverseTab from "./transient-universe/TransientUniverseTab";
import VTab from "./celestial-v/VTab";

const TabComponents = {
  AntimatterDimensionsTab,
  InfinityDimensionsTab,
  TimeDimensionsTab,
  CelestialDimensionsTab,
  DivineDimensionsTab,
  OptionsSavingTab,
  OptionsVisualTab,
  OptionsGameplayTab,
  StatisticsTab,
  ChallengeRecordsTab,
  PastPrestigeRunsTab,
  GlyphSetRecordsTab,
  SpeedrunMilestonesTab,
  PreviousSpeedrunTab,
  StoredTimeTab,
  NormalAchievementsTab,
  SecretAchievementTab,
  TeresaTab,
  EffarigTab,
  EnslavedTab,
  VTab,
  RaTab,
  LaitelaTab,
  PelleTab,
  AlphaTab,
  SlabdrillTab,
  AutobuyersTab,
  AutomatorTab,
  NormalChallengesTab,
  InfinityChallengesTab,
  EternityChallengesTab,
  InfinityUpgradesTab,
  BreakInfinityTab,
  ReplicantiTab,
  TimeStudiesTab,
  EternityUpgradesTab,
  EternityMilestonesTab,
  TimeDilationTab,
  GlyphsTab,
  RealityUpgradesTab,
  ImaginaryUpgradesTab,
  DualityUpgradesTab,
  PerksTab,
  BlackHoleTab,
  AlchemyTab,
  CelestialNavigationTab,
  EndgameTab,
  BreakEternityTab,
  PelleDestructionTab,
  ExpansionPacksTab,
  EndgameMasteriesTab,
  EndgameMilestonesTab,
  EndgameUpgradesTab,
  GalacticPowerTab,
  EtherealTab,
  HypercubesTab,
  LargeHadronColliderTab,
  AscensionTab,
  TimeCompressionTab,
  CelestialInfinityUpgradesTab,
  CelestialBreakInfinityTab,
  CelestialEternityUpgradesTab,
  CelestialEternityPlusUpgradesTab,
  DivinityMilestonesTab,
  DivinityUpgradesTab,
  ResurgenceUpgradesTab,
  TransientUniverseTab,
  TangibleUniverseTab,
  ShopTab,
  MultiplierBreakdownTab
};

export default TabComponents;
