<script setup lang="tsx">
import { defineComponent, getCurrentInstance } from "@vue/runtime-core";

import { historyList } from "./hooks/createDom/histroyList";

import { ElDrawer } from "element-plus";

import type { PropType } from "vue";

export default defineComponent({
  props: {
    record: {
      type: Object as PropType<Readonly<Record<string, any>>>,
    },
  },
  setup() {
    const props = {
      showClose: false,
      withHeader: false,
      modelValue: true,
    };

    const playHistory = historyList();

    return () => (
      <>
        <ElDrawer {...props}>
          <header class="p-4">
            <p class="text-lg">历史记录</p>
          </header>
          <main>
            <div>{playHistory}</div>
          </main>
        </ElDrawer>
      </>
    );
  },
});
</script>
