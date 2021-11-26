<script lang="tsx">
import { defineComponent, ref } from "vue";

import "../css/controls.scss";

export default defineComponent({
  emits: ["pre", "play", "next", "pause"],
  setup(props, { emit: ctxEmit }) {
    const status = ref(false); //true 播放中 false 暂停中

    function Pre() {
      ctxEmit("pre");
    }

    function Player() {
      status.value = !status.value;
      status.value ? ctxEmit("play") : ctxEmit("pause");
    }

    function Next() {
      ctxEmit("next");
    }

    return () => (
      <div class="flex items-center justify-center  px-10">
        <span onClick={Pre} class="px-3 iconfont iconarrow-right-copy cursor-pointer" />
        <div>
          <span
            onClick={Player}
            class={[status.value ? " iconpause" : "iconbofang1", "px-3 iconfont cursor-pointer"]}
          />
        </div>
        <span onClick={Next} class="px-3 iconfont iconmore cursor-pointer" />
      </div>
    );
  },
});
</script>
