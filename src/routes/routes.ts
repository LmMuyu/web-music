import { createAsComponent } from "../utils/createAsComponent";

import type { RouteRecordRaw } from "vue-router";
import type { META } from "./type/type";

const routes: (RouteRecordRaw & {
  meta?: META;
})[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "Index",
    meta: {
      defaultView: ["Discover", "DiscoverBar"],
    },
    component: () => import("../view/index/Index.vue"),
  },
  {
    path: "/playlist",
    name: "playerlist",
    meta: {
      showTags: false,
      keepAlive: false,
    },
    component: () => import("../view/playlist/PlayList.vue"),
  },
  {
    path: "/toplist",
    name: "Toplist",
    component: () => import("../layout/Index/toplist/Toplist.vue"),
  },
  {
    path: "/discover",
    name: "Discover",
    component: () => import("../layout/Index/discover/Discover.vue"),
  },
  {
    path: "/explore",
    name: "Explore",
    meta: {
      defaultView: ["ExploreContent", "ExploreRight"],
    },
    component: () => import("../view/explore/explore.vue"),
  },
  {
    path: "/message",
    name: "Message",
    meta: {
      defaultView: ["Message"],
      mainContentOptions: {
        left: {
          header: false,
        },
        right: {
          main: false,
        },
      },
    },
    component: createAsComponent(() => import("../view/message/Message.vue"), {
      loadComp: true,
    }),
  },
];

export default routes;
