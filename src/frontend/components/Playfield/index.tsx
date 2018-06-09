import * as React from 'react';
import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import './style.css';
import { GameState } from '../../types';
import {
  Coord, doesShipIdExistInShipPlacements, FireShotMuleActionMetaData,
  getAllShipsIncludingPendingActions, getBattleshipCoordString, getInvalidShipPlacements,
  getPlaceShipsParamsFromAction, getShotOnSquare,
  getShipOnSquare, isValidCoord,
  Ship, ShipPlacement,
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

  let invalidShipPlacements: ShipPlacement[] = [];

  if (gameState.isPlacementMode) {
    const shipPlacements: ShipPlacement[] = getPlaceShipsParamsFromAction(pendingActions[0]).shipPlacements;
    invalidShipPlacements = getInvalidShipPlacements(gameState.yourLobbyPlayerId, gridSize, gameState.yourShips, shipPlacements);
  }

  const yourShipsAndPendingShipPlacements: Ship[] = getAllShipsIncludingPendingActions(gameState.yourLobbyPlayerId, gameState.yourShips, pendingActions);

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
        {getGrid(
          gameState.isPlacementMode,
          gameState.yourLobbyPlayerId,
          gridSize,
          yourShipsAndPendingShipPlacements,
          invalidShipPlacements,
          gameState.theirShots,
          clickSquare,
          selectedShipBeingPlaced,
          undefined,
        )}

        <div className="hint">
          {getHintDescription(
            gameState.isPlacementMode,
            invalidShipPlacements.length > 0,
            gameState.mule.previousTurns[gameState.mule.currentTurn - 2].playerTurns[gameState.mule.isYourTurn ? gameState.theirLobbyPlayerId : gameState.yourLobbyPlayerId].actions[0], // TODO helper fn?
            !gameState.mule.isYourTurn,
          )}
        </div>
      </div>
      <div className={theirShipsClassNames}>
        {getGrid(
          gameState.isPlacementMode,
          gameState.theirLobbyPlayerId,
          gridSize,
          gameState.theirShips,
          [],
          gameState.yourShots,
          clickSquare,
          selectedShipBeingPlaced,
          selectedCoord,
        )}
      </div>
    </div>
  );
}

export default Playfield;


function getGrid(
  isPlacementMode: boolean,
  lobbyPlayerId: string,
  gridSize: Coord,
  ships: Ship[],
  invalidShipPlacements: ShipPlacement[],
  opponentShots: Shot[],
  clickSquare: ClickSquareFn,
  selectedShipBeingPlaced?: number,
  selectedCoord?: Coord
) {
  let gridHtml: Array<JSX.Element> = [];
  _.times(gridSize.y + 1, (i) => {
    gridHtml.push(getRow(
      isPlacementMode,
      lobbyPlayerId,
      gridSize,
      i,
      ships,
      invalidShipPlacements,
      opponentShots,
      clickSquare,
      selectedShipBeingPlaced,
      selectedCoord,
    ));
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
  isPlacementMode: boolean,
  lobbyPlayerId: string,
  gridSize: Coord,
  y: number,
  ships: Ship[],
  invalidShipPlacements: ShipPlacement[],
  opponentShots: Shot[],
  clickSquare: ClickSquareFn,
  selectedShipBeingPlaced?: number,
  selectedCoord?: Coord,
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
      _class += possibleShot.hit ? 'hit-shot ' : 'miss-shot ';
      cellContent = possibleShot.hit ? 'X' : '/';
    }

    const isClickable: boolean = isValidCoord(coord, gridSize) && isPlacementMode && (!!selectedShipBeingPlaced || !!possibleShip)/* TODO  non placement mode logic || () */;
    _class += isClickable ? 'clickable ' : '';

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

function getHintDescription(
  isPlacementMode: boolean,
  hasInvalidShipPlacements: boolean,
  lastAction: Action,
  waslastTurnByPlayer: boolean,
): JSX.Element {
  const fireShotMeta: FireShotMuleActionMetaData = lastAction.metadata as any as FireShotMuleActionMetaData;

  return (
    <div>
      {isPlacementMode && <span>Click the ship on the left, then click a spot on your grid, click again to rotate</span>}
    
      {!isPlacementMode && waslastTurnByPlayer &&
        <span>
          {fireShotMeta.newShot.hit && <span> Your Shot HIT a Ship at {getBattleshipCoordString(fireShotMeta.newShot.coord)}! </span>}
          {!fireShotMeta.newShot.hit && <span>Your Shot missed at {getBattleshipCoordString(fireShotMeta.newShot.coord)}</span>}
          {fireShotMeta.sunkShip && <span>You sunk a {fireShotMeta.sunkShip.shipType}!</span>}
          <p> Waiting for your opponent to take a Shot </p>
        </span>
      }
      {!isPlacementMode && !waslastTurnByPlayer &&
        <span>
          {fireShotMeta.newShot.hit && <span> Your Ship has been hit at {getBattleshipCoordString(fireShotMeta.newShot.coord)}. </span>}
          {!fireShotMeta.newShot.hit && <span> Your opponent missed at {getBattleshipCoordString(fireShotMeta.newShot.coord)}</span>}
          {fireShotMeta.sunkShip && <span>Your {fireShotMeta.sunkShip.shipType} has been sunk!</span>}
          <p> Please click below to select a target location to fire a Shot </p>
        </span>
      }

      {hasInvalidShipPlacements && <p>
        Fix colliding ships before you submit your ship placements.
      </p>}
    </div>
  );
  
}

