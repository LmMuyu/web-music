import type { RouteRecordRaw } from "vue-router";
import type { META, Route } from "./type/type";
import createRoute from "./path/createRoute";

const pathList = [
  "song",
  "playList",
  "video",
  "sim_query",
  "mlog",
  "talk",
  "artist",
  "album",
  "djRadio",
  "user",
];

const routes: RouteRecordRaw[] | Route[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "Index",
    redirect: "/index/discover",
    children: [
      {
        path: "discover",
        name: "Discover",
        component: () => import("../layout/Index/discover/Discover.vue"),
      },
      {
        path: "toplist",
        name: "Toplist",
        component: () => import("../layout/Index/toplist/Toplist.vue"),
      },
    ],
    component: () => import("../view/index/Index.vue"),
  },
  {
    path: "/playlist",
    name: "PlayList",
    component: () => import("../view/playlist/PlayList.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../view/search/Search.vue"),
  },
];

export default routes;
