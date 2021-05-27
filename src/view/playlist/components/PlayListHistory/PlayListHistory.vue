<script setup lang="tsx">
import { defineComponent } from "@vue/runtime-core";
import { ElDrawer } from "element-plus";

import { historyList } from "./hooks/createDom/histroyList";

export default defineComponent({
  setup() {
    const props = {
      title: "历史记录",
      showClose: false,
      withHeader: true,
      modelValue: true,
    };

    return () => (
      <>
        <ElDrawer {...props}>{...historyList()}</ElDrawer>
      </>
    );
  },
});
</script>
