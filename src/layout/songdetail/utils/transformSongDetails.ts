import dayjs from "dayjs";

export default function (detail: any) {
  return {
    creator: {
      nickname: detail.creator.nickname,
      userId: detail.creator.userId,
    },
    tags: detail.tags,
    commentCount: detail.commentCount,
    backgroundUrlImage: detail.coverImgUrl,
    titile: detail.description,
    name: detail.name,
    updateTime: dayjs(detail.updateTime).format("YYYY年MM月DD日"),
  };
}
