import dayjs, { UnitType } from "dayjs";

const dateName = {
  year: "年",
  month: "月",
  day: "日",
  hour: "小时",
  minute: "分钟",
  second: "秒",
};

const transformTime = (time: string) =>
  time
    .split(/(-|:)/)
    .map((v) => {
      const n = parseFloat(v);
      return n ?? String(n).padStart(2, "0");
    })
    .filter((v) => v ?? undefined);

export function diffTime(ptime: number | string, ntime: number | string) {
  if (ptime === 0 || ntime === 0) return;

  ptime = dayjs(ptime).format("YYYY-MM-DD-HH:mm:ss");
  ntime = dayjs(ntime).format("YYYY-MM-DD-HH:mm:ss");

  const ptimeArr = transformTime(ptime);
  const ntimeArr = transformTime(ntime);

  let timer = 0;
  let unittype: UnitType = "second";

  for (let i = 0; i < ptimeArr.length; i++) {
    if (ptimeArr[i] == ntimeArr[i]) {
      timer += 1;
    }
  }

  switch (timer) {
    case 0:
      unittype = "year";
      break;
    case 1:
      unittype = "month";
      break;
    case 2:
      unittype = "day";
      break;
    case 3:
      unittype = "hour";
      break;
    case 4:
      unittype = "minute";
      break;
    default:
      unittype = "second";
      break;
  }

  let time = dayjs(ntime).diff(dayjs(ptime), unittype);
  unittype === "day" && (time += 1);

  return time + dateName[unittype] + "前";
}
