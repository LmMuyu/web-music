import { distance, gainValue, index } from "./data";
import { promptbox } from "../../../components/promptBox";
import { Ref } from "@vue/reactivity";
import { userRecord } from "../../../api/playList";
import store from "../../../store";

import type { MatchItem } from "../type";

export function conversionItem(matchItem: MatchItem): MatchItem {
  const str = String(matchItem.playTime);

  const timeArr = str.split(":");
  const playTime = Number(timeArr[0]) * 60 + parseInt(timeArr[1]);

  return {
    playTime,
    indexId: 0,
    lyc: matchItem.lyc,
    originTime: str.slice(0, str.indexOf(".")),
  };
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

export const Ability = () => {
  index.value = 0;
  distance.value = 0;
};

export async function recordData(record: string, recordData: Ref<Object>) {
  const recording = JSON.parse(record);

  const result = await userRecord(recording.userID, "0");

  recordData.value = result;
}

class sendAfterCloseDialogMitt {
  private handle: (sourcess: boolean) => void;
  private MITT_KEY: string;
  private visilbity: Ref<boolean> | undefined;
  constructor() {
    //sourcess为true是取消 false为打开
    this.handle = (sourcess: boolean) => {
      if (!sourcess) return;
      this.visilbity && (this.visilbity.value = false);
    };

    this.MITT_KEY = "SHOWDIALOG";
  }

  remove() {
    store.commit("removeMittKey", { key: this.MITT_KEY, removeHandle: this.handle });
  }

  on() {
    store.commit("addMittHandle", { key: this.MITT_KEY, fn: this.handle });
  }

  emit(value: boolean) {
    store.commit("runMittHandle", { key: this.MITT_KEY, value });
    this.remove();
  }

  map(v: Ref<boolean>) {
    this.visilbity = v;
  }
}

export const closeInputEditorMitt = new sendAfterCloseDialogMitt();
