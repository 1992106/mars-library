<template>
  <div class="page-content">
    <a-input v-model:value="username" />
    <input v-model="text" />
    <p>value: {{ text }}</p>

    <Space>
      <Button @click="go404">404</Button>
      <Button @click="showValue('xx')">Input Value</Button>
      <Button :loading="loading" v-throttle="fetchData">Fetch Data</Button>
      <Button v-debounce:[username]="testDebounce" :wait="300">Debounce</Button>
    </Space>
    <p>
      <Space>
        <Button @click="go({ name: 'home' })">首页</Button>
        <Button @click="go({ name: 'marsGrid' })">MarsGrid</Button>
        <Button @click="go({ path: '/list/vxeTable' })">VxeTable</Button>
        <Button @click="go({ name: 'marsTable' })">MarsTable</Button>
        <Button @click="go({ path: '/list/antTable' })">AntTable</Button>
        <Button @click="go('/list/antTable?a=1')">列表</Button>
      </Space>
    </p>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Button, Input, Space } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useDebounceRef from '@src/hooks/debouncedRef'
import request from '@src/utils/request'

export default defineComponent({
  name: 'Dashboard',
  components: { Button, [Input.name]: Input, Space },
  setup() {
    const username = ref('')
    const loading = ref(false)
    const router = useRouter()
    const text = useDebounceRef('xxx')
    const direction = ref('right')
    const pinPadding = ref(200)
    // const { proxy } = getCurrentInstance()

    const go404 = () => {
      router.push('/404')
    }

    const go = (params) => {
      router.push(params)
    }

    const showValue = () => {
      text.value = '444'
    }

    const testDebounce = () => {}

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
      text,
      username,
      direction,
      pinPadding,
      loading,
      go404,
      showValue,
      fetchData,
      testDebounce,
      go
    }
  }
})
</script>
