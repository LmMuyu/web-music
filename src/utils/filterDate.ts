import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("cn", {});

export default function (datetime: number, onlySec?: boolean, relativeTime?: boolean) {
  const time = dayjs.duration(datetime);
  console.log(dayjs().from(dayjs(datetime)));

  const hours = time.hours().toString(); //时
  const min = time.minutes().toString(); //分
  const sec = time.seconds().toString(); //秒

  return onlySec
    ? onlyGetSec(hours, min, sec)
    : hours === "0"
    ? `${min}:${sec}`
    : `${hours.padStart(2, "0")}:${min}:${sec.padStart(2, "0")}`;
}

function onlyGetSec(h: string, m: string, s: string) {
  const hours = Number(h);
  const min = Number(m);
  const sec = Number(s);

  return hours * 60 * 60 + min * 60 + sec + "";
}
