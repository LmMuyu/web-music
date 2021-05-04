import { App, createApp, defineAsyncComponent } from "@vue/runtime-dom";
const Login = defineAsyncComponent(() => import("./Login.vue"));
import store from "../../store";
import mitt from "mitt";

let loginInstance: App<Element> | null;
let mount = false;

//初始化组件
const Applogin = () => createApp(Login, { cancel: cancelLogin });

function cancelLogin() {
  mount = false;
  loginMethods.hidden();
}
function setPlugin(element: App<Element>) {
  element.config.globalProperties.mitt = mitt();
  element.use(store);
}

const loginMethods = {
  show(rootElement: string) {
    loginInstance = Applogin();
    Promise.resolve().then(() => setPlugin(loginInstance!));
    loginInstance.mount(rootElement);
  },
  hidden() {
    loginInstance && loginInstance.unmount();
  },
};

export default function loginApp(el: string) {
  el = el ? el : "#login";

  if (mount) return; //登录对话框在挂在中

  mount = true;
  loginMethods.show(el);
}
