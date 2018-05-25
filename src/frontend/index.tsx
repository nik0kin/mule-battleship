import { includes } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './App';
import { generalReducer } from './reducers/index';
import { StoreState, GameState } from './types/index';
import { getInitialGameState } from './gamestate/initial-gamestate';

import './index.css';

function onGameStateLoad(initialGameState: GameState) {
  // TODO add load screen (once mule-sdk/redux-async is more integrated)

  // Setup React & Redux Store (w/ initial state)
  const store = createStore<StoreState>(generalReducer, {
    ui: {
      selectedCoord: undefined
    },
    gameState: initialGameState,
    pendingTurn: {
      actions: [],
    },
  });

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
}

const messagesToShow: string[] = [
  'game has not started',
  'user has no session',
  'user is not in game',
];

export function bootstrapFrontend(): void {
  getInitialGameState()
    .then(
      onGameStateLoad,
      (e) => {
        console.log('Something went wrong during initiliziting Mule GameState');
        console.log(e);

        if (e instanceof Error && includes(messagesToShow, e.message)) {
          return alert(e.message); // TODO handle cleaner
        }

        throw e;
      }
    );
}

