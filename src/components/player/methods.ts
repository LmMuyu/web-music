import { ComponentInternalInstance, ref, Ref, watch } from "vue";
import dexieInstance from "../../common/dexie";
import store from "../../store";
import { musicDetail } from "../../utils/musicDetail";
import { useLocalStorage } from "../../utils/useLocalStorage";

const dexie = dexieInstance();

export async function sliderstyle() {
  try {
    const boxSlider = document.querySelector(".audio_slider");
    const sliderBtn = boxSlider.querySelector(".el-slider__button") as HTMLElement;
    const sliderRunway = boxSlider.querySelector(".el-slider__runway") as HTMLElement;
    const sliderBar = boxSlider.querySelector(".el-slider__bar") as HTMLElement;

    sliderBtn.style.cssText = `
      width:15px;
      height:15px;
     `;
    sliderRunway.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
      width: 100%;
    `;
    sliderBar.style.cssText = `
    height: 100%;
    width: inherit;
  `;
  } catch (error) {
    console.log(error);
  }
}

export function musicPlayEndZero(ctx: ComponentInternalInstance, mintime: Ref<number>) {
  //@ts-ignore
  ctx.appContext.config.globalProperties["mittBus"].on("audioend", () => {
    mintime.value = 0;
  });
}

export async function setIndexDBAAllDataToHowlLists(
  unshitfMusicLists: (lists: any[] | any) => void,
  watchMusics: () => any
) {
  const allCollectionData = await (await dexie).getAllSong();
  const songlists = allCollectionData.map((musicDetailData) => musicDetailData.songinfo);

  const firstSong = await indexDBRecentlyPlayMusic();

  if (!firstSong) {
    throw new Error("firstSong:null");
  }

  store.commit("playlist/setSongId", firstSong.id); //将第一首歌曲id写入stroe
  const splicelists = spliceMusicLits(songlists, firstSong);
  unshitfMusicLists(splicelists);
  watchMusics(); //开启watchEffect来监听后续写入播放数组里面的音乐信息
  unshitfMusicLists(firstSong);
}

async function indexDBRecentlyPlayMusic(): Promise<musicDetail | null> {
  const firstsong = await (await dexie).first(); //返回indexDB第一个音乐信息
  if (!firstsong) return null;

  useLocalStorage("recplaysong", JSON.stringify(firstsong.songinfo)); //写入主页面加载完成第一次音乐播放
  return firstsong.songinfo;
}

function spliceMusicLits(songlists: musicDetail[], first: musicDetail) {
  const indexDBMusicLists = songlists.slice(0);
  const index = songlists.slice(0).findIndex((song) => song.id === first.id);

  if (index === -1) {
    throw new Error("index:" + index);
  }

  const splicelists = indexDBMusicLists.splice(index, 1);
  if (!splicelists.length) {
    throw new Error("splice splicelists error:" + splicelists);
  }

  return indexDBMusicLists;
}

export function twoSearch(value: number, lyricsmap: Map<number, string>): [number, number] {
  const showTimelists = [...lyricsmap.keys()];

  let start = 0;
  let end = showTimelists.length - 1;
  let showtime = 0;
  let path = "";

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const listvalue = showTimelists[mid];

    if (listvalue === value) {
      return [value, mid];
    } else if (value > listvalue) {
      start = mid + 1;
      path = "start";
    } else {
      end = mid - 1;
      path = "end";
    }

    showtime = listvalue;
  }

  if (start === end) {
    if (path === "start") {
      return [showTimelists[start - 1], start - 1];
    } else {
      return [showTimelists[end + 1], end + 1];
    }
  }

  const index = showTimelists.indexOf(showtime);
  const timeindex = index > 0 ? index - 1 : index;
  return [showTimelists[timeindex], timeindex];
}

export function watchMusicinfo(watchSources: Ref<musicDetail>, maxTime: Ref<number>) {
  watch(watchSources, (value) => {
    if (value) {
      maxTime.value = value.dt;
    }
  });
}
