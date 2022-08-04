import request from "../../utils/request";

interface requestType {
  歌曲: 0;
  mv: 1;
  歌单: 2;
  专辑: 3;
  电台: 4;
  视频: 5;
  动态: 6;
}

interface CommentSendId {
  id: number;
  commentId?: number;
}

type filterId<CS extends CommentSendId, C extends 1 | 2> = C extends 2
  ? Required<Exclude<CS, "id">>
  : CS;

function commentRequestQuery() {
  const query = {
    歌曲: 0,
    mv: 1,
    歌单: 2,
    专辑: 3,
    电台: 4,
    视频: 5,
    动态: 6,
  };

  const m = new Map();

  for (const key in query) {
    m.set(key, query[key]);
  }

  return m;
}

export function idsbatch(ids: string) {
  return request({
    url: "/batch" + `?/api/v2/banner/get={ids:${ids}}`,
  });
}

export function sendContentComment<C extends 1 | 2>(
  t: C,
  rtype: keyof requestType,
  sendId: filterId<CommentSendId, C>,
  content: string
) {
  const mquery = commentRequestQuery();
  const type = mquery.get(rtype);

  if (!type && type !== 0) throw new Error("参数错误=>type");


  return request({
    url: "/comment",
    method: "post",
    data: {
      t,
      type,
      id: sendId.id,
      content,
      ...(t === 2 ? { commentId: sendId.commentId } : {}),
    },
  });
}
