<script setup lang="tsx">
import { defineComponent } from "vue";
import "../css/controls.scss";

export default defineComponent({
  emits: ["pre", "play", "next"],
  setup(props, { emit }) {
    function Pre() {
      emit("pre");
    }

    function Player() {
      emit("play");
    }

    function Next() {
      emit("next");
    }

    return () => (
      <>
        <div class="flex items-center justify-center">
          <span onClick={Pre} class="iconfont iconarrow-right-copy"></span>
          <span onClick={Player} class="iconfont iconbofang1"></span>
          <span onClick={Next} class="iconfont iconmore"></span>
        </div>
      </>
    );
  },
});
</script>
