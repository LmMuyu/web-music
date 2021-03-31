import { reactive, toRefs, Ref } from "@vue/reactivity";
import setTranslate from "./translate";
import clinetPosition from "./clinetPosition";

export type XY = Ref<Record<"x" | "y", number>>;

let loginEL: HTMLElement;

const loginFrameSite = {
  ...toRefs(
    reactive({
      client: {
        x: 0,
        y: 0,
      },
      login: {
        x: 0,
        y: 0,
      },
      loginFramePosition: {
        x: 0,
        y: 0,
      },
    })
  ),
};

export function MouseDwon(el?: MouseEvent) {
  const { client, login, loginFramePosition } = loginFrameSite;
  loginEL = el?.target as HTMLElement;

  client.value.x = el?.clientX!;
  client.value.x = el?.clientX!;

  login.value.x = el?.offsetX!;
  login.value.y = el?.offsetY!;

  const { x, y } = clinetPosition(client, login);
  loginFramePosition.value.x = x;
  loginFramePosition.value.y = y;

  setTranslate(loginEL, loginFramePosition);
}

export function MouseMove(el:MouseEvent) {
  
}

export function MouseOut() {}
