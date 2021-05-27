import setting from '@src/config'

export function createPageGuard(router) {
  const loadedPageMap = new Map()

  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path)

    return true
  })

  router.afterEach((to) => {
    if (setting.keep_alive && !to.meta.ignoreKeepAlive) {
      loadedPageMap.set(to.path, true)
    }
  })
}
