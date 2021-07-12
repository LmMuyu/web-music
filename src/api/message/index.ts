import request from "../../utils/request";

export async function getPrivateLetter() {
  const privateletterList = await request({ url: "/msg/private" });

  return privateletterList;
}

export async function getUserMessage(privateletterList: Record<string, any>) {
  const msgs: any[] = privateletterList.data.msgs;

  const privateMesList = await Promise.all(
    msgs.map((res) =>
      request({
        url: "/msg/private/history",
        params: {
          uid: res.fromUser.userId,
          limit: 5,
        },
      })
    )
  );

  console.log(privateMesList);
}
