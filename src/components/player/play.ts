import { Howl, Howler } from "howler";
import { OPTIONS } from "./type";

type Event =
  | "pause"
  | "play"
  | "stop"
  | "end"
  | "mute"
  | "volume"
  | "rate"
  | "seek"
  | "fade"
  | "unlock";

type KeXuan<T> = { [K in keyof T]?: T[K] };

interface HowlEvent {
  event: Event;
  fn: (...arg: any) => void;
}

function ifRate(rate: string) {
  const count = Number(rate.substring(0, rate.indexOf(".")));
  if (count < 0.5 || count > 4) {
    return 1;
  }

  return count;
}

class ViceHowl {
  protected bindEnvet(howl: Howl, event: HowlEvent) {
    howl.on(event.event, event.fn);
  }
}

export default class Play extends ViceHowl {
  private howl: Howl;
  private loop: boolean;
  private src: string;
  private volume: number;
  private options: OPTIONS;
  private ismute: boolean;
  private format: string[];
  private setaction: boolean;
  private ons: HowlEvent[];
  dt: number;
  autoplay: boolean;
  duration: string;
  playing: boolean;

  constructor(options?: OPTIONS & KeXuan<Pick<Play, "autoplay">>) {
    super();
    this.howl = null;
    this.src = "";
    this.loop = false;
    this.volume = 0.5;
    this.format = ["mp3", "flac"];
    this.autoplay = options.autoplay;
    this.options = options;
    this.ismute = options.mute ?? false;
    this.playing = false;
    this.setaction = false;
    this.ons = [];
  }

  private unmountHow() {
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }
  }

  private createHowler() {
    Howler.unload();
    const { loop, src, volume, format, autoplay } = this;

    this.unmountHow();

    this.howl = new Howl({
      src,
      loop,
      format,
      volume,
      autoplay,
      html5: true,
    });

    this.ons.forEach((v) => this.bindEnvet(this.howl, v));

    if (autoplay) {
      this.play();
      this.checkAudioIsPlay();
    }
  }

  async init() {
    if (!this.setaction) {
      this.setActionHandler();
      this.setaction = true;
    }
    this.createHowler();
  }

  checkAudioIsPlay() {
    if (!this.howl.playing()) {
      this.playing = false;
      //@ts-ignore
      this.onPlay(false);
    } else {
      this.playing = true;
    }
  }

  play() {
    if (this.howl.playing()) return true;
    this.playing = true;
    this.howl.play();
  }

  stop() {
    if (!this.howl?.playing() ?? true) return true;
    this.playing = false;
    this.howl.stop();
  }

  pause() {
    if (!this.howl.playing()) return true;
    this.playing = false;
    this.howl.pause();
  }

  set_volume(value: number) {
    if (value && (value >= 0 || value <= 1)) {
      this.howl.volume(value);
      this.volume = value;
    }

    return this.volume;
  }

  set_loop(loop: boolean) {
    this.howl.loop(loop);
  }

  time_seek() {
    if (this.howl.playing()) {
      let time_seek = this.howl.seek();
      window.localStorage.setItem("audio_play_time", JSON.stringify(time_seek));
      return time_seek;
    }
  }

  set_seek(pos: number) {
    return this.howl.seek(pos);
  }

  mute() {
    const ismute = (this.ismute = !this.ismute);
    if (this.howl.playing()) {
      this.howl.mute(ismute);
    }
  }

  rate(rate: string) {
    const numRate = ifRate(rate);

    this.howl.rate(numRate);
  }

  unWindowHowler() {
    try {
      Howler.unload();
      this.howl.unload();
      this.howl = null;
    } catch (error) {
      console.log(error);
    }
  }

  offHookMethods(howl: Howl) {
    howl.off();
  }

  async setSrc(src: string) {
    this.src = src;
    await this.init();
  }

  setLocalMusicDuration(duration) {
    localStorage.setItem("duration", String(duration));
  }

  setActionHandler() {
    navigator.mediaSession.setActionHandler("seekbackward", (dateils) => {
      console.log(dateils);
    });

    navigator.mediaSession.setActionHandler("seekforward", (dateils) => {
      console.log(dateils);
    });

    navigator.mediaSession.setActionHandler("seekto", (dateils) => {
      console.log(dateils);
    });
  }

  on(event: Event, fn: (...arg: any) => void) {
    try {
      if (this.howl) {
        this.howl.on(event, fn);
        return;
      }

      this.ons.push({ event: event, fn });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get play_volume() {
    return this.volume;
  }

  get audio_loop() {
    return this.loop;
  }

  get how_playing() {
    if (this.howl) {
      return this.howl.playing();
    } else {
      return false;
    }
  }
}
