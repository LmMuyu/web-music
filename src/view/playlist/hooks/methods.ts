import { distance, gainValue, lyricNodeRect, clientHeight } from "./data";
import { promptbox } from "../../../components/promptBox";
import { reactive, Ref } from "@vue/reactivity";

import type { MatchItem } from "../type";

export function conversionItem(matchItem: MatchItem): MatchItem {
  const timeArr = String(matchItem.playTime).split(":");
  const playTime = Number(timeArr[0]) * 60 + parseInt(timeArr[1]);

  return {
    top: 0,
    playTime,
    node: null,
    lyc: matchItem.lyc,
  };
}

const position = { y: 0 };
const point = { y: 0 };
const height = reactive({
  scrollHeight: 0,
  offsetHeight: 0,
});

export function _setScrollHeight(scrollH: number) {
  lyricNodeRect.scrollHeight = scrollH;
}

function _mover(newY: number) {
  distance.value = newY;
  position.y = newY;
}

export function lyricScroll(event: Event) {
  const el = event.target as HTMLElement;
  const disty = el.scrollTop;

  const delety = disty - point.y;

  if (delety > 0 && disty < point.y) {
    return;
  }

  point.y = disty;

  const newY = point.y + delety;

  _mover(newY);

  if (!el.title) {
    height.offsetHeight = el.scrollHeight;
    height.scrollHeight = el.scrollHeight;
  }

  const scrollH = height.scrollHeight - height.offsetHeight;
  el.title || (el.title = "true");
  _setScrollHeight(scrollH);
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

export function lycHighlightPos(top: number) {
  const mid = clientHeight.value >>> 1;

  if (top >= mid) distance.value = top;
}
