import { computed, ref, unref } from 'vue'
import { isFunction } from 'lodash-es'

export function useSearch(fn) {
  const searchParams = ref({})
  const handleSearch = ($event = {}) => {
    searchParams.value = $event
    if (isFunction(fn)) {
      fn({ ...unref(paramsRef), page: 1 })
    }
  }

  const handleReset = () => {
    searchParams.value = {}
    if (isFunction(fn)) {
      fn({ page: 1 })
    }
  }

  const handleClear = ($event = {}) => {
    searchParams.value = $event
    if (isFunction(fn)) {
      fn({ ...unref(paramsRef), page: 1 })
    }
  }

  const filterParams = ref({})
  const handleFilter = $event => {
    const pagination = {}
    if ($event) {
      pagination.page = 1
      filterParams.value = $event
    }
    if (isFunction(fn)) {
      fn({ ...unref(paramsRef), ...pagination })
    }
  }

  const paramsRef = computed(() => {
    return {
      ...unref(searchParams),
      ...unref(filterParams)
    }
  })

  return {
    paramsRef,
    handleSearch,
    handleReset,
    handleClear,
    handleFilter
  }
}
