
export * from './mule';

export * from './store';

export * from '../gamestate/types';

// export * from '../../shared/types';

export interface ReduxAction {
  type: string;
}

export interface Coord {
  x: number;
  y: number;
}
