import { EndgameMasteryConnectionSetup } from "./EndgameMasteryConnection";
import { EndgameMasterySetup } from "./EndgameMasteryButton";

class EndgameMasteryRow {
  constructor(layout, items, isWide) {
    this.layout = layout;
    this.items = items;
    this.isWide = isWide;
  }

  get width() {
    const itemCount = this.items.length;
    const layout = this.layout;
    return itemCount * layout.itemWidth + (itemCount - 1) * layout.spacing;
  }

  itemPosition(column, treeLayout) {
    const layout = this.layout;
    const treeWidth = treeLayout.width;
    const rowLeft = (treeWidth - this.width) / 2;
    return rowLeft + column * layout.itemWidth + column * layout.spacing;
  }
}

class EndgameMasteryRowLayout {
  constructor(props) {
    this.itemWidth = props.itemWidth;
    this.itemHeight = props.itemHeight;
    this.spacing = props.spacing;
  }
}

export class EndgameMasteryTreeLayout {
  constructor(type, scaling = 1) {
    this.spacing = 4 * scaling;

    const normalRowLayout = new EndgameMasteryRowLayout({
      itemWidth: 18 * scaling,
      itemHeight: 10 * scaling,
      spacing: 3 * scaling
    });

    const wideRowLayout = new EndgameMasteryRowLayout({
      itemWidth: 12 * scaling,
      itemHeight: 10 * scaling,
      spacing: 0.6 * scaling
    });
    const normalRow = (...items) => new EndgameMasteryRow(normalRowLayout, items);
    const wideRow = (...items) => new EndgameMasteryRow(wideRowLayout, items, true);

    const EM = id => (EndgameMastery(id).isUnlocked ? EndgameMastery(id) : null);

    /**
     * @type {EndgameMasteryRow[]}
     */
    /* eslint-disable no-multi-spaces, space-in-parens, func-call-spacing */
    this.rows = [
      normalRow(                       null,   EM(11),   null                         ),
      normalRow(                           EM(21), EM(22)                             ),
      normalRow(                           EM(31), EM(32)                             ),
      normalRow(                           EM(41), EM(42)                             ),
      normalRow(                       EM(51), EM(52), EM(53)                         ),
      normalRow(                               EM(61)                                 ),
      normalRow(                               EM(71)                                 ),
      normalRow(                  EM(81),  EM(82),  EM(83),  EM(84)                   ),
      normalRow(                  EM(91),  EM(92),  EM(93),  EM(94)                   ),
      normalRow(                EM(101),  EM(102),  EM(103),  EM(104)                 ),
      normalRow(                        null,  EM(111),  EM(112)                      ),
      normalRow(                          EM(121), EM(122)                            ),
      normalRow(                               EM(131)                                ),
      normalRow(                EM(141),  EM(142),  EM(143),  EM(144)                 ),
      normalRow(                EM(151),  EM(152),  EM(153),  EM(154)                 ),
      normalRow(                               EM(161)                                ),
      normalRow(                               EM(171)                                ),
      normalRow(                    EndgameMastery.endgameUpgrades                    )
    ];

    if (ResurgenceUpgrade.unl1.isBought) {
      this.rows.push(
        normalRow(                   EndgameMastery.permaMasteries                    ),
        normalRow(                              EM(181)                               ),
        normalRow(                          EM(191), EM(192)                          ),
        normalRow(                              EM(201)                               ),
        normalRow(                     EM(211), EM(212), EM(213)                      ),
        normalRow(                     EM(221), EM(222), EM(223)                      ),
        normalRow(                     EM(231), EM(232), EM(233)                      ),
        normalRow(                              EM(241)                               ),
        normalRow(                              EM(251)                               ),
        normalRow(                          EM(261), EM(262)                          ),
        normalRow(                 EM(271), EM(272), EM(273), EM(274)                 ),
        normalRow(                   EndgameMastery.timeCompression                   )
      );
    }

    if (EndgameMastery.timeCompression.isBought) {
      this.rows.push(
        normalRow(                     EM(281), EM(282), EM(283)                      ),
        normalRow(                     EM(291), EM(292), EM(293)                      ),
        normalRow(                     EM(301), EM(302), EM(303)                      ),
        normalRow(                  EndgameMastery.celestialReality                   )
      );
    }
    /* eslint-enable no-multi-spaces, space-in-parens, func-call-spacing */

    /**
     * @type {EndgameMasterySetup[]}
     */
    this.masteries = [];
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.items.length; columnIndex++) {
        const mastery = row.items[columnIndex];
        if (mastery === null) continue;
        const setup = new EndgameMasterySetup({
          mastery,
          row: rowIndex,
          column: columnIndex
        });
        if (row.isWide) {
          setup.isSmall = true;
        }
        this.masteries.push(setup);
      }
    }

    /**
     * @type {EndgameMasteryConnectionSetup[]}
     */
    this.connections = masteryConnections().map(c => new EndgameMasteryConnectionSetup(c));

    this.width = this.rows.map(row => row.width).max();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).sum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (const mastery of this.masteries) {
      mastery.setPosition(this);
    }

    for (const connection of this.connections) {
      connection.setPosition(this.masteries, this.width, this.height);
    }
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).sum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static create(type, scaling = 1) {
    if (this._instances === undefined) {
      this._instances = [];
    }
    const layout = new EndgameMasteryTreeLayout(type, scaling);
    this._instances[`${type}__${scaling}`] = layout;
    return layout;
  }
}

export const MASTERY_TREE_LAYOUT_TYPE = {
  NORMAL: 0,
  get current() {
    return this.NORMAL;
  }
};
