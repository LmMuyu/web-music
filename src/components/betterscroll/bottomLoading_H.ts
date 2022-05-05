import { h, reactive, unref } from "vue";

import Loading from "../svgloading/SvgLoading.vue";

export default function (props) {
  return h(
    "div",
    {
      class: "pullup-tips",
    },
    [
      h(
        "div",
        {
          style: reactive({
            display: unref(props.isPullUpLoad) ? "block" : "none",
          }),
          class: "after-trigger",
        },
        [
          h(
            "span",
            {
              class: "pullup-txt",
            },
            h(Loading)
          ),
        ]
      ),
    ]
  );
}
