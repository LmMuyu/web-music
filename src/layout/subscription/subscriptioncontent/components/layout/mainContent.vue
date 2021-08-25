<script lang="tsx">
import { defineComponent } from "vue";
import { computed, ref, unref } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../utils/musicDetail";
import { useRefNegate } from "../../../../../utils/useRefNegate";
import { getComment } from "../../../../../api/subscription";
import { eventType } from "../../hooks/eventType";
import { computed_footerInfo } from "../methods";
import { onLinke } from "../../hooks/onLinke";

import MainContentImageList from "./MainContentImageList.vue";
import MainContentHeader from "./MainContentHeader.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentSong from "./MainContentSong.vue";
import MainContentText from "./MainContentText.vue";
import MainWriteBox from "./MainWriteBox.vue";
import MainContent from "./MainContent.vue";
import MainComment from "./MainComments";

export default defineComponent({
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    recursion: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["emitPics"],
  setup(props, { emit: ctxEmit }) {
    const footerInfo = unref(computed_footerInfo)(props);
    const { countRef, negate } = useRefNegate(false);
    const commentList = ref([]);

    function linke(...emits: any) {
      onLinke(props.event, emits[0], emits[1] ? 0 : 1);
    }

    async function comment() {
      if (countRef.value || commentList.value.length > 0) return negate();

      const result = await getComment(props.event.info.threadId);
      commentList.value = result.data.comments;

      negate();
    }

    function onEmitPreviewInfo(e: PointerEvent) {
      const index = (e.target as HTMLElement).getAttribute("key-index");

      ctxEmit("emitPics", [
        JSON.parse(JSON.stringify(props.event.pics)),
        index,
      ]);
    }

    function sendComment(data: string) {
      console.log(data);
    }

    const eventJson = computed(() => {
      const json = JSON.parse(props.event["json"]);
      return json;
    });

    const newEventJson = computed(() => {
      return props.recursion
        ? {
            msg: `<a herf="jacascript:;;" data-id="${
              props.event.user.userId ?? props.event.user.uid
            }" style="color:#74b9ff" class="user hover_init cursor-pointer">@${
              props.event.user.nickname
            }</a>  ${eventType.value(props.event.type)}：${
              eventJson.value["msg"]
            }`,
          }
        : {};
    });

    const musicDetail = musicResultDetail(eventJson.value["song"] ?? {});

    function maintsx() {
      return (
        <section
          style={{ backgroundColor: props.recursion ? "#f5f6fa" : "#fff" }}
          class={props.recursion && "px-6 pt-4 w-full h-full"}
        >
          {!props.recursion && (
            <header>
              <MainContentHeader
                type={props.event.type}
                userinfo={props.event.user}
                showTime={props.event.showTime}
              />
            </header>
          )}
          <main class="py-6">
            <MainContentText
              msg={unref(props.recursion ? newEventJson : eventJson).msg ?? ""}
              actId={props.event.extJsonInfo.actId}
              actIds={props.event.extJsonInfo.actIds ?? []}
            />
            <MainContentSong v-show="!!musicDetail" musicDetail={musicDetail} />
            <MainContentImageList
              pics={props.event.pics ?? []}
              isMarginTop={!!musicDetail}
              {...{
                onClick: onEmitPreviewInfo,
              }}
            />
          </main>
          {!!unref(eventJson).event && (
            <main>
              <MainContent event={unref(eventJson).event} />
            </main>
          )}
          <footer>
            <MainContentFooter
              info={footerInfo}
              latestLikedUsers={
                props.event.info.commentThread.latestLikedUsers ?? []
              }
              {...{
                onLinke: linke,
                onComment: comment,
              }}
            />
            {!props.recursion && countRef.value && (
              <article>
                <MainWriteBox onSendComment={sendComment} />
                <MainComment comments={unref(commentList)} />
              </article>
            )}
          </footer>
        </section>
      );
    }

    return () => maintsx();
  },
});
</script>
