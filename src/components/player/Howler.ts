import { Ref, ref, watchEffect, WatchStopHandle } from "vue";
import { useStore } from "vuex";
import filterDate from "../../utils/filterDate";
import { useRefNegate } from "../../utils/useRefNegate";
import Play from "./Play";

interface staticPlaySeekMethods {
  (): Ref<number>;
  clear(): void;
}

interface SONGS {
  id: number;
}

interface HOWLOPTIONS {
  currentIndexBackFn: (index: number) => void;
}

// const islogin = useStore().getters["login/getIslogin"];

function filterDurationTime(dt: number) {
  return filterDate(dt);
}

function fetchServeBlobData(id: number): string {
  return "";
}

export default function Howl(id: number, songlists: SONGS[], options: HOWLOPTIONS) {
  let timeseek = null;
  let stopWatch: WatchStopHandle | null = null;
  let currIndex = 0;
  let autoplay = true;
  let ismove = false;
  const playtime = ref(0);
  const { countRef: isplay, negate: changePlayIcon } = useRefNegate(autoplay);

  const how = new Play({
    on: {
      onPlay(playOrsoundid?: boolean | number | undefined) {
        typeof playOrsoundid === "boolean" ? (isplay.value = playOrsoundid) : (isplay.value = true);
      },
      onPlayerror,
    },
  });

  function onPlayerror() {}

  function createSrc(id) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }

  function playSrcSet(index: number) {
    const { id } = songlists[index];
    // if (islogin) {
    //   how.setSrc(fetchServeBlobData(id));
    // } else {
    // }
    how.setSrc(createSrc(id));
    options?.currentIndexBackFn(index);
  }

  function nextMusic() {
    if (currIndex > songlists.length - 1) {
      currIndex = 0;
    } else {
      currIndex += 1;
    }

    playSrcSet(currIndex);
  }

  function preveMusic() {
    if (currIndex === 0) {
      currIndex = songlists.length - 1;
    } else {
      currIndex--;
    }

    playSrcSet(currIndex);
  }

  const playSeek: staticPlaySeekMethods = function playSeek() {
    if (timeseek !== null) return;
    if (!ismove) {
      playtime.value = how.time_seek() ?? playtime.value;
    }

    stopWatch = watchEffect(() => {
      isplay.value ? setIntervalGetSeek() : playSeek.clear();
    });

    return playtime;
  };

  playSeek.clear = function () {
    stopWatch?.();
    stopWatch = null;

    if (!timeseek) return;
    clearInterval(timeseek);
    timeseek = null;
  };

  function setIntervalGetSeek() {
    timeseek = setInterval(() => {
      const time = how.time_seek();
      console.log(time);
      
      playtime.value = time ? time : playtime.value;
    }, 1000);
  }

  const play = () => {
    changePlayIcon();
    playSeek.clear();
    playSeek();
    how.play();
  };
  const stop = () => {
    changePlayIcon();
    how.stop();
  };
  const pause = () => {
    changePlayIcon();
    playSeek.clear();
    how.pause();
  };

  const seek = (pos: number) => {
    playSeek.clear();
    const sec = filterDate(pos, true) as number;
    how.set_seek(sec);
    playSeek();
  };

  function init() {
    how.setSrc(createSrc(id));
  }

  init();

  window.addEventListener("unload", how.unWindowHowler.bind(how), false);

  return {
    isplay,
    seek,
    play,
    stop,
    pause,
    playSeek,
    nextMusic,
    preveMusic,
    filterDurationTime,
  };
}
