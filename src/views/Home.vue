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
        <Button @click="go({ name: 'About' })">关于我们</Button>
        <Button @click="go({ name: 'testHome', query: { d: 1 }, params: { username: 'eduardo' } })">测试首页</Button>
        <Button @click="go({ name: 'testHome', query: { d: 2 }, params: { username: 'eduardo2' } })">测试首页2</Button>
        <Button @click="go({ path: '/test/list/list1', params: { c: 1 } })">列表1</Button>
        <Button @click="go({ path: '/test/list/list2', query: { b: 1 } })">列表2</Button>
        <Button @click="go('/test/list/level3/level4?a=1')">列表</Button>
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
