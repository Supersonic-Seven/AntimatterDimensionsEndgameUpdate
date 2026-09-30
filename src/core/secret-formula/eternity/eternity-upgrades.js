export const eternityUpgrades = {
  idMultEP: {
    id: 1,
    cost: 5,
    description: () => `Infinity Dimension multiplier based on unspent Eternity Points (x+${formatInt(1)})`,
    effect: () => Currency.eternityPoints.value.plus(1),
    cap: () => (!player.disablePostReality && Alpha.currentStage >= 16 ? DC.BEMAX : DC.E1E15),
    formatEffect: value => formatX(value, 2, 1),
    charged: {
      description: "Empower Infinity Dimensions based on Eternity Points and Teresa Level",
      effect: () => Decimal.pow(player.eternityPoints.max(10).log10().log10().times(Ra.pets.teresa.level).add(1), 0.4),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  idMultEternities: {
    id: 2,
    cost: 10,
    description: () => `Infinity Dimension multiplier based on Eternities
      ((x/${formatInt(200)})^log4(${formatInt(2)}x), softcap at ${format(1e5)} Eternities)`,
    effect() {
      const log4 = Math.log4;
      const eterPreCap = Currency.eternities.value.clampMax(1e5).toNumber();
      const base = eterPreCap / 200 + 1;
      const pow = Math.log(eterPreCap * 2 + 1) / log4;
      const multPreCap = Math.pow(base, pow);
      const eterPostCap = Decimal.max(Currency.eternities.value.sub(1e5), 0);
      const mult1 = eterPostCap.divide(200).plus(1);
      const mult2 = eterPostCap.times(2).plus(1).log(Math.E).div(log4);
      const multPostCap = mult1.times(mult2).clampMin(1);
      return multPostCap.times(multPreCap);
    },
    formatEffect: value => formatX(value, 2, 1),
    charged: {
      description: "Empower Infinity Dimensions based on Eternities and Teresa Level",
      effect: () => Decimal.pow(player.eternities.max(10).log10().log10().times(Ra.pets.teresa.level).add(1), 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  idMultICRecords: {
    id: 3,
    cost: 5e4,
    description: "Infinity Dimension multiplier based on sum of Infinity Challenge times",
    // The cap limits this at a lower value, but we also need an explicit cap here because very old versions have
    // allowed EC12 to make all the challenge records sum to zero (causing a division by zero here)
    effect: () => DC.D2.pow(new Decimal(30).div(Time.infinityChallengeSum.totalSeconds.max(1e-6))).pow(
      DC.D1.div(Time.infinityChallengeSum.totalSeconds.times(1e6).min(1)).log10().pow(10).add(1)),
    cap: () => Alpha.isDestroyed ? DC.BEMAX : DC.D2P30D0_61,
    formatEffect: value => formatX(value, 2, 1),
    charged: {
      description: "Empower Infinity Dimensions based on Hadronizes and Teresa Level",
      effect: () => Decimal.pow(Laitela.hadronizes * Ra.pets.teresa.level + 1, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  tdMultAchs: {
    id: 4,
    cost: 1e16,
    description: "Your Achievement bonus affects Time Dimensions",
    effect: () => Achievements.power,
    formatEffect: value => formatX(value, 2, 1),
    charged: {
      description: "Empower Time Dimensions based on Achievement Multiplier and Teresa Level",
      effect: () => Decimal.pow(Achievements.power.max(10).log10().log10().times(Ra.pets.teresa.level).add(1), 0.6),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  tdMultTheorems: {
    id: 5,
    cost: 1e40,
    description: "Time Dimensions are multiplied by your unspent Time Theorems",
    effect: () => Decimal.max(Currency.timeTheorems.value, 1),
    formatEffect: value => formatX(value, 2, 1),
    charged: {
      description: "Empower Time Dimensions based on Time Theorems and Teresa Level",
      effect: () => Decimal.pow(player.timestudy.theorem.max(10).log10().log10().times(Ra.pets.teresa.level).add(1), 0.6),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  tdMultRealTime: {
    id: 6,
    cost: 1e50,
    description: () => (Pelle.isDoomed
      ? "Time Dimensions are multiplied by days played in this Armageddon"
      : (Alpha.isRunning ? "Time Dimensions are multiplied by real-time days spent in Alpha's Reality"
         : "Time Dimensions are multiplied by days played")
    ),
    effect: () => (Pelle.isDoomed ? Time.thisReality.totalDays.add(1) : (Alpha.isRunning
      ? Decimal.max(Time.thisRealityRealTime.totalDays, 1) : Decimal.max(Time.totalTimePlayed.totalDays, 1))),
    formatEffect: value => formatX(value, 2, 1),
    charged: {
      description: "Empower Time Dimensions based on Days Played and Teresa Level",
      effect: () => Decimal.pow(Time.totalTimePlayed.totalDays.max(10).log10().log10().times(Ra.pets.teresa.level).add(1), 0.7),
      formatEffect: value => formatPow(value, 4, 4)
    }
  }
};
