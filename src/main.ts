import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "tailwindcss/tailwind.css";
import "./view/login/login";
import hover from "./directives/hover";
import lazy from "./directives/lazy-loading";

const app = createApp(App);
app.directive(hover.name, hover);
app.directive("lazy", lazy);

app.use(router);
app.mount("#app");
