<script setup lang="tsx">
import { defineComponent, ref, watch } from "vue";
import { promptbox } from "../../promptBox";
import "../css/controls.scss";

export default defineComponent({
  emits: ["pre", "play", "next"],
  props: {
    playStatus: {
      type: Object,
      default: () => { },
    },
  },
  setup(props, { emit }) {
    const status = ref(true); //true 播放中 false 暂停中
    watch(() => props.playStatus, (value) => status.value = value.success)

    function Pre() {
      emit("pre");
    }

    function Player() {
      if (!props.playStatus.success) return promptbox({
        title: props.playStatus.message
      })

      emit("play", status);
      status.value = !status.value;
    }

    function Next() {
      emit("next");
    }

    return () => (
      <div class= "flex items-center justify-center" >
      <span onClick={ Pre } class="px-3 iconfont iconarrow-right-copy" />
        <span
          onClick={ Player }
    class={
      status.value
        ? "px-3 iconfont iconpause"
        : "px-3 iconfont iconbofang1"
    }
    />
      < span onClick = { Next } class="px-3 iconfont iconmore" />
        </div>
    );
  },
});
</script>
