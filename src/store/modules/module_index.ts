export default class Index {
  isTags: boolean;
  mutations: any;
  constructor() {
    this.isTags = true;
    this.mutations = this.createMutations();
  }

  createMutations() {
    return {
      setTag(state, playlod) {
        state.isTags = playlod;
      },
    };
  }
}
