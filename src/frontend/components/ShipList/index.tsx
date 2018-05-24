import * as React from 'react';
import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import Playfield from '../../containers/Playfield';
import {
  Coord, doesShipIdExistInShipPlacements,
  getPlaceShipsParamsFromAction, getInvalidShipPlacements, getShipStructure, isShipPlaced,
  Ship, ShipPlacement, ShipStructure, ShipType,
} from '../../../shared';

import './style.css';

type SelectShipListShipFn = (shipId: number) => void;

export interface Props {
  isPlacementMode: boolean;
  yourLobbyPlayerId: string;
  gridSize: Coord;
  yourShips: Ship[];
  theirShips: Ship[];
  pendingActions: Action[];
  selectedShipBeingPlaced: number | undefined;
  selectShipListShip: SelectShipListShipFn;
}

function ShipList({
  isPlacementMode,
  yourLobbyPlayerId,
  gridSize,
  yourShips,
  theirShips,
  pendingActions,
  selectedShipBeingPlaced,
  selectShipListShip
}: Props) {

  let invalidShipPlacements: ShipPlacement[] = [];

  if (isPlacementMode) {
    const shipPlacements: ShipPlacement[] = getPlaceShipsParamsFromAction(pendingActions[0]).shipPlacements;
    invalidShipPlacements = getInvalidShipPlacements(yourLobbyPlayerId, gridSize, yourShips, shipPlacements);
  }

  return (
    <div className={'ShipList ' + (isPlacementMode ? 'placement-mode' : '')}>
      <div className="your-ship-list">
        <div className="list-title"> Your Ships </div>
        {getShipList(yourShips, pendingActions, selectShipListShip, selectedShipBeingPlaced, invalidShipPlacements)}
      </div>

      <div className="their-ship-list">
        <div className="list-title"> Opponent's Ships </div>
        {getShipList(theirShips, [], _.noop, undefined, [])}
      </div>
    </div>
  );
}

export default ShipList;

function getShipList(
  ships: Ship[],
  pendingActions: Action[],
  selectShipListShip: SelectShipListShipFn,
  selectedShipBeingPlaced: number | undefined,
  invalidShipPlacements: ShipPlacement[],
): JSX.Element {
  const sortedShips: Ship[] = _.sortBy(ships, (ship: Ship) => {
    return -getShipStructure(ship.shipType).squares.length; // longest first
  });

  const shipsHtml: JSX.Element[] = _.map(sortedShips, (ship: Ship) => {
    const key: string = ship.id + ' ' + ship.shipType;
    const isPlaced: boolean = isShipPlaced(ship.id, pendingActions);
    const isCollided: boolean = isPlaced && doesShipIdExistInShipPlacements(invalidShipPlacements, ship.id);

    return (
      <div key={key} onClick={() => selectShipListShip(ship.id)}>
        <div className="ship-name">
          {ship.shipType}
        </div>
        <div>
          {getShipListShip(ship, selectedShipBeingPlaced === ship.id, isPlaced, isCollided, key)}
        </div>
      </div>
    );
  });

  return (
    <div>
      {shipsHtml}
    </div>
  );
}

function getShipListShip(ship: Ship, isPlacing: boolean, isPlaced: boolean, isCollided: boolean, key: string): JSX.Element {
  const length: number = getShipStructure(ship.shipType).squares.length; // TODO this needs to be changed to show non linear ship structures
  const rowHtml: JSX.Element[] = [];

  _.times(length, (i) => {
    rowHtml.push(
      <td className="ship" key={key + '-s' + i}/>
    );
  });

  let className: string = 'shiplist-ship ';

  if (isPlacing) {
    className += ' placing';
  } else if (isPlaced) {
    className += ' placed';
  }

  if (isCollided) {
    className += ' collision';
  }

  return (
    <table className={className}>
      <tbody>
        <tr>
          {rowHtml}
        </tr>
      </tbody>
    </table>
  );
}
