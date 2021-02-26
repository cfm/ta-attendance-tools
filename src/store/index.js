import Vue from 'vue'
import Vuex from 'vuex'

import vuexLocal from '@/plugins/vuex-persist';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    memberList: [],
  },
  mutations: {
    replaceMemberList(state, memberList) {
      state.memberList = memberList;
    }
  },
  modules: {
  },

  plugins: [
    vuexLocal.plugin,
  ]
})
