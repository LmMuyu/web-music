import { Howl, Howler } from "howler";
import { OPTIONS } from "./type";

const ons = ["onPlayerror", "onPlay", "onStop", "onpause"];

function transformOptonsOn(options: OPTIONS) {
  if (!options.on) return;
  for (const onstr of ons) {
    if (!options.on[onstr] || typeof options.on[onstr] !== "function") {
      options.on[onstr] = () => {};
    }
  }

  return options;
}

export default class Play {
  private howl: Howl;
  private loop: boolean;
  private src: string;
  private volume: number;
  private options: OPTIONS;
  dt: number;
  format: string[];
  autoplay: boolean;
  duration: string;

  constructor(options?: OPTIONS) {
    this.howl = null;
    this.src = "";
    this.loop = false;
    this.volume = 0.5;
    this.format = ["mp3", "flac"];
    this.autoplay = true;
    this.options = transformOptonsOn(options);
  }

  createHowler() {
    Howler.unload();
    const { loop, src, volume, format, autoplay } = this;

    this.howl = new Howl({
      src,
      loop,
      format,
      volume,
      autoplay,
      html5: true,
    });

    this.addEvent(this.howl);
    autoplay && this.play();
  }

  async init() {
    this.setActionHandler();
    this.createHowler();
  }

  addEvent(howl: Howl) {
    ons.forEach((evevtname) =>
      howl.on(evevtname.substring(2).toLocaleLowerCase(), this.options[evevtname])
    );
  }

  play() {
    if (this.howl.playing()) return true;
    this.howl.play();
  }

  stop() {
    if (!this.howl.playing()) return true;
    this.howl.stop();
  }

  pause() {
    if (!this.howl.playing()) return true;
    this.howl.pause();
  }

  _volume(value: number) {
    if (value >= 0 || value <= 1) {
      this.howl.volume(value);
    }
  }

  _loop(loop: boolean) {
    this.howl.loop(loop);
  }

  time_seek() {
    if (this.howl.playing()) {
      const time_seek = this.howl.seek();
      window.localStorage.setItem("audio_play_time", JSON.stringify(time_seek));
      return time_seek;
    }
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

  get play_volume() {
    return this.volume;
  }
}
