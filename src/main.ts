import mitt from "mitt";
import store from "./store";
import App from "./App.vue";
import router from "./routes";
import { createApp } from "vue";
import hover from "./directives/hover";
import lazy from "./directives/lazy-loading";
// import { windowRem } from "./utils/useDocuemntRem";

import "./view/login/login";
import "tailwindcss/tailwind.css";
import "element-plus/lib/theme-chalk/el-icon.css";

// windowRem();

const app = createApp(App);
app.directive(hover.name, hover);
app.directive("lazy", lazy);

app.config.globalProperties.store = store;
app.config.globalProperties.mittBus = mitt();

app.use(router);
app.use(store);
app.mount("#app");
