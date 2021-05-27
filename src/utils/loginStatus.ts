import { useStore } from "vuex";
import { State } from "../store/type";

export function loginStatus() {
  const store = useStore();
  return (store.state as State).userInfo === null ? false : true;
}
