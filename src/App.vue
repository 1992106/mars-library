<template>
  <ConfigProvider :locale="language">
    <RouterView />
  </ConfigProvider>
</template>

<script>
import { defineComponent } from 'vue'
import zhCn from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'

export default defineComponent({
  components: {
    ConfigProvider
  },
  setup() {
    const language = zhCn

    return { language }
  }
})
</script>

<style lang="scss">
#app {
  color: #2c3e50;
}
</style>
