<template>
  <div class="page-content">
    <a-input v-model:value="username" />
    <MyDatePicker></MyDatePicker>

    <a-space>
      <a-button @click="go404">404</a-button>
      <a-button :loading="loading" v-throttle="fetchData">Fetch Data</a-button>
      <a-button v-debounce:[username]="testDebounce" :wait="300">Debounce</a-button>
    </a-space>
    <p>
      <a-space>
        <a-button @click="go({ name: 'home' })">首页</a-button>
        <a-button @click="go({ name: 'marsGrid' })">MarsGrid</a-button>
        <a-button @click="go({ path: '/list/vxeTable' })">VxeTable</a-button>
        <a-button @click="go({ name: 'marsTable' })">MarsTable</a-button>
        <a-button @click="go({ path: '/list/antTable' })">AntTable</a-button>
        <a-button @click="go('/list/antTable?a=1')">列表</a-button>
      </a-space>
    </p>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/axios'
// import request from '@/utils/fetch'
import MyDatePicker from '@/src/components/DatePicker/DatePicker'

export default defineComponent({
  name: 'Dashboard',
  components: { MyDatePicker },
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
