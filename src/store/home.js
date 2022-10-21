import mockRequire from '@/utils/mockRequire.js'
const state = {
  list: {}
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}
const actions = {
  async getData({ commit }) {
    const result = await mockRequire.get('/home/list')
    if (result.code === 20000) {
      commit('GETDATA', result.data)
    }
  }
}
const getters = {
  activityRate(state) {
    return state.list.activityRate || 0
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
