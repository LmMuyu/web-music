import { useStore } from "vuex";
import request from "../../utils/request";

export function getSubScriptDynamic(lasttime: number = -1) {
  return request({
    url: "/event",
    params: {
      pagesize: 5,
    },
  });
}

export async function postLinke(
  threadId: string,
  t: 0 | 1,
  successFn: Function
) {
  const res = await request({
    method: "post",
    url: "/resource/like",
    data: {
      t,
      type: 6,
      threadId,
    },
  });

  successFn(res);
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
