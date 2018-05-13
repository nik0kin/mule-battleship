import * as React from 'react';
import * as _ from 'lodash';

import Playfield from '../../containers/Playfield';
import { Coord, GameState, PlayerMap } from '../../types';
import { numberToLetter } from '../../../shared';

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
              {getSubmitButtonText(selectedCoord)}
            </button>
          </div>

          <div className="their-ship-list">
            <div> 1x Carrier - size: 5 </div>
            <div> 1x Battleship - size: 4 </div>
            <div> 1x Cruiser - size: 3 </div>
            <div> 2x Destroyer - size: 2 </div>
            <div> 2x Submarine - size: 1 </div>
          </div>

          <div className="your-ship-list">
            <div> 1x Carrier - size: 5 </div>
            <div> 1x Battleship - size: 4 </div>
            <div> 1x Cruiser - size: 3 </div>
            <div> 2x Destroyer - size: 2 </div>
            <div> 2x Submarine - size: 1 </div>
          </div>

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

function getSubmitButtonText(selectedCoord?: Coord): string {

  if (selectedCoord) {
    return 'Fire at ' + getBattleshipCoordString(selectedCoord);
  }

  // TODO different message if its the other players turn

  return 'Select Fire Location';
}

function getBattleshipCoordString(coord: Coord): string {
  return numberToLetter(coord.x + 1) + (coord.y + 1);
}
