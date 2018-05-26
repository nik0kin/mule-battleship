import * as React from 'react';
// import * as _ from 'lodash';
import { Action } from 'mule-sdk-js';

import Playfield from '../../containers/Playfield';
import ShipList from '../../containers/ShipList';
import { GameState, PlayerMap } from '../../types';
import {
  Coord, getPlaceShipsActionParamsFromMuleAction, getTotalShipsPerPlayer,
  numberToLetter,
} from '../../../shared';

import { WaitingIndicator } from './waiting-indicator';

import './style.css';

export interface Props {
  isYourTurn: boolean;
  selectedCoord?: Coord;
  players: PlayerMap;
  gameState: GameState;
  pendingActions: Action[];
}

function Layout({ isYourTurn, selectedCoord, gameState, players, pendingActions }: Props) {
  const theirName: string = gameState.mule.players[gameState.theirLobbyPlayerId].name;

  const shipsLeftToBePlaced: number = getAmountOfShipsRemainingToPlace(gameState.isPlacementMode, pendingActions);

  return (
    <div>
      <h1> mBattleship </h1>
      <div className="container">
        <div className="gameinfo">

          <div className="current-turn-info">
            <div> Turn 1 </div>
            <WaitingIndicator/>
            <div className="short-description"> {getShortDescription(isYourTurn)} </div>
          </div>
          <button className="submit-button" disabled={!shipsLeftToBePlaced || !selectedCoord}>
            {getSubmitButtonText(
              isYourTurn,
              theirName,
              gameState.isPlacementMode,
              shipsLeftToBePlaced,
              selectedCoord,
            )}
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

function getSubmitButtonText(
  isYourTurn: boolean,
  opponentName: string,
  isPlacementMode: boolean,
  shipsLeftToBePlaced: number,
  selectedCoord?: Coord
): string {

  if (!isYourTurn) {
    return `Waiting on ${opponentName}\'s Ship Placement`;
  }

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

function getShortDescription(isYourTurn: boolean): string {
  if (isYourTurn) {
    return 'Your Placement';
  } else {
    return 'Opponent Placement';
  }
}