import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "tailwindcss/tailwind.css";
import "./view/login/login"

const app = createApp(App);

app.use(router);
app.mount("#app");
