<script setup lang="tsx">
import {
  defineComponent,
  nextTick,
  onMounted,
  ref,
  unref,
} from "@vue/runtime-core";

import { unmountApp } from "./index";
import { historyList } from "./hooks/createDom/histroyList";

import { ElDrawer } from "element-plus";
import VirtualList from "/comps/virtuallist/VirtualList.vue";

import type { PropType } from "vue";

export default defineComponent({
  props: {
    record: {
      type: Object as PropType<Readonly<Record<string, any>>>,
    },
  },
  setup() {
    const drawerProps = {
      showClose: false,
      withHeader: false,
      modelValue: true,
    };

    // const playHistory = historyList();

    const drawerNode = ref<Record<string, any> | null>(null);
    const headerNode = ref<HTMLElement | null>(null);

    const drawerMainHeight = ref(0);

    const renderData = new Array(100).fill(1).map((v, i) => ({
      id: i,
      value: i,
    }));

    onMounted(() => {
      // debugger;

      nextTick(() => {
        if (drawerNode.value && headerNode.value) {
          drawerMainHeight.value =
            drawerNode.value.$refs.drawerRef.clientHeight -
            headerNode.value.offsetHeight;
        }
      });
    });

    return () => (
      <>
        <ElDrawer
          {...{ onClosed: unmountApp }}
          {...drawerProps}
          ref={drawerNode}
        >
          <header class="p-4" ref={headerNode}>
            <p class="text-lg">历史记录</p>
          </header>
          <main>
            <VirtualList
              renderData={renderData}
              height={24}
              scrollHeight={unref(drawerMainHeight)}
            ></VirtualList>
          </main>
        </ElDrawer>
      </>
    );
  },
});
</script>
