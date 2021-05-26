import setupDebounceDirective from './debounce'
import setupThrottleDirective from './throttle'

export function setupDirectives(app) {
  setupDebounceDirective(app)
  setupThrottleDirective(app)
  return app
}
