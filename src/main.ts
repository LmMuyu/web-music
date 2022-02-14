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

const app = createApp(App);

app.component("AsayncSuspense", AsayncSuspense);

app.directive(hover.name, hover);
app.directive("lazy", lazy("./assets/图片加载中.png"));

app.config.globalProperties.store = store;
app.config.globalProperties.mittBus = mitt();

app.use(router);
app.use(store);
app.mount("#app");
