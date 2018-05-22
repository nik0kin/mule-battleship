import * as React from 'react';
import * as _ from 'lodash';

import Playfield from '../../containers/Playfield';
import ShipList from '../../containers/ShipList';
import { GameState, PlayerMap } from '../../types';
import { Coord, numberToLetter } from '../../../shared';

import './style.css';

export interface Props {
  selectedCoord?: Coord;
  players: PlayerMap;
  gameState: GameState;
}

function Layout({ selectedCoord, gameState, players }: Props) {

  return (
    <div>
      <h1> mBattleship </h1>
      <div className="container">
        <div className="gameinfo">

          <div className="stuff">
            Turn 1
            <button disabled={!selectedCoord}>
              {getSubmitButtonText(getAmountOfShipsRemainingToPlace(), selectedCoord)}
            </button>
          </div>

          <ShipList/>

          <div className="shot-list"/>
        </div>
        <div className="gameboard">
          <Playfield/>
        </div>
        <div className="chat"/>
      </div>
    </div>
  );
}

export default Layout;

function getSubmitButtonText(shipsLeftToBePlaced: number, selectedCoord?: Coord): string {

  if (shipsLeftToBePlaced) {
    if (shipsLeftToBePlaced === 1) {
      return 'Place last ship';
    }
    return `Place ${shipsLeftToBePlaced} remaining ships`;
  }

  if (selectedCoord) {
    return 'Fire at ' + getBattleshipCoordString(selectedCoord);
  }

  // TODO different message if its the other players turn

  return 'Select Fire Location';
}

function getBattleshipCoordString(coord: Coord): string {
  return numberToLetter(coord.x + 1) + (coord.y + 1);
}

function getAmountOfShipsRemainingToPlace(): number {
  return 7; // TODO
}