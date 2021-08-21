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
            query: id,
          }}
        >
          {text + ":"}
        </router-link>
      );
    };

    const commentItem = (
      id: number,
      text: string,
      content: string,
      at: boolean = false,
      beReplied?: Array<Object>
    ) => {
      return (
        <span class="flex items-center">
          <p>{routerlink(id, text)}</p>
          <p>{" " + content}</p>
          {/* <div>{at && commentItem(id, text, content)}</div> */}
        </span>
      );
    };

    const comentItem = (comment: any) => {
      const userInfo = {
        nickname: comment.user.nickname as string,
        userId: comment.user.userId as number,
        avatarUrl: comment.user.avatarUrl as string,
      };

      const at: boolean = comment.beReplied.length >= 1;
      const text: string = at ? "@" + userInfo.nickname : userInfo.nickname;
      const content: string = comment.content;

      const footerInfo = unref(comment_footerInfo)(comment);

      return (
        <div class="flex">
          <div class="w-1/6">
            <ElAvatar src={userInfo.avatarUrl}></ElAvatar>
          </div>
          <div class="flex flex-col justify-between  w-5/6">
            {commentItem(userInfo.userId, text, content, at, comment.beReplied)}
            <MainContentFooter info={footerInfo} />
          </div>
        </div>
      );
    };

    return () => (
      <section>
        <div>
          <span>最新评论</span>
        </div>
        <div class="py-4">{props.comments.map((v: any) => comentItem(v))}</div>
      </section>
    );
  },
});
