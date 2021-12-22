import dayjs from "dayjs";

export function relativeTime(starttime: number, currtime: number) {
  const start = dayjs(starttime).format("YYYY:MM:DD:HH:mm:ss").split(":").map(Number);
  const curr = dayjs(currtime).format("YYYY:MM:DD:HH:mm:ss").split(":").map(Number);
  // console.log("start:" + start);
  // console.log("curr:" + curr);

  const diffyear = curr[0] - start[0];
  const diffmonth = curr[1] - start[1];
  const diffday = curr[2] - start[2];
  const diffhouer = curr[3] - start[3];
  const diffmin = curr[4] - start[4];
  const diffsec = curr[5] - start[5];

  //判断秒
  if (curr[4] === start[4]) {
    if (diffsec < 10) {
      return "刚刚上传";
    } else if (diffsec > 10 && diffsec < 60) {
      return diffsec + "秒前上传";
    }
  }

  if (curr[3] === start[3]) {
    if (diffmin < 60) {
      return diffmin + "分钟前上传";
    }
  }

  if (diffhouer) {
    return diffhouer + "小时前上传";
  }

  if (curr[2] === start[2]) {
    if (diffhouer) {
      return diffhouer + "小时前上传";
    }
  }

  if (curr[1] === start[1]) {
    if (diffday > 1) {
      return "昨天上传";
    } else if (diffday > 2) {
      return "前天上传";
    } else if (diffday > 0) {
      return diffday + "前上传";
    }
  }

  return dayjs(starttime).format("YYYY-MM-DD HH:mm:ss");
}
