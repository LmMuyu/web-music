import { App, createApp, defineAsyncComponent } from "@vue/runtime-dom";
const Login = defineAsyncComponent(() => import("./Login.vue"));

let loginInstance: App<Element> | null;
let mount = false;

//初始化组件
const Applogin = () => createApp(Login, { cancel: cancelLogin });

function cancelLogin() {
  mount = false;
  loginMethods.hidden();
}

const loginMethods = {
  show(rootElement: string) {
    loginInstance = Applogin();
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
