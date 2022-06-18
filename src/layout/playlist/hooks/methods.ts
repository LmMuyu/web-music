import { distance, gainValue, lyricNodeRect, clientHeight, index } from "./data";
import { promptbox } from "../../../components/promptBox";
import { Ref } from "@vue/reactivity";
import { userRecord } from "../../../api/playList";

import type { MatchItem, MatchItemList } from "../type";
import { useStorage } from "../../../utils/useStorage";
import { throttle } from "../../../utils/throttle";

export function conversionItem(matchItem: MatchItem): MatchItem {
  const str = String(matchItem.playTime);

  const timeArr = str.split(":");
  const playTime = Number(timeArr[0]) * 60 + parseInt(timeArr[1]);

  return {
    top: 0,
    playTime,
    node: null,
    indexId: 0,
    lyc: matchItem.lyc,
    originTime: str.slice(0, str.indexOf(".")),
  };
}

export function _setScrollHeight(scrollH: number) {
  lyricNodeRect.scrollShiHeight = scrollH;
}

export const lyricThrottle = throttle(lyricScroll, 16.6);

export function lyricScroll(event: Event) {
  const el = event.target as HTMLElement;
  const disty = el.scrollTop;
  _setScrollHeight(disty);
}

function Gain(ctx: AudioContext, gainvalue: Ref<number>): Promise<GainNode> {
  return new Promise((resolve) => {
    let gainNode = ctx.createGain();
    gainNode.gain.value = gainvalue.value;

    resolve(gainNode);
  });
}

async function bufferStream(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const GianNode = await Gain(ctx, gainValue);

  source.connect(GianNode);
  GianNode.connect(ctx.destination);

  return source;
}

export async function createAudioContext(buffer: ArrayBuffer) {
  const AudioCtx = new AudioContext();

  try {
    const bufferNode = await AudioCtx.decodeAudioData(buffer);
    return bufferStream(AudioCtx, bufferNode);
  } catch (e) {
    return promptbox({ title: "解码失败，请退去重试!" });
  }
}

let list: MatchItem[] = [];

export function lycHighlightPos(top: number, itemlist: MatchItemList, curNodePos: number) {
  const mid = clientHeight.value >>> 1;
  const lists = !!list.length ? list : (list = [...itemlist.value.values()]);

  if (top >= mid && curNodePos > index.value) {
    if (!index.value) index.value = curNodePos;
    const curIndex = curNodePos - index.value;

    const item = lists[curIndex];

    distance.value = item.top;
  }
}

export const Ability = () => {
  index.value = 0;
  distance.value = 0;
};

export async function recordData(record: string, recordData: Ref<Object>) {
  const recording = JSON.parse(record);

  const result = await userRecord(recording.userID, "0");

  recordData.value = result;
}

export async function recordStorage(recordInfoData: Ref<Object>) {
  const localData = await useStorage("userinfo", "", "local", {
    isGet: true,
  });

  if (!localData) return;

  await recordData(localData.value, recordInfoData);
}
