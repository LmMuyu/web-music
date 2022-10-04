import dayjs from "dayjs";

export default function (detail: any) {
  return {
    id: detail.id,
    creator: {
      nickname: detail.creator.nickname,
      userId: detail.creator.userId,
      avatarUrl: detail.creator.avatarUrl,
    },
    tags: detail.tags,
    commentCount: detail.commentCount,
    backgroundUrlImage: detail.coverImgUrl,
    titile: detail.description,
    name: detail.name,
    updateTime: dayjs(detail.updateTime).format("YYYY年MM月DD日"),
    subscribed: detail.subscribed,
  };
}
