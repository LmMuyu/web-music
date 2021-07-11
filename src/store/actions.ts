import type { Ref } from "@vue/reactivity";
import { ref } from "@vue/reactivity";
import { countries } from "../api/app/requestMain";
import { getUserInfoData } from "../api/app/userInfo";
import { useLocalStorage } from "../utils/useLocalStorage";

import type { UserInfo } from "./type";

type Commit = (type: string, payload?: any, options?: Object) => void;

export default {
  async countriesCode(context: { commit: (arg0: string, arg1: any) => void }) {
    try {
      const countriesList: Ref<string> = ref("");
      countriesList.value = useLocalStorage("countries").value;

      if (!countriesList.value) {
        const { data } = await countries();

        countriesList.value = useLocalStorage(
          "countries",
          JSON.stringify(data.data)
        ).value;
      }

      context.commit("countriesCode", JSON.parse(countriesList.value));
    } catch (err) {
      console.log(err);
    }
  },
};
