import { ref, watch } from 'vue'
import { isEmpty } from '@/src/utils'
import { isEqual } from 'lodash-es'

export default function useFilter(params, state) {
  const equal = ref(true) // 比较2个值是否相等
  const isEnter = ref(false) // 是否支持enter

  const onFilter = () => {
    const { $panel } = params
    const { option } = state
    if ($panel && option) {
      // TODO: 未知bug，手动设置
      option.checked = option._checked
      $panel?.confirmFilter(null)
    }
  }

  const onEnter = $event => {
    if (!isEmpty(state.option.data) && $event?.keyCode === 13) {
      isEnter.value = true
      onFilter()
    }
  }

  watch(
    () => params.$table.reactData.filterStore.visible,
    visible => {
      if (visible === false && !isEmpty(state.option.data) && !equal.value) {
        equal.value = true
        // 支持enter事件
        if (isEnter.value) return
        isEnter.value = false

        onFilter()
      }
    },
    { immediate: true }
  )

  watch(
    () => state.option.data,
    (data, prevData) => {
      equal.value = isEqual(data, prevData)
    },
    { immediate: true }
  )

  return {
    onFilter,
    onEnter
  }
}
