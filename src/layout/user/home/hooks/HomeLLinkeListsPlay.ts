import { Ref, watchEffect, WatchStopHandle } from "vue";
import store from "../../../../store";
import { musicDetail } from "../../../../utils/musicDetail";

let watchstop: WatchStopHandle = null;

export default function HomeLLinkeListsPlay(linkes: Ref<musicDetail[]>) {
  function playermusic() {
    if (watchstop) {
      watchstop();
      watchstop = null;
    }

    watchstop = watchEffect(() => {
      if (linkes.value.length > 0) {
        if (store) {
          store.commit("playlist/musiclists", linkes.value);
          store.commit("playlist/setSongId", linkes.value[0].id);
        } else {
          console.error("store无值");
        }
      }
    });
  }

  return {
    playermusic,
  };
}
