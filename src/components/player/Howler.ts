import {
  ComponentInternalInstance,
  computed,
  Ref,
  ref,
  watch,
  watchEffect,
  WatchStopHandle,
} from "vue";

import Play from "./Play";
import store from "../../store";
import { isType } from "../../utils/methods";
import filterDate from "../../utils/filterDate";
import { musicDetail } from "../../utils/musicDetail";
import { useRefNegate } from "../../utils/useRefNegate";
import { useWatchRoutePath } from "../../utils/useWatchHost";
import { getLyrics, getMusicDetail } from "../../api/playList";
import { setIndexDBAAllDataToHowlLists, twoSearch, watchMusicinfo } from "./methods";

type compinstance = ComponentInternalInstance;

interface staticPlaySeekMethods {
  (): Ref<number>;
  clear(): void;
}

interface HOWLOPTIONS {
  musicinfoRef: Ref<musicDetail>;
}

function filterDurationTime(dt: number) {
  return filterDate(dt);
}

const Howl = (options: HOWLOPTIONS, ctx: compinstance) => {
  let timeseek = null;
  let currIndex = 0;
  let autoplay = false;
  let ismove = false;
  let initfirst = false;
  let playlistsLen = 0;
  const playtime = ref(0);
  const maxTime = ref(0);
  const palylists = ref<musicDetail[]>([]);
  let stopWatch: WatchStopHandle | null = null;
  const lyricsmap = new Map<number, string>();
  let watchTheMusicInfo = JSON.parse(JSON.stringify(options.musicinfoRef.value ?? {}));
  const { countRef: isplay, negate: changePlayIcon } = useRefNegate(autoplay);

  watchMusicinfo(options.musicinfoRef, maxTime);

  const how: Play = new Play({
    on: {
      onPlay() {
        console.log("play");
        isplay.value = true;
        play();
      },
      onPause() {
        console.log("pause");
        isplay.value = false;
      },
      onPlayerror(err) {
        console.log(err);
      },
      onEnd() {
        playSeek.clear();
        mmusicEndNext();
      },
    },
    autoplay,
  });

  const watchRoute = useWatchRoutePath();

  const routeWatchStop = watch(watchRoute, (path) => {
    const excludePaths = ["/video"];
    if (excludePaths.indexOf(path.path) > -1) {
      stop();
      changePlayIcon();
      playSeek.clear();
    }
  });

  function mmusicEndNext() {
    const mitt = ctx.appContext.config.globalProperties["mittBus"];
    mitt.emit("musicend");

    if (!how.audio_loop) {
      nextMusic();
    }
  }

  function nextMusic() {
    currIndex += 1;
    if (currIndex > palylists.value.length - 1) {
      currIndex = 0;
    }

    playtime.value = 0;
    playSrcSet(currIndex);
  }

  function preveMusic() {
    currIndex -= 1;
    if (currIndex < 0) {
      currIndex = palylists.value.length - 1;
    }

    playtime.value = 0;
    playSrcSet(currIndex);
  }

  function againPlayIndexPos(mid: number) {
    const index = palylists.value.findIndex((music) => music.id === mid);

    if (index > -1) {
      playtime.value = 0;
      playSrcSet(index);

      return true;
    }

    return false;
  }

  function createSrc(id: number) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }

  function playSrcSet(index: number) {
    console.log(index);

    return new Promise(async (resolve) => {
      const musicdetail = palylists.value[index];
      if (!musicdetail.id) return;

      musicFoundation(musicdetail);
      how.setSrc(createSrc(musicdetail.id));
      store.commit("playlist/setSongId", musicdetail.id); //将第一首歌曲id写入stroe
      resolve(true);
    });
  }

  const playSeek: staticPlaySeekMethods = function playSeek() {
    if (timeseek !== null) return;
    if (!how.playing) return playtime;

    if (!ismove) {
      playtime.value = how.time_seek() ?? playtime.value;
    }

    playSeek.clear();

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

      if (time === undefined) {
        console.log("歌曲播放时间undefined");
        return;
      }

      documentTitle(twoSearch(time, lyricsmap), time);
      playtime.value = time ? time : playtime.value;
    }, 1000);
  }

  function documentTitle(lycTimeList: [number, number], time: number) {
    store.commit("subMitt", ["seek_time", [lycTimeList[1], time]]);
    const lrc = lyricsmap.get(lycTimeList[0]);
    // console.log(lrc);

    if (lrc) {
      const musicdetail = options.musicinfoRef.value;
      document.title = `${musicdetail.name}-${lrc}`;
    } else {
      console.warn(lycTimeList + ":" + lrc);
    }
  }

  function play() {
    if (!how.how_playing) {
      changePlayIcon();
    }

    playSeek.clear();
    how.play();
    playSeek();
  }

  const stop = () => {
    changePlayIcon();
    how.stop();
  };

  const pause = () => {
    if (!how.how_playing) {
      changePlayIcon();
    }

    playSeek.clear();
    how.pause();
  };

  const seek = (pos: number) => {
    console.log(pos);
    playSeek.clear();
    const sec = filterDate(pos, true) as string;
    console.log(sec);
    how.set_seek(Number(sec));
    playSeek();
  };

  function volume(volume?: number): number {
    const howVolume = how.set_volume(volume);
    return howVolume;
  }

  function setImmdPlayLists(lists: any[] | any) {
    palylists.value.unshift(...(isType(lists) === "Array" ? lists : [lists]));
  }

  function initCurrentIndex(songinfo: musicDetail) {
    const index = palylists.value.findIndex((value) => value.id === songinfo.id);
    return (currIndex = index > -1 ? index : 0);
  }

  function watchImmediatelyPlayMusics() {
    let isonewatch = true;
    watchEffect(async () => {
      if (palylists.value.length && palylists.value.length !== playlistsLen && !isonewatch) {
        playlistsLen = palylists.value.length;
        const firstListsMusicData = palylists.value[0];

        if (firstListsMusicData.id !== watchTheMusicInfo.id || !initfirst) {
          initfirst = true;
          playSrcSet(0);
        }
      } else {
        isonewatch = false;
      }
    });
  }
  function watchLaterPlayQueue() {
    const musiclists = computed<musicDetail[]>(store.getters["playlist/getMusiclists"]);
    watchEffect(() => {
      if (musiclists.value.length > 0) {
        duplicateRemoval(musiclists.value);
        setImmdPlayLists(musiclists.value);
      }
    });
  }

  function duplicateRemoval(musiclists: musicDetail[]) {
    musiclists.map((music) => {
      const index = palylists.value.findIndex((song) => music.id === song.id);

      if (index === -1) return music;
      palylists.value.splice(index, 1);
    });
  }

  watchLaterPlayQueue();

  function musicFoundation(musicdetail: musicDetail) {
    if (musicdetail !== options.musicinfoRef.value) {
      options.musicinfoRef.value = musicdetail;
      watchTheMusicInfo = musicdetail;
    }

    getLyrics(String(musicdetail.id)).then((lyrics) => {
      const lrc = lyrics.data.lrc.lyric;
      setmaplyrics(lrc);
    });
  }

  async function retMusicData(musicifno: any) {
    if (!(musicifno instanceof musicDetail)) {
      const reqdata = await getMusicDetail(musicifno.id);
      const song = reqdata.data.songs[0];
      const songInfo = new musicDetail(song);

      return songInfo;
    } else {
      return true;
    }
  }

  function setmaplyrics(lrc: string) {
    const lrcworker = new Worker("src/worker/lrc.js");
    lyricsmap.clear();

    lrcworker.onmessage = function ({ data }) {
      if (data === "close") {
        lrcworker.terminate();
      } else {
        lyricsmap.set(data.showtime, data.lrc);
      }
    };

    lrcworker.postMessage(lrc);
  }

  window.addEventListener("unload", how.unWindowHowler.bind(how), false);

  setIndexDBAAllDataToHowlLists(setImmdPlayLists, watchImmediatelyPlayMusics);
  return {
    seek,
    play,
    stop,
    pause,
    isplay,
    volume,
    maxTime,
    playSeek,
    palylists,
    preveMusic,
    nextMusic,
    setImmdPlayLists,
    initCurrentIndex,
    filterDurationTime,
    againPlayIndexPos,
    routeWatchStop,
    loop: how.set_loop,
  };
};

export default Howl;
