import * as React from 'react';
import * as _ from 'lodash';

import './style.css';
import { Alignment, Boat, BoatStructure, BoatStructures, Coord, GameState, Shot } from '../../types';
import { numberToLetter } from '../../../shared';

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
          {getGrid(gameState.yourBoats, gameState.theirShots, _.noop, undefined)}
      </div>
      <div className="their-ships">
          {getGrid(gameState.theirBoats, gameState.yourShots, clickSquare, selectedCoord)}
      </div>
    </div>
  );
}

export default Playfield;


function getGrid(boats: Boat[], opponentShots: Shot[], clickSquare: ClickSquareFn, selectedCoord?: Coord) {
  let gridHtml: Array<JSX.Element> = [];
  _.times(11, (i) => {
    gridHtml.push(getRow(i, boats, opponentShots, clickSquare, selectedCoord));
  });
  return (
    <table>
      <tbody>
        {gridHtml}
      </tbody>
    </table>
  );
}

function getRow(y: number, boats: Boat[], opponentShots: Shot[], clickSquare: ClickSquareFn, selectedCoord?: Coord) {
  let rowHtml: Array<JSX.Element> = [];
  _.times(11, (x) => {
    const coord: Coord = { x: x - 1, y: y - 1 };
    let _class: string = y === 0 ? 'top ' : '';
    _class += x === 0 ? 'left ' : '';
    let cellContent: string = _class === 'top ' ? String(x) : _class ===  'left ' ? numberToLetter(y) : '';
    
    _class += isAnyBoatOnSquare(coord, boats) ? 'boat ' : '';

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

function isAnyBoatOnSquare(coord: Coord, boats: Boat[]): boolean {
  return _.some(boats, (boat: Boat) => {
    return isBoatOnSquare(coord, boat);
  });
}

function isBoatOnSquare(coord: Coord, boat: Boat): boolean {
  const boatStructure: BoatStructure | undefined = BoatStructures.get(boat.boatType);

  if (!boatStructure) throw new Error('invalid BoatType: ' + boat.boatType);

  return _.some(boatStructure.squares, (strucutureCoord: Coord) => {
    let structureX: number;
    let structureY: number;

    // horizontal
    if (boat.alignment === Alignment.Horizontal) {
      structureX = boat.coord.x + strucutureCoord.x;
      structureY = boat.coord.y + strucutureCoord.y;
    } else { // vertical
      structureX = boat.coord.x + strucutureCoord.y;
      structureY = boat.coord.y + strucutureCoord.x;
    }
    
    return coord.x === structureX && coord.y === structureY;
  });
}

function getShotOnSquare(coord: Coord, shots: Shot[]): Shot | undefined {
  return _.find(shots, (shot: Shot) => {
    return shot.coord.x === coord.x && shot.coord.y === coord.y;
  });
}
