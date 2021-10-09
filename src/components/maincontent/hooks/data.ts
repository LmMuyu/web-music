import type { createAsComponentOptions } from "../../../utils/createAsComponent";

interface importMapCompsOptions {
  options?: createAsComponentOptions;
  position: "main" | "right";
}


export const importCompsList = new Map<string, importMapCompsOptions>();
importCompsList
  .set("Discover", {
    position: "main",
  })
  .set("Toplist", {
    position: "main",
  })
  .set("ExploreContent", {
    position: "main",
  })
  .set("TopListAsideTag", {
    options: {
      loadComp: false,
    },
    position: "right",
  })
  .set("DiscoverBar", {
    options: {
      loadComp: false,
    },
    position: "right",
  })
  .set("ExploreRight", {
    options: {
      loadComp: false,
    },
    position: "right",
  })
  .set("Message", {
    options: {
      loadComp: true,
    },
    position: "main",
  })
  .set("SubscriptionContent", {
    options: {
      loadComp: false,
    },
    position: "main",
  })
  .set("SubscriptionRight", {
    options: {
      loadComp: false,
    },
    position: "right",
  })
  .set("Home", {
    options: {
      loadComp: false,
    },
    position: "main",
  });
