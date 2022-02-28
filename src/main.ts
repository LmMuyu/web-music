import mitt from "mitt";
import store from "./store";
import App from "./App.vue";
import router from "./routes";
import { createApp } from "vue";
import hover from "./directives/hover";
import lazy from "./directives/lazy-loading";
import AsayncSuspense from "./components/suspense/AsayncSuspense.vue";

import "element-plus/theme-chalk/el-icon.css";
import "element-plus/dist/index.css";
import { setCookie } from "./utils/request/response/result";
import { useLocalStorage } from "./utils/useLocalStorage";

// const cookie = JSON.parse(JSON.stringify(useLocalStorage("tokenStrObj"))).cookie;

// //@ts-ignore
// setCookie({
//   data: {
//     cookie,
//   },
// });

const app = createApp(App);

app.component("AsayncSuspense", AsayncSuspense);

app.directive(hover.name, hover);
app.directive("lazy", lazy("./assets/图片加载中.png"));

app.config.globalProperties.store = store;
app.config.globalProperties.mittBus = mitt();

app.use(router);
app.use(store);
app.mount("#app");
