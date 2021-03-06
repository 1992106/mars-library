import { debounce, isFunction } from 'lodash'
import type { App } from 'vue'

/**
 * @description 防抖指令v-debounce
 * @param {number} wait 间隔时间（默认300毫秒，0代表马上执行)
 * @example
 *    1.<button v-debounce="function" />
 *    2.<button v-debounce:[argument]="function" />
 *    3.<button v-debounce="() => function(argument)" />
 *    4.<button v-debounce="function" :wait="400" />
 */
const setupDebounceDirective = (app: App) => {
  app.directive('debounce', (el, { value: fn, arg }, vnode): void => {
    const { wait = 300 } = vnode.props || {}
    if (!isFunction(fn)) {
      return console.error(el, 'v-debounce: 参数缺失, function不存在')
    }
    const handler = () => (arg ? fn(arg) : fn())
    if (wait) {
      el.onclick = debounce(handler, wait)
    } else {
      el.onclick = handler
    }
  })
}

export default setupDebounceDirective
