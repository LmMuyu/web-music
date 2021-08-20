import { computed, Ref } from "vue";

export const computed_footerInfo = computed(() => {
  return function (props: any) {
    return [
      {
        name: "linke",
        event: {
          emit: true,
          emit_name: "linke",
        },
        icon: ["icondianzan1", "iconzan"],
        count: props.event.info.likedCount, //点赞
      },
      {
        name: "comment",
        count: props.event.info.commentCount, //评论
      },
      {
        name: "forward",
        count: props.event.insiteForwardCount, //转发
      },
    ];
  };
});

export function linkeEvent(
  linkedCounts: Ref<number>,
  isLatestLinke: Ref<boolean>
) {
  return function (res: any) {
    const islinke = JSON.parse(res.config.data)["t"];
    console.log(res);

    if (islinke === 1 && res.data.code === 200) {
      linkedCounts.value += 1;
      isLatestLinke.value = true;
    } else {
      linkedCounts.value -= 1;
      isLatestLinke.value = false;
    }
  };
}
