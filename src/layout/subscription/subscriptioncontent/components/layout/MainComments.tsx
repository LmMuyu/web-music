import { ElAvatar } from "element-plus";
import { defineComponent, unref } from "vue";

import { comment_footerInfo } from "../methods";

import MainContentFooter from "./MainContentFooter.vue";

import "./css/MainComment.css";

export default defineComponent({
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
  },

  setup(props) {
    const routerlink = (id: number, text = "") => {
      return (
        <router-link
          style="color:#74b9ff;"
          class="decoration whitespace-nowrap"
          to={{
            path: "/user/home",
            query: {
              uid: id,
            },
          }}
        >
          {text + ":"}
        </router-link>
      );
    };

    const commentText = (id: number, text: string, content: string) => {
      return (
        <span class="flex">
          <p>{routerlink(id, text)}</p>
          <p>{content}</p>
        </span>
      );
    };

    const commentItem = (comment: any, childcomment: boolean = false) => {
      const userInfo = {
        nickname: comment.user.nickname as string,
        userId: comment.user.userId as number,
        avatarUrl: comment.user.avatarUrl as string,
      };

      const text: string = childcomment
        ? "@" + userInfo.nickname
        : userInfo.nickname;

      const beReplied: Array<Object> = comment.beReplied ?? [];

      const content: string = comment.content;
      const footerInfo = unref(comment_footerInfo)(comment);

      return (
        <div
          class={!childcomment ? "flex pt-4 bottom_border" : "flex p-2"}
          style={{ backgroundColor: childcomment ? "#f5f6fa" : "#fff" }}
        >
          {!childcomment && (
            <div style="width:10%">
              <ElAvatar src={userInfo.avatarUrl}></ElAvatar>
            </div>
          )}
          <div
            class="flex flex-col justify-between"
            style={{ width: !childcomment ? "90%" : "100%" }}
          >
            {commentText(userInfo.userId, text, content)}
            <div>{beReplied.map((v) => commentItem(v, true))}</div>
            {!childcomment && <MainContentFooter info={footerInfo} />}
          </div>
        </div>
      );
    };

    return () => (
      <section>
        <div>
          <span>最新评论</span>
        </div>
        <div class="py-4">{props.comments.map((v: any) => commentItem(v))}</div>
      </section>
    );
  },
});
