import { throttle } from "../../../utils/throttle";
import type { MatchItem } from "../type";

export function conversionPlayTime(matchItem: MatchItem) {
  const timeArr = (matchItem.playTime as string).split(":");
  const playTime = Number(timeArr[0]) * 60 + parseInt(timeArr[1]);

  return {
    lyc: matchItem.lyc,
    playTime,
  };
}

let _throttle: Function | null = null;
export function lyricScroll(e: Event) {
  if (!_throttle) {
    _throttle = throttle((event: Event) => {
      console.log(event);
    }, 500);
  }

  _throttle(e);
}
