import store from "../store";

import type { RouteRecordRaw } from "vue-router";
import type { META } from "./type/type";

// name=section name=article

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
    redirect: "/index/recommend",
    meta: {},
    children: [
      {
        path: "recommend",
        name: "Recommend",
        component: () => import("../layout/Index/discover/Recommend.vue"),
      },
      {
        path: "toplist",
        name: "Toplist",
        component: () => import("../layout/Index/toplist/Toplist.vue"),
      },
    ],
    components: {
      section: () => import("../layout/Index/index/Index.vue"),
    },
  },
  {
    path: "/playlist",
    name: "Playerlist",
    meta: {
      isShowTags: false,
      keepAlive: false,
    },
    component: () => import("../view/playlist/PlayList.vue"),
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
    beforeEnter(to) {
      const path = to.path;
      const count = to.meta.fetchCount as number;

      if (path === "/message" && count === 0) {
        console.log("/message");

        store.dispatch("message/fetchPrivateMsg", () => {
          to.meta.fetchCount = count + 1;
        });
      }
    },
    meta: {
      setting: {
        left: {
          header: false,
          width: 3,
        },
        right: {
          header: false,
          width: 7,
        },
      },
      fetchCount: 0,
    },
    components: {
      section: () =>
        import("../layout/message/privatemsgpeople/PrivateMsgPeople.vue"),
      article: () =>
        import("../layout/message/privatemsgcontent/PrivateMsgContent.vue"),
    },
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
  // {
  //   path: "/user",
  //   name: "User",
  //   children: [
  //     {
  //       path: "home",
  //       name: "Home",
  //       meta: {
  //         defaultView: ["Home"],
  //         setting: {
  //           left: {
  //             header: false,
  //             footer: false,
  //           },
  //           right: {
  //             subject: false,
  //           },
  //         },
  //       },
  //       component: () => import("../view/user/children/ChildHome.vue"),
  //     },
  //   ],
  //   component: () => import("../view/user/User.vue"),
  // },
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
