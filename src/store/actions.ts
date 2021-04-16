import { countries } from "../api/app/requestMain";

export default {
  async countriesCode(context: { commit: (arg0: string, arg1: any) => void }) {
    try {
      const { data } = await countries();

      context.commit("countriesCode", data);
    } catch (err) {
      console.log(err);
    }
  },
};
