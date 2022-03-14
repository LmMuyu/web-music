import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

function onlyGetSec(h: string, m: string, s: string) {
  const hours = Number(h);
  const min = Number(m);
  const sec = Number(s);

  return hours * 60 * 60 + min * 60 + sec + "";
}

export default function (datetime: number, onlySec?: boolean) {
  const time = dayjs.duration(datetime);

  const hours = time.hours().toString(); //时
  const min = time.minutes().toString(); //分
  const sec = time.seconds().toString(); //秒

  return onlySec
    ? onlyGetSec(hours, min, sec)
    : hours === "0"
    ? `${min}:${sec}`
    : `${hours.padStart(2, "0")}:${min}:${sec.padStart(2, "0")}`;
}
