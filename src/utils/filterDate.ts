import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function (datetime: number) {
  const time = dayjs.duration(datetime);

  const hours = time.hours().toString();
  const min = time.minutes().toString();
  const sec = time.seconds().toString().padStart(2, "0");

  return hours === "0" ? `${min}:${sec}` : `${hours.padStart(2, "0")}:${min}:${sec}`;
}
