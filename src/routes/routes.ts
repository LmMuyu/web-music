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
    components: {
      default: () => import("../layout/subscription/Subscription.vue"),
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
      //issinger:boolean
      query: ["uid", "isself", "issinger"],
    },
    children: [
      {
        path: "home",
        name: "UserHome",
        component: () => import("../layout/user/home/Home.vue"),
      },
      {
        path: "songs",
        name: "UserSongs",
        component: () => import("../layout/user/songs/Songs.vue"),
      },
      {
        path: "single",
        name: "UserSingle",
        components: {
          default: () => import("../layout/songdetail/SongDetail.vue"),
        },
        meta: {
          query: ["id"],
        },
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
    meta: {
      mainhidden: true,
    },
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
  {
    path: "/topic",
    name: "Topic",
    components: {
      default: () => import("../layout/topic/Topic.vue"),
      query: ["tid"],
    },
  },
  {
    path: "/setting",
    name: "Setting",
    components: {
      default: () => import("../layout/setting/Setting.vue"),
    },
  },
  {
    path: "/indexvideo",
    name: "IndexvIdeo",
    components: {
      default: () => import("../layout/video/Video.vue"),
    },
  },
];

export default routes;
