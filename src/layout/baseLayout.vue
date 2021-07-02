<template>
  <Layout class="page-layout">
    <app-sider :collapsed="collapsed" />
    <Layout>
      <app-header v-model:collapsed="collapsed" />
      <MultiTabs />
      <Layout.Content class="page-content">
        <AppMain />
      </Layout.Content>
      <AppFooter />
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
.page-layout {
  height: 100vh;

  .page-content {
    height: 100%;
    background-color: $bg-color;
  }
}
</style>
