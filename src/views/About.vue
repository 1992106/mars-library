<template>
  <div class="page-content">
    <h1>This is an about page</h1>
    <Input v-model:value="value" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Input } from 'ant-design-vue'

export default defineComponent({
  name: 'About',
  components: { Input },
  setup() {
    console.log(2222, 'About')
    // const store = useStore()
    const value = ref('')
    // store
    // const nickName = computed(() => store.state.user.userInfo.nickname)
    // const getNickName = computed(() => store.getters['user/nickname'])

    return {
      // nickName,
      // getNickName,
      value
    }
  }
})
</script>
