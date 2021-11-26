import { Howl, Howler } from "howler";
import { getMusicDetail } from "../../api/playList";
import { musicDetail } from "../../utils/musicDetail";

export default class play {
  private howl: Howl;
  private loop: boolean;
  private src: string;
  private volume: number;
  private isduration: boolean;
  private currIndex: number;
  private playing: boolean;
  format: string[];
  autoplay: boolean;
  duration: number;
  lyrics: string[];
  playlist: any[];
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
    this.currIndex = 0;

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

    if (autoplay) {
      this.play();
    }

    this.howl.once("end", () => {});
    this.howl.once("play", () => {
      this.duration = this.paly_duration;
      this.setLocalMusicDuration(this.duration);
    });
  }

  async _init() {
    this.setActionHandler();
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

  next() {
    if (!!this.playlist[++this.currIndex] || (this.currIndex = 0)) {
      const play_id = this.playlist[this.currIndex + 1];
      this.setSrc(play_id);
    }
  }

  pre() {
    if (!!this.playlist[--this.currIndex] || (this.currIndex = this.playlist.length - 1)) {
      const play_id = this.playlist[this.currIndex];
      this.setSrc(play_id);
    }
  }

  async setSrc(id: number) {
    this.src = `/music/song/media/outer/url?id=${id}`;
    await this._init();
  }

  splicingSrc(index: number) {
    const musicInfo = this.playlist[index];
    this.setSrc(musicInfo.id);
  }

  writeMediaMeta() {}

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

  async getMusicDeatils(id: number) {
    const retData = await getMusicDetail(String(id));
    const musicDateail = retData.data?.data.songs[0] || retData.data;
    const musicinfo = new musicDetail(musicDateail);

    this.playlist.unshift(musicinfo);
    this.splicingSrc(0);

    return {
      isExistMaps: retData.isExistMaps,
      musicinfo,
    };
  }

  get paly_duration() {
    if (this.isduration) return;
    this.isduration = true;

    return this.howl.duration();
  }

  get play_volume() {
    return this.volume;
  }
}
