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
    components: {
      default: () => import("../layout/index/Index.vue"),
    },
  },
  {
    path: "/playlist",
    name: "Playlist",
    meta: {
      isShowTags: false,
      keepAlive: false,
      padding: "none",
    },
    components: {
      default: () => import("../layout/playlist/PlayList.vue"),
    },
  },
  {
    path: "/message",
    name: "Message",
    components: {
      default: () => import("../layout/message/Message.vue"),
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
      section: () => import("../layout/subscription/subscriptionmain/SubscriptionMain.vue"),
      article: () => import("../layout/subscription/subscriptionright/SubscriptionRight.vue"),
    },
  },
  {
    path: "/user",
    name: "User",
    redirect: "/user/home",
    meta: {
      setting: {
        left: {
          header: false,
          footer: false,
        },
        right: {
          subject: false,
        },
      },
      showtiao: false,
      query: ["uid", "isself"],
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("../layout/user/home/Home.vue"),
      },
      {
        path: "songs",
        name: "Songs",
        component: () => import("../layout/user/songs/Songs.vue"),
      },
    ],
    components: {
      default: () => import("../layout/user/User.vue"),
    },
  },
  {
    path: "/login",
    name: "Login",
    components: {
      default: () => import("../layout/login/LoginMain.vue"),
    },
  },
  {
    path: "/explore",
    name: "Explore",
    components: {
      default: () => import("../layout/explore/Explore.vue"),
    },
  },
  {
    path: "/songdetail",
    name: "SongDetail",
    components: {
      default: () => import("../layout/songdetail/SongDetail.vue"),
    },
    meta: {
      showTags: false,
      query: ["id"],
    },
  },
  {
    path: "/searchres",
    name: "Searchres",
    components: {
      default: () => import("../layout/displaysearchresult/DisplaySearchResult.vue"),
    },
  },
  {
    path: "/video",
    name: "Video",
    components: {
      default: () => import("../layout/playervideo/PlayerVideo.vue"),
    },
  },
  {
    path: "/404",
    name: "404",
    components: {
      default: () => import("../components/404/404.vue"),
    },
    meta: {
      showTags: false,
    },
  },
];

export default routes;
