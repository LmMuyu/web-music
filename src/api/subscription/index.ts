import { useStore } from "vuex";
import request from "../../utils/request";

export function getSubScriptDynamic(lasttime: number = -1) {
  return request({
    url: "/event",
    params: {
      lasttime,
      pagesize: 15,
    },
  });
}

export async function postLinke(threadId: string, successFn: Function, t: 0 | 1, type: number = 6) {
  const res = await request({
    method: "post",
    url: "/resource/like",
    data: {
      t,
      type,
      threadId,
    },
  });

  successFn && successFn(res);
}

export function getUserDetail() {
  const state = useStore().state;

  return request({
    url: "/user/detail",
    params: {
      uid: state.userInfo.userID,
    },
  });
}

export function getComment(threadId: string) {
  return request({
    method: "get",
    url: "/comment/event",
    params: {
      threadId,
    },
  });
}

export function getTopic() {
  return request({
    url: "/hot/topic",
    params: {
      limit: 10,
    },
  });
}
