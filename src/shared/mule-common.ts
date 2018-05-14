import * as _ from 'lodash';

export interface Coord {
  x: number;
  y: number;
}

export function getCoordString(c: Coord): string {
  return c.x + ',' + c.y;
}

export function getCoordFromString(str: string): Coord {
  const split: string[] = str.split(',');
  return {
    x: Number(split[0]),
    y: Number(split[1]),
  };
}

export class Grid<T> {
  private size: Coord;
  private _grid: T[][];

  constructor(size: Coord, createIterator: (coord: Coord) => T) {
    this.size = size;

    this._grid = [];
    _.times(size.x, (x) => {
      this._grid.push([]);
      _.times(size.y, (y) => {
        this._grid[x][y] = createIterator({ x, y });
      });
    });
  }

  public get(coord: Coord): T {
    return this._grid[coord.x][coord.y];
  }

  public toArray(): T[] {
    return _.flatten(this._grid);
  }
}
