import { onMounted, reactive, toRefs } from 'vue'
import { request } from '@/utils/axios'

export function useRequest(url, params, option) {
  const { method = 'post', manual = false } = option

  const state = reactive({
    data: null,
    loading: false,
    error: null
  })

  const run = async () => {
    state.loading = true
    try {
      const res = await request(url, params, method)
      state.data = res.data
    } catch (e) {
      state.error = e
    } finally {
      state.loading = false
    }
  }

  onMounted(() => {
    !manual && run()
  })

  return {
    run,
    ...toRefs(state)
  }
}
