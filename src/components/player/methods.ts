import { ComponentInternalInstance, computed, ref, Ref, watch, watchEffect } from "vue";
import { userRecord } from "../../api/playList";
import dexieInstance from "../../common/dexie";
import { conversionItem } from "../../layout/playlist/hooks/methods";
import { MatchItem } from "../../layout/playlist/type";
import store from "../../store";
import { musicDetail } from "../../utils/musicDetail";

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

export async function indexDBAllLists() {
  const dexie = await dexieInstance();
  return (await dexie.getAllSong()).map((indexdbsong) => indexdbsong.songinfo);
}

export function lyric(lyr: MatchItem): MatchItem {
  lyr.lyc = lyr.lyc.replace(/(\[.+\])?/, "");
  return conversionItem(lyr);
}
