import { unref } from 'vue'
import setting from '@/src/config'
import { useGo } from '@/hooks/useRouter'
import { isEmpty } from '@/utils'

const goToPage = route => {
  const go = useGo()
  const { name, params, query, path } = route

  if (isEmpty(params)) {
    go({ path, params }, true)
  } else if (!isEmpty(name)) {
    go({ name, params, query }, true)
  } else {
    console.warn(`参数缺失：router->【${path}】"name"缺失`)
  }
}

const routers = {
  state: {
    visitedRoutes: [],
    cachedTabList: []
  },
  mutations: {
    // 添加tab页
    addVisitedRoutes(state, route) {
      const targetIdx = state.visitedRoutes.findIndex(r => r.path === route.path)
      if (targetIdx === -1) {
        state.visitedRoutes.push(route)
      } else {
        state.visitedRoutes.splice(targetIdx, 1, route)
      }
    },

    // 添加进keep-alive列表
    addCachedTabList(state, route) {
      if (!route.meta.ignoreKeepAlive && state.cachedTabList.findIndex(c => c.fullPath === route.fullPath) === -1) {
        state.cachedTabList.push(route)
      }
    },

    // 删除顶部tab页
    delVisitedRoutes(state, { router, key }) {
      const tabLen = state.visitedRoutes.length
      // 始终保留一个tab
      if (tabLen > 1) {
        const { currentRoute } = router
        const idx = state.visitedRoutes.findIndex(item => item.path === key)
        const isCurrentTab = unref(currentRoute).path === key
        let target = {}

        // 如果关闭的是当前tab页
        if (isCurrentTab) {
          // 如果是最后一个tab页，则需要往前移一个tab
          if (idx === tabLen - 1) {
            target = state.visitedRoutes[idx - 1]
          } else {
            target = state.visitedRoutes[idx + 1]
          }
          goToPage(target)
        }
        state.visitedRoutes.splice(idx, 1)
      }
    },

    // 删除keep-alive列表中的一项
    delCachedTabList(state, path) {
      if (!state.cachedTabList?.length) return
      const cachedIdx = state.cachedTabList.findIndex(item => item.path === path)
      if (cachedIdx !== -1) {
        state.cachedTabList.splice(cachedIdx, 1)
      }
    },

    // 清除
    reset(state) {
      state.visitedRoutes = []
      state.cachedTabList = []
    }
  },

  actions: {
    // 添加tab页并添加keep-alive
    addVisitedRoutes({ commit }, route) {
      commit('addVisitedRoutes', route)
      if (setting.keep_alive) {
        commit('addCachedTabList', route)
      }
    },

    // 删除tab页
    delVisitedRoutes({ commit }, { router, key }) {
      commit('delVisitedRoutes', { router, key })
      commit('delCachedTabList', key)
    },

    goToVisitedPage({ state }, _path) {
      const target = state.visitedRoutes.find(item => item.path === _path)
      if (!target) return
      goToPage(target)
    }
  }
}

export default routers
