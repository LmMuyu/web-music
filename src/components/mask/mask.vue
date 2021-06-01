<script lang="tsx">
import { computed, defineComponent } from "@vue/runtime-core";
import { Teleport } from "vue";

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
  },
  setup(props) {
    const tonode = computed(() => {
      const root = props.root;
      if (root.startsWith("#")) {
      } else if (root.startsWith(".")) {
      }
    });

    return (
      <Teleport to={tonode}>
        <div class="bg_color absolute top-0 bottom-0 left-0 right-0"></div>
      </Teleport>
    );
  },
});
</script>
