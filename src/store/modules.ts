import { ModuleTree } from "vuex";

import Index from "./modules/module_index";
import Login from "./modules/module_login";
import MainTags from "./modules/module_maintags";
import Message from "./modules/module_message";

const modules: ModuleTree<any> = {
  login: new Login(),
  maintags: new MainTags(),
  message: new Message(),
  index: new Index(),
};

export default modules;
