import router from '../index.js'
import { createProgressGuard } from './progress'
import { createPageGuard } from './page'

const setupRouterGuard = () => {
  createPageGuard(router)
  createProgressGuard(router)
}

export default setupRouterGuard
