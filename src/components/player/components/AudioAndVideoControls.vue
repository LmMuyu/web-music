<script lang="tsx">
import { defineComponent, watch } from "vue";

import { promptbox } from "../../promptBox";
import { status } from "../hook/data";

import "../css/controls.scss";

export default defineComponent({
  emits: ["pre", "play", "next"],
  props: {
    playStatus: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    watch(
      () => props.playStatus,
      (value) => (status.value = value.success)
    );

    function Pre() {
      emit("pre");
    }

    function Player() {
      if (!props.playStatus.success)
        return promptbox({
          title: props.playStatus.message,
        });

      emit("play", status);
      status.value = !status.value;
    }

    function Next() {
      emit("next");
    }

    return () => (
      <div class="flex items-center justify-center  px-10">
        <span
          onClick={Pre}
          class="px-3 iconfont iconarrow-right-copy cursor-pointer"
        />
        <span
          onClick={Player}
          class={[
            status.value ? " iconpause" : "iconbofang1",
            "px-3 iconfont cursor-pointer",
          ]}
        />
        <span onClick={Next} class="px-3 iconfont iconmore cursor-pointer" />
      </div>
    );
  },
});
</script>
