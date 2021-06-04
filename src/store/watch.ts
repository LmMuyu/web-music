import type { Store } from "vuex";
import type { State } from "./type";

export default function initWatch(store: Store<State>) {
  
  store.watch(
    () => store.state.userInfo,
    (value) => {
      try {
        window.sessionStorage.setItem("userInfo", JSON.stringify(value));
      } catch (err) {
        console.log(err);
      }
    }
  );
}
