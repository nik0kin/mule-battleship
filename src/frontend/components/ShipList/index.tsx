import * as React from 'react';
import * as _ from 'lodash';

import Playfield from '../../containers/Playfield';
import { getShipStructure, Ship, ShipStructure, ShipType } from '../../../shared';

import './style.css';

type SelectShipListShipFn = (shipId: number) => void;

export interface Props {
  yourShips: Ship[];
  theirShips: Ship[];
  selectedShipBeingPlaced: number | undefined;
  selectShipListShip: SelectShipListShipFn;
}

function ShipList({yourShips, theirShips, selectedShipBeingPlaced, selectShipListShip}: Props) {

  const isPlacementMode = true; // TODO

  return (
    <div className={'ShipList ' + isPlacementMode ? 'placement-mode' : ''}>
      <div className="your-ship-list">
        <div className="list-title"> Your Ships </div>
        {getShipList(yourShips, selectShipListShip, selectedShipBeingPlaced)}
      </div>

      <div className="their-ship-list">
        <div className="list-title"> Opponent's Ships </div>
        {getShipList(theirShips, _.noop, undefined)}
      </div>
    </div>
  );
}

export default ShipList;

function getShipList(ships: Ship[], selectShipListShip: SelectShipListShipFn, selectedShipBeingPlaced: number | undefined): JSX.Element {
  const sortedShips: Ship[] = _.sortBy(ships, (ship: Ship) => {
    return -getShipStructure(ship.shipType).squares.length;
  });
  const shipsHtml: JSX.Element[] = _.map(sortedShips, (ship: Ship) => {
    const key: string = ship.id + ' ' + ship.shipType;
    return (
      <div key={key}>
        <div className="ship-name">
          {ship.shipType}
        </div>
        <div>
          {getShipListShip(ship, selectedShipBeingPlaced === ship.id, key, selectShipListShip)}
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

function getShipListShip(ship: Ship, isPlacing: boolean, key: string, selectShipListShip: SelectShipListShipFn): JSX.Element {
  const length: number = getShipStructure(ship.shipType).squares.length; // TODO this needs to be changed to show non linear ship structures
  const rowHtml: JSX.Element[] = [];

  _.times(length, (i) => {
    rowHtml.push(
      <td className="ship" onClick={() => selectShipListShip(ship.id)} key={key + '-s' + i}/>
    );
  });

  let className: string = 'shiplist-ship ';

  if (isPlacing) {
    className += ' placing';
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
