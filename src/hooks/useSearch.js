import { computed, ref, unref } from 'vue'
import { isFunction } from 'lodash'

export function useSearch(fn) {
  const searchParams = ref({})
  const handleSearch = ($event = {}) => {
    searchParams.value = $event
    if (isFunction(fn)) {
      fn(unref(params))
    }
  }

  const filterParams = ref({})
  const handleFilter = ($event = {}) => {
    filterParams.value = $event
    if (isFunction(fn)) {
      fn(unref(params))
    }
  }

  const params = computed(() => {
    return {
      ...unref(searchParams),
      ...unref(filterParams)
    }
  })

  return {
    params,
    handleSearch,
    handleFilter
  }
}
