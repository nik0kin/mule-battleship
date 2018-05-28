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

type ClickSubmitFn = (pendingTurn: {actions: Action[]}) => void;

export interface Props {
  isYourTurn: boolean;
  selectedCoord?: Coord;
  players: PlayerMap;
  gameState: GameState;
  pendingActions: Action[];
  clickSubmit: ClickSubmitFn;
  isSubmitting: boolean;
}

function Layout({ isYourTurn, selectedCoord, gameState, players, pendingActions, clickSubmit, isSubmitting }: Props) {
  const theirName: string = gameState.mule.players[gameState.theirLobbyPlayerId].name;

  const shipsLeftToBePlaced: number = getAmountOfShipsRemainingToPlace(gameState.isPlacementMode, pendingActions);

  return (
    <div>
      <h1> mBattleship </h1>
      <div className="container">
        <div className="gameinfo">

          <div className="current-turn-info">
            <div> Turn {gameState.mule.currentTurn} </div>
            <WaitingIndicator/>
            <div className="short-description"> {getShortDescription(isYourTurn, gameState.isPlacementMode)} </div>
          </div>
          <button
            className="submit-button"
            onClick={() => clickSubmit({actions: pendingActions})}
            disabled={!isSubmitting && isYourTurn && isSubmitButtonDisabled(gameState.isPlacementMode, shipsLeftToBePlaced)}
          >
            {getSubmitButtonText(
              isYourTurn,
              theirName,
              gameState.isPlacementMode,
              gameState.isOpponentPlacementMode,
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
      </div>
      <div className="chat"/>
    </div>
  );
}

export default Layout;

function isSubmitButtonDisabled(isPlacementMode: boolean, shipsLeftToBePlaced: number): boolean {
  const enabled: boolean = isPlacementMode && shipsLeftToBePlaced === 0; // || shot mode logic

  return !enabled;
}

function getSubmitButtonText(
  isYourTurn: boolean,
  opponentName: string,
  isPlacementMode: boolean,
  isOpponentPlacementMode: boolean,
  shipsLeftToBePlaced: number,
  selectedCoord?: Coord
): string {

  if (!isYourTurn) {
    if (isOpponentPlacementMode) {
      return `Waiting on ${opponentName}\'s Ship Placement`;
    } else {
      return `Waiting on ${opponentName}\ to Fire a Shot`;
    }
  }

  if (shipsLeftToBePlaced) {
    if (shipsLeftToBePlaced === 1) {
      return 'Place last ship';
    }
    return `Place ${shipsLeftToBePlaced} remaining ships`;
  } else if (isPlacementMode) {
    return 'Submit Turn';
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

function getShortDescription(isYourTurn: boolean, isPlacementMode: boolean): string {
  if  (isPlacementMode) {
    if (isYourTurn) {
      return 'Your Placement';
    } else {
      return 'Opponent Placement';
    }
  } else {
    if (isYourTurn) {
      return 'Your Shot';
    } else {
      return 'Opponent Shot';
    }
  }
}
