<script lang="tsx">
import { defineComponent, Teleport } from "@vue/runtime-core";

import { nodeRoot } from "./hooks/methods";

import type { PropType } from "vue";

export default defineComponent({
  props: {
    root: {
      type: String,
      default: "#app",
    },
    bgcolor: {
      type: String,
      default: "rgb(45, 52, 54)",
    },
    unmountFu: {
      type: Function as unknown as PropType<Function[]>,
      required: true,
    },
  },
  setup(props) {
    const tonode = nodeRoot(props.root);

    return (
      <Teleport to={tonode}>
        <div
          class="bg_color absolute top-0 bottom-0 left-0 right-0"
          onClick={() => props.unmountFu.forEach((fn) => fn())}
        ></div>
      </Teleport>
    );
  },
});
</script>
