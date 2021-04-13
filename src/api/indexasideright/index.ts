import axios, { AxiosRequestConfig } from "axios";
import request from "../../utils/request";

interface USER {
  id: number;
  accountId: number;
}

interface anchorsData {
  list: Record<string, any>[];
}

export async function getCheckInSinger(config: AxiosRequestConfig) {
  const {
    data: { artists },
  } = await request(config);

  const singerDesc = await axios.all(
    (artists as []).map((user: USER) =>
      request({
        url: `/user/detail`,
        params: {
          uid: user.accountId,
        },
      })
    )
  );

  return singerDesc.map((desc, index) => {
    const {
      data: { code },
    } = desc;

    let detailDesc = {};
    if (code !== 400) {
      detailDesc = { ...desc.data };
    }

    return { detailDesc, ...artists[index] };
  });
}

export async function getPopularAnchors(config: AxiosRequestConfig) {
  const {
    data: { data },
  } = await request(config);

  const detailAnchors = await axios.all(
    (data.list as []).map((anchors: USER) =>
      request({
        url: "/user/detail",
        params: {
          uid: anchors.id,
        },
      })
    )
  );

  return (data.list as []).map((item: object, index) => {
    let anchorsdetail = detailAnchors[index].data;

    return {
      ...item,
      anchorsdetail,
    };
  });
}
