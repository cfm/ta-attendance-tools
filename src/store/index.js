import Vue from 'vue'
import Vuex from 'vuex'

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
  }
})
