import type { TITLEOPTIONS } from "../type";
import { relativeTime } from "../../../utils/relativeTime";
import { uploadCloud } from "../../../api/user";

import { ElNotification } from "element-plus";
import { pool_async } from "../../../utils/poolasync";
import store from "../../../store";
import { computed } from "vue";
import { follow } from "../../../store/modules/module_login";

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

function sliceFile(file: File) {
  const MAX_SIZE = 1024 * 1024 * 3;
  const limit = Math.ceil(file.size / MAX_SIZE);
  const bloblists = [];

  for (let i = 0; i < limit; i++) {
    const blob = file.slice(MAX_SIZE * i, MAX_SIZE * (i + 1));
    bloblists.push(blob);
  }

  return bloblists;
}

pool_async;

export function musicUploadToCloudDisk(files: FileList, backcall: any) {
  let uploadCount = {};
  const options = {
    duration: 2000,
    showClose: false,
  };

  Array.from(files).map((file) => {
    const bloblists = sliceFile(file);
    console.log(bloblists);

    const newfile = new File(bloblists.splice(0, 1), file.name, {
      type: file.type,
    });

    console.log(newfile);

    const formdata = new FormData();
    formdata.append("songFile", newfile);

    function retThen(res) {
      console.log(res);

      ElNotification({
        type: "success",
        message: `${file.name}文件上传成功`,
        ...options,
      });

      backcall(res);
    }

    uploadCloud(formdata)
      .then(retThen)
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

export function isFollow(id: number) {
  if (!id) return false;

  const follows = computed(store.getters["login/getFollows"]);
  return !!(follows.value as follow[]).find((follow) => follow.uid === id);
}
