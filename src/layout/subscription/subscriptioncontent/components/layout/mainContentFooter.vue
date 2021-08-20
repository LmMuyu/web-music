<script lang="tsx">
import { computed, defineComponent, ref, shallowRef, unref } from "vue";
import { useStore } from "vuex";

import type { State } from "../../../../../store/type";
import type { PropType } from "vue"
import { linkeEvent } from "../methods";

type Options = {
  name: string
  count: number
  event?: Record<any, any>,
  icon?: string[] | string
}

export default defineComponent({
  props: {
    info: {
      type: Array as PropType<Array<Options>>,
      default: () => []
    },
    latestLikedUsers: {
      type: Array,
      default: () => [],
    },
    recursion: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["linke"],
  setup(props, { emit: ctxEmit }) {
    const store = useStore();
    const state = store.state as State;
    const isLatestLinke = shallowRef(false);
    const linkedCounts = ref(props.info.find(v => v.name === "linke").count);
    const eventMap = new Map()

    eventMap.set("linke", linkeEvent(linkedCounts, isLatestLinke))

    const switchText = (name: string) => {
      let text = ""

      switch (name) {
        case "comment":
          text = "评论"
          break
        case "forward":
          text = "转发"
          break
        default:
          text = ""
          break
      }

      return text
    }


    const infoBtn = (options: Options) => {
      const linke = (icons: string | string[]) => Array.isArray(icons) ? isLinke ? `iconfont ${icons[0]}` : `iconfont ${icons[1]}` : icons

      const returnEmit = (event: Record<any, any>) =>
        ctxEmit(event.emit_name, eventMap.get(event.emit_name), event.emit_name === "linke" && isLatestLinke.value)

      return (
        <span class="flex justify-center items-center px-4 cursor-pointer icons"
          onClick={!!options?.event?.emit && (() => returnEmit(options.event))} >
          <i class={linke(options.icon)}></i>
          <p
            style="color: #b2bec3"
            class="text-sm"
          > {switchText(options.name)}{unref(options.count) === 0 ? "" : `(${unref(options.count)})`}</p>
        </span >
      )
    }



    const isLinke = computed(() => {
      if (isLatestLinke.value) return true;

      const len = props.latestLikedUsers.length;
      const userid = state.userInfo.userID;

      if (len === 0) return false;

      if (len === 1) {
        const isEqual = props.latestLikedUsers[0]["s"] === userid;

        if (isEqual) {
          return true;
        }
      }

      let before = 0;
      let after = len - 1;

      while (true) {
        const beforeId = props.latestLikedUsers[before]["s"];
        const afterId = props.latestLikedUsers[after]["s"];

        if (beforeId == userid || afterId == userid) return true;

        before += 1;
        after -= 1;

        if (before === after + 1 || before > len - 1 || after < 0) return false;
      }
    });

    isLatestLinke.value = isLinke.value;


    return () => {
      const setClass = (str_class: string) => "flex" + " " + str_class

      return (
        <section class="footer_heigth flex justify-end w-full h-full" >
          <div class="flex items-center h-full">
            <div class={props.recursion ? setClass('items-end text-sm pb-2') : setClass('items-center')}>
              {props.info.map((options) => infoBtn(options))}
            </div >
          </div>
        </section>
      )
    }
  },
});
</script>
<style scoped lang="scss">
.footer_heigth {
  height: 60px;
}

.icons {
  @include Iconfont(#74b9ff, 16);
}
</style>
