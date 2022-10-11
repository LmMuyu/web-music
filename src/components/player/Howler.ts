import {
  ComponentInternalInstance,
  computed,
  nextTick,
  Ref,
  ref,
  watch,
  watchEffect,
  WatchStopHandle,
} from "vue";

import Play from "./Play";
import store from "../../store";
import dexie from "../../common/dexie";
import { getLyrics } from "../../api/playList";
import filterDate from "../../utils/filterDate";
import { musicDetail } from "../../utils/musicDetail";
import { useRefNegate } from "../../utils/useRefNegate";
import { useWatchRoutePath } from "../../utils/useWatchHost";
import { indexDBAllLists, lyric, twoSearch, watchMusicinfo } from "./methods";
import { MatchItem } from "../../layout/playlist/type";
import { useLocalStorage } from "../../utils/useLocalStorage";

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

function initMusicPlay(autoplay: boolean) {
  const how: Play = new Play({ autoplay });

  return {
    how,
  };
}

//获取进入网页后的第一首歌曲
function firstSong(musiclist: musicDetail[]) {
  const first = musiclist[0];
  store.commit("playlist/setSongInfo", first);
  return first;
}

function findMusicLists(musiclist: musicDetail[], id: number) {
  const music = musiclist.find((musicDetail) => musicDetail.id === id);
  store.commit("playlist/setSongInfo", music);

  return music;
}

function async_p() {
  let _resolve: (value: unknown) => void = null;

  const p = new Promise((resolve) => {
    _resolve = resolve;
  });

  return {
    p,
    _resolve,
  };
}

function saveLastSong(mid: number) {
  useLocalStorage("savelastsong", mid);
  console.log(mid);
}

function localSvaeLastSong(): number | undefined {
  const saveLastSongMid = useLocalStorage("savelastsong").value;
  return saveLastSongMid ? saveLastSongMid : undefined;
}

const Howl = async (options: HOWLOPTIONS, ctx: compinstance) => {
  let timeseek = null;
  let currIndex = 0;
  let autoplay = false;
  let ismove = false;
  const playtime = ref(0);
  const maxTime = ref(0);
  const palylists = ref<musicDetail[]>([]);
  let lyclists: MatchItem[] = [];
  let stopWatch: WatchStopHandle | null = null;
  const lyricsmap = new Map<number, string>();
  const { countRef: isplay, negate: changePlayIcon } = useRefNegate(autoplay);
  let nowPlayingMid = 0;
  let stopMusicLists = null;
  let initfirstmusic = false;

  //用来监听修改每一次歌曲时长
  watchMusicinfo(options.musicinfoRef, maxTime);

  //初始化操作
  async function init() {
    const islogin = computed(() => store.getters["login/getIslogin"]);
    const dexieInstance = await dexie();
    const { _resolve, p } = async_p();
    let preventNull: WatchStopHandle = null;

    //清空播放列表
    palylists.value = [];

    if (islogin.value === null) {
      preventNull = watch(islogin, _resolve);
    } else {
      _resolve(true);
    }

    //异步操作同步化，用来防止‘islogin’出现null
    await p;

    preventNull && preventNull();

    //已经登录就删除在IndexDB的整个播放列表
    if (islogin.value) {
      removeAllIndexDBDataPutToPlaylists(dexieInstance);
    } else {
      const musiclists = await indexDBAllLists();
      //@ts-ignore
      setImmdPlayLists(musiclists);
      //第一首歌
      firstPlayMusic();
    }

    //用来监听后续有没有登录用的
    const stopWatchLogin = watch(islogin, (il) => {
      if (il) {
        //一开始没登录，后来登录的也要删除在IndexDB的整个播放列表
        removeAllIndexDBDataPutToPlaylists(dexieInstance);
      }
    });

    return {
      stopWatchLogin,
    };
  }

  //异步操作同步化
  //等初始化完成
  //stopWatchLogin用来停止监听登录操作
  const { stopWatchLogin } = await init();

  //初始化howl
  const { how } = initMusicPlay(autoplay);

  const watchRoute = useWatchRoutePath();

  const routeWatchStop = watch(watchRoute, (path) => {
    const excludePaths = ["/video"];
    if (excludePaths.indexOf(path.path) > -1) {
      stop();
      changePlayIcon();
      playSeek.clear();
    }
  });

  how.on("play", () => {
    console.log("play");
    isplay.value = true;
  });

  how.on("end", () => {
    playSeek.clear();
    mmusicEndNext();
  });

  how.on("pause", () => {
    console.log("pause");
    isplay.value = false;
  });

  function mmusicEndNext() {
    const mitt = ctx.appContext.config.globalProperties["mittBus"];
    mitt.emit("musicend");

    if (!how.audio_loop) {
      nextMusic();
    }
  }

  async function nextMusic() {
    currIndex += 1;
    if (currIndex > palylists.value.length - 1) {
      currIndex = 0;
    }

    playSeek.clear();
    playtime.value = 0;
    playSrcSet(palylists.value[currIndex].id);
    play(isplay.value);
  }

  async function preveMusic() {
    currIndex -= 1;
    if (currIndex < 0) {
      currIndex = palylists.value.length - 1;
    }

    playSeek.clear();
    playtime.value = 0;
    playSrcSet(palylists.value[currIndex].id);
    play(isplay.value);
  }

  //看一下是不是在播放中
  function pairingPlayMid(mid: number) {
    if (mid === nowPlayingMid) return true;
    return false;
  }

  function createSrc(id: number) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }

  async function playSrcSet(id: number) {
    if (!id) return;

    //获取歌词
    //@ts-ignore
    await musicFoundation(findMusicLists(palylists.value, id));

    nowPlayingMid = id;
    how.setSrc(createSrc(id));
    saveLastSong(nowPlayingMid);
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
      // console.log(time);

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

    if (lrc) {
      const musicdetail = options.musicinfoRef.value;
      document.title = `${musicdetail.name}-${lrc}`;
    } else {
      console.warn(lycTimeList + ":" + lrc);
    }
  }

  async function play(status: boolean | undefined) {
    if (!isplay.value && !status) return;

    await nextTick();

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

  //统一写入到播放列表里
  function setImmdPlayLists(lists: musicDetail[] | musicDetail) {
    if (Array.isArray(lists)) {
      const ids = palylists.value.map((v) => v.id);
      const filterlists = lists.filter((vm) => ids.indexOf(vm.id) === -1);

      //@ts-ignore
      palylists.value.unshift(...filterlists);
    } else {
      //@ts-ignore
      const exist = existPlayerList(palylists.value, lists.id);
      if (!exist) {
        //@ts-ignore
        palylists.value.unshift(lists);
      }
    }

    store.commit("playlist/musiclists", palylists.value);
  }

  //判断是否在播放列表中

  function existPlayerList(lists: musicDetail[], id: number) {
    return lists.some((v) => v.id === id);
  }

  function currentIndex(songinfo: musicDetail) {
    const index = palylists.value.findIndex((value) => value.id === songinfo.id);
    return (currIndex = index > -1 ? index : 0);
  }

  async function musicFoundation(musicdetail: musicDetail) {
    if (musicdetail !== options.musicinfoRef.value) {
      options.musicinfoRef.value = musicdetail;
    }

    const lyrics = await getLyrics(String(musicdetail.id));
    const lrc = lyrics.data.lrc.lyric;
    setmaplyrics(lrc);
  }

  //获取歌词
  function setmaplyrics(lrc: string) {
    lyclists = [];

    const lrcworker = new Worker("src/worker/lrc.js");

    lyricsmap.clear();
    lrcworker.onmessage = function ({ data }) {
      if (data === "close") {
        lrcworker.terminate();
        store.commit("playlist/setLyrics", lyclists);
      } else {
        lyricsmap.set(data.showtime, data.lrc);
        const group = data.group;
        lyclists.push(lyric(group));
      }
    };

    lrcworker.postMessage(lrc);
  }

  window.addEventListener("unload", how.unWindowHowler.bind(how), false);

  function removeAllIndexDBDataPutToPlaylists(dexieInstance: any) {
    stopMusicLists && stopMusicLists();

    //清空播放列表
    palylists.value = [];

    //删除indexDB里的全部数据
    dexieInstance.tableDelete();
    //获取登录用户的播放队列
    const musiclists = computed<musicDetail[]>(store.getters["playlist/getMusiclists"]);

    //在初始化前
    stopMusicLists = watchEffect(() => {
      if (musiclists.value.length > 0) {
        palylists.value = [];
        setImmdPlayLists(musiclists.value);
        //第一首歌
        firstPlayMusic();
      }
    });
  }

  function firstPlayMusic() {
    if (initfirstmusic) return;
    const mid = localSvaeLastSong();

    //并在初始化后第一首歌曲
    //@ts-ignore
    let first =
      mid > 0 && !!mid
        ? findMusicLists(palylists.value as unknown as musicDetail[], Number(mid))
        : firstSong(palylists.value as unknown as musicDetail[]);

    if (!first) {
      first = firstSong(palylists.value as unknown as musicDetail[]);
    }

    options.musicinfoRef.value = first;

    palylists.value.length > 0 && playSrcSet(first.id);
    initfirstmusic = true;

    currentIndex(first);
  }

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
    nextMusic,
    preveMusic,
    playSrcSet,
    pairingPlayMid,
    routeWatchStop,
    stopWatchLogin,
    setImmdPlayLists,
    filterDurationTime,
    loop: how.set_loop,
    initCurrentIndex: currentIndex,
    findMusicLists: findMusicLists.bind(null, palylists.value),
    existPlayerList: existPlayerList.bind(null, palylists.value),
  };
};

export default Howl;
