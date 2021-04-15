import axios, { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

type listTime = number[];

export async function getTopList(config: AxiosRequestConfig) {
  const {
    data: { list },
  } = await request(config);

  const options: listTime = [];
  let index = 4;

  while ((index -= 1)) {
    options.push(list[index - 1]?.id);
  }

  return await axios.all(
    options.reverse().map((id) =>
      request({
        url: "/playlist/detail",
        method: "GET",
        params: {
          id,
        },
      })
    )
  );
}
