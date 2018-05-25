import * as React from 'react';
import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import Playfield from '../../containers/Playfield';
import ShipList from '../../containers/ShipList';
import { GameState, PlayerMap } from '../../types';
import {
  Coord, getPlaceShipsActionParamsFromMuleAction, getTotalShipsPerPlayer,
  numberToLetter, ShipPlacement,
} from '../../../shared';

import { WaitingIndicator } from './waiting-indicator';

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

          <div className="current-turn-info">
            <div> Turn 1 </div>
            <WaitingIndicator/>
            <div className="short-description"> Your Placement </div>
          </div>
          <button className="submit-button" disabled={!selectedCoord}>
            {getSubmitButtonText(gameState.isPlacementMode, getAmountOfShipsRemainingToPlace(gameState.isPlacementMode, pendingActions), selectedCoord)}
          </button>

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

function getAmountOfShipsRemainingToPlace(isPlacementMode: boolean, pendingActions: Action[]): number {
  if (isPlacementMode) {
    const pendingPlacements: number = getPlaceShipsActionParamsFromMuleAction(pendingActions[0]).shipPlacements.length;
    return getTotalShipsPerPlayer() - pendingPlacements;
  } else {
    return 0;
  }
}