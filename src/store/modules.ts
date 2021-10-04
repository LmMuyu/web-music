import { ModuleTree } from "vuex";

import Login from "./modules/module_login";
import MainTags from "./modules/module_maintags";
import Message from "./modules/module_message";

const modules: ModuleTree<any> = {
  login: new Login(),
  maintags: new MainTags(),
  message: new Message(),
};

export default modules;
