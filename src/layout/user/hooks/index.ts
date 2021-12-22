import type { TITLEOPTIONS } from "../type";
import { relativeTime } from "../../../utils/relativeTime";
import { uploadCloud } from "../../../api/user";

import { ElNotification } from "element-plus";

const MAXUPLOADCOUNT = 3;

export function uploadCloudDisk(data: Record<string, any>): TITLEOPTIONS {
  const mb = 1024 * 1024;
  const musicSize = Number(data.size);
  const ismb = musicSize > mb;

  const size = parseInt(String((musicSize / (ismb ? mb : 1024)) * 100)) / 100 + "MB";
  const musicDetail = data.data[0];

  return {
    size,
    uploadTime: relativeTime(musicDetail.addTime, Date.now()),
    album: musicDetail.album,
    format: (
      musicDetail.fileName.slice(musicDetail.fileName.indexOf(".") + 1) as string
    ).toUpperCase(),
    musicName: musicDetail.songName,
    singer: musicDetail.artist,
  };
}

export function musicUploadToCloudDisk(files: FileList, backcall: any) {
  let uploadCount = {};
  const options = {
    duration: 2000,
    showClose: false,
  };

  Array.from(files).map((file) => {
    const formdata = new FormData();
    formdata.append("songFile", file);

    uploadCloud(formdata)
      .then((res) => {
        ElNotification({
          type: "success",
          message: `${file.name}文件上传成功`,
          ...options,
        });

        backcall(res);
      })
      .catch((err) => {
        uploadCount[file.name] ? (uploadCount[file.name] += 1) : (uploadCount[file.name] = 1);

        if (uploadCount[file.name] > MAXUPLOADCOUNT) {
          ElNotification({
            type: "error",
            message: `${file.name}文件无法上传`,
            ...options,
          });
        } else {
          ElNotification({
            type: "error",
            message: `${file.name}重新上传${uploadCount[file.name]}次`,
            ...options,
          });
        }
      });
  });
}
