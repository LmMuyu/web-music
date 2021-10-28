// import { useStore } from "vuex";
// import { getRecord } from "../../../../../../api/playList";
// import { getStore } from "../../../../../../utils/getStore";

async function createTemplate() {
  // const { state } = getStore();
  // if (state.userInfo) {
  //   // const record = await getRecord();
  //   // console.log(record);
  // } else {
  //   return sessionStorage.getItem("playHistory");
  // }
}

export function historyList() {
  return new Array(10).fill(1).map((v, i) => <span key={i}>{i}</span>);
}
