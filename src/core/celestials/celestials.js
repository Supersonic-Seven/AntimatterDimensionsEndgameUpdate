import { Alpha } from "./alpha";
import { Effarig } from "./effarig";
import { Enslaved } from "./enslaved";
import { Laitela } from "./laitela/laitela";
import { Pelle } from "./pelle/pelle";
import { Ra } from "./ra/ra";
import { Slabdrill } from "./slabdrill";
import { Teresa } from "./teresa";
import { V } from "./V";

export const Celestials = {
  teresa: Teresa,
  effarig: Effarig,
  enslaved: Enslaved,
  v: V,
  ra: Ra,
  laitela: Laitela,
  pelle: Pelle,
  alpha: Alpha,
  slabdrill: Slabdrill
};

GameDatabase.celestials.descriptions = [
  {
    name: "Teresa",
    effects() {
      return `Glyph Time Theorem generation is disabled.
      You gain less Infinity Points and Eternity Points (x^${format(0.55, 2, 2)}).`;
    },
  },
  {
    name: "Effarig",
    effects() {
      return `All Dimension multipliers, game speed, and tickspeed are severely lowered, like Dilation.
      Infinity Power reduces the production and game speed penalties and Time Shards reduce the tickspeed penalty.
      Glyph levels are temporarily capped to ${formatInt(Effarig.glyphLevelCap)}, rarity is unaffected.`;
    },
    description() {
      return `You will exit Effarig's Reality when you complete a Layer of it for the first time.`;
    }
  },
  {
    name: "The Nameless Ones",
    effects() {
      return `Glyph levels are boosted to a minimum of ${formatInt(5000)}.
      Infinity, Time, and 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension purchases are limited to ${formatInt(1)} each.
      ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers are always Dilated (the Glyph effect still only applies in actual Dilation).
      Time Study 192 (uncapped Replicanti) is locked.
      The Black Hole is disabled.
      Tachyon Particle production and Dilated Time production are severely reduced.
      Time Theorem generation from Dilation Glyphs is disabled.
      Certain challenge goals are increased.
      Stored game time is discharged at a reduced effectiveness (exponent^${format(0.55, 2, 2)}).`;
    }
  },
  {
    name: "V",
    effects() {
      const vEffect = `All Dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain\
      per second are square-rooted. 
      The Replicanti interval is squared.`;
      const vEffectAdditional = `
      The Exponential Glyph Alchemy effect is disabled.`;

      return Ra.unlocks.unlockGlyphAlchemy.canBeApplied
        ? vEffect + vEffectAdditional
        : vEffect;
    }
  },
  {
    name: "Ra",
    effects() {
      return `You only have ${formatInt(4)} Dimension Boosts and can not gain any more.
      The Tickspeed purchase multiplier is fixed at ${formatX(1.1245, 0, 3)}.`;
    },
  },
  {
    name: "Lai'tela",
    effects() {
      let disabledDims;
      const highestActive = 8 - Laitela.difficultyTier;
      switch (highestActive) {
        case 0:
          disabledDims = "all Dimensions";
          break;
        case 1:
          disabledDims = "2nd and higher Dimensions";
          break;
        case 2:
          disabledDims = "3rd and higher Dimensions";
          break;
        case 7:
          disabledDims = "8th Dimensions";
          break;
        default:
          disabledDims = `${highestActive + 1}th and higher Dimensions`;
          break;
      }
      const disabledText = highestActive === 8
        ? ""
        : `Production from ${disabledDims} is disabled.`;

      return `Infinity Point and Eternity Point gain are Dilated.
      Game speed is reduced to ${formatInt(1)} and gradually comes back over ${formatInt(10)} minutes.
      Black Hole storing, discharging, pulsing, and inversion are all disabled.
      ${disabledText}`;
    },
    description() {
      return `${player.universes.current === 2 ? "Matter" : "Antimatter"} generates entropy inside of this Reality.\
      At ${formatPercents(1)} entropy, the Reality becomes destabilized\
      and you gain a reward based on how quickly you reached ${formatPercents(1)}.
      Destabilizing the Reality in less than ${formatInt(30)} seconds makes it become significantly more difficult,\
      in exchange for giving a much stronger reward.\
      Doing this ${formatInt(8)} times will also give a ${formatX(Math.pow(8, Laitela.hadronizes + 1))} to Dark Energy gain.`;
    }
  },
  {
    name: "Pelle",
    effects() {
      return `Your Reality will become Doomed. This will have various effects on gameplay.`;
    }
  },
  {
    name: "Alpha",
    effects() {
      return `All rewards, effects, upgrades, enhancements, buffs, nerfs, and features unlocked or gained after reaching Reality\
      for the first time are disabled, except Celestial Dimensions and Cosmic Sector, both of which are severely nerfed.
      The Celestial Matter Conversion Exponent will be reduced to ${formatInt(0)} and you will\
      gain ${formatPercents(Alpha.alphaDecayByHour, 2)} per real-time hour in Alpha's Reality, up to a cap\
      of ${formatInt(24)} hours, which can be increased slightly by completing stages of Alpha's Reality.
      Various external resources, such as Cosmic Sector, will boost Alpha Decay as if you have spent more time\
      inside Alpha's Reality. Your current Alpha Decay Speed factor is ${formatX(Alpha.totalSpeedBoost, 2, 2)}.\
      You start layers of Alpha's Reality with ${formatPercents(Alpha.cosmicSectorMinBoost, 2, 2)} of the total\
      time to max already spent. Cosmic Sector boosts Alpha Decay starting and capped values\
      by ${format(Alpha.cosmicSectorExtraBoost, 2, 2)} hours. This does not reduce the time for Alpha Decay to cap,\
      instead it makes Alpha Decay more effective.
      Your Cosmic Sector Reward will be rooted by your current Cosmic Sector, which is a static nerf and cannot be increased\
      through progression in Alpha.
      Most game-time based features are now real-time based.
      The Achievement Multiplier and many Achievements have been destroyed.
      Gain a small nerf to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions based on ${player.universes.current === 2 ? "Matter" : "Antimatter"}.`;
    },
    description() {
      return `You will exit Alpha's Reality when you complete a Layer of it for the first time.
      For every layer of Alpha's Reality completed, you will gain a buff which applies outside Alpha,\
      and a nerf which applies inside Alpha.`;
    }
  },
  {
    name: "Slabdrill",
    effects() {
      return `Your Reality will become Cursed. This will have various effects on gameplay.`;
    }
  }
];
