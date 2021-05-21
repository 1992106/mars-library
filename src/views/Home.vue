<template>
  <div class="page-content">
    123123
    <Button @click="go404">404</Button>
    <a-input v-model="value" />
  </div>
</template>

<script>
import { Button, Input } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Dashboard',
  components: { Button, [Input.name]: Input },
  setup() {
    console.log(11111, 'Dashboard')
    const router = useRouter()
    // const { proxy } = getCurrentInstance()
    const value = ref('')

    const go404 = () => {
      router.push('/404')
    }

    return {
      go404,
      value
    }
  }
})
</script>
