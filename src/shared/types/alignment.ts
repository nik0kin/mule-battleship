
export enum Alignment {
  Vertical,
  Horizontal,
}

export function getRotatedAlignment(alignment: Alignment): Alignment {
  if (alignment === Alignment.Horizontal) {
    return Alignment.Vertical;
  } else {
    return Alignment.Horizontal;
  }
}
