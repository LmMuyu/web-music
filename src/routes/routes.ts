interface META {
  showTag?: boolean;
}

interface Route {
  path: string;
  redirect?: string;
  name?: string;
  meta?: META;
  children?: Route[];
  component?: () => Promise<typeof import("*.vue")>;
}

const routes: Route[] = [
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
];

export default routes;
