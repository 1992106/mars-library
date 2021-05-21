const router = {
  state: {
    visitedRoutes: [],
    cachedTabList: []
  },
  mutations: {
    // 添加tab页
    addVisitedRoutes(state, route) {
      if (state.visitedRoutes.findIndex((r) => r.fullPath === route.fullPath) === -1) {
        state.visitedRoutes.push({ ...route })
      }
    },

    // 添加进keep-alive列表
    addCachedTabList(state, route) {
      if (!route.meta.ignoreKeepAlive && state.cachedTabList.findIndex((c) => c.fullPath === route.fullPath) === -1) {
        state.cachedTabList.push({ ...route })
      }
    },

    // 删除顶部tab页
    delVisitedRoutes(state, path) {
      const idx = state.visitedRoutes.findIndex((item) => item.fullPath === path)
      if (idx !== -1) {
        state.visitedRoutes.splice(idx, 1)
        const cachedIdx = state.cachedTabList.findIndex((item) => item.fullPath === path)
        if (cachedIdx !== -1) {
          state.cachedTabList.splice(cachedIdx, 1)
        }
      }
    },

    // 删除keep-alive列表中的一项
    delCachedTabList(state, path) {
      const cachedIdx = state.cachedTabList.findIndex((item) => item.fullPath === path)
      if (cachedIdx !== -1) {
        state.cachedTabList.splice(cachedIdx, 1)
      }
    }
  },

  actions: {
    // 添加tab页并添加keep-alive
    addVisitedRoutes({ commit }, route) {
      commit('addVisitedRoutes', route)
      commit('addCachedTabList', route)
    }
  }
}

export default router
