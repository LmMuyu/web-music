import { reactive, Ref, ref, toRef } from "vue";

interface sourcesConfig {
  message: string;
  sources: any;
  default: any;
}

function srcSatrt(src: string) {
  if (src.startsWith("https") || src.startsWith("http")) {
    return true;
  } else {
    return false;
  }
}

export default function useLoadNetwrokRes(
  src: string,
  loadstatus?: Ref<boolean>,
  sourcesconfig?: sourcesConfig,
  count?: number
) {
  const startwith = srcSatrt(src);

  const loading = loadstatus || ref<boolean>(null);
  const sources =
    sourcesconfig ||
    reactive({
      message: "",
      sources: null,
      default: null,
    });

  if (!startwith) {
    return {
      loading,
      loadnetworkmes: sources,
    };
  }

  import(src)
    .then((data) => {
      if (data.default) {
        sources.default = data.default;
      }

      loading.value = true;
      sources.sources = data;
      sources.message = "加载成功";
    })
    .catch((err) => {
      loading.value = false;
      sources.message = "加载网络资源错误:" + err + `。次数:${(count += 1)}`;

      if (count - 1 < 3) {
        useLoadNetwrokRes(
          "https://cdn.jsdelivr.net/npm/better-scroll@2.4.2/dist/better-scroll.esm.js",
          loading,
          sources,
          count
        );
      } else {
        loading.value = false;
        sources.sources = {};
      }
    });

  return {
    loading,
    loadnetworkmes: sources,
    instance: toRef(sources, "default"),
  };
}
