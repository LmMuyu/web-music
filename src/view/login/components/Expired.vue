<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    qrexpired: {
      default: () => false,
    },
  },
  setup(props) {
    return () => (
      <>
        <article
          v-show={props.qrexpired}
          class="qrexpired absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center flex-col"
        >
          <p>二维码已失效</p>
          <button class="outline-none bg-green-500 text-white p-2">
            点击刷新
          </button>
        </article>
      </>
    );
  },
});
</script>
