import { App, createApp, defineAsyncComponent } from "@vue/runtime-dom";
const Login = defineAsyncComponent(() => import("./Login.vue"));

interface OPTIONS {
  el: string;
}

export default function loginApp(optins: OPTIONS) {
  let { el } = optins;
  let loginInstance: App<Element> | undefined;
  const Applogin = createApp(Login);

  el = el ? el : "#login";

  return {
    show() {
      if (!loginInstance) {
        loginInstance = Applogin;
        loginInstance.mount(el);
        return;
      }

      loginInstance.mount(el);
    },
    hidden() {
      loginInstance && loginInstance.unmount();
    },
  };
}
