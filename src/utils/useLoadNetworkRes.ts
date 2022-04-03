import { reactive, Ref, ref, toRef } from "vue";

interface RemoteModule {
  value: object;
}

interface sourcesConfig {
  message: string;
  loadResult: Ref<boolean>;
  sources?: any;
  module?: RemoteModule | null;
}

function srcSatrt(src: string) {
  if (src.startsWith("https") || src.startsWith("http")) {
    return true;
  } else {
    return false;
  }
}

export default async function useLoadNetwrokRes<R extends Ref<boolean>>(
  src: string,
  loadstatus?: R
): Promise<sourcesConfig> {
  const startwith = srcSatrt(src);

  const loading = loadstatus || (ref<boolean>(null) as R);
  const sources = reactive({
    message: "",
    sources: null,
    default: null,
  });

  if (!startwith) {
    loading.value = false;
    return {
      loadResult: loading,
      message: "src startWith no http/https error",
    };
  }
  console.log(true);

  try {
    const data = await import(src);
    if (data.default) {
      sources.default = data.default;
    }

    loading.value = true;
    sources.sources = data;
    sources.message = "加载成功";

    return {
      sources,
      loadResult: loading,
      message: sources.message,
      module: toRef(sources, "default"),
    };
  } catch (error) {
    loading.value = false;
    sources.message = "加载网络资源错误" + error;
    return Promise.reject({
      sources,
      module: null,
      loadResult: loading,
      message: sources.message,
    });
  }
}
