interface trackOptions {
  direction: "vertical" | "parallel"
}

type Track = string | HTMLElement | null

export function useSlidingTrack(track: Track, options: trackOptions) {
  let direction = options.direction || "parallel"; //vertical
  let initTran = false;
  let index = 0;
  let pre = null;
  let _track: Track = track
  const elPos = {};

  const setStyle = (el: HTMLElement, { x, y, scale }) => {
    if (!(el instanceof HTMLElement)) return;

    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.transform =
      direction === "vertical" ? `scale(${1},${1})` : `scale(${1},${1})`;
  };

  const computedScale = (el, width, height) => {
    if (!pre) pre = el;

    const rect = pre.getBoundingClientRect();
    let scale = 1;

    if (direction === "vertical" && el !== pre) {
      scale = height / rect.height;
      pre = el;
    } else if (direction === "parallel" && el !== pre) {
      scale = width / rect.width;
      pre = el;
    }

    return scale;
  };

  const transitionOffset = (e) => {
    const tarel = isEl(e) ? e : e.target;

    const { x, y, width, height } =
      elPos[tarel.index_key] ?? getBoundingClientRect(tarel);
    const scale = computedScale(tarel, width, height);

    const scroll_track = isEl(_track) ? _track : getElement(_track);

    if (scroll_track) {
      const index_key = tarel.index_key;

      if (!index_key) {
        const key = ++index;

        tarel.index_key = key;
        elPos[key] = {
          x,
          y,
          width,
          height,
        };
      }

      const dir = direction === "vertical";

      setStyle(scroll_track, {
        scale,
        x: dir ? 0 : x,
        y: dir ? y : 0,
      });

      if (initTran) {
        initTransition(scroll_track);
      } else {
        initTran = true;
      }
    }
  };


  function getBoundingClientRect(el: HTMLElement) {
    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = el
    console.log(window.getComputedStyle(el));

    return {
      x: offsetLeft,
      y: offsetTop,
      width: offsetWidth,
      height: offsetHeight
    }
  }

  function getDocumentEl(elTag) {
    if (elTag.startsWith(".") || elTag.startsWith("#")) {
      const target = getElement(elTag);
      return target;
    } else {
      const startsWith = [".", "#"];

      for (let i = 0; i < startsWith.length; i++) {
        const startTag = startsWith[i];
        const target = getElement(startTag + elTag);

        if (target) {
          return target;
        }
      }

      return new Error("无法找到对应元素");
    }
  }

  function initTrackPos(elTag, defaultPos = 0) {

    if (elTag instanceof HTMLElement) {
      transitionOffset(elTag.children[defaultPos]);
      return;
    }

    const target = getDocumentEl(elTag);
    transitionOffset(target.children[defaultPos]);
  }

  function initTransition(el) {
    el.style.transitionProperty = "all";
    el.style.transitionDuration = "0.5s";
    el.style.transitionTimingFunction = "ease-out";
    el.style.transformOrigin = "center";

    initTran = true;
  }

  function getSliderTrack(elTag: any) {
    if (elTag instanceof HTMLElement && !_track) {
      _track = elTag

      return
    }

    return _track = getDocumentEl(elTag)
  }

  const getElement = (elTag) => document.querySelector(elTag);
  const isEl = (el) => el instanceof HTMLElement;

  return {
    initTrackPos,
    transitionOffset,
    getSliderTrack
  };
}