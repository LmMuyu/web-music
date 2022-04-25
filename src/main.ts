import mitt from "mitt";
import store from "./store";
import App from "./App.vue";
import router from "./routes";
import { createApp } from "vue";
import hover from "./directives/hover";
import TextEditor from "vue3-text-editor";
import lazy from "./directives/lazy-loading";
import AsayncSuspense from "./components/suspense/AsayncSuspense.vue";

import "element-plus/theme-chalk/el-icon.css";
import "vue3-text-editor/css/index.css";
import "element-plus/dist/index.css";

const app = createApp(App);

app.use(TextEditor);
app.component("AsayncSuspense", AsayncSuspense);

app.directive(hover.name, hover);
app.directive("lazy", lazy("./assets/图片加载中.png"));

app.config.globalProperties.store = store;
app.config.globalProperties.mittBus = mitt();

app.use(router);
app.use(store);
app.mount("#app");
