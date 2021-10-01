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
      setting: {
        left: {
          header: false,
        },
        right: {
          subject: false,
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
      setting: {
        left: {
          header: false,
          footer: false,
          width: 7.5,
        },
        right: {
          header: false,
          width: 2.5,
        },
      },
    },
    components: {
      section: () =>
        import("../layout/subscription/subscriptionmain/SubscriptionMain.vue"),
      article: () =>
        import(
          "../layout/subscription/subscriptionright/SubscriptionRight.vue"
        ),
    },
  },
  {
    path: "/user",
    name: "User",
    children: [
      {
        path: "home",
        name: "Home",
        meta: {
          defaultView: ["Home"],
          setting: {
            left: {
              header: false,
              footer: false,
            },
            right: {
              subject: false,
            },
          },
        },
        component: () => import("../view/user/children/ChildHome.vue"),
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
