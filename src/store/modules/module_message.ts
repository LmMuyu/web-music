import { Ref, ref, unref } from "vue";

import type { StoreOptions } from "vuex";

interface STATE {
  privateLetter: Ref<record[]>;
  closemark: Ref<boolean[]>;
}

type record = Record<string, any>;

function tidyMsgs(list: record[], letterList: record[]) {
  return list.map((v, index) => {
    return {
      ...v,
      totals: letterList[index].data.msgs,
    };
  });
}

class Message implements StoreOptions<record> {
  public namespaced: boolean;
  public actions: any;
  public mutations: any;
  public getters: any;

  constructor() {
    this.namespaced = true;
    this.actions = this.createActions();
    this.mutations = this.createMutations();
    this.getters = this.createGetters();
  }

  state(): STATE {
    return {
      privateLetter: ref([]),
      closemark: ref([false]),
    };
  }

  createMutations() {
    return {
      setPropleMessage(state: STATE, letterData: record[]) {
        if (letterData.length > 0) {
          unref(state.privateLetter).push(...letterData);
          unref(state.closemark)[0] = true;
        }
      },
    };
  }

  createActions() {
    return {};
  }

  createGetters() {
    return {
      retLetterList(state: STATE) {
        return state.privateLetter;
      },
    };
  }
}

export default Message;
