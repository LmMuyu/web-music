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
  const allres = await Promise.allSettled([
    getBindingInfo(uid),
    getUserDetail(uid),
  ]);

  console.log(allres);
}

export function getUserAudio(uid: number) {
  console.log(uid);
  
  return request({
    url: "/user/audio",
    params: {
      uid,
    },
  });
}
