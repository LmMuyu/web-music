import { createAsComponent } from "../utils/createAsComponent";

import { RouteRecordRaw } from "vue-router";
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
  {
    path: "/subscription",
    name: "Subscription",
    meta: {
      defaultView: ["SubscriptionContent", "SubscriptionRight"],
      mainContentOptions: {
        left: {
          header: false,
          footer: false,
        },
        right: {
          header: false,
        },
      },
    },
    component: () => import("../view/subscription/Subscription.vue"),
  },
  {
    path: "/user",
    name: "User",
    redirect: "/user/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../view/user/children/Home.vue"),
      },
    ],
    component: () => import("../view/user/User.vue"),
  },
  {
    path: "/activity",
    name: "Activity",
    component: () => import("../view/activity/Activity.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      showTags: false,
    },
    component: () => import("../view/login/Login.vue"),
  },
];

export default routes;
