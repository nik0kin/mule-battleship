import * as React from 'react';
import * as _ from 'lodash';

import './style.css';
import { GameState } from '../../types';
import { Alignment, Ship, ShipStructure, ShipStructures, Coord, numberToLetter, Shot } from '../../../shared';

type ClickSquareFn = (coord: Coord) => void;

export interface Props {
  selectedCoord?: Coord;
  gameState: GameState;
  clickSquare: ClickSquareFn;
}

function Playfield({ gameState, selectedCoord, clickSquare }: Props) {

  return (
    <div className="Playfield">
      <div className="your-ships">
          {getGrid(gameState.yourShips, gameState.theirShots, _.noop, undefined)}
      </div>
      <div className="their-ships">
          {getGrid(gameState.theirShips, gameState.yourShots, clickSquare, selectedCoord)}
      </div>
    </div>
  );
}

export default Playfield;


function getGrid(ships: Ship[], opponentShots: Shot[], clickSquare: ClickSquareFn, selectedCoord?: Coord) {
  let gridHtml: Array<JSX.Element> = [];
  _.times(11, (i) => {
    gridHtml.push(getRow(i, ships, opponentShots, clickSquare, selectedCoord));
  });
  return (
    <table>
      <tbody>
        {gridHtml}
      </tbody>
    </table>
  );
}

function getRow(y: number, ships: Ship[], opponentShots: Shot[], clickSquare: ClickSquareFn, selectedCoord?: Coord) {
  let rowHtml: Array<JSX.Element> = [];
  _.times(11, (x) => {
    const coord: Coord = { x: x - 1, y: y - 1 };
    let _class: string = y === 0 ? 'top ' : '';
    _class += x === 0 ? 'left ' : '';
    let cellContent: string = _class === 'top ' ? String(x) : _class ===  'left ' ? numberToLetter(y) : '';
    
    _class += isAnyShipOnSquare(coord, ships) ? 'ship ' : '';

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
      clickSquare(coord);
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

function isAnyShipOnSquare(coord: Coord, ships: Ship[]): boolean {
  return _.some(ships, (ship: Ship) => {
    return isShipOnSquare(coord, ship);
  });
}

function isShipOnSquare(coord: Coord, ship: Ship): boolean {
  const shipStructure: ShipStructure | undefined = ShipStructures.get(ship.shipType);

  if (!shipStructure) throw new Error('invalid ShipType: ' + ship.shipType);

  return _.some(shipStructure.squares, (strucutureCoord: Coord) => {
    let structureX: number;
    let structureY: number;

    // horizontal
    if (ship.alignment === Alignment.Horizontal) {
      structureX = ship.coord.x + strucutureCoord.x;
      structureY = ship.coord.y + strucutureCoord.y;
    } else { // vertical
      structureX = ship.coord.x + strucutureCoord.y;
      structureY = ship.coord.y + strucutureCoord.x;
    }
    
    return coord.x === structureX && coord.y === structureY;
  });
}

function getShotOnSquare(coord: Coord, shots: Shot[]): Shot | undefined {
  return _.find(shots, (shot: Shot) => {
    return shot.coord.x === coord.x && shot.coord.y === coord.y;
  });
}
