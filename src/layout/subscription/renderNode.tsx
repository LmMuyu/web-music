import { createApp, Ref } from "vue";
import { RouterLink } from "vue-router";
import router from "../../routes";
import { isType } from "../../utils/methods";

interface PropsOrNodeLists {
  props: Record<string, any>;
  slot?: null;
  options?: {};
}

const ifIdkey = (props) => (props.uid !== -1 ? "uid" : props.id ? "id" : undefined);

export function headerRouterLink(
  propsOrNodeLists,
  slotOrIsArr: null | boolean,
  options = {}
): () => JSX.Element {
  const slot = slotOrIsArr ? slotOrIsArr : null;
  const isArr = slotOrIsArr && isType(slotOrIsArr) !== "Object" ? true : false;
  let curKeyIndex = 0;

  const routerLinkSpan = (props, slot, options) => {
    const idkey = ifIdkey(props);

    return (
      <span class="hover relative" key={props["id"] || props["uid"] || curKeyIndex++}>
        <RouterLink
          style={{ color: "#74b9ff", ...props.style }}
          class={`cursor-pointer ${props.class}`}
          to={{
            path: idkey === "uid" ? "/user/home" : "/playlist",
            query: { [idkey]: props[idkey] },
          }}
          //@ts-ignore
          target={options?.target ?? ""}
        >
          {slot ? slot : props.nickname}
        </RouterLink>
      </span>
    );
  };

  const renderModule = isArr ? (
    <div class={"flex items-center"}>
      {(propsOrNodeLists as PropsOrNodeLists[]).map((propsNode) =>
        routerLinkSpan(new parsePropOrLists(propsNode.props), propsNode.slot, propsNode.options)
      )}
    </div>
  ) : (
    routerLinkSpan(propsOrNodeLists, slot, options)
  );

  return () => renderModule;
}

class parsePropOrLists {
  id: number;
  uid: number;
  class: string;
  nickname: string;
  style: Record<string, string>;
  constructor(props) {
    this.id = props?.id ?? -1;
    this.uid = props?.userinfo?.userId ?? -1;
    this.nickname = (props?.nickname || props?.userinfo?.nickname) ?? "";
    this.class = props?.class ?? "";
    this.style = props?.style ?? {};
  }
}

export function routerLinkRender(
  el: Ref<HTMLElement>,
  propsOrNodeLists: PropsOrNodeLists[] | Record<string, any>,
  slot?: null | {},
  options?: null | {}
);
export function routerLinkRender(
  el: Ref<HTMLElement>,
  propsOrNodeLists: Record<string, any>,
  slot?: null,
  options?: {}
) {
  const isArr = Array.isArray(propsOrNodeLists);
  const props = (!isArr && propsOrNodeLists) || {};

  const app = createApp(
    isArr
      ? headerRouterLink(propsOrNodeLists, isArr)
      : headerRouterLink(new parsePropOrLists(props), slot, options)
  );

  app.use(router);

  if (el.value) {
    app.mount(el.value);
  } else {
    console.error(el.value + `:元素为空，无法挂载`);
  }
}
