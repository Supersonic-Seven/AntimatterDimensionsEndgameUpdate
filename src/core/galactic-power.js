export class GalacticPowerState {
  constructor(config) {
    this.config = config;
  }

  get id() {
    return this.config.id;
  }

  get reward() {
    return this.config.effect();
  }

  get unlockGP() {
    return this.config.galacticPower;
  }

  get isUnlocked() {
    return Currency.galacticPower.gte(this.unlockGP) && (ResurgenceUpgrade.unl3.isBought ? true : this.id <= 8);
  }
}

export const GalacticPowers = mapGameDataToObject(
  GameDatabase.endgame.galacticPowers,
  config => (config.isBaseResource
    ? new GalacticPowerState(config)
    : new GalacticPowerState(config))
);

export const GalacticPower = {
  get isUnlocked() {
    return SingularityMilestone.galacticPower.isUnlocked || Currency.galacticPower.gt(0);
  },
  get nextPower() {
    const power = GalacticPowers.all.find(x => !x.isUnlocked);
    return (power?.id > 8 && !ResurgenceUpgrade.unl3.isBought) ? undefined : power;
  },
  get nextPowerUnlockGP() {
    return this.nextPower?.unlockGP;
  },
  get freeGalaxies() {
    return GalacticPowers.freeGalaxies.isUnlocked ? GalacticPowers.freeGalaxies.reward : DC.D0;
  }
};

export function getGalacticPowerGainPerSecond() {
  const allGalaxies = actualBaseGalaxiesWithoutGeneration();
  const galaxyFactor = Decimal.max(allGalaxies.div(100000), 1);
  const celMatterFactor = Decimal.max(Decimal.pow(Decimal.log10(player.endgame.celestialMatter.add(1)).div(10), 4), 1);
  const imaginaryFactor = Decimal.max(Decimal.pow(Decimal.log10(player.reality.imaginaryMachines.add(1)), 2.5), 1);
  const staticDivisor = 1e7;
  const base = galaxyFactor.times(celMatterFactor).times(imaginaryFactor).div(staticDivisor);
  const galaxyExponent1 = Decimal.max(Decimal.min(Decimal.pow(allGalaxies.div(1680000), 6.4), 4), 1);
  const galaxyExponent2 = Decimal.max(Decimal.min(Decimal.pow(allGalaxies.div(1960000), 15), 5), 1);
  const galaxyExponent3 = Decimal.max(Decimal.min(Decimal.pow(allGalaxies.div(2160000), 5), 1.6), 1);
  const galaxyExponent4 = Decimal.max(Decimal.min(Decimal.pow(allGalaxies.div(4500000), 0.75), 1.25), 1);
  const galaxyExponent5 = Decimal.max(Decimal.min(Decimal.pow(allGalaxies.div(6000000), 0.5), 2.5), 1);
  const exponent = galaxyExponent1.times(galaxyExponent2).times(galaxyExponent3).times(galaxyExponent4).times(galaxyExponent5)
    .timesEffectsOf(EndgameMastery(291), EndgameMastery(292), EndgameMastery(293), DualityUpgrade(29)).times(
      NormalChallenge(10).chargedEffect);
  return Pelle.isDoomed ? new Decimal(0) : Decimal.pow(base, exponent);
}
