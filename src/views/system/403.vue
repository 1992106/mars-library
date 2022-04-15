<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="backToHome">返回首页</a-button>
    </template>
  </a-result>
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: '404',
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
