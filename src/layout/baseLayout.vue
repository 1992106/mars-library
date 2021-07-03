<template>
  <Layout class="app-layout">
    <app-sider :collapsed="collapsed" />
    <Layout>
      <app-header v-model:collapsed="collapsed" />
      <MultiTabs />
      <Layout.Content class="app-content">
        <app-main />
      </Layout.Content>
      <app-footer />
    </Layout>
  </Layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Layout } from 'ant-design-vue'
import AppSider from './sider/index'
import AppHeader from './header'
import AppMain from './main/index.vue'
import MultiTabs from './multiTabs/index.vue'
import AppFooter from './footer'

export default defineComponent({
  name: 'BaseLayout',
  components: {
    Layout,
    'Layout.Content': Layout.Content,
    AppSider,
    AppHeader,
    MultiTabs,
    AppMain,
    AppFooter
  },
  setup() {
    const collapsed = ref(false)

    return {
      collapsed
    }
  }
})
</script>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;

  .app-content {
    overflow-y: auto;
    background-color: $bg-color;
  }
}
</style>
