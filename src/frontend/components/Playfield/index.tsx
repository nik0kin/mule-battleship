import * as React from 'react';
import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import './style.css';
import { GameState } from '../../types';
import {
  Alignment, Coord, doesShipIdExistInShipPlacements,
  getAllShips, getInvalidShipPlacements, getPlaceShipsParamsFromAction, getShotOnSquare,
  getShipOnSquare,
  Ship, ShipPlacement, ShipStructure, ShipStructures,
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
  const gridSize: Coord = { x: gameState.width, y: gameState.height };

  const collidingShips: boolean = false; // temp

  let invalidShipPlacements: ShipPlacement[] = [];

  if (gameState.isPlacementMode) {
    const shipPlacements: ShipPlacement[] = getPlaceShipsParamsFromAction(pendingActions[0]).shipPlacements;
    invalidShipPlacements = getInvalidShipPlacements(gameState.yourLobbyPlayerId, gridSize, gameState.yourShips, shipPlacements);
  }

  const yourShipsAndPendingShipPlacements = getAllShips(gameState.yourLobbyPlayerId, gameState.yourShips, pendingActions);

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
        {getGrid(gameState.yourLobbyPlayerId, gridSize, yourShipsAndPendingShipPlacements, invalidShipPlacements, gameState.theirShots, clickSquare, undefined)}

        <div className="hint">
          Click the ship on the left, then click a spot on your grid, click again to rotate

          {!!invalidShipPlacements.length && <div>
            Fix colliding ships before you submit your ship placements.
          </div>}
        </div>
      </div>
      <div className={theirShipsClassNames}>
        {getGrid(gameState.theirLobbyPlayerId, gridSize, gameState.theirShips, [], gameState.yourShots, clickSquare, selectedCoord)}
      </div>
    </div>
  );
}

export default Playfield;


function getGrid(
  lobbyPlayerId: string,
  gridSize: Coord,
  ships: Ship[],
  invalidShipPlacements: ShipPlacement[],
  opponentShots: Shot[],
  clickSquare: ClickSquareFn,
  selectedCoord?: Coord
) {
  let gridHtml: Array<JSX.Element> = [];
  _.times(gridSize.y + 1, (i) => {
    gridHtml.push(getRow(lobbyPlayerId, gridSize, i, ships, invalidShipPlacements, opponentShots, clickSquare, selectedCoord));
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
  invalidShipPlacements: ShipPlacement[],
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

    const possibleShip: Ship | undefined = getShipOnSquare(gridSize, coord, ships);
    if (possibleShip) {
      _class += 'ship ';

      const isCollided: boolean = doesShipIdExistInShipPlacements(invalidShipPlacements, possibleShip.id);
      _class += isCollided ? 'collision ' : '';
    }

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


