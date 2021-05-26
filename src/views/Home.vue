<template>
  <div class="page-content">
    <a-input v-model:value="username" />

    <Space>
      <Button @click="go404">404</Button>
      <Button :loading="loading" v-throttle="fetchData">Fetch Data</Button>
      <Button v-debounce:[username]="testDebounce" :wait="300">Debounce</Button>
    </Space>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Button, Input, Space } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import request from '@src/utils/request'

export default defineComponent({
  name: 'Dashboard',
  components: { Button, [Input.name]: Input, Space },
  setup() {
    const username = ref('')
    const loading = ref(false)
    const router = useRouter()
    const direction = ref('right')
    const pinPadding = ref(200)
    // const { proxy } = getCurrentInstance()

    const go404 = () => {
      router.push('/404')
    }

    const testDebounce = (type) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxx', type, 888)
    }

    const fetchData = async () => {
      loading.value = true
      const res = await request.post('/erp/micro_app/edit', {
        id: '12312312aa78349827387429',
        name: 'mars'
      })
      loading.value = false
      console.log(res, 'request', 111111)
    }

    // Object.prototype.toString.call(fetchData) === "[object Function]"
    // lodash typeof fetchData !== null && ([object Object] || [object function])

    return {
      username,
      direction,
      pinPadding,
      loading,
      go404,
      fetchData,
      testDebounce
    }
  }
})
</script>
