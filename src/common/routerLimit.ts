import { useRouter, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
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
  let statuslogin = await loginStateus();

  return function beforeRouterFn<R extends RouteLocationNormalized, N extends NavigationGuardNext>(
    to: R,
    from: R,
    next: N
  ) {
    if (to.path.indexOf("/login") > -1 && !statuslogin) {
      to.redirectedFrom && to.redirectedFrom.path === to.path ? next() : next("/login");
    } else {
      next();
    }
  };
}
