import { ElAvatar, ElCol, ElRow } from "element-plus";

type record = Record<string, any>;

interface PROPSTYPE {
  scopedData: record;
  isBeRepliedComp?: boolean;
}

export default function CommentItem(props: PROPSTYPE) {
  const { scopedData, isBeRepliedComp } = props;

  function beRepliedList(commentList: any[]) {
    const jsxlist = commentList.map((data) => (
      <CommentItem scopedData={data} isBeRepliedComp={true} />
    ));

    return jsxlist;
  }

  function ChildBeReplied() {
    return (
      <div class="flex flex-col  ">
        <div class="w-full">
          <div
            style={{
              backgroundColor: "#FFFFE0",
            }}
            class="py-2"
          >
            {beRepliedList(scopedData.beReplied)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ElRow class={"py-1"}>
        {!isBeRepliedComp && (
          <ElCol span={2} class="flex">
            <div>
              <ElAvatar src={scopedData.user.avatarUrl} size={"medium"}></ElAvatar>
            </div>
          </ElCol>
        )}
        <ElCol class="text-sm" span={isBeRepliedComp ? 24 : 18}>
          <div>
            <span>{scopedData.user.nickname}：</span>
            <span style="color:#4F4F4F;">{scopedData.content}</span>
          </div>
          {scopedData.beReplied && scopedData.beReplied.length > 0 && (
            <div>{<ChildBeReplied />}</div>
          )}
          <div class="py-2">
            <span class="text-xs">{scopedData.timeStr}</span>
          </div>
        </ElCol>
      </ElRow>
    </>
  );
}
