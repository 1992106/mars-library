import { customRef } from 'vue'

/**
 * @description: 使用自定义 ref 实现 debounce （原生input比较适合用）
 * @param {Any} 初始值
 * @param {Number} 延迟时间，默认200毫秒
 * @returns 返回一个响应式且可变的 ref 对象，并对其依赖项跟踪和更新触发进行显式控制
 * @example
 * <a-input :defaultValue="text" @input="text = $event.target.value" />
 * <input v-model="text" />
 */
const useDebounceRef = (value: any, delay = 200) => {
  let timer: number | undefined
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        value = newValue
        trigger()
      }, delay)
    }
  }))
}

export default useDebounceRef
