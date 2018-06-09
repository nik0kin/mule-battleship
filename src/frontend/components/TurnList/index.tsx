import * as React from 'react';
import { each, map } from 'lodash';
import { Action, Turn } from 'mule-sdk-js';

import {
  FireShotMuleActionMetaData, getBattleshipCoordString,
  PLACE_SHIPS_MULE_ACTION
} from '../../../shared';

import './style.css';

export interface Props {
  currentLobbyPlayerId: string;
  opponentName: string;
  previousTurns: Turn[];
}

function TurnList({
  currentLobbyPlayerId,
  opponentName,
  previousTurns,
}: Props) {


  return (
    <div className="TurnList">
      {getTurnList(currentLobbyPlayerId, opponentName, previousTurns.slice().reverse())}
    </div>
  );
}

export default TurnList;

function getTurnList(
  currentLobbyPlayerId: string,
  opponentName: string,
  previousTurns: Turn[],
): JSX.Element {

  const turnsHtml: JSX.Element[] = map(previousTurns, (turn: Turn) => {
    const key: string = 'turnlist-turn-' + turn._id;
    const lobbyPlayerId: string = getLobbyPlayerIdWhoPlayedTurn(turn);
    const action: Action = getActionFromTurn(turn);

    return (
      <div className="turn-row" key={key}>
        {getListItemFromAction(
          turn.turnNumber,
          lobbyPlayerId !== currentLobbyPlayerId,
          opponentName,
          action,
        )}
      </div>
    );
  });

  return (
    <div className="list">
      {turnsHtml}
    </div>
  );
}

function getLobbyPlayerIdWhoPlayedTurn(turn: Turn): string {
  let lobbyPlayerId: string | undefined;

  each(turn.playerTurns, ({ actions }, _lobbyPlayerId: string) => {
    lobbyPlayerId = _lobbyPlayerId;
  });

  if (!lobbyPlayerId) throw new Error('missing action from turn' + JSON.stringify(turn));

  return lobbyPlayerId;
}

function getActionFromTurn(turn: Turn): Action {
  let action: Action | undefined;

  each(turn.playerTurns, ({ actions }) => {
    action = actions[0];
  });

  if (!action) throw new Error('missing action from turn' + JSON.stringify(turn));

  return action;
}

function getListItemFromAction(
  turnNumber: number,
  isOpponentsTurn: boolean,
  opponentName: string,
  action: Action,
): JSX.Element {
  let subject: string;

  if (action.type === PLACE_SHIPS_MULE_ACTION) {
    subject = isOpponentsTurn ? opponentName + '\'s' : 'Your';
    return  (
      <div>
        {turnNumber}. <span className="subject">{subject}</span> ship placement phase
      </div>
    );
  }

  const fireShotMeta: FireShotMuleActionMetaData = action.metadata as any as FireShotMuleActionMetaData;
  subject = isOpponentsTurn ? opponentName : 'You';

  return (
    <div>
      {turnNumber}. <span className="subject">{subject}</span> shot at <span className="coord">{getBattleshipCoordString(fireShotMeta.newShot.coord)}</span>
    </div>
  );
}
