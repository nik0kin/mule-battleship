
export interface Player {
  playerId: string; // mule server player id
  playerNumber: number; // this game of battleship player id (aka mule playerRel)
  name: string;
}

export interface PlayerMap {
  [playerNumber: number]: Player;
}
