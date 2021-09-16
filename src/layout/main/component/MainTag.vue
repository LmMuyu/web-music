<script lang="tsx">
import { inject } from "@vue/runtime-core";
import { defineComponent, unref } from "vue";
import { useRouter } from "vue-router";

import { currentIndex, moveIndex, revisePath, AsideTags } from "../hooks/data";
import { activeIndex } from "../../../utils/activeIndex";

export default defineComponent({
  setup() {
    const router = useRouter();
    const pathList = inject("pathlist") as string[];

    const toPath = (path: string) => {
      router.push({ path });
    };

    const activeTag = (to: any) => {
      currentIndex.value =
        AsideTags.findIndex((value) => value.path === to.path) ?? 0;
    };

    router.beforeEach((to) => activeTag(to));

    const { activeStyle, clickActive, moveActive, leaveActive } =
      new activeIndex(currentIndex, moveIndex);

    const link = (tag: any, index: number) => {
      const path = revisePath(tag.path, pathList);
      const classkey = "flex items-center cursor-pointer py-4 icons";

      const iconorname = (title: string, icon: string, index: number) => {
        return (
          <>
            <i
              class={"iconfont" + " " + icon}
              style={unref(activeStyle)(index)}
            ></i>
            <p
              class="text-2xl px-5 text_color"
              style={unref(activeStyle)(index)}
            >
              {title}
            </p>
          </>
        );
      };

      if (path === "/login") {
        return (
          <router-link
            class={classkey}
            key={tag.index}
            onMouseenter={() => moveActive(index)}
            onMouseleave={() => leaveActive(index)}
            onClick={() => clickActive(index)}
            to={path}
            target="_blank"
          >
            {iconorname(tag.title, tag.icon, index)}
          </router-link>
        );
      } else {
        return (
          <router-link
            class={classkey}
            key={tag.index}
            onMouseenter={() => moveActive(index)}
            onMouseleave={() => leaveActive(index)}
            onClick={() => {
              clickActive(index);
              toPath(path);
            }}
            to=""
          >
            {iconorname(tag.title, tag.icon, index)}
          </router-link>
        );
      }
    };

    const liPathList = AsideTags.map((tag, index) => link(tag, index));

    return () => <nav>{liPathList}</nav>;
  },
});
</script>
<style scoped lang="scss">
.icons {
  @include Iconfont(#636e72, 24);
}

.text_color {
  color: #636e72;
}
</style>
