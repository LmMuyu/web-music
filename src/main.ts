import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "tailwindcss/tailwind.css";
import "./view/login/login";
import hover from "./directives/hover";

const app = createApp(App);
app.directive(hover.name, hover);

app.use(router);
app.mount("#app");
