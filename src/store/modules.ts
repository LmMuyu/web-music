import { ModuleTree } from "vuex";

import Login from "./modules/module_login";

const modules: ModuleTree<any> = {
  login: new Login(),
};

export default modules;
