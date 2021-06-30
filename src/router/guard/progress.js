import setting from '@/src/config'
import nProgress from 'nprogress'

export const createProgressGuard = router => {
  router.beforeEach(to => {
    if (to.meta.loaded) return true
    if (setting.header_progress) {
      nProgress.start()
    }
    return true
  })

  router.afterEach(() => {
    if (setting.header_progress) {
      nProgress.done()
    }
    return true
  })
}
