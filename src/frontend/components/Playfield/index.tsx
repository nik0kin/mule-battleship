import * as React from 'react';
import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import './style.css';
import { GameState } from '../../types';
import {
  Alignment,
  Coord, getAllShips, getShotOnSquare,
  isAnyShipOnSquare,
  Ship, ShipStructure, ShipStructures,
  numberToLetter, Shot,
} from '../../../shared';

type ClickSquareFn = (lobbyPlayerId: string, coord: Coord) => void;

export interface Props {
  selectedCoord?: Coord;
  selectedShipBeingPlaced?: number;
  gameState: GameState;
  pendingActions: Action[];

  clickSquare: ClickSquareFn;
}

function Playfield({ gameState, selectedCoord, selectedShipBeingPlaced, pendingActions, clickSquare }: Props) {
  const gridSize: Coord = { x: 10, y: 10 }; // TODO dont hardcode gridSize

  const collidingShips: boolean = false; // temp

  const yourShipsAndPendingShipPlacements = getAllShips('p1', gameState.yourShips, pendingActions);

  let yourShipsClassNames: string = 'your-ships ';
  let theirShipsClassNames: string = 'their-ships ';

  if (gameState.isPlacementMode && selectedShipBeingPlaced ) {
    yourShipsClassNames += 'placing-ships';
  }

  if (!gameState.isPlacementMode) {
    theirShipsClassNames += 'shooting-ships';
  }

  return (
    <div className="Playfield">
      <div className={yourShipsClassNames}>
        {getGrid('p1', gridSize, yourShipsAndPendingShipPlacements, gameState.theirShots, clickSquare, undefined)}

        <div className="hint">
          Click the ship on the left, then click a spot on your grid, click again to rotate

          {collidingShips && <div>
            Fix colliding ships before you submit your ship placements.
          </div>}
        </div>
      </div>
      <div className={theirShipsClassNames}>
        {getGrid('p2', gridSize, gameState.theirShips, gameState.yourShots, clickSquare, selectedCoord)}
      </div>
    </div>
  );
}

export default Playfield;


function getGrid(
  lobbyPlayerId: string,
  gridSize: Coord,
  ships: Ship[],
  opponentShots: Shot[],
  clickSquare: ClickSquareFn,
  selectedCoord?: Coord
) {
  let gridHtml: Array<JSX.Element> = [];
  _.times(gridSize.y + 1, (i) => {
    gridHtml.push(getRow(lobbyPlayerId, gridSize, i, ships, opponentShots, clickSquare, selectedCoord));
  });
  return (
    <table>
      <tbody>
        {gridHtml}
      </tbody>
    </table>
  );
}

function getRow(
  lobbyPlayerId: string,
  gridSize: Coord,
  y: number,
  ships: Ship[],
  opponentShots: Shot[],
  clickSquare: ClickSquareFn,
  selectedCoord?: Coord
) {
  let rowHtml: Array<JSX.Element> = [];
  _.times(gridSize.x + 1, (x) => {
    const coord: Coord = { x: x - 1, y: y - 1 };
    let _class: string = y === 0 ? 'top ' : '';
    _class += x === 0 ? 'left ' : '';
    let cellContent: string = _class === 'top ' ? String(x) : _class ===  'left ' ? numberToLetter(y) : '';

    _class += isAnyShipOnSquare(gridSize, coord, ships) ? 'ship ' : '';

    if (selectedCoord) {
      _class += coord.x === selectedCoord.x && coord.y === selectedCoord.y ? 'selected ' : '';
    }

    const possibleShot: Shot | undefined = getShotOnSquare(coord, opponentShots);
    if (possibleShot) {
      _class += possibleShot.hit ? 'hit-shot' : 'miss-shot';
      cellContent = possibleShot.hit ? 'X' : '/';
    }

    function onClickSquare() {
      if (coord.x === -1 || coord.y === -1) return;
      clickSquare(lobbyPlayerId, coord);
    }

    rowHtml.push(
      <td className={_class} onClick={onClickSquare} key={'cell' + x + ',' + y}>
        {cellContent}
      </td>
    );
  });
  return (
    <tr key={'row' + y}>
      {rowHtml}
    </tr>
  );
}


