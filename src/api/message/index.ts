import { async_pool } from "../../utils/asyncPool";
import request from "../../utils/request";

export async function getPrivateLetter() {
  const privateletterList = await request({ url: "/msg/private" });

  return privateletterList;
}

export async function getUserMessage(privateletterList: Record<string, any>) {
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
