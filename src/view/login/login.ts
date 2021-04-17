import { App, createApp, defineAsyncComponent } from "@vue/runtime-dom";
const Login = defineAsyncComponent(() => import("./Login.vue"));
import store from "../../store";

let loginInstance: App<Element> | null;
let mount = false;

//初始化组件
const Applogin = () => createApp(Login, { cancel: cancelLogin });

function cancelLogin() {
  mount = false;
  loginMethods.hidden();
}
function setPlugin(element: App<Element>) {
  element.use(store);
}

// function setPlugin(
//   element: App<Element>,
//   useList: Array<any>,
//   config: AppConfig
// ) {
//   function setConfig(pre: any, obj: object) {
//     for (const key in obj) {
//       pre[key] = obj[key];
//     }
//   }

//   useList.forEach(async (use) => {
//     try {
//       element.use(use);
//     } catch (err) {
//       console.log(err);
//     }
//   });

//   for (const key in config) {
//     if (isType(key) === "Object") {
//       setConfig(element.config[key], config[key]);
//     } else {
//       element.config
//     }
//   }
// }

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
