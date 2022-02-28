import { Ref, ref, watchEffect, WatchStopHandle } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import filterDate from "../../utils/filterDate";
import { isType } from "../../utils/methods";
import { musicDetail } from "../../utils/musicDetail";
import { useRefNegate } from "../../utils/useRefNegate";
import Play from "./Play";

interface staticPlaySeekMethods {
  (): Ref<number>;
  clear(): void;
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

export default function Howl(songlists: musicDetail[], options: HOWLOPTIONS) {
  let timeseek = null;
  let currIndex = 0;
  let preIndex = currIndex;
  let autoplay = initAutoPlay();
  let ismove = false;
  let initfirst = false;
  const playtime = ref(0);
  const palylists = ref<musicDetail[]>(songlists.slice(0));
  const { countRef: isplay, negate: changePlayIcon } = useRefNegate(autoplay);
  let stopWatch: WatchStopHandle | null = null;

  const how = new Play({
    on: {
      onPlay(playOrsoundid?: boolean | number | undefined) {
        typeof playOrsoundid === "boolean" ? (isplay.value = playOrsoundid) : (isplay.value = true);
      },
      onPlayerror,
    },
    autoplay,
  });

  function onPlayerror() {}

  function createSrc(id: number) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }

  function playSrcSet(index: number) {
    const { id } = palylists.value[index];
    if (!id) return;

    // if (islogin) {
    //   how.setSrc(fetchServeBlobData(id));
    // } else {
    // }
    how.setSrc(createSrc(id));
    options?.currentIndexBackFn(index);
  }

  function initAutoPlay() {
    console.log(useRoute().path);
    return useRoute().path === "/playlist" ? true : false;
  }

  function nextMusic() {
    if (currIndex > palylists.value.length - 1) {
      currIndex = 0;
    } else {
      currIndex += 1;
    }

    playSrcSet(currIndex);
  }

  function preveMusic() {
    if (currIndex === 0) {
      currIndex = palylists.value.length - 1;
    } else {
      currIndex--;
    }

    playSrcSet(currIndex);
  }

  const playSeek: staticPlaySeekMethods = function playSeek() {
    if (timeseek !== null) return;
    if (!how.playing) return playtime;

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

  function volume(volume?: number): number {
    const howVolume = how.set_volume(volume);
    return howVolume;
  }

  function setPlayLists(lists: any[] | any) {
    palylists.value.unshift(...(isType(lists) === "Array" ? lists : [lists]));
  }

  function initCurrentIndex(songinfo: musicDetail) {
    const index = palylists.value.findIndex((value) => value.id === songinfo.id);
    return (currIndex = index > -1 ? index : 0);
  }

  function moveMusicFirst(songinfo: musicDetail) {}

  watchEffect(() => {
    if (palylists.value.length) {
      console.log({ currIndex, preIndex });
      if (currIndex !== preIndex || !initfirst) {
        initfirst = true;
        playSrcSet(currIndex);
        preIndex = currIndex;
      }
    }
  });

  window.addEventListener("unload", how.unWindowHowler.bind(how), false);

  return {
    isplay,
    seek,
    play,
    stop,
    pause,
    volume,
    preveMusic,
    playSeek,
    nextMusic,
    setPlayLists,
    initCurrentIndex,
    filterDurationTime,
  };
}
