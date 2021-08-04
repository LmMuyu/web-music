import { postLinke } from "../../../../api/subscription";
import { debounce } from "../../../../utils/debounce";

const returnDebounce = debounce(postLinke, 200);

export async function onLinke(event: any, successFn: Function, islinke: 0 | 1) {
  returnDebounce([event.info.threadId, islinke, successFn]);
}
