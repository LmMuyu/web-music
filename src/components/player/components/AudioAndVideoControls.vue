<script setup lang="tsx">
import { defineComponent } from "vue";
import "../css/controls.scss";

export default defineComponent({
  emits: ["pre", "play", "next"],
  setup(props, { emit }) {
    function audioPre() {
      emit("pre");
    }

    function audioPlay() {
      emit("play");
    }

    function audioNext() {
      emit("next");
    }

    return () => (
      <>
        <div class="flex items-center justify-center">
          <span class="iconfont iconarrow-right-copy"></span>
          <span onClick={audioPlay} class="iconfont iconbofang1"></span>
          <span class="iconfont iconmore"></span>
        </div>
      </>
    );
  },
});
</script>
