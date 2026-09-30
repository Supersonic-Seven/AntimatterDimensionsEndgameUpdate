export const normalAchievements = [
  {
    id: 11,
    name: "You gotta start somewhere",
    get description() {
      return `Buy a 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `Your Achievement multiplier to the 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension is squared.`; },
    effect: () => Achievements.power,
    progress: () => Achievement(11).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10(), 0, 1)
  },
  {
    id: 12,
    name: "100 antimatter is a lot",
    get description() {
      return `Buy a 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `Multiply the 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension by the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent.`; },
    effect: () => Currency.antimatter.value.add(1).log10(),
    progress: () => Achievement(12).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(2), 0, 1)
  },
  {
    id: 13,
    name: "Half life 3 CONFIRMED",
    get description() {
      return `Buy a 3rd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `The 3rd and higher ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.3)} stronger.`; },
    effect: 1.3,
    progress: () => Achievement(13).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(4), 0, 1)
  },
  {
    id: 14,
    name: "L4D: Left 4 Dimensions",
    get description() {
      return `Buy a 4th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `The 4th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension is multiplied by ${formatInt(4)}.`; },
    effect: 4,
    progress: () => Achievement(14).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(6), 0, 1)
  },
  {
    id: 15,
    name: "5 Dimension Antimatter Punch",
    get description() {
      return `Buy a 5th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `The 5th and higher ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are doubled.`; },
    effect: 2,
    progress: () => Achievement(15).isUnlocked ? DC.D1 : Decimal.clamp(DimBoost.purchasedBoosts.div(2).min(0.5).add(player.antimatter.max(1).log10().div(18).min(0.5)), 0, 1)
  },
  {
    id: 16,
    name: "We couldn't afford 9",
    get description() {
      return Enslaved.isRunning
        ? `Buy a 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension (they never amount to anything)`
        : `Buy a 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `Multiply the 6th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension by ${formatInt(9)}.`; },
    effect: 9,
    progress: () => Achievement(16).isUnlocked ? DC.D1 : Decimal.clamp(DimBoost.purchasedBoosts.div(4).min(0.5).add(player.antimatter.max(1).log10().div(26).min(0.5)), 0, 1)
  },
  {
    id: 17,
    name: "Not a luck related achievement",
    get description() {
      return `Buy a 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `Multiply the 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension by ${formatInt(7)}.`; },
    effect: 7,
    progress: () => Achievement(17).isUnlocked ? DC.D1 : Decimal.clamp(DimBoost.purchasedBoosts.div(6).min(0.5).add(player.antimatter.max(1).log10().div(36).min(0.5)), 0, 1)
  },
  {
    id: 18,
    name: "90 degrees to infinity",
    get description() {
      return Enslaved.isRunning
        ? `Buy an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension (don't get used to it)`
        : `Buy an 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension.`;
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `Multiply all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions by Ninety Degrees.`; },
    effect: 1.57,
    progress: () => Achievement(18).isUnlocked ? DC.D1 : Decimal.clamp(DimBoost.purchasedBoosts.div(8).min(0.5).add(player.antimatter.max(1).log10().div(48).min(0.5)), 0, 1)
  },
  {
    id: 21,
    name: "To infinity!",
    description: "Go Infinite.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${formatInt(100)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    effect: 100,
    progress: () => Achievement(21).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 22,
    name: "FAKE NEWS!",
    get description() { return `Encounter ${formatInt(50)} different news messages.`; },
    checkRequirement: () => NewsHandler.uniqueTickersSeen >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    progress: () => Achievement(22).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(NewsHandler.uniqueTickersSeen).div(50), 0, 1)
  },
  {
    id: 23,
    name: "The 9th Dimension is a lie",
    get description() { return `Have exactly ${formatInt(99)} 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions.`; },
    checkRequirement: () => AntimatterDimension(8).amount.eq(99),
    get reward() { return `8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1,
    progress: () => Achievement(23).isUnlocked ? DC.D1 : Decimal.clamp(AntimatterDimension(8).amount.div(99), 0, 1)
  },
  {
    id: 24,
    name: "Antimatter Apocalypse",
    get description() { return `Get over ${format(DC.E80)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(80),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(24).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(80), 0, 1)
  },
  {
    id: 25,
    name: "Boosting to the max",
    get description() { return `Buy ${formatInt(10)} Dimension Boosts.`; },
    checkRequirement: () => DimBoost.purchasedBoosts.gte(10),
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    progress: () => Achievement(25).isUnlocked ? DC.D1 : Decimal.clamp(DimBoost.purchasedBoosts.div(18).min(0.5).add(player.antimatter.max(1).log10().div(318).min(0.5)), 0, 1)
  },
  {
    id: 26,
    name: "You got past The Big Wall",
    get description() {
      return `Buy ${player.universes.current === 2 ? "a Matter" : "an Antimatter"} Galaxy.`;
    },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE,
    progress: () => Achievement(26).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(129), 0, 1)
  },
  {
    id: 27,
    name: "Double Galaxy",
    get description() { return `Buy ${formatInt(2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`; },
    checkRequirement: () => player.galaxies.gte(2),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    progress: () => Achievement(27).isUnlocked ? DC.D1 : Decimal.clamp(player.galaxies.div(2).min(0.5).add(player.antimatter.max(1).log10().div(438).min(0.5)), 0, 1)
  },
  {
    id: 28,
    name: "There's no point in doing that...",
    get description() {
      return `Buy a single 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension when you have over ${format(DC.E150)} of them.`;
    },
    checkRequirement: () => AntimatterDimension(1).amount.add(1).log10().gte(150),
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1,
    progress: () => Achievement(28).isUnlocked ? DC.D1 : Decimal.clamp(AntimatterDimension(1).amount.add(1).log10().div(150), 0, 1)
  },
  {
    id: 31,
    name: "I forgot to nerf that",
    get description() { return `Get any ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multiplier over ${formatX(DC.E31)}.`; },
    checkRequirement: () => AntimatterDimensions.all.some(x => x.multiplier.add(1).log10().gte(31)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.05)} stronger.`; },
    effect: 1.05,
    progress: () => Achievement(31).isUnlocked ? DC.D1 : Decimal.clamp(AntimatterDimensions.all.map(x => x.multiplier).reduce(Decimal.maxReducer).add(1).log10().div(31), 0, 1)
  },
  {
    id: 32,
    name: "The Gods are pleased",
    get description() { return `Get over ${formatX(600)} from Dimensional Sacrifice outside of Challenge 8.`; },
    checkRequirement: () => !NormalChallenge(8).isOnlyActiveChallenge && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() {
      return `Dimensional Sacrifice is stronger.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": false, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })}`;
    },
    effect: 0.1,
    progress: () => Achievement(32).isUnlocked ? DC.D1 : (NormalChallenge(8).isOnlyActiveChallenge ? DC.DM1 : Decimal.clamp(Sacrifice.totalBoost.div(600), 0, 1))
  },
  {
    id: 33,
    name: "That's a lot of infinites",
    get description() { return `Reach Infinity ${formatInt(10)} times.`; },
    checkRequirement: () => Currency.infinities.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    progress: () => Achievement(33).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinities.value.div(10), 0, 1)
  },
  {
    id: 34,
    name: "You didn't need it anyway",
    get description() {
      return `Infinity without having any 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions.`;
    },
    checkRequirement: () => AntimatterDimension(8).totalAmount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Dimensions 1-7 are ${formatPercents(0.02)} stronger.`; },
    effect: 1.02,
    progress: () => Achievement(34).isUnlocked ? DC.D1 : (AntimatterDimension(8).totalAmount.neq(0) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 35,
    name: "Don't you dare sleep",
    get description() {
      return PlayerProgress.realityUnlocked()
        ? `Be offline for a period of over ${formatInt(2)} hours (real time).`
        : `Be offline for a period of over ${formatInt(2)} hours.`;
    },
    checkRequirement: () => Date.now() - player.lastUpdate >= 7200000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    progress: () => Achievement(35).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Date.now() - player.lastUpdate).div(7200000), 0, 1)
  },
  {
    id: 36,
    name: "Claustrophobic",
    get description() {
      return `Infinity with just ${formatInt(1)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy. (Your ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies are reset on Infinity.)`;
    },
    checkRequirement: () => player.galaxies.eq(1),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Multiply starting tick speed by ${format(1.02, 2, 2)}.`; },
    effect: 1 / 1.02,
    progress: () => Achievement(36).isUnlocked ? DC.D1 : (player.galaxies.neq(1) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 37,
    name: "That's FAST!",
    get description() { return `Infinity in under ${formatInt(2)} hours.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalHours.toNumber() <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${formatInt(5000)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    effect: () => player.disablePostReality ? 100 : 5000,
    progress: () => Achievement(37).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalHours.gt(2) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 38,
    name: "I don't believe in Gods",
    get description() {
      return `Buy ${player.universes.current === 2 ? "a Matter" : "an Antimatter"} Galaxy without Dimensional Sacrificing.
        (Your ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies are reset on Infinity.)`;
    },
    checkRequirement: () => player.requirementChecks.infinity.noSacrifice,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE,
    progress: () => Achievement(38).isUnlocked ? DC.D1 : (!player.requirementChecks.infinity.noSacrifice ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(129), 0, 1))
  },
  {
    id: 41,
    name: "No DLC required",
    get description() { return `Buy ${formatInt(16)} Infinity Upgrades.`; },
    checkRequirement: () => player.infinityUpgrades.size >= 16,
    checkEvent: [
      GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
      GAME_EVENT.REALITY_RESET_AFTER,
      GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT
    ],
    get reward() {
      return `Unlock two new Infinity Upgrades- ${formatX(2)} IP multiplier and offline IP generation.`;
    },
    progress: () => Achievement(41).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.infinityUpgrades.size).div(16), 0, 1)
  },
  {
    id: 42,
    name: "Super Sanic",
    get description() {
      return `Have ${player.universes.current === 2 ? "matter" : "antimatter"} per second exceed your current ${player.universes.current === 2 ? "matter" : "antimatter"} above ${format(DC.E63)}.`;
    },
    checkRequirement: () =>
      Currency.antimatter.value.add(1).log10().gte(63) &&
      Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(42).isUnlocked ? DC.D1 : (Currency.antimatter.productionPerSecond.lte(Currency.antimatter.value) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(63), 0, 1))
  },
  {
    id: 43,
    name: "How the antitables have turned..",
    get description() {
      return `Get the 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multiplier to be highest, 7th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multiplier second highest, etc.`;
    },
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Each ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension gains a boost proportional to tier
      (8th gets ${formatPercents(0.08)}, 7th gets ${formatPercents(0.07)}, etc.)`;
    },
    progress: () => {
      let done = 0;
      const rmultipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < rmultipliers.length - 1; i++) {
        if (rmultipliers[i].lt(rmultipliers[i + 1])) done++;
      }
      return Achievement(43).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(done).div(7), 0, 1);
    }
  },
  {
    id: 44,
    name: "Over in 30 Seconds",
    get description() {
      return `Have ${player.universes.current === 2 ? "matter" : "antimatter"} per second exceed your current ${player.universes.current === 2 ? "matter" : "antimatter"}
      for ${formatInt(30)} consecutive seconds.`;
    },
    checkRequirement: () => AchievementTimers.marathon1
      .check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => {
      //This is a rough estimate that should work but we'll see
      let sec = 0;
      if (AchievementTimers.marathon1.check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 1)) sec++;
      else sec = 0;
      return Achievement(44).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(sec).div(30), 0, 1);
    }
  },
  {
    id: 45,
    name: "Faster than a potato",
    get description() { return `Get more than ${format(DC.E29)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.log10().lte(-26),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Multiply starting tickspeed by ${formatX(1.02, 0, 2)}.`; },
    effect: 0.98,
    progress: () => Achievement(45).isUnlocked ? DC.D1 : Decimal.clamp(Tickspeed.current.log10().sub(3).neg().div(29), 0, 1)
  },
  {
    id: 46,
    name: "Multidimensional",
    get description() { return `Reach ${format(DC.E12)} of all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions except the 8th.`; },
    checkRequirement: () => AntimatterDimension(7).amount.add(1).log10().gte(12),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(46).isUnlocked ? DC.D1 : Decimal.clamp(AntimatterDimension(7).amount.add(1).log10().div(12), 0, 1)
  },
  {
    id: 47,
    name: "Daredevil",
    get description() { return `Complete ${formatInt(3)} Normal Challenges.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    progress: () => Achievement(47).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(NormalChallenges.all.countWhere(c => c.isCompleted)).div(3), 0, 1)
  },
  {
    id: 48,
    name: "Antichallenged",
    get description() { return `Complete all ${formatInt(12)} Normal Challenges.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    get reward() { return `All Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1,
    progress: () => Achievement(48).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(NormalChallenges.all.countWhere(c => c.isCompleted)).div(12), 0, 1)
  },
  {
    id: 51,
    name: "Limit Break",
    description: "Break Infinity.",
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    progress: () => Achievement(51).isUnlocked ? DC.D1 : Decimal.clamp(Decimal.log2(1500).sub(new Decimal(player.auto.bigCrunch.interval).div(100).log2()).div(Decimal.log2(1500)), 0, 1)
  },
  {
    id: 52,
    name: "Age of Automation",
    get description() {
      return `Max the interval for ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension and Tickspeed upgrade autobuyers.`;
    },
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed)
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    progress: () => Achievement(52).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed).filter(a => a.isUnlocked && a.hasMaxedInterval).length).div(9), 0, 1)
  },
  {
    id: 53,
    name: "Definitely not worth it",
    description: "Max the intervals for all normal autobuyers.",
    // The upgradeable autobuyers are dimensions, tickspeed, dimension boost,
    // galaxy, and big crunch (the ones you get from normal challenges).
    // We don't count autobuyers which can be upgraded via e.g. perks as upgradeable.
    checkRequirement: () => Autobuyers.upgradeable
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    progress: () => Achievement(53).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Autobuyers.upgradeable.filter(a => a.isUnlocked && a.hasMaxedInterval).length).div(12), 0, 1)
  },
  {
    id: 54,
    name: "That's FASTER!",
    get description() { return `Infinity in ${formatInt(10)} minutes or less.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes.toNumber() <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${format(5e5)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 100 : 5e5,
    progress: () => Achievement(54).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalMinutes.gt(10) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 55,
    name: "Forever isn't that long",
    get description() { return `Infinity in ${formatInt(1)} minute or less.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes.toNumber() <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${format(5e10)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 100 : 5e10,
    progress: () => Achievement(55).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalMinutes.gt(1) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 56,
    name: "Many Deaths",
    get description() {
      return `Complete the 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer Challenge in ${formatInt(3)} minutes or less.`;
    },
    checkRequirement: () => NormalChallenge(2).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.toNumber() <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities.`;
    },
    effect: () => Decimal.max(new Decimal(6).div(Time.thisInfinity.totalMinutes.plus(3)), 1).toNumber(),
    effectCondition: () => Time.thisInfinity.totalMinutes.lt(3),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(56).isUnlocked ? DC.D1 : ((!NormalChallenge(2).isOnlyActiveChallenge || Time.thisInfinityRealTime.totalMinutes.gt(3)) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 57,
    name: "Gift from the Gods",
    get description() {
      return `Complete the 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer Challenge in ${formatInt(3)} minutes or less.`;
    },
    checkRequirement: () => NormalChallenge(8).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.toNumber() <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Dimensional Sacrifice is stronger.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })}`;
    },
    effect: 0.1,
    progress: () => Achievement(57).isUnlocked ? DC.D1 : ((!NormalChallenge(8).isOnlyActiveChallenge || Time.thisInfinityRealTime.totalMinutes.gt(3)) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 58,
    name: "This is fine.",
    get description() { return `Complete the Tickspeed Autobuyer Challenge in ${formatInt(3)} minutes or less.`; },
    checkRequirement: () => NormalChallenge(9).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.toNumber() <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Increase the multiplier for buying ${formatInt(10)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions by +${formatPercents(0.01)}.`;
    },
    effect: 1.01,
    progress: () => Achievement(58).isUnlocked ? DC.D1 : ((!NormalChallenge(9).isOnlyActiveChallenge || Time.thisInfinityRealTime.totalMinutes.gt(3)) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 61,
    name: "Bulked Up",
    get description() {
      return `Get all of your ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer bulk amounts to
        ${formatInt(Autobuyer.antimatterDimension.bulkCap)}.`;
    },
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.every(x => x.hasMaxedBulk),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT,
      GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    reward: "Dimension Autobuyer bulks are unlimited.",
    progress: () => Achievement(61).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Autobuyer.antimatterDimension.zeroIndexed.filter(x => x.hasMaxedBulk).length).div(8), 0, 1)
  },
  {
    id: 62,
    name: "Oh, hey... You're still here?",
    get description() { return `Reach ${format(DC.E8)} Infinity Points per minute.`; },
    checkRequirement: () => Player.bestRunIPPM.add(1).log10().gte(8),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    progress: () => Achievement(62).isUnlocked ? DC.D1 : Decimal.clamp(Player.bestRunIPPM.add(1).log10().div(8), 0, 1)
  },
  {
    id: 63,
    name: "A new beginning",
    description: "Begin generation of Infinity Power.",
    checkRequirement: () => Currency.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `All Infinity Dimension multipliers are doubled.`; },
    effect: 2,
    progress: () => Achievement(63).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(8), 0, 1)
  },
  {
    id: 64,
    name: "Zero Deaths",
    get description() {
      return `Get to Infinity without Dimension Boosts or ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies while in a Normal Challenge.`;
    },
    checkRequirement: () => player.galaxies.eq(0) && DimBoost.purchasedBoosts.eq(0) && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions 1-4 are ${formatPercents(0.25)} stronger.`; },
    effect: 1.25,
    progress: () => Achievement(64).isUnlocked ? DC.D1 : ((player.galaxies.neq(0) || DimBoost.purchasedBoosts.neq(0) || !NormalChallenge.isRunning) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 65,
    name: "Not-so-challenging",
    get description() { return `Get the sum of all of your Normal Challenge times under ${formatInt(3)} minutes.`; },
    checkRequirement: () => Time.challengeSum.totalMinutes.lt(3),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() {
      return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities,
      but only in Challenges.`;
    },
    effect: () => (Player.isInAnyChallenge && (!player.disablePostReality || SlabdrillUnlocks.eternityChallengeTen.isUnlocked) ? Decimal.max(DC.D4.div(Time.thisInfinity.totalMinutes.plus(1)), 1) : DC.D1),
    effectCondition: () => Player.isInAnyChallenge && Time.thisInfinity.totalMinutes.lt(3) && (!player.disablePostReality || SlabdrillUnlocks.eternityChallengeTen.isUnlocked),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(65).isUnlocked ? DC.D1 : Decimal.clamp(DC.D3.div(Time.challengeSum.totalMinutes), 0, 1)
  },
  {
    id: 66,
    name: "Faster than a squared potato",
    get description() { return `Get more than ${format(DC.E58)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.log10().lte(-55),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Multiply starting tickspeed by ${formatX(1.02, 0, 2)}.`; },
    effect: 0.98,
    progress: () => Achievement(66).isUnlocked ? DC.D1 : Decimal.clamp(Tickspeed.current.log10().sub(3).neg().div(58), 0, 1)
  },
  {
    id: 67,
    name: "Infinitely Challenging",
    description: "Complete an Infinity Challenge.",
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
    progress: () => Achievement(67).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.add(1).log10().div(4000).min(0.5).add(!InfinityChallenge.current ? 0 : player.antimatter.max(1).log10().div(InfinityChallenge.current.goal.log10().times(2)).min(0.5)), 0, 1)
  },
  {
    id: 68,
    name: "You did this again just for the achievement right?",
    get description() {
      return `Complete the 3rd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer Challenge in ${formatInt(10)} seconds or less.`;
    },
    checkRequirement: () => NormalChallenge(3).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalSeconds.toNumber() <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.5)} stronger.`; },
    effect: 1.5,
    progress: () => Achievement(68).isUnlocked ? DC.D1 : ((!NormalChallenge(3).isOnlyActiveChallenge || Time.thisInfinityRealTime.totalSeconds.gt(10)) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 71,
    name: "ERROR 909: Dimension not found",
    get description() {
      return `Get to Infinity with only a single 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension without Dimension Boosts
        or ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies, while in the 2nd ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Autobuyer Challenge.`;
    },
    checkRequirement: () =>
      NormalChallenge(2).isOnlyActiveChallenge &&
      AntimatterDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts.eq(0) &&
      player.galaxies.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatInt(3)} times stronger.`; },
    effect: 3,
    progress: () => Achievement(71).isUnlocked ? DC.D1 : ((!NormalChallenge(2).isOnlyActiveChallenge || AntimatterDimension(1).amount.neq(1) || DimBoost.purchasedBoosts.neq(0) || player.galaxies.neq(0)) ? DC.D0 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 72,
    name: "Can't hold all these infinities",
    get description() {
      return `Get all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension multipliers over ${formatX(DC.NUMMAX, 1)}.`;
    },
    checkRequirement: () => AntimatterDimensions.all.every(x => x.tier > 8 || x.multiplier.gte(DC.NUMMAX)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1,
    progress: () => Achievement(72).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(AntimatterDimensions.all.filter(x => x.multiplier.gte(DC.NUMMAX)).length).div(8), 0, 1)
  },
  {
    id: 73,
    name: "THIS ACHIEVEMENT DOESN'T EXIST",
    get description() { return `Get ${formatPostBreak(DC.D9_9999E9999, 4)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    checkRequirement: () => Currency.antimatter.gte(DC.D9_9999E9999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions gain a multiplier based on current ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1).clampMax(Decimal.pow(10, 1e30)).pow(
      Decimal.max(Decimal.pow(2, Decimal.log10(Decimal.log10(Currency.antimatter.value.pow(0.00002).plus(1)).div(1e30))), 1)),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(73).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(10000), 0, 1)
  },
  {
    id: 74,
    name: "Not a second lost",
    get description() { return `Get the sum of all best Normal Challenge times under ${formatInt(5)} seconds.`; },
    checkRequirement: () => Time.challengeSum.totalSeconds.lt(5),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() { return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are ${formatPercents(0.4)} stronger, but only in challenges.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 1.4,
    effectCondition: () => Player.isInAnyChallenge && (!player.disablePostReality || SlabdrillUnlocks.eternityChallengeTen.isUnlocked),
    progress: () => Achievement(74).isUnlocked ? DC.D1 : Decimal.clamp(DC.D5.div(Time.challengeSum.totalSeconds), 0, 1)
  },
  {
    id: 75,
    name: "NEW DIMENSIONS???",
    description: "Unlock the 4th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Your Achievement bonus affects Infinity Dimensions.",
    effect: () => Achievements.power,
    progress: () => Achievement(75).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(10500), 0, 1)
  },
  {
    id: 76,
    name: "One for each dimension",
    get description() { return `Play for ${formatInt(8)} hours.`; },
    checkRequirement: () => Time.totalTimePlayed.totalHours.gte(8),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Extremely small multiplier to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions based on time played.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? DC.D1 : Decimal.max(Decimal.pow(Time.totalTimePlayed.totalDays.times(12), 0.05), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(76).isUnlocked ? DC.D1 : Decimal.clamp(Time.totalTimePlayed.totalHours.div(8), 0, 1)
  },
  {
    id: 77,
    name: "1 Million is a lot",
    get description() { return `Reach ${format(1e6)} Infinity Power.`; },
    checkRequirement: () => Currency.infinityPower.value.add(1).log10().gte(6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `All Infinity Dimensions are stronger based on Infinity Points.`;
    },
    effect: () => Currency.infinityPoints.value.add(1).log10().clampMin(1),
    progress: () => Achievement(77).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinityPower.value.add(1).log10().div(6), 0, 1)
  },
  {
    id: 78,
    name: "Blink of an eye",
    get description() { return `Infinity in under ${formatInt(250)}ms.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds.toNumber() <= 250,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Start with ${format(5e25)} ${player.universes.current === 2 ? "matter" : "antimatter"}.`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 100 : 5e25,
    progress: () => Achievement(78).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalMilliseconds.gt(250) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 81,
    name: "Game Design Is My Passion",
    get description() { return `Beat Infinity Challenge 5 in ${formatInt(15)} seconds or less.`; },
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds.toNumber() <= 15,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `You gain Replicanti ${formatInt(3)} times faster.`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 3,
    progress: () => Achievement(81).isUnlocked ? DC.D1 : ((!InfinityChallenge(5).isRunning || Time.thisInfinityRealTime.totalSeconds.gt(15)) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(16500), 0, 1))
  },
  {
    id: 82,
    name: "Anti-antichallenged",
    get description() { return `Complete all ${formatInt(8)} Infinity Challenges.`; },
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
    progress: () => Achievement(82).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(InfinityChallenges.all.countWhere(c => c.isCompleted)).div(8), 0, 1)
  },
  {
    id: 83,
    name: "YOU CAN GET 50 GALAXIES?!?!",
    get description() { return `Get ${formatInt(50)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`; },
    checkRequirement: () => player.galaxies.gte(50),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `Tickspeed is just over ${formatPercents(0.05)} faster per ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxy.`; },
    effect: () => DC.D0_95.pow(player.galaxies),
    formatEffect: value => `${formatX(value.recip(), 2, 2)}`,
    progress: () => Achievement(83).isUnlocked ? DC.D1 : Decimal.clamp(player.galaxies.div(50), 0, 1)
  },
  {
    id: 84,
    name: "I got a few to spare",
    get description() { return `Reach ${formatPostBreak("1e35000")} ${player.universes.current === 2 ? "matter" : "antimatter"}.`; },
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(35000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are stronger the more unspent ${player.universes.current === 2 ? "matter" : "antimatter"} you have.`; },
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1).clampMax(Decimal.pow(10, 1e30)).pow(
      Decimal.max(Decimal.pow(2, Decimal.log10(Decimal.log10(Currency.antimatter.value.pow(0.00002).plus(1)).div(1e30))), 1)),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(84).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(35000), 0, 1)
  },
  {
    id: 85,
    name: "ALL YOUR IP ARE BELONG TO US",
    get description() { return `Big Crunch for ${format(DC.E150)} Infinity Points.`; },
    checkRequirement: () => gainedInfinityPoints().add(1).log10().gte(150),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Additional ${formatX(4)} multiplier to Infinity Points.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 4,
    progress: () => Achievement(85).isUnlocked ? DC.D1 : Decimal.clamp(gainedInfinityPoints().add(1).log10().div(150), 0, 1)
  },
  {
    id: 86,
    name: "Do you even bend time bro?",
    get description() { return `Reach ${formatX(1000)} faster per Tickspeed upgrade.`; },
    checkRequirement: () => Tickspeed.multiplier.recip().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `All Galaxies are ${formatPercents(0.01)} stronger.`; },
    effect: 1.01,
    progress: () => Achievement(86).isUnlocked ? DC.D1 : Decimal.clamp(Tickspeed.multiplier.recip().div(1000), 0, 1)
  },
  {
    id: 87,
    name: "2 MILLION INFINITIES",
    get description() { return `Infinity ${format(DC.D2E6)} times.`; },
    checkRequirement: () => Currency.infinities.gt(DC.D2E6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Infinities more than ${formatInt(5)} seconds long
      give ${formatX(250)} more Infinities.`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked && !(Alpha.isRunning && Alpha.currentStage >= 23) ? 1 : 250,
    effectCondition: () => Time.thisInfinity.totalSeconds.gt(5) &&
      (!player.disablePostReality || (Alpha.isRunning && Alpha.currentStage >= 23) || SlabdrillUnlocks.eternityChallengeTen.isUnlocked),
    progress: () => Achievement(87).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinities.value.div(2e6), 0, 1)
  },
  {
    id: 88,
    name: "Yet another infinity reference",
    get description() {
      return `Get a ${formatX(DC.NUMMAX, 1, 0)} multiplier in a single Dimensional Sacrifice.`;
    },
    checkRequirement: () => Sacrifice.nextBoost.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    get reward() {
      return `Dimensional Sacrifice is stronger.
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": true })}`;
    },
    effect: 0.1,
    progress: () => Achievement(88).isUnlocked ? DC.D1 : Decimal.clamp(Sacrifice.nextBoost.log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 91,
    name: "Ludicrous Speed",
    get description() {
      return `Big Crunch for ${format(DC.E200)} Infinity Points in ${formatInt(2)} seconds or less.`;
    },
    checkRequirement: () => gainedInfinityPoints().add(1).log10().gte(200) && Time.thisInfinityRealTime.totalSeconds.toNumber() <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are significantly stronger in the
      first ${formatInt(5)} seconds of Infinities.`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? DC.D1 : Decimal.max((DC.D5.sub(Time.thisInfinity.totalSeconds)).times(60), 1),
    effectCondition: () => Time.thisInfinity.totalSeconds.lt(5) && (!player.disablePostReality || SlabdrillUnlocks.eternityChallengeTen.isUnlocked),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(91).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalSeconds.gt(2) ? DC.DM1 : Decimal.clamp(gainedInfinityPoints().add(1).log10().div(200), 0, 1))
  },
  {
    id: 92,
    name: "I brake for NOBODY!",
    get description() {
      return `Big Crunch for ${format(DC.E250)} Infinity Points in ${formatInt(20)} seconds or less.`;
    },
    checkRequirement: () => gainedInfinityPoints().add(1).log10().gte(250) && Time.thisInfinityRealTime.totalSeconds.toNumber() <= 20,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are significantly stronger in the
      first ${formatInt(60)} seconds of Infinities.`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? DC.D1 : Decimal.max((DC.D1.sub(Time.thisInfinity.totalMinutes)).times(100), 1),
    effectCondition: () => Time.thisInfinity.totalMinutes.lt(1) && (!player.disablePostReality || SlabdrillUnlocks.eternityChallengeTen.isUnlocked),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(92).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalSeconds.gt(20) ? DC.DM1 : Decimal.clamp(gainedInfinityPoints().add(1).log10().div(250), 0, 1))
  },
  {
    id: 93,
    name: "MAXIMUM OVERDRIVE",
    get description() { return `Big Crunch for ${format(DC.E300)} Infinity Points.`; },
    checkRequirement: () => gainedInfinityPoints().add(1).log10().gte(300),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Additional ${formatX(4)} multiplier to Infinity Points.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 4,
    progress: () => Achievement(93).isUnlocked ? DC.D1 : Decimal.clamp(gainedInfinityPoints().add(1).log10().div(300), 0, 1)
  },
  {
    id: 94,
    name: "4.3333 minutes of Infinity",
    get description() { return `Reach ${format(DC.E260)} Infinity Power.`; },
    checkRequirement: () => Currency.infinityPower.value.add(1).log10().gte(260),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Double Infinity Power gain.",
    effect: 2,
    progress: () => Achievement(94).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinityPower.value.add(1).log10().div(260), 0, 1)
  },
  {
    id: 95,
    name: "Is this safe?",
    get description() { return `Gain ${format(DC.NUMMAX, 1, 0)} Replicanti in ${formatInt(1)} hour.`; },
    get reward() { return `You keep your Replicanti and ${formatInt(1)} Replicanti Galaxy on Infinity.`; },
    checkRequirement: () =>
      (Replicanti.amount.eq(DC.NUMMAX) || player.replicanti.galaxies.gt(0)) &&
      Time.thisInfinityRealTime.totalHours.toNumber() <= 1,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER,
    progress: () => Achievement(95).isUnlocked ? DC.D1 : (Time.thisInfinityRealTime.totalHours.gt(1) ? DC.DM1 : Decimal.clamp(Replicanti.amount.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 96,
    name: "Time is relative",
    description: "Go Eternal.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    progress: () => Achievement(96).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 97,
    name: "Like jumping on a lego",
    get description() { return `Get the sum of Infinity Challenge times under ${format(6.66, 2, 2)} seconds.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds.lt(6.66),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    progress: () => Achievement(97).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(6.66).div(Time.infinityChallengeSum.totalSeconds), 0, 1)
  },
  {
    id: 98,
    name: "0 degrees from Infinity",
    description: "Unlock the 8th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(98).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(1).log10().div(60000), 0, 1)
  },
  {
    id: 101,
    name: "8 nobody got time for that",
    get description() {
      return `Eternity without buying ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions 1-7.`;
    },
    checkRequirement: () => player.requirementChecks.eternity.onlyAD8,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    progress: () => Achievement(101).isUnlocked ? DC.D1 : (!player.requirementChecks.eternity.onlyAD8 ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 102,
    name: "This mile took an eternity",
    description: "Get all Eternity milestones.",
    checkRequirement: () => EternityMilestone.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ${formatX(2)} more Eternities.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 2,
    progress: () => Achievement(102).isUnlocked ? DC.D1 : Decimal.clamp(Currency.eternities.value.div(1000), 0, 1)
  },
  {
    id: 103,
    name: "Tätä saavutusta ei ole olemassa II",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Infinity Points.`; },
    checkRequirement: () => Currency.infinityPoints.value.add(1).log10().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Make the Infinity Point formula better. log(x)/${formatInt(308)} ➜ log(x)/${formatFloat(307.8, 1)}`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 308 : 307.8,
    progress: () => Achievement(103).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(1000), 0, 1)
  },
  {
    id: 104,
    name: "That wasn't an eternity",
    get description() { return `Eternity in under ${formatInt(30)} seconds.`; },
    checkRequirement: () => Time.thisEternity.totalSeconds.lte(30),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `Start Eternities with ${format(5e25)} Infinity Points.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 0 : 5e25,
    progress: () => Achievement(104).isUnlocked ? DC.D1 : (Time.thisEternity.totalSeconds.gt(30) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 105,
    name: "Infinite Time",
    get description() { return `Have ${formatInt(308)} Tickspeed upgrades from Time Dimensions.`; },
    checkRequirement: () => player.totalTickGained.gte(308),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions gain a multiplier based on tickspeed.",
    effect: () => Slabdrill.isCursed
      ? Tickspeed.perSecond.pow(0.000005).min(DC.E20000)
      : Tickspeed.perSecond.pow(0.000005),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(105).isUnlocked ? DC.D1 : Decimal.clamp(player.totalTickGained.div(308), 0, 1)
  },
  {
    id: 106,
    name: "The swarm",
    get description() { return `Get ${formatInt(10)} Replicanti Galaxies in ${formatInt(15)} seconds.`; },
    checkRequirement: () => Replicanti.galaxies.total.gte(10) && Time.thisInfinity.totalSeconds.lte(15),
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER,
    progress: () => Achievement(106).isUnlocked ? DC.D1 : (Time.thisInfinity.totalSeconds.gt(15) ? DC.DM1 : Decimal.clamp(Replicanti.galaxies.total.div(10), 0, 1))
  },
  {
    id: 107,
    name: "Do you really need a guide for this?",
    get description() { return `Eternity with less than ${formatInt(10)} Infinities.`; },
    checkRequirement: () => Currency.infinities.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    progress: () => Achievement(107).isUnlocked ? DC.D1 : (Currency.infinities.gte(10) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 108,
    name: "We COULD afford 9",
    get description() { return `Eternity with exactly ${formatInt(9)} Replicanti.`; },
    checkRequirement: () => Replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    progress: () => Achievement(107).isUnlocked ? DC.D1 : (Replicanti.amount.round().neq(9) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 111,
    name: "Yo dawg, I heard you liked infinities...",
    get description() {
      return `Have all your Infinities in your past ${formatInt(10)} Infinities be at least
      ${format(DC.NUMMAX, 1, 0)} times higher Infinity Points than the previous one.`;
    },
    checkRequirement: () => {
      if (player.records.recentInfinities.some(i => i[0].gte(Number.MAX_VALUE))) return false;
      const infinities = player.records.recentInfinities.map(run => run[2]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(DC.NUMMAX))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    get reward() { return `Your ${player.universes.current === 2 ? "matter" : "antimatter"} doesn't reset on Dimension Boosts or ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`; },
    progress: () => {
      let infinf = 0;
      const rinfinities = player.records.recentInfinities.map(run => run[2]);
      for (let i = 0; i < rinfinities.length - 1; i++) {
        if (rinfinities[i].gte(rinfinities[i + 1].times(DC.NUMMAX))) infinf++;
      }
      return Achievement(111).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(infinf).div(9), 0, 1);
    }
  },
  {
    id: 112,
    name: "Never again",
    get description() { return `Get the sum of Infinity Challenge times below ${formatInt(750)}ms.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds.lt(750),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    progress: () => Achievement(112).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(750).div(Time.infinityChallengeSum.totalMilliseconds), 0, 1)
  },
  {
    id: 113,
    name: "Eternities are the new infinity",
    get description() { return `Eternity in under ${formatInt(250)}ms.`; },
    checkRequirement: () => Time.thisEternity.totalMilliseconds.lte(250),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `Gain ${formatX(3)} more Eternities.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 3,
    progress: () => Achievement(113).isUnlocked ? DC.D1 : (Time.thisEternity.totalMilliseconds.gt(250) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 114,
    name: "You're a mistake",
    description: "Fail an Eternity Challenge.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    reward: "A fading sense of accomplishment.",
    effect: () => "Sense of accomplishment (fading)",
    progress: () => {
      if (Achievement(114).isUnlocked) return DC.D1;
      if (!EternityChallenge(4).isRunning || !EternityChallenge(12).isRunning) return DC.DM1;
      if (EternityChallenge(4).isRunning) return Decimal.clamp(Currency.infinities.value.div(EternityChallenge(4)._config.restriction(EternityChallenge(4).completions).add(1)), 0, 1);
      return Decimal.clamp(Time.thisEternity.totalSeconds.div(EternityChallenge(12)._config.restriction(EternityChallenge(12).completions)), 0, 1);
    }
  },
  {
    id: 115,
    name: "I wish I had gotten 7 eternities",
    description: "Start an Infinity Challenge inside an Eternity Challenge.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    progress: () => Achievement(115).isUnlocked ? DC.D1 : (!EternityChallenge.current ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(2000), 0, 1))
  },
  {
    id: 116,
    name: "Do I really need to infinity",
    get description() { return `Eternity with only ${formatInt(1)} Infinity.`; },
    checkRequirement: () => Currency.infinities.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: "Multiplier to Infinity Points based on Infinities.",
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? DC.D1 : Decimal.pow(Currency.infinitiesTotal.value.clampMin(1), LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap,
    formatEffect: value => {
      // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
      const mult = formatX(value, 2, 2);
      return TimeStudy(31).canBeApplied
        ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (After TS31: ${mult})`
        : mult;
    },
    progress: () => Achievement(116).isUnlocked ? DC.D1 : (Currency.infinities.gte(1) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 117,
    name: "Costco sells Dimboosts now!",
    get description() { return `Bulk buy ${formatInt(750)} Dimension Boosts at once.`; },
    checkRequirement: ([bulk]) => bulk.gte(750),
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    get reward() {
      return `The multiplier from Dimension Boosts to ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions is ${formatPercents(0.01)} higher.`;
    },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : 1.01,
    progress: () => Achievement(117).isUnlocked ? DC.D1 : Decimal.clamp(DimBoost.maxBuyableDimBoostsAfterCap.div(750), 0, 1)
  },
  {
    id: 118,
    name: "IT'S OVER 9000",
    get description() { return `Get a total Dimensional Sacrifice multiplier of ${formatPostBreak(DC.E9000)}.`; },
    checkRequirement: () => Sacrifice.totalBoost.add(1).log10().gte(9000),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() {
      return `Dimensional Sacrifice doesn't reset your ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions
        and the Autobuyer activates every tick if turned on.`;
    },
    progress: () => Achievement(118).isUnlocked ? DC.D1 : Decimal.clamp(Sacrifice.totalBoost.add(1).log10().div(9000), 0, 1)
  },
  {
    id: 121,
    name: "Can you get infinite IP?",
    get description() { return `Reach ${formatPostBreak("1e30008")} Infinity Points.`; },
    checkRequirement: () => Currency.infinityPoints.value.add(1).log10().gte(30008),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(121).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(30008), 0, 1)
  },
  {
    id: 122,
    name: "You're already dead.",
    get description() {
      return `Eternity without buying ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions 2-8.`;
    },
    checkRequirement: () => player.requirementChecks.eternity.onlyAD1,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    progress: () => Achievement(122).isUnlocked ? DC.D1 : (!player.requirementChecks.eternity.onlyAD1 ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 123,
    name: "5 more eternities until the update",
    get description() { return `Complete ${formatInt(50)} unique Eternity Challenge tiers.`; },
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    progress: () => Achievement(123).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EternityChallenges.completions).div(50), 0, 1)
  },
  {
    id: 124,
    name: "Long lasting relationship",
    get description() {
      return `Have your Infinity Power per second exceed your Infinity Power
      for ${formatInt(60)} consecutive seconds during a single Infinity.`;
    },
    checkRequirement: () => AchievementTimers.marathon2
      .check(
        !EternityChallenge(7).isRunning &&
        InfinityDimension(1).productionPerSecond.gt(Currency.infinityPower.value),
        60
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => {
      //This is a rough estimate that should work but we'll see
      let isec = 0;
      if (AchievementTimers.marathon2.check(!EternityChallenge(7).isRunning && InfinityDimension(1).productionPerSecond.gt(Currency.infinityPower.value), 1)) isec++;
      else isec = 0;
      return Achievement(124).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(isec).div(60), 0, 1);
    }
  },
  {
    id: 125,
    name: "Like feasting on a behind",
    get description() {
      return `Reach ${format(DC.E90)} Infinity Points without having any Infinities
      or any 1st ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions in your current Eternity.`;
    },
    checkRequirement: () => Currency.infinityPoints.value.add(1).log10().gte(90) &&
      player.requirementChecks.eternity.noAD1 && Currency.infinities.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Infinity Point multiplier based on time spent this Infinity.",
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds.times(10).plus(1);
      return player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? DC.D1 : DC.D2.pow(Decimal.ln(thisInfinity).times(Decimal.min(Decimal.pow(thisInfinity, 0.11), 500)));
    },
    cap: () => Effarig.eternityCap,
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(125).isUnlocked ? DC.D1 : ((!player.requirementChecks.eternity.noAD1 || !Currency.infinities.eq(0)) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(90), 0, 1))
  },
  {
    id: 126,
    name: "Popular music",
    get description() { return `Have ${formatInt(180)} times more Replicanti Galaxies than ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`; },
    checkRequirement: () => Replicanti.galaxies.total.gte(player.galaxies.times(180)) && player.galaxies.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Replicanti Galaxies divide your Replicanti by ${format(DC.NUMMAX, 1, 0)}
      instead of resetting them to ${formatInt(1)}.`;
    },
    progress: () => Achievement(126).isUnlocked ? DC.D1 : (player.galaxies.lte(0) ? DC.DM1 : Decimal.clamp(Replicanti.galaxies.total.div(player.galaxies.times(180)), 0, 1))
  },
  {
    id: 127,
    name: "But I wanted another prestige layer...",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Eternity Points.`; },
    checkRequirement: () => Currency.eternityPoints.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(127).isUnlocked ? DC.D1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 128,
    name: "What do I have to do to get rid of you",
    get description() { return `Reach ${formatPostBreak("1e22000")} Infinity Points without any Time Studies.`; },
    checkRequirement: () => Currency.infinityPoints.value.add(1).log10().gte(22000) && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions are multiplied by the number of Time Studies you have.",
    effect: () => Math.max(player.timestudy.studies.length, 1),
    formatEffect: value => `${formatX(value)}`,
    progress: () => Achievement(128).isUnlocked ? DC.D1 : (player.timestudy.studies.length !== 0 ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(22000), 0, 1))
  },
  {
    id: 131,
    name: "No ethical consumption",
    get description() { return `Get ${format(DC.E9, 3)} Banked Infinities.`; },
    checkRequirement: () => Currency.infinitiesBanked.gte(DC.E9),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    get reward() {
      return `You gain ${formatX(2)} times more Infinities and
      after Eternity you permanently keep ${formatPercents(0.05)} of your Infinities as Banked Infinities.`;
    },
    effects: {
      infinitiesGain: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked && !(Alpha.isRunning && Alpha.currentStage >= 23) ? 1 : 2,
      bankedInfinitiesGain: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked && !(Alpha.isRunning && Alpha.currentStage >= 23)
        ? DC.D0 : Currency.infinities.value.times(0.05).floor()
    },
    progress: () => Achievement(131).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinitiesBanked.value.div(1e9), 0, 1)
  },
  {
    id: 132,
    name: "Unique snowflakes",
    get description() {
      return `Have ${formatInt(569)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies without gaining any
        Replicanti Galaxies in your current Eternity.`;
    },
    checkRequirement: () => player.galaxies.gte(569) && player.requirementChecks.eternity.noRG,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `Gain a multiplier to Tachyon Particle and Dilated Time gain based on ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : Decimal.max(Decimal.pow(player.galaxies, 0.04), 1).times(1.22).toNumber(),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(132).isUnlocked ? DC.D1 : (!player.requirementChecks.eternity.noRG ? DC.DM1 : Decimal.clamp(player.galaxies.div(569), 0, 1))
  },
  {
    id: 133,
    name: "I never liked this infinity stuff anyway",
    get description() {
      return `Reach ${formatPostBreak(DC.E200000)} Infinity Points without
      buying any Infinity Dimensions or the ${formatX(2)} Infinity Point multiplier.`;
    },
    checkRequirement: () =>
      Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount.eq(0)) &&
      player.IPMultPurchases.eq(0) &&
      Currency.infinityPoints.value.add(1).log10().gte(200000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "You start Eternities with all Infinity Challenges unlocked and completed.",
    progress: () => Achievement(133).isUnlocked ? DC.D1 : ((!Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount.eq(0)) || player.IPMultPurchases.neq(0)) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(200000), 0, 1))
  },
  {
    id: 134,
    name: "When will it be enough?",
    get description() { return `Reach ${formatPostBreak("1e15000")} Replicanti.`; },
    checkRequirement: () => Replicanti.amount.add(1).log10().gte(15000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `You gain Replicanti ${formatInt(2)} times faster under ${format(replicantiCap(), 1)} Replicanti.`;
    },
    progress: () => Achievement(134).isUnlocked ? DC.D1 : Decimal.clamp(Replicanti.amount.add(1).log10().div(15000), 0, 1)
  },
  {
    id: 135,
    name: "Faster than a potato^286078",
    get description() { return `Get more than ${formatPostBreak("1e8296262")} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.log10().lte(-8296262),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(135).isUnlocked ? DC.D1 : Decimal.clamp(Tickspeed.current.log10().sub(3).neg().div(8296262), 0, 1)
  },
  {
    id: 136,
    name: "I told you already, time is relative",
    description: "Dilate time.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    progress: () => Achievement(136).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EternityChallenge(11).completions).div(20).min(0.25).add(new Decimal(EternityChallenge(12).completions).div(20).min(0.25)).add(player.timestudy.maxTheorem.div(51600).min(0.25)).add(player.timestudy.theorem.div(20000).min(0.25)), 0, 1)
  },
  {
    id: 137,
    name: "Now you're thinking with dilation!",
    get description() {
      return `Get ${formatPostBreak("1e260000")} ${player.universes.current === 2 ? "matter" : "antimatter"}
      in ${formatInt(1)} minute or less while Dilated.`;
    },
    checkRequirement: () =>
      Currency.antimatter.value.add(1).log10().gte(260000) &&
      Time.thisEternity.totalMinutes.lte(1) &&
      player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ${formatX(2)} Dilated Time and Time Theorems while Dilated.`; },
    effect: () => player.disablePostReality && !SlabdrillUnlocks.eternityChallengeTen.isUnlocked ? 1 : (player.dilation.active ? 2 : 1),
    progress: () => Achievement(137).isUnlocked ? DC.D1 : ((!player.dilation.active || Time.thisEternity.totalMinutes.gt(1)) ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(260000), 0, 1))
  },
  {
    id: 138,
    name: "This is what I have to do to get rid of you.",
    get description() {
      return `Reach ${formatPostBreak("1e26000")} Infinity Points without any Time Studies while Dilated.`;
    },
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      Currency.infinityPoints.value.add(1).log10().gte(26000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Removes the downsides from Time Study 131 and 133 in the Active and Idle Time Study paths.",
    progress: () => Achievement(138).isUnlocked ? DC.D1 : ((!player.dilation.active || player.timestudy.studies.length !== 0) ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(26000), 0, 1))
  },
  {
    id: 141,
    name: "Snap back to reality",
    description: "Make a new Reality.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return `${formatX(4)} Infinity Point gain, and increase the multiplier for buying ${formatInt(10)}
      ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions by +${format(0.1, 0, 1)}.`;
    },
    effects: {
      ipGain: () => player.disablePostReality ? 1 : 4,
      buyTenMult: () => player.disablePostReality ? 0 : 0.1
    },
    progress: () => Achievement(141).isUnlocked ? DC.D1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1)
  },
  {
    id: 142,
    name: "How does this work?",
    description: "Unlock the automator.",
    checkRequirement: () => Player.automatorUnlocked,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_BOUGHT, GAME_EVENT.PERK_BOUGHT,
      GAME_EVENT.BLACK_HOLE_UNLOCKED],
    get reward() { return `Dimension Boosts are ${formatPercents(0.5)} stronger.`; },
    effect: () => player.disablePostReality ? 1 : 1.5,
    progress: () => Achievement(142).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(AutomatorPoints.totalPoints).div(100), 0, 1)
  },
  {
    id: 143,
    name: "Yo dawg, I heard you liked reskins...",
    get description() {
      return `Have all your Eternities in your past ${formatInt(10)} Eternities be at least
      ${format(DC.NUMMAX, 1, 0)} times higher Eternity Points than the previous one.`;
    },
    checkRequirement: () => {
      if (player.records.recentEternities.some(i => i[0].gte(Number.MAX_VALUE))) return false;
      const eternities = player.records.recentEternities.map(run => run[2]);
      for (let i = 0; i < eternities.length - 1; i++) {
        if (eternities[i].lt(eternities[i + 1].times(DC.NUMMAX))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: "Galaxies no longer reset Dimension Boosts.",
    progress: () => {
      let infete = 0;
      const reternities = player.records.recentEternities.map(run => run[2]);
      for (let i = 0; i < reternities.length - 1; i++) {
        if (reternities[i].gte(reternities[i + 1].times(DC.NUMMAX))) infete++;
      }
      return Achievement(143).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(infete).div(9), 0, 1);
    }
  },
  {
    id: 144,
    name: "Is this an Interstellar reference?",
    description: "Unlock the Black Hole.",
    checkRequirement: () => BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.BLACK_HOLE_UNLOCKED,
    progress: () => Achievement(144).isUnlocked ? DC.D1 : Decimal.clamp(Currency.realityMachines.value.div(100), 0, 1)
  },
  {
    id: 145,
    name: "Are you sure these are the right way around?",
    description: "Have either Black Hole interval smaller than its duration.",
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval < bh.duration),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Black Hole intervals are ${formatPercents(0.1)} shorter.`; },
    effect: () => player.disablePostReality ? 1 : 0.9,
    progress: () => Achievement(145).isUnlocked ? DC.D1 : Decimal.clamp(Decimal.max(new Decimal(BlackHole(1).duration).div(new Decimal(BlackHole(1).interval).max(0.000001)), new Decimal(BlackHole(2).duration).div(new Decimal(BlackHole(2).interval).max(0.000001))), 0, 1)
  },
  {
    id: 146,
    name: "Perks of living",
    description: "Have all Perks bought.",
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT,
    get reward() { return `+${formatPercents(0.01)} Glyph rarity.`; },
    effect: () => player.disablePostReality ? 0 : 1,
    progress: () => Achievement(146).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.reality.perks.size).div(Perks.all.length), 0, 1)
  },
  {
    id: 147,
    name: "Master of Reality",
    description: "Have all Reality upgrades bought.",
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    reward: "Unlock Teresa, the Celestial of Reality.",
    progress: () => Achievement(147).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(RealityUpgrades.all.filter(u => u.isBought || u.boughtAmount > 0).length).div(RealityUpgrades.all.length), 0, 1)
  },
  {
    id: 148,
    name: "Royal flush",
    description: "Reality with one of each basic Glyph type.",
    checkRequirement: () => BASIC_GLYPH_TYPES
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Gained Glyph level is increased by number of distinct Glyph types equipped.",
    effect: () => player.disablePostReality ? 0 : (new Set(Glyphs.activeWithoutCompanion.map(g => g.type))).size,
    formatEffect: value => `+${formatInt(value)}`,
    progress: () => Achievement(148).isUnlocked ? DC.D1 : (!BASIC_GLYPH_TYPES.every(type => Glyphs.activeList.some(g => g.type === type)) ? DC.DM1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 151,
    name: "You really didn't need it anyway",
    get description() {
      return `Get ${formatInt(800)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies without
      buying 8th ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions in your current Infinity.`;
    },
    checkRequirement: () => player.galaxies.gte(800) && player.requirementChecks.infinity.noAD8,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Unlock V, the Celestial of Achievements.",
    progress: () => Achievement(151).isUnlocked ? DC.D1 : (!player.requirementChecks.infinity.noAD8 ? DC.DM1 : Decimal.clamp(player.galaxies.div(800), 0, 1))
  },
  {
    id: 152,
    name: "Y'all got any more of them Glyphs?",
    get description() { return `Have ${formatInt(100)} Glyphs in your inventory.`; },
    checkRequirement: () => Glyphs.inventoryList.length >= 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    progress: () => Achievement(152).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Glyphs.inventoryList.length).div(100), 0, 1)
  },
  {
    id: 153,
    name: "More like \"reallydoesn'tmatter\"",
    get description() {
      return `Reality without producing ${player.universes.current === 2 ? "matter" : "antimatter"}.`;
    },
    checkRequirement: () => player.requirementChecks.reality.noAM,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    progress: () => Achievement(153).isUnlocked ? DC.D1 : (!player.requirementChecks.reality.noAM ? DC.DM1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 154,
    name: "I am speed",
    get description() { return `Reality in under ${formatInt(5)} seconds (game time).`; },
    checkRequirement: () => Time.thisReality.totalSeconds.lte(5),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return `${formatPercents(EndgameMastery(41).isBought ? 1 : 0.1)} chance each Reality of ${formatX(2)}
      Realities and Perk Points.`; },
    effect: () => player.disablePostReality ? 0 : (EndgameMastery(41).isBought ? 1 : 0.1),
    progress: () => Achievement(154).isUnlocked ? DC.D1 : (Time.thisReality.totalSeconds.gt(5) ? DC.DM1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 155,
    name: "Achievement #15983",
    get description() { return `Play for ${formatFloat(13.7, 1)} billion years.`; },
    checkRequirement: () => Time.totalTimePlayed.totalYears.gt(13.7e9),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Black Hole durations are ${formatPercents(0.1)} longer.`; },
    effect: () => player.disablePostReality ? 1 : 1.1,
    progress: () => Achievement(155).isUnlocked ? DC.D1 : Decimal.clamp(Time.totalTimePlayed.totalYears.div(13.7e9), 0, 1)
  },
  {
    id: 156,
    name: "College Dropout",
    description: "Reality without buying Time Theorems.",
    checkRequirement: () => player.requirementChecks.reality.noPurchasedTT,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `Gain ${formatX(2.5, 0, 1)} generated Time Theorems, and a free coupon to McDonalds™️.`; },
    effect: () => player.disablePostReality ? 1 : 2.5,
    progress: () => Achievement(156).isUnlocked ? DC.D1 : (!player.requirementChecks.reality.noPurchasedTT ? DC.DM1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 157,
    name: "It's super effective!",
    get description() { return `Get a Glyph with ${formatInt(4)} effects.`; },
    checkRequirement: () => Glyphs.activeList.concat(Glyphs.inventoryList).map(
      glyph => getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
        .filter(effect => effect.isGenerated).length
    ).max() >= 4,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    progress: () => Achievement(157).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Glyphs.activeList.concat(Glyphs.inventoryList).map(glyph => getGlyphEffectsFromBitmask(glyph.effects, 0, 0).filter(effect => effect.isGenerated).length).max()).div(4), 0, 1)
  },
  {
    id: 158,
    name: "Bruh, are you like, inside the hole?",
    description: "Make both Black Holes permanent.",
    checkRequirement: () => BlackHole(1).isPermanent && BlackHole(2).isPermanent,
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Black Hole power increased by ${formatPercents(0.1)}.`; },
    effect: () => player.disablePostReality ? 1 : 1.1,
    progress: () => Achievement(158).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(BlackHoles.list.filter(b => b.isPermanent).length).div(2), 0, 1)
  },
  {
    id: 161,
    name: "that's where you're wrong kiddo",
    get description() { return `Get ${formatPostBreak(DC.E1E8)} ${player.universes.current === 2 ? "matter" : "antimatter"} while Dilated.`; },
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(100000000) && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(161).isUnlocked ? DC.D1 : (!player.dilation.active ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(100000000), 0, 1))
  },
  {
    id: 162,
    name: "Reinstalled the game and rejoined the server",
    description: "Have every Time Study at once.",
    checkRequirement: () => player.timestudy.studies.length >= 58,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(162).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.timestudy.studies.length).div(58), 0, 1)
  },
  {
    id: 163,
    name: "Actually, super easy! Barely an inconvenience!",
    get description() {
      return `Complete all the Eternity Challenges ${formatInt(5)} times with less than ${formatInt(1)}
      second (game time) in your current Reality.`;
    },
    checkRequirement: () => EternityChallenges.all.map(ec => ec.completions).min() >= 5 &&
      Time.thisReality.totalSeconds.lte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(163).isUnlocked ? DC.D1 : (Time.thisReality.totalSeconds.gt(1) ? DC.DM1 : Decimal.clamp(new Decimal(EternityChallenges.completions).div(60), 0, 1))
  },
  {
    id: 164,
    name: "Infinity times two",
    get description() { return `Get ${format(DC.NUMMAX, 1)} Infinities.`; },
    checkRequirement: () => Currency.infinitiesTotal.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ×${formatInt(1024)} more Infinities.`; },
    effect: () => player.disablePostReality ? 1 : 1024,
    progress: () => Achievement(164).isUnlocked ? DC.D1 : Decimal.clamp(Currency.infinitiesTotal.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 165,
    name: "Perfectly balanced",
    get description() { return `Get a level ${formatInt(5000)} Glyph with all Glyph level factors equally weighted.`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel.gte(5000) &&
      ["repl", "dt", "eternities"].every(
        i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Unlock optimal automatic Glyph level factor adjustment.",
    progress: () => Achievement(165).isUnlocked ? DC.D1 : (!["repl", "dt", "eternities"].every(i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep) ? DC.DM1 : Decimal.clamp(gainedGlyphLevel().actualLevel.div(5000), 0, 1))
  },
  {
    id: 166,
    name: "Nicenice.",
    get description() { return `Get a Glyph with level ending in ${formatInt(6969)}.`; },
    checkRequirement: () => Decimal.modulo(gainedGlyphLevel().actualLevel, 10000).eq(6969),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `+${formatInt(69)} to Glyph level.`; },
    effect: () => player.disablePostReality ? 0 : 69,
    progress: () => Achievement(166).isUnlocked ? DC.D1 : (gainedGlyphLevel().actualLevel.lte(6969) ? Decimal.clamp(gainedGlyphLevel().actualLevel.div(6969), 0, 1) : Decimal.clamp(Decimal.mod(gainedGlyphLevel().actualLevel.sub(6969), 10000).div(10000), 0, 1))
  },
  {
    id: 167,
    name: "Mr. Layer? Sorry, you're not on the list",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Reality Machines.`; },
    checkRequirement: () => Currency.realityMachines.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Gain more Reality Machines based on your current Reality Machines.",
    effect: () => player.disablePostReality ? DC.D1 : Decimal.clampMin(1, Currency.realityMachines.value.add(1).log2()),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(167).isUnlocked ? DC.D1 : Decimal.clamp(Currency.realityMachines.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 168,
    name: "Woah, we're halfway there",
    get description() { return `Get ${formatInt(50)} total Ra Celestial Memory levels.`; },
    checkRequirement: () => Ra.totalPetLevel >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Get ${formatPercents(0.1)} more memories.`; },
    effect: () => player.disablePostReality ? 1 : 1.1,
    progress: () => Achievement(168).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Ra.totalPetLevel).div(50), 0, 1)
  },
  {
    id: 171,
    name: "The god is delighted",
    description: "Sacrifice every sacrificable Glyph type at least once.",
    checkRequirement: () => Object.values(player.reality.glyphs.sac).every(s => s.gt(0)),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    get reward() { return `Glyph sacrifice is ${formatX(2)} stronger.`; },
    effect: () => player.disablePostReality ? 1 : 2,
    progress: () => Achievement(171).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Object.values(player.reality.glyphs.sac).filter(s => s.gt(0)).length).div(7), 0, 1)
  },
  {
    id: 172,
    name: "Hitchhiker's Guide to Reality",
    get description() {
      return `Reality for ${format(DC.NUMMAX, 1)} Reality Machines without having
      any Charged Infinity Upgrades, having any equipped Glyphs, or buying any Triad Studies.`;
    },
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(DC.NUMMAX) &&
      player.celestials.ra.charged.size === 0 && Glyphs.activeWithoutCompanion.length === 0 &&
      player.requirementChecks.reality.noTriads,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    progress: () => Achievement(172).isUnlocked ? DC.D1 : ((player.celestials.ra.charged.size !== 0 || Glyphs.activeWithoutCompanion.length !== 0 || !player.requirementChecks.reality.noTriads) ? DC.DM1 : Decimal.clamp(Currency.realityMachines.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 173,
    name: "Cet accomplissement n'existe pas III",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Reality Machines.`; },
    checkRequirement: () => player.reality.realityMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(173).isUnlocked ? DC.D1 : Decimal.clamp(Currency.realityMachines.value.add(1).log10().div(1000), 0, 1)
  },
  {
    id: 174,
    name: "Don't you already have two of these?",
    description: "Get a Singularity.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE,
    progress: () => Achievement(174).isUnlocked ? DC.D1 : Decimal.clamp(Currency.darkEnergy.value.div(200), 0, 1)
  },
  {
    id: 175,
    name: "The First Antihistorian",
    get description() { return `Get ${formatInt(25000)} of all Alchemy Resources.`; },
    checkRequirement: () => AlchemyResources.all.every(x => x.amount >= 25000),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    get reward() {
      return `Synergism can go above ${formatPercents(1)} and Momentum increases ${formatX(10)} faster.`;
    },
    effect: () => player.disablePostReality ? 1 : 10,
    progress: () => Achievement(175).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(AlchemyResources.all.filter(x => x.amount >= 25000).length).div(21), 0, 1)
  },
  {
    id: 176,
    name: "Mom counted to 3",
    description: "Annihilate your Dark Matter Dimensions.",
    progress: () => Achievement(176).isUnlocked ? DC.D1 : Decimal.clamp((ImaginaryUpgrade(19).isBought ? new Decimal(2/3) : (player.requirementChecks.reality.maxStudies > 8 ? DC.D0 : Tickspeed.continuumValue.div(11.55e6).min(1/3)).add(Currency.imaginaryMachines.value.div(8.4e10).min(1/3))).add(Currency.darkMatter.value.add(1).log10().div(180).min(1/3)), 0, 1)
  },
  {
    id: 177,
    name: "This mile took a celestial",
    description: "Complete all Singularity Milestones in the first six rows at least once.",
    checkRequirement: () => SingularityMilestone.tesseractMultFromSingularities.completions.gt(0),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_AFTER,
    progress: () => Achievement(177).isUnlocked ? DC.D1 : Decimal.clamp(Currency.singularities.value.add(1).log10().div(Decimal.log10(4e44)), 0, 1)
  },
  {
    id: 178,
    name: "Destroyer of Worlds",
    get description() { return `Get ${formatInt(100000)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} Galaxies.`; },
    checkRequirement: () => player.galaxies.gte(100000),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `All Galaxies are ${formatPercents(0.01)} stronger.`; },
    effect: () => player.disablePostReality ? 1 : 1.01,
    progress: () => Achievement(178).isUnlocked ? DC.D1 : Decimal.clamp(player.galaxies.div(100000), 0, 1)
  },
  {
    id: 181,
    displayId: 666,
    name: "Antimatter Dimensions Eternal",
    description: "Doom your Reality.",
    checkRequirement: () => Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    progress: () => Achievement(181).isUnlocked ? DC.D1 : Decimal.clamp((ImaginaryUpgrade(25).isBought ? new Decimal(0.5) : Currency.imaginaryMachines.value.div(6.4e15).min(0.25).add((!Laitela.isRunning || Laitela.maxAllowedDimension !== 0 || Glyphs.activeWithoutCompanion.length > 1) ? DC.D0 : Currency.eternityPoints.value.add(1).log10().div(16000).min(0.25))).add(new Decimal(Achievements.prePelleRows.countWhere(r => r.every(a => a.isUnlocked))).div(68).min(0.25)).add(new Decimal(AlchemyResources.all.filter(x => x.amount >= 25000).length).div(84).min(0.25)), 0, 1)
  },
  {
    id: 182,
    name: "One more time",
    get description() {
      return `Permanently gain back all ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension autobuyers.`;
    },
    checkRequirement: () => PelleUpgrade.antimatterDimAutobuyers1.canBeApplied &&
      PelleUpgrade.antimatterDimAutobuyers2.canBeApplied,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(182).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp((PelleUpgrade.antimatterDimAutobuyers1.canBeApplied ? new Decimal(0.5) : DC.D0).add(PelleUpgrade.antimatterDimAutobuyers2.canBeApplied ? new Decimal(0.5) : DC.D0), 0, 1))
  },
  {
    id: 183,
    name: "Déjà vOoM",
    description: "Complete Infinity Challenge 5 while Doomed.",
    checkRequirement: () => Pelle.isDoomed && InfinityChallenge(5).isCompleted,
    checkEvent: GAME_EVENT.INFINITY_CHALLENGE_COMPLETED,
    // Weirdly specific reward? Yes, its V's ST bonus because we forgot to disable it
    // when balancing Pelle and only realised too late.
    get reward() { return `All ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimensions are raised to ${formatPow(1.1012920825630384, 0, 3)}`; },
    effect: () => player.disablePostReality ? 1 : 1.1012920825630384,
    progress: () => Achievement(183).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(36000).min(0.5).add(!InfinityChallenge(5).isRunning ? DC.D0 : player.antimatter.max(1).log10().div(33000).min(0.5)), 0, 1))
  },
  {
    id: 184,
    name: "You're out!",
    description: "Encounter the third Pelle Strike.",
    checkRequirement: () => PelleStrikes.eternity.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    progress: () => Achievement(184).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 185,
    name: "Four score and seven years ago",
    description: "Encounter the fourth Pelle Strike.",
    checkRequirement: () => PelleStrikes.ECs.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    progress: () => Achievement(185).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp(player.timestudy.maxTheorem.div(115), 0, 1))
  },
  {
    id: 186,
    displayId: 181,
    name: "An unhealthy obsession",
    description: `Purchase Time Study 181 while Doomed.`,
    progress: () => Achievement(186).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp((TimeStudy(171).isBought ? new Decimal(0.5) : player.timestudy.maxTheorem.div(186).min(0.5)).add(!TimeStudy(171).isBought ? DC.D0 : player.timestudy.theorem.div(400).min(0.5)), 0, 1))
  },
  {
    id: 187,
    name: "The One with Dilated Time",
    description: "Unlock Dilation while Doomed.",
    checkRequirement: () => PelleStrikes.dilation.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    // We forgot to disable a singularity milestone while balancing Pelle; now it's disabled
    // and this upgrade has the same effect as it used to.
    get reward() {
      return `Increase the multiplier per repeatable Dilated Time
      multiplier upgrade by ${formatX(1.35, 0, 2)}.`;
    },
    effect: () => player.disablePostReality ? 1 : 1.35,
    progress: () => Achievement(187).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp(new Decimal(EternityChallenge(11).completions).div(20).min(0.25).add(new Decimal(EternityChallenge(12).completions).div(20).min(0.25)).add(player.timestudy.maxTheorem.div(51600).min(0.25)).add(player.timestudy.theorem.div(20000).min(0.25)), 0, 1))
  },
  {
    id: 188,
    name: "The End...",
    description: "Escape the Doomed Reality.",
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(9e15) && Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(188).isUnlocked ? DC.D1 : (!Pelle.isDoomed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(9e15), 0, 1))
  },
  {
    id: 191,
    name: "...For Now",
    description: "Purchase a 1st Dimension in Run 2.",
    checkRequirement: () => PlayerProgress.endgameUnlocked() && AntimatterDimension(1).amount.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(191).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgames).div(2).min(0.5).add(player.antimatter.max(1).log10().div(2).min(0.5)), 0, 1)
  },
  {
    id: 192,
    name: "Destiny",
    description: "Doom Your Reality in Run 2.",
    checkRequirement: () => PlayerProgress.endgameUnlocked() && Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    progress: () => Achievement(192).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgames).div(2).min(0.5).add((ImaginaryUpgrade(25).isBought ? new Decimal(0.5) : Currency.imaginaryMachines.value.div(6.4e15).min(0.25).add((!Laitela.isRunning || Laitela.maxAllowedDimension !== 0 || Glyphs.activeWithoutCompanion.length > 1) ? DC.D0 : Currency.eternityPoints.value.add(1).log10().div(16000).min(0.25))).add(new Decimal(Achievements.prePelleRows.countWhere(r => r.every(a => a.isUnlocked))).div(68).min(0.25)).add(new Decimal(AlchemyResources.all.filter(x => x.amount >= 25000).length).div(84).min(0.25)).div(2)), 0, 1)
  },
  {
    id: 193,
    name: "Unstoppable",
    description: "Beat Doom in Run 2.",
    checkRequirement: () => PlayerProgress.endgameUnlocked() && Currency.antimatter.value.add(1).log10().gte(9e15) && Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Galaxies are ${formatPercents(0.1)} stronger.`;
    },
    effect: () => player.disablePostReality ? 1 : 1.1,
    progress: () => Achievement(193).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgames).div(2).min(0.5).add(!Pelle.isDoomed ? DC.D0 : player.antimatter.max(1).log10().div(18e15).min(0.5)), 0, 1)
  },
  {
    id: 194,
    name: "TIME. IS. RELATIVE.",
    description: "Break Eternity.",
    checkRequirement: () => player.break2,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(194).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgames).div(2).min(0.5).add(player.antimatter.max(1).log10().div(18e15).min(0.5)), 0, 1)
  },
  {
    id: 195,
    name: "System Error",
    description: "Endgame in under an hour.",
    checkRequirement: () => player.records.bestEndgame.realTime < 3600000,
    checkEvent: GAME_EVENT.ENDGAME_RESET_AFTER,
    progress: () => Achievement(195).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(3600000).div(player.records.bestEndgame.realTime), 0, 1)
  },
  {
    id: 196,
    name: "At Long Last",
    description: "Regain all Achievements in Pelle.",
    checkRequirement: () => PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length >= 33,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `You can equip up to ${formatInt(2)} Effarig and Reality Glyphs each.`;
    },
    progress: () => Achievement(196).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length).div(33), 0, 1)
  },
  {
    id: 197,
    name: "Wait. That's illegal.",
    get description() { return `Own a Reality Glyph of level ${formatInt(25001)} or higher.` },
    checkRequirement: () => Glyphs.inventoryList.filter(g => g.type === 'reality' && g.level.gte(25001)).length > 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(197).isUnlocked ? DC.D1 : Decimal.clamp(player.records.totalAntimatter.add(1).log10().add(1).log10().div(100).min(0.5).add(new Decimal(player.records.bestReality.glyphLevel).div(150006).min(0.5)), 0, 1)
  },
  {
    id: 198,
    name: "...eons stacked on eons stacked on...",
    get description() { return `Have a game speed of ${format(DC.NUMMAX, 1)} with Celestial Matter toggled off.` },
    checkRequirement: () => getGameSpeedupForDisplay().gte(DC.NUMMAX) && player.endgame.celestialMatterMultiplier.isActive === false,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(198).isUnlocked ? DC.D1 : (player.endgame.celestialMatterMultiplier.isActive ? DC.DM1 : Decimal.clamp(getGameSpeedupForDisplay().max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 201,
    name: "A Newer Beginning",
    description: "Begin generation of Galactic Power.",
    checkRequirement: () => GalacticPower.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(201).isUnlocked ? DC.D1 : Decimal.clamp(Currency.singularities.value.add(1).log10().div(300), 0, 1)
  },
  {
    id: 202,
    name: "Reinstalled the game and rejoined the server... again",
    description: "Have every Endgame Mastery at once.",
    checkRequirement: () => player.endgameMasteries.masteries.length >= 39,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(202).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgameMasteries.masteries.length).div(39), 0, 1)
  },
  {
    id: 203,
    name: "Faster than a dilated potato",
    get description() { return `Get more than ${formatPostBreak("ee29")} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.log10().lte(-1e29),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(203).isUnlocked ? DC.D1 : Decimal.clamp(Tickspeed.current.log10().sub(3).neg().div(1e29), 0, 1)
  },
  {
    id: 204,
    name: "Hard Reset",
    description: "Disable all Pelle Nerfs.",
    checkRequirement: () => PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length >= 33 &&
      PelleDestructionUpgrade.all.filter(u => u.canBeApplied).length >= 50 &&
      PelleRealityUpgrade.all.filter(u => u.canBeApplied).length >= 20 &&
      PelleImaginaryUpgrade.all.filter(u => u.canBeApplied).length >= 19 &&
      PelleCelestialUpgrade.all.filter(u => u.canBeApplied).length >= 21 &&
      PellePerkUpgrade.all.filter(u => u.canBeApplied).length >= 29 &&
      PelleAlchemyUpgrade.all.filter(u => u.canBeApplied).length >= 21,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Strike Disabling.`;
    },
    progress: () => Achievement(204).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleAchievementUpgrade.all.filter(u => u.canBeApplied).length).div(231).min(1/7).add(new Decimal(PelleDestructionUpgrade.all.filter(u => u.canBeApplied).length).div(350).min(1/7)).add(new Decimal(PelleRealityUpgrade.all.filter(u => u.canBeApplied).length).div(140).min(1/7)).add(new Decimal(PelleImaginaryUpgrade.all.filter(u => u.canBeApplied).length).div(133).min(1/7)).add(new Decimal(PelleCelestialUpgrade.all.filter(u => u.canBeApplied).length).div(147).min(1/7)).add(new Decimal(PellePerkUpgrade.all.filter(u => u.canBeApplied).length).div(203).min(1/7)).add(new Decimal(PelleAlchemyUpgrade.all.filter(u => u.canBeApplied).length).div(147).min(1/7)), 0, 1)
  },
  {
    id: 205,
    name: "Look to the Stars",
    description: "Enter the Ethereal.",
    checkRequirement: () => Ethereal.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(205).isUnlocked ? DC.D1 : Decimal.clamp(Currency.galacticPower.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 206,
    name: "Full Control of the Dark",
    description: "Purchase the 8th Dark Matter Dimension.",
    checkRequirement: () => ImaginaryUpgrade(29).isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Decrease Galaxy Generator Instability by ${formatInt(2)}.`;
    },
    effect: () => player.disablePostReality ? 0 : 2,
    progress: () => Achievement(206).isUnlocked ? DC.D1 : Decimal.clamp(actualBaseGalaxiesWithoutGeneration().add(1).log10().div(150).min(0.5).add(Currency.imaginaryMachines.value.add(1).log10().div(400).min(0.5)), 0, 1)
  },
  {
    id: 207,
    name: "Gone...",
    description: "Destroy Pelle.",
    checkRequirement: () => PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length >= 5,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Boost Celestial Point Gain.`;
    },
    progress: () => Achievement(207).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length).div(5), 0, 1)
  },
  {
    id: 208,
    name: "...But Not Forgotten",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Imaginary Machines.` },
    checkRequirement: () => Currency.imaginaryMachines.value.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain a small multiplier to the Celestial Matter Conversion Exponent based on unnerfed Celestial Matter.`;
    },
    effect: () => player.disablePostReality ? 1 : Decimal.pow(Decimal.log10(Currency.unnerfedCelestialMatter.value.add(1).log10().add(1)).add(1), 0.1).toNumber(),
    formatEffect: value => `${formatX(value, 2, 3)}`,
    progress: () => Achievement(208).isUnlocked ? DC.D1 : Decimal.clamp(Currency.imaginaryMachines.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 211,
    name: "Mistake?",
    get description() { return `Enter Alpha's Reality.` },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(211).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(PelleStrikeUpgrade.all.filter(u => u.canBeApplied).length).div(10).min(0.5).add(Currency.imaginaryMachines.value.add(1).log10().div(Decimal.log10(DC.NUMMAX).times(2)).min(0.5)), 0, 1)
  },
  {
    id: 212,
    name: "The Dark Crunch",
    get description() { return `Reach Infinity in Alpha's Reality.` },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Alpha Decay increases ${formatX(1.1, 1, 1)} faster`;
    },
    effect: 1.1,
    progress: () => Achievement(212).isUnlocked ? DC.D1 : (!Alpha.isRunning ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 213,
    name: "Never Gonna Stop",
    get description() { return `Reach Eternity in Alpha's Reality.` },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() {
      return `Alpha Decay speed is boosted based on Dual Machines.`;
    },
    effect: () => Decimal.max(Decimal.ln(Decimal.ln(Currency.dualMachines.value.add(1)).add(1)), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`,
    progress: () => Achievement(213).isUnlocked ? DC.D1 : (!Alpha.isRunning ? DC.DM1 : Decimal.clamp(Currency.infinityPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 214,
    name: "IT WILL NEVER BE ENOUGH.",
    get description() { return `Reach ${formatPostBreak("e1e10")} Replicanti.` },
    checkRequirement: () => player.replicanti.amount.gte("e1e10"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(214).isUnlocked ? DC.D1 : Decimal.clamp(Replicanti.amount.add(1).log10().div(1e10), 0, 1)
  },
  {
    id: 215,
    name: "Domain Error",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Celestial Points.` },
    checkRequirement: () => Currency.celestialPoints.value.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(215).isUnlocked ? DC.D1 : Decimal.clamp(Currency.celestialPoints.value.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 216,
    name: "Este logro no existe IV",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Imaginary Machines.` },
    checkRequirement: () => player.reality.imaginaryMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain a small multiplier to Ethereal Power based on Imaginary Machines.`;
    },
    effect: () => player.disablePostReality ? DC.D1 : Decimal.pow(Decimal.log10(player.reality.imaginaryMachines.add(1)).div(1000), 5).times(1000),
    formatEffect: value => `${formatX(value, 3)}`,
    progress: () => Achievement(216).isUnlocked ? DC.D1 : Decimal.clamp(Currency.imaginaryMachines.value.add(1).log10().div(1000), 0, 1)
  },
  {
    id: 217,
    name: "Why are we still here...",
    get description() { return `Reach ${format(1e12, 2, 2)} Endgames.` },
    checkRequirement: () => player.endgames >= 1e12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Start Endgames with ${format(1e24, 2, 2)} filled Reality Machines`;
    },
    effect: () => player.disablePostReality ? DC.D0 : Decimal.pow10(24),
    progress: () => Achievement(217).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgames).div(1e12), 0, 1)
  },
  {
    id: 218,
    name: "...just to suffer?",
    get description() { return `Reach ${formatPostBreak("ee50")} ${player.universes.current === 2 ? "Matter" : "Antimatter"} inside The Nameless Ones' Reality.` },
    checkRequirement: () => Currency.antimatter.value.gte("ee50") && Enslaved.isRunning,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Keep V progression on Endgame.`;
    },
    progress: () => Achievement(218).isUnlocked ? DC.D1 : (!Enslaved.isRunning ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(50), 0, 1))
  },
  {
    id: 221,
    name: "Light",
    get description() { return `Defeat Alpha.` },
    checkRequirement: () => Alpha.isRunning,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return `Unlock Celestial Dimension Expansion.`;
    },
    progress: () => Achievement(221).isUnlocked ? DC.D1 : (!Alpha.isRunning ? DC.DM1 : Decimal.clamp(Currency.eternityPoints.value.add(1).log10().div(4000), 0, 1))
  },
  {
    id: 222,
    name: "Time is absolute",
    get description () { return `Have more Tachyon Particles than Dilated Time, with both exceeding ${format("1e5000", 2)}.` },
    checkRequirement: () => Currency.tachyonParticles.value.gt(Currency.dilatedTime.value) && Currency.dilatedTime.value.gt("1e5000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Momentum increases ${formatX(10)} faster.`;
    },
    effect: () => player.disablePostReality ? 1 : 10,
    progress: () => Achievement(222).isUnlocked ? DC.D1 : Decimal.clamp(Currency.dilatedTime.value.add(1).log10().div(10000).min(0.5).add(Currency.dilatedTime.value.lte("1e5000") ? DC.D0 : Currency.tachyonParticles.value.add(1).log10().div(Currency.dilatedTime.value.add(1).log10().times(2)).min(0.5)), 0, 1)
  },
  {
    id: 223,
    name: "Power! Unlimited Power!",
    get description() { return `Have your Infinity Dimension purchase cap exceed ${format(DC.NUMMAX, 1, 0)}.` },
    checkRequirement: () => InfinityDimensions.totalDimCap.gt(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Charged Upgrades will automatically recharge upon exiting a challenge that disabled them if you are able to charge every upgrade in their respective set.`;
    },
    progress: () => Achievement(223).isUnlocked ? DC.D1 : Decimal.clamp(InfinityDimensions.totalDimCap.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 224,
    name: "Destroyer of Universes",
    get description() { return `Reach ${formatPostBreak(Decimal.pow10(1e100), 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"} outside Pelle.` },
    checkRequirement: () => Currency.antimatter.value.gte(Decimal.pow10(1e100)) && !Pelle.isDoomed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Double the Celestial Matter Conversion Exponent.`;
    },
    effect: () => player.disablePostReality ? 1 : 2,
    progress: () => Achievement(224).isUnlocked ? DC.D1 : (Pelle.isDoomed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(100), 0, 1))
  },
  {
    id: 225,
    name: "299792458m/s",
    description: "Uncap Celestial Matter.",
    checkRequirement: () => player.endgame.celDimExpansion.isBroken,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Reduce the Celestial Matter softcap magnitude by ${formatPercents(0.05)}.`;
    },
    effect: () => player.disablePostReality ? 1 : 0.95,
    progress: () => Achievement(225).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialInfinityPoints.div(10000), 0, 1)
  },
  {
    id: 226,
    name: "Thirty thousand degrees",
    description: "Unlock Stars.",
    checkRequirement: () => player.endgame.ethereal.isExtended,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(226).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.ethereal.power.add(1).log10().div(25), 0, 1)
  },
  {
    id: 227,
    name: "How do these work???",
    description: "Obtain a Penteract.",
    checkRequirement: () => player.endgame.hypercubes.penteracts >= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Effarig's second shop.`;
    },
    progress: () => Achievement(227).isUnlocked ? DC.D1 : Decimal.clamp((DualityUpgrade(25).isBought ? new Decimal(0.75) : new Decimal(player.celestials.laitela.hadrons.dark).div(128).min(0.25).add(Hadrons.timeFactor.div(2000).min(0.25)).add(Currency.dualMachines.value.add(1).log10().div(80).min(0.25))).add(Currency.eternityPoints.value.add(1).log10().add(1).log10().div(420).min(0.25)), 0, 1)
  },
  {
    id: 228,
    name: "Look how far we've come",
    get description() { return `Reach ${formatPostBreak(DC.ENUMMAX, 2)} ${player.universes.current === 2 ? "Matter" : "Antimatter"}.` },
    checkRequirement: () => player.antimatter.gte(DC.ENUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Divinity.`;
    },
    progress: () => Achievement(228).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 231,
    name: "Grandmastery",
    get description() { return `Purchase ${formatInt(1000)} Endgame Skills.` },
    checkRequirement: () => EndgameSkills.totalPurchased() >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Dilate ${player.universes.current === 2 ? "Matter" : "Antimatter"} Dimension Multipliers based on purchased Endgame Skills, which is stronger in Pelle.`;
    },
    effect: () => player.disablePostReality ? 1 : 1 + ((Math.min(EndgameSkills.totalPurchased(), 2000) + (Math.max(Math.log2(EndgameSkills.totalPurchased() / 2000), 0) * 1000)) / (Pelle.isDoomed ? 20000 : 100000)),
    formatEffect: value => `${formatPow(value, 2, 3)}`,
    progress: () => Achievement(231).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EndgameSkills.totalPurchased()).div(1000), 0, 1)
  },
  {
    id: 232,
    name: "Millenium of peace",
    get description() { return `Obtain ${formatInt(1000)} Free Tesseracts.` },
    checkRequirement: () => new Decimal(Tesseracts.extra * Tesseracts.totalMult).gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain a small power to Eternity Points based on Penteracts.`;
    },
    effect: () => player.disablePostReality ? 1 : Decimal.log10(Penteracts.effectiveCount + 1).div(10).add(1).toNumber(),
    formatEffect: value => `${formatPow(value, 2, 3)}`,
    progress: () => Achievement(232).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Tesseracts.extra * Tesseracts.totalMult).div(1000), 0, 1)
  },
  {
    id: 233,
    name: "End of an era",
    description: "Purchase all the Break Eternity Upgrades.",
    checkRequirement: () => BreakEternityUpgrade.all.filter(u => u.isCapped).length === 10 &&
      BreakEternityUpgrade.all.filter(u => u.isBought).length === 5,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Raise the ${player.universes.current === 2 ? "Matter" : "Antimatter"} Exponent to the power of ${format(1.4, 2, 1)}, but only inside Pelle.`;
    },
    effect: () => player.disablePostReality || !Pelle.isDoomed ? 1 : 1.4,
    progress: () => Achievement(233).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(BreakEternityUpgrade.all.filter(u => u.isCapped).length + BreakEternityUpgrade.all.filter(u => u.isBought).length).div(15), 0, 1)
  },
  {
    id: 234,
    name: "The One with Celestial Time",
    description: "Perform a Celestial Eternity.",
    checkRequirement: () => player.endgame.celDimExpansion.celestialEternities.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(234).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialInfinityPoints.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 235,
    name: "Never-ending Darkness",
    get description() { return `Hadronize Lai'tela's Reality ${formatInt(50)} times.` },
    checkRequirement: () => Laitela.hadronizes >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `The time for Hadron effects to cap is halved.`;
    },
    effect: () => player.disablePostReality ? 1 : 2,
    progress: () => Achievement(235).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Laitela.hadronizes).div(50), 0, 1)
  },
  {
    id: 236,
    name: "Supernova",
    get description() { return `Get ${formatInt(500)} total Ra Celestial Memory levels.` },
    checkRequirement: () => Ra.totalPetLevel >= 500,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Get ${formatX(500)} more memories.`; },
    effect: () => player.disablePostReality ? 1 : 500,
    progress: () => Achievement(236).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Ra.totalPetLevel).div(500), 0, 1)
  },
  {
    id: 237,
    name: "Equilibrium",
    description: "Have the first two Resurgence Upgrades bought.",
    checkRequirement: () => ResurgenceUpgrade.ipSurge.isBought && ResurgenceUpgrade.epSurge.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(237).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineEnergy.value.div(1e6), 0, 1)
  },
  {
    id: 238,
    name: "Age of Creation",
    description: "Unlock Hadron Continuum.",
    checkRequirement: () => DivinityMilestone.hadronEmpowerment.isReached,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(238).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.pelle.divinities).div(3), 0, 1)
  },
  {
    id: 241,
    name: "CERN",
    description: "Unlock the Large Hadron Collider.",
    checkRequirement: () => ExpansionPack.alphaPack.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(241).isUnlocked ? DC.D1 : Decimal.clamp(player.antimatter.max(10).log10().log10().div(200), 0, 1)
  },
  {
    id: 242,
    name: "Infinity Mach III",
    description: "Condense your Divine Stars.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CONDENSE_RESET_BEFORE,
    progress: () => Achievement(242).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineMatter.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 243,
    name: "Journey's End",
    description: "Unlock Celestial Eternity Plus.",
    checkRequirement: () => Currency.celestialEternityPoints.gte(DC.E1000),
    checkEvent: GAME_EVENT.CELESTIAL_ETERNITY_RESET_BEFORE,
    progress: () => Achievement(243).isUnlocked ? DC.D1 : Decimal.clamp(Currency.celestialEternityPoints.value.max(1).log10().div(1000), 0, 1)
  },
  {
    id: 244,
    name: "Hypernova",
    description: "Unlock all star types.",
    checkRequirement: () => EtherealStars.gray.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(244).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EtherealStars.all.filter(s => s.isUnlocked).length).div(9), 0, 1)
  },
  {
    id: 245,
    name: "Aleph Null",
    description: "Nullify the Void.",
    checkRequirement: () => player.endgame.largeHadronCollider.void.nullified,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(245).isUnlocked ? DC.D1 : Decimal.clamp(Currency.nullMatter.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 246,
    name: "Hyperthymesia",
    get description() { return `Get ${formatInt(1000)} total Ra Celestial Memory levels.` },
    checkRequirement: () => Ra.totalPetLevel >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Keep Glyph Sacrifice on Endgame.`;
    },
    progress: () => Achievement(246).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(Ra.totalPetLevel).div(1000), 0, 1)
  },
  {
    id: 247,
    name: "Core Collapse",
    description: "Go Supernova.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SUPERNOVA_RESET_BEFORE,
    get reward() {
      return `Reduce the time for Hadrons and Remnants of Alpha Decay to cap by ${formatPercents(0.5)}.`;
    },
    effect: () => player.disablePostReality ? 1 : 2,
    progress: () => Achievement(247).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineStars.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 248,
    name: "Limits of Reality",
    get description() { return `Reach ${formatPostBreak(DC.E4000, 2)} Celestial Points of Eternity.` },
    checkRequirement: () => player.endgame.celDimExpansion.celestialEternityPoints.gte(DC.E4000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(248).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialEternityPoints.add(1).log10().div(4000), 0, 1)
  },
  {
    id: 251,
    name: "Eternal Bondage",
    description: "Curse your Reality.",
    checkRequirement: () => Slabdrill.isCursed,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(251).isUnlocked ? DC.D1 : Decimal.clamp(player.endgame.celDimExpansion.celestialEternityPoints.add(1).log10().div(4000), 0, 1)
  },
  {
    id: 252,
    name: "Broken Simulation",
    description: "Perform your first Dimboost in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.dimensionBoosts.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(252).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(12), 0, 1))
  },
  {
    id: 253,
    name: "Cosmic Chains",
    description: "Create your first Galaxy in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.galaxies.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(253).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(130), 0, 1))
  },
  {
    id: 254,
    name: "Altered Overload",
    description: "Reach Infinity in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.infinities.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(254).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 255,
    name: "Breaking Destruction",
    description: "Break Infinity in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.break && !Slabdrill.coreActive,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(255).isUnlocked ? DC.D1 : (!Slabdrill.isCursed || Slabdrill.coreActive ? DC.DM1 : Decimal.clamp(Decimal.log2(1500).sub(new Decimal(player.auto.bigCrunch.interval).div(100).log2()).div(Decimal.log2(1500)), 0, 1))
  },
  {
    id: 256,
    name: "Eternal Slavery",
    description: "Reach Eternity in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.eternities.gte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(256).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.infinityPoints.add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 257,
    name: "Amplified Suffering",
    description: "Dilate Time in Slabdrill's Reality.",
    checkRequirement: () => Slabdrill.isCursed && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(257).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(new Decimal(EternityChallenge(11).completions).div(20).min(0.25).add(new Decimal(EternityChallenge(12).completions).div(20).min(0.25)).add(player.timestudy.maxTheorem.div(51600).min(0.25)).add(player.timestudy.theorem.div(20000).min(0.25)), 0, 1))
  },
  {
    id: 258,
    name: "Hevipelle Counted to Nine",
    description: "Destroy Slabdrill.",
    checkRequirement: () => Slabdrill.isCursed && player.antimatter.gte(DC.ENUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock the Ninth Dimension.`;
    },
    progress: () => Achievement(258).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 261,
    name: ["False", "Deity", "Monarch"],
    description: "Become a Celestial.",
    checkRequirement: () => player.celestials.slabdrill.hasBoughtNinthDimension && player.endgame.creditsTick > 0 && !player.endgame.credits,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain ${formatX(10)} more Condenses.`;
    },
    effect: () => player.disablePostReality ? 1 : 10,
    progress: () => Achievement(261).isUnlocked ? DC.D1 : (!Slabdrill.isCursed ? DC.DM1 : Decimal.clamp(player.antimatter.add(1).log10().add(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1))
  },
  {
    id: 262,
    name: "The End is where we Begin",
    description: "Uncap Divine Matter.",
    checkRequirement: () => DivinityUpgrade.divineL4U5.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(262).isUnlocked ? DC.D1 : Decimal.clamp(player.celestials.pelle.divinity.nebulae.div(100), 0, 1)
  },
  {
    id: 263,
    name: "Our Prestige Layer is in another castle!",
    get description() { return `Reach ${format(DC.NUMMAX, 1, 0)} Dual Machines.` },
    checkRequirement: () => Currency.dualMachines.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(263).isUnlocked ? DC.D1 : Decimal.clamp(Currency.dualMachines.value.max(1).log10().div(Decimal.log10(DC.NUMMAX)), 0, 1)
  },
  {
    id: 264,
    name: "Dominion begins here",
    get description() { return `Collect ${formatInt(10)} Celestial Runes.` },
    checkRequirement: () => false,//Currency.celestialRunes.gte(10),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Unlock Your Reality.`;
    },
    progress: () => Achievement(264).isUnlocked ? DC.D1 : Decimal.clamp(DC.D0.div(10), 0, 1)
  },
  {
    id: 265,
    name: "Blank Space",
    get description() { return `Obtain ${format(1e20, 2, 2)} Null Particles.` },
    checkRequirement: () => Currency.nullParticles.gte(1e20),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(265).isUnlocked ? DC.D1 : Decimal.clamp(Currency.nullParticles.value.max(1).log10().div(20), 0, 1)
  },
  {
    id: 266,
    name: "Postmortal",
    description: "Ascend.",
    checkRequirement: () => player.endgame.ascension >= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(266).isUnlocked ? DC.D1 : Decimal.clamp(Currency.divineEnergy.value.max(1).log10().div(66000).min(0.5).add(new Decimal(86400000).sub(Ascensions.ipA.timeRemaining).div(172800000).min(0.5)), 0, 1)
  },
  {
    id: 267,
    name: "Supreme Deity",
    get description() { return `Reach ${formatInt(10)} Divinities.` },
    checkRequirement: () => player.celestials.pelle.divinities >= 10,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(267).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.pelle.divinities).div(10), 0, 1)
  },
  {
    id: 268,
    name: "True Power",
    description: "Unlock the Overcharge.",
    checkRequirement: () => player.endgame.ascension >= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Automatically update record Teresa ${player.universes.current === 2 ? "Matter" : "Antimatter"} to your current ${player.universes.current === 2 ? "Matter" : "Antimatter"} amount.`;
    },
    progress: () => Achievement(267).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.endgame.ascension).div(6), 0, 1)
  },
  {
    id: 271,
    name: "Multiversal Breach",
    description: "Unlock Universes.",
    checkRequirement: () => player.celestials.pelle.divinities >= 13,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(271).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.pelle.divinities).div(13), 0, 1)
  },
  {
    id: 272,
    name: "Don't make me tell you again... TIME IS RELATIVE",
    description: "Compress Time.",
    checkRequirement: () => player.compression.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(272).isUnlocked ? DC.D1 : Decimal.clamp(EndgameMastery.timeCompression.isBought ? 0.9999 : player.endgameMasteries.maxSkills.div(2e7).min(0.9998), 0, 1)
  },
  {
    id: 273,
    name: "Payoff",
    get description() { return `Complete ${formatInt(15)} Celestial Tasks.` },
    checkRequirement: () => false,//player.celestialPlus.completedTasks >= 15,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Double Celestial Rune gain from all sources.`;
    },
    effect: 2,
    progress: () => Achievement(273).isUnlocked ? DC.D1 : Decimal.clamp(DC.D0.div(15), 0, 1)
  },
  {
    id: 274,
    name: "Covalent Bonding",
    get description() { return `Obtain ${formatInt(200)} Hadrons.` },
    checkRequirement: () => player.celestials.laitela.hadrons.trueTotal >= 200,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(274).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(player.celestials.laitela.hadrons.trueTotal).div(200), 0, 1)
  },
  {
    id: 275,
    name: "Quantum Mechanics",
    description: "Purchase all the Entanglement Masteries.",
    checkRequirement: () => EndgameMastery.boughtEM().countWhere(e => e.id > 280 && e.id < 310) >= 9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(275).isUnlocked ? DC.D1 : Decimal.clamp(new Decimal(EndgameMastery.boughtEM().countWhere(e => e.id > 280 && e.id < 310)).div(9), 0, 1)
  },
  {
    id: 276,
    name: "Claustrophilic",
    get description() { return `Reach ${formatPostBreak("1e100000000")} ${player.universes.current === 2 ? "matter" : "antimatter"} while Compressed.` },
    checkRequirement: () => Currency.antimatter.value.add(1).log10().gte(1e8) && player.compression.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain ${formatX(2)} Thermal Radiation and Endgame Skills while Compressed.`;
    },
    effect: () => player.disablePostReality ? 1 : (player.compression.active ? 2 : 1),
    progress: () => Achievement(276).isUnlocked ? DC.D1 : (!player.compression.active ? DC.DM1 : Decimal.clamp(player.antimatter.max(1).log10().div(1e8), 0, 1))
  },
  {
    id: 277,
    name: "Diese Errungenschaft existiert nicht V",
    get description() { return `Reach ${formatPostBreak(DC.D9_99999E999, 5, 0)} Dual Machines.` },
    checkRequirement: () => player.reality.dualMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Gain ${formatPow(1.5, 1, 1)} more Singularities.`;
    },
    effect: () => player.disablePostReality ? 1 : 1.5,
    progress: () => Achievement(277).isUnlocked ? DC.D1 : Decimal.clamp(player.reality.dualMachines.max(1).log10().div(1000), 0, 1)
  },
  {
    id: 278,
    name: "You shouldn't have done that",
    get description() { return `Obtain ${format(1e15, 2, 2)} Endgame Skills.` },
    checkRequirement: () => player.endgameMasteries.skills.gte(1e15),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    progress: () => Achievement(278).isUnlocked ? DC.D1 : Decimal.clamp(player.endgameMasteries.skills.div(1e15), 0, 1)
  },
];
