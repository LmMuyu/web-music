import mitt from "mitt";
import store from "./store";
import App from "./App.vue";
import router from "./routes";
import { createApp } from "vue";
import hover from "./directives/hover";
import lazy from "./directives/lazy-loading";
import { setCookie } from "./utils/request/response/result";

import "element-plus/theme-chalk/el-icon.css";
import "element-plus/dist/index.css";

function client_cookie() {
  const data = JSON.parse(localStorage.getItem("tokenStrObj"));
  if (!data) return;

  //@ts-ignore
  setCookie({ data: { cookie: data.cookie } });
}

client_cookie();

const app = createApp(App);
app.directive(hover.name, hover);
app.directive("lazy", lazy);

app.config.globalProperties.store = store;
app.config.globalProperties.mittBus = mitt();

app.use(router);
app.use(store);
app.mount("#app");
