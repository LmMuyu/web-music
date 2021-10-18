interface trackOptions {
  direction: "vertical" | "parallel";
  viewportFollow?: boolean;
}

type Track = string | HTMLElement | null;

export function useSlidingTrack(track: Track, options: trackOptions) {
  let direction = options.direction || "parallel"; //vertical
  const viewportFollow =
    typeof options.viewportFollow === "undefined" ? true : false;

  let root: HTMLElement | null = null;
  let initTran = false;
  let ElChildren: Element[] = [];
  let initCompIndex = false;
  let index = 0;
  let initPos = false;
  let pre = null;
  let _track: Track = track;
  const elPos = {};

  const changeTransform = (el: HTMLElement, { x, y, scale }) => {
    return new Promise((resolve) => {
      if (!(el instanceof HTMLElement)) return resolve(true);

      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.transform =
        direction === "vertical"
          ? `scale(${1},${scale})`
          : `scale(${scale},${1})`;

      // setViewPort(y);

      resolve(true);
    });
  };

  const computedScale = (el, width, height) => {
    if (!pre) pre = el;

    const index_key = pre.index_key;
    const rect = pre === el ? { width, height } : elPos[index_key];
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

  const transitionOffset = async (e, backing?: Function) => {
    !initCompIndex && initElIndex(ElChildren);

    let tarel = isEl(e) ? e : e.target;

    tarel = getCorrespondElement(tarel);

    if (pre === tarel) return;

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

      //初始化无需过渡动画
      if (initTran) {
        initTransition(scroll_track);
      } else {
        //初始化完成，下次启动过渡动画
        initTran = true;
      }

      const wayto = direction === "vertical";
      await changeTransform(scroll_track, {
        scale,
        x: wayto ? 0 : x,
        y: wayto ? y : 0,
      });

      backing && backing.call(null); //回调函数
    }
  };

  const computedRect = (value: string) =>
    Math.ceil(Math.sqrt(Math.ceil(parseFloat(value))));

  function getBoundingClientRect(el: HTMLElement) {
    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = el;

    const compStyle = window.getComputedStyle(el);

    return {
      x: offsetLeft - computedRect(compStyle.paddingLeft),
      y: offsetTop - computedRect(compStyle.paddingTop),
      width: offsetWidth - computedRect(compStyle.paddingLeft),
      height: offsetHeight - computedRect(compStyle.paddingTop),
    };
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

      return "";
    }
  }

  function initTrackPos(elTag, defaultPos = 1) {
    if (initPos) return;
    let target = elTag;

    if (target instanceof HTMLElement) {
      root = target;
      ElChildren = Array.from(target.children);

      transitionOffset(target.children[defaultPos]);
      return;
    }

    target = getDocumentEl(target);

    if (target) {
      root = target;
      ElChildren = Array.from(target.children);
      transitionOffset(target.children[defaultPos]);
      initPos = true;
    } else {
      throw new Error("无法找到对应元素");
    }
  }

  function initTransition(el) {
    el.style.transitionProperty = "all";
    el.style.transitionDuration = "0.5s";
    el.style.transitionTimingFunction = "ease-out";
    el.style.transformOrigin = "center";
  }

  function initElIndex(children: any[]) {
    children.forEach((el, i) => (el.comp_index = i));
    initCompIndex = true;
  }

  function getCorrespondElement(el: HTMLElement) {
    let target = el;

    //@ts-ignore
    while (!target.comp_index && target !== null) {
      target = target.parentElement;
    }

    return target ?? el;
  }

  function getSliderTrack(elTag: any) {
    if (elTag instanceof HTMLElement && !_track) {
      _track = elTag;

      return;
    }

    return (_track = getDocumentEl(elTag));
  }

  function setViewPort(pos: number) {
    if (viewportFollow) {
      root.scrollTop = pos;
    }
  }

  const getElement = (elTag) => document.querySelector(elTag);
  const isEl = (el) => el instanceof HTMLElement;

  return {
    initTrackPos,
    transitionOffset,
    getSliderTrack,
  };
}
