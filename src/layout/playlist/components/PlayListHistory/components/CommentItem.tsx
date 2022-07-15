import { ElAvatar, ElCol, ElRow } from "element-plus";
import { unref } from "vue";
import MainContentFooter from "../../../../subscription/components/MainContentFooter.vue";
import { computed_footerInfo } from "../../../../subscription/methods";

type record = Record<string, any>;

interface PROPSTYPE {
  scopedData: record;
  isBeRepliedComp?: boolean;
}

export default function CommentItem(props: PROPSTYPE) {
  const footerInfo = unref(computed_footerInfo)(props);
  const { scopedData, isBeRepliedComp } = props;

  function beRepliedList(commentList: any[]) {
    const jsxlist = commentList.map((data) => (
      <CommentItem scopedData={data} isBeRepliedComp={true} />
    ));

    return jsxlist;
  }

  function ChildBeReplied() {
    return <div class="flex flex-col w-full">{beRepliedList(scopedData.beReplied)}</div>;
  }

  return (
    <>
      <ElRow class={"py-1"}>
        {!isBeRepliedComp && (
          <ElCol span={2} class="flex">
            <div class={"relative"}>
              <ElAvatar src={scopedData.user.avatarUrl} size={"medium"}></ElAvatar>
              <router-link
                to={{ path: "/user/home", query: { uid: scopedData.user.userId, isself: true } }}
                class={"absolute w-full h-full left-0 top-0"}
              ></router-link>
            </div>
          </ElCol>
        )}
        <ElCol class={"text-sm w-full"} span={isBeRepliedComp ? 24 : 18}>
          <div
            style={isBeRepliedComp && "background-color:#F5F7FA"}
            class={isBeRepliedComp ? "p-2 rounded-md" : "p-0"}
          >
            <router-link
              class={"bottom_line"}
              to={{ path: "/user/home", query: { uid: scopedData.user.userId, isself: true } }}
              style={{ color: isBeRepliedComp && "#409EFF" }}
            >
              {(isBeRepliedComp ? "@" : "") + scopedData.user.nickname}：
            </router-link>
            <span style="color:#4F4F4F;" class={"text-sm"}>
              {scopedData.content}
            </span>
          </div>
          {scopedData.beReplied && scopedData.beReplied.length > 0 && (
            <div>{<ChildBeReplied />}</div>
          )}
          {!isBeRepliedComp && (
            <div class="py-2">
              <span class="text-xs">{scopedData.timeStr}</span>
            </div>
          )}

          {/* <MainContentFooter icon={footerInfo} /> */}
        </ElCol>
      </ElRow>
    </>
  );
}
