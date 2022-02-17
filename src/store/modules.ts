import { ModuleTree } from "vuex";

import Index from "./modules/module_index";
import Login from "./modules/module_login";
import MainTags from "./modules/module_maintags";
import Message from "./modules/module_message";
import Toplist from "./modules/module_toplist";
import Explore from "./modules/module_explore";
import Playlist from "./modules/module_playlist";

const modules: ModuleTree<any> = {
  playlist: new Playlist(),
  login: new Login(),
  maintags: new MainTags(),
  message: new Message(),
  index: new Index(),
  toplist: new Toplist(),
  explore: new Explore(),
};

export default modules;
