import { ModuleTree } from "vuex";

import Login from "./modules/module_login";
import MainTags from "./modules/module_maintags";

const modules: ModuleTree<any> = {
  login: new Login(),
  maintags: new MainTags(),
};

export default modules;
