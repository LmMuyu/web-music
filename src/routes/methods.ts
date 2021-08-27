import { RouteLocationNormalized } from "vue-router";

export function addProps(routelist) {
  return routelist.map((routeItem) => ({
    ...routeItem,
    props: (route: RouteLocationNormalized) => ({ userId: route.query.userId }),
  }));
}
