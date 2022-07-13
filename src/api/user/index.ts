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
    timeout: 1000 * 30,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
}

export function follows(uid: number, page: number) {
  return request({
    url: "/user/follows",
    params: {
      uid,
      limit: page * 20,
    },
  });
}

export function artistdetail(id: number) {
  return request({
    url: "/artist/detail",
    params: {
      id,
    },
  });
}

export function singerAlbum(id: number, limit: number = 20, offset: number = 1) {
  return request({
    url: "/artist/album",
    params: {
      id,
      limit,
      offset: offset - 1,
    },
  });
}

export function simiSinger(id: number) {
  return request({
    url: "/simi/artist",
    params: {
      id,
    },
  });
}

export function artistMv(id: number) {
  return request({
    url: "/artist/mv",
    params: {
      id,
    },
  });
}

export function userAccount() {
  return request({
    url: "/user/account",
  });
}

export function albumSublist() {
  return request({
    url: "/album/sublist",
  });
}

export function mvSublist() {
  return request({
    url: "/mv/sublist",
  });
}

export function timelineVideoAll(offset: number = 0) {
  return request({
    url: "/video/timeline/all",
    params: {
      offset,
    },
  });
}
