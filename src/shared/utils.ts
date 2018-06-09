import { Coord } from './mule-common';

// 0 = A
export function numberToLetter(i: number): string {
  return String.fromCharCode(64 + i);
}

export function getBattleshipCoordString(coord: Coord): string {
  return numberToLetter(coord.x + 1) + (coord.y + 1);
}
