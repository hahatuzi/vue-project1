const state = {
  sidebar: {
    opened: true,
    withoutAnimate: false
  }
}
const mutations = {
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  }
}
const actions = {
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  }
}
export default {
  state,
  mutations,
  actions
}
