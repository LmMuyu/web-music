<script lang="tsx">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
} from "@vue/runtime-core";

import { returnResData } from "./hooks/methods";
import { onSearch } from "../../../components/search/api/onSearch";

import { MainContent } from "./hooks/data";
import Search from "../../../components/search/Search.vue";
import IndexSearchReslut from "./components/IndexSearchReslut.vue";

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
    const searchRes = reactive({
      keyword: "",
      musicList: [],
    });

    function onChange(keyword: string) {
      onSearch(keyword, (keyword: string, result: any) => {
        searchRes.keyword = keyword;
        searchRes.musicList = result;
      });
    }

    function winScroll(e: Event) {
      e.stopPropagation();
      e.preventDefault();
    }

    onMounted(() => {
      window.addEventListener("scroll", winScroll, false);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", winScroll, false);
    });

    return () => (
      <div>
        <div
          onClick={props.unmountApp}
          class="bg_color absolute top-0 bottom-0 left-0 right-0 pointer-events-auto"
        ></div>
        <div
          class="absolutexy flex flex-col w-1/2 h-1/2 rounded-md overflow-y-hidden"
          style="background-color:#576574"
        >
          <div class="h-1/6 flex justify-center w-full">
            <Search
              {...{ onChange: onChange }}
              returnresdata={returnResData}
              isIcon={false}
              disabled={false}
              class="w-3/4"
              inputClass="w-full h-1/2 py-0 px-0 "
            />
          </div>
          <div class="h-full" ref={MainContent}></div>
        </div>
      </div>
    );
  },
});
</script>
