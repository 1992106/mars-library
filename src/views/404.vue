<template>
  <Result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <Button type="primary" @click="backToHome">返回首页</Button>
    </template>
  </Result>
</template>

<script>
import { defineComponent } from 'vue'
import { Result, Button } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: '404',
  components: { Result, Button },
  setup() {
    const router = useRouter()

    const backToHome = () => {
      router.push('/index')
    }

    return {
      backToHome
    }
  }
})
</script>
