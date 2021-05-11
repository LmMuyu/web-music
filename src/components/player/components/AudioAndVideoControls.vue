<script setup lang="tsx">
import { defineComponent, ref } from "vue";
import "../css/controls.scss";

export default defineComponent({
  emits: ["pre", "play", "next"],
  setup(props, { emit }) {
    const statue = ref(true); //true 播放中 false 暂停中

    function Pre() {
      emit("pre");
    }

    function Player() {
      emit("play", statue);
      statue.value = !statue.value;
    }

    function Next() {
      emit("next");
    }

    return () => (
      <>
        <div class="flex items-center justify-center">
          <span onClick={Pre} class="px-3 iconfont iconarrow-right-copy"></span>
          <span
            onClick={Player}
            class={
              statue.value
                ? "px-3 iconfont iconpause"
                : "px-3 iconfont iconbofang1"
            }
          ></span>
          <span onClick={Next} class="px-3 iconfont iconmore"></span>
        </div>
      </>
    );
  },
});
</script>
