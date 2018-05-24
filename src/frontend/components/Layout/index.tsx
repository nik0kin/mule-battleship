import * as React from 'react';
import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import Playfield from '../../containers/Playfield';
import ShipList from '../../containers/ShipList';
import { GameState, PlayerMap } from '../../types';
import { Coord, getTotalShipsPerPlayer, numberToLetter } from '../../../shared';

import './style.css';

export interface Props {
  selectedCoord?: Coord;
  players: PlayerMap;
  gameState: GameState;
  pendingActions: Action[];
}

function Layout({ selectedCoord, gameState, players, pendingActions }: Props) {

  return (
    <div>
      <h1> mBattleship </h1>
      <div className="container">
        <div className="gameinfo">

          <div className="stuff">
            Turn 1
            <button disabled={!selectedCoord}>
              {getSubmitButtonText(gameState.isPlacementMode, getAmountOfShipsRemainingToPlace(pendingActions), selectedCoord)}
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

function getSubmitButtonText(isPlacementMode: boolean, shipsLeftToBePlaced: number, selectedCoord?: Coord): string {

  if (shipsLeftToBePlaced) {
    if (shipsLeftToBePlaced === 1) {
      return 'Place last ship';
    }
    return `Place ${shipsLeftToBePlaced} remaining ships`;
  } else if (isPlacementMode) {
    return 'Submit Turn - NYI';
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

function getAmountOfShipsRemainingToPlace(pendingActions: Action[]): number {
  if (pendingActions[0] && pendingActions[0].params && pendingActions[0].params.shipPlacements) {
    return getTotalShipsPerPlayer() - (pendingActions[0].params.shipPlacements as any[]).length;
  } else {
    return 0;
  }
}