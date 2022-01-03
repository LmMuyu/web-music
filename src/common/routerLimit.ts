import { useRouter, RouteLocationNormalized } from "vue-router";
import { loginStateus } from "../api/app/login";
import { promptbox } from "../components/promptBox";

const router = useRouter();
const pathList = ["/message", "/subscription"];

async function redirectPath(to: RouteLocationNormalized, islogin: boolean) {
  if (islogin && pathList.includes(to.path) && to.path !== "/index") {
    promptbox({ mountNode: "body", title: "请先登录!" });
    return;
  }
}

export default async function routerLimit() {
  let islogin = await loginStateus();
  console.log(islogin);

  return function beforeRouterFn(to: RouteLocationNormalized) {
    redirectPath(to, islogin);

    if (to.path.indexOf("/login") > -1 && islogin) {
      router.push("/index");
    }
  };
}
