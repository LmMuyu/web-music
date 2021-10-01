import { Method } from "axios";
import { async_pool } from "../../utils/asyncPool";
import request from "../../utils/request";

export function getUserMessage(uid: number, limit: number) {
  return request({
    url: "/msg/private/history",
    params: {
      uid,
      limit,
    },
  });
}

export async function getPrivateLetter(method: Method, limit: number = 30) {
  method = method.toLocaleUpperCase() as Method;
  const privateletterList = await request({
    method,
    url: "/msg/private",
    ...(method === "HEAD"
      ? {}
      : {
          params: {
            limit,
          },
        }),
  });

  return privateletterList;
}

export async function getUserMessageList(
  privateletterList: Record<string, any>
) {
  const msgs: any[] = privateletterList.data.msgs;
  // console.log(msgs);

  return await async_pool(
    msgs.map((res) =>
      request({
        url: "/msg/private/history",
        params: {
          uid: res.fromUser.userId,
          limit: 5,
        },
      })
    ),
    4
  );
}
