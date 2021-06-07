import { shallowRef } from "@vue/reactivity";
import { createAsComponent } from "../../../../utils/createAsComponent";

const Toplist = createAsComponent("/layout/Index/toplist/Toplist.vue");

export const componentId = shallowRef(Toplist);
