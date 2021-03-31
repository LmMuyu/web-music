import { Ref } from "vue";

interface XY {
  x: number;
  y: number;
}

export default function getClientSite(client: Ref<XY>, login: Ref<XY>): XY {
  const site: XY = {
    x: 0,
    y: 0,
  };

  site.x = client.value.x - login.value.x;
  site.y = client.value.y - login.value.y;

  return site;
}
