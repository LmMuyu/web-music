import axios from "axios";
import { Howl, Howler } from "howler";
import { getMusicDetail, getMusicUrl } from "../../api/playList";
import filterDate from "../../utils/filterDate";
import { musicDetail } from "../../utils/musicDetail";

export default class play {
  private howl: Howl;
  private loop: boolean;
  private src: string;
  private volume: number;
  private currIndex: number;
  private playing: boolean;
  dt: number;
  format: string[];
  autoplay: boolean;
  duration: string;
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
    this.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    await this._init();
  }

  splicingSrc(index: number) {
    const musicInfo = this.playlist[index];
    this.setSrc(musicInfo.mid);
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

  async getMusicDeatils(id: number) {
    const retData = await getMusicDetail(String(id));

    const musicDateail = retData.data?.songs[0] || retData.data;
    Promise.resolve(musicDateail.dt).then((dt) => {
      this.duration = this.filterDurationTime(dt);
      this.setLocalMusicDuration(dt);
      this.dt = dt;
    });

    const musicinfo = new musicDetail(musicDateail);
    this.playlist.unshift(Object.assign({}, musicinfo, { mid: id }));
    this.splicingSrc(0);

    return {
      isExistMaps: musicDateail.isExistMaps,
      musicinfo,
    };
  }

  filterDurationTime(dt: number) {
    return filterDate(dt);
  }

  get play_volume() {
    return this.volume;
  }
}
