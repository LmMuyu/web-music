<script lang="tsx">
import { defineComponent, Teleport } from "@vue/runtime-core";
import Search from "../../../components/search/Search.vue";
import { returnResData, onBlur } from "./hooks/methods";

import type { PropType } from "vue";

import "./index.scss";

export default defineComponent({
  props: {
    unmountApp: {
      type: Function as PropType<(payload: MouseEvent) => void>,
      required: true,
    },
  },
  setup(props) {
    const deleteIcon = () => {
      return (
        <div
          class="absolute right-0 top-2 cursor-pointer"
          onClick={props.unmountApp}
        >
          <svg width="16" height="16" style="stroke:#fff;stroke-width:2;">
            <line x1="0" y1="0" x2="16" y2="16"></line>
            <line x1="16" y1="0" x2="0" y2="16"></line>
          </svg>
        </div>
      );
    };

    return () => (
      <div>
        <div class="absolutexy flex flex-col w-1/2  h-1/2 bg-gray-800">
          {deleteIcon()}
          <div class="h-1/4">
            <Search
              {...{ on: { blur: onBlur } }}
              returnresdata={returnResData}
              isIcon={false}
            />
          </div>
          <div class="h-3/4"></div>
        </div>
      </div>
    );
  },
});
</script>
