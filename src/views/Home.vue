<template>
  <div class="page-content">
    <a-input v-model:value="username" />
    <MyDatePicker></MyDatePicker>

    <Space>
      <Button @click="go404">404</Button>
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
import request from '@/utils/axios'
// import request from '@/utils/fetch'
import MyDatePicker from '@/src/components/DatePicker/DatePicker'

export default defineComponent({
  name: 'Dashboard',
  components: { Button, [Input.name]: Input, Space, MyDatePicker },
  setup() {
    const username = ref('')
    const loading = ref(false)
    const router = useRouter()
    // const { proxy } = getCurrentInstance()

    const go404 = () => {
      router.push('/404')
    }

    const go = params => {
      router.push(params)
    }

    const testDebounce = () => {}

    const fetchData = async () => {
      loading.value = true
      request
        .post('/mock/login', {
          id: '12312312aa78349827387429',
          name: 'mars'
        })
        .then(res => {
          console.log(res)
        })
      // request
      //   .post('/erp/micro_app/edit', {
      //     id: '12312312aa78349827387429',
      //     name: 'mars'
      //   })
      //   .then((res) => {
      //     console.log(res)
      //   })
      loading.value = false
    }

    return {
      username,
      loading,
      go404,
      fetchData,
      testDebounce,
      go
    }
  }
})
</script>
