import type { createAsComponentOptions } from "../../../utils/createAsComponent";

interface importMapCompsOptions {
  options?: createAsComponentOptions;
  position: "main" | "right";
}

export const contentTags = [
  {
    _id: "1000",
    tagname: "推荐",
    comname: "Discover",
    comchildren: "DiscoverBar",
  },
  {
    _id: "1001",
    tagname: "排行榜",
    comname: "Toplist",
    comchildren: "TopListAsideTag",
  },
  {
    _id: "1002",
    tagname: "歌单",
    comname: "playlist",
  },
  {
    _id: "1003",
    tagname: "主播电台",
    comname: "djradio",
  },
  {
    _id: "1004",
    tagname: "歌手",
    comname: "artist",
  },
  {
    _id: "1005",
    tagname: "新碟上映",
    comname: "album",
  },
];

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
  });
