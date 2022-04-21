import request from "../../utils/request";

export function getFollowUserMessage(uid: number, before: number = 0) {
  console.log(uid);

  return request({
    url: "/msg/private/history",
    params: Object.assign(
      {},
      {
        uid,
        limit: 20,
      },
      Number(before) > 0 ? { before } : {}
    ),
  });
}

export async function getSendMsgUser(limit: number = 30) {
  return request({
    url: "/msg/private",
    params: { limit },
  });
}
