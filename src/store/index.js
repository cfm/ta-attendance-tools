import Vue from 'vue';
import Vuex from 'vuex';

import vuexLocal from '@/plugins/vuex-persist';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    memberList: [],
    presentList: [],
    operationIsInProgress: false,
  },
  mutations: {
    replaceMemberList(state, memberList) {
      state.memberList = memberList;
    },
    replacePresentList(state, presentList) {
      state.presentList = presentList;
    },
    startOperation(state) {
      state.operationIsInProgress = true;
    },
    },
    finishOperation(state) {
      state.operationIsInProgress = false;
    },
  },
  modules: {},

  plugins: [vuexLocal.plugin],
});
