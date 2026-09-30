<script>
export default {
  name: "AntimatterDimensionProgressBar",
  data() {
    return {
      fill: 0,
      tooltip: "",
      displayPercents: "",
    };
  },
  computed: {
    progressBarStyle() {
      return {
        width: `${(this.fill * 100).toFixed(2)}%`
      };
    }
  },
  methods: {
    // eslint-disable-next-line complexity
    update() {
      this.displayPercents = formatPercents(this.fill, 2);
      const setProgress = (current, goal, tooltip) => {
        this.fill = Decimal.clampMax(current.pLog10().div(Decimal.log10(goal)), 1).toNumber();
        this.tooltip = tooltip;
      };
      const setLinearProgress = (current, goal, tooltip) => {
        this.fill = Math.clampMax(current / goal, 1);
        this.tooltip = tooltip;
      };

      // Goals for challenges and challenge-like runs should come first because numbers will always be much smaller
      // than normal and therefore default filling won't be meaningful. Since challenges get completed or abandoned from
      // the inside outwards, we show the goals in that priority as well. It only makes sense to check cel6 and not the
      // others because pre-cel3 completion it'll default to e4000 and cel4/5 don't have meaningful single goals
      const inSpecialRun = (Player.isInAntimatterChallenge || EternityChallenge.isRunning || player.dilation.active ||
        player.compression.active || Laitela.isRunning) && !Pelle.isDoomed && !player.antimatter.gte(DC.E9E15);
      if (inSpecialRun) {
        if (Player.isInAntimatterChallenge) {
          setProgress(Currency.antimatter.value, Player.antimatterChallenge.goal, "Percentage to Challenge goal");
        } else if (EternityChallenge.isRunning) {
          if (Perk.studyECBulk.isBought) {
            // Note: If the EC is fully complete, this prop doesn't exist
            const goal = EternityChallenge.current.gainedCompletionStatus.nextGoalAt;
            if (goal) {
              setProgress(Currency.infinityPoints.value, goal, "Percentage to next Challenge completion");
            } else {
              // In a fully completed EC, there's nothing useful we can show so we just pin it at 100% and say so
              setProgress(Currency.infinityPoints.value, 10, "This Challenge is already fully completed!");
            }
          } else {
            setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to Eternity Challenge goal");
          }
        } else if (player.dilation.active && !Pelle.isDoomed) {
          if (player.dilation.lastEP.gt(0)) {
            setProgress(Currency.antimatter.value, getTachyonReq(), "Percentage to gain more TP in Dilation");
          } else {
            setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to Eternity in Dilation");
          }
        } else if (player.compression.active) {
          if (player.antimatter.gte(DC.NUMMAX)) {
            setProgress(Currency.antimatter.value, getHawkingRadiationReq(), "Percentage to gain more HR in Compression");
          } else {
            setProgress(Currency.antimatter.value, Player.infinityGoal, "Percentage to Infinity");
          }
        } else {
          // Lai'tela destabilization; since the progress bar is logarithmically-scaled, we need to pow10 the arguments
          setProgress(Decimal.pow10(player.celestials.laitela.entropy), 10, "Percentage to Destabilized Reality");
        }
      } else if (Alpha.isRunning) {
        if (player.celestials.alpha.stage === 27) {
          setProgress(Currency.eternityPoints.value, DC.E4000, "Percentage to Reality");
        } else if (player.celestials.alpha.stage === 26) {
          setLinearProgress(Math.min(DilationTimeStudyState.studies.filter(u => u.isBought).length / 12, 1/3) +
            player.timestudy.theorem.div(3e9).min(1/3).toNumber() +
            Currency.eternityPoints.value.add(1).log10().div(10050).min(1/3).toNumber(), 1, "Percentage to the eighth Time Dimension");
        } else if (player.celestials.alpha.stage === 25) {
          setProgress(Currency.dilatedTime.value, DC.E15, "Percentage to unlocking Time Theorem generation");
        } else if (player.celestials.alpha.stage === 24) {
          setProgress(player.dilation.active ? Currency.infinityPoints.value : DC.D1, DC.NUMMAX,
          "Percentage to performing a Dilated Eternity");
        } else if (player.celestials.alpha.stage === 23) {
          setLinearProgress(player.timestudy.maxTheorem.div(38700).min(1/3).toNumber() +
            player.timestudy.theorem.div(30000).min(1/3).toNumber() +
            Math.min((EternityChallenge(11).completions + EternityChallenge(12).completions) / 30, 1/3), 1,
            "Percentage to unlocking Time Dilation");
        } else if (player.celestials.alpha.stage === 22) {
          setLinearProgress((EternityChallenge(11).isRunning ? Currency.infinityPoints.value.add(1).log10().div(
            EternityChallenge(11).currentGoal.log10()).toNumber() : 0), 1, "Percentage to completing Eternity Challenge 11");
        } else if (player.celestials.alpha.stage === 21) {
          setLinearProgress(player.timestudy.maxTheorem.toNumber(), 2214, "Percentage to unlocking Eternity Challenge 11");
        } else if (player.celestials.alpha.stage === 20) {
          setLinearProgress(((TimeStudy(181).isBought && EternityChallenge(10).completions >= 1) ?
            player.timestudy.theorem.toNumber() : 0), 730, "Percentage to Time Study 192");
        } else if (player.celestials.alpha.stage === 19) {
          setLinearProgress(Math.min(TimeStudy(181).isBought ? player.timestudy.theorem.toNumber() / 1100 : 0, 0.5) +
            (EternityChallenge(10).isRunning ? Currency.infinityPoints.value.add(1).log10().div(
            EternityChallenge(10).currentGoal.log10().times(2)).min(0.5).toNumber() : 0), 1,
            "Percentage to completing Eternity Challenge 10 once");
        } else if (player.celestials.alpha.stage === 18) {
          setLinearProgress(TimeStudy(171).isBought ? player.timestudy.theorem.toNumber() : 0, 200, "Percentage to Time Study 181");
        } else if (player.celestials.alpha.stage === 17) {
          let ec = [];
          for (let c = 1; c < 13; c++) {
            ec.push(EternityChallenge(c).completions);
          }
          let maxC = ec.reduce(Decimal.maxReducer).toNumber();
          let maxEC = EternityChallenges.all.first(c => c.completions === maxC);
          setLinearProgress(Math.min(maxEC.completions / 8, 0.5) +
            (maxEC.isRunning ? Currency.infinityPoints.value.add(1).log10().div(
            maxEC.currentGoal.log10().times(2)).min(0.5).toNumber() : 0), 1, "Percentage to completing any Eternity Challenge five times");
        } else if (player.celestials.alpha.stage === 16) {
          setLinearProgress(EternityChallenge(player.challenge.eternity.current)
            ? Currency.eternityPoints.value.add(1).log10().div(
              EternityChallenge(player.challenge.eternity.current).currentGoal.log10()).toNumber()
            : 0, 1, "Percentage to completing an Eternity Challenge once");
        } else if (player.celestials.alpha.stage === 15) {
          setLinearProgress(player.timestudy.maxTheorem.toNumber(), 115, "Percentage to 115 Time Theorems");
        } else if (player.celestials.alpha.stage === 14) {
          setLinearProgress(Currency.eternityPoints.value.toNumber(), 50000, "Percentage to the third Eternity Upgrade");
        } else if (player.celestials.alpha.stage === 13) {
          setLinearProgress(Currency.eternityPoints.value.toNumber(), 1000, "Percentage to the fourth Time Dimension");
        } else if (player.celestials.alpha.stage === 12) {
          setLinearProgress(player.timestudy.maxTheorem.toNumber(), 17, "Percentage to Time Study 61");
        } else if (player.celestials.alpha.stage === 11) {
          setProgress(Currency.infinityPoints.value, DC.NUMMAX, "Percentage to Eternity");
        } else if (player.celestials.alpha.stage === 10) {
          setProgress(Currency.antimatter.value, DC.E60000, "Percentage to unlocking the eighth Infinity Dimension");
        } else if (player.celestials.alpha.stage === 9) {
          setProgress(Currency.infinityPoints.value, DC.E140, "Percentage to unlocking Replicanti");
        } else if (player.celestials.alpha.stage === 8) {
          setLinearProgress(InfinityChallenges.all.countWhere(u => u.isCompleted), 8, "Percentage to Completing all Infinity Challenges");
        } else if (player.celestials.alpha.stage === 7) {
          setLinearProgress(BreakInfinityUpgrade.all.countWhere(u => u.isBought) +
            player.infinityRebuyables.sum(), 54, "Percentage to Purchasing all Break Infinity Upgrades");
        } else if (player.celestials.alpha.stage === 6) {
          setProgress(Currency.infinityPoints.value, new Decimal(5e14), "Percentage to Strengthening Galaxies");
        } else if (player.celestials.alpha.stage === 5) {
          setLinearProgress(1 / Math.log10(player.auto.bigCrunch.interval / 10), 1, "Percentage to Break Infinity");
        } else if (player.celestials.alpha.stage === 4) {
          setLinearProgress(Currency.infinities.value.div(32).min(0.5).toNumber() +
            (NormalChallenge(12).isRunning ? Currency.antimatter.value.add(1).log10().div(
            Decimal.log10(DC.NUMMAX).times(2)).min(0.5).toNumber() : 0), 1, "Percentage to completing the Big Crunch Autobuyer Challenge");
        } else if (player.celestials.alpha.stage === 3) {
          setProgress(Currency.antimatter.value, DC.NUMMAX, "Percentage to Infinity");
        } else if (player.celestials.alpha.stage === 2) {
          setProgress(Currency.antimatter.value, DC.E130, "Percentage to first Galaxy");
        } else if (player.celestials.alpha.stage === 1) {
          setProgress(Currency.antimatter.value, DC.E40, "Percentage to fifth Dimboost");
        } else {
          setLinearProgress(Currency.antimatter.value.add(1).log10().div(60).min(0.5).toNumber() +
            player.dimensionBoosts.div(6).min(0.5).toNumber(), 1, "Percentage to fourth Dimboost");
        }
      } else if (Pelle.isDoomed) {
        if (Alpha.isDestroyedForDisplay) {
          setProgress(Currency.antimatter.value.add(1).log10(), DC.NUMMAX, "Percentage to Divinity");
        } else if (ExpansionPacks.areUnlocked && ExpansionPacks.nextPackUnlockAM === undefined) {
          setProgress(gainedCelestialPoints(), DC.NUMMAX, "Percentage to Celestial Point Cap");
        } else if (ExpansionPacks.areUnlocked) {
          setProgress(new Decimal(Currency.antimatter.value.add(1).log10()), new Decimal(Decimal.log10(ExpansionPacks.nextPackUnlockAM)),
            "Percentage to next Expansion Pack");
        } else if (GalaxyGenerator.galaxies.gt(1e15)) {
          setLinearProgress(GalaxyGenerator.galaxies.toNumber(), Math.pow(2, 64), "Percentage to Expansion Packs");
        } else if (PelleRifts.recursion.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies.gt(0)) {
          setProgress(new Decimal(Currency.antimatter.value.add(1).log10()), new Decimal(9e15), "Percentage to Endgame");
        } else if (PelleStrikes.dilation.hasStrike) {
          setProgress(Currency.eternityPoints.value, DC.E4000, "Percentage to Galaxy Generator");
        } else if (PelleStrikes.ECs.hasStrike) {
          setLinearProgress(
            (Math.min(Currency.timeTheorems.max.toNumber() / 12900, 1) +
            Math.min(EternityChallenges.completions / 60, 1)) / 2,
            1, "Percentage to fifth Strike");
        } else if (PelleStrikes.eternity.hasStrike) {
          setLinearProgress(Currency.timeTheorems.max.toNumber(), 115, "Percentage to fourth Strike");
        } else if (PelleStrikes.powerGalaxies.hasStrike) {
          setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to third Strike");
        } else if (PelleStrikes.infinity.hasStrike) {
          if (player.break) {
            setProgress(Currency.infinityPoints.value, 5e11, "Percentage to second Strike");
          } else {
            setProgress(Currency.antimatter.value, DC.NUMMAX, "Percentage to Infinity");
          }
        } else {
          setProgress(Currency.antimatter.value, DC.NUMMAX, "Percentage to first Strike");
        }
      } else if (PlayerProgress.celestialEternityUnlocked()) {
        // Show all other goals from the top down, starting at features in the highest prestige layer
        setProgress(Currency.celestialEternityPoints.value, DC.E4000, player.celestials.slabdrill.isWarping
          ? "Percentage to Cursed Reality" : "Percentage to Pelle's Domain");
      } else if (player.endgame.celDimExpansion.isBroken) {
        setProgress(Currency.celestialInfinityPoints.value, DC.NUMMAX, "Percentage to Celestial Eternity");
      } else if (Alpha.isDestroyedForDisplay) {
        setLinearProgress(Currency.celestialInfinityPoints.value.toNumber(), 10000, "Percentage to Celestial Breaking of Infinity");
      } else if (MachineHandler.baseDMCap.gt(0)) {
        setLinearProgress(player.celestials.alpha.stage, 28, "Percentage to destroying Alpha");
      } else if (Alpha.isUnlocked) {
        setProgress(Currency.imaginaryMachines.value, DC.E1000, "Percentage to Duality");
      } else if (GalacticPower.isUnlocked && GalacticPower.nextPowerUnlockGP === undefined) {
        setProgress(Currency.imaginaryMachines.value, DC.NUMMAX, "Percentage to Alpha");
      } else if (GalacticPower.isUnlocked) {
        setProgress(Currency.galacticPower.value, GalacticPower.nextPowerUnlockGP, "Percentage to the next Galactic Power");
      } else if (Currency.antimatter.value.gte(DC.E9E15)) {
        setProgress(Currency.singularities.value, DC.E300, "Percentage to Galactic Power");
      } else if (Enslaved.isCompleted) {
        setProgress(Currency.infinityPoints.value, Tesseracts.nextCost, "Percentage to next Tesseract");
      } else if (PlayerProgress.dilationUnlocked()) {
        setProgress(Currency.eternityPoints.value, DC.E4000, "Percentage to Reality");
      } else if (InfinityDimension(8).isUnlocked) {
        setProgress(Currency.infinityPoints.value, Player.eternityGoal, "Percentage to Eternity");
      } else if (player.break) {
        const text = `Percentage to unlock a new ${InfinityDimensions.next().hasIPUnlock
          ? "type of Dimension"
          : "Infinity Dimension"}`;
        const nextID = InfinityDimensions.next();
        if (nextID.ipRequirementReached) {
          setProgress(player.records.thisEternity.maxAM, nextID.amRequirement, text);
        } else {
          setProgress(player.infinityPoints, nextID.ipRequirement, text);
        }
      } else {
        setProgress(Currency.antimatter.value, DC.NUMMAX, "Percentage to Infinity");
      }
    }
  }
};
</script>

<template>
  <div class="c-progress-bar">
    <div
      :style="progressBarStyle"
      class="c-progress-bar__fill"
    >
      <span
        v-tooltip="tooltip"
        class="c-progress-bar__percents"
      >
        {{ displayPercents }}
      </span>
    </div>
  </div>
</template>
