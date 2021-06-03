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
    name: "playerlist",
    meta: {
      showTag: true,
      keepAlive: false,
    },
    component: () => import("../view/playlist/PlayList.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../view/search/Search.vue"),
  },
  {
    path: "/searchresult",
    name: "searchResult",
    component: () => import("../view/searchresult/SearchResult.vue"),
  },
];

export default routes;
