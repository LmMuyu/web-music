import request from "../../utils/request";

export function uploadAvatar(file: any) {
  return request({
    method: "post",
    url: "/avatar/upload",
    params: {
      imgSize: 200,
    },
    data: file,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateUser(updateInfo: any) {
  return request({
    url: "/user/update",
    method: "post",
    data: updateInfo,
  });
}
