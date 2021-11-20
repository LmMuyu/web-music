import { Howl, Howler } from "howler";

export default class play {
  private howl: Howl;
  private loop: boolean;
  private src: string;
  private volume: number;
  private isduration: boolean;
  format: string[];
  autoplay: boolean;
  duration: number;
  lyrics: string[];
  playlist: any[];
  playing: boolean;
  playid: number | string;

  constructor() {
    this.howl = null;
    this.src = "";
    this.playid = 0;
    this.playlist = [];
    this.loop = false;
    this.volume = 0.5;
    this.format = ["mp3", "flac"];
    this.autoplay = true;
    this.lyrics = [];
    this.playing = false;

    Object.defineProperty(this, "howl", {
      enumerable: false,
    });
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

    this.howl.once("end", () => {});
    this.howl.once("play", () => {
      this.duration = this.paly_duration;
    });
  }

  async _init() {
    this.createHowler();
  }

  play() {
    if (this.howl.playing()) return;

    this.howl.play();
    this.playing = true;
  }

  _stop() {
    if (!this.howl.playing()) return;
    this.howl.stop();
    this.playing = true;
  }

  _volume(value: number) {
    if (value >= 0 || value <= 1) {
      this.howl.volume(value);
    }
  }

  _loop(loop: boolean) {
    this.howl.loop(loop);
  }

  _pause() {
    this.howl.pause();
    this.playing = false;
  }

  _seek(backcallFn: (time: number) => void) {
    setInterval(() => {
      if (this.playing) {
        const currTime = this.howl.seek();
        backcallFn(currTime);
        window.localStorage.setItem("audio_play_time", JSON.stringify(currTime));
      }
    }, 1000);
  }

  async setSrc(id: number) {
    this.src = `/music/song/media/outer/url?id=${id}`;
    await this._init();
  }

  get paly_duration() {
    if (this.isduration) return;
    this.isduration = true;

    return this.howl.duration();
  }
}
