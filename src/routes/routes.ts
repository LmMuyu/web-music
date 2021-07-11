import type { RouteRecordRaw } from "vue-router";
import type { META } from "./type/type";
// import createRoute from "./path/createRoute";

// const pathList = [
//   "song",
//   "playList",
//   "video",
//   "sim_query",
//   "mlog",
//   "talk",
//   "artist",
//   "album",
//   "djRadio",
//   "user",
// ];

const routes: (RouteRecordRaw & META)[] = [
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
];

export default routes;
