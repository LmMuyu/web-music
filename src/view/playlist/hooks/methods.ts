import { currTop } from "./data";
import type { MatchItem } from "../type";

export function conversionItem(matchItem: MatchItem) {
  const timeArr = (matchItem.playTime as string).split(":");
  const playTime = Number(timeArr[0]) * 60 + parseInt(timeArr[1]);

  return {
    lyc: matchItem.lyc,
    playTime,
    node: null,
  };
}

const position = {
  y: 0,
};

const point = {
  y: 0,
};

function _mover(newY: number) {
  currTop.value = newY;
  position.y = newY;
}

export function lyricScroll(event: Event) {
  const el = event.target as HTMLElement;
  const currY = el.scrollTop;

  const delety = currY - point.y;

  if (delety > 0 && currY < point.y) {
    return;
  }

  point.y = currY;

  const newY = point.y + delety;

  _mover(newY);
}
