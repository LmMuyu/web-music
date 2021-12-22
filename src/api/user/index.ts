import request from "../../utils/request";

export function getSubCount() {
  return request({
    url: "/user/subcount",
  });
}

export function getUserDetail(uid: string) {
  return request({
    url: "/user/detail",
    params: {
      uid,
    },
  });
}

export function getBindingInfo(uid: string) {
  return request({
    url: "/user/binding",
    params: {
      uid,
    },
  });
}

export async function allSettldRequest(uid: string) {
  const allres = await Promise.allSettled([getBindingInfo(uid), getUserDetail(uid)]);

  console.log(allres);
}

export function getUserAudio(uid: number) {
  return request({
    url: "/user/audio",
    params: {
      uid,
    },
  });
}

export function obtainUserPlayList(uid: string) {
  return request({
    url: "/user/playlist",
    params: {
      uid,
    },
  });
}

export function llikelist(uid: string) {
  return request({
    url: "/likelist",
    params: {
      uid,
    },
  });
}

export function subArtist() {
  return request({
    url: "/artist/sublist",
  });
}

export function getCloud(limit: number = 10) {
  return request({
    url: "/user/cloud",
    method: "POST",
    data: {
      limit,
    },
  });
}

export function uploadCloud(formData: FormData) {
  return request({
    method: "post",
    url: `/upclouddisk/cloud?time=${Date.now()}`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
}
