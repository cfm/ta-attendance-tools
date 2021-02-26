import Vue from 'vue'
import Vuex from 'vuex'

import vuexLocal from '@/plugins/vuex-persist';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    memberList: [],
    presentList: [],
  },
  mutations: {
    replaceMemberList(state, memberList) {
      state.memberList = memberList;
    },
    replacePresentList(state, presentList) {
      state.presentList = presentList;
    },
  },
  modules: {
  },

  plugins: [
    vuexLocal.plugin,
  ]
})
