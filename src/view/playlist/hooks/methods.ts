import { distance, gainValue, lyricNodeRect } from "./data";
import type { MatchItem } from "../type";
import { promptbox } from "../../../components/promptBox";
import { Ref } from "@vue/reactivity";

export function conversionItem(matchItem: MatchItem) {
  const timeArr = (matchItem.playTime as string).split(":");
  const playTime = Number(timeArr[0]) * 60 + parseInt(timeArr[1]);

  return {
    lyc: matchItem.lyc,
    playTime,
    node: null,
  };
}

const position = {
  y: 0,
};

const point = {
  y: 0,
};

function _setScrollHeight(scrollH: number) {
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

  const scrollH = el.scrollHeight - el.offsetHeight;
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
