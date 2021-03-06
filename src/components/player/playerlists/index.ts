import { App, createApp } from "vue";
import router from "../../../routes";
import store from "../../../store";
import PlayerLists from "./PlayerLists.vue";
import { ElContainer, ElHeader, ElMain, ElRow, ElCol } from "element-plus";
import dexie from "../../../common/dexie";

export default class playerLists {
  data: any[];
  app: App<Element>;
  mountel: HTMLDivElement;
  comps: any[];
  mounting: boolean;
  constructor() {
    this.data = [];
    this.app = null;
    this.comps = [ElContainer, ElHeader, ElMain, , ElRow, ElCol];
    this.mounting = false;
    this.songs();
  }

  mount() {
    if (this.mounting) return;

    this.app = this.app ? this.app : createApp(PlayerLists, { data: this.data });
    this.plugin(this.app, [router, store]);
    this.components(this.app, this.comps);
    const mountnode = this.node();
    this.app.mount(mountnode);
    this.mounting = true;
  }

  unmount() {
    if (this.mounting && this.app) {
      this.app.unmount();
      this.app = null;
      const node = document.querySelector("body");
      node.removeChild(this.mountel);
      this.mountel = null;
      this.mounting = false;
    }
  }

  node() {
    this.mountel = document.createElement("div");
    this.mountel.classList.add(...["absolute", "top-0", "right-0", "playerlists", "w-2/6", "z-10"]);
    const body = document.querySelector("body");
    body.appendChild(this.mountel);
    return this.mountel;
  }

  plugin(app: App, plugins: any[]) {
    plugins.forEach((plugin) => app.use(plugin));
  }

  components(app: App, comps: any[]) {
    comps.forEach((comp) => app.component(comp.name, comp));
  }

  async songs() {
    const mydexie = await dexie();
    const songlists = (await mydexie.getAllSong()).map((music) => music.songinfo);
    this.data.push(...songlists);
  }
}
