import { EndgameMastery } from "./endgame-mastery";
import { PermanentEndgameMastery } from "./permanent-endgame-mastery";

export class EndgameMasteryConnection {
  constructor(from, to, override) {
    this._from = from;
    this._to = to;
    this._override = override;
  }

  get from() {
    return this._from;
  }

  get to() {
    return this._to;
  }

  get isOverridden() {
    return this._override !== undefined && this._override();
  }

  get isSatisfied() {
    return this.isOverridden || this._from.isBought;
  }
}

/**
 * @type {EndgameMasteryConnection[]}
 */
export function masteryConnections() {
  const EM = id => EndgameMastery(id);
  const PEM = id => PermanentEndgameMastery(id);
  let connections = [
    [EM(11), EM(21)],
    [EM(11), EM(22)],
  
    [EM(21), EM(31)],
    [EM(22), EM(32)],
  
    [EM(31), EM(41)],
    [EM(32), EM(42)],
  
    [EM(41), EM(51)],
    [EM(41), EM(52)],
    [EM(42), EM(52)],
    [EM(42), EM(53)],
  
    [EM(52), EM(61)],
  
    [EM(61), EM(71)],
  
    [EM(71), EM(81)],
    [EM(71), EM(82)],
    [EM(71), EM(83)],
    [EM(71), EM(84)],
  
    [EM(81), EM(91)],
    [EM(82), EM(92)],
    [EM(83), EM(93)],
    [EM(84), EM(94)],
  
    [EM(91), EM(101)],
    [EM(92), EM(102)],
    [EM(93), EM(103)],
    [EM(94), EM(104)],
  
    [EM(101), EM(111)],
    [EM(102), EM(111)],
    [EM(103), EM(111)],
    [EM(104), EM(111)],
  
    [EM(111), EM(112)],
  
    [EM(111), EM(121)],
    [EM(111), EM(122)],
  
    [EM(121), EM(131)],
    [EM(122), EM(131)],
  
    [EM(131), EM(141)],
    [EM(131), EM(142)],
    [EM(131), EM(143)],
    [EM(131), EM(144)],
  
    [EM(141), EM(151)],
    [EM(142), EM(152)],
    [EM(143), EM(153)],
    [EM(144), EM(154)],
  
    [EM(151), EM(161)],
    [EM(152), EM(161)],
    [EM(153), EM(161)],
    [EM(154), EM(161)],
  
    [EM(161), EM(171)],
    [EM(171), PEM(1)]
  ];
  if (player.celestials.pelle.resurgenceUpgrades.has("unl1")) {
    connections.push(
      [PEM(1), PEM(2)],

      [PEM(2), EM(181)],

      [EM(181), EM(191)],
      [EM(181), EM(192)],

      [EM(191), EM(201)],
      [EM(192), EM(201)],

      [EM(201), EM(211)],
      [EM(201), EM(212)],
      [EM(201), EM(213)],

      [EM(211), EM(221)],
      [EM(212), EM(222)],
      [EM(213), EM(223)],

      [EM(221), EM(231)],
      [EM(222), EM(232)],
      [EM(223), EM(233)],

      [EM(231), EM(241)],
      [EM(232), EM(241)],
      [EM(233), EM(241)],

      [EM(241), EM(251)],

      [EM(251), EM(261)],
      [EM(251), EM(262)],

      [EM(261), EM(271)],
      [EM(261), EM(272)],
      [EM(262), EM(273)],
      [EM(262), EM(274)],

      [EM(271), PEM(3)],
      [EM(272), PEM(3)],
      [EM(273), PEM(3)],
      [EM(274), PEM(3)]
    );
  }
  if (player.endgameMasteries.permanentMasteries.includes(3)) {
    connections.push(
      [PEM(3), EM(281)],
      [PEM(3), EM(282)],
      [PEM(3), EM(283)],

      [EM(281), EM(291)],
      [EM(282), EM(292)],
      [EM(283), EM(293)],

      [EM(291), EM(301)],
      [EM(292), EM(302)],
      [EM(293), EM(303)],

      [EM(301), PEM(4)],
      [EM(302), PEM(4)],
      [EM(303), PEM(4)]
    );
  }
  connections = connections.map(props => new EndgameMasteryConnection(props[0], props[1], props[2]));

  return connections;
}
