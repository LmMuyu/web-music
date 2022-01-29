import { ref } from "vue";
import { useStore } from "vuex";
import filterDate from "../../utils/filterDate";
import { useRefNegate } from "../../utils/useRefNegate";
import Play from "./Play";

interface SONGS {
  id: number;
}

interface HOWLOPTIONS {
  currentIndexBackFn: (index: number) => void;
}

// const islogin = useStore().getters["login/getIslogin"];

function filterDurationTime(dt: number) {
  return filterDate(dt);
}

function fetchServeBlobData(id: number): string {
  return "";
}

export default function Howl(id: number, songlists: SONGS[], options: HOWLOPTIONS) {
  let timeseek = null;
  let currIndex = 0;
  let autoplay = true;
  const { countRef: isplay, negate } = useRefNegate(autoplay);
  const playtime = ref(0);
  const how = new Play({
    on: {
      onPlay(soundid) {
        console.log(soundid);

        isplay.value = true;
      },
      onPlayerror,
      onStop: negate,
      onPause: negate,
    },
  });

  function onPlayerror() {}

  function createSrc(id) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  }

  function playSrcSet(index: number) {
    const { id } = songlists[index];
    // if (islogin) {
    //   how.setSrc(fetchServeBlobData(id));
    // } else {
    // }
    how.setSrc(createSrc(id));
    options?.currentIndexBackFn(index);
  }

  function nextMusic() {
    if (currIndex > songlists.length - 1) {
      currIndex = 0;
    } else {
      currIndex += 1;
    }

    playSrcSet(currIndex);
  }

  function preveMusic() {
    if (currIndex === 0) {
      currIndex = songlists.length - 1;
    } else {
      currIndex--;
    }

    playSrcSet(currIndex);
  }

  function playSeek() {
    if (timeseek !== null) return;

    timeseek = setInterval(() => {
      playtime.value = how.time_seek();
    }, 1000);

    //@ts-ignore
    playSeek.clear = function () {
      clearInterval(timeseek);
      timeseek = null;
    };

    return playtime;
  }

  const play = () => {
    how.play();
  };
  const stop = () => {
    how.stop();
  };
  const pause = () => {
    how.pause();
  };

  function init() {
    how.setSrc(createSrc(id));
  }

  init();

  return {
    isplay,
    play,
    stop,
    pause,
    playSeek,
    nextMusic,
    preveMusic,
    filterDurationTime,
  };
}
